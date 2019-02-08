import React, { Component, Fragment } from "react";
import Node from "./Node.jsx";

export default class OtherNodes extends Component {
    constructor(props){
        super(props);
        this.draw_level_1_nodes = this.draw_level_1_nodes.bind(this);
        this.level_1_nodes_x_axis = this.level_1_nodes_x_axis.bind(this);
        this.level_1_nodes_y_axis = this.level_1_nodes_y_axis.bind(this);
        this.level_1_nodes_siblings = this.level_1_nodes_siblings.bind(this);
        this.state={
            level_1_breakingIndex: 1
        }
    }

    level_1_nodes_x_axis(index,_breakingIndex) {
        if(index<_breakingIndex) {
            return 900;//right arm
        } else {
            return 300;//left arm
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
                .filter(node => node.class === 'level_1')
                .map(item => { 
                    if (item.id !== element.id) { 
                        return item.id 
                    } 
                })
    }

    draw_level_1_nodes() {
        console.log('SVGChildren: ');
        console.dir(this.props.SVGChildren)
        return this.props.SVGChildren.filter(node => node.class === 'level_1').map((element, index) => {
            // console.log(element);
            return <Node childClassName={element.class}
                childID={element.id}
                startX={this.level_1_nodes_x_axis(index,this.state.level_1_breakingIndex)}//TODO:
                startY={this.level_1_nodes_y_axis(index,this.state.level_1_breakingIndex)}//TODO:
                width={"100"}//original width
                height={"50"}//original height
                transform={""}
                text={this.props.updateNodeID === element.id ? (this.props.updateNodeContent ? this.props.updateNodeContent : element.content) : (element.content?element.content: "New Node")}
                nodeParent={element.parent}
                nodeChildren={this.level_1_nodes_siblings(element)}
                getMouseEventClick={this.props.getMouseEventClick}
                x = {element.position?element.position[0]:0 }
                y = {element.position?element.position[1]:0 }
                key={element.id}></Node>;
        });
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

    render(){
        return(
            <Fragment>
                {this.draw_level_1_nodes()}
            </Fragment>
        );
    }
}