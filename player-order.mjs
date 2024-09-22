function* prompt() {
  console.log(messages.pickNumberOfMapsToPlay());
  let numOfMapsToPlay = parseInt(yield);
  console.log(messages.pickFirstPlayer(playerNames));
  let firstPlayer = yield;
  if (!playerNames.includes(firstPlayer)) {
    console.log(messages.invalidPlayerPicked(firstPlayer, playerNames));
    firstPlayer = yield;
  }
  return { numOfMapsToPlay, firstPlayer };
}

export class PlayerTurnManager {
    constructor({ players, firstPlayer, numOfMapsToPlay, mapManager }) {

        this.players = players;
        // TODO: add multiple strategies for ban/pick
        this.numOfMapsToPlay = numOfMapsToPlay;
        this.numOfMapsToBan = mapManager.getMapCount() - numOfMapsToPlay;
        this.banOrder = [];
        for (let i = 0; i < this.numOfMapsToBan; i++) {
            this.banOrder.push(players[(players.indexOf(firstPlayer) + i) % players.length]);
        }
        this.pickOrder = [];
        let secondPlayer = players.find((p) => p !== firstPlayer);
        this.pickOrder.push(firstPlayer);
        for (let i = 1; i < numOfMapsToPlay - 2; i++) {
            this.pickOrder.push(i % 2 === 0 ? firstPlayer : secondPlayer);
        }
        this.pickOrder.push(secondPlayer, secondPlayer);
    }

    getAllTurns() {
        return [...this.banOrder, ...this.pickOrder];
    }
}


