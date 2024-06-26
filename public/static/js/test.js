
import Card from './Card.js'
import HandEvaluator from './HandEvaluator.js'


const card1 = new Card('hearts', '5');
const card2 = new Card('hearts', '7');
const card3 = new Card('diamonds', 'Q');
const card4 = new Card('diamonds', 'K');
const card5 = new Card('diamonds', 'A');
const card6 = new Card('diamonds', '10')
const card7 = new Card('diamonds', 'J')


const cards = [card1, card2, card3, card4, card5, card6, card7];

function test(){
    console.log(HandEvaluator.evaluateHand(cards));
}
    
test();

