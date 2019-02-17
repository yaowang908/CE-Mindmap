import React, { Component, Fragment } from "react";
import Node from "./Node.jsx";

export default class OtherNodes extends Component {
    constructor(props){
        super(props);
        this.draw_level_1_nodes = this.draw_level_1_nodes.bind(this);
        this.level_1_nodes_x_axis = this.level_1_nodes_x_axis.bind(this);
        this.level_1_nodes_y_axis = this.level_1_nodes_y_axis.bind(this);
        this.level_1_nodes_siblings = this.level_1_nodes_siblings.bind(this);
        this.draw_lower_level_nodes = this.draw_lower_level_nodes.bind(this);
        this.lower_level_nodes_siblings = this.lower_level_nodes_siblings.bind(this);
        this.state={
            level_1_breakingIndex: 1
        }
    }

    level_1_nodes_x_axis(index,_breakingIndex) {
        if(index<_breakingIndex) {
            return 800;//right arm
        } else {
            return 350;//left arm
        }
    }

    level_1_nodes_y_axis(index,_breakingIndex) {
        if(index<_breakingIndex) {
            //right
            return (200 + 100 * index);
        } else {
            //left
            return (200 + 100 * (index-_breakingIndex));
        }
    }

    level_1_nodes_siblings(element) {
        return this.props.SVGChildren
                .filter(node => {
                    if(node.class === 'level_1'){
                        if(node.id !== element.id) {
                            return true;
                        }
                    } else {
                        return false;
                    }
                })
                .map(item => { 
                    return item.id 
                })
    }

    draw_level_1_nodes() {
        // console.log('SVGChildren: ');
        // console.dir(this.props.SVGChildren);
        return this.props.SVGChildren.filter(node => node.class === 'level_1').map((element, index) => {
            // console.log(element);
            return <Node childClassName={element.class}
                childID={element.id}
                // startX={this.level_1_nodes_x_axis(index,this.state.level_1_breakingIndex)}
                // startY={this.level_1_nodes_y_axis(index,this.state.level_1_breakingIndex)}
                startX={window.innerWidth / 2}
                startY={window.innerHeight / 2} //all start from parent node
                width={"100"}//original width
                height={"50"}//original height
                transform={""}
                text={this.props.updateNodeID === element.id ? (this.props.updateNodeContent ? this.props.updateNodeContent : element.content) : (element.content?element.content: "New Node")}
                nodeParent={element.parent}
                nodeSiblings={this.level_1_nodes_siblings(element)}
                getMouseEventClick={this.props.getMouseEventClick}
                x = {element.position?element.position[0]:0 }
                y = {element.position?element.position[1]:0 }
                key={element.id}>
                {this.draw_lower_level_nodes(element,index,this.state.level_1_breakingIndex)}
                </Node>;
        });
    }

    lower_level_nodes_siblings(element) {
        return this.props.SVGChildren
            .filter(node => {
                if (node.class === element.class && node.parent === element.parent) {
                    if (node.id !== element.id) {
                        return true;
                    }
                } else {
                    return false;
                }
            })
            .map(item => {
                return item.id
            })
    }

    draw_lower_level_nodes(element,index,_level_1_breakingIndex) {
        /** 
         * para: 
         *      1. element is the current node, represent 
         *      2. _level_1_breakingIndex
         *  1. each level_1 node has a branch, contains all lower level children which belong to the node
         *  
         */
        let _direction;
        if (index < _level_1_breakingIndex) {
            //right
            _direction = 'right';
        } else {
            //left
            _direction = 'left';
        }
        
         /**
          *     element structure
          *     {
          *         children:[],
          *         class:'',
          *         content: '',
          *         id: '',
          *         parent: '',
          *         position: [x,y],
          *         siblings:[]
          *     }
          * 
          */
         let that = this;
        function getBranchNodes(_thisNode) {
            //recursively return child node chain
            let _thisNodeChildren = that.props.SVGChildren.filter(node => node.parent === _thisNode.id);
            if(_thisNodeChildren.length === 0) {
                return [];//no child
            } else {
                return {
                    nodes: _thisNodeChildren,
                    children: _thisNodeChildren.map(x=>{return getBranchNodes(x)})
                };
            }
            /**
             *  suppose to return something like this
             *  {
             *      nodes:[],
             *      children:{
             *              nodes:'',
             *              children:{}    
             *              }
             *  }
             *  
             */
        } // end of getBranchNodes()
        let _thisBranchNodes = getBranchNodes(element);

        //  console.dir(_thisBranchNodes);

        function branchStructure(_obj) {
            if (_obj.nodes) {//if has branch
                // console.dir(_obj)
                return _obj.nodes.map((e,index)=>{
                    //e = {children:[],
                    //   * class: '',
                    //   * content: '',
                    //   * id: '',
                    //   * parent: '',
                    //   * position: [x, y],
                    //   * siblings: []}
                    return <Node childClassName={e.class}
                                childID={e.id}
                                startX={window.innerWidth / 2}//change node position with x, y not here!!
                                startY={window.innerHeight / 2}
                                width={"100"}//original width
                                height={"50"}//original height
                                transform={""}
                                text={that.props.updateNodeID === e.id ? (that.props.updateNodeContent ? that.props.updateNodeContent : e.content) : (e.content ? e.content : "New Node")}
                                nodeParent={e.parent}
                                nodeSiblings={that.lower_level_nodes_siblings(e)}
                                getMouseEventClick={that.props.getMouseEventClick}
                                x={e.position ? e.position[0] : 0}
                                y={e.position ? e.position[1] : 0}
                                key={e.id}>
                                {
                                    // console.dir(_obj.children)
                                    _obj.children.map(item=>{
                                        if(item.length !== 0) {
                                            if(item.nodes[0].parent === e.id) {
                                                return branchStructure(item);
                                            }
                                        }  
                                    })
                                }
                            </Node>;
                });
            } else {
                return false;
            }
        }
        return branchStructure(_thisBranchNodes);
    }

    componentWillMount(){
        this.setState({
            level_1_breakingIndex: this.props.level_1_breakingIndex ? this.props.level_1_breakingIndex : this.state.level_1_breakingIndex
        });
    }

    componentWillReceiveProps(nextProps) {
        // console.log("Nextprops: "+ nextProps.level_1_breakingIndex);
        this.setState({
            level_1_breakingIndex: nextProps.level_1_breakingIndex ? nextProps.level_1_breakingIndex : this.state.level_1_breakingIndex
        });
    }

    componentDidMount() {
        //to update this comonent, update function should be in parent component
    }

    render(){
        return(
            <Fragment>
                {this.draw_level_1_nodes()}
            </Fragment>
        );
    }
}