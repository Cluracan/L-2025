import { createUserElement, createStoryElement, createDiv } from "../utils";
const puzzleQuestion = [
  `"How many grams of TOLT?"`,
  `"How many grams of FIMA?"`,
  `"How many grams of MUOT?"`,
  `"Will you try again?" asks the cook desperately`,
];

export class CookPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "cook";
    this.gameScreenElements;
    this.puzzleText = `The cook cheers up a bit.\n\n"You see those three jars of white powder labelled TOLT, FIMA and MUOT? Well I have to put in the right amount of each inredient. I'll try another cake now, and you tell me how much of each to use."`;
    this.puzzleLine = [];
    this.completed = false;
    this.puzzleQuestionIndex = 0;
    this.recipe = [0, 0, 0];
  }
  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const instructionsContainer = createDiv("instructions");
    instructionsContainer.textContent = this.puzzleText;
    puzzleContainer.appendChild(instructionsContainer);

    const textContainer = createDiv("text-container");
    const puzzleText = document.createElement("p");
    textContainer.appendChild(puzzleText);
    const textDisplayDiv = createDiv(
      "puzzle-line-container",
      "puzzle-line-container"
    );
    if (this.puzzleLine.length === 0) {
      this.puzzleLine.push({
        class: "puzzle",
        text: puzzleQuestion[this.puzzleQuestionIndex],
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
    this.puzzleQuestionIndex = 0;
    this.puzzleLine = [];
    this.recipe = [0, 0, 0];
  }

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });
    const response = this.parseInput(userInput);
    if (this.puzzleQuestionIndex === 3) {
      switch (response.value) {
        case "YES":
          this.incrementPuzzleQuestionIndex();
          this.puzzleLine.push({
            class: "puzzle",
            text: puzzleQuestion[this.puzzleQuestionIndex],
          });
          break;
        case "NO":
          this.puzzleLine.push({
            class: "puzzle",
            text: `the cook's sobs become more intense.`,
          });
          this.renderPuzzle();
          return "leave";
        default:
          this.puzzleLine.push({
            class: "puzzle",
            text: `Please answer YES or NO`,
          });
          break;
      }
    } else {
      if (!isNaN(response.value)) {
        const ingredientQuantity = response.value;
        if (ingredientQuantity > 100) {
          this.puzzleLine.push({
            class: "puzzle",
            text: `"You can't use that much!", says the cook. "What a waste! Try again."\n\n`,
          });
          this.puzzleLine.push({
            class: "puzzle",
            text: puzzleQuestion[this.puzzleQuestionIndex],
          });
          this.renderPuzzle();
          return;
        } else {
          this.recipe[this.puzzleQuestionIndex] = ingredientQuantity;
          this.incrementPuzzleQuestionIndex();
          if (this.puzzleQuestionIndex === 3) {
            const cakeHeight = this.bakeCake(this.recipe);
            if (cakeHeight < 9.1) {
              this.puzzleLine.push({
                class: "puzzle",
                text: `The cook puts the mixture into the oven, leaves it there for a few minutes and then takes it out. The cake is only 9 cm high and doesn't seem to have risen at all.\n\n"Will you try again?" asks the cook desperately.`,
              });
            } else if (cakeHeight < 25) {
              this.puzzleLine.push({
                class: "puzzle",
                text: `The cook puts the mixture into the oven and after a few minutes takes out the cake. It has risen to a height of ${cakeHeight.toFixed(
                  2
                )} cm.\n\n"Will you try again?" asks the cook desperately.`,
              });
            } else {
              this.puzzleLine.push({
                class: "puzzle",
                text: `The cook puts the mixture into the oven and after a few minutes takes out the cake. It has risen to a height of ${cakeHeight.toFixed(
                  2
                )} cm.\n\nThe cook tastes the cake and says, "It's rather salty, but it's just the right size."`,
              });
              this.puzzleLine.push({
                class: "puzzle",
                text: '\nThe cook fumbles in a drawer and hands something to you.\n\n"I found this yesterday. It\'s of no use to me."\n\nYou are holding an icosahedron made of highly polished jade.',
              });
              this.renderPuzzle();
              this.completed = true;
              return "success";
            }
          } else {
            this.puzzleLine.push({
              class: "puzzle",
              text: puzzleQuestion[this.puzzleQuestionIndex],
            });
          }
        }
      } else {
        this.puzzleLine.push({
          class: "puzzle",
          text: `"What?" says the cook, ${
            puzzleQuestion[this.puzzleQuestionIndex]
          }`,
        });
      }
    }
    this.renderPuzzle();
    sessionStorage.setItem(
      "puzzleData",
      btoa(JSON.stringify(this.generateSaveData()))
    );
  }

  parseInput(userInput) {
    if (userInput === "Y" || userInput === "YES") return { value: "YES" };
    if (userInput === "N" || userInput === "NO") return { value: "NO" };
    if (!isNaN(userInput) && parseInt(userInput) >= 0)
      return { value: parseInt(userInput) };
    else return { value: undefined };
  }

  incrementPuzzleQuestionIndex() {
    this.puzzleQuestionIndex = (this.puzzleQuestionIndex + 1) % 4;
  }

  bakeCake() {
    const [TOLT, FIMA, MUOT] = this.recipe;
    const cakeHeight = 26 - 0.5 * (TOLT - 6) ** 2 - 0.45 * (FIMA - 14) ** 2;
    return cakeHeight;
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
    this.puzzleQuestionIndex = saveData.puzzleQuestionIndex;
    this.recipe = saveData.recipe;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      puzzleQuestionIndex: this.puzzleQuestionIndex,
      recipe: this.recipe,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
    };
  }
}
