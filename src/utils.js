const createStoryElement = (text, index) => {
  const pElement = document.createElement("p");
  pElement.textContent = text;
  pElement.setAttribute("id", `story-text-${index}`);
  pElement.setAttribute("class", "story-text-element");
  return pElement;
};

const createUserElement = (text, index) => {
  const arrowElement = document.createElement("p");
  arrowElement.textContent = ">>";

  const textElement = document.createElement("p");
  textElement.setAttribute("class", "user-text");
  textElement.textContent = text;

  const container = document.createElement("span");
  container.setAttribute("id", `user-text-container-${index}`);
  container.setAttribute("class", "user-text-container");
  container.appendChild(arrowElement);
  container.appendChild(textElement);
  return container;
};

const createDiv = (className, idName) => {
  const newDiv = document.createElement("div");
  newDiv.setAttribute("class", className);
  if (idName) {
    newDiv.setAttribute("id", idName);
  }
  return newDiv;
};

const createNewGameInput = () => {
  const newInput = document.createElement("input");
  newInput.setAttribute("class", "name-input");
  newInput.setAttribute("type", "text");
  return newInput;
};

const createNewGameButton = (buttonClass, buttonText) => {
  const newButton = document.createElement("button");
  newButton.setAttribute("class", buttonClass);
  newButton.type = "button";
  newButton.textContent = buttonText;
  return newButton;
};

const spectacleEncryption = (plainText) => {
  return plainText
    .split("")
    .map((curLetter) => {
      const curAscii = curLetter.charCodeAt(0);
      let newAscii;
      if (curAscii < 33) {
        return curLetter;
      }
      if (curAscii < 65) {
        newAscii = (((curAscii - 33) * 15) % 32) + 65;
      } else {
        newAscii = (((curAscii - 65) * 15) % 32) + 33;
      }
      return String.fromCharCode(newAscii);
    })
    .join("");
};

const sleep = (t) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });

const yesCommands = ["Y", "YES", "SAY Y", "SAY YES"];
const noCommands = ["N", "NO", "SAY N", "SAY NO"];

export {
  createStoryElement,
  createUserElement,
  createDiv,
  createNewGameInput,
  createNewGameButton,
  spectacleEncryption,
  yesCommands,
  noCommands,
  sleep,
};
