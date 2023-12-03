import fs from "fs";
import path from "path";

const getInput = (test: boolean) => {
  const testInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

  const inputPath = path.join(__dirname, "input.txt");
  const input = test ? testInput : fs.readFileSync(inputPath, "utf8");

  const WIDTH = input.split("\n")[0].length + 1;
  const HEIGHT = input.split("\n").length + 1;

  return { WIDTH, HEIGHT, input };
};

const { input, WIDTH, HEIGHT } = getInput(false);

const getNumberPositions = (engine: string) => {
  const numberPositions: Array<{ value: string; index: number }> = [];

  // let regex = /\d+/g;
  let regex = /\b\d{1,3}\b/g;
  let match;
  while ((match = regex.exec(engine))) {
    numberPositions.push({
      value: engine.slice(match.index, regex.lastIndex),
      index: match.index,
    });
  }

  return numberPositions;
};

const getSymbolPositions = (engine: string) => {
  const symbolPositions: { [key: number]: boolean } = {};

  [...engine.matchAll(/[^0-9.\n]/g)].forEach(
    (match) => (symbolPositions[match.index ?? 0] = true)
  );

  return symbolPositions;
};

const symbolPositions = getSymbolPositions(input);

const isValidEnginePart = ({
  index,
  value,
}: ReturnType<typeof getNumberPositions>[number]) => {
  const length = value.length;

  const getRowStartIndex = () => {
    return index % WIDTH === 0 ? 0 : (index % WIDTH) - 1;
  };

  const rowStartIndex = getRowStartIndex();

  const getRowEndIndex = () => {
    return (index + length) % WIDTH === 0
      ? WIDTH - 1
      : (index % WIDTH) + length;
  };

  const rowEndIndex = getRowEndIndex();

  const row = Math.floor(index / WIDTH);
  const isFirstRow = row === 1;
  const isLastRow = row === HEIGHT - 1;

  if (!isFirstRow) {
    const searchStartIndex = rowStartIndex + (row - 1) * WIDTH;
    const searchEndIndex = rowEndIndex + (row - 1) * WIDTH;
    for (let i = searchStartIndex; i <= searchEndIndex; ++i) {
      if (symbolPositions[i]) {
        return true;
      }
    }
  }
  if (true) {
    const searchStartIndex = rowStartIndex + row * WIDTH;
    const searchEndIndex = rowEndIndex + row * WIDTH;

    for (let i = searchStartIndex; i <= searchEndIndex; ++i) {
      if (symbolPositions[i]) {
        return true;
      }
    }
  }
  if (!isLastRow) {
    const searchStartIndex = rowStartIndex + (row + 1) * WIDTH;
    const searchEndIndex = rowEndIndex + (row + 1) * WIDTH;
    for (let i = searchStartIndex; i <= searchEndIndex; ++i) {
      if (symbolPositions[i]) {
        return true;
      }
    }
  }
  return false;
};

const part1 = () => {
  const validEngineParts = getNumberPositions(input).filter(isValidEnginePart);

  const sum = validEngineParts.reduce((c, p) => c + Number(p.value), 0);

  console.log(sum);
};

part1();
