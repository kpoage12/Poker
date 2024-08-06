
export default class Card {

    constructor(suit, rank) {
      const cardReps = [
        ["🂡", "🂢", "🂣", "🂤", "🂥", "🂦", "🂧", "🂨", "🂩", "🂪", "🂫", "🂭", "🂮"],
        ["🂱", "🂲", "🂳", "🂴", "🂵", "🂶", "🂷", "🂸", "🂹", "🂺", "🂻", "🂽", "🂾"],
        ["🃁", "🃂", "🃃", "🃄", "🃅", "🃆", "🃇", "🃈", "🃉", "🃊", "🃋", "🃍", "🃎"],
        ["🃑", "🃒", "🃓", "🃔", "🃕", "🃖", "🃗", "🃘", "🃙", "🃚", "🃛", "🃝", "🃞"]
      ];
    
        this.suit = suit;
        this.rank = rank;
        let row = 0;
        let column = 0;
        
        if (suit=='hearts'){
          row = 1;
        }
        if (suit=='diamonds'){
          row = 2;
        }
        if (suit=='clubs'){
          row = 3;
        }

        if (rank=='J'){
          column = 10;
        }
        else if (rank=='Q'){
          column = 11;
        }
        else if (rank=='K'){
          column = 12;
        }
        else if (rank=='A'){
          column = 0;
        }
        else {
          column = parseInt(rank)-1;
        }

        
        this.unicode = cardReps[row][column]
      }
    
      // Add a method to display the card nicely (optional)
      toString() {
        return `${this.rank} of ${this.suit}: ${this.unicode}`;
      }
}