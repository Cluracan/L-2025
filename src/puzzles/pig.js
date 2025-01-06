import {
  createUserElement,
  createStoryElement,
  createDiv,
  yesCommands,
  noCommands,
} from "../utils";

import pigIcon from "../images/pig.svg";
import userIcon from "../images/person.svg";
import pigCapturedIcon from "../images/pigCaptured.svg";

const movementCommands = ["U", "UP", "D", "DOWN", "L", "LEFT", "R", "RIGHT"];

const updateUserLocation = (currentLocation, direction) => {
  let newLocation = currentLocation;
  let hasMoved = false;
  switch (direction) {
    case "U":
      if (currentLocation > 4) {
        hasMoved = true;
        newLocation = currentLocation - 5;
      }
      break;
    case "D":
      if (currentLocation < 20) {
        hasMoved = true;
        newLocation = currentLocation + 5;
      }
      break;
    case "L":
      if (currentLocation % 5 > 0) {
        hasMoved = true;
        newLocation = currentLocation - 1;
      }
      break;
    case "R":
      if (currentLocation % 5 < 4) {
        hasMoved = true;
        newLocation = currentLocation + 1;
      }
      break;
  }
  return { newLocation, hasMoved };
};

const updatePigLocation = (currentPigLocation, currentUserLocation) => {
  const possiblenewLocations = [];
  if (currentPigLocation > 4) {
    possiblenewLocations.push(currentPigLocation - 5);
  }
  if (currentPigLocation < 20) {
    possiblenewLocations.push(currentPigLocation + 5);
  }
  if (currentPigLocation % 5 > 0) {
    possiblenewLocations.push(currentPigLocation - 1);
  }
  if (currentPigLocation % 5 < 4) {
    possiblenewLocations.push(currentPigLocation + 1);
  }
  let maxDistanceToUser = 0;
  let newLocation;
  for (const possibleLocation of possiblenewLocations) {
    let distanceToUser = manhattan(possibleLocation, currentUserLocation);
    if (distanceToUser > maxDistanceToUser) {
      newLocation = possibleLocation;
      maxDistanceToUser = distanceToUser;
    }
  }
  return newLocation;
};

const manhattan = (pigLocation, userLocation) => {
  let horizontalDistance = Math.abs((pigLocation % 5) - (userLocation % 5));
  let verticalDistance = Math.abs(
    Math.floor(pigLocation / 5) - Math.floor(userLocation / 5)
  );
  return horizontalDistance + verticalDistance;
};

