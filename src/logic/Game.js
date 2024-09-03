import Deck from './Deck.js';
import Player from './Player.js'
import Table from './table.js';
import HandEvaluator from './HandEvaluator.js';

export default class Game {

  constructor(gameId, blinds=10) {
    this.gameId = gameId;
    this.deck = new Deck();
    this.players = new Map();
    this.blinds = blinds;
    this.table = new Table();
    this.currentPlayerIndex = 0;
    this.currPlayerName = '';
    this.pot = 0;
    this.bettingRound = 0; // 0: pre-flop, 1: flop, 2: turn, 3: river

    this.actionsInCurrentRound = new Map();
    this.currentBet = 0; // Current bet amount
  }

  addPlayer(name, socketId) {
    if (this.players.has(name)) {
      throw new Error('Player already exists in this game');
    }else{
      let position = this.players.size
      // check if that's too many players
      this.players.set(name, new Player(name, socketId, position));
    }
}
  setPlayersActive(){
    let activePlayers = Array.from(this.players.values());
    activePlayers.forEach(player => {
      player.fold(false);
      player.hand = [];
      player.bet = 0;
    });
  }
  startNewRound() {
    if (this.players.length === 0) {
      throw new Error('Cannot start the game without players');
    }

    this.deck = new Deck();
    this.table.reset();
    this.dealInitialCards();
    this.bettingRound = 0;
    this.setPlayersActive()
    this.actionsInCurrentRound.clear();
    this.currentBet = this.blinds;
  }

  dealInitialCards() {
    Array.from(this.players.values()).forEach(player => {
      player.receiveCard(this.deck.draw());
      player.receiveCard(this.deck.draw());
    });
  }

  dealFlop() {
    this.table.addCard(this.deck.draw());
    this.table.addCard(this.deck.draw());
    this.table.addCard(this.deck.draw());
  }

  dealTurn() {
    this.table.addCard(this.deck.draw());
  }

  dealRiver() {
    this.table.addCard(this.deck.draw());
  }

  nextPlayer() {
    if (this.allPlayersActed()) {
        this.nextBettingRound();
        return;
    }
    // Loop through the players until we find the next active player
    let guys = Array.from(this.players.values()).map(g=>{}).sort((a,b)=>{a.position - b.position});
    let activePlayers = guys.filter(player => !player.hasFolded);
    let idx = activePlayers.findIndex(player => player.name === this.currPlayerName);
    let orderedPlayers = activePlayers.slice(idx).concat(activePlayers.slice(0, idx));
    let nextPlayer = orderedPlayers[1];
    let currPlayerName = nextPlayer.name;

    if (!this.allPlayersActed()) {
        console.log(`It's now ${currPlayerName}'s turn.`);
    }
  }
  placeBet(player, amount) {
    if (amount < this.currentBet) {
      throw new Error('Bet amount must be at least the current bet');
    }

    player.placeBet(amount);
    this.pot += amount;
    this.actionsInCurrentRound.set(player.name, 'bet');

    if (amount > this.currentBet) {
      this.currentBet = amount;
      this.actionsInCurrentRound.clear();
      this.actionsInCurrentRound.set(player.name, 'raise');
    }

    this.nextPlayer();
  }

  check(player) {
    if (this.currentBet > 0) {
      throw new Error('Cannot check when there is an active bet');
    }

    this.actionsInCurrentRound.set(player.name, 'check');
    this.nextPlayer();
  }

  call(player) {
    const callAmount = this.currentBet - player.bet;
    player.placeBet(callAmount);
    this.pot += callAmount;
    this.actionsInCurrentRound.set(player.name, 'call');
    this.nextPlayer();
  }

  raise(player, amount) {
    if (amount < 2*this.currentBet) {
      throw new Error('Raise amount must be twice the size of the current bet');
    }

    player.placeBet(amount);
    this.pot += amount;
    this.actionsInCurrentRound.set(player.name, 'raise');
    this.currentBet = amount;
    // Reset actions in the current round as the bet has increased
    this.actionsInCurrentRound.clear();
    this.actionsInCurrentRound.set(player.name, 'raise');
    this.nextPlayer();
  }

