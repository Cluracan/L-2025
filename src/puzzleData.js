import { LightPuzzle } from "./puzzles/lights";
import { AbbotPuzzle } from "./puzzles/abbot";
import { KeyPuzzle } from "./puzzles/key";
import { TelephonePuzzle } from "./puzzles/telephone";
import { TurtlePuzzle } from "./puzzles/turtle";
import { CookPuzzle } from "./puzzles/cook";
import { PianoPuzzle } from "./puzzles/piano";
import { TreePuzzle } from "./puzzles/trees";
import { ApePuzzle } from "./puzzles/ape";
import { CalculatorPuzzle } from "./puzzles/calculator";
import { SpiderPuzzle } from "./puzzles/spider";
import { PigPuzzle } from "./puzzles/pig";
import { ComputerPuzzle } from "./puzzles/computer";
import { SnookerPuzzle } from "./puzzles/snooker";

export const puzzleData = {
  lights: new LightPuzzle(),
  abbot: new AbbotPuzzle(),
  key: new KeyPuzzle(),
  telephone: new TelephonePuzzle(),
  turtle: new TurtlePuzzle(),
  cook: new CookPuzzle(),
  piano: new PianoPuzzle(),
  tree: new TreePuzzle(),
  ape: new ApePuzzle(),
  calculator: new CalculatorPuzzle(),
  spider: new SpiderPuzzle(),
  pig: new PigPuzzle(),
  computer: new ComputerPuzzle(),
  snooker: new SnookerPuzzle(),
};
