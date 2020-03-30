export const ALL_GAMES = 'ALL_GAMES';

export function setGames(all_games) {
    return {
        type: ALL_GAMES,
        all_games
    }
}

export function fetchGames() {
    return dispatch => {
        fetch('http://localhost:4000/api/get-games')
            .then(res => res.json())
            .then(data=>{
                dispatch(setGames(data))
            })
    }
}