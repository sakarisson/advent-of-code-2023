import fs from "fs";
import path from "path";
import { getInput } from "../day2/solution";

const getData = (test: boolean) => {
  const testInput = `Time:      7  15   30
Distance:  9  40  200`;

  const inputPath = path.join(__dirname, "input.txt");
  const input = test ? testInput : fs.readFileSync(inputPath, "utf8");
  return input;
};

const getPart1Data = (test: boolean) => {
  const input = getData(test);
  const data = input.split("\n").map((line) =>
    line
      .slice(line.match(/\d/)?.index ?? 0)
      .split(" ")
      .filter(Boolean)
      .map(Number)
  );

  const races = data[0].map((raceTime, i) => ({
    raceTime,
    maxDistance: data[1][i],
  }));

  return races;
};

const getPart2Data = (test: boolean) => {
  const input = getData(test);

  const data = input
    .split("\n")
    .map((line) => line.slice(line.match(/\d/)?.index ?? 0).replace(/\s/g, ""))
    .map(Number);

  return { raceTime: data[0], maxDistance: data[1] } as const;
};

const part1 = () => {
  const data = getPart1Data(false);

  const waysToBreakRecord = data.map((race) => {
    const { raceTime, maxDistance } = race;

    let recordBreakCount = 0;

    for (let i = 0; i < raceTime; i += 1) {
      const distance = (raceTime - i) * i;
      if (distance > maxDistance) {
        recordBreakCount += 1;
      }
    }
    return recordBreakCount;
  });

  const result = waysToBreakRecord.reduce((p, c) => p * c, 1);

  console.log(result);
};

const part2 = () => {
  const race = getPart2Data(false);

  const { raceTime, maxDistance } = race;

  let recordBreakCount = 0;

  for (let i = 0; i < raceTime; i += 1) {
    const distance = (raceTime - i) * i;
    if (distance > maxDistance) {
      recordBreakCount += 1;
    }
  }

  console.log(recordBreakCount);
};

part1();
part2();
