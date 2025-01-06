import { createUserElement, createStoryElement, createDiv } from "../utils";
//constants
const canvasWidth = window.innerWidth * 0.4;
const canvasHeight = canvasWidth * 0.6;
const ballRadius = 10;
const ballTravelTime = 1000;
const holeRadius = 12;

//calculated Values
const centreX = canvasWidth / 2;
const centreY = canvasHeight / 2;
const radiusX = canvasWidth * 0.4;
const radiusY = canvasHeight * 0.4;
const eccentricity = Math.sqrt(1 - radiusY ** 2 / radiusX ** 2);
const focus = Math.sqrt(radiusX ** 2 - radiusY ** 2);
const travelDistance = 2 * Math.sqrt(radiusX ** 2 + radiusY ** 2);

export class SnookerPuzzle {
  constructor() {
    this.class = "puzzle";
    this.id = "snooker";
    this.gameScreenElements;
    this.puzzleLine = [];
    this.puzzleText =
      "You pick up the snooker cue and line up your shot.\n\nGive the angle (in degrees) between the path of the ball and the direction of the pocket.\n\nYou can LEAVE at any point.";
    this.completed = false;
    this.snookerTable = this.drawSnookerTable();
    this.snookerHole = this.drawHole();
    this.snookerSpot = this.drawSpot();
    this.ballX = centreX - focus;
    this.ballY = centreY;
  }

  createPuzzleHTML(user) {
    const puzzleContainer = createDiv("puzzle-container");
    const canvasDiv = createDiv("snooker-canvas-container");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.setAttribute("class", "snooker-canvas");
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);
    canvasDiv.appendChild(canvas);
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
      canvas,
      ctx,
      textContainer,
      textDisplayDiv,
    };
    return puzzleContainer;
  }

  handleKeyDown({ key }, user) {
    if (key === "Enter") {
      const userInput = this.gameScreenElements.userInputElement.value;
      this.gameScreenElements.userInputElement.value = "";
      if (userInput.trim().length === 0) return;
      user.handleInput(userInput);
    }
  }

  async respondToUserInput(userInput) {
    this.puzzleLine.push({ class: "userInput", text: userInput });

    if (userInput === "LEAVE") {
      this.puzzleLine.push({
        class: "Story",
        text: "OK.",
      });
      return "leave";
    }

    if (!isNaN(userInput)) {
      await this.hitBall(parseInt(userInput));
    } else {
      this.puzzleLine.push({
        class: "Story",
        text: "Plaese enter an angle to strike the snooker ball, or type 'LEAVE' to leave.",
      });
      this.renderPuzzle();
    }
  }

  resetPuzzle() {
    this.puzzleLine = [];
    this.ballX = centreX - focus;
    this.ballY = centreY;
  }

  renderPuzzle() {
    const ctx = this.gameScreenElements.ctx;
    ctx.fillStyle = "green";
    ctx.fill(this.snookerTable);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke(this.snookerTable);
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
    ctx.fill(this.snookerHole);
    ctx.fillStyle = "gray";
    ctx.fill(this.snookerSpot);
    this.drawBall();

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

  drawSnookerTable() {
    const snookerTable = new Path2D();
    snookerTable.ellipse(
      centreX,
      centreY,
      radiusX + 0.5 * ballRadius,
      radiusY + 0.5 * ballRadius,
      0,
      0,
      2 * Math.PI
    );
    return snookerTable;
  }

  drawHole() {
    const hole = new Path2D();
    hole.arc(centreX + focus, centreY, holeRadius, 0, 2 * Math.PI);
    return hole;
  }

  drawSpot() {
    const spot = new Path2D();
    spot.arc(centreX - focus, centreY, ballRadius / 3, 0, 2 * Math.PI);
    return spot;
  }

  drawBall() {
    const ctx = this.gameScreenElements.ctx;
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "gold";
    ctx.fill();
  }

  hitBall(angle) {
    const direction = (angle / 360) * 2 * Math.PI;
    const distanceToEdge = this.findDistanceToEdge(direction);
    return new Promise((resolve, reject) => {
      let start;
      const animateBall = (timeStamp, direction) => {
        if (start === undefined) {
          start = timeStamp;
        }
        const elapsed = timeStamp - start;
        const ballDistance = (elapsed / ballTravelTime) * travelDistance;

        [this.ballX, this.ballY] = this.plotBall(
          direction,
          ballDistance,
          distanceToEdge
        );
        this.clearScreen();
        this.renderPuzzle();
        if (this.inTheHoleCheck()) {
          resolve("straight in");
          return;
        }
        if (ballDistance < travelDistance) {
          requestAnimationFrame(function (timeStamp) {
            animateBall(timeStamp, direction);
          });
        } else {
          resolve("done");
        }
      };
      requestAnimationFrame(function (timeStamp) {
        animateBall(timeStamp, direction);
      });
    });
  }

  clearScreen() {
    this.gameScreenElements.ctx.clearRect(
      0,
      0,
      this.gameScreenElements.canvas.width,
      this.gameScreenElements.canvas.height
    );
  }

  findDistanceToEdge(direction) {
    return (
      (radiusX * (1 - eccentricity ** 2)) /
      (1 - eccentricity * Math.cos(direction))
    );
  }

  inTheHoleCheck() {
    if (
      Math.abs(centreX + focus - this.ballX) <= holeRadius - ballRadius &&
      Math.abs(centreY - this.ballY) <= holeRadius - ballRadius
    ) {
      return true;
    } else {
      return false;
    }
  }

  plotBall(direction, ballDistance, distanceToEdge) {
    if (ballDistance <= distanceToEdge) {
      return [
        centreX - focus + ballDistance * Math.cos(direction),
        centreY - ballDistance * Math.sin(direction),
      ];
    } else {
      const distanceToEnd = travelDistance - distanceToEdge;
      const remainingDistance = ballDistance - distanceToEdge;
      const startPoint = [
        centreX - focus + distanceToEdge * Math.cos(direction),
        centreY - distanceToEdge * Math.sin(direction),
      ];
      const endPoint = [centreX + focus, centreY];
      return [
        startPoint[0] +
          (remainingDistance / distanceToEnd) * (endPoint[0] - startPoint[0]),

        startPoint[1] +
          (remainingDistance / distanceToEnd) * (endPoint[1] - startPoint[1]),
      ];
    }
  }
}
