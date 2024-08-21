import Deck from './Deck.js';
import Player from './Player.js'
import Table from './table.js';
import HandEvaluator from './HandEvaluator.js';

export default class Game {
  constructor() {
    this.deck = new Deck();
    this.players = [];
    this.table = new Table();
    this.currentPlayerIndex = 0;
    this.pot = 0;
    this.bettingRound = 0; // 0: pre-flop, 1: flop, 2: turn, 3: river
    this.activePlayers = []; // Players who have not folded
    this.actionsInCurrentRound = new Map();
    this.currentBet = 0; // Current bet amount
  }

  addPlayer(name) {
    const player = new Player(`${name}`);
    this.players.push(player);
    this.activePlayers.push(player);
  }

  startNewRound() {
    if (this.players.length === 0) {
      throw new Error('Cannot start the game without players');
    }

    this.deck = new Deck();
    this.table.reset();
    this.players.forEach(player => player.resetForNewRound());
    this.dealInitialCards();
    this.bettingRound = 0;
    this.currentPlayerIndex = 0;
    this.activePlayers = [...this.players];
    this.actionsInCurrentRound.clear();
    this.currentBet = 0;
  }

  dealInitialCards() {
    this.players.forEach(player => {
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
    if (this.activePlayers.length === 0) {
      console.log('No active players left.');
      return;
    }

    let startIndex = this.currentPlayerIndex;

    do {
        // Move to the next player
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.activePlayers.length;

        // Check if we've looped all the way around to the starting player
        if (this.currentPlayerIndex === startIndex) {
            // If all players have either folded or acted, proceed to the next round
            if (this.allPlayersActed()) {
                this.nextBettingRound();
                return;
            }
        }
    } while (
        this.activePlayers[this.currentPlayerIndex].hasFolded || 
        (this.activePlayers[this.currentPlayerIndex].bet >= this.currentBet && 
        this.actionsInCurrentRound.has(this.activePlayers[this.currentPlayerIndex].name))
    );

    if (!this.allPlayersActed()) {
        console.log(`It's now ${this.activePlayers[this.currentPlayerIndex].name}'s turn.`);
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
    const foldedPlayerIndex = this.activePlayers.indexOf(player);
    
    // Remove the folded player from the active players list
    this.activePlayers = this.activePlayers.filter(p => p !== player);

    if (this.activePlayers.length === 1) {
      console.log(`${this.activePlayers[0].name} wins, all other players have folded!`);
      // Handle round end logic, maybe auto-assign the pot to the remaining player
      this.endRound();
      return;
    }
    this.currentPlayerIndex--;
    this.nextPlayer();
  }

  getCurrentPlayer() {
    if (this.activePlayers.length === 0) {
      return null;
    }
    return this.activePlayers[this.currentPlayerIndex];
  }

  getGameState() {
    return {
      players: this.players.map(player => ({
        name: player.name,
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
  
    this.activePlayers.forEach(player => {
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
    this.activePlayers.forEach(player => {
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

    while (this.activePlayers[this.currentPlayerIndex].hasFolded) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.activePlayers.length;
    }
  }

  allPlayersActed() {
    return this.activePlayers.every(player => 
      player.hasFolded || 
      (player.bet >= this.currentBet && this.actionsInCurrentRound.has(player.name))
  );
}

  endRound() {
    // Logic to end the current round, distribute the pot, etc.
    console.log('Ending the round.');
    // Example: assign pot to the last active player and reset for a new round
    const winner = this.activePlayers[0];
    winner.chips += this.pot;
    this.pot = 0;
    this.startNewRound();
    return;
  }

}