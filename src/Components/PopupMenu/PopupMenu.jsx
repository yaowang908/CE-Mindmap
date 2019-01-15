import React, { Component } from "react";
import styled from "styled-components";
import Sectors from "./SectorMenu.jsx";
import SectorText from "./SectorText.jsx";

const PopupMenuContainer = styled.div`
    width: 400px;
    height: 400px;
    border: 1px #bfbfbf solid;
    position: absolute;
    // left: 200px;
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
        this.state= {
            containerWidth: 400, 
            radius: 125,
            fillColor: "rgb(115,161,191)",
            strokeColor: "rgb(57,80,96)"
        }
    }

    render() {
        return(
            <PopupMenuContainer > 
                <SectorText anchorID="popup_menu_0" transform="translate(185px,185px)" color="rgb(115, 161, 191)">
                    Edit
                </SectorText>

                <SectorText anchorID="popup_menu_1" transform="translate(255px,126px)">Add Upper</SectorText>
                <SectorText anchorID="popup_menu_2" transform="translate(170px,106px)">Move Up</SectorText>
                <SectorText anchorID="popup_menu_3" transform="translate(95px,126px)">Add Sibling</SectorText>
                <SectorText anchorID="popup_menu_4" transform="translate(95px,226px)">Delete</SectorText>
                <SectorText anchorID="popup_menu_5" transform="translate(180px,257px)">Move Down</SectorText>
                <SectorText anchorID="popup_menu_6" transform="translate(250px,216px)">Add Lower</SectorText>

                <svg style={{"position":"absolute","width":"100%","height":"100%;"}}>
                    <Sectors id="popup_menu_1"></Sectors>
                    <Sectors id="popup_menu_2" transform="rotate(-60,200,200)" textTransform="rotate(60,200,100)"></Sectors>
                    <Sectors id="popup_menu_3" transform="rotate(-120,200,200)"></Sectors>
                    <Sectors id="popup_menu_4" transform="rotate(-180,200,200)" fillColor="#f44b42" ></Sectors>
                    <Sectors id="popup_menu_5" transform="rotate(120,200,200)" ></Sectors>
                    <Sectors id="popup_menu_6" transform="rotate(60,200,200)" ></Sectors>
                    
                </svg>
                <MainMenuContainer>
                    
                    <InnerMenuContainer>

                    </InnerMenuContainer>
                    
                </MainMenuContainer>
            </PopupMenuContainer>
        );
    }
}