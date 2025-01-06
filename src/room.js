export class Room {
  constructor({
    roomId,
    text,
    mapName,
    options,
    visitedText,
    blockedText,
    visited,
    examinableItems,
    userInputConversions,
    triggerAutoResponseCommands,
    autoResponseText,
    items,
    puzzleBot,
    guardBot,
    openDoorList,
  }) {
    this.roomId = roomId;
    this.class = "room";
    this.text = text;
    this.mapName = mapName;
    this.visitedText = visitedText;
    this.visited = visited;
    this.examinableItems = examinableItems;
    this.options = options;
    this.blockedText = blockedText;
    this.userInputConversions = userInputConversions;
    this.triggerAutoResponseCommands = triggerAutoResponseCommands;
    this.autoResponseText = autoResponseText;
    this.items = items ? [...items] : [];
    this.puzzleBot = puzzleBot;
    this.guardBot = guardBot;
    this.openDoorList = openDoorList;
  }

  hasItem(searchItem) {
    return this.items.some((item) => item.name === searchItem);
  }

  findItem(searchItem) {
    return this.items.find((item) => item.name === searchItem);
  }

  removeItem(searchItem) {
    const itemIndex = this.items.findIndex((item) => item.name === searchItem);
    return this.items.splice(itemIndex, 1)[0];
  }

  addItem(item) {
    this.items.push(item);
  }

  openDoors(roomList) {
    this.openDoorList.forEach((entry) => {
      roomList[entry.roomId].options[entry.newDirection] = entry.newPointer;
    });
  }

  appendDescription(addOnText) {
    this.text += `\n\n${addOnText}`;
    this.visitedText += `\n\n${addOnText}`;
  }
}
