import { ALL_GAMES } from "../actions/game.action";


function GameReducer(state = [], action = {}) {
    switch (action.type) {
        case ALL_GAMES:
            return action.all_games
        default:
            return state = [{
                    id: 1,
                    name: "Nafeo"
                },
                {
                    id: 2,
                    name: "Alam"
                },
                {
                    id: 3,
                    name: "Joy"
                }
            ];
    }
}

export default GameReducer;