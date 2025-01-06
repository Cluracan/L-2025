//config Values
const roomSize = 50;
const userSize = 6;
const userColor = "#f4e22e";
const roomConnectorLength = 20;
const stairLength = 4;
const roomFont = "8pt Arial";
const animationTime = 800;

//calculated Values
const roomShift = roomConnectorLength / 2 + roomSize;

//helper functions
const exitDictionary = (x, y, exitDirection) => {
  let xStart, yStart;
  switch (exitDirection) {
    case "N":
      xStart = x + roomSize / 2;
      yStart = y + roomConnectorLength / 4;
      return {
        xStart,
        yStart,
        xEnd: xStart,
        yEnd: yStart - roomConnectorLength,
      };
    case "S":
      xStart = x + roomSize / 2;
      yStart = y + roomSize - roomConnectorLength / 4;
      return {
        xStart,
        yStart,
        xEnd: xStart,
        yEnd: yStart + roomConnectorLength,
      };
    case "E":
      xStart = x + roomSize - roomConnectorLength / 4;
      yStart = y + roomSize / 2;
      return {
        xStart,
        yStart,
        xEnd: xStart + roomConnectorLength,
        yEnd: yStart,
      };
    case "W":
      xStart = x + roomConnectorLength / 4;
      yStart = y + roomSize / 2;
      return {
        xStart,
        yStart,
        xEnd: xStart - roomConnectorLength,
        yEnd: yStart,
      };
    case "NE":
      xStart = x + roomSize - roomConnectorLength / 4;
      yStart = y + roomConnectorLength / 4;
      return {
        xStart,
        yStart,
        xEnd: xStart + roomConnectorLength,
        yEnd: yStart - roomConnectorLength,
      };
    case "SE":
      xStart = x + roomSize - roomConnectorLength / 4;
      yStart = y + roomSize - roomConnectorLength / 4;
      return {
        xStart,
        yStart,
        xEnd: xStart + roomConnectorLength,
        yEnd: yStart + roomConnectorLength,
      };
    case "SW":
      xStart = x + roomConnectorLength / 4;
      yStart = y + roomSize - roomConnectorLength / 4;
      return {
        xStart,
        yStart,
        xEnd: xStart - roomConnectorLength,
        yEnd: yStart + roomConnectorLength,
      };
    case "NW":
      xStart = x + roomConnectorLength / 4;
      yStart = y + roomConnectorLength / 4;
      return {
        xStart,
        yStart,
        xEnd: xStart - roomConnectorLength,
        yEnd: yStart - roomConnectorLength,
      };
  }
};

const nextRoomDictionary = (x, y, roomDirection) => {
  switch (roomDirection) {
    case "N":
      return { x, y: y - roomShift };
    case "E":
      return { x: x + roomShift, y };
    case "S":
      return { x, y: y + roomShift };
    case "W":
      return { x: x - roomShift, y };
    case "NE":
      return { x: x + roomShift, y: y - roomShift };
    case "SE":
      return { x: x + roomShift, y: y + roomShift };
    case "SW":
      return { x: x - roomShift, y: y + roomShift };
    case "NW":
      return { x: x - roomShift, y: y - roomShift };
  }
};

const findRoomAdjustment = (roomDirection, userStep) => {
  switch (roomDirection) {
    case "N":
      return { x: 0, y: +userStep };
    case "E":
      return { x: -userStep, y: 0 };
    case "S":
      return { x: 0, y: -userStep };
    case "W":
      return { x: userStep, y: 0 };
    case "NE":
      return { x: -userStep, y: userStep };
    case "SE":
      return { x: -userStep, y: -userStep };
    case "SW":
      return { x: userStep, y: -userStep };
    case "NW":
      return { x: userStep, y: userStep };
  }
};

const isWalkable = (direction) => {
  return ["N", "E", "S", "W", "NE", "NW", "SE", "SW"].includes(direction);
};

export class Canvas {
  #canvas;
  #ctx;
  #width;
  #height;
  #homeRoomX;
  #homeRoomY;
  #roomArray;
  constructor(canvas, ctx, width, height) {
    this.#canvas = canvas;
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#homeRoomX = this.#width / 2 - roomSize / 2;
    this.#homeRoomY = this.#height / 2 - roomSize / 2;
    this.#roomArray = [];
    this.currentRoomId = 0;
  }

  setContext(context) {
    this.#ctx = context;
  }

  setCanvas(canvas) {
    this.#canvas = canvas;
  }

  updateMap(activeRoomId, visitedRooms, roomList) {
    return new Promise(async (resolve, reject) => {
      if (this.currentRoomId == activeRoomId) {
        this.#buildMap(activeRoomId, visitedRooms, roomList);
        this.drawMap(roomList);
        this.#drawUser();
        resolve();
      }
      const currentRoomExits = roomList[this.currentRoomId].options;
      if (Object.values(currentRoomExits).includes(activeRoomId)) {
        let moveDirection;
        for (const [direction, pointer] of Object.entries(currentRoomExits)) {
          if (pointer === activeRoomId) {
            moveDirection = direction;
          }
        }
        if (isWalkable(moveDirection)) {
          this.currentRoomId = activeRoomId;
          await this.#translateMap(moveDirection, activeRoomId, roomList);
        } else {
          this.currentRoomId = activeRoomId;
          this.#buildMap(activeRoomId, visitedRooms, roomList);
          this.drawMap(roomList);
          this.#drawUser();
        }
        resolve();
      } else {
        this.currentRoomId = activeRoomId;
        this.#buildMap(activeRoomId, visitedRooms, roomList);
        this.drawMap(roomList);
        this.#drawUser();
        resolve();
      }
    });
  }

