import React, { Component } from "react";
import styled from "styled-components";

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
    // border: 1px #bfbfbf solid;
`;

const OutterCircleSectorTemplate = styled.div`
    width: 250px;
    height: 125px;
    overflow:hidden;
    position: absolute;
    left: 75px;
    top: 75px;
    z-index: 1;
    background: transparent;
    box-sizing: border-box;
    &:before {
        height: inherit;
        width: inherit;
        position: absolute;
        content: "";
        border-radius: 125px 125px 0 0;
        // background-color: crimson;
        background: transparent;
        border: 1px crimson solid;
        box-sizing: border-box;
        transform-origin: 50% 100%;
        transform: rotate(120deg);
    }
`;

const OutterCircleSector = styled(OutterCircleSectorTemplate)`
    transform: rotate(${props => props.degree || '0deg'});
    transform-origin: 50% 100%;
    &:before {
        // background-color: ${props => props.color || '#49A7BE'};
        border: 2px ${props => props.color || '#49A7BE'} solid;
    }
`;

const InnerMenuContainer = styled.div`
    width: 100px;
    height: 100px;
    margin: 75px;
    border-radius: 50%;
    // border: 1px #bfbfbf solid;
    background-color: #fff;
    position: absolute;
    z-index: 100;
    user-select: none;
`;

const InnerCircleSectorTemplate = styled.div`
    width: 100px;
    height: 50px;
    overflow:hidden;
    position: absolute;
    z-index: 200;
    box-sizing: border-box;
    position: absolute;
    &:before {
        height: inherit;
        width: inherit;
        position: absolute;
        content: "";
        border-radius: 100px 100px 0 0;
        // background-color: crimson;
        box-sizing: border-box;
        border: 1px crimson solid;
        transform-origin: 50% 100%;
        transform: rotate(90deg);
    }
`;

const InnerCircleSector = styled(InnerCircleSectorTemplate)`
    transform: rotate(${props => props.degree || '0deg'});
    transform-origin: 50% 100%;
    &:before {
        // background-color: ${props => props.color || '#49A7BE'};
        border: 1px ${props => props.color || '#49A7BE'} solid;
    }
`;

const MenuTextContainer = styled.span`
    display: block;
    position: absolute;
    right: ${props => props.right || "15px"};
    bottom: ${props => props.bottom || "20px"};
    transform: none;
`;

export default class PopupMenu extends Component {
    constructor(props){
        super(props);
        this.state= {

        }
    }

    render() {
        return(
            <PopupMenuContainer>
                <MainMenuContainer>
                    
                    <InnerMenuContainer>

                        <MenuTextContainer>编辑</MenuTextContainer>
                        <MenuTextContainer right="15px" bottom="55px">上移</MenuTextContainer>
                        <MenuTextContainer right="55px" bottom="55px">下移</MenuTextContainer>
                        <MenuTextContainer right="55px" bottom="20px">删除</MenuTextContainer>

                        <InnerCircleSector degree="0deg" color="#49BE79"></InnerCircleSector>
                        <InnerCircleSector degree="-90deg" color="#49BEB3"></InnerCircleSector>
                        <InnerCircleSector degree="-180deg" color="#498EBE"></InnerCircleSector>
                        <InnerCircleSector degree="-270deg" color="#4954BE"></InnerCircleSector>

                    </InnerMenuContainer>

                    <OutterCircleSector degree="0deg"    color="#49BE79"></OutterCircleSector>
                    <OutterCircleSector degree="-60deg"  color="#49BEB3"></OutterCircleSector>
                    <OutterCircleSector degree="-120deg" color="#498EBE"></OutterCircleSector>
                    <OutterCircleSector degree="-180deg" color="#4954BE"></OutterCircleSector>
                    <OutterCircleSector degree="-240deg" color="#7949BE"></OutterCircleSector>
                    <OutterCircleSector degree="-300deg" color="#B449BE"></OutterCircleSector>
                    
                </MainMenuContainer>
            </PopupMenuContainer>
        );
    }
}