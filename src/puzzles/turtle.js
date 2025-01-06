import { createUserElement, createStoryElement, createDiv } from "../utils";
const startingLocation = [4, 6];
const puzzleCommands = {
  N: [1, 0],
  NORTH: [1, 0],
  E: [0, 1],
  EAST: [0, 1],
  S: [-1, 0],
  SOUTH: [-1, 0],
  W: [0, -1],
  WEST: [0, -1],
};
const convertDirection = { N: "north", E: "east", S: "south", W: "west" };

export class TurtlePuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "turtle";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText = `As you move towards the turtle, he waves a flipper to attract your attention. "Don't approach me directly," he warns. "I'd like to help you", he says, lowering his voice. "We can meet somewhere provided that it is I who catch up with you. Also," he says, lowering his voice even further, "the Drogos have programmed me to move in a special way. Try moving about a little."`;
    this.turtleLocation = startingLocation;
    this.completed = false;
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const textContainer = createDiv("text-container");
    const instructions = document.createElement("p");
    instructions.textContent = this.puzzleText;
    const textDisplayDiv = createDiv("puzzle-line-container");
    if (this.puzzleLine.length === 0) {
      this.puzzleLine.push(this.positionCheck(this.turtleLocation));
    }
    this.puzzleLine.forEach((entry, i) => {
      const element =
        entry.class === "userInput"
          ? createUserElement(entry.text, i)
          : createStoryElement(entry.text, i);
      textDisplayDiv.appendChild(element);
    });
    textContainer.appendChild(instructions);
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
    this.gameScreenElements = { userInputElement, textDisplayDiv };
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
    console.log("reset fired");
    this.turtleLocation = startingLocation;
    this.puzzleLine = [];
  }

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });

    if (userInput === "LEAVE") {
      this.puzzleLine.push({ class: "puzzle", text: "OK." });
      return "leave";
    }

    if (Object.keys(puzzleCommands).includes(userInput)) {
      const [curRow, curCol] = this.turtleLocation;
      const [rowInc, colInc] = puzzleCommands[userInput];
      const [newRow, newCol] = [curRow + rowInc, curCol + colInc];
      this.turtleLocation = [newRow, newCol];

      if (newRow === 0 && newCol === 0) {
        this.puzzleLine.push({
          class: "puzzle",
          text: "The turtle sidles up to meet you. He gives you a small rusty key which he was concealing in his shell. Then he scurries back to the centre of the courtyard and shuts his eyes.",
        });
        this.completed = true;
        this.renderPuzzle();
        return;
      }
      const moveDirection = convertDirection[userInput[0]];
      this.puzzleLine.push({
        class: "puzzle",
        text: `As you move one square to the ${moveDirection}, the turtle moves two squares to the ${moveDirection}`,
      });
    } else if (userInput === "LOOK" || userInput === "L") {
      this.puzzleLine.push(this.positionCheck(this.turtleLocation));
    } else {
      this.puzzleLine.push({ class: "puzzle", text: `I don't understand.` });
    }
    this.renderPuzzle();
  }

  positionCheck([curRow, curCol]) {
    const rowDistance = Math.abs(curRow);
    const colDistance = Math.abs(curCol);
    const rowDirection = curRow >= 0 ? "north" : "south";
    const colDirection = curCol >= 0 ? "east" : "west";

    let text = `The turtle is sitting on a slab which is`;
    if (rowDistance > 0) {
      text += ` ${rowDistance} ${
        rowDistance > 1 ? "squares" : "square"
      } to the ${rowDirection}`;
    }
    if (colDistance > 0) {
      text += `${rowDistance > 0 ? " and" : ""} ${colDistance} ${
        colDistance > 1 ? "squares" : "square"
      } to the ${colDirection}`;
    }
    text += " of you.";
    return { class: "puzzle", text };
  }

  renderPuzzle() {
    const textDisplayDiv = this.gameScreenElements.textDisplayDiv;
    textDisplayDiv.innerHTML = "";
    this.puzzleLine.forEach((entry, i) => {
      const element =
        entry.class === "userInput"
          ? createUserElement(entry.text, i)
          : createStoryElement(entry.text, i);

      textDisplayDiv.appendChild(element);
    });
    textDisplayDiv.scrollTop = textDisplayDiv.scrollHeight;
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  loadFromSaveData(saveData) {
    this.id = saveData.id;
    this.turtleLocation = saveData.turtleLocation;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      turtleLocation: this.turtleLocation,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
    };
  }
}
