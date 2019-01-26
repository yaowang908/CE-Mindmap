import React, { Component } from "react";
import Node from "../Node.jsx";

export default function MenuFunctionAddLower(children) {
    /**
     * children contains all nodes,except mainNode
     * each node have {id,siblings,class,parent}
     */
   
    // console.log("Add Lower Node function got called!");
    // console.dir(children);

    let _nodes=[];
    /**TODO: 
     * 1. add child node
     * 2. move to right position
     * 3. make a curve line connect parent node and child node
     *  
     * */
    let random = Math.random()*200+100;

    for (var i = 0; i < children.length; i += 1) {
        _nodes.push(<Node childClassName={children[i].class}
                            childID={children[i].id}
                            startX={window.innerWidth / 2 + random}//TODO:
                            startY={window.innerHeight / 2 + random}//TODO:
                            width={"100"}//original width
                            height={"50"}//original height
                            transform={""}
                            text={"New Node"}
                            nodeParent={children[i].parent}
                            nodeChildren={[]}
                        />);
    };


    return _nodes
} 
