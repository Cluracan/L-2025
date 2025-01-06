import { createUserElement, createStoryElement, createDiv } from "../utils";

const starting = ["Yellow", "Red", "Green", "Blue"];
const target = ["Blue", "Green", "Red", "Yellow"];

export class LightPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "lights";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText = `"Right. You see the lights as they are but they should be like this -- \n\n\tBLUE\tGREEN\tRED\tYELLOW \n\n -- That's in alphabetical order. We have to use swtiches 1,2,3 and 4 to do this.\n\n You can tell me which switch to press, or type RESET ot LEAVE"`;
    this.completed = false;
    this.solved = false;
    this.optimised = false;
    this.canvasElements = [];
    this.colours = ["Yellow", "Red", "Green", "Blue"];
    this.count = 0;
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const canvasDiv = createDiv("lights-canvas-container");
    const width = 650;
    const canvasElements = this.colours.map((colour) => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", colour);
      canvas.setAttribute("width", width / 4);
      canvas.setAttribute("height", width / 4);
      return canvas;
    });
    canvasElements.forEach((element) => canvasDiv.appendChild(element));
    this.canvasElements = canvasElements;
    puzzleContainer.appendChild(canvasDiv);

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
    userInputElement.addEventListener("keypress", (event) =>
      this.handleKeyDown(event, user)
    );
    textInputContainer.appendChild(arrows);
    textInputContainer.appendChild(userInputElement);
    puzzleContainer.appendChild(textInputContainer);
    this.gameScreenElements = {
      userInputElement,
      canvasDiv,
      textContainer,
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

  handleSwitch(switchId) {
    const currentColours = this.colours;
    switch (switchId) {
      case "1":
        return [
          currentColours[1],
          currentColours[0],
          currentColours[2],
          currentColours[3],
        ];
      case "2":
        return [
          currentColours[0],
          currentColours[2],
          currentColours[3],
          currentColours[1],
        ];
      case "3":
        return currentColours;
      case "4":
        return [
          currentColours[0],
          currentColours[1],
          currentColours[3],
          currentColours[2],
        ];
      default:
        return currentColours;
    }
  }

  checkCompletion(order) {
    return order.every((colour, i) => colour === target[i]);
  }

  resetPuzzle() {
    this.colours = starting;
    this.count = 0;
    this.puzzleLine = [];
  }

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });
    if (userInput === "RESET") {
      this.puzzleLine.push({
        class: "Story",
        text: `"OK, let's start again." says the electrician.`,
      });
      this.resetPuzzle();
      this.renderPuzzle();
      return;
    }

    if (userInput === "LEAVE") {
      this.puzzleLine.push({
        class: "Story",
        text: "OK.",
      });
      return "leave";
    }

    if (!isNaN(userInput.trim())) {
      if (parseInt(userInput) > 4) {
        this.puzzleLine.push({
          class: "Story",
          text: "There are only four switches",
        });
      } else {
        this.count += 1;
        this.puzzleLine.push({
          class: "Story",
          text: `That's ${this.count} move${this.count > 1 ? "s" : ""}`,
        });
      }

      this.colours = this.handleSwitch(userInput);
    } else {
      this.puzzleLine.push({
        class: "Story",
        text: `I don't understand ${userInput}`,
      });
    }
    this.solved = this.checkCompletion(this.colours);
    this.optimised = this.count === 4;
    if (this.solved) {
      if (this.optimised) {
        this.completed = true;
        this.puzzleLine.push({
          class: "Story",
          text: '\nThe electrician thanks you for your help. He wishes you luck and warns you to be careful.\n\n"These Drogos aren\'t to be trusted."\n\nYour attention is caught by a roughly-carved wooden oar which is propped up in one corner of the room. The electrician notices your interest and says, "You can have that if you want it."',
        });
      } else {
        this.puzzleLine.push({
          class: "Story",
          text: `\n\n"You've done it," says the electrician, "but my apprentice, who is on holiday, reckons she can do it in four moves!\n\nWill you try again? (Type RESET OR LEAVE)"`,
        });
      }
    }
    this.renderPuzzle();
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  renderPuzzle() {
    console.log(this.canvasElements);
    this.canvasElements = this.colours.map((id) =>
      this.canvasElements.find((element) => element.id === id)
    );
    if (this.canvasElements.length === 0) {
      console.error("Failed to render puzzle");
      return;
    }
    this.gameScreenElements.canvasDiv.innerHTML = "";
    this.canvasElements.forEach((canvas) =>
      this.gameScreenElements.canvasDiv.appendChild(canvas)
    );

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

    setTimeout(() => {
      this.canvasElements.forEach((canvas) => {
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        ctx.beginPath();
        ctx.fillStyle = canvas.id;
        ctx.arc(width / 2, height / 2, width / 2 - 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = "72px myFont";
        const text = canvas.id[0];
        const textWidth = ctx.measureText(text).width + 8;
        ctx.fillText(
          text,
          width / 2 - textWidth / 2,
          height / 2 + textWidth / 2
        );
      });
    }, 1);
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  loadFromSaveData(saveData) {
    this.id = saveData.id;
    this.colours = saveData.colours;
    this.count = saveData.count;
    this.completed = saveData.completed;
    this.solved = saveData.solved;
    this.optimised = saveData.optimised;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      colours: this.colours,
      puzzleLine: this.puzzleLine,
      count: this.count,
      completed: this.completed,
      solved: this.solved,
      optimised: this.optimised,
    };
  }
}
