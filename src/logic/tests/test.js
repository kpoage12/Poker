
import Card from '../Card.js'
import HandEvaluator from '../HandEvaluator.js'
import Game from '../Game.js';

{
    const card1 = new Card('hearts', '5');
    const card2 = new Card('hearts', '7');
    const card3 = new Card('diamonds', 'Q');
    const card4 = new Card('diamonds', 'K');
    const card5 = new Card('diamonds', 'A');
    const card6 = new Card('diamonds', '10')
    const card7 = new Card('diamonds', 'J')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===10){
            console.log("Royal Flush: Passed");
        }
        else{
            console.log("Royal Flush: FAILED");
        }
    }
        
    test();
    
}

{
    const card1 = new Card('clubs', '5');
    const card2 = new Card('clubs', '7');
    const card3 = new Card('clubs', '6');
    const card4 = new Card('clubs', '9');
    const card5 = new Card('clubs', '8');
    const card6 = new Card('diamonds', '6')
    const card7 = new Card('spades', '6')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===9){
            console.log("Straight Flush: Passed");
        }
        else{
            console.log("Straight Flush: FAILED");
        }
    }
        
    test();
    
}

{
    const card1 = new Card('clubs', '4');
    const card2 = new Card('diamonds', '4');
    const card3 = new Card('spades', '4');
    const card4 = new Card('hearts', '4');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', '10')
    const card7 = new Card('spades', '10')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===8){
            console.log("4 of a Kind: Passed");
        }
        else{
            console.log("4 of a Kind: FAILED");
        }
    }
        
    test();
    
}

{
    const card1 = new Card('clubs', '4');
    const card2 = new Card('diamonds', '4');
    const card3 = new Card('spades', '4');
    const card4 = new Card('hearts', 'K');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', 'A')
    const card7 = new Card('spades', 'K')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===7){
            console.log("Full House: Passed");
        }
        else{
            console.log("Full House: FAILED");
        }
    }
        
    test();
    
}

{
    const card1 = new Card('clubs', '3');
    const card2 = new Card('clubs', '4');
    const card3 = new Card('clubs', '7');
    const card4 = new Card('hearts', 'K');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', 'A')
    const card7 = new Card('clubs', '10')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===6){
            console.log("Flush: Passed");
        }
        else{
            console.log("Flush: FAILED");
        }
    }
        
    test();
    
}

{
    const card1 = new Card('clubs', '3');
    const card2 = new Card('clubs', '4');
    const card3 = new Card('clubs', '7');
    const card4 = new Card('hearts', '5');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', '2')
    const card7 = new Card('diamonds', '10')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===5){
            console.log("Straight: Passed");
        }
        else{
            console.log("Straight: FAILED");
        }
    }
        
    test();
    
} 

{
    const card1 = new Card('clubs', '3');
    const card2 = new Card('clubs', '10');
    const card3 = new Card('diamonds', '3');
    const card4 = new Card('hearts', '3');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', '2')
    const card7 = new Card('diamonds', '9')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===4){
            console.log("3 of a Kind: Passed");
        }
        else{
            console.log("3 of a Kind: FAILED");
        }
    }
        
    test();
    
} 

{
    const card1 = new Card('clubs', '3');
    const card2 = new Card('clubs', '10');
    const card3 = new Card('diamonds', '2');
    const card4 = new Card('hearts', '3');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', '9')
    const card7 = new Card('diamonds', 'A')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===3){
            console.log("2 Pair: Passed");
        }
        else{
            console.log("2 Pair: Failed");
        }
    }
        
    test();
    
} 

{
    const card1 = new Card('clubs', '2');
    const card2 = new Card('clubs', '10');
    const card3 = new Card('diamonds', '2');
    const card4 = new Card('hearts', '3');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', '9')
    const card7 = new Card('diamonds', '8')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===2){
            console.log("Pair: Passed");
        }
        else{
            console.log("Pair: Failed");
        }
    }
        
    test();
    
} 

{
    const card1 = new Card('clubs', '2');
    const card2 = new Card('clubs', '10');
    const card3 = new Card('diamonds', 'J');
    const card4 = new Card('hearts', '3');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', '9')
    const card7 = new Card('diamonds', '8')
    
    
    const cards = [card1, card2, card3, card4, card5, card6, card7];
    
    function test(){
        if (HandEvaluator.evaluateHand(cards).rank===1){
            console.log("High Card: Passed");
        }
        else{
            console.log("High Card: Failed");
        }
    }
        
    test();
    
} 
{
    const card1 = new Card('diamonds', '2');
    const card2 = new Card('diamonds', '10');
    const card3 = new Card('diamonds', 'J');
    const card4 = new Card('hearts', '3');
    const card5 = new Card('clubs', 'A');
    const card6 = new Card('diamonds', '9')
    const card7 = new Card('diamonds', '8')
    const card8 = new Card('diamonds', 'A')
    const card9 = new Card('diamonds', '3')
    
    
    const hand1 = [card1, card2, card3, card6, card7];
    const hand2 = [card1, card2, card3, card8, card9];

    
    function test(){
        if (HandEvaluator.compareHands(hand1, hand2)===-1){
            console.log("Compare Flush: Passed");
        }
        else{
            console.log("Compare Flush: Failed");
        }
    }
        
    test();
    
} 

