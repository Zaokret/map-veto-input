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

// TODO: modify turn manager to handle pick and ban index
export function* manageMapSelection({ mapManager, turnManager, ipc }) {
  console.log(messages.listBanOrder(turnManager.banOrder));
  console.log(messages.listPickOrder(turnManager.pickOrder));
  console.log(messages.listNumberOfMapsToBan(turnManager.banOrder.length));
  const banGen = banMapsGenerator(mapManager, turnManager.banOrder.length, turnManager.banOrder);
  yield* runInputGenerator(banGen, ipc);
  const pickGen = pickMapsGenerator(mapManager, turnManager.pickOrder.length, turnManager.pickOrder);
  yield* runInputGenerator(pickGen, ipc);
  return {
      pickedMaps: mapManager.getPickedMaps(),
      bannedMaps: mapManager.getBannedMaps(),
  };
}

function* runInputGenerator(generator, ipc) {
    let result = generator.next();
    while(!result.done) {
        if (result.value) {
            ipc.server.broadcast("app.message", { id: ipc.config.id, message: { type: 'info', info: result.value } })
            console.log(result.value.message);
            result = generator.next();
        } else {
            
            const input = yield;
            result = generator.next(input);
        }
    }
}