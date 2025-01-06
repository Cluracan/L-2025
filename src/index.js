import { Game } from "./game";
import "./style.css";
import loading from "./images/loading.jpg";
import paperScrap from "./images/paperScrap.png";
import computer from "./images/computer.jpg";
import {
  createDiv,
  createNewGameInput,
  createNewGameButton,
  sleep,
} from "./utils";

const optionList = [
  {
    text: "New Game",
    action: function (book, index) {
      book.style.setProperty("--current-index", index + 1);
      document.getElementsByClassName("name-input")[0].focus();
    },
  },
  {
    text: "Instructions",
    action: function (book, index) {
      book.style.setProperty("--current-index", index + 1);
    },
  },
  {
    text: "About",
    action: function (book, index) {
      book.style.setProperty("--current-index", index + 1);
    },
  },
  {
    text: "Load Game",
    action: function () {
      const loadinput = document.createElement("input");
      loadinput.type = "file";
      loadinput.accept = ".sav";
      loadinput.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (readerEvent) => {
          const gameContent = readerEvent.target.result;
          const gameSaveData = JSON.parse(atob(gameContent));
          const game = new Game();
          game.loadFromSaveData(gameSaveData.gameSaveData);
          game.user.loadFromSaveData(gameSaveData.userSaveData);
          game.displayGame();
          sessionStorage.setItem("hasLoaded", true);
        };
      };
      loadinput.click();
    },
  },
];

const difficultyLevels = [
  {
    text: "CLASSIC",
    feedback:
      "The full 1984 experience. No map? No problem! You're on your own though...",
  },
  {
    text: "MODERN",
    feedback:
      "The updated version includes an inventory log and a magical map. Don't leave home without it!",
  },
];

const instructionsLHS = [
  "It had been a very odd day. Perhaps it was the heat, or the distance you had walked.",
  "The morning had passed slowly; first a long walk beside the river and then the coolness of the beech wood. The wood was very dark and you had a feeling that someone, or something was close by in the shadows.",
  "Unexpectedly, you emerged from the wood. It seemed much hotter. The light was very intense and it took you some moments to notice the old palace. You walked across a meadow before sinking down on a grassy bank.",
  "A glinting light from one of the palace windows catches your eye but your sister, as usual, is immersed in her book and sees nothing. As you turn away from her to look again a welcome breeze rustles a scrap of paper across the grass...",
];

const instructionsRHS = [
  '"L" is an adventure game involving many different Mathematical activities.',
  "Your experiences may be intriguing or puzzling. Talk about them with fellow adventurers but do not give anything away to those who may be following.",
  'Whenever you see >> you should type your instructions using one or two words; sometimes they can be abbreviated - "N" for "NORTH", "U" for "UP", "Y" for "YES".',
  "Some useful instructions are:\n\n\tLOOK,\tINV,\tGET,\tUSE\n\nYou can also SAVE at any point...",
  'The situations that you find yourself in during this game may have nothing to do with your task. Some may give rise to red herrings, or even no challenge at all. After all, real life is just like that. You may have come to expect that mathematics always has neat solutions, perhaps "L" may make you feel less certain about that.',
];

const aboutText = [
  "L was published in 1984 for the BBC Micro. The lead developer was Richard Phillips, supported by colleagues from the Association of Teachers of Mathematics (ATM), including Derek Ball, Tony Corbett, David Rooke, Heather Scott, Alan Shaw, Margaret Stevens, Ruth Townsend, Jo Waddingham, Roger Waddingham, Alan Wigley, John Wood, John Warwick, and David Wooldridge.",
  "A revised addition was published by the ATM many years later, but this is no longer available. You can still play the original game at the BBC Micro Games Archive.\n\nThis version was created in 2024.",
];

