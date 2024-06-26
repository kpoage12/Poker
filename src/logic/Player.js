
export default class Player {

    constructor(name) {
        this.name = name;
        this.hand = [];
        this.bet = 0;
        this.chips = 1000; // Example starting chips
        this.hasFolded = false;
      }
    
      placeBet(amount) {
        this.chips -= amount;
        this.bet += amount;
      }
    
      fold() {
        this.hasFolded = true;
      }
    
      receiveCard(card) {
        this.hand.push(card);
      }
    
      resetForNewRound() {
        this.hand = [];
        this.bet = 0;
        this.hasFolded = false;
      }
}