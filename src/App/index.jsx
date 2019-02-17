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
    z-index:2000;
    cursor: pointer;
`;

const MenuItem = styled.div`
    position: relative;
    text-align: center;
    width: 100px;
    box-sizing: border-box;
    maring: 0;
    padding: 0;
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

        //menu function
        this.clearNodes = this.clearNodes.bind(this);
        this.saveMap = this.saveMap.bind(this);

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
        this.updatePosition = this.updatePosition.bind(this);
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
             * 1. store all nodes in SVGChildren.
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
            let _thisID = "node_" + (Number(this.state.SVGChildren[this.state.SVGChildrenNum-1].id.split('_')[1])+1);//new node ID
            //new id must be largets id num + 1
            //when delete node , large id remind the same, so if not same id will show up


            // console.log("svgchildrenNum: "+this.state.SVGChildrenNum);
            // console.log("_thisID: "+_thisID);
            // console.log('Before adding child:')
            // console.dir(menuContext);
            let _thisCallerSiblings = (menuContext.callerSiblings+'').split(',').slice();//copy array, to avoid edit origin
            _thisCallerSiblings.push(_thisID);//add this new node to siblings
            // console.log('Added child:');
            // console.dir(_thisCallerSiblings);

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
                        if(node.children) {node.children.push(_thisID);}
                        else {node['children']=[].push(_thisID);}
                    }
                    return node;
                });
            }
            let result = this.updatePosition(_thisClass, _thisParent);
            /**
             * result = {
             *  newNodePosition: _newNodePosition,
             *  newSVGChildren: _newSVGChildren
             * }
             */
            new_SVGChildren = result.newSVGChildren;
            //sibling is stored in node html attribute data-children
            new_SVGChildren.push({
                id: _thisID,
                siblings: _thisCallerSiblings,
                class: _thisClass,
                parent: _thisParent,
                children: [],
                position:result.newNodePosition,
                content: 'New Node'
            });
            // console.dir(new_SVGChildren);
            this.setState({
                SVGChildren: new_SVGChildren,
                SVGChildrenNum: this.state.SVGChildrenNum + 1,
                level_1_breakingIndex: Math.ceil(new_SVGChildren.filter(node=>node.class==='level_1').length / 2),
                popupMenuDisplay: "none"
            })

            this.setCookie('SVGChildren',JSON.stringify(new_SVGChildren));
        }
    }//end of _addChildren

    updatePosition(_thisClass, _thisParent) {
        /**
         *  update all other node base on new node appearance
         *  meanwhile 
         *  return new node position [x,y]
         */
        let _newSVGChildren = this.state.SVGChildren.slice();
        let _newNodePosition;
        if(_thisClass!=='mainNode' && _thisClass !=='level_1'){
            //add lower level node
            _newNodePosition = _update(_newSVGChildren);//update _newSVGChildren inside _update
        } else if(_thisClass === 'level_1') {
            _newNodePosition = _updateLevelOne();
            //update _newSVGChildren inside _updateLevelOne()
            //[Number(_getSVGRect('node_1').width) + 60,y]
        }

        

        // return new node position =>_newNodePosition
        // update siblings position  =>_newSVGChildren

        return {//updatePosition function main return
            newNodePosition: _newNodePosition,
            newSVGChildren: _newSVGChildren
        };

        /**
         *  inner functions
         */
        function _updateLevelOne() {
            //when the node to be addde is level_1 node
            let preLevelOneNodes = _newSVGChildren.filter(x=>x.class==='level_1');
            let heightSum = 0;
            preLevelOneNodes.map(node=>{
                heightSum += document.getElementById(node.id).getBBox().height;
            });

            let _minMargin = 100;//margin is margin between nodes

            // console.log(heightSum + (preLevelOneNodes.length + 1) * _minMargin );

            if((heightSum + (preLevelOneNodes.length+1)*_minMargin )< window.innerHeight){
                //previous nodes plus minMargin is shorter than window.innerHeight
                //add to bottom, right side
                let _thisMargin = (window.innerHeight - heightSum - 57)/(preLevelOneNodes.length+2); 
                // new node is not in preLevelOneNodes yet, so add 1 more 
                //57 is for new added node
                if(_thisMargin <= _minMargin){
                    _thisMargin = _minMargin
                } //margin cannot be less than minMargin

                heightSum += (preLevelOneNodes.length+1)*_thisMargin;// added margin to heightSum

                // update previous level_1 node through _newSVGChlildren
                let _levelOneCounter = 0;
                _newSVGChildren = _newSVGChildren.map(node=>{
                    if(node.class==='level_1') {
                        _levelOneCounter ++;
                        node.position = [Number(_getSVGRect('node_1').width) + 60,(_levelOneCounter * ( 57 + _thisMargin )- window.innerHeight/2)]
                        return node;
                    } else {
                        return node;
                    }
                });
                
                if(heightSum< window.innerHeight/2) {
                    return [Number(_getSVGRect('node_1').width) + 60, -(window.innerHeight / 2 - heightSum )];
                } else {
                    return [Number(_getSVGRect('node_1').width) + 60, (heightSum - window.innerHeight / 2 )];
                }
            } else {
                //previous nodes height sum exceeded window.innerHeight
                //start over, left side
                let _tempSum = heightSum + (preLevelOneNodes.length + 1) * _minMargin - window.innerHeight;
                let _leftSideNodeAmount = Math.ceil(_tempSum/(57+_minMargin))+1;//calculate how many nodes should relocate to left side
                let _thisMargin = (window.innerHeight - _tempSum -57)/(_leftSideNodeAmount+2);
                if (_thisMargin <= _minMargin) {
                    _thisMargin = _minMargin
                } //margin cannot be less than minMargin
                _tempSum += (_leftSideNodeAmount+1)*_thisMargin;//add margin to _tempSum

                // update previous level_1 node through _newSVGChlildren
                let _levelOneCounter = 0;
                _newSVGChildren = _newSVGChildren.map(node => {
                    if (node.class === 'level_1') {
                        _levelOneCounter++;
                        if (_levelOneCounter > (preLevelOneNodes.length-_leftSideNodeAmount)){
                            //update left side nodes
                            console.log((_levelOneCounter - preLevelOneNodes.length + _leftSideNodeAmount) * (57 + _thisMargin));

                            node.position = [-(Number(_getSVGRect('node_1').width) + 60), ((_levelOneCounter - preLevelOneNodes.length + _leftSideNodeAmount) * (57 + _thisMargin) - window.innerHeight / 2)]
                            return node;
                        } else {
                            return node
                        }
                    } else {
                        return node;
                    }
                });

                if (_tempSum < window.innerHeight / 2) {
                    return [-(Number(_getSVGRect('node_1').width) + 60), _tempSum - (window.innerHeight / 2)];
                } else {
                    return [-(Number(_getSVGRect('node_1').width) + 60), _tempSum - (window.innerHeight / 2)];
                }
            }

        }

        function _update(array) {
            let _waitingList = array.filter(x => {
                if (x.id !== 'mainNode' && x.class !== 'level_1') {
                    //ignore mainNode and level_1 node
                    return true;
                } else {
                    return false;
                }
            });

            if (_waitingList.length >= 1) {
                let _class = _thisClass;
                let _parent = _thisParent;
                let _siblings = _waitingList.map(x => {
                    // siblings doesn't contains node itself
                    //because it hasn't been added to it
                    if (x.class === _class && x.parent === _parent) {
                        return x;//return complete node
                    }
                }).filter(x => x);

                console.dir(_siblings);

                //siblings and parent contains smallest svg group
                //for nodes lower than or equal to level_2, all nodes stacked together
                // node height=50, margin= 50
                // node is also possible to be svg NODE
                let _stackHeight = (_siblings.length) * 50;
                //init _stackHeight contains all margins
                //add one more margin for new added node (not yet in the array)
                _siblings.map(x => {
                    _stackHeight += _getSVGRect(x.id).height;
                });

                _stackHeight += 50; //new node

                // assuming parent Node is coordinates [0,0]
                // assign position:[x,y] to all siblings
                // stackHeihgt determine y, 
                // _getRect will help with x

                _siblings = _siblings.map((node, index) => {
                    let _y = _stackHeight / 2 - (index * 50 + _getPreviousNodesHeight_sum(_siblings, index));//index* margin & previous nodes height
                    let _x = Number(_getPathRect(_parent).width) + 60;
                    node.position = [_x, _y];//update other nodes here
                    _newSVGChildren = _newSVGChildren.map(x => {
                        if (x.id === node.id) {
                            return node;
                        } else {
                            return x;
                        }
                    });
                    return node;
                });

                let _parentPositionX = document.getElementById(_parent).getAttribute('x');
                console.log(Number(_getPathRect(_parent).width) + 60);
                if(_parentPositionX < 0) {
                    return [-(Number(_getPathRect(_parent).width) + 60), _stackHeight / 2 - (_siblings.length * 50 + _getPreviousNodesHeight_sum(_siblings, _siblings.length))];
                } else if (_parentPositionX > 0) {
                    return [Number(_getPathRect(_parent).width) + 60, _stackHeight / 2 - (_siblings.length * 50 + _getPreviousNodesHeight_sum(_siblings, _siblings.length))];

                }
            }
        }

        function _getPreviousNodesHeight_sum(_siblings, _currentIndex) {
            if (_currentIndex === 0) {
                return 0;
            } else {
                let heightSum = 0;
                _siblings.map((node, index) => {
                    if (index < _currentIndex) {
                        heightSum += _getSVGRect(node.id).height;
                    }
                });
                console.dir(heightSum);
                return heightSum;
            }
        }

        function _getSVGRect(id) {
            let _result = document.getElementById(id).getBBox()
            return _result;
        }

        function _getPathRect(id) {
            //all id is assosiated with svg node
            // return path rect
            let _svgNode = document.getElementById(id);
            let _result = _svgNode.getElementsByTagName('path')[0].getBBox()
            return _result;
        }
    }// end of update position

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
        if(_temp.length === 0) {
            _temp= [{
                id: "node_1",
                siblings: [],
                class: 'mainNode',
                parent: '',
                children: [],
                position: [0, 0],
                content: 'Main Node'
            }]
        }
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

    _addUpper(menuContext) {
        /**
         * addUpper is equal to call addSibling on parent node
         */
        if (!menuContext.disable) {
            console.log('add Upper function');
            console.dir(menuContext);
            let _thisID = "node_" + (Number(this.state.SVGChildren[this.state.SVGChildrenNum - 1].id.split('_')[1]) + 1);//new node ID
            let _thisClass = "level_"+(menuContext.callerClass.split('_')[1]-1);//if menu is not disabled, then class is larger than 1
            let _thisParent = menuContext.callerParent;
            let _newSVGChildren = this.state.SVGChildren.slice();
            let _callerParent = _newSVGChildren.map(node=>{
                if (node.id === _thisParent) {
                    return node.parent;
                }
            }).filter(x=>x).join();
            let _callerSiblings = _newSVGChildren.map(node => {
                if (node.class === _thisClass) {
                    return node.id;
                }
            }).filter(x=>x);
            let _thisMenuContext = {
                callerClass: _thisClass,
                callerID: _thisParent,
                callerParent: _callerParent,
                callerSiblings: _callerSiblings,
                diable: false
            }

            this._addSibling(_thisMenuContext);


        }
    }

    _moveUp(menuContext) {
        /**
         *  all nodes only care about UPPER level
         *  so only move this node is enough, children will follow
         *  1. move this node upper level
         *  2. update upper level siblings
         *  3. setState
         *  4. set cookie 
         */
        if (!menuContext.disable) {
            console.log('move up function');
            console.dir(menuContext);
            let _thisID = menuContext.callerID;
            let _thisClass = menuContext.callerClass;
            let _upperClass = "level_" + (Number(menuContext.callerClass.split('_')[1]) - 1);//if menu is not disabled, then class is larger than 1
            let _thisParent = menuContext.callerParent;
            let _upperParent = this.state.SVGChildren.map(x=>{
                if(x.id===_thisParent) {
                    return x.parent;
                }
            }).filter(x=>x).join();
            let _upperLevelSiblings = this.state.SVGChildren.map(
                x => {  
                    if(x.class === _upperClass) {
                        return x.id;
                    }
                }
            ).filter(x => x);
            _upperLevelSiblings.push(_thisID);
            console.dir(_upperLevelSiblings);
            let _newSVGChildren = this.state.SVGChildren.slice();
            _newSVGChildren = _newSVGChildren.map(node=>{
                if(node.id===_thisID) {
                    node.class = _upperClass;
                    node.parent = _upperParent;
                } else if (node.class === _upperClass) {
                    node.siblings = _upperLevelSiblings.filter(x=>x !== node.id);
                } 
                return node;
            });

            this.setState({
                SVGChildren: _newSVGChildren,
                level_1_breakingIndex: Math.ceil(_newSVGChildren.filter(node => node.class === 'level_1').length / 2),
                popupMenuDisplay: "none",
            })

            this.setCookie('SVGChildren', JSON.stringify(_newSVGChildren));
        }

    }

    _moveDown(menuContext) {
        /**
         *  all nodes only care about UPPER level
         *  so only move this node is enough, children will follow
         *  1. move this node lower level
         *      1. get parent children
         *      2. get user selection, which children should we move to
         *  2. update lower level siblings
         *  3. setState
         *  4. set cookie
         */
        let that = this;
        if (!menuContext.disable) {
            console.log('move down function');
            console.dir(menuContext);
            let _thisID = menuContext.callerID;
            let _thisClass = menuContext.callerClass;
            let _lowerClass = "level_" + (Number(menuContext.callerClass.split('_')[1]) + 1);
            let _thisParent = menuContext.callerParent;
            let targetNode = '';

            if (menuContext.callerSiblings) {//when node has siblings
                //if no siblings, move down does't make sense
                let _thisSiblings = menuContext.callerSiblings.split(',');
                _thisSiblings = _thisSiblings.filter(x => x !== _thisID);
                let _newSVGChildren = that.state.SVGChildren.slice();
                _newSVGChildren.map(node=>{
                    if (_thisSiblings.includes(node.id)) {
                        let elmt = document.getElementById(node.id);
                        elmt.getElementsByTagName('path')[0].setAttribute('fill','rgb(122,66,244)');
                    }
                });
                _thisSiblings.map(
                    node=>{
                        document.getElementById(node).addEventListener('click', _setMoveDownTarget,false);
                    }
                );
                function _setMoveDownTarget(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _newSVGChildren.map(node => {
                            if (_thisSiblings.includes(node.id)) {
                                let elmt = document.getElementById(node.id);
                                elmt.getElementsByTagName('path')[0].setAttribute('fill', 'rgb(115,161,191)');
                            }
                        });

                        console.dir(e.path[1].id);
                        targetNode = e.path[1].id;

                        /**
                         *  move down node here
                         */
                        let _nextSiblings = _newSVGChildren.map(node => {
                            if (node.parent === targetNode) {
                                return node.id
                            }
                        }).filter(x => x);

                        _newSVGChildren = _newSVGChildren.map(node => {
                            /**
                             * 1. update current level siblings and parent children
                             * 2. update target level siblings and parent children, and parent
                             */
                            if (node.id === _thisID) {
                                //node to be moved
                                node.class = _lowerClass;
                                node.parent = targetNode;
                            } else if (node.class === _thisClass) {
                                //current level siblings
                                node.siblings = node.siblings.filter(x => x !== _thisID);
                            } else if (node.id === _thisParent) {
                                //current parent
                                node.children.filter(x => x !== _thisID);
                            } else if (node.id === targetNode) {
                                //target level parent
                                node.children.push(_thisID);
                            } else if (node.class === _lowerClass) {
                                //target level siblings
                                node.siblings = _nextSiblings.filter(x => x !== node.id);
                            }
                            return node;
                        });

                        that.setState({
                            SVGChildren: _newSVGChildren,
                            level_1_breakingIndex: Math.ceil(_newSVGChildren.filter(node => node.class === 'level_1').length / 2),
                            popupMenuDisplay: "none",
                        })

                        that.setCookie('SVGChildren', JSON.stringify(_newSVGChildren));

                        _thisSiblings.map(
                            x => {
                                document.getElementById(x).removeEventListener('click', _setMoveDownTarget, false);
                            });
                        
                    }//end of _setMoveDownTarget
                
            }
        }
    }

    _addSibling(menuContext) {
        /**
         * 1. setup new node 
         * 2. copy SVGChildren
         * 3. update siblings & parent=>child
         * 4. push new node
         * 5. setState(SVGChildren,num,breakingIndex)
         * 6. setCookie
         */
        if(!menuContext.disable) {
            console.log('add sibling function');
            console.dir(menuContext);
            let _thisID = "node_" + (Number(this.state.SVGChildren[this.state.SVGChildrenNum - 1].id.split('_')[1]) + 1);//new node ID
            let _thisClass = menuContext.callerClass; //siblings have same class
            let _thisParent = menuContext.callerParent;
            let _allSiblingsThisLevel = this.state.SVGChildren.map(
                x=>{
                    if(x.class === _thisClass && x.parent === _thisParent){
                        //only return sibling under same parent node
                        return x.id;
                    }
                }
                ).filter(x=>x);
            _allSiblingsThisLevel.push(_thisID);//add to siblings
            let _newSVGChildren = this.state.SVGChildren.slice();
            _newSVGChildren = _newSVGChildren.map(node=>{
                if(node.class === _thisClass && node.parent === _thisParent) {
                    node.siblings = _allSiblingsThisLevel.filter(x=>{
                        if(x!==node.id){
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else if (node.id === _thisParent) {
                    node.children.push(_thisID);
                }
                return node;
            });

            _newSVGChildren.push({
                id: _thisID,
                class: _thisClass,
                children:[],
                content:'New Node',
                parent: _thisParent,
                position: [0,0],
                siblings: _allSiblingsThisLevel.filter(x => x !== _thisID)
            })

            this.setState({
                SVGChildren: _newSVGChildren,
                SVGChildrenNum: this.state.SVGChildrenNum + 1,
                level_1_breakingIndex: Math.ceil(_newSVGChildren.filter(node => node.class === 'level_1').length / 2),
                popupMenuDisplay: "none",
            })

            this.setCookie('SVGChildren', JSON.stringify(_newSVGChildren));
        }
    }

    _delete(menuContext) {
    /**
     * 1. double confirm
     * 2. copy SVGChildren
     * 3. update siblings & parent=>child
     * 4. delete node
     * 5. setState(SVGChildren,num,breakingIndex)
     * 6. setCookie
     */
    let that = this;
        if(!menuContext.disable) {
            console.log('double confirm');
            console.log('delete function');
            console.dir(menuContext);
            let _thisID = menuContext.callerID;//new node ID
            let _thisClass = menuContext.callerClass; //siblings have same class
            let _thisParent = menuContext.callerParent;
            let _allSiblingsThisLevel = that.state.SVGChildren.map(
                x => {
                    if (x.class === _thisClass && x.parent === _thisParent) {
                        //only return sibling under same parent node
                        return x.id;
                    }
                }
            ).filter(x => x);
            let _newSVGChildren = that.state.SVGChildren.slice();
            let _thisNodeContent = that.state.SVGChildren.map(
                node=>{
                    if(node.id===_thisID) {
                        return node.content;
                    }
                }
            ).filter(x=>x);
            let doubleConfirm = window.confirm(`Are you sure to delete node: "${_thisNodeContent.join()}"`);
            
            let deleteStatusObj = {};

            if( doubleConfirm ) {
                //delete node here
                _allSiblingsThisLevel = _allSiblingsThisLevel.filter(x=> x.id !== _thisID);

                _newSVGChildren = _newSVGChildren.map(node=>{
                    // if(node.id !== _thisID && node.parent !== _thisID) {//delete node
                    if(!deleteOrNot(node.id,node.parent)){
                        if (node.class === _thisClass && node.parent === _thisParent) {
                            //update siblings
                            node.siblings = _allSiblingsThisLevel.filter(x => x.id !== node.id);
                        } else if (node.id === _thisParent) {
                            //update parent node children property
                            node.children = node.children.filter(x => x !== node.id);
                        }
                        return node;
                    } 
                }).filter(x=>x);

                function deleteOrNot(__thisNodeID,__thisNodeParent) {
                    if(deleteStatusObj[__thisNodeID]) {//speed up
                        return deleteStatusObj[__thisNodeID];
                    } else {
                        if (__thisNodeID === _thisID) {
                            //node itself
                            deleteStatusObj[__thisNodeID] = true;
                            return true;
                        } else if (__thisNodeParent === _thisID) {
                            //node direct children
                            deleteStatusObj[__thisNodeID] = true;
                            return true;
                        } else {
                            let temp = that.state.SVGChildren.filter(x=>x.id===__thisNodeParent)[0];
                            if(temp && temp.parent) {
                                return deleteOrNot(temp.id,temp.parent);
                            } else {
                                // console.dir(temp);
                                return false;
                            }
                        }
                    }
                }
                
                this.setState({
                    SVGChildren: _newSVGChildren,
                    SVGChildrenNum: this.state.SVGChildrenNum - 1,
                    level_1_breakingIndex: Math.ceil(_newSVGChildren.filter(node => node.class === 'level_1').length / 2),
                    popupMenuDisplay: "none",
                })

                this.setCookie('SVGChildren', JSON.stringify(_newSVGChildren));

            }//end of if(doubleconfirm)
        }//end of if(disable)
    }// end of delete

    saveMap() {//FIXME:
        // saveSvgAsPng(document.getElementById('mind_map_node_container'),'mind-map.png');

        let _svgData = new XMLSerializer().serializeToString(document.getElementById('mind_map_node_container'));
        
        //TODO:
        
        let _img = document.createElement("img");
        let _canvas = document.createElement("canvas");
        let _ctx = _canvas.getContext("2d");

        _img.setAttribute("src","data:image/svg+xml;charset=utf8,"+encodeURIComponent(_svgData));
        _img.onload = function() {
            _ctx.drawImage(_img,0,0);

            console.log(_canvas.toDataURL("image/png"));

            let _link = document.createElement("a");
            _link.download = 'mind-map.png';
            _link.href = _canvas.toDataURL("image/png");
            document.body.appendChild(_link);
            _link.click();
            document.body.removeChild(_link);
        }

       
    }

    render() {

        return (
            <MainContainer>
                <Menu > 
                    <MenuItem onClick={this.clearNodes} style={{'backgroundColor':'red'}}>Clear Nodes</MenuItem>
                    {/* <MenuItem onClick={this.saveMap}>Save</MenuItem>  */}
                </Menu>
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