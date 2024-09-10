import { messages } from "./messages.mjs";

export class MapManager {
    constructor(mapPool) {
      this.mapPool = [...mapPool];
      this.pickedMaps = [];
      this.bannedMaps = [];
    }
  
    addMap(map) {
      if (this.mapPool.includes(map)) {
        throw new Error(messages.mapAlreadyExists(map));
      }
      this.mapPool.push(map);
    }
  
    removeMap(map) {
      const index = this.mapPool.indexOf(map);
      if (index === -1) {
        throw new Error(messages.mapDoesntExist(map));
      }
      this.mapPool.splice(index, 1);
    }
  
    hasMap(map) {
      return this.mapPool.includes(map);
    }
  
    pickMap(map, player) {
      if (!this.hasMap(map)) {
        throw new Error(messages.unpickableMap(map));
      }
      this.removeMap(map);
      this.pickedMaps.push({ map, player });
    }
  
    banMap(map, player) {
      if (!this.hasMap(map)) {
        throw new Error(messages.unbannableMap(map));
      }
      this.removeMap(map);
      this.bannedMaps.push({ map, player });
    }

    getMapPool() {
      return [...this.mapPool];
    }
  
    getMapCount() {
      return this.mapPool.length;
    }

    displayMaps() {
      return messages.listMapsInPool(this.mapPool);
    }
  
    getPickedMaps() {
      return [...this.pickedMaps];
    }
  
    getBannedMaps() {
      return [...this.bannedMaps];
    }
  
    displayPickedMaps() {
      return messages.listPickedMaps(this.pickedMaps);
    }
  
    displayBannedMaps() {
      return messages.listBannedMaps(this.bannedMaps);
    }
  }