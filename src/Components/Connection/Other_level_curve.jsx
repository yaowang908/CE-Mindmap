import React, { Component, Fragment } from "react";
import Curve from './Curve.jsx';

export default class Other_level_curve extends Component {
    constructor(props) {
        super(props);
        this.direction = this.direction.bind(this);
        this.position = this.position.bind(this);
        this.setUpBranches = this.setUpBranches.bind(this);
        this._generator = this._generator.bind(this);
        this.deepFlatten = this.deepFlatten.bind(this);
        this.level_1_nodes_container = [];
        this.lower_level_nodes_container = [];
        this.branches = {};
        this.state={
            SVGChildren: [],
            curves:''
        }
    }

    componentWillMount() {
        this.level_1_nodes_container = this.props.SVGChildren.filter(node => node.class === 'level_1');
        this.lower_level_nodes_container = this.props.SVGChildren.filter(node => {
            if (node.class !== 'mainNode' && node.class !== 'level_1') {
                return true;
            } else {
                return false;
            }
        });
        this.branches = this.setUpBranches(this.level_1_nodes_container,this.lower_level_nodes_container);
    }

    componentWillReceiveProps(nextProps) {
        this.level_1_nodes_container = nextProps.SVGChildren.filter(node=>node.class==='level_1');
        this.lower_level_nodes_container = nextProps.SVGChildren.filter(node=>{
            if(node.class !== 'mainNode' && node.class !== 'level_1') {
                return true;
            } else {
                return false;
            }
        });
        this.branches = this.setUpBranches(this.level_1_nodes_container, this.lower_level_nodes_container);
        setTimeout(() => {//otherwise height and bottom will be rideculous big
            this.setState({
                curves: this._generator()
            });
        }, 0);  
    }

    componentDidMount() {
        this.branches = this.setUpBranches(this.level_1_nodes_container, this.lower_level_nodes_container);
        this.setState({
            curves: this._generator()
        });
        console.dir(this.branches);
    }

    setUpBranches(level_1_nodes,lower_nodes) {
        let _temp = [];
        let that = this;
        level_1_nodes.map(item=>{
            _temp.push(getChildren(item.id,lower_nodes))
        });
        /**
         * each branch is an object
         *  contains root node(level_1 node)
         *  direct child node
         *      each child node is same as branch object
         */

         function getChildren(rootID,nodes) {
             if (nodes.filter(item => item.parent === rootID)) {
                let branchNodes = nodes.filter(item => item.parent === rootID).map(n => { return n.id });
                 let _thisClass = that.props.SVGChildren.filter(
                                        x => {
                                            if (x.id === rootID) {
                                                // console.log(x.class);
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        }
                                    );
                return {
                    rootNode: rootID,
                    class: _thisClass[0]?_thisClass[0].class:'',
                    children: branchNodes.map(x=>getChildren(x,nodes))
                 };
             } else {
                return false;
             }

        }
        // console.dir(this.branches);
        return _temp;
    }

    direction(nodeID) {
        //determine node connection points position
        let _r = document.getElementById(nodeID).querySelectorAll('path')[0].getBoundingClientRect();
        // console.dir(this.props.mainNodeSpecs);
        if(this.props.mainNodeSpecs.left < _r.left) {
            return 'right';
        } else if(this.props.mainNodeSpecs.right > _r.right) {
            return 'left';
        } 
        
    }

    position() {

    }

    _generator() {
        
        let that = this;

        function coreGenerator(node) {
            // console.dir(node);
            if (node.children) {
                let _thisNodeSpecs = document.getElementById(node.rootNode).querySelectorAll('path')[0].getBoundingClientRect();
                let _thisNodeChildrenSpecs = node.children.map(x => {
                    return {
                        id: x.rootNode,
                        specs: document.getElementById(x.rootNode).querySelectorAll('path')[0].getBoundingClientRect()
                    };
                });
                // console.dir(_thisNodeSpecs);
                // console.dir(_thisNodeChildrenSpecs);
                if (that.direction(node.rootNode) === 'right') {
                    //assuming its right arm
                    let result = _thisNodeChildrenSpecs.map(item => {
                        return {
                                    leftEnd: [_thisNodeSpecs.right, (_thisNodeSpecs.top + _thisNodeSpecs.height / 2)],
                                    rightEnd: [item.specs.left, (item.specs.top + item.specs.height / 2)],
                                    start_node: node.rootNode,
                                    end_node: item.id
                                }; 
                    });
                    return result.concat(node.children.map(i => { return coreGenerator(i)}));
                } else {
                    //left arm
                    let result = _thisNodeChildrenSpecs.map(item => {
                        return {
                            leftEnd: [item.specs.right, (item.specs.top + item.specs.height / 2)],
                            rightEnd: [_thisNodeSpecs.left, (_thisNodeSpecs.top + _thisNodeSpecs.height / 2)],
                            start_node: node.rootNode,
                            end_node: item.id
                        };
                    });
                    return result.concat(node.children.map(i => { return coreGenerator(i) }));
                } 
            } else {
                // console.dir(node);
                return [];
            }        
        }//end of coreGenerator()

        if (that.branches) {
            let _result = that.branches.map(node => {
                return coreGenerator(node);
            });//end of collection.map()
            // console.dir(_result);
           return _result;
        }//end of if(brances)
    }

    deepFlatten(_array) {
        let that = this;
        let result =[];
        _array.forEach(function(elem){
            if(Array.isArray(elem)) {
                result = result.concat(that.deepFlatten(elem));
            } else {
                result.push(elem);
            }
        });

        return result;
    }

    render() {
        return (
            <Fragment>
                {   
                    // console.dir(this.state.curves ? this.deepFlatten(this.state.curves):'')
                    this.state.curves ? this.deepFlatten(this.state.curves).map(x => {
                                // console.dir(x);
                                return x ? <Curve leftEnd={x.leftEnd}
                                    rightEnd={x.rightEnd}
                                    start_node={x.start_node}
                                    end_node={x.end_node}
                                ></Curve> : '';
                            }): ''//if this.state.curves has content then output <Curve>, otherwise output ''
                }
            </Fragment>
        );
    }
}