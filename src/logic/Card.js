
export default class Card {

    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
      }
    
      // Add a method to display the card nicely (optional)
      toString() {
        return `${this.rank} of ${this.suit}`;
      }
}