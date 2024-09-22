import { manageMapSelection } from "./map-generators.mjs";
import { MapManager } from "./map-manager.mjs";
import { PlayerTurnManager } from "./player-order.mjs";
import ipc from "node-ipc";
import { spawn } from "child_process";
import readline from "readline";

const players = ["A", "B"];
const maps = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const mapManager = new MapManager(maps);
const turnManager = new PlayerTurnManager({
  players,
  mapManager,
  numOfMapsToPlay: 7,
  firstPlayer: "A",
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ipc.config.silent = true;
ipc.config.id = "server";
ipc.config.retry = 1500;

const sockets = {};
let answers = [];

ipc.serve(function () {
  ipc.server.on("app.message", function (data, socket) {
    switch (data.message.type) {
      case "connected":
        {
          sockets[data.id] = socket;
          if (players.every((p) => Object.keys(sockets).includes(p))) {
            ipc.connectTo(ipc.config.id, () => {
              ipc.of[ipc.config.id].emit("ready", {});
            });
          }
        }
        break;
      case "input":
        {
          answers.push(data.message.input);
          console.log(answers);
        }
        break;
    }
  });
});

// ipc.server.on('connect', (socket) => {
//   ipc.server.emit(socket, 'app.message', { id: ipc.server.id, message: { type: 'hello there' } })
// })

ipc.server.on("socket.disconnected", (socket, id) => {
  console.log(`socket with id ${id} disconnected`);
});

ipc.server.start();

players.forEach((player) => {
  const childProcess = spawn("cmd.exe", [
    "/c",
    "start",
    "cmd.exe",
    "/k",
    "node",
    "client.mjs",
    player,
  ]);
  childProcess.on("close", () => {
    console.log("Child process for player ", player, "closed.");
  });
});

function waitForInput(player) {
  const otherPlayer = players.find((p) => p !== player);
  ipc.server.emit(sockets[otherPlayer], "app.message", {
    id: ipc.config.id,
    message: { type: "pause" },
  });
  ipc.server.emit(sockets[player], "app.message", {
    id: ipc.config.id,
    message: { type: "start" },
  });
  ipc.server.emit(sockets[player], "app.message", {
    id: ipc.config.id,
    message: { type: "prompt" },
  });
  return new Promise((resolve) =>
    ipc.server.on("app.message", (data) => {
      if (data.message.type === "input") {
        resolve(data.message.input);
      }
    })
  );
}

function waitForPlayerConnection() {
  return new Promise((resolve) => {
    ipc.server.on("ready", () => {
      resolve();
    });
  });
}

const controller = manageMapSelection({ mapManager, turnManager, ipc });

waitForPlayerConnection().then(async () => {
  let result = controller.next(); // start the generator
  for (const player of turnManager.getAllTurns()) {
    result = controller.next(await waitForInput(player));
  }

  ipc.server.broadcast("app.message", {
    id: ipc.config.id,
    message: { type: "end" },
  });
  rl.close();
});
