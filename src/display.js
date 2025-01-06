import {
  createStoryElement,
  createUserElement,
  spectacleEncryption,
  createDiv,
} from "./utils";

import pushPinIcon from "./images/pushPin.svg";

import { Canvas } from "./canvas";

export class Display {
  constructor(user, modernMode) {
    const gameScreenElements = this.generateGameScreen();
    this.gameScreenElements = gameScreenElements;
    this.mapHandler = new Canvas(
      this.gameScreenElements.canvas,
      this.gameScreenElements.ctx,
      this.gameScreenElements.canvas.width,
      this.gameScreenElements.canvas.height
    );
    this.spectaclesModifier = false;
    this.spectaclesText = [];
    this.modernMode = modernMode;
    gameScreenElements.userInputElement.addEventListener("keydown", (event) => {
      this.handleKeyDown(event, user);
    });
    console.log(`initialise display with ${this.modernMode} modern mode`);
  }

  handleKeyDown(event, user) {
    if (event.key === "Enter") {
      this.spectaclesText = [];
      let userInput = this.gameScreenElements.userInputElement.value.trim();
      if (userInput.trim().length === 0) return;
      this.gameScreenElements.userInputElement.value = "";
      user.handleInput(userInput);
    } else {
      if (this.spectaclesModifier && event.key.length === 1) {
        event.preventDefault();
        this.spectaclesText.push(spectacleEncryption(event.key));
        event.target.value = this.spectaclesText.join("");
      } else if (this.spectaclesModifier && event.key === "Backspace") {
        event.preventDefault();
        this.spectaclesText.pop();
        event.target.value = this.spectaclesText.join("");
      }
    }
  }

  async displayStory(
    storyLine,
    inventoryList,
    visitedRooms,
    roomList,
    activeRoomId
  ) {
    console.log(
      `active: ${activeRoomId}, mapCur: ${this.mapHandler.currentRoomId}`
    );

    //Story Text
    const storyDisplayDiv = this.gameScreenElements.storyDisplayDiv;
    storyDisplayDiv.innerHTML = "";
    storyLine.forEach((entry, i) => {
      const element =
        entry.class === "userInput"
          ? createUserElement(entry.text, i)
          : createStoryElement(entry.text, i);
      storyDisplayDiv.appendChild(element);
    });
    storyDisplayDiv.scrollTop = storyDisplayDiv.scrollHeight;
    if (this.modernMode) {
      //Map Updates
      await this.mapHandler.updateMap(activeRoomId, visitedRooms, roomList);
      //Inventory List
      this.#updateInventory(inventoryList);
    } else {
      this.gameScreenElements.contentLeft.innerHTML = "";
      this.gameScreenElements.contentRight.innerHTML = "";
    }
  }

  async displayPuzzle(
    puzzleElements,
    inventoryList,
    activeRoomId,
    visitedRooms,
    roomList
  ) {
    this.gameScreenElements.contentMiddle.innerHTML = "";
    this.gameScreenElements.contentMiddle.appendChild(puzzleElements);
    document.getElementById("puzzle-user-input").focus();
    if (this.modernMode) {
      this.#updateInventory(inventoryList);

      await this.mapHandler.updateMap(activeRoomId, visitedRooms, roomList);
    } else {
      this.gameScreenElements.contentLeft.innerHTML = "";
      this.gameScreenElements.contentRight.innerHTML = "";
    }
  }

