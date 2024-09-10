import { manageMapSelection } from "./map-generators.mjs";
import { MapManager } from "./map-manager.mjs";
import { createInterface } from "node:readline";

const players = ["A", "B"];
const maps = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const controller = manageMapSelection(players, new MapManager(maps));

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function waitForInput() {
  return new Promise((resolve) => rl.question('', resolve));
}

let result = controller.next();
while(!result.done) {
  result = controller.next(await waitForInput())
}

rl.close();