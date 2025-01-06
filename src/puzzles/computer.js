import { createUserElement, createStoryElement, createDiv } from "../utils";

const colorMap = {
  0: "white",
  1: "lime",
  2: "aqua",
  3: "fuchsia",
};

export class ComputerPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "computer";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText =
      'You are in a room with grey walls and grey carpet tiles. A series of flourescent tubes provide stark lighting along with a low buzzing sound. There is a door to the northeast.\n\n\nAs you enter the room a disappearing voice says,\n\n\n"Listen, OK, I\'m going to the toilet, OK."\n\n\n"Don\'t touch my computer, OK?"\n\n\n"This game is OK."\n\n\nThere is a computer resting on a large wooden bench.';
    this.outOfMemoryText =
      "The message on the screen reads:-\n\n\t\tOut of memory at\n\t\trecursion level 3.";
    this.returnText =
      'You recognise a voice behind you saying, "Ah, that\'s better. OK, get off my computer, OK."\n\nYou are back in the microcomputer room.';
    this.recursionLayer = 0;
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const textContainer = createDiv("text-container");
    const textDisplayDiv = createDiv("puzzle-line-container");
    if (this.puzzleLine.length === 0) {
      this.puzzleLine.push({ class: "puzzle", text: this.puzzleText });
      if (this.recursionLayer === 3) {
        this.puzzleLine.push({ class: "puzzle", text: this.outOfMemoryText });
      } else {
        this.recursionLayer++;
      }
    }
    this.setStoryTextColor();
    this.puzzleLine.forEach((entry, i) => {
      const element =
        entry.class === "userInput"
          ? createUserElement(entry.text, i)
          : createStoryElement(entry.text, i);

      textDisplayDiv.appendChild(element);
    });
    textContainer.appendChild(textDisplayDiv);
    puzzleContainer.appendChild(textContainer);

    const textInputContainer = createDiv("user-input-container");
    const arrows = document.createElement("p");
    arrows.textContent = ">>";
    const userInputElement = document.createElement("input");
    userInputElement.setAttribute("type", "text");
    userInputElement.setAttribute("id", "puzzle-user-input");
    userInputElement.setAttribute("class", "user-input");
    userInputElement.setAttribute("onblur", "this.focus()");
    userInputElement.setAttribute(
      "oninput",
      "this.value = this.value.toUpperCase()"
    );
    userInputElement.setAttribute("autofocus", "true");
    userInputElement.setAttribute("autocomplete", "off");
    userInputElement.addEventListener("keypress", (event) =>
      this.handleKeyDown(event, user)
    );
    textInputContainer.appendChild(arrows);
    textInputContainer.appendChild(userInputElement);
    puzzleContainer.appendChild(textInputContainer);
    this.gameScreenElements = {
      userInputElement,
      textDisplayDiv,
      textContainer,
    };
    return puzzleContainer;
  }

  handleKeyDown({ key }, user) {
    if (key === "Enter") {
      const userInput = this.gameScreenElements.userInputElement.value;
      if (userInput.trim().length === 0) return;
      this.gameScreenElements.userInputElement.value = "";
      user.handleInput(userInput);
    }
  }

  async respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });
    if (userInput === "USE COMPUTER") {
      if (this.recursionLayer < 3) {
        this.recursionLayer++;
        this.resetPuzzle();
        this.renderPuzzle();
        setTimeout(() => {
          this.setStoryTextColor();
          this.puzzleLine.push({ class: "puzzle", text: this.puzzleText });
          this.renderPuzzle();
        }, 400);
      } else {
        this.puzzleLine.push({ class: "puzzle", text: this.outOfMemoryText });
        this.renderPuzzle();
      }
      return;
    }

    if (userInput === "LEAVE") {
      if (this.recursionLayer > 0) {
        setTimeout(() => {
          this.recursionLayer--;
          this.resetPuzzle();
          this.setStoryTextColor();
          this.puzzleLine.push({ clas: "puzzle", text: this.puzzleText });
          this.puzzleLine.push({ class: "userInput", text: userInput });
          this.puzzleLine.push({ class: "puzzle", text: this.returnText });
          this.renderPuzzle();
        }, 400);
      } else {
        this.puzzleLine.push({ class: "puzzle", text: "I don't understand." });
        this.renderPuzzle();
      }
      return;
    }
    this.puzzleLine.pop();
    return "computerLeave";
  }

  setStoryTextColor() {
    const storyTextColor = colorMap[this.recursionLayer];
    const root = document.querySelector(":root");
    root.style.setProperty("--story-text-color", `${storyTextColor}`);
  }

  resetPuzzle() {
    this.puzzleLine = [];
  }

  renderPuzzle() {
    const textDisplayDiv = this.gameScreenElements.textDisplayDiv;
    if (textDisplayDiv) {
      textDisplayDiv.innerHTML = "";
      this.puzzleLine.forEach((entry, i) => {
        const element =
          entry.class === "userInput"
            ? createUserElement(entry.text, i)
            : createStoryElement(entry.text, i);

        textDisplayDiv.appendChild(element);
      });
      textDisplayDiv.scrollTop = textDisplayDiv.scrollHeight;
    }
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  loadFromSaveData(saveData) {
    this.id = saveData.id;
    this.recursionLayer = saveData.recursionLayer;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
      recursionLayer: this.recursionLayer,
    };
  }
}
