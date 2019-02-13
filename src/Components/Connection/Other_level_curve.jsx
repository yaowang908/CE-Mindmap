import React, { Component, Fragment } from "react";
import Curve from './Curve.jsx';

export default class Other_level_curve extends Component {
    constructor(props) {
        super(props);
        this.direction = this.direction.bind(this);
        this.position = this.position.bind(this);
        this.setUpBranches = this.setUpBranches.bind(this);
        this.level_1_nodes_container = [];
        this.lower_level_nodes_container = [];
        this.branches = {};
        this.state={
            SVGChildren: [],
        }
    }

    componentWillMount() {
        this.level_1_nodes_container = this.props.SVGChildren.filter(node => node.class === 'level_1');
        this.lower_level_nodes_container = this.props.SVGChildren.filter(node => {
            if (node.class !== 'mainNode' && node.class !== 'level_1') {
                return true;
            } else {
                return false;
            }
        });
        this.branches = this.setUpBranches(this.level_1_nodes_container,this.lower_level_nodes_container);
        console.dir(this.branches);
    }

    componentWillReceiveProps(nextProps) {
        this.level_1_nodes_container = nextProps.SVGChildren.filter(node=>node.class==='level_1');
        this.lower_level_nodes_container = nextProps.SVGChildren.filter(node=>{
            if(node.class !== 'mainNode' && node.class !== 'level_1') {
                return true;
            } else {
                return false;
            }
        });
        this.branches = this.setUpBranches(this.level_1_nodes_container, this.lower_level_nodes_container);
    }

    componentDidMount() {
    }

    setUpBranches(level_1_nodes,lower_nodes) {
        let _temp = []
        level_1_nodes.map(item=>{
            _temp.push(getChildren(item.id,lower_nodes))
        });
        /**
         * each branch is an object
         *  contains root node(level_1 node)
         *  direct child node
         *      each child node is same as branch object
         */

         function getChildren(rootID,nodes) {
             if (nodes.filter(item => item.parent === rootID)) {
                let branchNodes = nodes.filter(item => item.parent === rootID).map(n => { return n.id });
                return {
                    rootNode: rootID,
                     children: branchNodes.map(x=>getChildren(x,nodes))
                 };
             } else {
                return false;
             }

        }
        // console.dir(this.branches);
        return _temp;
    }

    direction() {

    }

    position() {

    }

    render() {
        return (
            <Fragment>

            </Fragment>
        );
    }
}