import React, { Component, Fragment } from "react";

export default class Connection extends Component {
    constructor(props) {
        super(props);
        this.getMainNodeSpecs = this.getMainNodeSpecs.bind(this);
        this.getFirstLevelNodeSpecs = this.getFirstLevelNodeSpecs.bind(this);
        this.state={
            mainNodeSpecs : {},
            firstLevelNodeSpecs : []
        };
    }

/**
 * 1. get mainNode position   ===>  getBBox or getClientRect
 *      1.everything main node get draged, pass in new position to refresh
 * 2. get mainNode left & right anchor point  ===> calculation
 * 3. connect level_1 nodes to mainNode ===> <Curve>
 */
    componentWillMount() {
    }

    getMainNodeSpecs() {
        let _mainNode = document.getElementById('node_1').getBoundingClientRect();
        return _mainNode;
    }

    getFirstLevelNodeSpecs() {
        let _firstLevelNodesSpecs = [];
        let _firstLevelNodes = this.props.SVGChildren.filter(node=>node.class === 'level_1');

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

    render() {
        return(
            <Fragment>
                <Level_1_curve mainNodeSpecs={this.state.mainNodeSpecs}
                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Level_1_curve>
            </Fragment>
        );
    }
}

class Level_1_curve extends Component {
    constructor(props) {
        super(props);
        this.state={

        }
    }

    render() {
        return(
            <Fragment>
                {   
                    this.props.firstLevelNodeSpecs.map(node=>{
                        if(this.props.mainNodeSpecs.left 
                            && (this.props.mainNodeSpecs.right < node.specs.left 
                                || node.specs.right < this.props.mainNodeSpecs.left    
                                )
                           ){//anchor point is on left or right border
                            //mainNodeSpecs get passed in after parent node componentDidMount, 
                            //so there is two statement, if(this.props.mainNodeSpecs.left) ruled out the other 
                                /**
                                 *          --------
                                 *         |        |
                                 *          --------   \
                                 *                      \  
                                 *                       \    --------
                                 *                        \  |        |
                                 *                            --------
                                 */
                            if(node.specs.left > this.props.mainNodeSpecs.right) {
                                //node is to the right of main node
                                return <Curve leftEnd={[this.props.mainNodeSpecs.right, (this.props.mainNodeSpecs.height / 2 + this.props.mainNodeSpecs.top)]}
                                    rightEnd={[node.specs.left, (node.specs.height/2+node.specs.top)]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.props.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.props.firstLevelNodeSpecs}></Curve>;
                            } else if(node.specs.right < this.props.mainNodeSpecs.left) {
                                //node is to the left of main node
                                return <Curve leftEnd={[node.specs.right, (node.specs.height/2+node.specs.top)]}
                                    rightEnd={[this.props.mainNodeSpecs.left, (this.props.mainNodeSpecs.height / 2 + this.props.mainNodeSpecs.top)]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.props.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.props.firstLevelNodeSpecs}></Curve>;
                            }
                            
                        } else if (this.props.mainNodeSpecs.left
                                && (this.props.mainNodeSpecs.right >= node.specs.left
                                    && node.specs.right >= this.props.mainNodeSpecs.left
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
                                if(this.props.mainNodeSpecs.top>node.specs.bottom) {
                                    //node is to the top of main node
                                    return <Curve leftEnd={[(node.specs.left+node.specs.width/2), node.specs.bottom]}
                                        rightEnd={[(this.props.mainNodeSpecs.left + this.props.mainNodeSpecs.width/2), this.props.mainNodeSpecs.top]}
                                        start_node={'node_1'}
                                        end_node={node.id}
                                        mainNodeSpecs={this.props.mainNodeSpecs}
                                        firstLevelNodeSpecs={this.props.firstLevelNodeSpecs}></Curve>;

                                } else if(this.props.mainNodeSpecs.bottom<node.specs.top) {
                                    //node is to the bottom of main node
                                    return <Curve leftEnd={[(this.props.mainNodeSpecs.left + this.props.mainNodeSpecs.width / 2), this.props.mainNodeSpecs.bottom]}
                                        rightEnd={[(node.specs.left + node.specs.width / 2), node.specs.top]}
                                        start_node={'node_1'}
                                        end_node={node.id}
                                        mainNodeSpecs={this.props.mainNodeSpecs}
                                        firstLevelNodeSpecs={this.props.firstLevelNodeSpecs}></Curve>;
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