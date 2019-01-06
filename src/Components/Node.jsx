import React, { Component } from "react";
import styled from "styled-components";

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.generatePath = this.generatePath.bind(this);
        this.state = {
            width: 100,
            height: 50,
            bezierRelative: 10,
            startX: 300,
            startY: 100,
            fillColor: "rgb(115,161,191)",
            strokeColor: "rgb(57,80,96)",
            transform:"",
            text:"",
            fontSize:"1em",
            textColor:"#fff"
        }
    }

    generatePath() {
        return `M ${this.state.startX}, ${this.state.startY}
        h ${this.state.width}
        q ${this.state.bezierRelative}, 0 ${this.state.bezierRelative}, ${this.state.bezierRelative}
        v ${this.state.height}
        q 0, ${this.state.bezierRelative} -${this.state.bezierRelative}, ${this.state.bezierRelative}
        h -${this.state.width}
        q -${this.state.bezierRelative}, 0 -${this.state.bezierRelative}, -${this.state.bezierRelative}
        v -${this.state.height}
        q0, -${this.state.bezierRelative} ${this.state.bezierRelative}, -${this.state.bezierRelative}`
    }

    componentWillMount() {
        this.setState({
            width: this.props.width ? this.props.width : this.state.width,
            height: this.props.height ? this.props.height : this.state.height,
            bezierRelative: this.props.bezierRelative ? this.props.bezierRelative : this.state.bezierRelative,
            startX: this.props.startX ? this.props.startX : this.state.startX,
            startY: this.props.startY ? this.props.startY : this.state.startY,
            fillColor: this.props.fillColor ? this.props.fillColor : this.state.fillColor,
            strokeColor: this.props.strokeColor ? this.props.strokeColor : this.state.strokeColor,
            transform: this.props.transform ? this.props.transform : this.state.transform,
            text: this.props.text ? this.props.text : this.state.text,
            fontSize: this.props.fontSize ? this.props.fontSize : this.state.fontSize,
            textColor: this.props.textColor ? this.props.textColor : this.state.textColor
        });

    }

    render() {
        return (
            <g>
                <path 
                    d={this.generatePath()}
                    fill={this.state.fillColor}
                    stroke={this.state.strokeColor}
                    transform={this.state.transform}
                    ref="nodeFrame"
                    //TODO: adjusting path width to text width
                />
                <g transform={`translate(${this.state.startX},${this.state.startY+this.state.width/2})`+this.state.transform} fill={this.state.textColor}>
                    <text fontSize={this.state.fontSize} y={"-9"} ref="nodeText">
                        {this.state.text}
                    </text> 
                </g>
                
            </g>
            
        );
    }
}