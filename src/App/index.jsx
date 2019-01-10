import React, { Component } from "react";
import MainNode from "../Components/MainNode.jsx";
import Node from "../Components/Node";
import styled from "styled-components";
import PopupMenu from "../Components/PopupMenu.jsx";

const MainContainer =styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <MainContainer>
                <PopupMenu></PopupMenu>
                <svg 
                    id="mind_map"
                    width="100%"
                    height="100%" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <MainNode>Here is main nodeHere is main nodeHere is main node</MainNode>
                </svg> 
            </MainContainer>       
        );
    }
}