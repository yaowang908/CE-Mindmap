import React, { Component, Fragment } from "react";
import Node from "./Node.jsx";

export default class OtherNodes extends Component {
    constructor(props){
        super(props);
        this.draw_level_1_nodes = this.draw_level_1_nodes.bind(this);
        this.state={
            level_1_breakingIndex: 1
        }
    }

    draw_level_1_nodes() {
        console.log('!!!');
        return this.props.SVGChildren.filter(node => node.class === 'level_1').map((element, index) => {
            console.log(index);
            if (index < this.state.level_1_breakingIndex) {

                return <Node childClassName={element.class}
                    childID={element.id}
                    startX={900}//TODO:
                    startY={200 + 100 * index}//TODO:
                    width={"100"}//original width
                    height={"50"}//original height
                    transform={""}
                    text={"New Node"}
                    nodeParent={element.parent}
                    nodeChildren={[]}
                    key={element.id}></Node>;
            } else {
                return <Node childClassName={element.class}
                    childID={element.id}
                    startX={300}//TODO:
                    startY={200 + 100 * index}//TODO:
                    width={"100"}//original width
                    height={"50"}//original height
                    transform={""}
                    text={"New Node"}
                    nodeParent={element.parent}
                    nodeChildren={[]}
                    key={element.id}></Node>;
            }
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