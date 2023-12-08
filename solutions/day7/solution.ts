import fs from "fs";
import path from "path";

const getInput = (test: boolean) => {
  const testInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

  const inputPath = path.join(__dirname, "input.txt");
  const input = test ? testInput : fs.readFileSync(inputPath, "utf8");

  return input;
};

const cardRanks = {
  A: 0,
  K: 1,
  Q: 2,
  T: 3,
  "9": 4,
  "8": 5,
  "7": 6,
  "6": 7,
  "5": 8,
  "4": 9,
  "3": 10,
  "2": 11,
  J: 12,
} as const;

type CardFace = keyof typeof cardRanks;

type Hand = {
  cards: Array<CardFace>;
  bid: number;
};

const groupCards = (cards: Array<CardFace>) => {
  const groups: Array<{ value: CardFace; count: number }> = [];

  cards.forEach((card) => {
    const groupIndex = groups.findIndex((group) => group.value === card);
    if (groupIndex < 0) {
      groups.push({ value: card, count: 1 });
    } else {
      groups[groupIndex].count += 1;
    }
  });
  return groups.sort((a, b) => {
    if (a.value === "J") {
      return 1;
    }
    if (b.value === "J") {
      return -1;
    }
    return b.count - a.count;
  });
};

type GroupedCards = ReturnType<typeof groupCards>;

const updateJacks = (cardGroups: GroupedCards) => {
  const hasJacks = cardGroups[cardGroups.length - 1].value === "J";

  if (!hasJacks) {
    return cardGroups;
  }

  if (cardGroups.length === 1) {
    return [{ value: "A", count: 5 }];
  }

  const copy = [...cardGroups];

  copy[0].count += copy[copy.length - 1].count;
  copy.pop();

  return copy;
};

const isFiveOfAKind = (cardGroups: GroupedCards) => cardGroups.length === 1;

const isFourOfAKind = (cardGroups: GroupedCards) =>
  cardGroups.length === 2 &&
  cardGroups.some((cardGroups) => cardGroups.count === 1);

const isFullHouse = (cardGroups: GroupedCards) =>
  cardGroups.length === 2 &&
  cardGroups.some((cardGroups) => cardGroups.count === 2);

const isThreeOfAKind = (cardGroups: GroupedCards) =>
  cardGroups.length === 3 &&
  cardGroups.some((cardGroups) => cardGroups.count === 3);

const isTwoPair = (cardGroups: GroupedCards) =>
  cardGroups.length === 3 &&
  cardGroups.some((cardGroups) => cardGroups.count === 1) &&
  cardGroups.some((cardGroups) => cardGroups.count === 2);

const isOnePair = (cardGroups: GroupedCards) => cardGroups.length === 4;

const getHandStrength = (hand: Array<CardFace>) => {
  const grouped = groupCards(hand);
  const reRanked = updateJacks(grouped);

  if (isFiveOfAKind(reRanked)) {
    return 7;
  }
  if (isFourOfAKind(reRanked)) {
    return 6;
  }
  if (isFullHouse(reRanked)) {
    return 5;
  }
  if (isThreeOfAKind(reRanked)) {
    return 4;
  }
  if (isTwoPair(reRanked)) {
    return 3;
  }
  if (isOnePair(reRanked)) {
    return 2;
  }
  return 1;
};

const sortHands = (a: Hand, b: Hand) => {
  const aStrength = getHandStrength(a.cards);
  const bStrength = getHandStrength(b.cards);

  if (aStrength > bStrength) {
    return 1;
  }
  if (aStrength < bStrength) {
    return -1;
  }
  for (let i = 0; i < 5; i += 1) {
    if (cardRanks[a.cards[i]] < cardRanks[b.cards[i]]) {
      return 1;
    }
    if (cardRanks[a.cards[i]] > cardRanks[b.cards[i]]) {
      return -1;
    }
  }
  return 0;
};

const getHands = (): {
  cards: CardFace[];
  bid: number;
}[] => {
  const input = getInput(false);

  const hands = input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([cards, bid]) => ({
      cards: cards.split(""),
      bid: Number(bid),
    }));

  // @ts-expect-error
  return hands;
};

const part1 = () => {
  const result = getHands()
    .sort(sortHands)
    .map((hand, i) => hand.bid * (i + 1))
    .reduce((p, c) => p + c, 0);

  console.log(getHands().sort(sortHands));
  console.log(result);
};

part1();
