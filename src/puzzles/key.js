import { createUserElement, createStoryElement, createDiv } from "../utils";

const keyBlankFiledCells = [9, 29];
const keyCols = 10;
const fourKeyCols = 21;
const fourKeyRows = 10;
const fourKeyFiledCells = [
  "0x0",
  "0x1",
  "0x6",
  "0x7",
  "0x8",
  "0x12",
  "0x13",
  "0x14",
  "0x18",
  "0x19",
  "1x1",
  "1x2",
  "1x7",
  "1x12",
  "1x13",
  "1x18",
  "1x19",
  "1x20",
  "2x0",
  "2x1",
  "2x6",
  "2x7",
  "2x8",
  "2x13",
  "2x14",
  "2x19",
  "3x0",
  "3x1",
  "3x2",
  "3x6",
  "3x7",
  "3x12",
  "3x13",
  "3x14",
  "3x18",
  "3x19",
  "3x20",
  "4x0",
  "4x1",
  "4x2",
  "4x6",
  "4x7",
  "4x12",
  "4x18",
  "4x19",
  "4x20",
  "5x0",
  "5x1",
  "5x6",
  "5x7",
  "5x8",
  "5x12",
  "5x13",
  "5x18",
  "5x19",
  "5x20",
  "6x1",
  "6x2",
  "6x7",
  "6x8",
  "6x12",
  "6x13",
  "6x19",
  "7x0",
  "7x1",
  "7x2",
  "7x6",
  "7x7",
  "7x8",
  "7x13",
  "7x14",
  "7x18",
  "7x19",
  "7x20",
  "8x1",
  "8x2",
  "8x7",
  "8x12",
  "8x13",
  "8x14",
  "8x18",
  "8x19",
  "8x20",
  "9x1",
  "9x7",
  "9x13",
  "9x19",
];
const solution = [0, 1, 2, 3, 4, 5, 6, 8, 9, 14, 21, 22, 26, 27, 28, 29];

