import React, { Component } from "react";
import Node from "./Node.jsx";

export default class MainNode extends Component {
    constructor(props){
        super(props);
        this.transformFormula = this.transformFormula.bind(this);
        this.state={            
            width: 100,
            height: 50
        }
    }

    transformFormula() {
        return `
            translate(-${this.state.width/2} -${this.state.height/2})
        `;
    }

    render(){ 
        return(
            <Node childClassName={"mainNode"} 
                    childID={"node_1"} 
                    startX={window.innerWidth/2} 
                    startY={window.innerHeight/2} 
                    width={this.state.width} 
                    height={this.state.height} 
                    transform={this.transformFormula()} 
                    text={this.props.children}
                    nodeParent={"none"}
                    nodeChildren={[]}
                    getBoxRect={this.props.getBoxRect} 
            />
        );
    }
} 