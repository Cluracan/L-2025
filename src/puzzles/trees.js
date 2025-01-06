import { createUserElement, createStoryElement, createDiv } from "../utils";
import treeImage from "../images/tree.svg";

const orchardColumns = 5;
const checkRows = [
  [2, 6, 10],
  [3, 7, 11, 15],
  [4, 8, 12, 16, 20],
  [9, 13, 17, 22],
  [14, 16, 22],
  [2, 8, 14],
  [1, 7, 13, 19],
  [0, 6, 12, 18, 24],
  [5, 11, 17, 23],
  [10, 16, 22],
  [0, 7, 14],
  [5, 12, 19],
  [10, 17, 24],
  [4, 7, 10],
  [9, 12, 15],
  [14, 17, 20],
  [0, 11, 22],
  [1, 12, 23],
  [2, 13, 24],
  [2, 11, 20],
  [3, 12, 21],
  [4, 13, 22],
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
];

export class TreePuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "tree";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText = `"Right," says the gardener. "Use the arrow keys to move me about, and 'T' when you want me to plant a tree or remove one. Or just use the letters U, D, L, R, and T."\n\n"Type CHECK if you think you have finished, RESET if you want me to start from scratch, or LEAVE if you want a break.`;
    this.completed = false;
    this.gardenerIndex = 12;
    this.orchardCells = Array.from({ length: 25 }, (v, i) => false);
    this.introText = [
      "PLAN OF ORCHARD",
      "Plant nine trees in ten rows of three.",
    ];
    this.puzzleCommands = [
      "U",
      "UP",
      "D",
      "DOWN",
      "L",
      "LEFT",
      "R",
      "RIGHT",
      "T",
      "TREE",
    ];
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const orchardContainer = createDiv("orchard-container");
    this.introText.forEach((textEntry) => {
      const orchardText = document.createElement("p");
      orchardText.textContent = textEntry;
      orchardContainer.appendChild(orchardText);
    });

    const orchardGrid = createDiv("orchard-grid");
    orchardGrid.style.gridTemplateColumns = `repeat(${orchardColumns},1fr)`;
    orchardContainer.appendChild(orchardGrid);
    puzzleContainer.appendChild(orchardContainer);

    const textContainer = createDiv("text-container");

    const puzzleText = document.createElement("p");
    puzzleText.textContent = this.puzzleText;
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
      orchardGrid,
      textContainer,
      textDisplayDiv,
    };
    return puzzleContainer;
  }

  handleKeyDown(event, user) {
    if (event.key === "Enter") {
      const userInput = this.gameScreenElements.userInputElement.value;
      if (userInput.trim().length === 0) return;
      this.gameScreenElements.userInputElement.value = "";
      user.handleInput(userInput);
    } else if (!this.completed && event.target.value === "") {
      console.log(event.target.value);
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
        case "T":
          event.preventDefault();
          user.handleInput("TREE");
          break;
      }
    }
  }

  resetPuzzle() {
    this.orchardCells.forEach((cell) => (cell = false));
    this.gardenerIndex = 12;
    this.puzzleLine = [];
  }

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });
    if (userInput === "LEAVE") {
      this.puzzleLine.push({ class: "puzzle", text: "OK." });
      this.resetPuzzle();
      return "leave";
    }
    if (userInput === "RESET") {
      this.puzzleLine.push({
        class: "Story",
        text: "The gardener sighs, and removes all trees from the orchard.",
      });
      this.orchardCells = this.orchardCells.map((cell) => false);
      this.gardenerIndex = 12;
    } else if (this.puzzleCommands.includes(userInput)) {
      this.handleAction(userInput[0]);
      this.puzzleLine.push({ class: "Story", text: "OK." });
    } else if (userInput === "CHECK" || userInput === "C") {
      const lineCount = this.countLines();
      const treeCount = this.countTrees();
      if (lineCount === 0) {
        this.puzzleLine.push({
          class: "story",
          text: `The gardener looks puzzled. "I can't see any lines of trees yet!"`,
        });
      } else if (lineCount < 10) {
        if (treeCount < 9) {
          this.puzzleLine.push({
            class: "story",
            text: `The gardener looks at you. "I can only see ${lineCount} ${
              lineCount === 1 ? "line" : "lines"
            } of trees, but then you've only used ${treeCount} ${
              treeCount === 1 ? "tree" : "trees"
            } so far...`,
          });
        } else {
          this.puzzleLine.push({
            class: "story",
            text: `"Hmm." says the gardener. "You've used all the trees, but I can only see ${lineCount} ${
              lineCount === 1 ? "line" : "lines"
            } so far...maybe you could rearrange them?"`,
          });
        }
      } else {
        this.puzzleLine.push({
          class: "story",
          text: `Thank goodness," sighs the gardener, "I was beginning to think it was impossible. Now I have something to give you."\n\nHe hands you a rope ladder which is rolled up into a neat bundle. Then he walks away.`,
        });
        this.completed = true;
      }
    } else {
      this.puzzleLine.push({
        class: "puzzle",
        text: '"I don\'t understand", says the gardener.',
      });
    }
    this.renderPuzzle();
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  handleAction(action) {
    switch (action) {
      case "T":
        if (!this.orchardCells[this.gardenerIndex] && this.countTrees() < 9) {
          this.orchardCells[this.gardenerIndex] = true;
        } else if (this.orchardCells[this.gardenerIndex]) {
          this.orchardCells[this.gardenerIndex] = false;
        }
        break;
      case "U":
        if (this.gardenerIndex > 4) {
          this.gardenerIndex -= 5;
        }
        break;
      case "D":
        if (this.gardenerIndex < 20) {
          this.gardenerIndex += 5;
        }
        break;
      case "R":
        if (this.gardenerIndex % 5 < 4) {
          this.gardenerIndex++;
        }
        break;
      case "L":
        if (this.gardenerIndex % 5 > 0) {
          this.gardenerIndex--;
        }
        break;
      default:
        console.error("no given option in tree puzzle handleAction");
    }
  }

  countTrees() {
    return this.orchardCells.reduce((acc, cur) => acc + (cur ? 1 : 0), 0);
  }

  countLines() {
    let numberOfLines = 0;
    checkRows.forEach((checkList) => {
      let treeCount = 0;
      checkList.forEach((searchIndex) => {
        if (this.orchardCells[searchIndex]) {
          treeCount++;
        }
      });
      if (treeCount >= 3) {
        numberOfLines++;
      }
    });
    return numberOfLines;
  }

  renderPuzzle() {
    this.gameScreenElements.orchardGrid.innerHTML = "";
    this.orchardCells.forEach((planted, index) => {
      const treeCell = createDiv("tree-cell");
      if (planted) {
        const tree = document.createElement("img");
        tree.classList.add("tree-image");
        tree.src = treeImage;
        treeCell.appendChild(tree);
      }
      if (index === this.gardenerIndex) {
        treeCell.style.border = "2px dotted rgb(32,120,9)";
      }
      this.gameScreenElements.orchardGrid.appendChild(treeCell);
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
    this.gardenerIndex = saveData.gardenerIndex;
    this.orchardCells = saveData.orchardCells;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      gardenerIndex: this.gardenerIndex,
      orchardCells: this.orchardCells,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
    };
  }
}
