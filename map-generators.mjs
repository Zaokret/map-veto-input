import {
  createMessageNotification,
  createPromptMessage,
} from "./generator-output-builders.mjs";

import { messages } from "./messages.mjs";

function* banMapsGenerator(mapManager, numOfMapsToBan, banOrder) {
  yield createMessageNotification(messages.banStart(numOfMapsToBan));
  let banIndex = 0;
  while (mapManager.getBannedMaps().length < numOfMapsToBan) {
    const currentPlayer = banOrder[banIndex];
    yield createPromptMessage(messages.playerBanChoose(currentPlayer, mapManager.getMapPool()));
    const mapChoice = yield;
    if (!mapManager.hasMap(parseInt(mapChoice))) {
      yield createMessageNotification(messages.invalidBanChoice(mapChoice, mapManager.getMapPool()));
      continue;
    }
    mapManager.banMap(parseInt(mapChoice), currentPlayer);
    banIndex++;
  }
  yield createMessageNotification(mapManager.displayBannedMaps());
  return mapManager.getBannedMaps();
}

function* pickMapsGenerator(mapManager, numOfMapsToPlay, pickOrder) {
  yield createMessageNotification(
    messages.pickStart(numOfMapsToPlay)
  );
  let pickIndex = 0;
  while (mapManager.getPickedMaps().length < numOfMapsToPlay) {
    const currentPlayer = pickOrder[pickIndex];
    yield createPromptMessage(
      messages.playerPickChoose(currentPlayer, mapManager.getMapPool())
    );
    const mapChoice = yield;
    if (!mapManager.hasMap(parseInt(mapChoice))) {
      yield createMessageNotification(messages.invalidPickChoice(mapChoice, mapManager.getMapPool()));
      continue;
    }
    mapManager.pickMap(parseInt(mapChoice), currentPlayer);
    pickIndex++;
  }
  yield createMessageNotification(mapManager.displayPickedMaps());
  return mapManager.getPickedMaps();
}

export function* manageMapSelection(playerNames, mapManager) {
  console.log(messages.pickNumberOfMapsToPlay());
  let numOfMapsToPlay = parseInt(yield);
  console.log(messages.pickFirstPlayer(playerNames));
  let firstPlayer = yield;
  if (!playerNames.includes(firstPlayer)) {
    console.log(messages.invalidPlayerPicked(firstPlayer, playerNames));
    firstPlayer = yield;
  }
  const numOfMapsToBan = mapManager.getMapCount() - numOfMapsToPlay;
  const banOrder = [];
  for (let i = 0; i < numOfMapsToBan; i++) {
    banOrder.push(
      playerNames[(playerNames.indexOf(firstPlayer) + i) % playerNames.length]
    );
  }
  const pickOrder = [];
  let secondPlayer = playerNames.find((p) => p !== firstPlayer);
  pickOrder.push(firstPlayer);
  for (let i = 1; i < numOfMapsToPlay - 2; i++) {
    pickOrder.push(i % 2 === 0 ? firstPlayer : secondPlayer);
  }
  pickOrder.push(secondPlayer, secondPlayer);
  console.log(messages.listBanOrder(banOrder));
  console.log(messages.listPickOrder(pickOrder));
  console.log(messages.listNumberOfMapsToBan(numOfMapsToBan));
  yield* runInputGenerator(banMapsGenerator(mapManager, numOfMapsToBan, banOrder));
  yield* runInputGenerator(pickMapsGenerator(mapManager, numOfMapsToPlay, pickOrder));
  return {
      pickedMaps: mapManager.getPickedMaps(),
      bannedMaps: mapManager.getBannedMaps(),
  };
}

function* runInputGenerator(generator) {
    let result = generator.next();
    while(!result.done) {
        if (result.value) {
            console.log(result.value.message);
            result = generator.next();
        } else {
            const input = yield;
            result = generator.next(input);
        }
    }
}