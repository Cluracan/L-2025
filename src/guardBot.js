const triangularNumbers = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78];

const generateTriangleText = (userInput) => {
  let triangleText = "The large bat flies over to a wall and writes:-\n\n";
  for (let i = 1; i <= userInput; i++) {
    triangleText += `${i}  `;
    if (i < 10) {
      triangleText += " ";
    }
    if (triangularNumbers.includes(i)) {
      triangleText += "\n\n";
    }
  }
  return triangleText;
};

const allowSpeechActionWords = (userInput) => {
  const speechWords = ["SAY", "SHOUT", "SCREAM", "WHISPER"];
  const splitInput = userInput.split(" ");
  const actionWord = splitInput[0].trim();
  const keyWord = splitInput[splitInput.length - 1].trim();
  if (speechWords.includes(actionWord) && !isNaN(keyWord)) {
    return keyWord;
  } else {
    return userInput;
  }
};

const allowPushButtonActionWords = (userInput) => {
  const pushButtonWords = ["TYPE", "PRESS", "PUSH"];
  const splitInput = userInput.split(" ");
  const actionWord = splitInput[0].trim();
  const keyWord = splitInput[splitInput.length - 1].trim();
  if (pushButtonWords.includes(actionWord) && !isNaN(keyWord)) {
    return keyWord;
  } else {
    return userInput;
  }
};

export class GuardBot {
  constructor({
    guardId,
    type,
    isMale,
    initialText,
    numberOfAttempts,
    openDoors,
    addOnText,
  }) {
    this.guardId = parseInt(guardId);
    this.type = type;
    this.isMale = isMale;
    this.initialText =
      initialText ||
      `There is a Drogo Robot Guard opposite you. ${
        this.isMale ? "He" : "She"
      } is carrying a huge butterfly net. Emblazoned across ${
        this.isMale ? "his" : "her"
      } front is the number ${parseInt(this.guardId) ** 2}`;
    this.numberOfAttempts = numberOfAttempts || 0;
    this.openDoors = openDoors;
    this.addOnText = addOnText;
    this.returnText;
    this.returnAction;
  }

