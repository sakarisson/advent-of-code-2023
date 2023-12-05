import fs from "fs";
import path from "path";

const getInput = ({ test }: { test: boolean }) => {
  const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

  const inputPath = path.join(__dirname, "input.txt");
  const input = test ? testInput : fs.readFileSync(inputPath, "utf8");

  return input;
};

const mapTypes = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
] as const;

type MapType = (typeof mapTypes)[number];

type Range = {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
};

type Map = {
  type: MapType;
  ranges: Array<Range>;
};

type ConvertedInput = {
  seeds: Array<number>;
  maps: Array<Map>;
};

const convertInput = (): ConvertedInput => {
  const lines = getInput({ test: true }).split("\n").filter(Boolean);

  const seeds = lines[0].replace("seeds: ", "").split(" ").map(Number);

  const maps = [];
  let currentMap: Map | null = null;

  for (let i = 1; i < lines.length; i += 1) {
    for (let j = 0; j < mapTypes.length; j += 1) {
      if (lines[i] === mapTypes[j] + " map:") {
        if (currentMap !== null) {
          maps.push(currentMap);
        }
        currentMap = {
          type: mapTypes[j],
          ranges: [],
        };
        break;
      }
    }
    if (lines[i].indexOf("-to-") > 0) {
      continue;
    }
    const [destinationRangeStart, sourceRangeStart, rangeLength] = lines[i]
      .split(" ")
      .map(Number);

    if (currentMap !== null) {
      currentMap.ranges.push({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      });
    }
  }
  if (currentMap !== null) {
    maps.push(currentMap);
  }

  return { seeds, maps };
};

const data = convertInput();
