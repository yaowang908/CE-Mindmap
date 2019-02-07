import React, { Component } from "react";
import styled from "styled-components";
import Sectors from "./SectorMenu.jsx";
import SectorText from "./SectorText.jsx";


const PopupMenuContainer = styled.div`
    width: 400px;
    height: 400px;
    // border: 1px #bfbfbf solid;
    position: absolute;
    // display: none;
`; 

const MainMenuContainer = styled.div`
    width: 250px;
    height: 250px;
    margin: 75px;
    border-radius: 50%;
    border: 1px #bfbfbf solid;
`;

const InnerMenuContainer = styled.div`
    width: 100px;
    height: 100px;
    margin: 75px;
    border-radius: 50%;
    border: 1px #bfbfbf solid;
    background-color: #fff;
    position: absolute;
    z-index: 100;
    user-select: none;
`;

export default class PopupMenu extends Component {
    constructor(props){
        super(props);
        this.hide = this.hide.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this._editOnClick = this._editOnClick.bind(this);
        this.setMenuContext = this.setMenuContext.bind(this);
        this.addLowerMenuClicked = this.addLowerMenuClicked.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.state= {
            containerWidth: 400, 
            radius: 125,
            fillColor: "rgb(115,161,191)",
            strokeColor: "rgb(57,80,96)",
            display: "none",
            left: 0,
            top: 0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            callerInfo:{},
            context:{},
        }
    }

    hide(e) {
        // console.log(e.nativeEvent.target.localName);
        if (e.nativeEvent.target.localName === "svg" || "div") {
            //"svg":hide popup menu when click outside sector menus
            //"div": hide menu when click on popupmenu container div
            this.setState({
                display: "none"
            });
        }
    }

    _editOnClick(e){
        //popup menu onclick function
        let elementID = e.nativeEvent.target.id;
        if (elementID === "popup_menu_0") {
            //when user clicked edit menu
            console.log("Edit");
            let callerNode = document.getElementById(this.state.callerInfo.id);//get the actual node that user clicked on
            // let newNodeWidth = MenuFunctionEdit(callerNode);

            let editor = document.getElementById("node_text_editor");
            let rect = callerNode.getBoundingClientRect();//get target element position
            // console.dir(rect);
            let textHolder = callerNode.children[1].children[0];
            let formerText = textHolder.textContent;//get text content of this caller SVG node
            console.log(formerText);
            let newText = "";//text holder for users input 

            editor.setAttribute("value", `${formerText}`);
            editor.setAttribute(
                "style", `
                left: ${rect.left}px;
                top: ${rect.top + rect.height / 2}px;
                width: ${rect.width}px;
                height: ${rect.height / 2}px;
                display: block;
                position: absolute;
                z-index: 1200;
            `);
            editor.focus();//set focus to input editor
        }
    }

    keyDownHandler(e) {
        let editor = document.getElementById("node_text_editor");
        let userInput;
        if((e.code === 'Enter' || e.code === 'NumpadEnter') && editor === document.activeElement) {
            document.activeElement.blur();

            userInput = editor.value;

            //TODO:update node text
            //update node width
            this.props.getNewNodeContent(userInput, this.state.callerInfo);


            editor.setAttribute(
                "style", `
                left: 0px;
                top: 0px;
                display: none;
                position: absolute;
                z-index: 1200;
            `);//hide editor
        }
    }

    clickHandler(e) {
        let editor = document.getElementById("node_text_editor");
        let userInput;
        if ((e.type === 'click') && e.target.id === 'mind_map') {
            document.activeElement.blur();
            userInput = editor.value;

            //TODO:update node text
            //update node width
            this.props.getNewNodeContent(userInput, this.state.callerInfo);

            editor.setAttribute(
                "style", `
                left: 0px;
                top: 0px;
                display: none;
                position: absolute;
                z-index: 1200;
            `);//hide editor
        }
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener("keydown",this.keyDownHandler);
        window.addEventListener("click",this.clickHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("click", this.clickHandler);
    }

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    }

    horizontalBorder(propsLeft) {
        let pointToLeft = propsLeft - this.state.containerWidth / 2;
        if (propsLeft < this.state.radius ) {
            //left exceeded
            return this.state.radius - this.state.containerWidth / 2;
        } else if (this.state.windowWidth - propsLeft < this.state.radius ) {
            //right exceeded
            return this.state.windowWidth - this.state.radius - this.state.containerWidth / 2;
        } else {
            return pointToLeft;
        }
    }