  respondToUserInput(userInput) {
    console.log(this.type);
    switch (this.type) {
      case "regular":
        userInput = allowSpeechActionWords(userInput);
        console.log(userInput);
        if (parseInt(userInput) === this.guardId) {
          this.returnAction = "guardSuccess";
          this.returnText =
            "The guard gives a wail of terror and disappears out of sight.";
        } else {
          if (this.numberOfAttempts > 0) {
            this.returnAction = "jail";
            this.returnText = `The guard has caught you in ${
              this.isMale ? "his" : "her"
            } net. ${
              this.isMale ? "He" : "She"
            } carries you off to a remote room in the palace.\n\n`;
          } else {
            if (!isNaN(userInput)) {
              this.returnAction = "story";
              this.returnText = `The guard is unaffected by your number. ${
                this.isMale ? "He" : "She"
              } tries to catch you in ${
                this.isMale ? "his" : "her"
              } net, but you manage to dodge out of the way.`;
              this.numberOfAttempts++;
            } else {
              this.returnAction = "story";
              this.returnText = `The guard tries to catch you in ${
                this.isMale ? "his" : "her"
              } net, but you manage to dodge out of the way.`;
              this.numberOfAttempts++;
            }
          }
        }
        return { action: this.returnAction, text: this.returnText };

      case "deaf":
        userInput = allowSpeechActionWords(userInput);
        if (!isNaN(userInput)) {
          this.returnAction = "text";
          this.returnText =
            parseInt(userInput) === 11
              ? "The guard does not hear you; he seems to be deaf. His robot eye watches you with a cold, unending stare"
              : "The guard takes no notice.";
          return { action: this.returnAction, text: this.returnText };
        }
        break;

      case "bat":
        userInput = allowSpeechActionWords(userInput);
        if (!isNaN(userInput)) {
          userInput = parseInt(userInput);
          if (userInput > 30 && triangularNumbers.includes(userInput)) {
            this.returnAction = "guardSuccess";
            this.returnText = generateTriangleText(userInput);
            this.returnText +=
              '\n\n"That\'s OK", says the large bat, smiling a sickly smile.';
          } else if (userInput > 90) {
            this.returnAction = "story";
            this.returnText = "\"That's far too big! screeches the bat.";
          } else {
            this.numberOfAttempts++;
            if (this.numberOfAttempts % 3 === 0) {
              this.returnAction = "story";
              this.returnText = generateTriangleText(userInput);
              this.returnText +=
                '\n\n"I detest anything that\'s not triangular," shrieks the large bat.\n\n';
              if (userInput < 30) {
                this.returnText += '"...and that\'s far too small!"';
              }
            } else {
              this.returnAction = "story";
              this.returnText =
                '"That\'s no good," shrieks the large bat\n\nHalf a dozen bats swoop down at you viciously, but at a signal from the large bat they withdraw.\n\n"Try again. But be very, very careful," says the large bat.';
            }
          }
          return { action: this.returnAction, text: this.returnText };
        }
        break;

      case "safe":
        if (!isNaN(userInput)) {
          userInput = allowPushButtonActionWords(userInput);
          userInput = parseInt(userInput);
          if (userInput === 4096) {
            this.returnAction = "guardSuccess";
            this.returnText =
              "The safe door has swung open to reveal a passage going north.";
          } else if (
            Number.isInteger(Math.sqrt(userInput)) &&
            Number.isInteger(Math.cbrt(userInput))
          ) {
            this.returnAction = "story";
            this.returnText =
              "The safe door clicks and buzzes furiously...but remains locked.";
          } else if (Number.isInteger(Math.sqrt(userInput))) {
            this.returnAction = "story";
            this.returnText = "The safe door clicks...but remains locked.";
          } else if (Number.isInteger(Math.cbrt(userInput))) {
            this.returnAction = "story";
            this.returnText = "The safe door buzzes...but remains locked.";
          } else {
            this.returnAction = "story";
            this.returnText = "The safe door remains closed.";
          }
          return { action: this.returnAction, text: this.returnText };
        }
        break;

      case "jail":
        userInput = allowSpeechActionWords(userInput);
        userInput = parseInt(userInput);
        if (userInput === this.guardId) {
          this.returnAction = "guardSuccess";
          this.returnText = `The guard gives a wail of terror and disappears out of sight.`;
        } else {
          this.returnAction = "jailFail";
          this.returnText = `The guard swears at you and leaves, locking the door behind ${
            this.isMale ? "him" : "her"
          }.`;
        }
        return { action: this.returnAction, text: this.returnText };
    }
  }
}

export function jailCheck(activeRoom) {
  if (activeRoom.roomId === 70 && activeRoom.options["E"] === "blocked") {
    return Math.random() > 0.6 ? true : false;
  }
}

export function guardRoomCheck(activeRoom) {
  return activeRoom.roomId === 75;
}

export function createJailGuard() {
  const guardId = Math.floor(Math.random() * 9 + 6);
  const isMale = Math.random() > 0.5 ? true : false;
  const guard = new GuardBot({
    guardId,
    type: "jail",
    isMale,
    initialText: `\nA Drogo Robot Guard comes into the room with some food. Emblazoned across ${
      isMale ? "his" : "her"
    } front is the number ${guardId ** 2}`,
    openDoors: true,
    addOnText: "The door to the east is open.",
  });
  return guard;
}

export function guardRNG(currentRoom, isCarryingRing) {
  let guardProbability;
  const excludedRooms = [0, 1, 2, 3, 4, 5, 6, 41, 70, 71, 72, 75, 76];
  if (
    excludedRooms.includes(parseInt(currentRoom.roomId)) ||
    currentRoom.guardBot ||
    currentRoom.puzzleBot ||
    isCarryingRing
  ) {
    console.log("no chance of guard");
    guardProbability = 0;
  } else {
    guardProbability =
      currentRoom.roomId > 25 && currentRoom.roomId < 39 ? 0.1 : 0.05;
  }

  const rng = Math.random();
  if (rng < guardProbability) {
    console.log("GUARD!!!!!!!!!!!");
    const guardId = Math.floor(Math.random() * 9 + 6);
    const isMale = Math.random() > 0.5 ? true : false;
    const guard = new GuardBot({
      guardId,
      type: "regular",
      isMale,
    });
    currentRoom.guardBot = guard;
    console.log(currentRoom);
  }

  return currentRoom;
}
