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
  nextMapIndex: number | null;
};

type ConvertedInput = {
  seeds: Array<number>;
  maps: Array<Map>;
};

const convertInput = (test: boolean): ConvertedInput => {
  const lines = getInput({ test }).split("\n").filter(Boolean);

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
          nextMapIndex: j < mapTypes.length - 1 ? j + 1 : null,
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

const getNextValue = (seed: number, ranges: Array<Range>) => {
  const possibleRanges = ranges.filter(
    (range) =>
      range.sourceRangeStart <= seed &&
      seed <= range.sourceRangeStart + range.rangeLength
  );
  const getResult = () => {
    if (possibleRanges.length === 0) {
      return seed;
    }

    const diff = seed - possibleRanges[0].sourceRangeStart;
    return possibleRanges[0].destinationRangeStart + diff;
  };
  const result = getResult();
  return result;
};

const part1 = () => {
  const data = convertInput(false);

  let values = data.seeds;
  for (let i = 0; i < mapTypes.length; i += 1) {
    values = values.map((value) => getNextValue(value, data.maps[i].ranges));
  }
};

const part2 = () => {
  const distanceCache: { [key in MapType]: { [key: number]: number } } = {
    "seed-to-soil": {},
    "fertilizer-to-water": {},
    "humidity-to-location": {},
    "light-to-temperature": {},
    "soil-to-fertilizer": {},
    "temperature-to-humidity": {},
    "water-to-light": {},
  };
  const data = convertInput(false);

  const recursivelyGetFinalValue = (current: number, map: Map): number => {
    const cachedDistance = distanceCache[map.type][current];

    if (cachedDistance) {
      return cachedDistance;
    }
    const value = getNextValue(current, map.ranges);
    distanceCache[map.type][current] = value;

    const nextIndex = map.nextMapIndex;
    if (nextIndex === null) {
      return value;
    }
    return recursivelyGetFinalValue(value, data.maps[nextIndex]);
  };

  let lowest = Infinity;

  for (let i = 0; i < 2; i += 2) {
    for (let j = data.seeds[i]; j < data.seeds[i] + data.seeds[i + 1]; j += 1) {
      const value = recursivelyGetFinalValue(j, data.maps[0]);
      if (value < lowest) {
        lowest = value;
      }
    }
  }

  console.log(distanceCache);
  console.log(lowest);
};

// part1();
part2();
