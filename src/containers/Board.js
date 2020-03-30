import React, { Component } from 'react';
import Square from '../components/Square';

export default class Board extends Component {
    gameBox(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
    }
    render() {
        return (
            <div>
                <div> {this.gameBox(0)} {this.gameBox(1)} {this.gameBox(2)}</div>
                <div>{this.gameBox(3)} {this.gameBox(4)} {this.gameBox(5)}</div>
                <div> {this.gameBox(6)} {this.gameBox(7)} {this.gameBox(8)}</div>
            </div>
        )
    }
}