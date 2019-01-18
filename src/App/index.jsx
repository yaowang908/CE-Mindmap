import React, { Component } from "react";
import MainNode from "../Components/MainNode.jsx";
import Node from "../Components/Node";
import styled from "styled-components";
import PopupMenu from "../Components/PopupMenu/PopupMenu.jsx";

const MainContainer =styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;


export default class App extends Component {
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this.state = {
            popupMenuDisplay: "none",
            popupMenuOffsetX: 0,
            popupMenuOffsetY: 0
        }
    }

    _onClick(e) {
        // console.log(e.nativeEvent.offsetX);
        // console.log(e.nativeEvent.offsetY);
        this.setState({
            popupMenuOffsetX: e.nativeEvent.offsetX,
            popupMenuOffsetY: e.nativeEvent.offsetY,
            popupMenuDisplay: this.state.popupMenuDisplay === "none" ? "block" : "none"
        });
        // console.log(this.state.popupMenuDisplay);

        let element = document.elementFromPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        console.dir(element);
    }

    componentWillMount() {

    }

    render() {
        return (
            <MainContainer onClick={this._onClick}>
                <PopupMenu display={this.state.popupMenuDisplay} 
                            left={this.state.popupMenuOffsetX}
                            top={this.state.popupMenuOffsetY}
                ></PopupMenu>
                <svg
                    id="mind_map"
                    width="100%"
                    height="100%" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <MainNode>Here is main nodeHere is main nodeHere is main node</MainNode>
                </svg> 
            </MainContainer>       
        );
    }
}