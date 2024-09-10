export const messages = {
  // map-generators
  pickNumberOfMapsToPlay: () => 'Enter the number of maps to play:',
  pickFirstPlayer: (playerNames) => `Enter the first player to ban and pick a map (${playerNames.join(' or ')}):`,
  invalidPlayerPicked: (playerName, playerNames) => `${playerName} is an invalid player. Please enter either ${playerNames.join(' or ')}.`,
  listBanOrder: (banOrder) => `Ban order: ${banOrder.join(', ')}`,
  listPickOrder: (pickOrder) => `Pick order: ${pickOrder.join(', ')}`,
  listNumberOfMapsToBan: (numOfMapsToBan) => `Number of maps to ban: ${numOfMapsToBan}`,
  banStart: (numOfMapsToBan) => `Starting the map banning process. You need to ban ${numOfMapsToBan} maps.`,
  playerBanChoose: (currentPlayer, mapPool) => `Player ${currentPlayer}, choose a map to ban from the pool: ${mapPool.join(', ')}`,
  invalidBanChoice: (mapChoice, mapPool) => `${mapChoice} is invalid choice! Please choose a valid map from the pool: ${mapPool.join(', ')}`,
  listBanChoices: (bannedMaps) => `Banned maps: ${bannedMaps.map(item => `${item.player}: ${item.map}`).join(', ')}`,
  pickStart: (numOfMapsToPick) => `Starting the map picking process. You need to pick ${numOfMapsToPick} maps.`,
  playerPickChoose: (currentPlayer, mapPool) => `Player ${currentPlayer}, pick a map from the pool: ${mapPool.join(', ')}`,
  invalidPickChoice: (mapChoice, mapPool) => `${mapChoice} is invalid choice! Please choose a valid map from the pool: ${mapPool.join(', ')}`,
  listPickChoices: (pickedMaps) => `Picked maps: ${pickedMaps.map(item => `${item.player}: ${item.map}`).join(', ')}`,
  // MapManager
  mapAlreadyExists: (map) => `Map ${map} already exists in the pool.`,
  mapDoesntExist: (map) => `Map ${map} does not exist in the pool.`,
  listMapsInPool: (mapPool) => `Current maps in pool: ${mapPool.join(', ')}`,
  unpickableMap: (map) => `Map ${map} is not available to pick.`,
  unbannableMap: (map) => `Map ${map} is not available to ban.`,
  listPickedMaps: (pickedMaps) => `Picked maps: ${pickedMaps.map(item => `${item.player}: ${item.map}`).join(', ')}`,
  listBannedMaps: (bannedMaps) => `Banned maps: ${bannedMaps.map(item => `${item.player}: ${item.map}`).join(', ')}`
};