    verticalBorder(propsTop) {
        let pointToTop = propsTop - this.state.containerWidth / 2;
        if (propsTop < this.state.radius) {
            //top exceeded
            return this.state.radius - this.state.containerWidth / 2;
        } else if (this.state.windowHeight - propsTop < this.state.radius) {
            //bottom exceeded
            return (this.state.windowHeight - this.state.radius - this.state.containerWidth / 2);
        } else {
            return pointToTop;
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setMenuContext(nextProps);
    }

    setMenuContext(nextProps) {
        let _thisCallerInfo = nextProps.callerInfo ? nextProps.callerInfo : this.state.callerInfo;
        let _callerID = _thisCallerInfo.id;
        let _callerClass = _thisCallerInfo.classList[0];
        let _callerParent = _thisCallerInfo.parent;
        let _callerChildren = _thisCallerInfo.children;

        // console.log("ID: "+_callerID);
        // console.log("Class: "+_callerClass);
        // console.log("Parent: "+_callerParent);
        // console.log("Children: "+_callerChildren);

        let index = ['popup_menu_0', 'popup_menu_1', 'popup_menu_2', 'popup_menu_3', 'popup_menu_4', 'popup_menu_5', 'popup_menu_6'];
        
        function creatContextOBJ(menuStatusArray) {
            //generate menucontext object
            let tmp = {};
            // let disabledOrNot = [false, true, true, true, true, true, false];
            let disabledOrNot = menuStatusArray;
            //edit,add_upper,move_up,add_sibling,delete,move_down,add_lower
            index.map((elt, index) => {
                tmp[elt] = {
                    disable: disabledOrNot[index],
                    callerID: _callerID,
                    callerClass: _callerClass,
                    callerParent: _callerParent,
                    callerChildren: _callerChildren
                }
            });
            return tmp;
        }
        
        if(_callerID === "node_1") {
            //called by main node
            let _context = creatContextOBJ([false, true, true, true, true, true, false]);
                                        //edit,add_upper,move_up,add_sibling,delete,move_down,add_lower
                                        //if true then disabled
            this.setState({
                display: nextProps.display ? nextProps.display : this.state.display,
                left: nextProps.left ? this.horizontalBorder(nextProps.left) : this.state.left,
                top: nextProps.top ? this.verticalBorder(nextProps.top) : this.state.top,
                callerInfo: nextProps.callerInfo ? nextProps.callerInfo : this.state.callerInfo,
                context: _context
            });
        } else {
            let _context = creatContextOBJ([false, true, true, false, false, false, false]);
            this.setState({
                display: nextProps.display ? nextProps.display : this.state.display,
                left: nextProps.left ? this.horizontalBorder(nextProps.left) : this.state.left,
                top: nextProps.top ? this.verticalBorder(nextProps.top) : this.state.top,
                callerInfo: nextProps.callerInfo ? nextProps.callerInfo : this.state.callerInfo,
                context: _context
            });
        }
    }

    componentWillMount() {
        //only run once when DOM init
        this.setState({
            callerInfo: this.props.callerInfo ? this.props.callerInfo : this.state.callerInfo,
        });
    }

    addLowerMenuClicked(menuContext) {//get value from child node, and pass to parent node
        this.props.clickToAdd(menuContext);
    }

    render() {
        return(
            <PopupMenuContainer 
                style={{ 
                        "display": this.state.display, 
                        "left": this.state.left, 
                        "top": this.state.top,
                        "z-index":"1000"
                    }}
                onClick={this.hide}
                id={'popup_menu'}
            > 
                <SectorText anchorID="popup_menu_0" transform="translate(185px,185px)" color="rgb(115, 161, 191)">
                    Edit
                </SectorText>

                <SectorText anchorID="popup_menu_1" transform="translate(255px,126px)" >Add Upper</SectorText>
                <SectorText anchorID="popup_menu_2" transform="translate(170px,106px)" >Move Up</SectorText>
                <SectorText anchorID="popup_menu_3" transform="translate(95px,126px)" >Add Sibling</SectorText>
                <SectorText anchorID="popup_menu_4" transform="translate(95px,226px)" >Delete</SectorText>
                <SectorText anchorID="popup_menu_5" transform="translate(180px,257px)" >Move Down</SectorText>
                <SectorText anchorID="popup_menu_6" transform="translate(250px,216px)" >Add Lower</SectorText>

                <svg style={{"position":"absolute","width":"250px","height":"250px","top":"75px","left":"75px"}}
                        viewBox="0 0 250 250"
                >
                    <Sectors id="popup_menu_1" /* Add Upper */
                        callerID={this.state.context.callerID} 
                        menuContext={this.state.context.popup_menu_1}></Sectors>
                    <Sectors id="popup_menu_2" /* Move Up */
                        transform="rotate(-60,125,125)" 
                        callerID={this.state.context.callerID} 
                        menuContext={this.state.context.popup_menu_2}></Sectors>
                    <Sectors id="popup_menu_3" /* Add sibling */
                        transform="rotate(-120,125,125)" 
                        callerID={this.state.context.callerID} 
                        menuContext={this.state.context.popup_menu_3}></Sectors>
                    <Sectors id="popup_menu_4" /* DELETE */
                        transform="rotate(-180,125,125)" 
                        fillColor="#f44b42" 
                        callerID={this.state.context.callerID} 
                        menuContext={this.state.context.popup_menu_4}></Sectors>
                    <Sectors id="popup_menu_5" /* Move Down */
                        transform="rotate(120,125,125)" 
                        callerID={this.state.context.callerID} 
                        menuContext={this.state.context.popup_menu_5}></Sectors>
                    <Sectors id="popup_menu_6" /* Add Lower */
                        transform="rotate(60,125,125)" 
                        callerID={this.state.context.callerID} 
                        menuContext={this.state.context.popup_menu_6}
                        clickedOrNot={this.addLowerMenuClicked}
                        ></Sectors>
                    
                </svg>
                <MainMenuContainer>
                    
                    <InnerMenuContainer id="popup_menu_0" onClick={this._editOnClick} menuContext={this.state.context.popup_menu_0}>

                    </InnerMenuContainer>
                    
                </MainMenuContainer>
            </PopupMenuContainer>
        );
    }
}