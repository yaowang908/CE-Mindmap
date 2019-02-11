import React, { Component, Fragment } from "react";

export default class Connection extends Component {
    constructor(props) {
        super(props);
        this.getMainNodeSpecs = this.getMainNodeSpecs.bind(this);
        this.getFirstLevelNodeSpecs = this.getFirstLevelNodeSpecs.bind(this);
        this.state={
            mainNodeSpecs : {},
            firstLevelNodeSpecs : [],
            SVGChildren: []
        };
    }

/**
 * 1. get mainNode position   ===>  getBBox or getClientRect
 *      1.everything main node get draged, pass in new position to refresh
 * 2. get mainNode left & right anchor point  ===> calculation
 * 3. connect level_1 nodes to mainNode ===> <Curve>
 */
    componentWillMount() {
        this.setState({
            SVGChildren: this.props.SVGChildren
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            SVGChildren: nextProps.SVGChildren ? nextProps.SVGChildren : this.state.SVGChildren
        });
    }

    getMainNodeSpecs() {
        let _mainNode = document.getElementById('node_1').getBoundingClientRect();
        return _mainNode;
    }

    getFirstLevelNodeSpecs() {
        let _firstLevelNodesSpecs = [];
        let _firstLevelNodes = this.state.SVGChildren.filter(node=>node.class === 'level_1');

        _firstLevelNodes.map(node=>{
            _firstLevelNodesSpecs.push({
                id: node.id,
                specs: document.getElementById(node.id).getBoundingClientRect()
            });
        });

        return _firstLevelNodesSpecs;
    }

    componentDidMount() {
        setTimeout(() => {//otherwise height and bottom will be rideculous big
            this.setState({
                mainNodeSpecs: this.getMainNodeSpecs(),
                firstLevelNodeSpecs: this.getFirstLevelNodeSpecs()
            });
        }, 0);   
    }

    componentWillUpdate() {
        setTimeout(() => {//otherwise height and bottom will be rideculous big
            this.setState({
                mainNodeSpecs: this.getMainNodeSpecs(),
                firstLevelNodeSpecs: this.getFirstLevelNodeSpecs()
            });
        }, 0);
    }

    render() {
        return(
            <svg id="connection" x="0" y="0">
                <Level_1_curve mainNodeSpecs={this.state.mainNodeSpecs}
                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Level_1_curve>
            </svg>
        );
    }
}

class Level_1_curve extends Component {
    constructor(props) {
        super(props);
        this.state={
            firstLevelNodeSpecs :[],
            mainNodeSpecs : {}
        }
    }

    componentWillMount() {
        this.setState({
            firstLevelNodeSpecs: this.props.firstLevelNodeSpecs,
            mainNodeSpecs: this.props.mainNodeSpecs
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            firstLevelNodeSpecs: nextProps.firstLevelNodeSpecs ? nextProps.firstLevelNodeSpecs : this.state.firstLevelNodeSpecs,
            mainNodeSpecs: nextProps.mainNodeSpecs ? nextProps.mainNodeSpecs : this.state.mainNodeSpecs
        });
    }

