import React, { Component } from "react";
import styled from "styled-components";

const TextContainer = styled.span`
    width: 75px;
    height: 75px;
    font-family: 'Staatliches', cursive;
    font-size: 1.5em;
    color: #fff;
    position: absolute;
    z-index: 300;
    cursor: pointer;
    user-select: none;
`;

export default class SectorText extends Component{
    constructor(props) {
        super(props);
        this.state={
            anchorID: "",
            transform:"",
            color:"#FFF"
        }
    }

    componentWillMount(){
        this.setState({
            anchorID: this.props.anchorID ? this.props.anchorID : this.state.anchorID,
            transform: this.props.transform ? this.props.transform : this.state.transform,
            color: this.props.color ? this.props.color : this.state.color
        });
    }

    render() {
        return (
            <TextContainer id={this.state.anchorID + '_text'} style={{"transform":this.state.transform,"color":this.state.color}}>
                {this.props.children}
            </TextContainer>
        );
    }
}