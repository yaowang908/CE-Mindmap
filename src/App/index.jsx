import React, { Component } from "react";
import MainNode from "../Components/MainNode.jsx";
import OtherNodes from "../Components/OtherNodes.jsx";
import styled from "styled-components";
import PopupMenu from "../Components/PopupMenu/PopupMenu.jsx";
import {withCookies, Cookies} from 'react-cookie';
import {startDrag,drag,endDrag} from '../Components/Functions/DraggableFunction.jsx';
import Connection from '../Components/Connection/index.jsx';

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
        //popup menu function
        this.clickToHidePopupMenu = this.clickToHidePopupMenu.bind(this);
        this._addChildren = this._addChildren.bind(this);  //this is addLower
        this._addUpper = this._addUpper.bind(this);
        this._moveUp = this._moveUp.bind(this);
        this._addSibling = this._addSibling.bind(this);
        this._delete = this._delete.bind(this);
        this._moveDown = this._moveDown.bind(this);
        //popup menu function
        this.setCookie = this.setCookie.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.clearNodes = this.clearNodes.bind(this);
        this.displayPopupMenu = this.displayPopupMenu.bind(this);
        this.getNewNodeContent = this.getNewNodeContent.bind(this);
        this.cookies = new Cookies;
        //drag function
        this.selectedDraggingElement = false;
        this.currentMouseDownPosition = [0,0];//get mouse down position for dragablefunction
        this.currentNodePositionX = 0; //get base position for draggableFunction
        this.currentNodePositionY = 0;
        this._SVGChildren_draggable = [];
        this._preDraggingSVGChildren = [];
        this._setStateSVGChildren = this._setStateSVGChildren.bind(this);
        //end-- drag function
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
            SVGChildren: [{
                id: "node_1",
                siblings: [],
                class: 'mainNode',
                parent: '',
                children: [],
                position: [0,0],
                content: 'Main Node'}],
            SVGChildrenNum: 1,
            updateNodeID:'',
            updateNodeContent:''
        }
    }

    clickToHidePopupMenu(e) {//hide popup menu
        e.stopPropagation();
        let element = document.elementFromPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        if (this.state.popupMenuDisplay === "block") {//hide popup menu when click on empty space
            if(element.id === "mind_map") {//clicked on node
                this.setState({
                    popupMenuDisplay: "none",
                });
            }
        } 
        // console.dir(element);
    }

    displayPopupMenu(mouseEventClick) {//display popupmenu
        // console.dir(mouseEventClick);
        //TODO: shouldn't display when drag&drop
        this.setState({
            popupMenuOffsetX: mouseEventClick.offsetX,//clicked position abscissa
            popupMenuOffsetY: mouseEventClick.offsetY,//ordinate
            popupMenuDisplay: "block",
            popupMenuCallerInfo: {
                id: mouseEventClick.path[1].id,
                classList: mouseEventClick.path[1].classList,
                parent: mouseEventClick.path[1].dataset.parent,
                siblings: mouseEventClick.path[1].dataset.siblings
            }//clicked node id and class 
        });
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
            // console.log("svgchildrenNum: "+this.state.SVGChildrenNum);
            // console.log("_thisID: "+_thisID);
            console.log('Before adding child:')
            console.dir(menuContext);
            let _thisCallerSiblings = (menuContext.callerSiblings+'').split(',').slice();//copy array, to avoid edit origin
            _thisCallerSiblings.push(_thisID);//add this new node to callerChildren
            console.log('Added child:');
            console.dir(_thisCallerSiblings);

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
                siblings: _thisCallerSiblings,
                class: _thisClass,
                parent: _thisParent,
                children: [],
                position:[0,0],
                content: ''
            });
            // console.dir(new_SVGChildren);
            this.setState({
                SVGChildren: new_SVGChildren,
                SVGChildrenNum: this.state.SVGChildrenNum + 1,
                level_1_breakingIndex: Math.ceil(new_SVGChildren.filter(node=>node.class==='level_1').length / 2)
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
        let _temp = this.getCookie('SVGChildren') ? this.getCookie('SVGChildren') : this.state.SVGChildren;
        console.dir(_temp);
        this.setState({
            SVGChildren: _temp,
            SVGChildrenNum: _temp.length ? _temp.length : 1 , //if there is no cookie, set SVGChildrenNum = 1
            level_1_breakingIndex: Math.ceil(_temp.filter(node => node.class === 'level_1').length/2)
        }); 

    }

    componentDidMount() {
        // console.dir(this.mainSVG);
        this.mainSVG.addEventListener("mousedown", startDrag.bind(this));
        this.mainSVG.addEventListener("mousemove", drag.bind(this));
        this.mainSVG.addEventListener("mouseup", endDrag.bind(this));
        this.mainSVG.addEventListener("mouseleave", endDrag.bind(this));
    }

    componentWillUnmount(){
        this.mainSVG.removeEventListener("mousedown", startDrag);
        this.mainSVG.removeEventListener("mousemove", drag);
        this.mainSVG.removeEventListener("mouseup", endDrag);
        this.mainSVG.removeEventListener("mouseleave", endDrag);
    }

    componentDidUpdate(prevProps,prevState,snapshot) {
        
    }

//update node content
    getNewNodeContent(_content,_thisNode) {
        //get called when clicked on node
        // console.log(_content);
        // console.dir(_thisNode);

        let _thisNodeID = _thisNode.id;
        //store new content into cookie
        let _SVGChildren = this.state.SVGChildren.slice();
        _SVGChildren = _SVGChildren.map(child=>{
            if(child.id === _thisNodeID) {
                child.content = _content;
            }
            return child;
        });
        // console.dir(_SVGChildren);
        this.setState({
            SVGChildren: _SVGChildren,
            updateNodeID: _thisNodeID,
            updateNodeContent: _content,
            popupMenuDisplay: 'none'
        });

        this.setCookie('SVGChildren', JSON.stringify(_SVGChildren));

    }

    _setStateSVGChildren(_newSVGChildren) {
        console.log('set state here');
        console.dir(_newSVGChildren);
        if(_newSVGChildren.length !== 0) {//there is item in _newSVGChildren
            this.setState({
                SVGChildren: _newSVGChildren
            });
        }
    }

    _addUpper() {
        console.log('add Upper function');
    }

    _moveUp() {
        console.log('move up function');

    }

    _moveDown() {
        console.log('move down function');
    }

    _addSibling() {
        console.log('add sibling function');

    }

    _delete() {
        console.log('double confirm');
        console.log('delete function');

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
                            getNewNodeContent={this.getNewNodeContent}
                            addUpper={this._addUpper}
                            moveUp={this._moveUp}
                            moveDown={this._moveDown}
                            addSibling={this._addSibling}
                            delete={this._delete}
                ></PopupMenu>
                <svg
                    id="mind_map"
                    onClick={this.clickToHidePopupMenu} //click on svg hide popupmenu
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    ref={elem=>this.mainSVG = elem}
                > 
                    <svg id="mind_map_node_container" width="100%" height="100%" x='0' y='0'>
                        <MainNode SVGChildren={this.state.SVGChildren} 
                                  getMouseEventClick={this.displayPopupMenu}
                                  updateNodeContent={this.state.updateNodeContent}
                                  updateNodeID={this.state.updateNodeID}>Main Node</MainNode>
                        <OtherNodes SVGChildren={this.state.SVGChildren} 
                                    level_1_breakingIndex={this.state.level_1_breakingIndex}
                                    getMouseEventClick={this.displayPopupMenu}
                                    updateNodeContent={this.state.updateNodeContent}
                                    updateNodeID={this.state.updateNodeID}></OtherNodes>
                        <Connection SVGChildren={this.state.SVGChildren}></Connection>
                    </svg>
                </svg>
                <input id="node_text_editor" type="text" style={{"display":"none","position":"absolute","top":'0',"left":"0"}}/> 
            </MainContainer>       
        );
    }//end of render
}//end of app class

export default withCookies(App);