export class PigPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "pig";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.introTextTop = [
      "CATCH THE PIG",
      "The floor of this room is divided into 25 squares. The plan below shows the position of the pig and you.",
    ];
    this.introTextBottom =
      "You can move using the arrow keys, or by typing UP, DOWN, LEFT or RIGHT (U, D, L, R).  You can LEAVE at any time.";
    this.startQuestion = "Do you want to move first?";
    this.startQuestionAnswered = false;
    this.completed = false;
    this.pigLocation = 2;
    this.userLocation = 12;
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const pigContainer = createDiv("pig-container");

    this.introTextTop.forEach((textEntry) => {
      const upperIntroText = document.createElement("p");
      upperIntroText.textContent = textEntry;
      pigContainer.appendChild(upperIntroText);
    });

    const pigGrid = createDiv("pig-grid");
    pigContainer.appendChild(pigGrid);

    const lowerIntroText = document.createElement("p");
    lowerIntroText.textContent = this.introTextBottom;
    pigContainer.appendChild(lowerIntroText);
    puzzleContainer.appendChild(pigContainer);

    const textContainer = createDiv("text-container");
    const textDisplayDiv = createDiv("puzzle-line-container");
    if (this.puzzleLine.length === 0) {
      this.puzzleLine.push({
        class: "puzzle",
        text: "Do you want to move first?",
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
    userInputElement.addEventListener("keydown", (event) =>
      this.handleKeyDown(event, user)
    );
    textInputContainer.appendChild(arrows);
    textInputContainer.appendChild(userInputElement);
    puzzleContainer.appendChild(textInputContainer);
    this.gameScreenElements = {
      userInputElement,
      pigGrid,
      textContainer,
      textDisplayDiv,
    };
    return puzzleContainer;
  }

  handleKeyDown(event, user) {
    switch (event.key) {
      case "Enter":
        const userInput = this.gameScreenElements.userInputElement.value;
        if (userInput.trim().length === 0) return;
        this.gameScreenElements.userInputElement.value = "";
        user.handleInput(userInput);
        break;
      case "ArrowUp":
        user.handleInput("U");
        break;
      case "ArrowDown":
        user.handleInput("D");
        break;
      case "ArrowLeft":
        user.handleInput("L");
        break;
      case "ArrowRight":
        user.handleInput("R");
        break;
    }
  }

  async respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });

    if (userInput === "LEAVE") {
      this.puzzleLine.push({ class: "puzzle", text: "OK." });
      this.resetPuzzle();
      return "leave";
    }

    if (!this.startQuestionAnswered) {
      if (yesCommands.includes(userInput)) {
        this.startQuestionAnswered = true;
        this.puzzleLine.push({ class: "puzzle", text: "Ok, you can start." });
      } else if (noCommands.includes(userInput)) {
        this.startQuestionAnswered = true;
        this.pigLocation = updatePigLocation(
          this.pigLocation,
          this.userLocation
        );
        this.puzzleLine.push({
          class: "puzzle",
          text: "Ok. The pig has moved",
        });
      } else {
        this.puzzleLine.push({
          class: "puzzle",
          text: "Please answer YES or NO - do you want to go first?",
        });
      }
      this.renderPuzzle();
      return;
    }

    if (movementCommands.includes(userInput)) {
      const movementFeedback = updateUserLocation(
        this.userLocation,
        userInput[0]
      );

      if (movementFeedback.hasMoved) {
        this.userLocation = movementFeedback.newLocation;
        this.renderPuzzle();

        if (this.userLocation === this.pigLocation) {
          this.puzzleLine.push({
            class: "puzzle",
            text: "You have caught hold of the pig, which squeals and wriggles. It soon breaks free, but not before you have examined the piece of paper on its collar.\n\nIt has one word written on it: NEUMANN",
          });
          this.completed = true;
          this.renderPuzzle();
          return;
        }

        await new Promise((res) => setTimeout(res, 300));

        this.pigLocation = updatePigLocation(
          this.pigLocation,
          this.userLocation
        );
        this.puzzleLine.push({ class: "puzzle", text: "The pig has moved." });
        this.renderPuzzle();
      }
    }
  }

  renderPuzzle() {
    this.gameScreenElements.pigGrid.innerHTML = "";
    for (let i = 0; i < 25; i++) {
      const pigGridCell = createDiv("pig-cell");
      if (i === this.pigLocation && i === this.userLocation) {
        const pigCapturedImage = document.createElement("img");
        pigCapturedImage.classList.add("pig-image");
        pigCapturedImage.src = pigCapturedIcon;
        pigGridCell.appendChild(pigCapturedImage);
      } else {
        if (i === this.pigLocation) {
          const pigImage = document.createElement("img");
          pigImage.classList.add("pig-image");
          pigImage.src = pigIcon;
          pigGridCell.appendChild(pigImage);
        } else if (i === this.userLocation) {
          const userImage = document.createElement("img");
          userImage.classList.add("pig-image");
          userImage.src = userIcon;
          pigGridCell.appendChild(userImage);
        }
      }
      this.gameScreenElements.pigGrid.appendChild(pigGridCell);
      sessionStorage.setItem(
        "puzzleData",
        btoa(JSON.stringify(this.generateSaveData()))
      );
    }

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
  }

  resetPuzzle() {
    this.completed = false;
    this.puzzleLine = [];
    this.pigLocation = 2;
    this.userLocation = 12;
    this.startQuestionAnswered = false;
  }

  generateSaveData() {
    return {
      id: this.id,
      completed: this.completed,
      puzzleLine: this.puzzleLine,
      startQuestionAnswered: this.startQuestionAnswered,
      pigLocation: this.pigLocation,
      userLocation: this.userLocation,
    };
  }

  loadFromSaveData(saveData) {
    this.id = saveData.id;
    this.completed = saveData.completed;
    this.puzzleLine = saveData.puzzleLine;
    this.startQuestionAnswered = saveData.startQuestionAnswered;
    this.pigLocation = saveData.pigLocation;
    this.userLocation = saveData.userLocation;
  }
}
