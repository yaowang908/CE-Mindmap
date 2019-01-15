import React, { Component } from "react";

export default class Sectors extends Component {
    constructor(props) {
        super(props);
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
            M ${ halfContainerWidth + radius * Math.cos(60 * Math.PI / 180)},${halfContainerWidth - radius * Math.sin(60 * Math.PI / 180)}
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