const generateLoadingScreen = () => {
  const bodyContainer = document.getElementById("body-container");
  const bookContainer = createDiv("book-container");
  const book = createDiv("book");
  book.style.setProperty("--current-index", 0);
  /*---------------
    Title Page
    ---------------*/
  const titlePage = createDiv("page");
  titlePage.style.setProperty("--page-index", 0);
  titlePage.addEventListener("click", (evt) => {
    const targetPage = evt.target.closest(".back") ? 0 : 1;
    book.style.setProperty("--current-index", targetPage);
  });
  const titleFront = createDiv("front");
  const loadingImage = new Image();
  loadingImage.src = loading;
  titleFront.appendChild(loadingImage);
  titlePage.appendChild(titleFront);

  const titleBack = createDiv("back");
  titlePage.appendChild(titleBack);
  /*---------------
    New Game Page
    ---------------*/
  const newGamePage = createDiv("page");
  newGamePage.style.setProperty("--page-index", 1);
  const newGameFront = createDiv("front");
  const welcomeText = document.createElement("p");
  welcomeText.textContent = "Welcome, adventurers!";
  newGameFront.appendChild(welcomeText);

  const teamNameHolder = createDiv("new-game-question-holder");
  const teamNameQuestion = createDiv("new-game-question");
  teamNameQuestion.textContent = "...By what shall you be called?";
  teamNameHolder.appendChild(teamNameQuestion);
  const teamNameInput = createNewGameInput();
  teamNameInput.addEventListener(
    "input",
    (e) => (teamNameFeedback.textContent = "")
  );
  teamNameHolder.appendChild(teamNameInput);
  const teamNameFeedback = createDiv("team-name-feedback");
  teamNameHolder.appendChild(teamNameFeedback);
  newGameFront.appendChild(teamNameHolder);

  const difficultyHolder = createDiv("new-game-question-holder");
  const difficultyQuestion = createDiv("new-game-question");
  difficultyQuestion.textContent = "Choose your difficulty:";
  difficultyHolder.appendChild(difficultyQuestion);
  const difficultyButtonContainer = createDiv("difficulty-button-container");
  let difficultySetting = difficultyLevels[0].text;
  let difficultyButtons = [];
  difficultyLevels.forEach((difficultyChoice) => {
    const difficultyButton = createNewGameButton(
      "new-game-button",
      difficultyChoice.text
    );
    difficultyButton.addEventListener("click", (evt) => {
      if (difficultySetting != difficultyChoice.text) {
        difficultySetting = difficultyChoice.text;
        difficultyFeedback.textContent = difficultyChoice.feedback;
        for (const button of difficultyButtons) {
          button.classList.toggle("button-selected");
        }
      }
    });
    difficultyButtons.push(difficultyButton);
    difficultyButtonContainer.appendChild(difficultyButton);
  });
  difficultyButtons[0].classList.add("button-selected");
  difficultyHolder.appendChild(difficultyButtonContainer);
  const difficultyFeedback = createDiv("difficulty-feedback");
  difficultyFeedback.textContent = difficultyLevels[0].feedback;
  difficultyHolder.appendChild(difficultyFeedback);
  newGameFront.appendChild(difficultyHolder);

  const startButton = createNewGameButton("start-button", "START");
  startButton.addEventListener("click", async (evt) => {
    if (teamNameInput.value.trim().length === 0) {
      teamNameFeedback.textContent =
        "Please enter a team name, for example 'Mel and Kim', or 'The A team'";
      return;
    }
    const teamNameHasForbiddenCharacters = /[^a-z0-9\s]/i.test(
      teamNameInput.value
    );
    if (teamNameHasForbiddenCharacters) {
      teamNameFeedback.textContent =
        "Please only use alphanumeric characters in your team name...";
      return;
    }
    await sleep(1000);
    const modernMode = difficultySetting === "MODERN" ? true : false;
    sessionStorage.setItem("hasLoaded", true);
    const game = new Game(teamNameInput.value, modernMode);
    game.displayGame();
  });
  newGameFront.appendChild(startButton);
  newGamePage.appendChild(newGameFront);

  const newGameBack = createDiv("back");
  newGameBack.addEventListener("click", (evt) => {
    console.log(evt);
    book.style.setProperty("--current-index", 1);
  });
  for (const instructionText of instructionsLHS) {
    const newParagraph = document.createElement("div");
    newParagraph.textContent = instructionText;
    newGameBack.appendChild(newParagraph);
  }
  const paperScrapContainer = createDiv("paper-scrap");
  const paperScrapImage = new Image();
  paperScrapImage.src = paperScrap;
  paperScrapContainer.appendChild(paperScrapImage);
  newGameBack.appendChild(paperScrapContainer);
  newGamePage.appendChild(newGameBack);
  /*---------------
    Instructions Page
    ---------------*/
  const instructionsPage = createDiv("page");
  instructionsPage.style.setProperty("--page-index", 2);
  instructionsPage.addEventListener("click", (evt) => {
    const targetPage = evt.target.closest(".back") ? 2 : 3;
    book.style.setProperty("--current-index", targetPage);
  });
  const instructionsFront = createDiv("front");
  instructionsRHS.forEach((instructionText) => {
    const newParagraph = document.createElement("div");
    newParagraph.textContent = instructionText;
    instructionsFront.appendChild(newParagraph);
  });
  instructionsPage.appendChild(instructionsFront);

  const instructionsBack = createDiv("back");
  instructionsPage.appendChild(instructionsBack);
  /*---------------
    About Page
    ---------------*/
  const aboutPage = createDiv("page");
  aboutPage.style.setProperty("--page-index", 3);
  aboutPage.addEventListener("click", (evt) => {
    const targetPage = evt.target.closest(".back") ? 3 : 4;
    book.style.setProperty("--current-index", targetPage);
  });
  const aboutFront = createDiv("front");
  const aboutUpperTextContainer = document.createElement("p");
  aboutUpperTextContainer.textContent = aboutText[0];
  aboutFront.appendChild(aboutUpperTextContainer);
  const computerImageContainer = createDiv("computer-image");
  const computerImage = new Image();
  computerImage.src = computer;
  computerImageContainer.appendChild(computerImage);
  aboutFront.appendChild(computerImageContainer);
  const aboutLowerTextContainer = document.createElement("p");
  aboutLowerTextContainer.textContent = aboutText[1];
  aboutFront.appendChild(aboutLowerTextContainer);
  aboutPage.appendChild(aboutFront);

  const aboutBack = createDiv("back");
  aboutPage.appendChild(aboutBack);

  book.appendChild(titlePage);
  book.appendChild(newGamePage);
  book.appendChild(instructionsPage);
  book.appendChild(aboutPage);
  bookContainer.appendChild(book);
  bodyContainer.appendChild(bookContainer);

  const optionsContainer = createDiv("options-container");
  optionList.forEach((option, index) => {
    const newGameOption = createDiv("intro-option");
    newGameOption.textContent = option.text;
    newGameOption.addEventListener("click", (evt) =>
      option.action(book, index)
    );
    optionsContainer.appendChild(newGameOption);
  });

  bodyContainer.appendChild(optionsContainer);
};

const hasLoaded = sessionStorage.getItem("hasLoaded") || false;

if (!hasLoaded) {
  generateLoadingScreen();
} else {
  const game = new Game();
  const sessionGameData = sessionStorage.getItem("gameData");
  const sessionUserData = sessionStorage.getItem("userData");
  const sessionPuzzleData = sessionStorage.getItem("puzzleData") || null;

  game.handleRefreshContent(
    sessionGameData,
    sessionUserData,
    sessionPuzzleData
  );
  game.displayGame();
}
