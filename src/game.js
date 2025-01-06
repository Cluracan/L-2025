import { storyData } from "./storyData";
import { Room } from "./room";
import { User } from "./user";
import { Display } from "./display";
import { puzzleData } from "./puzzleData";
import { spectacleEncryption, sleep } from "./utils";
import { apePuzzleBot } from "./puzzles/ape";
import {
  GuardBot,
  jailCheck,
  guardRoomCheck,
  createJailGuard,
  guardRNG,
} from "./guardBot";

const bathSolids = [
  "CUBE",
  "DODECAHEDRON",
  "ICOSAHEDRON",
  "OCTAHEDRON",
  "TETRAHEDRON",
];

const directions = {
  N: "N",
  NORTH: "N",
  E: "E",
  EAST: "E",
  S: "S",
  SOUTH: "S",
  W: "W",
  WEST: "W",
  U: "U",
  UP: "U",
  D: "D",
  DOWN: "D",
  NE: "NE",
  NORTHEAST: "NE",
  NW: "NW",
  NORTHEWST: "NW",
  SE: "SE",
  SOUTHEAST: "SE",
  SW: "SW",
  SOUTHWEST: "SW",
  IN: "IN",
  OUT: "OUT",
};

export class Game {
  constructor(userName, modernMode) {
    const gameData = this.generateGameData(storyData);
    this.roomList = gameData;
    this.activeRoom = gameData[0];
    this.visitedRooms = new Set([0]);
    this.storyLine = [gameData[0]];
    const user = new User(this.userCallback, this);
    this.user = user;
    this.display = new Display(user, modernMode);
    this.activePuzzle;
    this.storyMode = true;
    this.userName = userName;
    this.modernMode = modernMode;
    this.completedPuzzles = new Set();
    this.stepCount = 0;
    this.guardBotCount = 0;
  }

  generateGameData(storyData) {
    return storyData.map(
      (
        {
          text,
          mapName,
          options,
          visitedText,
          examinableItems,
          blockedText,
          items,
          userInputConversions,
          triggerAutoResponseCommands,
          autoResponseText,
          puzzleBot,
          guardBot,
          openDoorList,
        },
        roomIndex
      ) => {
        if ((!text, !options))
          console.error(
            `Unable to generate story entry recieved: ${{
              text,
              options,
              blockedText,
              items,
              puzzleBot,
            }}`
          );
        if (guardBot) {
          guardBot = new GuardBot(guardBot);
        }
        return new Room({
          roomId: roomIndex,
          text,
          mapName,
          options,
          blockedText,
          visitedText,
          examinableItems,
          visited: false,
          userInputConversions,
          triggerAutoResponseCommands,
          autoResponseText,
          items,
          puzzleBot,
          guardBot,
          openDoorList,
        });
      }
    );
  }

  async userCallback(userInput, game) {
    if (userInput === "SAVE") {
      game.saveGame();
    } else if (game.storyMode) {
      await game.respondToUserInput(userInput);
    } else {
      if (game.activePuzzle.completed) {
        game.handlePuzzleSuccess(userInput);
      } else {
        const puzzleFeedback = await game.activePuzzle.respondToUserInput(
          userInput
        );
        switch (puzzleFeedback) {
          case "abbotSuccess":
            game.roomList = game.activePuzzle.tidyRooms(game.roomList);
            break;
          case "apeSuccess":
            const ladder = game.user.removeItem("LADDER");
            game.roomList[6].items.push(ladder);
            break;
          case "calculatorSuccess":
            game.activeRoom.guardBot = undefined;
            break;
          case "computerLeave":
            game.activePuzzle.puzzleLine.forEach((puzzleLine) => {
              game.storyLine.push(puzzleLine);
            });
            game.activePuzzle.resetPuzzle();
            game.storyMode = true;
            game.display.returnToStory(game.user, game.roomList);
            game.user.handleInput(userInput);
            game.displayGame();
            game.display.gameScreenElements.userInputElement.focus();
            break;
          case "leave":
            game.activePuzzle.puzzleLine.forEach((puzzleLine) => {
              game.storyLine.push(puzzleLine);
            });
            game.activePuzzle.resetPuzzle();
            game.storyMode = true;
            game.display.returnToStory(game.user, game.roomList);
            game.displayGame();
            game.display.gameScreenElements.userInputElement.focus();
            break;
          default:
            console.log("default puzzleFeedback check");
            break;
        }
      }
      game.displayGame();
    }
  }

