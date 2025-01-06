import {
  createUserElement,
  createStoryElement,
  createDiv,
  yesCommands,
  noCommands,
} from "../utils";
import { threeLetterWords } from "./wordList";

export class ApePuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "ape";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.entryQuestion =
      '"I would like to help you, but I am a rather stupid ape.....now if I was a wise animal like an owl, I might be able to help you.....perhaps you could turn me into an owl?"\n\n"I once turned a pig into a sty. Would you like to know how I did it?" asks the ape.';
    this.followUpText =
      '"Well" said the ape "I did it bit by bit like this...\n\n\tPIG\n\tBIG\n\tBAG\n\tSAG\n\tSAY\n\tSTY\n\n...it was very difficult. But you are much cleverer than I am and perhaps you could change me into an owl?"\n\nThe ape climbs a nearby tree and sits on a branch ';
    this.entryQuestionRequred = true;
    this.completed = false;
    this.currentWord = "APE";
  }

  createPuzzleHTML(user) {
    console.log(`starting`);
    const puzzleContainer = createDiv("puzzle-container");
    const textContainer = createDiv("text-container");
    const textDisplayDiv = createDiv("puzzle-line-container");
    if (this.puzzleLine.length === 0) {
      this.puzzleLine.push({ class: "puzzle", text: this.entryQuestion });
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

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });

    if (userInput === "LEAVE") {
      this.puzzleLine.push({ class: "puzzle", text: "\nOK." });
      this.renderPuzzle();
      return "leave";
    }

    if (this.entryQuestionRequred) {
      if (yesCommands.includes(userInput)) {
        this.puzzleLine.push({
          class: "puzzle",
          text: this.followUpText,
        });
        this.entryQuestionRequred = false;
      } else if (noCommands.includes(userInput)) {
        this.puzzleLine.push({ class: "puzzle", text: '"OK," says the ape.' });
        this.renderPuzzle();
        return "leave";
      } else {
        this.puzzleLine.push({
          class: "puzzle",
          text: "Please answer YES or NO.",
        });
      }
      this.renderPuzzle();
      return;
    }

    if (userInput.length != 3) {
      this.puzzleLine.push({ class: "puzzle", text: '"Hmmm?" says the ape.' });
    } else if (!this.wordConnects(userInput, this.currentWord)) {
      this.puzzleLine.push({
        class: "puzzle",
        text: 'The ape calls down, "You can\'t do that! Start again!"',
      });
      this.currentWord = "APE";
    } else if (!threeLetterWords.includes(userInput)) {
      this.puzzleLine.push({
        class: "puzzle",
        text: 'The ape looks confused. "That\'s not a word!"',
      });
    } else {
      if (userInput === "OWL") {
        this.completed = true;
        this.puzzleLine.push({
          class: "puzzle",
          text: "The ape immediately starts to shrink and sprout feathers. In less than a minute he has turned into a magnificent barn owl. He flaps his wings, a little uncertainly at first, and then swoops down. With his talons he snatches the rope ladder, flies off with it towards the palace, and soon disappears out of sight behind some trees.",
        });
        this.renderPuzzle();
        return "apeSuccess";
      } else {
        this.puzzleLine.push({
          class: "puzzle",
          text: '"OK," says the ape.',
        });
        this.currentWord = userInput;
      }
    }
    this.renderPuzzle();
  }

  wordConnects(userInput, currentWord) {
    let changedLetterCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] != currentWord[i]) {
        changedLetterCount++;
      }
    }
    return changedLetterCount <= 1;
  }

  resetPuzzle() {
    this.currentWord = "APE";
    this.entryQuestionRequred = true;
    this.puzzleLine = [];
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
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
    this.currentWord = saveData.currentWord;
    this.completed = saveData.completed;
    this.entryQuestionRequred = saveData.entryQuestionRequred;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      currentWord: this.currentWord,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
      entryQuestionRequred: this.entryQuestionRequred,
    };
  }
}

export const apePuzzleBot = {
  puzzleId: "ape",
  initialText:
    'The bath won\'t carry that much weight. You must take fewer things with you or you will sink.\n\nA large ape lumbers up to you and asks, "Are you trying to get the ladder across the river?"',
  visitedText:
    '\nAn ape is sitting in a nearby tree. "Do you want some help getting the ladder across the river?" he asks.',
  triggerPuzzleCommands: yesCommands,
  declinePuzzleCommands: noCommands,
  turnedDownText: "The ape climbs a nearby tree and sits on a branch.",
};
