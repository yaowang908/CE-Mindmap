import React, { Component, Fragment } from "react";
import Level_1_curve from './Level_1_curve.jsx';
import Other_level_curve from './Other_level_curve.jsx';

export default class Connection extends Component {
    constructor(props) {
        super(props);
        this.getMainNodeSpecs = this.getMainNodeSpecs.bind(this);
        this.getFirstLevelNodeSpecs = this.getFirstLevelNodeSpecs.bind(this);
        this.state={
            mainNodeSpecs : {},
            firstLevelNodeSpecs : [],
            SVGChildren: []
        };
    }

/**
 * 1. get mainNode position   ===>  getBBox or getClientRect
 *      1.everything main node get draged, pass in new position to refresh
 * 2. get mainNode left & right anchor point  ===> calculation
 * 3. connect level_1 nodes to mainNode ===> <Curve>
 */
    componentWillMount() {
        this.setState({
            SVGChildren: this.props.SVGChildren
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            SVGChildren: nextProps.SVGChildren ? nextProps.SVGChildren : this.state.SVGChildren
        });
    }

    getMainNodeSpecs() {
        let _mainNode = document.getElementById('node_1').getBoundingClientRect();
        return _mainNode;
    }

    getFirstLevelNodeSpecs() {
        let _firstLevelNodesSpecs = [];
        let _firstLevelNodes = this.state.SVGChildren.filter(node=>node.class === 'level_1');

        _firstLevelNodes.map(node=>{
            _firstLevelNodesSpecs.push({
                id: node.id,
                specs: document.getElementById(node.id).querySelectorAll('path')[0].getBoundingClientRect()
            });
        });
        return _firstLevelNodesSpecs;
    }

    componentDidMount() {
        setTimeout(() => {//otherwise height and bottom will be rideculous big
            this.setState({
                mainNodeSpecs: this.getMainNodeSpecs(),
                firstLevelNodeSpecs: this.getFirstLevelNodeSpecs()
            });
        }, 0);   
    }

    componentWillUpdate() {
        setTimeout(() => {//otherwise height and bottom will be rideculous big
            this.setState({
                mainNodeSpecs: this.getMainNodeSpecs(),
                firstLevelNodeSpecs: this.getFirstLevelNodeSpecs()
            });
        }, 0);
    }

    render() {
        return(
            <svg id="connection" x="0" y="0">
                <Level_1_curve mainNodeSpecs={this.state.mainNodeSpecs}
                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Level_1_curve>
                <Other_level_curve SVGChildren={this.state.SVGChildren}
                                    mainNodeSpecs={this.state.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Other_level_curve>
            </svg>
        );
    }
}



