import { createUserElement, createStoryElement, createDiv } from "../utils";

const fibonacciNumbers = [
  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
];
const correctNumber = 610;
const responseList = {
  1: `You are listening to a recording of the weather forecast. The heat wave is going to continue.`,
  2: `It's a cross line. A man and a woman are having a rather private conversation. They don't seem to be able to hear you.`,
  3: `A lady is talking very fast in Spanish. You don't understand a thing.`,
  5: `It's a recording of motoring information. The fine weather is causing jams.`,
  8: `It's a recording of a bedtime story--something dull about a thirteenth century Italian.`,
  13: `The recorded gardening information tells you it's a good time to plant sunflowers.`,
  21: `It's an answering machine for a Chinese laundry. You don't bother leaving a message.`,
  34: `A recording tells you "What's on in Loughborough." It doesn't last long.`,
  55: `A voice says "Look, I told you not to ring me at work," and hangs up.`,
  89: `It's the financial news. Apparently an improvement in the economy is expected soon.`,
  144: `It's the cricket. England are 132 for six.`,
  233: `The recipe of the day sounds revolting. Anyway, you are not hungry.`,
  377: `It's the skiing information. There isn't a lot of snow about.`,
  610: `The engaged tone tells you the line is in use.`,
  987: `An irate voice says "You really have gone too far this time," and slams the phone down.`,
};

export class TelephonePuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "telephone";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText = `What number do you want to dial? The telephone uses numbers between 000 and 999. You can type LEAVE at any time.`;
    this.completed = false;
    this.sixTenCount = 0;
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

  resetPuzzle() {
    this.sixTenDialed = false;
    this.puzzleLine = [];
  }

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });

    if (userInput === "LEAVE") {
      this.puzzleLine.push({
        class: "puzzle",
        text: "You put the phone down.",
      });
      return "leave";
    }

    if (isNaN(userInput)) {
      this.puzzleLine.push({
        class: "Puzzle",
        text: `I don't understand ${userInput}.`,
      });
    } else {
      let numberDialed = parseInt(userInput);
      this.respondToNumber(numberDialed);
    }

    this.renderPuzzle();
  }

  respondToNumber(numberDialed) {
    if (numberDialed < 0 || numberDialed > 999) {
      this.puzzleLine.push({
        class: "Puzzle",
        text: `The telephone uses numbers between 000 and 999`,
      });
      return;
    }
    if (!fibonacciNumbers.includes(numberDialed)) {
      this.puzzleLine.push({
        class: "Puzzle",
        text: `The number rings but there is no reply.`,
      });
      return;
    }
    if (numberDialed === correctNumber) {
      this.sixTenCount++;
      if (this.sixTenCount >= 2) {
        this.puzzleLine.push({
          class: "Puzzle",
          text: `It's the abbot. He wishes you luck and tells you there is a trap door hidden under the chest. It leads down to some cellars. You will have no difficulty moving the chest if you drop everything you are carrying`,
        });
        this.renderPuzzle();
        this.completed = true;
        return;
      }
    }
    let response = responseList[numberDialed];
    this.puzzleLine.push({
      class: "Puzzle",
      text: response,
    });
  }

  renderPuzzle() {
    const textDisplayDiv = this.gameScreenElements.textDisplayDiv;
    if (textDisplayDiv) {
      textDisplayDiv.innerHTML = "";
    }
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
    this.sixTenCount = saveData.sixTenCount;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
    console.log(this.sixTenCount);
  }

  generateSaveData() {
    return {
      id: this.id,
      sixTenCount: this.sixTenCount,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
    };
  }
}
