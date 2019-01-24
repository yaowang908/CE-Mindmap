import React, { Component } from "react";
import MainNode from "../Components/MainNode.jsx";
import Node from "../Components/Node";
import styled from "styled-components";
import PopupMenu from "../Components/PopupMenu/PopupMenu.jsx";

import "../Components/Functions/ZoomFunction.jsx";

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
            popupMenuOffsetY: 0,
            popupMenuCallerInfo: {
                                    id: "node_1",
                                    classList: ['mainNode'],
                                    parent: "none",
                                    children: []                        
                                    }
        }
    }

    _onClick(e) {
        let element = document.elementFromPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        // console.dir(element.parentElement);
        if(element.nodeName === "path") {//clicked on node
            this.setState({
                popupMenuOffsetX: e.nativeEvent.offsetX,//clicked position abscissa
                popupMenuOffsetY: e.nativeEvent.offsetY,//ordinate
                popupMenuDisplay: this.state.popupMenuDisplay = "block",
                popupMenuCallerInfo: {
                                        id : element.parentElement.id,
                                        classList : element.parentElement.classList,
                                        parent: element.parentElement.dataset.parent,
                                        children: element.parentElement.dataset.children    
                                        }//clicked node id and class 
            });
        } else {//clicked on svg container
            if(this.state.popupMenuDisplay === "block") {//hide popup menu when click on empty space
                this.setState({
                    popupMenuDisplay: "none",
                    popupMenuCallerInfo: {
                                            id: this.state.popupMenuCallerInfo.id,
                                            classList: this.state.popupMenuCallerInfo.classList,
                                            parent: this.state.popupMenuCallerInfo.parent,
                                            children: this.state.popupMenuCallerInfo.children    
                                        }//return to init state
                });
            }
        }
        // console.dir(element);
    }

    componentWillMount() {
    }

    render() {
        return (
            <MainContainer>
                <PopupMenu display={this.state.popupMenuDisplay} 
                            left={this.state.popupMenuOffsetX}
                            top={this.state.popupMenuOffsetY}
                            callerInfo={this.state.popupMenuCallerInfo}
                ></PopupMenu>
                <svg
                    id="mind_map"
                    onClick={this._onClick}
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <MainNode>Here is main nodeHere is main nodeHere is main node</MainNode>
                </svg>
                <input id="node_text_editor" type="text" style={{"display":"none","position":"absolute","top":'0',"left":"0"}}/> 
            </MainContainer>       
        );
    }
}