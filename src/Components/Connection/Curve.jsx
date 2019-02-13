import React, { Component, Fragment } from "react";

export default class Curve extends Component {
    constructor(props) {
        super(props);
        this.curve = this.curve.bind(this);
        this.state = {
            leftEnd: [0, 0],
            rightEnd: [100, 100],
            fillColor: 'none',
            strokeColor: '#07a',
            strokeWidth: '2'
        }
    }
    componentWillMount() {
        this.setState({
            leftEnd: this.props.leftEnd ? this.props.leftEnd : this.state.leftEnd,
            rightEnd: this.props.rightEnd ? this.props.rightEnd : this.state.rightEnd
        });
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            leftEnd: nextProps.leftEnd ? nextProps.leftEnd : this.state.leftEnd,
            rightEnd: nextProps.rightEnd ? nextProps.rightEnd : this.state.rightEnd
        });
    }

    /**
     * props.leftEnd = [x,y]
     * props.rightEnd = [x,y]
     */
    curve() {
        let direction = this.state.leftEnd[1] < this.state.rightEnd[1] ? 'up' : (this.state.leftEnd[1] === this.state.rightEnd[1] ? 'flat' : 'down');
        //up flat down
        if (direction !== 'flat') {
            // up or down
            let midPoint = [(this.state.leftEnd[0] + this.state.rightEnd[0]) / 2,
            (this.state.leftEnd[1] + this.state.rightEnd[1]) / 2]
            let firstAnchorPoint = [midPoint[0], this.state.leftEnd[1]];
            let secondAnchorPoint = [midPoint[0], this.state.rightEnd[1]];


            return <path d={`
                                M ${this.state.leftEnd[0]},${this.state.leftEnd[1]}
                                Q ${firstAnchorPoint[0]},${firstAnchorPoint[1]}
                                    ${midPoint[0]},${midPoint[1]}
                                T ${this.state.rightEnd[0]},${this.state.rightEnd[1]}
                            `}
                fill={this.state.fillColor}
                stroke={this.state.strokeColor}
                strokeWidth={this.state.strokeWidth}
                data-start_node={this.props.start_node}
                data-end_node={this.props.end_node} />
                ;
        } else {
            //flat
            return <path d={`
                                M ${this.state.leftEnd[0]},${this.state.leftEnd[1]}
                                L ${this.state.rightEnd[0]},${this.state.rightEnd[1]}
                            `}
                fill={this.state.fillColor}
                stroke={this.state.strokeColor}
                strokeWidth={this.state.strokeWidth}
                data-start_node={this.props.start_node}
                data-end_node={this.props.end_node} />
                ;
        }
    }

    render() {
        return (
            <Fragment>
                {this.curve()}
            </Fragment>
        );
    }
}