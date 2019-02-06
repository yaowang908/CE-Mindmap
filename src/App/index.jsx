import React, { Component } from "react";
import MainNode from "../Components/MainNode.jsx";
import Node from "../Components/Node";
import OtherNodes from "../Components/OtherNodes.jsx";
import styled from "styled-components";
import PopupMenu from "../Components/PopupMenu/PopupMenu.jsx";
import {withCookies, Cookies} from 'react-cookie';
import $ from "jquery";

import "../Components/Functions/ZoomFunction.jsx";

const MainContainer =styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const Menu = styled.div`
    position: absolute;
    left: 0;
    width: 100px;
    height:25px;
    top: 0;
    background-color: red;
    z-index:2000;
`;

class App extends Component {
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this._addChildren = this._addChildren.bind(this);
        this.setCookie = this.setCookie.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.clearNodes = this.clearNodes.bind(this);
        this.cookies = new Cookies;
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
        console.log("init SVGChildrenNum: "+ this.state.SVGChildrenNum);
    }

    _onClick(e) {
        let element = document.elementFromPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        console.dir(element);
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
            /**
             * 1. store all nodes in SVGChildren, mainNode doesn't belong to here.
             * 2. update this.state.SVGChildren when new node added.
             * 3. each node should have id and class, to identify itself in which level.
             * 4. nodes are rendered in <OtherNodes>
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
            console.log("svgchildrenNum: "+this.state.SVGChildrenNum);
            console.log("_thisID: "+_thisID);
            let _thisCallerChildren = (menuContext.callerChildren+'').split(',').slice();//copy array, to avoid edit origin
            _thisCallerChildren.push(_thisID);//add this new node to callerChildren

            // this.setCookie("yao",'111');
            // console.log(this.getCookie("Yao"));

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
            //sibling is stored in node html attribute data-children
            new_SVGChildren.push({
                id: _thisID,
                siblings: _thisCallerChildren,
                class: _thisClass,
                parent: _thisParent,
                children: []
            });
            // console.dir(new_SVGChildren);
            this.setState({
                SVGChildren: new_SVGChildren,
                SVGChildrenNum: this.state.SVGChildrenNum + 1,
                level_1_breakingIndex: Math.ceil(new_SVGChildren.length / 2)
            })

            this.setCookie('SVGChildren',JSON.stringify(new_SVGChildren));
        }
    }//end of _addChildren

    setCookie(name,value) {
        this.cookies.set(name,value,{path:'/'});
    }

    getCookie(name) {
        // console.log(cookies.get('myCat'));
        return this.cookies.get(name);
    }

    clearNodes() {
        this.cookies.remove('SVGChildren',{path:'/'});
        window.location.reload();
        return false;

    }

    componentWillMount() {
        // console.log((this.getCookie('SVGChildren')));
        let _temp = this.getCookie('SVGChildren') ? this.getCookie('SVGChildren') : this.state.SVGChildren;

        this.setState({
            SVGChildren: _temp,
            SVGChildrenNum: _temp.length ? _temp.length : 1 , //if there is no cookie, set SVGChildrenNum = 1
            level_1_breakingIndex: Math.ceil(_temp.length/2)
        }); 

    }

    componentDidMount() {
    }

    render() {

        return (
            <MainContainer>
                <Menu onClick={this.clearNodes}> Clear Nodes </Menu>
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
                        <MainNode>Main Node</MainNode>
                        <OtherNodes SVGChildren={this.state.SVGChildren} 
                                    level_1_breakingIndex={this.state.level_1_breakingIndex}></OtherNodes>
                        {/* //TODO: not rendering */}
                    </g>
                </svg>
                <input id="node_text_editor" type="text" style={{"display":"none","position":"absolute","top":'0',"left":"0"}}/> 
            </MainContainer>       
        );
    }//end of render
}//end of app class

export default withCookies(App);