  handlePuzzleSuccess(userInput) {
    this.completedPuzzles.add(this.activePuzzle.id);
    console.log(this.completedPuzzles);
    this.activePuzzle.puzzleLine.forEach((puzzleLine) => {
      this.storyLine.push(puzzleLine);
    });

    if (this.activeRoom.puzzleBot.openDoors) {
      this.activeRoom.openDoors(this.roomList);
    }

    if (this.activeRoom.puzzleBot.rewardItems) {
      if (this.activeRoom.puzzleBot.rewardToInventory) {
        this.activeRoom.puzzleBot.rewardItems.forEach((reward) => {
          this.user.addItem(reward);
        });
      } else {
        this.activeRoom.puzzleBot.rewardItems.forEach((reward) => {
          this.activeRoom.addItem(reward);
        });
      }
    }

    if (this.activeRoom.puzzleBot.addOnText) {
      this.activeRoom.appendDescription(this.activeRoom.puzzleBot.addOnText);
    }

    this.storyMode = true;
    this.display.returnToStory(this.user, this.roomList);
    this.displayGame();
    this.display.gameScreenElements.userInputElement.focus();
    this.activeRoom.puzzleBot = undefined;
    this.user.handleInput(userInput);
    this.displayGame();
  }

  async respondToUserInput(userInput) {
    this.storyLine.push({ class: "userInput", text: userInput });
    this.displayGame();
    if (this.display.spectaclesModifier) {
      userInput = spectacleEncryption(userInput);
    }

    if (this.activeRoom.puzzleBot) {
      const puzzleBotResponse = this.puzzleBotRespond(userInput);
      if (puzzleBotResponse) return;
    }

    if (this.activeRoom.guardBot) {
      const guardBotResponse =
        this.activeRoom.guardBot.respondToUserInput(userInput);
      if (guardBotResponse) {
        this.sendToStoryLine(guardBotResponse.text);
        this.displayGame();
        switch (guardBotResponse.action) {
          case "jail":
            await this.sendUserToJail();
            this.displayGame();
            break;
          case "guardSuccess":
            if (this.activeRoom.guardBot.openDoors) {
              this.activeRoom.openDoors(this.roomList);
            }
            if (this.activeRoom.guardBot.addOnText) {
              this.activeRoom.appendDescription(
                this.activeRoom.guardBot.addOnText
              );
            }
            this.activeRoom.guardBot = undefined;
            this.guardBotCount++;
            break;
          case "jailFail":
            this.activeRoom.guardBot = undefined;
            break;
        }
        return;
      }
    }

    if (
      this.activeRoom.triggerAutoResponseCommands &&
      this.activeRoom.triggerAutoResponseCommands.includes(userInput)
    ) {
      this.sendToStoryLine(this.activeRoom.autoResponseText);
      this.displayGame();
      return;
    }

    userInput = this.inputConversionCheck(userInput);
    const { actionType, keyWord } = this.parseInput(userInput);

    //TO REMOVE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    if (userInput.split(" ")[0] === "TELEPORT") {
      this.activeRoom = this.roomList[parseInt(userInput.split(" ")[1])];
      return;
    }
    //TO REMOVE ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    switch (actionType) {
      case "movement":
        const nextRoom = this.getNextRoom(directions[keyWord]);
        if (this.storyMode) {
          if (nextRoom.roomId) {
            this.activeRoom = guardRNG(nextRoom, this.user.hasItem("RING"));
            this.buildNextRoom(nextRoom);

            if (guardRoomCheck(this.activeRoom) && !this.user.hasItem("RING")) {
              this.displayGame();
              await Promise.all([
                this.sendToStoryLine(
                  "\n\n...but before you can do anything, the Drogo Robot Guards overpower you. They search you and carry you off.\n\n\n\n"
                ),
                sleep(1600),
              ]);
              this.displayGame();
              await this.sendUserToJail();
            }
          } else {
            this.storyLine.push(nextRoom);
            if (jailCheck(this.activeRoom)) {
              this.activeRoom.guardBot = createJailGuard();
              this.sendToStoryLine(this.activeRoom.guardBot.initialText);
              this.displayGame();
            }
          }
        }
        break;
      case "get":
        this.pickUpItem(keyWord);
        break;
      case "drop":
        this.handleDropItem(keyWord);
        break;
      case "look":
        this.examineItem(keyWord);
        break;
      case "inventory":
        this.buildInventory();
        break;
      case "move":
        this.moveCheck(keyWord);
        break;
      case "use":
        this.useItem(keyWord);
        break;
      case "swim":
        this.swimCheck(keyWord);
        break;
      case "drink":
        this.drinkItem(keyWord);
        break;
      case "teleport":
        this.teleportUser();
        break;
      case "speech":
        this.speak(keyWord);
        break;
      default:
        this.sendToStoryLine("I don't understand.");
    }
    await this.displayGame();
  }

  puzzleBotRespond(userInput) {
    if (
      this.activeRoom.puzzleBot.declinePuzzleCommands &&
      this.activeRoom.puzzleBot.declinePuzzleCommands.includes(userInput)
    ) {
      this.sendToStoryLine(this.activeRoom.puzzleBot.turnedDownText);
      this.displayGame();
      return true;
    } else if (
      this.activeRoom.puzzleBot.triggerPuzzleCommands.includes(userInput)
    ) {
      if (
        this.activeRoom.puzzleBot.puzzleId === "ape" &&
        !this.user.hasItem("LADDER")
      ) {
        this.sendToStoryLine(
          "\"You aren't carrying a ladder, so I can't help you!\", says the ape."
        );
        this.displayGame();
        return true;
      } else {
        this.storyMode = false;
        this.displayGame();
        return true;
      }
    } else return false;
  }

  buildNextRoom(nextRoom) {
    this.display.spectaclesModifier = false;
    if (
      nextRoom.items &&
      nextRoom.items.find((element) => element.name === "SPECTACLES")
    ) {
      this.display.spectaclesModifier = true;
    }
    let text =
      nextRoom.visited && nextRoom.visitedText
        ? nextRoom.visitedText
        : nextRoom.text;
    if (nextRoom.items) {
      nextRoom.items.forEach((item) => (text += `\n\n${item.text}`));
    }
    if (nextRoom.guardBot) {
      text += `\n\n${nextRoom.guardBot.initialText}`;
    }
    if (nextRoom.puzzleBot) {
      text += `\n\n${
        nextRoom.visited && nextRoom.puzzleBot.visitedText
          ? nextRoom.puzzleBot.visitedText
          : nextRoom.puzzleBot.initialText
      }`;
    }
    this.sendToStoryLine(text);
  }

  sendUserToJail() {
    return new Promise((resolve) => {
      const userInventory = this.user.removeInventory();
      if (userInventory.length > 0) {
        this.sendToStoryLine(
          "\n...your possessions have been placed in a safe place somewhere on the ground floor of the palace...\n\n\n"
        );
        this.displayGame();
      }
      setTimeout(() => {
        userInventory.forEach((item) => {
          this.roomList[12].addItem(item);
        });
        this.activeRoom.guardBot = undefined;
        this.activeRoom = this.roomList[70];
        this.display.spectaclesModifier = false;
        this.examineItem("LOOK");
        resolve();
      }, 800);
    });
  }

  inputConversionCheck(userInput) {
    if (this.activeRoom.userInputConversions) {
      return this.activeRoom.userInputConversions[userInput] || userInput;
    }
    return userInput;
  }

  parseInput(userInput) {
    const commandDictionary = {
      movement: ["GO", "WALK", "RUN"],
      get: ["GET", "PICK", "GRAB", "TAKE"],
      drop: ["DROP", "THROW"],
      look: ["LOOK", "SEARCH", "EXAMINE", "READ"],
      inventory: ["INV", "INVENTORY"],
      move: ["MOVE", "PUSH", "PULL"],
      use: ["USE", "INSERT", "APPLY"],
      swim: ["SWIM", "DIVE"],
      drink: ["DRINK", "QUAFF", "SWIG", "SIP"],
      teleport: ["NEUMANN"],
      speech: ["SAY", "SHOUT", "YELL", "SCREAM"],
    };
    const splitInput = userInput.split(" ");
    const actionWord = splitInput[0].trim();
    const keyWord = splitInput[splitInput.length - 1].trim();
    if (Object.keys(directions).includes(actionWord)) {
      return { actionType: "movement", keyWord };
    }

    for (const [actionType, triggerWords] of Object.entries(
      commandDictionary
    )) {
      if (triggerWords.includes(actionWord)) {
        return { actionType, keyWord };
      }
    }
    return { actionType: null, keyWord };
  }

  pickUpItem(keyWord) {
    if (!this.activeRoom.hasItem(keyWord)) {
      this.sendToStoryLine("I don't see that here.");
      return;
    }
    if (this.activeRoom.findItem(keyWord).pickUpFailText) {
      this.sendToStoryLine(this.activeRoom.findItem(keyWord).pickUpFailText);
      return;
    }
    let collectedItem = this.activeRoom.removeItem(keyWord);
    this.user.addItem(collectedItem);
    this.sendToStoryLine(`You take the ${collectedItem.pickUpText}`);
    if (collectedItem.name === "SPECTACLES") {
      this.display.spectaclesModifier = false;
    }
    if (collectedItem.name === "RING") {
      this.sendToStoryLine(
        "\n\nThe ring has made you and everything you are carrying invisble."
      );
    }
  }

  async handleDropItem(keyWord) {
    if (this.user.hasItem(keyWord) || keyWord === "ALL") {
      let itemsToDrop =
        keyWord === "ALL"
          ? this.user.inventory.map((item) => item.name)
          : [keyWord];
      itemsToDrop.forEach(async (item) => await this.dropItem(item));
    } else {
      this.sendToStoryLine("You don't have that.");
    }
  }

  async dropItem(keyWord) {
    let collectedItem = this.user.removeItem(keyWord);
    if (collectedItem.name === "RING") {
      if (this.activeRoom.roomId === 75) {
        await Promise.all([
          this.sendToStoryLine(
            "\n\nYou are no longer invisible.\n\n\nThe Drogo Guards jump in surprise at your sudden appearance amongst them, but quickly gather their wits and overpower you. They take the ring you dropped and carry you off.\n\n\n"
          ),
          this.displayGame(),
          this.roomList[12].addItem(collectedItem),
          await this.sendUserToJail(),
          this.displayGame(),
        ]);
        return;
      }

      if (this.activeRoom.roomId === 76) {
        if (!this.user.hasItem("LADDER")) {
          this.sendToStoryLine(
            'You are no longer invisible.\n\n\nThe girl says, "Haven\'t you got the ladder...", but before she can finish, several Drogo Robot Guards rush into the room and grab you. After searching you, they carry you away. They have taken everything you possess, including the ring.\n\n\n'
          );
          this.displayGame();
          this.roomList[12].addItem(collectedItem);
          await this.sendUserToJail();
          this.displayGame();
        } else {
          this.sendToStoryLine(
            "You are no longer invisible.\n\n\nThe girl says, \"I'm Runia. The abbot told me about you in a smuggled message. I'm glad you got here safely. We must be quick! Give me the rope ladder.\"\n\nRunia fixes the rope ladder to the window, and you both climb down to the floor of the palace. A Drogo Robot Guard appears at the window, but does not follow you.\n\n\n\nIt is late afternoon and still very hot. The only noise is the buzzing of insects. In the distance, your sister is still reading her book. "
          );
          this.displayGame();
          this.user.removeItem("LADDER");
          this.activeRoom = this.roomList[77];
        }
        return;
      }
    }
    this.activeRoom.addItem(collectedItem);
    this.sendToStoryLine(`You drop the ${collectedItem.pickUpText}`);
    if (collectedItem.name === "SPECTACLES") {
      this.display.spectaclesModifier = true;
    }
  }

  examineItem(keyWord) {
    switch (keyWord) {
      case "LOOK":
        let text = this.activeRoom.text;

        if (this.activeRoom.guardBot) {
          text += `\n\n${this.activeRoom.guardBot.initialText}`;
        }

        if (this.activeRoom.puzzleBot) {
          text += `\n\n${
            this.activeRoom.visited && this.activeRoom.puzzleBot.visitedText
              ? this.activeRoom.puzzleBot.visitedText
              : this.activeRoom.puzzleBot.initialText
          }`;
        }

        this.activeRoom.items.forEach((item) => (text += `\n\n${item.text}`));
        this.sendToStoryLine(text);
        break;
      case "BATH":
        if (this.activeRoom.hasItem("BATH")) {
          let bath = this.activeRoom.findItem("BATH");
          this.buildBathText(bath);
        } else {
          this.sendToStoryLine("You don't see that here.");
        }
        break;

      default:
        if (this.user.hasItem(keyWord)) {
          let item = this.user.findItem(keyWord);
          this.sendToStoryLine(
            item.examineText || `You see a ${item.pickUpText}`
          );
        } else if (this.activeRoom.hasItem(keyWord)) {
          this.sendToStoryLine(this.activeRoom.findItem(keyWord).text);
          return;
        } else if (
          this.activeRoom.examinableItems &&
          Object.keys(this.activeRoom.examinableItems).includes(keyWord)
        ) {
          this.sendToStoryLine(this.activeRoom.examinableItems[keyWord]);
        } else {
          this.sendToStoryLine("You see nothing special.");
        }
    }
  }

  buildBathText(bath) {
    let bathText = "The bath ";
    bathText += this.bathFloatCheck(bath)
      ? "looks watertight and ready to float...\n\n"
      : "won't float as it is not quite watertight...\n\n";
    bath.holes.forEach((holeInfo) => {
      if (holeInfo.filled) {
        bathText += `The ${holeInfo.solidDesc} ${holeInfo.filledText} ${holeInfo.hole}\n\n`;
      } else {
        bathText += `...it has a ${holeInfo.hole}\n\n`;
      }
    });
    this.storyLine.push({
      class: "story",
      text: this.spectacleCheck(bathText),
    });
  }

  useItem(keyWord) {
    if (keyWord === "BATH") {
      if (this.activeRoom.hasItem("BATH")) {
        const bath = this.activeRoom.findItem("BATH");

        if (this.activeRoom.roomId === 49 && this.user.hasItem("LADDER")) {
          this.activeRoom.puzzleBot = apePuzzleBot;
          this.sendToStoryLine(`\n\n${this.activeRoom.puzzleBot.initialText}`);
        } else if (!this.bathFloatCheck(bath)) {
          this.buildBathText(bath);
        } else if (this.user.inventory.length > 1) {
          this.sendToStoryLine(
            "The bath won't carry that much weight. You must take fewer things with you or you will sink."
          );
        } else if (!this.user.hasItem("OAR")) {
          this.sendToStoryLine(
            "You won't get far without an oar.\n\n(Pirhana fish are said to regard human fingers as a great delicacy.)"
          );
        } else {
          this.sendToStoryLine(
            "\nThe bath takes you safely across the river.\n\n\n"
          );
          const currentRoomId = this.activeRoom.roomId;
          const nextRoomId = currentRoomId == 48 ? 49 : 48;
          this.activeRoom = this.roomList[nextRoomId];
          this.buildNextRoom(this.activeRoom);
        }
      }
      return;
    }

    if (!this.user.hasItem(keyWord)) {
      this.sendToStoryLine("You don't have that.");
      return;
    }

    if (bathSolids.includes(keyWord) && this.activeRoom.hasItem("BATH")) {
      const collectedItem = this.user.removeItem(keyWord);
      const bath = this.activeRoom.findItem("BATH");
      bath.holes.forEach((hole) => {
        if (hole.solidName === collectedItem.name) {
          hole.filled = true;
          this.sendToStoryLine(
            `The ${hole.solidDesc} ${hole.filledText}${hole.hole}`
          );
        }
      });
      return;
    }
    if (keyWord === "KEY" && this.activeRoom.roomId === 54) {
      if (!this.user.hasItem("KEY")) {
        this.sendToStoryLine("You don't have any keys!");
      } else {
        this.user.removeItem("KEY");
        this.activeRoom.openDoors(this.roomList);
        this.sendToStoryLine("You unlock the door.");
      }
      return;
    }

    if (this.user.findItem(keyWord).isDrinkable) {
      this.drinkItem(keyWord);
      return;
    }

    //default
    this.sendToStoryLine("You can't use that here.");
  }

  bathFloatCheck(bath) {
    return bath.holes.every((entry) => entry.filled);
  }

  buildInventory() {
    let text = "You are carrying";
    if (this.user.inventory.length === 0) {
      text += " nothing.";
    } else {
      text += ":-";
      this.user.inventory.forEach((item) => {
        text += `\n\n${item.inventoryText}`;
      });
    }
    this.sendToStoryLine(text);
  }

  moveCheck(keyWord) {
    if (keyWord === "CHEST" && this.activeRoom.roomId === 10) {
      if (this.user.inventory.length === 0 && !this.activeRoom.options["D"]) {
        this.sendToStoryLine(
          "The chest has been moved to reveal a trap door in the floor. A ladder leads down into a cellar."
        );
        this.activeRoom.appendDescription(
          `\n\nThe chest has been moved to reveal a trap door in the floor. A ladder leads down into a cellar.`
        );
        this.activeRoom.openDoors(this.roomList);
      } else {
        this.sendToStoryLine("The chest doesn't seem to move.");
      }
    } else {
      this.sendToStoryLine("You can't move that.");
    }
  }

  swimCheck(keyWord) {
    if (
      (keyWord === "RIVER" || keyWord === "SWIM") &&
      (this.activeRoom.roomId === 48 || this.activeRoom.roomId === 49)
    ) {
      this.sendToStoryLine(
        "As you enter the water, a pirhana fish gives you a nasty nip on your big toe. You hastily retreat to the bank."
      );
    } else if (
      (keyWord === "POOL" || keyWord === "SWIM") &&
      this.activeRoom.roomId === 18
    ) {
      this.sendToStoryLine(
        "Waving your arms and legs about in an empty pool will look very silly."
      );
    }
  }

  drinkItem(keyWord) {
    if (keyWord === "DRINK") {
      this.sendToStoryLine("You'll have to tell me what to drink.");
    } else if (!this.user.hasItem(keyWord)) {
      this.sendToStoryLine("You don't have that!");
    } else if (!this.user.findItem(keyWord).isDrinkable) {
      this.sendToStoryLine("You can't drink that!");
    } else {
      const targetDrink = this.user.removeItem(keyWord);
      const userHeight = this.user.height;
      this.sendToStoryLine(targetDrink.drinkMessage[userHeight]);
      this.user.changeHeight(targetDrink.heightMultiplier);
      const swimmingPoolRoom = this.roomList[51];
      switch (this.user.height) {
        case 0.6:
          swimmingPoolRoom.blockedText =
            "You are small enough to fit through the hole but, as it is some distance above the floor of the pool, it is too high for you to reach.";
          break;
        case 0.75:
          swimmingPoolRoom.options["IN"] = 52;
          swimmingPoolRoom.travelText = {
            IN: "You are only just tall enough to reach the hole, and it is a very tight squeeze to enter it\n\n",
          };
      }
    }
  }

  teleportUser() {
    const roomId = this.activeRoom.roomId;
    if (roomId === 70 || roomId === 71 || roomId === 72) {
      this.sendToStoryLine(
        "Suddenly it goes dark. You experience the sensation of travelling in a high speed lift.\n\nYou are in the old kitchen."
      );
      this.activeRoom = this.roomList[2];
    } else {
      this.sendToStoryLine("Nothing happens.");
    }
  }

  speak(keyWord) {
    console.log("test speak");
    if (keyWord === "NEUMANN") {
      this.teleportUser();
    } else {
      this.sendToStoryLine("Nothing happens.");
    }
  }

  sendToStoryLine(text) {
    this.storyLine.push({ class: "story", text: this.spectacleCheck(text) });
  }

  spectacleCheck(text) {
    return this.display.spectaclesModifier ? spectacleEncryption(text) : text;
  }

  getNextRoom(userInput) {
    const nextRoomIndex = this.activeRoom.options[userInput];
    if (nextRoomIndex === undefined) {
      return {
        class: "story",
        text: this.spectacleCheck("There is no way to go in that direction."),
      };
    } else if (nextRoomIndex === "blocked") {
      return { class: "story", text: this.activeRoom.blockedText };
    } else {
      if (this.activeRoom.travelText && this.activeRoom.travelText[userInput]) {
        this.sendToStoryLine(this.activeRoom.travelText[userInput]);
      }
      const nextRoom = this.roomList[nextRoomIndex];
      this.activeRoom.visited = true;
      this.stepCount++;
      return nextRoom;
    }
  }

  async displayGame() {
    if (this.storyMode) {
      this.visitedRooms.add(this.activeRoom.roomId);
      await this.display.displayStory(
        this.storyLine,
        this.user.inventory,
        this.visitedRooms,
        this.roomList,
        this.activeRoom.roomId
      );
    } else {
      this.activePuzzle = puzzleData[this.activeRoom.puzzleBot.puzzleId];
      const puzzleElements = this.activePuzzle.createPuzzleHTML(this.user);
      this.display.displayPuzzle(
        puzzleElements,
        this.user.inventory,
        this.activeRoom.roomId,
        this.visitedRooms,
        this.roomList
      );
      this.activePuzzle.renderPuzzle();
    }
    sessionStorage.setItem(
      "gameData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
    sessionStorage.setItem(
      "userData",
      btoa(JSON.stringify(this.user.generateSaveData()))
    );
  }

  generateSaveData() {
    const userData = this.user.generateSaveData();
    return {
      gameData: {
        activeRoom: this.activeRoom,
        currentMapRoomId: this.display.mapHandler.currentRoomId,
        visitedRooms: Array.from(this.visitedRooms),
        completedPuzzles: Array.from(this.completedPuzzles),
        storyLine: this.storyLine,
        storyMode: this.storyMode,
        roomList: this.roomList,
        userName: this.userName,
        modernMode: this.modernMode,
        stepCount: this.stepCount,
        guardBotCount: this.guardBotCount,
      },
      userData,
    };
  }

  loadFromSaveData({ gameData, userData }) {
    this.display.mapHandler.currentRoomId = gameData.currentMapRoomId;
    this.display.modernMode = gameData.modernMode;
    this.visitedRooms = new Set(gameData.visitedRooms);
    this.completedPuzzles = new Set(gameData.completedPuzzles);
    this.storyMode = gameData.storyMode;
    this.userName = gameData.userName;
    this.stepCount = gameData.stepCount;
    this.guardBotCount = gameData.guardBotCount;
    this.modernMode = gameData.modernMode;
    this.roomList = gameData.roomList.map(
      (
        {
          text,
          mapName,
          options,
          visitedText,
          examinableItems,
          blockedText,
          items,
          userInputConversions,
          triggerAutoResponseCommands,
          autoResponseText,
          puzzleBot,
          guardBot,
          openDoorList,
        },
        roomIndex
      ) => {
        if ((!text, !options))
          console.error(
            `Unable to generate story entry recieved: ${{
              text,
              options,
              blockedText,
              items,
              puzzleBot,
            }}`
          );
        if (guardBot) {
          guardBot = new GuardBot(guardBot);
        }
        return new Room({
          roomId: roomIndex,
          text,
          mapName,
          options,
          blockedText,
          visitedText,
          examinableItems,
          visited: false,
          userInputConversions,
          triggerAutoResponseCommands,
          autoResponseText,
          items,
          puzzleBot,
          guardBot,
          openDoorList,
        });
      }
    );
    this.activeRoom = this.roomList[gameData.activeRoom.roomId];
    if (this.activeRoom.hasItem("SPECTACLES")) {
      this.display.spectaclesModifier = true;
    }
    if (this.activeRoom.guardBot) {
      this.activeRoom.guardBot = new GuardBot(this.activeRoom.guardBot);
    }
    this.storyLine = gameData.storyLine.map((dataObj) => {
      return { class: dataObj.class, text: dataObj.text };
    });
    this.user.loadFromSaveData(userData);
  }

  saveGame() {
    const gameSaveData = this.generateSaveData();
    const userSaveData = this.user.generateSaveData();
    const gameSaveString = btoa(JSON.stringify({ gameSaveData, userSaveData }));

    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("id", "downloadLink");
    downloadLink.download = "Game Save";
    downloadLink.href = `data:attachment/text,${encodeURI(gameSaveString)}`;
    downloadLink.target = "_blank";
    const date = new Date();
    const adjustedTeamName = this.userName.trim().replace(/ /g, "_");
    downloadLink.download = `L_Game_Save_${adjustedTeamName}_${date.getDay()}-${date.getMonth()}-${date.getFullYear()}.sav`;
    downloadLink.click();
  }

  handleRefreshContent(sessionGameData, sessionUserData, sessionPuzzleData) {
    const gameSaveData = JSON.parse(atob(sessionGameData));
    const userSaveData = JSON.parse(atob(sessionUserData));
    this.loadFromSaveData(gameSaveData);
    this.user.loadFromSaveData(userSaveData);
    if (sessionPuzzleData && this.activeRoom.puzzleBot) {
      const puzzleSaveData = JSON.parse(atob(sessionPuzzleData));
      if (puzzleSaveData.id === this.activeRoom.puzzleBot.puzzleId) {
        this.activePuzzle = puzzleData[this.activeRoom.puzzleBot.puzzleId];
        this.activePuzzle.loadFromSaveData(puzzleSaveData);
      }
    }

    this.displayGame();
  }
}