  #updateInventory(inventoryList) {
    const inventoryTextHolder = this.gameScreenElements.inventoryTextHolder;
    if (inventoryList.length === 0) {
      inventoryTextHolder.textContent = "You are carrying nothing.";
    } else {
      let inventoryText = "";
      inventoryList.forEach((item) => {
        inventoryText += `${item.inventoryText}\n`;
      });
      inventoryTextHolder.textContent = inventoryText;
    }
  }

  returnToStory(user, roomList) {
    const gameScreenElements = this.generateGameScreen();
    this.gameScreenElements = gameScreenElements;
    this.mapHandler.setCanvas(this.gameScreenElements.canvas);
    this.mapHandler.setContext(this.gameScreenElements.ctx);
    this.mapHandler.drawMap(roomList);
    gameScreenElements.userInputElement.addEventListener("keypress", (event) =>
      this.handleKeyDown(event, user)
    );
  }

  generateGameScreen() {
    const contentLeft = createDiv("content-left");
    const contentMiddle = createDiv("content-middle");
    const contentRight = createDiv("content-right");
    //contentLeft
    const canvasContainer = createDiv("map-canvas-container");
    const canvas = document.createElement("canvas");
    canvas.setAttribute("class", "canvas-map");
    canvas.width = 0.2 * window.innerWidth;
    canvas.height = 0.2 * window.innerWidth;
    const ctx = canvas.getContext("2d");
    canvasContainer.appendChild(canvas);

    const pushPinLeftContainer = createDiv("push-pin-left-container");
    const pushPinLeftImage = document.createElement("img");
    pushPinLeftImage.classList.add("push-pin-image");
    pushPinLeftImage.src = pushPinIcon;
    pushPinLeftContainer.appendChild(pushPinLeftImage);
    canvasContainer.appendChild(pushPinLeftContainer);

    const pushPinRightContainer = createDiv("push-pin-right-container");
    const pushPinRightImage = document.createElement("img");
    pushPinRightImage.classList.add("push-pin-image");
    pushPinRightImage.src = pushPinIcon;
    pushPinRightContainer.appendChild(pushPinRightImage);
    canvasContainer.appendChild(pushPinRightContainer);

    contentLeft.appendChild(canvasContainer);
    //contentMiddle
    const storyDisplayDiv = document.createElement("div");
    storyDisplayDiv.setAttribute("id", "story-display-container");
    storyDisplayDiv.setAttribute("class", "story-display-container");

    const userInputContainer = document.createElement("div");
    userInputContainer.setAttribute("class", "user-input-container");

    const arrows = document.createElement("p");
    arrows.textContent = ">>";

    const userInputElement = document.createElement("input");
    userInputElement.setAttribute("type", "text");
    userInputElement.setAttribute("id", "user-input");
    userInputElement.setAttribute("class", "user-input");
    userInputElement.setAttribute("onblur", "this.focus()");
    userInputElement.setAttribute(
      "oninput",
      "this.value = this.value.toUpperCase()"
    );
    userInputElement.setAttribute("autofocus", "true");
    userInputElement.setAttribute("autocomplete", "off");
    userInputContainer.appendChild(arrows);
    userInputContainer.appendChild(userInputElement);

    contentMiddle.appendChild(storyDisplayDiv);
    contentMiddle.appendChild(userInputContainer);

    //contentright
    const cheatSheetDiv = createDiv("cheat-sheet paper");
    const tapeDivTop = createDiv("tape-section");
    const tapeDivBottom = createDiv("tape-section");
    const cheatSheetInfo = createDiv("cheat-sheet-info");
    cheatSheetInfo.textContent =
      "Useful Commands:\n\nGET PEN :- pick up pen\n\nDROP PEN :- drops it\n\nUSE PEN :- use (if you can)\n\nEXAMINE PEN :- look at the pen\n\nLOOK :- look at current room\n\nLEAVE :- leave the current puzzle";
    cheatSheetDiv.appendChild(tapeDivTop);
    cheatSheetDiv.appendChild(cheatSheetInfo);
    cheatSheetDiv.appendChild(tapeDivBottom);
    contentRight.appendChild(cheatSheetDiv);

    const inventorySheet = createDiv("inventory-sheet paper");
    const inventoryTape = createDiv("top-tape");
    const inventoryHeader = createDiv("inventory-header");
    const inventoryTextHolder = createDiv("inventory-text");
    inventoryHeader.textContent = "Inventory List";
    inventorySheet.appendChild(inventoryTape);
    inventorySheet.appendChild(inventoryHeader);
    inventorySheet.appendChild(inventoryTextHolder);
    contentRight.appendChild(inventorySheet);

    const bodyContainer = document.getElementById("body-container");
    bodyContainer.innerHTML = "";
    bodyContainer.appendChild(contentLeft);
    bodyContainer.appendChild(contentMiddle);
    bodyContainer.appendChild(contentRight);

    return {
      canvas,
      ctx,
      inventoryTextHolder,
      contentLeft,
      contentMiddle,
      contentRight,
      bodyContainer,
      storyDisplayDiv,
      userInputContainer,
      userInputElement,
    };
  }
}
