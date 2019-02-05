import React, { Component } from "react";
import Node from "../Node.jsx";
import $ from "jquery";

export default function MenuFunctionAddLower(children) {
    /**
     * children contains all nodes,except mainNode
     * each node have {id,siblings,class,parent}
     */
        console.log("Add Lower Node function got called!");
        console.dir(children);

        let _nodes = [];

        //level_1 nodes
        let _nodes_level_1 = children.filter(child => child.class === "level_1");

        _nodes_level_1 = Level_1_node_positioning(_nodes_level_1);

        console.log("Result _nodes_level_1: ");
        console.dir(_nodes_level_1);

        let _thisChildren = children.filter(child => {
            if (typeof _nodes_level_1[child.id] === 'undefined') {
                return child;
            } else {
                console.dir(_nodes_level_1[child.id]);
                return _nodes_level_1[child.id];
            }
        });

        console.log("Result _thisChildren: ");
        console.dir(_thisChildren);

        /**TODO: 
        * 1. level_1 nodes surround mainNode
        * 2. even or not, less than 2, or more than 3
        * 3. lower level nodes all go one direction
        */

        /**TODO: 
        * 1. add child node
        * 2. move to right position
        * 3. make a curve line connect parent node and child node
        *  
        * */
        let random = Math.random() * 200 + 100;

        for (var i = 0; i < _thisChildren.length; i += 1) {
            _nodes.push(<Node childClassName={_thisChildren[i].class}
                childID={_thisChildren[i].id}
                startX={_thisChildren[i].left}//TODO:
                startY={_thisChildren[i].top}//TODO:
                width={"100"}//original width
                height={"50"}//original height
                transform={""}
                text={"New Node"}
                nodeParent={_thisChildren[i].parent}
                nodeChildren={[]}
            />);
        };
        return _nodes;
} 

function Level_1_node_positioning(_nodes_level_1){
    $(function(){
        //get main_node position 
        let _mainNodePosition = document.getElementById("node_1").getBoundingClientRect();
        let _svgBodySize = document.getElementById("mind_map").getBoundingClientRect();

        console.dir(_svgBodySize);

        let potentialChildNodesPostions_x_left = Number(_mainNodePosition.left) - Number(_mainNodePosition.height);
        let potentialChildNodesPostions_x_right = Number(_mainNodePosition.left) + Number(_mainNodePosition.width) + Number(_mainNodePosition.height);
        let potentialChildNodesPostions_y_top = Number(_mainNodePosition.height) * 2;
        let potentialChildNodesPostions_y_bottom = Number(_svgBodySize.bottom) - (Number(_mainNodePosition.height) * 2);

        if (_nodes_level_1.length === 1) {
            //only one child node
            _nodes_level_1[0]['left'] = potentialChildNodesPostions_x_right;
            _nodes_level_1[0]['top'] = _mainNodePosition.height * 5;

        } else if (_nodes_level_1.length === 2) {
            _nodes_level_1[0]['left'] = potentialChildNodesPostions_x_right;
            _nodes_level_1[0]['top'] = _mainNodePosition.height * 5;

            _nodes_level_1[1]['left'] = potentialChildNodesPostions_x_right;
            _nodes_level_1[1]['top'] = _mainNodePosition.height * 10;

        } else if (_nodes_level_1.length > 2 && (_nodes_level_1.length) % 2 === 0) {
            //level 1 nodes amount is even number
            let breakingIndex = Number(_nodes_level_1.length / 2 - 1);
            let endingIndex = Number(_nodes_level_1.length - 1);

            let spaceBetweenNodes = (potentialChildNodesPostions_y_bottom - Number(_mainNodePosition.height) - potentialChildNodesPostions_y_top) / breakingIndex;
            //nodes are positioned by top border, 2 node-height to svg top border, 2 node-height to the bottom
            for (let i = 0; i <= breakingIndex; i++) {
                //assign right arm node position
                //relative to mainNode position, regards left-top corner of the current node
                _nodes_level_1[i]['left'] = potentialChildNodesPostions_x_right;
                _nodes_level_1[i]['top'] = spaceBetweenNodes * i;
            }

            for (let i = breakingIndex + 1; i < _nodes_level_1.length; i++) {
                //TODO: assign left arm node position
                //FIXME: left value is not intended
                _nodes_level_1[i]['left'] = potentialChildNodesPostions_x_left;
                _nodes_level_1[i]['top'] = spaceBetweenNodes * (i - breakingIndex);
            }
        } else if (_nodes_level_1.length > 2 && (_nodes_level_1.length) % 2 === 1) {
            //level 1 nodes amount is odd number
            //filled in right arm first, then left arm
            let breakingIndex = Number((_nodes_level_1.length + 1) / 2 - 1);
            let endingIndex = Number(_nodes_level_1.length - 1);

            let spaceBetweenNodes = (potentialChildNodesPostions_y_bottom - Number(_mainNodePosition.height) - potentialChildNodesPostions_y_top) / breakingIndex;
            // console.dir(spaceBetweenNodes);
            //nodes are positioned by top border, 2 node-height to svg top border, 2 node-height to the bottom
            for (let i = 0; i <= breakingIndex; i++) {
                //assign right arm node position
                //relative to mainNode position, regards left-top corner of the current node
                _nodes_level_1[i]['left'] = potentialChildNodesPostions_x_right;
                _nodes_level_1[i]['top'] = spaceBetweenNodes * i;
            }

            for (let i = breakingIndex + 1; i < _nodes_level_1.length; i++) {
                //TODO: assign left arm node position
                //FIXME: left value is not intended
                _nodes_level_1[i]['left'] = potentialChildNodesPostions_x_left;
                _nodes_level_1[i]['top'] = spaceBetweenNodes * (i - breakingIndex);
            }
        }
    });
        

        return _nodes_level_1;
}