  drawMap(roomList, roomArray = this.#roomArray) {
    this.#clearCanvas();
    roomArray.forEach((room) => {
      const roomName = roomList[room.roomId].mapName;
      const exits = roomList[room.roomId].options;
      this.#drawRoom(room.x, room.y, roomName);
      this.#drawExits(room.x, room.y, exits);
    });
  }

  #drawUser() {
    this.#ctx.strokeStyle = "black";
    this.#ctx.fillStyle = userColor;
    this.#ctx.beginPath();
    this.#ctx.arc(
      this.#homeRoomX + roomSize / 2,
      this.#homeRoomY + 0.6 * roomSize,
      userSize,
      0,
      2 * Math.PI
    );
    this.#ctx.stroke();
    this.#ctx.fill();
  }

  #drawRoom(x, y, roomName) {
    this.#ctx.fillStyle = "black";
    this.#ctx.strokeStyle = "black";
    this.#ctx.beginPath();
    this.#ctx.roundRect(x, y, roomSize, roomSize, 3);
    this.#ctx.stroke();
    this.#ctx.font = roomFont;
    this.#ctx.textAlign = "center";
    this.#ctx.fillText(roomName, x + roomSize / 2, y + roomSize / 3);
  }

  #drawExits(x, y, exits) {
    for (const [exitDirection, roomPointer] of Object.entries(exits)) {
      const exitLine = exitDictionary(x, y, exitDirection);
      if (exitLine) {
        this.#ctx.strokeStyle = roomPointer === "blocked" ? "red" : "black";
        this.#ctx.beginPath();
        this.#ctx.moveTo(exitLine.xStart, exitLine.yStart);
        this.#ctx.lineTo(exitLine.xEnd, exitLine.yEnd);
        this.#ctx.stroke();
      } else if (exitDirection == "U" || exitDirection == "D") {
        this.#drawStairs(x, y);
      }
    }
  }

  #drawStairs(x, y) {
    this.#ctx.beginPath();
    const stairXstart = x + roomSize / 2 - 1.5 * stairLength;
    const stairYstart = y + roomSize / 2 + 3 * stairLength;
    this.#ctx.moveTo(stairXstart, stairYstart);
    this.#ctx.lineTo(stairXstart, stairYstart - stairLength);
    this.#ctx.lineTo(stairXstart + stairLength, stairYstart - stairLength);
    this.#ctx.lineTo(stairXstart + stairLength, stairYstart - 2 * stairLength);
    this.#ctx.lineTo(
      stairXstart + 2 * stairLength,
      stairYstart - 2 * stairLength
    );
    this.#ctx.lineTo(
      stairXstart + 2 * stairLength,
      stairYstart - 3 * stairLength
    );
    this.#ctx.lineTo(
      stairXstart + 3 * stairLength,
      stairYstart - 3 * stairLength
    );
    this.#ctx.stroke();
  }

  #buildMap(homeRoomId, visitedRooms, roomList) {
    this.#roomArray = [];
    const queue = [];
    queue.push({ roomId: homeRoomId, x: this.#homeRoomX, y: this.#homeRoomY });
    while (queue.length > 0) {
      const curRoom = queue.pop();
      const curRoomId = curRoom.roomId;
      const curRoomX = curRoom.x;
      const curRoomY = curRoom.y;
      if (!this.#roomArray.some((entry) => entry.roomId === curRoomId)) {
        this.#roomArray.push(curRoom);
      }
      for (const [direction, roomPointer] of Object.entries(
        roomList[curRoomId].options
      )) {
        if (
          visitedRooms.has(roomPointer) &&
          !this.#roomArray.some((entry) => entry.roomId === roomPointer)
        ) {
          const nextRoom = nextRoomDictionary(curRoomX, curRoomY, direction);
          if (nextRoom) {
            this.#roomArray.push({
              roomId: roomPointer,
              x: nextRoom.x,
              y: nextRoom.y,
            });
            queue.push({ roomId: roomPointer, x: nextRoom.x, y: nextRoom.y });
          }
        }
      }
    }
  }

  #clearCanvas() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
  }

  #addRoom(direction, nextRoomId, roomList) {
    const nextRoomLocation = nextRoomDictionary(
      this.#homeRoomX,
      this.#homeRoomY,
      direction
    );
    const nextRoomName = roomList[nextRoomId].mapName;
    this.#drawRoom(nextRoomLocation.x, nextRoomLocation.y, nextRoomName);
    this.#roomArray.push({
      roomId: nextRoomId,
      x: nextRoomLocation.x,
      y: nextRoomLocation.y,
    });
  }

  async #translateMap(direction, activeRoomId, roomList) {
    return new Promise((resolve, reject) => {
      let start;
      const animateMap = (timeStamp, direction) => {
        this.#clearCanvas();
        if (start === undefined) {
          start = timeStamp;
        }
        const elapsed = timeStamp - start;
        const stepDistance = Math.floor((elapsed / animationTime) * roomShift);
        if (
          stepDistance >= 0.5 * roomShift &&
          !this.#roomArray.find((room) => room.roomId === activeRoomId)
        ) {
          this.#addRoom(direction, activeRoomId, roomList);
        }
        const roomAdjustment = findRoomAdjustment(direction, stepDistance);
        const tempRoomArray = this.#roomArray.map((room) => {
          return {
            roomId: room.roomId,
            x: room.x + roomAdjustment.x,
            y: room.y + roomAdjustment.y,
          };
        });
        this.drawMap(roomList, tempRoomArray);
        this.#drawUser();
        if (stepDistance <= roomShift) {
          requestAnimationFrame(function (timeStamp) {
            animateMap(timeStamp, direction);
          });
        } else {
          resolve("done");
        }
      };
      requestAnimationFrame(function (timeStamp) {
        animateMap(timeStamp, direction);
      });
    });
  }
}
