import React, { Component } from "react";

export default class Sectors extends Component {
    constructor(props) {
        super(props);
        this._onClickSector = this._onClickSector.bind(this);
        this.state = {
            id:"",
            containerWidth: 400,
            radius: 125,
            fillColor: "rgb(115,161,191)",
            strokeColor: "rgb(57,80,96)",
            transform: "rotate(0,200,200)",
            textTransform:""
        }
    }

    _onClickSector(e) {
        let elementID = e.nativeEvent.target.parentElement.id;
        let element = e.nativeEvent.target.tagName;
        if (element = "path") {
            //click on sector menu
            switch(elementID) {
                case 'popup_menu_1':
                    console.log("Add upper");
                    break;
                case 'popup_menu_2':
                    console.log("Move Up");
                    break;
                case 'popup_menu_3':
                    console.log("add sibling");
                    break;
                case 'popup_menu_4':
                    console.log("DELETE");
                    // TODO: double confirm
                    break;
                case 'popup_menu_5':
                    console.log("Move Down");
                    break;
                case 'popup_menu_6':
                    console.log("Add Lower");
                    break;
            }
        }
    }

    componentWillMount() {
        this.setState({
            id: this.props.id ? this.props.id : this.state.id,
            containerWidth: this.props.containerWidth ? this.props.containerWidth : this.state.containerWidth,
            radius: this.props.radius ? this.props.radius: this.state.radius,
            fillColor: this.props.fillColor ? this.props.fillColor : this.state.fillColor,
            strokeColor: this.props.strokeColor ? this.props.strokeColor : this.state.strokeColor,
            transform: this.props.transform ? this.props.transform : this.state.transform,
            textTransform: this.props.textTransform ? this.props.textTransform : this.state.textTransform
        });
    }

    circleSectorMenuPath() {
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

    render(){
        return (
            <g
                transform={this.state.transform}
                id={this.state.id}
                onClick={this._onClickSector}    
            >
                <path
                    d={this.circleSectorMenuPath()}
                    fill={this.state.fillColor}
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