import { createUserElement, createStoryElement, createDiv } from "../utils";

const myAudio = [];
for (let i = 0; i < 7; i++) {
  myAudio[i] = new Audio(`./sounds/note${i}.mp3`);
}

const audioDictionary = {
  q: 0,
  w: 1,
  e: 2,
  r: 3,
  t: 4,
  y: 5,
  u: 6,
};

const twinkleNotes = "QQTTYYTRREEWWQ";

const failMessages = [
  "You finish your piece and sit back...but nothing happens.",
  "As you finish, ...nothing happens.",
  "The final notes die away in the air, ...nothing happens.",
  "The room is filled with the sound of ...silence.",
  "You complete your song, but nothing happens.",
  "You scratch your head, and try to think of the right tune...",
  "You finish playing, and experience the sensation that this was not the right tune.",
];

const clueMessages = [
  "You stare at the pages of the music book in front of you, looking for inspiration.",
  "'100 Nursery Rhymes for beginners' stares back at you as you consider your next piece.",
  "As you look around for inspiration, the old telescope catches your eye.",
  "The telescope appears to be trained on something up in the night sky. You ponder its significance as you search for the right tune.",
  "It must be getting late - you can see stars shining in the night sky.",
  "One star in particular catches your eye - it seems to be glistening...",
  "You feel certain that the star holds some signifcance here...",
];

const morecambeQuote =
  "You get the strange sensation that you were playing all the right notes, but not necessarily in the right order.";

export class PianoPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "piano";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText =
      "You sit carefully on the piano stool and prepare to play. There is a book of music, titled '100 Nursery Rhymes for Piano' resting on the music stand.\n\nUse Q,W,E,R,T,Y,U to play. Type LEAVE at any time to stop playing.";
    this.completed = false;
    this.attemptCount = 0;
    this.clueIndex = 0;
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const textContainer = createDiv("text-container");
    const instructions = document.createElement("p");
    instructions.textContent = this.puzzleText;
    const textDisplayDiv = createDiv("puzzle-line-container");
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
    let noteIndex = audioDictionary[key];
    if (!isNaN(noteIndex) && !this.completed) {
      myAudio[noteIndex].cloneNode().play();
    }
  }

  respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });
    const musicSample = userInput.slice(0, 14);

    if (userInput === "LEAVE") {
      this.puzzleLine.push({ class: "puzzle", text: "OK." });
      this.resetPuzzle();
      return "leave";
    }

    if (musicSample === twinkleNotes) {
      console.log("THAT IS THE RIGHT TUNE! Play it again, Sam....(and pause)");
      //TODO: play song, pause, then render rest?
      this.puzzleLine.push({
        class: "puzzle",
        text: "Suddenly the room is full of mice squealing and running in all directions. Several mice are running up and down the piano keyboard while others appear to be dragging something into the room. The noise is deafening. Then they disappear as quickly as they came. All is quiet again.",
      });
      this.puzzleLine.push({
        class: "puzzle",
        text: "\n\nAs you look around, you notice a small glass bottle full of a blue liquid, and a phial containing some very pink liquid lying on the ground.",
      });
      this.renderPuzzle();
      this.completed = true;
      return;
    }

    if (this.morecambeCheck(musicSample)) {
      this.puzzleLine.push({ class: "puzzle", text: morecambeQuote });
      this.renderPuzzle();
      return;
    }

    this.attemptCount++;
    if (this.attemptCount % 2 === 0) {
      this.puzzleLine.push({
        class: "puzzle",
        text: clueMessages[this.clueIndex],
      });
      this.clueIndex = (this.clueIndex + 1) % clueMessages.length;
    } else {
      this.puzzleLine.push({
        class: "puzzle",
        text: failMessages[this.attemptCount % failMessages.length],
      });
    }
    this.renderPuzzle();
    return;
  }

  morecambeCheck(musicSample) {
    const noteCount = (note) => {
      return (musicSample.match(new RegExp(note, "g")) || []).length;
    };
    return (
      noteCount("Q") === 3 &&
      noteCount("W") === 2 &&
      noteCount("E") === 2 &&
      noteCount("R") === 2 &&
      noteCount("T") === 3 &&
      noteCount("Y") === 2
    );
  }

  resetPuzzle() {
    this.completed = false;
    this.attemptCount = 0;
    this.clueIndex = 0;
    this.puzzleLine = [];
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
    this.completed = saveData.completed;
    this.attemptCount = saveData.attemptCount;
    this.clueIndex = saveData.clueIndex;
    this.puzzleLine = saveData.puzzleLine.map((entry) => {
      return { class: entry.class, text: entry.text };
    });
  }

  generateSaveData() {
    return {
      id: this.id,
      puzzleLine: this.puzzleLine,
      completed: this.completed,
      attemptCount: this.attemptCount,
      clueIndex: this.clueIndex,
    };
  }
}
