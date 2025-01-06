import { createUserElement, createStoryElement, createDiv } from "../utils";

const edgeMap = {
  0: { L: 18, R: 2 },
  1: { L: 7, R: 16 },
  2: { L: 20, R: 4 },
  3: { L: 1, R: 18 },
  4: { L: 22, R: 6 },
  5: { L: 3, R: 20 },
  6: { L: 16, R: 0 },
  7: { L: 5, R: 22 },
  8: { L: 10, R: 19 },
  9: { L: 17, R: 15 },
  10: { L: 12, R: 21 },
  11: { L: 19, R: 9 },
  12: { L: 14, R: 23 },
  13: { L: 21, R: 11 },
  14: { L: 8, R: 17 },
  15: { L: 23, R: 13 },
  16: { L: 15, R: 8 },
  17: { L: 0, R: 7 },
  18: { L: 9, R: 10 },
  19: { L: 2, R: 1 },
  20: { L: 11, R: 12 },
  21: { L: 4, R: 3 },
  22: { L: 13, R: 14 },
  23: { L: 6, R: 5 },
};

const leftRightDictionary = {
  L: "L",
  LEFT: "L",
  R: "R",
  RIGHT: "R",
};

export class SpiderPuzzle {
  constructor() {
    (this.class = "puzzle"), (this.id = "spider"), this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText =
      '"If I spin a special web that encloses the room, the Drogos\'s magic will be defeated. You can see that this room has four edges where the walls join, four edges where the walls meet the floor, and four edges where the walls meet the ceiling. I must spin a silk thread that passes along each of these twelve edges twice - once in each direction. The thread must not be broken, and, as I only have a limited supply, I must not go along any edge more than twice."\n\n"The trouble is I am a rather old, short-sighted spider and you\'ll have to help me. Now, if you could tell me whether to turn LEFT or RIGHT when I reach the end of each edge, I might just manage it."';
    this.startText = "Say START when you want me to begin.";
    this.completed = false;
    this.startRequired = true;
    this.edgeCount = 0;
    this.currentEdge = 0;
    this.edgesTraversed = new Set();
  }
  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const instructionsContainer = createDiv("instructions");
    instructionsContainer.textContent = this.puzzleText;
    puzzleContainer.appendChild(instructionsContainer);

    const textContainer = createDiv("text-container");
    const puzzleText = document.createElement("p");
    textContainer.appendChild(puzzleText);
    const textDisplayDiv = createDiv("puzzle-line-container");
    if (this.puzzleLine.length === 0) {
      this.puzzleLine.push({
        class: "puzzle",
        text: this.startText,
      });
    }
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

  resetPuzzle() {
    this.completed = false;
    this.puzzleLine = [];
    this.startRequired = true;
    this.edgeCount = 0;
    this.currentEdge = 0;
    this.edgesTraversed.clear();
  }

  async respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });

    if (userInput === "LEAVE") {
      this.puzzleLine.push({ class: "puzzle", text: "\nOK." });
      this.renderPuzzle();
      return "leave";
    }

    if (this.startRequired) {
      if (userInput === "START") {
        this.restartPuzzle();
        this.startSpider();
      } else {
        this.puzzleLine.push({
          class: "puzzle",
          text: '"Hmm?" says the spider. Just say START when you are ready.',
        });
      }
    } else {
      if (this.validCommand(userInput)) {
        const directionChosen = leftRightDictionary[userInput];
        const nextEdge = this.getNextEdge(this.currentEdge, directionChosen);

        if (this.edgesTraversed.has(nextEdge)) {
          this.printFailMessage();
          this.renderPuzzle();
          setTimeout(() => {
            this.printStartMessage();
            this.renderPuzzle();
          }, 1000);
          this.startRequired = true;
        } else {
          this.edgesTraversed.add(nextEdge);
          this.edgeCount++;
          if (this.edgeCount < 24) {
            this.printValidMoveText();
            this.currentEdge = nextEdge;
          } else {
            this.printSuccessText();
            this.completed = true;
          }
        }
      } else {
        this.puzzleLine.push({
          class: "puzzle",
          text: '"Hmm?" says the spider. I need to know whether to turn LEFT or RIGHT.',
        });
      }
    }
    this.renderPuzzle();
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  validCommand(userInput) {
    return Object.keys(leftRightDictionary).includes(userInput);
  }

  startSpider() {
    this.puzzleLine = [];
    this.puzzleLine.push({
      class: "puzzle",
      text: '"OK" says the spider. "I have reached the end of the first edge. Tell me whether to go left or right."',
    });
    this.edgesTraversed.add(0);
    this.edgeCount++;
    this.startRequired = false;
  }

  getNextEdge(currentEdge, direction) {
    const nextEdge = edgeMap[currentEdge][direction];
    return nextEdge;
  }

  printStartMessage() {
    this.puzzleLine.push({
      class: "puzzle",
      text: this.startText,
    });
  }

  printFailMessage() {
    this.puzzleLine.push({
      class: "puzzle",
      text: '"I can\'t do that. I have already been along that edge from this direction. The only thing to do is to wind up all this thread and start again. What a mess!" says the spider wearily.\n\n',
    });
  }

  printValidMoveText() {
    this.puzzleLine.push({
      class: "puzzle",
      text: `"OK. That makes ${this.edgeCount} ${
        this.edgeCount > 1 ? "edges" : "edge"
      } so far."`,
    });
  }

  printSuccessText() {
    this.puzzleLine.push({
      class: "puzzle",
      text: '"At last," says the exhausted spider. It creeps away into a hole in the plaster for a sleep.\n\nThe room starts to shake, first gently, then more violently. Suddenly, in the middle of the room appears a small gold ring.',
    });
  }

  restartPuzzle() {
    this.completed = false;
    this.puzzleLine = [];
    this.startRequired = true;
    this.edgeCount = 0;
    this.currentEdge = 0;
    this.edgesTraversed.clear();
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
    this.startRequired = saveData.startRequired;
    this.edgeCount = saveData.edgeCount;
    this.currentEdge = saveData.currentEdge;
    this.edgesTraversed = new Set(saveData.edgesTraversed);
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
      startRequired: this.startRequired,
      edgeCount: this.edgeCount,
      currentEdge: this.currentEdge,
      edgesTraversed: [...this.edgesTraversed], //JSON won't stringify a set, but you can convert to (and restore from) an array
    };
  }
}
