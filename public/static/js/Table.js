export default class Table {
    constructor() {
      this.communityCards = [];
      this.pot = 0;
    }
  
    addCard(card) {
      this.communityCards.push(card);
    }
  
    reset() {
      this.communityCards = [];
      this.pot = 0;
    }
  
    addToPot(amount) {
      this.pot += amount;
    }
  }
  