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
            return royalFlushCards;
        }
    }
    return false;

  }

  static isStraightFlush(cards) {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    for (let suit of suits) {
      const suitedCards = cards.filter(card => card.suit === suit);
      if (suitedCards.length >= 5) {
        const straightFlushCards = HandEvaluator.isStraight(suitedCards);
        if (straightFlushCards) {
          return straightFlushCards;
        }
      }
    }
    return false;
  }

  static isFourOfAKind(cards) {
    
    const rankCounts = {};
    for (let card of cards) {
      const rankValue = HandEvaluator.getCardRankValue(card.rank);
      rankCounts[rankValue] = (rankCounts[rankValue] || 0) + 1;
    }

    const fourOfAKindRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 4);
    if (fourOfAKindRank) {
      const fourOfAKindCards = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) === parseInt(fourOfAKindRank));
      const kicker = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) !== parseInt(fourOfAKindRank))[0];
      return [...fourOfAKindCards, kicker];
    }

    return false;

  }

  static isFullHouse(cards) {
    const rankCounts = {};
    for (let card of cards) {
      const rankValue = HandEvaluator.getCardRankValue(card.rank);
      rankCounts[rankValue] = (rankCounts[rankValue] || 0) + 1;
    }

    const threeOfAKindRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 3);

    const twoOfAKindRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 2);

    if (threeOfAKindRank && twoOfAKindRank) {
      const threeOfAKindCards = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) === parseInt(threeOfAKindRank));
      const twoOfAKindCards = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) === parseInt(twoOfAKindRank));
      return [...threeOfAKindCards, ...twoOfAKindCards];    
    }

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
    const rankValues = cards.map(card => HandEvaluator.getCardRankValue(card.rank));
    const uniqueRanks = [...new Set(rankValues)];

    // Check high straight (Ace as high)
    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
      if (uniqueRanks[i] - uniqueRanks[i + 4] === 4) {
        return cards.filter(card => uniqueRanks.slice(i, i + 5).includes(HandEvaluator.getCardRankValue(card.rank)));
      }
    }

    // Check low straight (Ace as low)
    const aceLowStraight = [14, 5, 4, 3, 2];
    if (aceLowStraight.every(rank => uniqueRanks.includes(rank))) {
      return cards.filter(card => aceLowStraight.includes(HandEvaluator.getCardRankValue(card.rank)));
    }

    return false;
  }
  
  static isThreeOfAKind(cards) {
    
    const rankCounts = {};
    for (let card of cards) {
      const rankValue = HandEvaluator.getCardRankValue(card.rank);
      rankCounts[rankValue] = (rankCounts[rankValue] || 0) + 1;
    }

    const threeOfAKindRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 3);
    if (threeOfAKindRank) {
      const threeOfAKindCards = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) === parseInt(threeOfAKindRank));
      const kickers = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) !== parseInt(threeOfAKindRank)).slice(0, 2);
      return [...threeOfAKindCards, ...kickers];    
    }
    return false;
  }

  static isTwoPair(cards) {
    const rankCounts = {};
    for (let card of cards) {
      const rankValue = HandEvaluator.getCardRankValue(card.rank);
      rankCounts[rankValue] = (rankCounts[rankValue] || 0) + 1;
    }

    const pairs = Object.keys(rankCounts).filter(rank => rankCounts[rank] === 2);
    if (pairs.length >= 2) {
      const twoPairCards = cards.filter(card => pairs.includes(String(HandEvaluator.getCardRankValue(card.rank)))).slice(0, 4);
      const kicker = cards.filter(card => !pairs.includes(String(HandEvaluator.getCardRankValue(card.rank))))[0];
      return [...twoPairCards, kicker];
    }

    return false;
  }

  static isOnePair(cards) {
    const rankCounts = {};
    for (let card of cards) {
      const rankValue = HandEvaluator.getCardRankValue(card.rank);
      rankCounts[rankValue] = (rankCounts[rankValue] || 0) + 1;
    }

    const pairRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 2);

    if (pairRank){
      const pairCards = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) === parseInt(pairRank));
      const kickers = cards.filter(card => HandEvaluator.getCardRankValue(card.rank) !== parseInt(pairRank)).slice(0, 3);

      return [...pairCards, ...kickers]
    }

    return false;
  }

  static compareHands(hand1, hand2) {
    for (let i = 0; i < hand1.length; i++) {
      const hand1Value = HandEvaluator.getCardRankValue(hand1[i].rank);
      const hand2Value = HandEvaluator.getCardRankValue(hand2[i].rank);
      if (hand1Value > hand2Value) {
        return 1;
      } else if (hand1Value < hand2Value) {
        return -1;
      }
    }
    return 0;
  }


}
