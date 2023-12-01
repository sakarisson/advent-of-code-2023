import fs from "fs";
import path from "path";

const inputPath = path.join(__dirname, "input.txt");
const input = fs.readFileSync(inputPath, "utf8").split("\n");

const validNumbers = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

const getCode = (input: string) => {
  let firstNumberIndex = Infinity;
  let firstNumberValue = null;
  let lastNumberIndex = -1;
  let lastNumberValue = null;

  (Object.keys(validNumbers) as Array<keyof typeof validNumbers>).forEach(
    (validNumber) => {
      const firstIndex = input.indexOf(validNumber);
      const lastIndex = input.lastIndexOf(validNumber);

      if (firstIndex === -1) {
        return;
      }
      if (firstIndex < firstNumberIndex) {
        firstNumberIndex = firstIndex;
        firstNumberValue = validNumbers[validNumber];
      }
      if (lastIndex > lastNumberIndex) {
        lastNumberIndex = lastIndex;
        lastNumberValue = validNumbers[validNumber];
      }
    }
  );

  return Number(`${firstNumberValue}${lastNumberValue}`);
};

const solution = input
  .map(getCode)
  .reduce((p, c) => p + c, 0)
  .toString();

const outputPath = path.join(__dirname, "solution.txt");
fs.writeFileSync(outputPath, solution);
