import React, { Component } from "react";
import styled from "styled-components";
import Sectors from "./SectorMenu.jsx";

const PopupMenuContainer = styled.div`
    width: 400px;
    height: 400px;
    border: 1px #bfbfbf solid;
    position: absolute;
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
            <PopupMenuContainer> 
                    <svg style={{"position":"absolute","width":"100%","height":"100%;"}}>
                        <Sectors>

                        </Sectors>
                        <Sectors transform="rotate(-60,200,200)" textTransform="rotate(60,200,100)">
                        {/* //TODO: prevent text rotation */}
                        </Sectors>
                        <Sectors transform="rotate(-120,200,200)">
                            
                        </Sectors>
                        <Sectors transform="rotate(-180,200,200)"></Sectors>
                        <Sectors transform="rotate(60,200,200)"></Sectors>
                        <Sectors transform="rotate(120,200,200)">
                            
                        </Sectors>
                    </svg>
                    <MainMenuContainer>
                        
                        <InnerMenuContainer>

                        </InnerMenuContainer>
                       
                    </MainMenuContainer>
            </PopupMenuContainer>
        );
    }
}