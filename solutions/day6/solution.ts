import fs from "fs";
import path from "path";

const getData = (test?: boolean) => {
  const testInput = `Time:      7  15   30
Distance:  9  40  200`;

  const inputPath = path.join(__dirname, "input.txt");
  const input = test ? testInput : fs.readFileSync(inputPath, "utf8");

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

const part1 = () => {
  const data = getData(false);

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

part1();
