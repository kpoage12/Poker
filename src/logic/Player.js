

export default class Player {

  //Player has a name, hand of cards, bet size, default number of chips, and a boolean for if the player has folded
  constructor(name, socketID, position) {
    this.name = name;
    this.socketID = socketID;
    this.hand = [];
    this.bet = 0;
    this.chips = 1000; // Example starting chips
    this.hasFolded = false;
    this.position = position;
  }

  placeBet(amount) {
    //Player must bet an amount less than theyre chip size
    if (amount > this.chips) {
      throw new Error('Not enough chips');
    }
    this.chips -= amount;
    this.bet += amount;
  }

  fold(isfolded = true) {
    this.hasFolded = isfolded;
  }

  receiveCard(card) {
    this.hand.push(card);
  }


}