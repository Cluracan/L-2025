import {
  createUserElement,
  createStoryElement,
  createDiv,
  yesCommands,
  noCommands,
} from "../utils";

export class AbbotPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "abbot";
    this.gameScreenElements;
    this.puzzleLine = [
      {
        class: "story",
        text: `The abbot tells you he is looking for a girl called Runia, who has been captured by the Grey Drogos who inhabit the palace.  The Drogos have taken Runia because they fear she is dangerous to them. Partly they fear her long red hair, but mostly they are afraid because she has discovered the Drogo's one weakness and, if she is allowed to reveal this, someone may challenge the Drogos' power.\n\n"Shall I go on?" asks the abbot.`,
      },
    ];
    this.remainingText = [
      {
        class: "story",
        text: `The abbot says he would like to find Runia but he is an old man and needs your help. She is somewhere in the palace. He warns you that there are many dangers, such as the Drogo Robot Guards, who are impossible to defeat unless you can find the personal secret number which each guard cannot bear to hear. You will come up against many weird and puzzling situations before you can find Runia.\n\nThe abbot asks you again if you will help.`,
      },
      {
        class: "story",
        text: `A strange sound behind you attracts your attention. When you turn back the abbot has vanished.`,
      },
    ];
    this.completed = false;
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const textContainer = createDiv("puzzle-line-container");
    this.puzzleLine.forEach((entry, i) => {
      const element =
        entry.class === "userInput"
          ? createUserElement(entry.text, i)
          : createStoryElement(entry.text, i);
      textContainer.appendChild(element);
    });
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
    this.gameScreenElements = { userInputElement, textContainer };
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

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });
    if (yesCommands.includes(userInput)) {
      this.puzzleLine.push(this.remainingText.shift());
      if (this.remainingText.length === 0) {
        this.completed = true;
        this.renderPuzzle();
        return "abbotSuccess";
      }
    } else if (noCommands.includes(userInput)) {
      this.puzzleLine.push(this.remainingText.pop());
      this.renderPuzzle();
      this.completed = true;
      return "abbotSuccess";
    } else {
      this.puzzleLine.push({ class: "story", text: "Please answer YES or NO" });
    }
    this.renderPuzzle();
  }

  renderPuzzle() {
    const textDisplayDiv = this.gameScreenElements.textContainer;
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

  resetPuzzle() {
    this.puzzleLine = [];
    return;
  }

  tidyRooms(roomList) {
    roomList[1].text =
      "You are in a dark hall way. At the south end is an outside door. There is another door at the north end.";
    roomList[2].text =
      "You are in a room which once was a kitchen. It has quarry tiles on the floor and there is a cracked sink in one corner. Thre are doors to the north, south, east and west.";
    return roomList;
  }

  loadFromSaveData(saveData) {
    this.id = saveData.id;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
    this.remainingText = saveData.remainingText;
  }

  generateSaveData() {
    return {
      id: this.id,
      puzzleLine: this.puzzleLine,
      remainingText: this.remainingText,
      completed: this.completed,
    };
  }
}
