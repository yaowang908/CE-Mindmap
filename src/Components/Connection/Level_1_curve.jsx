import React, { Component, Fragment } from "react";
import Curve from './Curve.jsx';

export default class Level_1_curve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLevelNodeSpecs: [],
            mainNodeSpecs: {}
        }
    }

    componentWillMount() {
        this.setState({
            firstLevelNodeSpecs: this.props.firstLevelNodeSpecs,
            mainNodeSpecs: this.props.mainNodeSpecs
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            firstLevelNodeSpecs: nextProps.firstLevelNodeSpecs ? nextProps.firstLevelNodeSpecs : this.state.firstLevelNodeSpecs,
            mainNodeSpecs: nextProps.mainNodeSpecs ? nextProps.mainNodeSpecs : this.state.mainNodeSpecs
        });
    }

    render() {
        return (
            <Fragment>
                {
                    this.state.firstLevelNodeSpecs.map(node => {
                        if (this.state.mainNodeSpecs.left
                            && (this.state.mainNodeSpecs.right < node.specs.left
                                || node.specs.right < this.state.mainNodeSpecs.left
                            )
                        ) {//anchor point is on left or right border
                            //mainNodeSpecs get passed in after parent node componentDidMount, 
                            //so there is two statement, if(this.state.mainNodeSpecs.left) ruled out the other 
                            /**
                             *          --------
                             *         |        |
                             *          --------   \
                             *                      \  
                             *                       \    --------
                             *                        \  |        |
                             *                            --------
                             */
                            if (node.specs.left > this.state.mainNodeSpecs.right) {
                                //node is to the right of main node
                                return <Curve leftEnd={[this.state.mainNodeSpecs.right, (this.state.mainNodeSpecs.height / 2 + this.state.mainNodeSpecs.top)]}
                                    rightEnd={[node.specs.left, (node.specs.height / 2 + node.specs.top)]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.state.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;
                            } else if (node.specs.right < this.state.mainNodeSpecs.left) {
                                //node is to the left of main node
                                return <Curve leftEnd={[node.specs.right, (node.specs.height / 2 + node.specs.top)]}
                                    rightEnd={[this.state.mainNodeSpecs.left, (this.state.mainNodeSpecs.height / 2 + this.state.mainNodeSpecs.top)]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.state.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;
                            }

                        } else if (this.state.mainNodeSpecs.left
                            && (this.state.mainNodeSpecs.right >= node.specs.left
                                && node.specs.right >= this.state.mainNodeSpecs.left
                            )
                        ) {//anchor points are on top or bottom border of the two nodes
                            /**
                             *          --------
                             *         |        |
                             *          --------
                             *                  \
                             *               --------
                             *              |        |
                             *               --------
                             */
                            if (this.state.mainNodeSpecs.top > node.specs.bottom) {
                                //node is to the top of main node
                                return <Curve leftEnd={[(node.specs.left + node.specs.width / 2), node.specs.bottom]}
                                    rightEnd={[(this.state.mainNodeSpecs.left + this.state.mainNodeSpecs.width / 2), this.state.mainNodeSpecs.top]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.state.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;

                            } else if (this.state.mainNodeSpecs.bottom < node.specs.top) {
                                //node is to the bottom of main node
                                return <Curve leftEnd={[(this.state.mainNodeSpecs.left + this.state.mainNodeSpecs.width / 2), this.state.mainNodeSpecs.bottom]}
                                    rightEnd={[(node.specs.left + node.specs.width / 2), node.specs.top]}
                                    start_node={'node_1'}
                                    end_node={node.id}
                                    mainNodeSpecs={this.state.mainNodeSpecs}
                                    firstLevelNodeSpecs={this.state.firstLevelNodeSpecs}></Curve>;
                            }
                        } else {
                            // haven't passed in mainNode specs
                        }

                    })
                }
            </Fragment>
        );
    }
}