import React, { Component } from "react";

export default class Sectors extends Component {
    constructor(props) {
        super(props);
        this._onClickSector = this._onClickSector.bind(this);
        this.ifMenuIsDisabled = this.ifMenuIsDisabled.bind(this);
        this.hidePopupMenu = this.hidePopupMenu.bind(this);
        this.state = {
            id:"",
            containerWidth: 400,
            radius: 125,
            fillColor: "rgb(115,161,191)",
            strokeColor: "rgb(57,80,96)",
            transform: "rotate(0,200,200)",
            textTransform:"",
            disabledColor: "rgb(85,101,112)",
            menuContext:{},
            callerID:''
        }
    }

    _onClickSector(e) {
        let elementID = e.nativeEvent.target.parentElement.id;
        let element = e.nativeEvent.target.tagName;
        if (element === "path") {
            //click on sector menu
            switch(elementID) {
                // case 'popup_menu_0':
                    //this case is not functioning, edit menu is different from other sector menu, its function is defined in PopupMenu.jsx
                //     break;
                case 'popup_menu_1':
                    // console.log("Add upper");
                    this.props.addUpper(this.state.menuContext);
                    break;
                case 'popup_menu_2':
                    // console.log("Move Up");
                    this.props.moveUp(this.state.menuContext);
                    break;
                case 'popup_menu_3':
                    // console.log("add sibling");
                    this.props.addSibling(this.state.menuContext);
                    break;
                case 'popup_menu_4':
                    // console.log("DELETE");
                    this.props.delete(this.state.menuContext);
                    break;
                case 'popup_menu_5':
                    // console.log("Move Down");
                    this.props.moveDown(this.state.menuContext);
                    break;
                case 'popup_menu_6':
                    // console.log("Add Lower");
                    // console.dir(e.nativeEvent.target);
                    // console.log(this.state.callerID);
                    this.props.clickedOrNot(this.state.menuContext);
                    // this.hidePopupMenu();
                    break;
            }
        }
    }

    hidePopupMenu() {
        document.getElementById("popup_menu").setAttribute("style","display: none");
    }

    componentWillMount() {
        this.setState({
            id: this.props.id ? this.props.id : this.state.id,
            containerWidth: this.props.containerWidth ? this.props.containerWidth : this.state.containerWidth,
            radius: this.props.radius ? this.props.radius: this.state.radius,
            fillColor: this.props.fillColor ? this.props.fillColor : this.state.fillColor,
            strokeColor: this.props.strokeColor ? this.props.strokeColor : this.state.strokeColor,
            transform: this.props.transform ? this.props.transform : this.state.transform,
            textTransform: this.props.textTransform ? this.props.textTransform : this.state.textTransform,
            menuContext: this.props.menuContext ? this.props.menuContext : this.state.menuContext,
            callerID: this.props.callerID ? this.props.callerID : this.state.callerID
        });
    }

    componentWillReceiveProps(nextProps) {
        //update states when pass in new props
        this.setState({
            id: nextProps.id ? nextProps.id : this.state.id,
            containerWidth: nextProps.containerWidth ? nextProps.containerWidth : this.state.containerWidth,
            radius: nextProps.radius ? nextProps.radius : this.state.radius,
            fillColor: nextProps.fillColor ? nextProps.fillColor : this.state.fillColor,
            strokeColor: nextProps.strokeColor ? nextProps.strokeColor : this.state.strokeColor,
            transform: nextProps.transform ? nextProps.transform : this.state.transform,
            textTransform: nextProps.textTransform ? nextProps.textTransform : this.state.textTransform,
            menuContext: nextProps.menuContext ? nextProps.menuContext : this.state.menuContext,
            callerID: nextProps.callerID ? nextProps.callerID : this.state.callerID
        });
    }

    circleSectorMenuPath() {
        //sector svg path
        let halfContainerWidth = this.state.containerWidth / 2;
        let radius = this.state.radius;
        return `
            M ${ radius + radius * Math.cos(60 * Math.PI / 180)},${radius - radius * Math.sin(60 * Math.PI / 180)}
            q ${ radius - radius * Math.cos(60 * Math.PI / 180)},${radius * Math.sin(60 * Math.PI / 180) - radius * Math.tan(30 * Math.PI / 180)}
              ${ radius - radius * Math.cos(60 * Math.PI / 180)},${radius * Math.sin(60 * Math.PI / 180)}
            h -${ radius}
            z 
        `;
    }

    ifMenuIsDisabled(color) {
        //return disable color for disabled menu sector
        if(this.state.menuContext.disable) {
            return this.state.disabledColor;
        } else {
            return color;
        }
    }

    render(){
        return (
            <g
                transform={this.state.transform}
                id={this.state.id}
                onClick={this._onClickSector}    
            >
                <path
                    d={this.circleSectorMenuPath()}
                    fill={this.ifMenuIsDisabled(this.state.fillColor)}
                    stroke={this.state.strokeColor}
                />
                <g transform={this.state.textTransform}>
                    {/* <text x="200" y="200" dx="50" dy="-50" class="small">Move</text>
                    <text x="200" y="200" dx="50" dy="-30" class="small">Down</text> */}
                </g>
                {this.props.children}
            </g>
        );
    }
}