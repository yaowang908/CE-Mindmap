import React, { Component } from "react";
import styled from "styled-components";

const SvgGroup = styled.svg`
    cursor: move;
`;

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.generatePath = this.generatePath.bind(this);
        this.popupMenu = this.popupMenu.bind(this);
        this.clickFlag = 0;//defer click and drag mouse event
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.mouseupHandler = this.mouseupHandler.bind(this);
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

    componentDidUpdate(prevProps,prevState) {
        if(this.state.text !== prevState.text) {
            if (this.nodeText.current) {
                //adjust path width to text width
                let bbox = this.nodeText.current.getBBox();
                let textWidth = bbox.width;
                let textHeight = bbox.height;
                this.setState({
                    width: textWidth,
                    height: textHeight + 10,
                    transform: `
                            translate(-${textWidth / 2} -${(textHeight + 10) / 2})
                            `
                });
            } 
        }
    }

    componentDidMount() {//only fire once!!!!!
        if(this.nodeText.current) {
            //adjust path width to text width
            let bbox = this.nodeText.current.getBBox();
            let textWidth = bbox.width;
            let textHeight = bbox.height;
            this.setState({
                width: textWidth,
                height: textHeight+10,
                transform: `
                            translate(-${textWidth / 2} -${(textHeight + 10)/ 2})
                            `
            });
        } 
        this.nodeHolder.current.addEventListener("mousedown", this.mouseDownHandler ,false);
        this.nodeHolder.current.addEventListener("mousemove", this.mousemoveHandler, false);
        this.nodeHolder.current.addEventListener("mouseup", this.mouseupHandler, false);      
    }
    
    componentWillUnmount() {
        this.nodeHolder.current.removeEventListener("mousedown", this.mouseDownHandler);
        this.nodeHolder.current.removeEventListener("mousemove", this.mousemoveHandler);
        this.nodeHolder.current.removeEventListener("mouseup", this.mouseupHandler);
    }

    mouseDownHandler(e) {
        // e.stopPropagation();
        // e.preventDefault();
        this.clickFlag = 0;
    }

    mousemoveHandler(e) {
        // e.stopPropagation();
        // e.preventDefault();
        this.clickFlag = 1;
    }

    mouseupHandler(e) {
        // e.stopPropagation();
        // e.preventDefault();
        if(this.clickFlag === 1) {
            //drag
        } else if(this.clickFlag === 0) {
            //click
            this.popupMenu(e);
        }
    }

    popupMenu(e) {
        // console.dir(e);
        if (this.props.getMouseEventClick) {
            this.props.getMouseEventClick(e);
        }
        //pass click event data back to parent 
    }

    render() {
        // console.log('inside node component');
        // console.dir(this.props);
        return (
            <SvgGroup transform={this.state.transform} 
                id={this.props.childID} 
                className={this.props.childClassName+' draggable'}
                data-parent={this.props.nodeParent}
                data-siblings={this.props.nodeSiblings? this.props.nodeSiblings.join(','): ''} 
                ref={this.nodeHolder}
                // onClick={this.popupMenu}
                x={this.props.x ? this.props.x : 0}   
                y={this.props.y ? this.props.y : 0}
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
                {this.props.children}
            </SvgGroup>
            
        );
    }
}