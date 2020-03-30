import React, { Component } from 'react';
import { connect } from "react-redux";

import Board from './Board';
import { fetchGames } from "../actions/game.action";
import axios from "axios";

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_x_next: true,
            moveNo: 0,
            history: [
                { squares: Array(9).fill(null) }
            ],
            current_game_code: ''
        }
    }
    startGame(step) {

        if (!step) { //New Game Start
            let newGameCode = 'game_code' + new Date().getTime();
            axios.post('http://localhost:4000/api/new-match', { game_code: newGameCode })
                .then(res => {
                    localStorage.setItem('current_game_code', newGameCode);
                    localStorage.removeItem('next_player_x');
                    this.setState({
                        moveNo: step,
                        is_x_next: (step % 2) === 0,
                        history: [
                            { squares: Array(9).fill(null) }
                        ]
                    })
                    alert("You can start playing!")
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    handleClick(i) {
        let requestData = {
            "player": this.state.is_x_next ? "X" : 'O',
            "sqr_no": i + 1,
            "game_code": this.state.current_game_code
        }

        if (this.state.current_game_code) {
            //Update Match API call
            axios.put('http://localhost:4000/api/update-match', requestData)
                .then(res => {
                    if (res.status == 200) {
                        const history = this.state.history.slice(0, this.state.moveNo + 1);
                        const current = history[history.length - 1];
                        const squares = current.squares.slice();
                        const winner = calculateWinner(squares);

                        if (winner || squares[i]) {
                            return;
                        }
                        squares[i] = this.state.is_x_next ? 'X' : 'O';


                        this.setState({
                            history: history.concat({
                                squares: squares
                            }),
                            is_x_next: !this.state.is_x_next,
                            moveNo: history.length
                        });
                        localStorage.setItem('next_player_x', this.state.is_x_next);

                    } else {
                        alert("Not Happening!!")
                    }
                })
                .catch(err => {
                    console.log(err)
                })

        } else {
            alert("Please, start the game first!!")
        }

    }


    async componentDidMount() {
        await this.props.fetchGames();
        //Load Next player after page refresh
        if (localStorage.getItem('next_player_x') != null) this.state.is_x_next = JSON.parse(localStorage.getItem('next_player_x'));

        if (localStorage.getItem('history')) {
            this.setState({
                history: JSON.parse(localStorage.getItem('history'))
            })

        }
    }


    render() {
        //Resume after page refresh

        if (this.props.all_games) {
            let current_game = this.props.all_games.filter(function (el) {
                return el.game_code == localStorage.getItem('current_game_code');
            });
            let loaded_squares = [];
            if (current_game[0]) {
                loaded_squares = [
                    current_game[0].box_1,
                    current_game[0].box_2,
                    current_game[0].box_3,
                    current_game[0].box_4,
                    current_game[0].box_5,
                    current_game[0].box_6,
                    current_game[0].box_7,
                    current_game[0].box_8,
                    current_game[0].box_9
                ]
            }
            this.state.history[0].squares = loaded_squares;
        }


        this.state.current_game_code = localStorage.getItem('current_game_code');
        const history = this.state.history;
        if (history.length > 1) localStorage.setItem('history', JSON.stringify(history));

        const current = history[this.state.moveNo];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? 'Move #' + move : 'Start';
            if (!move) {
                return (
                    <li key={move}>
                        <button onClick={() => { this.startGame(move) }}>
                            {desc}
                        </button>
                    </li>
                )
            } else {
                return (
                    <li key={move}>
                        {desc}
                    </li>
                )
            }
        });
        let status;
        if (winner) {
            status = 'Winner is ' + winner;
        } else {
            status = 'Next Player is ' + (this.state.is_x_next ? 'X' : 'O');
        }


        return (
            <div className="game">
                <div className="game-info">
                    <div>{status}</div>
                </div>
                <div className="game-board">
                    <Board onClick={(i) => this.handleClick(i)}
                        squares={current.squares} />
                </div>
                <div className="game-info">
                    <ul>{moves}</ul>
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}


function mapStateToProps(state) {
    return {
        all_games: state.game
    }
}


export default connect(mapStateToProps, { fetchGames })(Game);