  fold(player) {
    player.fold();
    this.actionsInCurrentRound.set(player.name, 'fold');
    let activePlayers = Array.from(this.players.values()).filter(player => !player.hasFolded)
    
    if (activePlayers.length === 1) {
      console.log(`${activePlayers[0].name} wins, all other players have folded!`);
      // Handle round end logic, maybe auto-assign the pot to the remaining player
      this.endRound();
      return;
    }
    this.nextPlayer();
  }

  getCurrentPlayer() {
    let activePlayers = Array.from(this.players.values()).filter(player => !player.hasFolded)
    if (activePlayers.length === 0) {
      return null;
    }
    return this.players.get(this.currPlayerName);
  }

  removePlayerBySocketId(socketId) {
    let guys = Array.from(this.players.values()).filter(player => player.socketId !== socketId);
    this.players.delete(guys[0].name);
  }

  getPlayerState(playerName) {
    const player = this.players.get(playerName);
    return {
        name: player.name,
        hand: player.hand,
        chips: player.chips,
        bet: player.bet,
        hasFolded: player.hasFolded,
    };
  }

  getPublicGameState() {
    return {
        players: this.players.map(player => ({
            name: player.name,
            bet: player.bet,
            chips: player.chips,
            hasFolded: player.hasFolded,
        })),
        communityCards: this.table.communityCards,
        pot: this.pot,
        currentPlayer: this.getCurrentPlayer() ? this.getCurrentPlayer().name : 'No active player',
        bettingRound: this.bettingRound,
        currentBet: this.currentBet
    };
  }

  getGameState() {
    return {
      players: Array.from(this.players.values()).map(player => ({
        name: player.name,
        position: player.position,
        hand: player.hand,
        bet: player.bet,
        chips: player.chips,
        hasFolded: player.hasFolded
      })),
      communityCards: this.table.communityCards,
      pot: this.pot,
      currentPlayer: this.getCurrentPlayer() ? this.getCurrentPlayer().name : 'No active player',
      bettingRound: this.bettingRound,
      currentBet: this.currentBet
    };
  }

  determineWinner() {
    let bestHand = null;
    let winner = null;
  
    activePlayers = Array.from(this.players.values()).filter(player => !player.hasFolded)
    activePlayers.forEach(player => {
      const playerCards = player.hand.concat(this.table.communityCards);
      const playerBestHand = HandEvaluator.evaluateHand(playerCards);
  
      if (!bestHand || playerBestHand.rank > bestHand.rank ||
        (playerBestHand.rank === bestHand.rank && HandEvaluator.compareHands(playerBestHand.cards, bestHand.cards) > 0)) {
        bestHand = playerBestHand;
        winner = player;
      }
    });
  
    return winner;
  }
  
  nextBettingRound() {
    this.actionsInCurrentRound.clear();

    // Reset each player's bet to 0 at the start of a new betting round
    let activePlayers = Array.from(this.players.values()).filter(player => !player.hasFolded)
    activePlayers.forEach(player => {
      player.bet = 0;
    });
  

    if (this.bettingRound === 0) {
      this.dealFlop();
    } else if (this.bettingRound === 1) {
      this.dealTurn();
    } else if (this.bettingRound === 2) {
      this.dealRiver();
    } else if (this.bettingRound === 3) {
      const winner = this.determineWinner();
      console.log(`The winner is: ${winner.name}`);
      this.startNewRound();
      return;
    }

    this.bettingRound += 1;
    this.currentPlayerIndex = 0;
    this.currentBet = 0;

    while (activePlayers[this.currentPlayerIndex].hasFolded) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % activePlayers.length;
    }
  }

  allPlayersActed() {
    let activePlayers = Array.from(this.players.values()).filter(player => !player.hasFolded)
    return activePlayers.every(player => 
      player.hasFolded || 
      (player.bet >= this.currentBet && this.actionsInCurrentRound.has(player.name))
  );
}

  endRound() {
    // Logic to end the current round, distribute the pot, etc.
    console.log('Ending the round.');
    // Example: assign pot to the last active player and reset for a new round
    let activePlayers = Array.from(this.players.values()).filter(player => !player.hasFolded)
    const winner = activePlayers[0];
    winner.chips += this.pot;
    this.pot = 0;
    this.startNewRound();
    return;
  }

}