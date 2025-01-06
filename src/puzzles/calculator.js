import { createUserElement, createStoryElement, createDiv } from "../utils";

const buttons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "AC",
  "0",
  "=",
  "+",
];

const workingButtons = {
  4: "digit",
  7: "digit",
  AC: "reset",
  "-": "operator",
  "*": "operator",
  "=": "evaluate",
  Enter: "evaluate",
  Backspace: "reset",
};

const htmlCodes = {
  "*": "&#215",
  "/": "&#247",
};

export class CalculatorPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "robot";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText = `The calculator is very old and many of its keys are broken. The only keys which seem to work are 4, 7, -, *, AC, and =`;
    this.completed = false;
    this.currentExpression = [];
    this.lastTypeEntered = "evaluate";
    this.currentValue = "";
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const calculatorContainer = createDiv("calculator-container");
    const calculatorInnerContainer = createDiv("calculator-inner-container");
    const calculatorDisplay = createDiv("calculator-display");
    calculatorDisplay.textContent = "TEST";
    calculatorInnerContainer.appendChild(calculatorDisplay);
    const calculatorText = createDiv("calculator-text");
    calculatorText.textContent = "CASIO MICRO-MINI";
    calculatorInnerContainer.appendChild(calculatorText);
    const calculatorButtonsWrapper = createDiv("calculator-buttons-wrapper");
    buttons.forEach((buttonValue) => {
      const buttonDiv = document.createElement("button");
      buttonDiv.setAttribute("class", "calculator-button");
      buttonDiv.innerHTML = Object.keys(htmlCodes).includes(buttonValue)
        ? htmlCodes[buttonValue]
        : buttonValue;
      if (Object.keys(workingButtons).includes(buttonValue)) {
        buttonDiv.dataset.value = buttonValue;
        buttonDiv.addEventListener("click", (e) => {
          console.log(e);
          this.handleKeyDown(e.target.dataset.value, user);
        });
      }
      calculatorButtonsWrapper.appendChild(buttonDiv);
    });
    calculatorInnerContainer.appendChild(calculatorButtonsWrapper);
    calculatorContainer.appendChild(calculatorInnerContainer);
    puzzleContainer.appendChild(calculatorContainer);
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
    userInputElement.addEventListener("keydown", (event) => {
      if (!this.completed) {
        event.preventDefault();
      }
      this.handleKeyDown(event.key, user);
    });
    textInputContainer.appendChild(arrows);
    textInputContainer.appendChild(userInputElement);
    puzzleContainer.appendChild(textInputContainer);
    this.gameScreenElements = {
      userInputElement,
      calculatorDisplay,
      textDisplayDiv,
    };
    return puzzleContainer;
  }

  handleKeyDown(key, user) {
    console.log(key);
    if (!this.completed && Object.keys(workingButtons).includes(key)) {
      if (key === "Enter" || key === "=") {
        user.handleInput("=");
      } else if (key === "Backspace") {
        this.respondToKeyPress("AC");
      } else {
        this.respondToKeyPress(key);
      }
    } else if (key === "Enter") {
      const userInput = this.gameScreenElements.userInputElement.value;
      if (userInput.trim().length === 0) return;
      this.gameScreenElements.userInputElement.value = "";
      user.handleInput(userInput);
    }
    if (this.completed) {
      return "calculatorSuccess";
    }
  }

  respondToKeyPress(keyValue) {
    const keyType = workingButtons[keyValue];

    if (this.isValidInput(keyType)) {
      switch (keyType) {
        case "digit":
          if (this.lastTypeEntered === "evaluate") {
            this.currentValue = "";
          }
          this.updateCurrentValue(keyValue);
          break;
        case "operator":
          this.updateCurrentExpression(this.currentValue, "digit");
          this.currentValue = "";
          this.updateCurrentExpression(keyValue, "operator");
          break;
        case "evaluate":
          this.updateCurrentExpression(this.currentValue, "digit");
          const expressionRPN = this.shuntingYard(this.currentExpression);
          this.currentValue = this.evaluate(expressionRPN);
          this.puzzleLine.push({ class: "userInput", text: this.currentValue });
          if (this.currentValue === "11") {
            this.puzzleLine.push({
              class: "puzzle",
              text: "The guard gives a shriek of terror, smashes the calculator into tiny fragments, and rushes out through the door.",
            });
            this.completed = true;
            this.currentValue = "";
          } else {
            this.puzzleLine.push({
              class: "puzzle",
              text: "The guard takes no notice",
            });
          }
          this.currentExpression = [];
          break;
        case "reset":
          this.currentExpression = [];
          this.currentValue = "";
          break;
      }

      this.lastTypeEntered = keyType;
      this.renderPuzzle();
    }
  }

  isValidInput(type) {
    switch (type) {
      case "digit":
        return true;
      case "operator":
        if (
          this.lastTypeEntered === "digit" ||
          this.lastTypeEntered === "evaluate"
        ) {
          return true;
        } else {
          return false;
        }
      case "evaluate":
        return this.lastTypeEntered === "digit" ? true : false;
      case "reset":
        return true;
      default:
        console.error(`error in isValidType ${type} entered`);
    }
  }

  updateCurrentValue(valueString) {
    this.currentValue += valueString;
  }

  updateCurrentExpression(value, type) {
    this.currentExpression.push({ value, type });
  }

  shuntingYard(inputExpression) {
    const outputQueue = [];
    const operatorStack = [];

    while (inputExpression.length > 0) {
      const curToken = inputExpression.shift();

      switch (curToken.type) {
        case "digit":
          outputQueue.push(curToken);
          break;
        case "operator":
          while (
            operatorStack.length > 0 &&
            this.precedence(this.topItem(operatorStack).value) >=
              this.precedence(curToken.value)
          ) {
            this.transferOperator(operatorStack, outputQueue);
          }
          operatorStack.push(curToken);
          break;
        default:
          console.error(`error in shuntingYard ${inputExpression}`);
      }
    }

    while (operatorStack.length > 0) {
      this.transferOperator(operatorStack, outputQueue);
    }

    return outputQueue;
  }

  precedence(operator) {
    //values taken from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
    switch (operator) {
      case "-":
        return 11;
      case "*":
        return 12;
    }
  }

  topItem(targetArray) {
    return targetArray[targetArray.length - 1];
  }

  transferOperator(originArray, targetArray) {
    const itemToMove = originArray.pop();
    targetArray.push(itemToMove);
  }

  evaluate(tokens) {
    const stack = [];
    while (tokens.length > 0) {
      const token = tokens.shift();
      if (token.type === "digit") {
        stack.push(parseFloat(token.value));
      } else {
        const rhs = stack.pop();
        const lhs = stack.pop();
        switch (token.value) {
          case "-":
            stack.push(lhs - rhs);
            break;
          case "*":
            stack.push(lhs * rhs);
            break;
          default:
            console.error(`Error in evaluate ${token}`);
        }
      }
    }
    return stack.pop().toString();
  }

  resetPuzzle() {
    this.puzzleLine = [];
    this.currentExpression = [];
    this.currentValue = "";
    this.lastTypeEntered = "evaluate";
  }

  getDisplayContent() {
    if (this.currentValue === "" && this.currentExpression.length === 0) {
      return { fullText: "", restrictedText: "0" };
    }
    let fullText = "";
    this.currentExpression.forEach((element) => {
      fullText += element.value;
    });
    fullText += this.currentValue;
    const restrictedText = fullText.slice(-12);
    return { fullText, restrictedText };
  }

  respondToUserInput(userInput) {
    this.respondToKeyPress(userInput);
    if (this.completed) {
      return "calculatorSuccess";
    }
  }

  renderPuzzle() {
    const calculatorDisplay = this.gameScreenElements.calculatorDisplay;
    const inputLine = this.gameScreenElements.userInputElement;
    const displayContent = this.getDisplayContent();
    calculatorDisplay.textContent = displayContent.restrictedText;
    inputLine.value = displayContent.fullText;
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
    this.completed = saveData.completed;
    this.currentExpression = saveData.currentExpression;
    this.currentValue = saveData.currentValue;
    this.lastTypeEntered = saveData.lastTypeEntered;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
      currentExpression: this.currentExpression,
      currentValue: this.currentValue,
      lastTypeEntered: this.lastTypeEntered,
    };
  }
}
