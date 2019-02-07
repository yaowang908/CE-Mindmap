import React, { Component } from "react";
import styled from "styled-components";

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.generatePath = this.generatePath.bind(this);
        this.returnBoxRect = this.returnBoxRect.bind(this);
        this.popupMenu = this.popupMenu.bind(this);
        this.nodeHolder = React.createRef();
        this.textHolder = React.createRef();
        this.nodeBG = React.createRef();
        this.nodeText = React.createRef();
        this.state = {
            width: 100,
            height: 50,
            bezierRelative: 10,
            startX: 300,
            startY: 100,
            fillColor: "rgb(115,161,191)",
            strokeColor: "rgb(57,80,96)",
            transform: "",
            fontSize: "1em",
            textColor: "#fff",
            text:''
        }
    }

    generatePath() {
        return `M ${this.state.startX},${this.state.startY}
        h ${this.state.width}
        q ${this.state.bezierRelative},0 ${this.state.bezierRelative},${this.state.bezierRelative}
        v ${this.state.height}
        q 0,${this.state.bezierRelative} -${this.state.bezierRelative},${this.state.bezierRelative}
        h -${this.state.width}
        q -${this.state.bezierRelative},0 -${this.state.bezierRelative},-${this.state.bezierRelative}
        v -${this.state.height}
        q 0,-${this.state.bezierRelative} ${this.state.bezierRelative},-${this.state.bezierRelative}`
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
            fontSize: this.props.fontSize ? this.props.fontSize : this.state.fontSize,
            textColor: this.props.textColor ? this.props.textColor : this.state.textColor,
            text: this.props.text ? this.props.text : this.state.text,
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            startX: nextProps.startX ? nextProps.startX : this.state.startX,
            startY: nextProps.startY ? nextProps.startY : this.state.startY,
            text: nextProps.text ? nextProps.text : this.state.text,
        });
    }

    componentDidMount() {
        console.log("did mount fired!");
        if(this.nodeText.current) {
            //adjust path width to text width
            console.log("nodetext:");
            console.dir(this.nodeText.current);
            let bbox = this.nodeText.current.getBBox();
            this.returnBoxRect(bbox);
            let textWidth = bbox.width;
            let textHeight = bbox.height;
            console.log("Width: "+bbox.width);
            this.setState({
                width: textWidth,
                height: textHeight+10,
                transform: `
                            translate(-${textWidth / 2} -${(textHeight + 10)/ 2})
                            `
            });
        }       
    }

    returnBoxRect(boxRect) {
        if(this.props.getBoxRect) {
            this.props.getBoxRect(boxRect)
        }  
    }
    
    popupMenu(e) {
        // console.dir(e.nativeEvent);
        if (this.props.getMouseEventClick) {
            this.props.getMouseEventClick(e.nativeEvent);
        }
        //pass click event data back to parent 
    }

    render() {
        return (
            <g transform={this.state.transform} 
                id={this.props.childID} 
                className={this.props.childClassName}
                data-parent={this.props.nodeParent}
                data-children={this.props.nodeChildren.join(',')} 
                ref={this.nodeHolder}
                onClick={this.popupMenu}   
            > 
                <path 
                    d={this.generatePath()}
                    fill={this.state.fillColor}
                    stroke={this.state.strokeColor}
                    ref={this.nodeBG}
                />
                <g transform={`translate(${this.state.startX},${this.state.startY + this.state.height+ 10})`} 
                   fill={this.state.textColor} ref={this.textHolder}
                >
                    <text fontSize={this.state.fontSize} 
                            y={"-9"} 
                            ref={this.nodeText} 
                            fontFamily={"'Open Sans', sans-serif"}
                            style={{"pointerEvents":"none"}}
                    >
                        {this.state.text}
                    </text> 
                </g>
            </g>
            
        );
    }
}