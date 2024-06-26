import Deck from './Deck.js';
import Player from './Player.js'
import Table from './table.js';
export default class Game {
  constructor() {
    this.deck = new Deck();
    this.players = [];
    this.table = new Table();
    this.currentPlayerIndex = 0;
  }

  addPlayer(name) {
    const player = new Player(name);
    this.players.push(player);
  }

  startNewRound() {
    this.deck = new Deck();
    this.table.reset();
    this.players.forEach(player => player.resetForNewRound());
    this.dealInitialCards();
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
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.players[this.currentPlayerIndex].hasFolded);
  }

  placeBet(player, amount) {
    player.placeBet(amount);
    this.table.addToPot(amount);
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
      pot: this.table.pot,
      currentPlayerIndex: this.currentPlayerIndex
    };
  }

  determineWinner() {
    let bestHand = null;
    let winner = null;

    this.players.forEach(player => {
      if (!player.hasFolded) {
        const playerCards = player.hand.concat(this.table.communityCards);
        const playerBestHand = HandEvaluator.evaluateHand(playerCards);

        if (!bestHand || playerBestHand.rank > bestHand.rank ||
          (playerBestHand.rank === bestHand.rank && HandEvaluator.compareHands(playerBestHand.cards, bestHand.cards) > 0)) {
          bestHand = playerBestHand;
          winner = player;
        }
      }
    });

    return winner;
  }
}
