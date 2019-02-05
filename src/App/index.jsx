import React, { Component } from "react";
import MainNode from "../Components/MainNode.jsx";
import Node from "../Components/Node";
import styled from "styled-components";
import PopupMenu from "../Components/PopupMenu/PopupMenu.jsx";
import MenuFunctionAddLower from "../Components/PopupMenu/MenuFunctionAddLower.jsx";
import $ from "jquery";

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
        this._addChildren = this._addChildren.bind(this);
        this.state = {
            popupMenuDisplay: "none",
            popupMenuOffsetX: 0,
            popupMenuOffsetY: 0,
            popupMenuCallerInfo: {
                                    id: "node_1",
                                    classList: ['mainNode'],
                                    parent: "none",
                                    children: []                        
                                    },
            SVGChildren: [],
            SVGChildrenNum: 1
        }
    }

    _onClick(e) {
        let element = document.elementFromPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        // console.dir(element);
        if(element.nodeName === "path") {//clicked on node
            // console.log("Clicked coordinates are: " + e.nativeEvent.offsetX+', '+e.nativeEvent.offsetY);
            // console.log("Clicked ele ID is: "+element.parentElement.id);
            this.setState({
                popupMenuOffsetX: e.nativeEvent.offsetX,//clicked position abscissa
                popupMenuOffsetY: e.nativeEvent.offsetY,//ordinate
                popupMenuDisplay: "block",
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
                    // popupMenuCallerInfo: {
                    //                         id: this.state.popupMenuCallerInfo.id,
                    //                         classList: this.state.popupMenuCallerInfo.classList,
                    //                         parent: this.state.popupMenuCallerInfo.parent,
                    //                         children: this.state.popupMenuCallerInfo.children    
                    //                     }//return to init state
                });
            }
        }
        // console.dir(element);
    }

    _addChildren(menuContext){
        if (menuContext) {
            // console.log("Add Child now!!")//clicked popupmenu add lower
            // console.log("menucontext: ");
            // console.dir(menuContext);
            /**
             * 1. store all nodes in SVGChildren, mainNode doesn't belong to here.
             * 2. update this.state.SVGChildren when new node added.
             * 3. each node should have id and class, to identify itself in which level.
             * 4. nodes are rendered in render() by MenuFunctionAddLower().
             * 5. refer to all nodes by ID
             *  */
            /**
             * menuContext = {
             *  callerChildren:
             *  callerClass:
             *  callerID:
             *  callerParent: 
             * }
             */
            let _thisID = "node_" + (Number(this.state.SVGChildrenNum)+1);//new node ID
            let _thisCallerChildren = (menuContext.callerChildren+'').split(',').slice();//copy array, to avoid edit origin
            _thisCallerChildren.push(_thisID);//add this new node to callerChildren
            let _thisClass = menuContext.callerClass === "mainNode" ? 
                                "level_1" :
                                "level_" + (Number(menuContext.callerClass.split("_")[1])+1);
            let _thisParent = menuContext.callerID;
            let _thisChildren = [];

            let new_SVGChildren = this.state.SVGChildren.slice();//copy origin to avoid edit
            if(new_SVGChildren.filter(node=>node.id === _thisParent)){
                //if _thisParent is an existing node in this list
                new_SVGChildren = new_SVGChildren.map((node)=>{
                    if(node.id===_thisParent) {
                        node.children.push(_thisID);
                    }
                    return node;
                });
            }
            //FIXME: siblings isnot display correct
            new_SVGChildren.push({
                id: _thisID,
                siblings: _thisCallerChildren,
                class: _thisClass,
                parent: _thisParent,
                children: []
            });

            this.setState({
                SVGChildren: new_SVGChildren,
                SVGChildrenNum: this.state.SVGChildrenNum + 1
            })
        }
    }


    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        const nodes = MenuFunctionAddLower(this.state.SVGChildren);

        return (
            <MainContainer>
                <PopupMenu display={this.state.popupMenuDisplay} 
                            left={this.state.popupMenuOffsetX}
                            top={this.state.popupMenuOffsetY}
                            callerInfo={this.state.popupMenuCallerInfo}
                            clickToAdd={this._addChildren}
                ></PopupMenu>
                <svg
                    id="mind_map"
                    onClick={this._onClick}
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <g id="mind_map_node_container" width="100%" height="100%">
                        <MainNode>Here is main nodeHere is main nodeHere is main node</MainNode>
                        {nodes}
                        {/* //TODO: not rendering */}
                    </g>
                </svg>
                <input id="node_text_editor" type="text" style={{"display":"none","position":"absolute","top":'0',"left":"0"}}/> 
            </MainContainer>       
        );
    }
}