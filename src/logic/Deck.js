import Card from './Card.js';

export default class Deck {

    constructor() {
        this.cards = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        suits.forEach(suit => {
          ranks.forEach(rank => {
            this.cards.push(new Card(suit, rank));
          });
        });
        this.shuffle();
      }
    
      shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
      }
    
      draw() {
        return this.cards.pop();
      }
}
