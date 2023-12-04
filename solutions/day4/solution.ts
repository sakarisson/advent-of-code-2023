import fs from "fs";
import path from "path";

const getInput = (test: boolean) => {
  const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

  const inputPath = path.join(__dirname, "input.txt");
  const input = test ? testInput : fs.readFileSync(inputPath, "utf8");

  return input;
};

const input = getInput(false);

type Card = {
  yours: Array<number>;
  winning: Array<number>;
};

const getFormattedData = (): Array<Card> =>
  input
    .split("\n")
    .map((str) => str.split(" | "))
    .map((cards) => {
      const [unformattedWinningCardsStr, yourCardsStr] = cards;
      const [, winningCardsStr] = unformattedWinningCardsStr.split(": ");
      return {
        winning: winningCardsStr.split(" ").map(Number).filter(Boolean),
        yours: yourCardsStr.split(" ").map(Number).filter(Boolean),
      };
    });

const getPrizeOfCard = (card: Card) => {
  const matches = card.winning
    .map((num) => card.yours.find((other) => other === num))
    .filter(Boolean);

  const test = card.winning
    .map((num) =>
      card.yours.find((other) => (other === num ? [num, other] : false))
    )
    .filter(Boolean);

  if (matches.length === 0) {
    return 0;
  }

  return Math.pow(2, matches.length - 1);
};

const part1 = () => {
  const points = getFormattedData()
    .map(getPrizeOfCard)
    .reduce((p, c) => p + c, 0);

  console.log(points);
};

part1();