    render() {
        return(
            <Fragment>
                {   
                    this.state.firstLevelNodeSpecs.map(node=>{
                        if (this.state.mainNodeSpecs.left 
                            && (this.state.mainNodeSpecs.right < node.specs.left 
                                || node.specs.right < this.state.mainNodeSpecs.left    
                                )
                           ){//anchor point is on left or right border
                            //mainNodeSpecs get passed in after parent node componentDidMount, 
                            //so there is two statement, if(this.state.mainNodeSpecs.left) ruled out the other 
                                /**
                                 *          --------
                                 *         |        |
                                 *          --------   \
                                 *                      \  
                                 *                       \    --------
                                 *                        \  |        |
                                 *                            --------
                                 */
                            if(node.specs.left > this.state.mainNodeSpecs.right) {
                                //node is to the right of main node
                                return <Curve leftEnd={[this.state.mainNodeSpecs.right, (this.state.mainNodeSpecs.height / 2 + this.state.mainNodeSpecs.top)]}
                                    rightEnd={[node.specs.left, (node.specs.height/2+node.specs.top)]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.state.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;
                            } else if(node.specs.right < this.state.mainNodeSpecs.left) {
                                //node is to the left of main node
                                return <Curve leftEnd={[node.specs.right, (node.specs.height/2+node.specs.top)]}
                                    rightEnd={[this.state.mainNodeSpecs.left, (this.state.mainNodeSpecs.height / 2 + this.state.mainNodeSpecs.top)]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.state.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;
                            }
                            
                        } else if (this.state.mainNodeSpecs.left
                                && (this.state.mainNodeSpecs.right >= node.specs.left
                                    && node.specs.right >= this.state.mainNodeSpecs.left
                                    )
                                ){//anchor points are on top or bottom border of the two nodes
                                    /**
                                     *          --------
                                     *         |        |
                                     *          --------
                                     *                  \
                                     *               --------
                                     *              |        |
                                     *               --------
                                     */
                                if(this.state.mainNodeSpecs.top>node.specs.bottom) {
                                    //node is to the top of main node
                                    return <Curve leftEnd={[(node.specs.left+node.specs.width/2), node.specs.bottom]}
                                        rightEnd={[(this.state.mainNodeSpecs.left + this.state.mainNodeSpecs.width/2), this.state.mainNodeSpecs.top]}
                                        start_node={'node_1'}
                                        end_node={node.id}
                                        mainNodeSpecs={this.state.mainNodeSpecs}
                                        firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;

                                } else if(this.state.mainNodeSpecs.bottom<node.specs.top) {
                                    //node is to the bottom of main node
                                    return <Curve leftEnd={[(this.state.mainNodeSpecs.left + this.state.mainNodeSpecs.width / 2), this.state.mainNodeSpecs.bottom]}
                                        rightEnd={[(node.specs.left + node.specs.width / 2), node.specs.top]}
                                        start_node={'node_1'}
                                        end_node={node.id}
                                        mainNodeSpecs={this.state.mainNodeSpecs}
                                        firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;
                                }
                        } else {
                            // haven't passed in mainNode specs
                        }
                        
                    })
                }
            </Fragment>
        );
    }
}

class Curve extends Component {
    constructor(props) {
        super(props);
        this.curve = this.curve.bind(this);
        this.state = {
            leftEnd: [0,0],
            rightEnd: [100,100],
            fillColor: 'none',
            strokeColor: '#07a',
            strokeWidth: '5'
        }
    }
    componentWillMount() {
        this.setState({
            leftEnd: this.props.leftEnd ? this.props.leftEnd:this.state.leftEnd,
            rightEnd: this.props.rightEnd ? this.props.rightEnd : this.state.rightEnd
        });
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            leftEnd: nextProps.leftEnd ? nextProps.leftEnd : this.state.leftEnd,
            rightEnd: nextProps.rightEnd ? nextProps.rightEnd : this.state.rightEnd
        });
    }

    /**
     * props.leftEnd = [x,y]
     * props.rightEnd = [x,y]
     */
    curve() {
        let direction = this.state.leftEnd[1] < this.state.rightEnd[1] ? 'up':(this.state.leftEnd[1] === this.state.rightEnd[1]?'flat':'down');
        //up flat down
        if(direction !== 'flat') {
            // up or down
            let midPoint = [(this.state.leftEnd[0]+this.state.rightEnd[0])/2,
                            (this.state.leftEnd[1]+this.state.rightEnd[1])/2]
            let firstAnchorPoint = [midPoint[0],this.state.leftEnd[1]];
            let secondAnchorPoint = [midPoint[0],this.state.rightEnd[1]];


            return <path d={`
                                M ${this.state.leftEnd[0]},${this.state.leftEnd[1]}
                                Q ${firstAnchorPoint[0]},${firstAnchorPoint[1]}
                                    ${midPoint[0]},${midPoint[1]}
                                T ${this.state.rightEnd[0]},${this.state.rightEnd[1]}
                            `}
                            fill={this.state.fillColor}
                            stroke={this.state.strokeColor}
                            strokeWidth={this.state.strokeWidth}
                            data-start_node={this.props.start_node}
                            data-end_node={this.props.end_node}/>
                    ;
        } else {
            //flat
            return <path d={`
                                M ${this.state.leftEnd[0]},${this.state.leftEnd[1]}
                                L ${this.state.rightEnd[0]},${this.state.rightEnd[1]}
                            `} 
                            fill={this.state.fillColor}
                            stroke={this.state.strokeColor} 
                            strokeWidth={this.state.strokeWidth} 
                            data-start_node={this.props.start_node}
                            data-end_node={this.props.end_node}/>
                   ;
        }
    }

    render() {
        return(
            <Fragment>
                {this.curve()}
            </Fragment>
        );
    }
}