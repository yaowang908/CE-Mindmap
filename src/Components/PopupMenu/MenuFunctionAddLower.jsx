import React, { Component } from "react";
import Node from "../Node.jsx";

export default function MenuFunctionAddLower(children) {
   
    console.log("Add Lower Node function got called!");

    let _nodes=[];
    /**TODO: 
     * 1. add child node
     * 2. move to right position
     * 3. make a curve line connect parent node and child node
     *  
     * */
    let random = Math.random()*100+100;

    for (var i = 0; i < children; i += 1) {
        _nodes.push(<Node childClassName={"node"}
                            childID={"node_2"}
                            startX={window.innerWidth / 2 + random}
                            startY={window.innerHeight / 2 + random}
                            width={"100"}
                            height={"50"}
                            transform={""}
                            text={"New Node"}
                            nodeParent={"node_1"}
                            nodeChildren={[]}
                        />);
    };


    return _nodes
} 
