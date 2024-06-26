import { HandRankings } from "./HandRankings.js";

export default class HandEvaluator {
    
    static evaluateHand(cards) {
        if (!Array.isArray(cards)) {
          throw new Error('Invalid input: cards should be an array');
        }
    
        // Sort cards by rank
        cards.sort((a, b) => HandEvaluator.getCardRankValue(b.rank) - HandEvaluator.getCardRankValue(a.rank));
    
        // Check for each hand type from highest to lowest
        if (HandEvaluator.isRoyalFlush(cards)) {
          return { rank: HandRankings.ROYAL_FLUSH, cards: cards };
        } else if (HandEvaluator.isStraightFlush(cards)) {
          return { rank: HandRankings.STRAIGHT_FLUSH, cards: cards };
        } else if (HandEvaluator.isFourOfAKind(cards)) {
          return { rank: HandRankings.FOUR_OF_A_KIND, cards: cards };
        } else if (HandEvaluator.isFullHouse(cards)) {
          return { rank: HandRankings.FULL_HOUSE, cards: cards };
        } else if (HandEvaluator.isFlush(cards)) {
          return { rank: HandRankings.FLUSH, cards: cards };
        } else if (HandEvaluator.isStraight(cards)) {
          return { rank: HandRankings.STRAIGHT, cards: cards };
        } else if (HandEvaluator.isThreeOfAKind(cards)) {
          return { rank: HandRankings.THREE_OF_A_KIND, cards: cards };
        } else if (HandEvaluator.isTwoPair(cards)) {
          return { rank: HandRankings.TWO_PAIR, cards: cards };
        } else if (HandEvaluator.isOnePair(cards)) {
          return { rank: HandRankings.ONE_PAIR, cards: cards };
        } else {
          return { rank: HandRankings.HIGH_CARD, cards: cards.slice(0, 5) };
        }
    }

  static getCardRankValue(rank) {
    const rankValues = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
      '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return rankValues[rank];
  }

  // Implement specific hand check methods (e.g., isRoyalFlush, isStraightFlush, etc.)
  static isRoyalFlush(cards) {
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    const royalFlushRanks = ['10', 'J', 'Q', 'K', 'A'];

    for (let suit of suits){
        const royalFlushCards = cards.filter(card => card.suit===suit && royalFlushRanks.includes(card.rank));

        if (royalFlushCards.length===5){
            return true;
        }
    }
    return false;

  }

  static isStraightFlush(cards) {
    // Implementation goes here
    const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
    for (let suit of suits){
        const royalFlushCards = cards.filter(card => card.suit===suit && royalFlushRanks.includes(card.rank));

        if (royalFlushCards.length===5){
            return true;
        }
    }
    return false;

  }

  static isFourOfAKind(cards) {
    // Implementation goes here
    
    return false;

  }

  static isFullHouse(cards) {
    // Implementation goes here
    return false;

  }

  static isFlush(cards) {
    const suits = cards.map(card => card.suit);
    const suitCounts = suits.reduce((acc, suit) => {
      acc[suit] = (acc[suit] || 0) + 1;
      return acc;
    }, {});
    const flushSuit = Object.keys(suitCounts).find(suit => suitCounts[suit] >= 5);
    if (flushSuit) {
      return cards.filter(card => card.suit === flushSuit).slice(0, 5);
    }
    return false;
  }
  
  static isStraight(cards) {
    const ranks = [...new Set(cards.map(card => HandEvaluator.getCardRankValue(card.rank)))];
    for (let i = 0; i <= ranks.length - 5; i++) {
      if (ranks[i] - ranks[i + 4] === 4) {
        return cards.filter(card => ranks.slice(i, i + 5).includes(HandEvaluator.getCardRankValue(card.rank)));
      }
    }
    return false;
  }
  
  static isThreeOfAKind(cards) {
    // Implementation goes here
    return false;

  }

  static isTwoPair(cards) {
    // Implementation goes here
    return false;

  }

  static isOnePair(cards) {
    // Implementation goes here
    return false;

  }
}
