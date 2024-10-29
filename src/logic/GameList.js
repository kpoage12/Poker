import Game from './Game.js';

export default class GameList {
    constructor() {
        this.games = new Map();
    }

    getGame(gameId){
        let game = this.games.get(gameId);
        if (!game) {
            throw new Error('No game with that id');
        }
        return game;
        }

    addGame(gameName) {
        if (gameName){
            this.games.push(new Game(gameName));
        }
        else {
            alert('Game name cannot be empty');
        }
    }

    addPlayerToGame(gameName, playerName) {
        for(let game of this.games) {
            if(game.name === gameName) {
                game.addPlayer(playerName);
                return;
            }
        }
        alert(`No game found with the name ${gameName}`);
        return;
    }
}
