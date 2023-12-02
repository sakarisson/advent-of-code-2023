import fs from "fs";
import path, { parse } from "path";

export const getInput = () => {
  const inputPath = path.join(__dirname, "input.txt");
  return fs.readFileSync(inputPath, "utf8").split("\n");
};

const input = getInput();

type GameRound = {
  red: number;
  green: number;
  blue: number;
};

type Game = {
  id: number;
  rounds: Array<GameRound>;
};

const parseGameData = (input: string): Game => {
  const [title, gameData] = input.split(": ");
  const [, id] = title.split(" ");

  const roundsData = gameData.split("; ");

  const rounds = roundsData.map((roundData) => {
    const draws = roundData.split(", ");

    const round: GameRound = {
      red: 0,
      blue: 0,
      green: 0,
    };

    draws.forEach((draw) => {
      const [count, color] = draw.split(" ") as [
        string,
        "green" | "red" | "blue"
      ];

      round[color] = Number(count);
    });

    return round;
  });

  return {
    id: Number(id),
    rounds,
  };
};

const isGamePossible = (game: Game) =>
  game.rounds.every(
    (round) => round.blue <= 14 && round.green <= 13 && round.red <= 12
  );

const part1 = () => {
  const games = input.map(parseGameData);

  const impossibleGames = games.filter(isGamePossible);

  const sumOfImpossibleGameIds = impossibleGames.reduce((p, c) => p + c.id, 0);

  return sumOfImpossibleGameIds;
};

console.log(part1());