export class KeyPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "key";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText = `Here is a picture of the four key holes and the key blank.\r\nUse the ARROW KEYS (or U, D, L, R) to move the file around the key blank and FILE (or F) to file it.  Type UNLOCK when you have finished, or RESET if you wish to start again.`;
    this.completed = false;
    this.keyBlankCells = Array.from({ length: 30 }, (v, i) =>
      keyBlankFiledCells.includes(i)
    );
    this.fileIndex = 0;
    this.puzzleCommands = [
      "U",
      "UP",
      "D",
      "DOWN",
      "L",
      "LEFT",
      "R",
      "RIGHT",
      "F",
      "FILE",
    ];
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const keyHolesContainer = createDiv("key-holes-container");
    const keyHolesText = createDiv("key-holes-text");
    keyHolesText.textContent = "Four Key Holes";
    const keyHolesGrid = createDiv("key-holes-grid");
    for (let i = 0; i < fourKeyRows; i++) {
      for (let j = 0; j < fourKeyCols; j++) {
        const cell = document.createElement("p");
        cell.style.margin = "0px";
        cell.classList.add("key-cell");
        cell.id = `${i}x${j}`;
        cell.style.backgroundColor = fourKeyFiledCells.includes(cell.id)
          ? "black"
          : "white";
        keyHolesGrid.appendChild(cell);
      }
    }
    keyHolesGrid.style.gridTemplateColumns = `repeat(${fourKeyCols},1fr)`;
    keyHolesContainer.appendChild(keyHolesText);
    keyHolesContainer.appendChild(keyHolesGrid);
    puzzleContainer.appendChild(keyHolesContainer);

    const keyBlankContainer = createDiv("key-blank-container");
    const keyBlankText = createDiv("key-blank-text");
    keyBlankText.textContent = "Key Blank";
    const keyBlankGrid = createDiv("key-blank-grid");
    keyBlankGrid.style.gridTemplateColumns = `repeat(${keyCols},1fr)`;

    keyBlankContainer.appendChild(keyBlankText);
    keyBlankContainer.appendChild(keyBlankGrid);
    puzzleContainer.appendChild(keyBlankContainer);

    const instructionsContainer = createDiv("instructions");
    instructionsContainer.textContent = this.puzzleText;
    puzzleContainer.appendChild(instructionsContainer);

    const textContainer = createDiv("text-container");
    const puzzleText = document.createElement("p");
    textContainer.appendChild(puzzleText);
    const textDisplayDiv = createDiv("puzzle-line-container");
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
    userInputElement.addEventListener("keydown", (event) =>
      this.handleKeyDown(event, user)
    );
    textInputContainer.appendChild(arrows);
    textInputContainer.appendChild(userInputElement);
    puzzleContainer.appendChild(textInputContainer);
    this.gameScreenElements = {
      userInputElement,
      textContainer,
      textDisplayDiv,
      keyBlankGrid,
      keyHolesGrid,
    };
    return puzzleContainer;
  }

  handleKeyDown(event, user) {
    if (event.key === "Enter") {
      const userInput = this.gameScreenElements.userInputElement.value;
      this.gameScreenElements.userInputElement.value = "";
      if (userInput.trim().length === 0) return;
      user.handleInput(userInput);
    } else if (!this.completed && event.target.value === "") {
      switch (event.key.toUpperCase()) {
        case "ARROWUP":
          user.handleInput("U");
          break;
        case "ARROWDOWN":
          user.handleInput("D");
          break;
        case "ARROWLEFT":
          user.handleInput("L");
          break;
        case "ARROWRIGHT":
          user.handleInput("R");
          break;
        case "F":
          event.preventDefault();
          user.handleInput("F");
          break;
      }
    }
  }

  handleInput(actionId) {
    switch (actionId) {
      case "U":
        if (this.fileIndex > 9) {
          this.fileIndex -= 10;
        }
        return;
      case "D":
        if (this.fileIndex < 20) {
          this.fileIndex += 10;
        }
        return;
      case "L":
        if (this.fileIndex % 10 > 0) {
          this.fileIndex -= 1;
        }
        return;
      case "R":
        if (this.fileIndex % 10 < 8) {
          this.fileIndex += 1;
        }
        return;
      case "F":
        this.keyBlankCells[this.fileIndex] = true;
        return;
    }
  }

  checkCompletion(keyBlankCells) {
    return solution.every((fileIndex) => keyBlankCells[fileIndex] === true);
  }

  resetPuzzle() {
    this.keyBlankCells = Array.from({ length: 30 }, (v, i) =>
      keyBlankFiledCells.includes(i)
    );
    this.puzzleLine = [];
    this.fileIndex = 0;
  }

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });
    if (userInput === "RESET") {
      this.resetPuzzle();
      this.renderPuzzle();
      return;
    }

    if (userInput === "LEAVE") {
      this.puzzleLine.push({ class: "puzzle", text: "OK." });
      return "leave";
    }

    if (this.puzzleCommands.includes(userInput)) {
      this.handleInput(userInput[0]);
      this.puzzleLine.push({ class: "Story", text: "OK." });
    } else if (userInput === "UNLOCK" || userInput === "U") {
      if (this.checkCompletion(this.keyBlankCells)) {
        let fileCount = this.keyBlankCells.filter((e) => e === true).length;
        if (fileCount === solution.length) {
          this.puzzleLine.push({
            class: "story",
            text: "The huge east door has swung open.",
          });
          console.log("exactly right");
          this.completed = true;
        } else {
          this.puzzleLine.push({
            class: "story",
            text: "The key fits into all the keyholes but will not turn all the locks.",
          });
          this.puzzleLine.push({
            class: "story",
            text: "Type RESET to continue, or LEAVE to leave.",
          });
        }
      } else {
        this.puzzleLine.push({
          class: "story",
          text: "The key will not fit into all the locks.",
        });
      }
    } else {
      this.puzzleLine.push({
        class: "story",
        text: "Please use the arrow keys (or L, R, U, D) to move, press F to file, check a solution with UNLOCK, or you can RESET or LEAVE.",
      });
    }

    this.renderPuzzle();
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  renderPuzzle() {
    this.gameScreenElements.keyBlankGrid.innerHTML = "";
    this.keyBlankCells.forEach((filedBoolean, index) => {
      const keyCell = document.createElement("p");
      keyCell.style.margin = "0px";
      keyCell.classList.add("key-cell");
      keyCell.style.backgroundColor = filedBoolean ? "black" : "yellow";
      this.gameScreenElements.keyBlankGrid.appendChild(keyCell);
      if (this.fileIndex === index) {
        keyCell.style.margin = "1px";
        keyCell.style.border = "1px dotted white";
      }
    });

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
    this.keyBlankCells = saveData.keyBlankCells;
    this.fileIndex = saveData.fileIndex;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      keyBlankCells: this.keyBlankCells,
      fileIndex: this.fileIndex,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
    };
  }
}
