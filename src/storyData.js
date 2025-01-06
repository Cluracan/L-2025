import { yesCommands, noCommands } from "./utils";

export const storyData = [
  {
    text: 'It is a very hot day. You are sitting on the grass outside a crumbling palace. Your sister is reading a book called "Fractions and the Four Rules-- 5000 Carefully Graded Problems". You are bored, and the heat is making you feel a little sleepy. \n\nSuddenly you see an old man dressed as an abbot. He glances at you nervously and slips through the palace doors to the north.',
    mapName: "Grass",
    options: {
      N: 1,
    },
  },
  {
    text: "You are in a dark hall way. At the south end is an outside door. There is another door at the north end. \n\nThe abbot is just disappearing through the door at the north end.",
    mapName: "Hallway",
    options: {
      N: 2,
      S: "blocked",
    },
    blockedText: `The outside door seems to have jammed. You can't get it open.`,

    visitedText: "You are in the hall way.",
  },
  {
    text: "You are in a room which once was a kitchen. It has quarry tiles on the floor and there is a cracked sink in one corner. There are doors to the north, south, east and west. \n\nThe east door has just swung closed.",
    mapName: "Kitchen",
    options: {
      N: 11,
      E: 3,
      S: 1,
      W: 5,
    },
    visitedText: "You are in the old kitchen",
  },
  {
    text: "You are in a large store room which has wooden shelves going up to the ceiling.",
    mapName: "Store",
    options: {
      W: 2,
      U: 4,
    },
    visitedText:
      "You are in a large store room which has wooden shelves going up to the ceiling.",

    puzzleBot: {
      puzzleId: "abbot",
      initialText: `The abbot is standing in one corner. \n\nHe asks, "Can you help me, please?".`,
      visitedText: `"Ah!", says the abbot.  Have you come back to help me?"`,
      triggerPuzzleCommands: yesCommands,
      declinePuzzleCommands: noCommands,
      turnedDownText: `The abbot sniffs sadly.`,
    },
  },
  {
    text: "You are sitting on the top shelf in the store room. The shelves are quite empty apart from a thick layer of dust and yourself.",
    mapName: "Shelf",
    options: { D: 3 },
    visitedText: "You are sitting on the top shelf in the store room.",
  },
  {
    text: "You are in a workshop with wooden benches around the walls. The room smells of machine oil and there are oily patches on the floor. Doors lead off to the south, east and west.",
    mapName: "Workshop",
    options: {
      E: 2,
      S: 6,
      W: 8,
    },
    visitedText: "You are in the workshop.",
    items: [
      {
        name: "TETRAHEDRON",
        text: "Lying on the ground is a small tetrahedron, made of solid platinum.",
        inventoryText: "A platinum tetrahedron",
        pickUpText: "tetrahedron",
      },
    ],
  },
  {
    text: "You are in a room where a huge creeper has grown through the windows and covers a large area of the room. Doors lead to the north and west",
    mapName: "Creeper",
    options: {
      N: 5,
      W: 7,
    },
    visitedText: "You are in the creeper room.",
  },
  {
    text: "You are at the south end of a narrow passage. There are several doors on the east side.",
    mapName: "Passage",
    options: {
      N: 8,
      E: 6,
    },
    visitedText: "You are at the south end of the narrow passage.",
  },
  {
    text: "You are in a narrow passage which runs from north to south. There are several doors on the east side.",
    mapName: "Passage",
    options: {
      N: 9,
      E: 5,
      S: 7,
    },
    visitedText: "You are in the middle of the narrow passage.",
  },
  {
    text: "You are at the north end of a narrow passage. There is a door ahead of you.",
    mapName: "Passage",
    options: {
      N: 10,
      S: 8,
    },
    visitedText: "You are at the north end of the narrow passage.",
  },
  {
    text: "You are in a room containing a heavy black oak chest with intricate carvings on it. There is a telephone resting on it. The only door leads to the south.",
    mapName: "Telephone",
    options: {
      S: 9,
    },
    visitedText: "You are in the telephone room.",
    triggerAutoResponseCommands: [
      "USE TELEPHONE",
      "USE PHONE",
      "GET TELEPHONE",
      "GET PHONE",
      "DIAL NUMBER",
      "RING ABBOT",
    ],
    autoResponseText: "The telephone seems to have stopped working.",
    puzzleBot: {
      puzzleId: "telephone",
      initialText: ``,
      visitedText: ``,
      triggerPuzzleCommands: [
        "USE TELEPHONE",
        "USE PHONE",
        "GET TELEPHONE",
        "DIAL NUMBER",
        "RING ABBOT",
      ],
    },
    openDoorList: [{ roomId: 10, newDirection: "D", newPointer: 26 }],
  },
  {
    text: "You are in an L-shaped room which smells of mice. Doors lead to the west, south and east.",
    mapName: "L room",
    options: {
      S: 2,
      E: 13,
      W: 12,
    },
    visitedText: "You are in the L-shaped room.",
  },
  {
    text: "You are in a large cupboard which once was used for storing linen.",
    mapName: "Cupboard",
    options: {
      E: 11,
    },
    visitedText: "You are in the large cupboard.",
    items: [
      {
        name: "CUBE",
        text: "A golden cube is lying on the ground here",
        inventoryText: "A gold cube",
        pickUpText: "gold cube",
      },
    ],
  },
  {
    text: "You are in a boiler room, full of machinery which appears to have been standing idle for some time. In one corner is a spiral staircase which goes up. On the east side, a flight of steps leads down, and to the west, there is a door.",
    mapName: "Boiler",
    options: {
      U: 17,
      D: 14,
      E: 14,
      W: 11,
    },
    visitedText: "You are in the boiler room.",
  },
  {
    text: "You are at the west end of a long passage with dark green tiles and flaky paint. You are standing at the bottom of a flight of steps.",
    mapName: "Passage",
    options: {
      U: 13,
      W: 13,
      E: 15,
    },
    visitedText: "You are at the west end of a long passage.",
  },
  {
    text: "You are at the east end of a long passage with dark green tiles and flaky paint. You are standing outside a door.",
    mapName: "Passage",
    options: {
      E: 16,
      W: 14,
    },
    visitedText: "You are at the east end of a long passage.",
  },
  {
    text: "You are in a room with two doors. To the east is a massive oak door which is many hundreds of years old.  A smaller door leads to the west.",
    mapName: "File Room",
    options: {
      W: 15,
      E: "blocked",
    },
    blockedText: `You cannot go through the oak door because it is locked.\n\nThe door has four large keyholes.`,
    visitedText:
      "You are in a room with two doors. To the east is a massive oak door which is many hundreds of years old.  A smaller door leads to the west.",
    puzzleBot: {
      puzzleId: "key",
      initialText: `On the mantlepiece there are several key blanks and a small file.`,
      triggerPuzzleCommands: [
        "FILE",
        "FILE KEY",
        "USE FILE",
        "MAKE KEY",
        "GET FILE",
        "GET KEY",
        "GET BLANK",
        "GET BLANKS",
      ],
      openDoors: true,
    },
    openDoorList: [
      { roomId: 16, newDirection: "E", newPointer: 44 },
      { roomId: 44, newDirection: "W", newPointer: 16 },
    ],
  },
  {
    text: "You are at the top of the spiral staircase above the boiler room. A door leads to the east.",
    mapName: "Stairs",
    options: { E: 18, D: 13 },
    visitedText: "",
  },
  {
    text: "You are in a large room with marble walls and floors. Four classical statues stand at the corners of an indoor swimming pool which is empty. The main door is at the east end, but there is another door leading west.",
    mapName: "Pool",
    options: { E: 19, W: 17, D: 51 },
    userInputConversions: {
      JUMP: "D",
      IN: "D",
      "ENTER POOL": "D",
      "JUMP IN POOL": "D",
    },
    visitedText: "You are in the room with the pool.",
  },
  {
    text: "You are in a lobby with orange walls. Doors lead off to the south, west, and east. A window on the north side looks down on to a shady courtyard. Something seems to be moving around down there but it is too dark to see clearly.",
    mapName: "Lobby",
    options: { E: 20, W: 18, S: "blocked" },
    blockedText: `The door is securely locked.`,
    visitedText: "You are in the orange lobby.",
  },
  {
    text: "You are in the old music room. The walls are blotched with damp and there are holes in the skirting board. A small window is open in the northwest corner of the room, obstructed by an old, battered telescope. There are doors to the east and west.\n\nIn the centre of the room is a rather battered Steinway grand piano.",
    mapName: "Music",
    options: { E: 21, W: 19 },
    visitedText: "You are in the old music room.",
    examinableItems: {
      TELESCOPE:
        'The telescope is very old, and the lens is cracked. You notice a small incription on the body. Peering closely, you can just make out the initials, "J.T". ',
    },
    triggerAutoResponseCommands: [
      "PLAY PIANO",
      "USE PIANO",
      "PLAY",
      "PLAY THE PIANO",
      "SIT STOOL",
    ],
    autoResponseText:
      "I'm afraid the mice have gnawed through all the piano strings",
    puzzleBot: {
      puzzleId: "piano",
      initialText: ``,
      triggerPuzzleCommands: [
        "PLAY PIANO",
        "PLAY",
        "PLAY THE PIANO",
        "SIT STOOL",
      ],
      rewardItems: [
        {
          name: "BOTTLE",
          text: "On the ground is  a small medicine bottle, containing a blue liquid. On the label is printed 'x 1.25'.",
          inventoryText: "A bottle labelled 'x 1.25'",
          pickUpText: "medicine bottle.",
          examineText:
            "The bottle contains a sweet-smelling blue liquid. It seems very drinkable...",
          isDrinkable: true,
          heightMultiplier: 1.25,
          drinkMessage: {
            1: "You experience a very strange sensation as if all the molecules in your body are rearranging themselves. You feel as if you are being opened up like a retractable aerial. You have grown to five-fourths of your normal size.\n\nThe bottle vanishes into thin air as you drink the last sip.",
            0.6: "You have grown a little. You are now three quarters of your original height.\n\nThe bottle has vanished.",
          },
        },
        {
          name: "PHIAL",
          text: "On the ground is a phial of pink liquid. Attached to it by a string is a card which reads 'x 0.6'.",
          inventoryText: "A phial labelled 'x 0.6'",
          pickUpText: "phial full of pink liquid.",
          examineText:
            "The phial contains a pink liquid. You take a sniff, but can't quite place the scent - it seems to be a mix of cherry-tart, custard, pineapple, roast turkey, toffee, and hot buttered toast.",
          isDrinkable: true,
          heightMultiplier: 0.6,
          drinkMessage: {
            1: "You experience a very strange sensation as if all the molecules in your body are rearranging themselves. You feel as if you are being closed up like a retractable aerial. You have shrunk to three-fifths of your normal height.\n\nThe phial vanishes into thin air as you drink the last sip.",
            1.25: "Now you are shrinking! You are now only three quarters of your original height.\n\nThe phial has vanished.",
          },
        },
      ],
    },
  },
  {
    text: "You are in the solarium. The room is flooded with sunlight and the heat is only just bearable. There are doors to the east and west. On the north side a French windows leads out on to a balcony.",
    mapName: "Solarium",
    options: { E: 22, W: 20, N: 47 },
    visitedText: "You are in the solarium",
  },
  {
    text: "You are in a room with doors to the south, west and east. An oval-shaped snooker table stands in the centre of the room. A post is fixed to the centre of the table. On one side of this post is the only pocket, and on the other side is a spot for the ball. A cue is attached to the table by a long chain.",
    mapName: "Snooker",
    options: { E: 23, W: 21, S: 40 },
    visitedText: "You are in the room with the oval snooker table.",
    puzzleBot: {
      puzzleId: "snooker",
      initialText: `A yellow ball is resting on the spot.`,
      visitedText: `The yellow ball is resting on the spot.`,
      triggerPuzzleCommands: [
        "PLAY SNOOKER",
        "GET CUE",
        "HIT BALL",
        "GET BALL",
      ],
    },
  },
  {
    text: "You are on the landing of a stone staircase, with stairs going up and down. A door leads to the west.",
    mapName: "Landing",
    options: { U: 24, W: 22, D: 43 },
    visitedText: "",
  },
  {
    text: "You are at the top of the stone staircase. There is a door on the east side.",
    mapName: "Stairs",
    options: { E: 25, D: 23 },
    visitedText: "",
  },
  {
    text: "You are in a room which has just one door leading west. Through a glass panel, below you, you can see a small theatre. Four coloured spotlights illuminate the empty stage.",
    mapName: "Lights",
    options: { W: 24 },
    visitedText: "You are in the electrician's box.",

    puzzleBot: {
      puzzleId: "lights",
      initialText: `An electrician is standing in the room with you.\n\n"Oh, please can you help me? I have to set these spotlights for this evening's reception. The Drogo Committee will appear in their different coloured costumes and I have to shine the right colours onto them or else they look awful. But one of the four switches doesn't work. Will you help?"`,
      visitedText: `"Oh, it's you again", says the electrician.  "Will you help me with these lights?"`,
      triggerPuzzleCommands: yesCommands,
      declinePuzzleCommands: noCommands,
      turnedDownText: `The electrician turns sadly back to his switches.`,
      rewardItems: [
        {
          name: "OAR",
          text: "There is a wooden oar lying here",
          inventoryText: "A wooden oar",
          pickUpText: "wooden oar",
        },
      ],
    },
  },
  {
    text: `You are in a cellar. A ladder leads up to the room above and there is a door to the north. There is a notice on the door:-\n\n\t\t\t CELLAR MAZE.\n\t\t   STRICTLY NO ADMITTANCE.\n\t\t       By order of the\n\t\t   Drogo Central Committee.`,
    mapName: "Cellar",
    options: { U: 10, N: 27 },
    visitedText: "You are by the ladder in the cellar.",
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: "blocked", E: 28, S: 26, W: "blocked" },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: "blocked", E: 29, S: 30, W: 27 },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: "blocked", E: 34, S: 31, W: 28 },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: 28, E: 31, S: "blocked", W: "blocked" },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: 29, E: 32, S: "blocked", W: 30 },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
    items: [
      {
        name: "SPHERE",
        text: "On the ground is a perfect sphere made of polished ebony",
        inventoryText: "A sphere made of ebony",
        pickUpText: "ebony sphere",
      },
    ],
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: 34, E: 36, S: 33, W: 31 },
    visitedText: ``,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: 32, E: "blocked", S: "blocked", W: "blocked" },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: 35, E: "blocked", S: 32, W: 29 },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: "blocked", E: "blocked", S: 34, W: "blocked" },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: 37, E: "blocked", S: "blocked", W: 32 },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are in the cellar maze in a square room which is lit by a dim bulb. There are doors to the north, south, east and west.`,
    mapName: "Cellar",
    options: { N: 38, E: "blocked", S: 36, W: "blocked" },
    visitedText: ``,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You are outside the palace at the bottom of a flight of stone steps. A door leads into the palace.`,
    mapName: "Cellar",
    options: { U: 39, E: "blocked", S: 37, W: "blocked" },
    visitedText: `You are at the bottom of the stone steps.`,
    blockedText: `When you open this door you find a brick wall immediately behind it.`,
  },
  {
    text: `You have entered a large courtyard paved with square slabs, many covered with moss and lichen. Some stone steps lead down to a door in the palace.`,
    mapName: "Courtyard",
    options: { D: 38 },
    visitedText: `You are in the turtle courtyard`,
    puzzleBot: {
      puzzleId: "turtle",
      initialText: `In the centre of the courtyard lies a turtle basking in a shaft of sunlight. He seems to be trying to catch your attention.  Would you like to investigate?`,
      visitedText: `The turtle is still trying to catch your attention. Will you investigate?`,
      triggerPuzzleCommands: yesCommands,
      declinePuzzleCommands: noCommands,
      turnedDownText: `The turtle looks at you imploringly.`,
      rewardItems: [
        {
          name: "KEY",
          text: "There is a small rusty key lying here",
          inventoryText: "A rusty key",
          pickUpText: "rusty key",
        },
      ],
      rewardToInventory: true,
      addOnText: "The turtle sleeps soundly in the middle of the courtyard.",
    },
  },
  {
    text: `You are in an ante-room having doors to the west and north. Over the west door is an old wooden board displaying a faded warning. It says, "Be warned that all who enter here will see nothing but codes."`,
    mapName: "Ante-room",
    options: { N: 22, W: 41 },
    visitedText: `You are in the ante-room.`,
  },
  {
    text: `You are in the code room. It is a stark, white room whose plaster walls are covered in scribblings. Doors lead east and west.`,
    mapName: "Code room",
    options: { E: 40, W: 42 },
    visitedText: `You are in the code room.`,
    items: [
      {
        name: "SPECTACLES",
        text: "A pair of frail-looking spectacles is lying at your feet.",
        inventoryText: "A frail pair of spectacles",
        pickUpText: "spectacles",
      },
    ],
  },
  {
    text: `You are in an oriental room. Paintings of bamboo and red dragons cover the walls. The only door leads to the east.`,
    mapName: "Oriental",
    options: { E: 41 },
    visitedText: `You are in the oriental room.`,
    items: [
      {
        name: "DODECAHEDRON",
        text: "Here is a dodecahedron made from an enormous diamond.",
        inventoryText: "A diamond dodecahedron",
        pickUpText: "diamond dodecahedron",
      },
    ],
  },
  {
    text: `You have entered a large kitchen. There is a delicious smell of baking. Around the walls are hung enormous metal pans and cooking utensils. In one corner is a large old-fashioned kitchen range giving out a great heat. The only way out is by the stairs.\n\nIn the middle of the room is a scrubbed table, at which sits a cook surrounded by dozens of mixing bowls.`,
    mapName: "Kitchen",
    options: { U: 23 },
    visitedText: `You are in the great kitchen.`,
    puzzleBot: {
      puzzleId: "cook",
      initialText: `The cook is sobbing bitterly but, on seeing you, manages to speak.\n\n"I'm glad to see you. I'm desperately worried. The drogos are having a croquet party, and I have to bake a special cake for their tea on the lawn. The trouble is they insist that it must be at least 25 cm high and I can't get it to rise properly. Will you help me, please?"`,
      visitedText: `"The cook looks up hopefully as you enter. "Will you help me with this cake, please?"`,
      triggerPuzzleCommands: yesCommands,
      declinePuzzleCommands: noCommands,
      turnedDownText: `The cook's sobs become more intense.`,
      rewardItems: [
        {
          name: "ICOSAHEDRON",
          text: "On the ground is an icosahedron made of polished jade.",
          inventoryText: "A jade icosahedron",
          pickUpText: "jade icosahedron",
        },
      ],
      rewardToInventory: true,
      addOnText: "The cook is fast asleep.",
    },
  },
  {
    text: `You are in a panelled room. Round the walls are seventeen panels covered by wallpaper with a repeating pattern. Each pattern uses the same basic unit, but the way in which the unit is repeated is different for each panel. Doors lead to the west and north.`,
    mapName: "Panelled",
    options: { W: "blocked", N: 45 },
    blockedText: `The west door seems to be locked from the other side.`,
    visitedText: "You are in the panelled room.",
    items: [
      {
        name: "OCTAHEDRON",
        text: "There is an octahedron made of ivory here.",
        inventoryText: "An ivory octahedron",
        pickUpText: "ivory octahedron",
      },
    ],
  },
  {
    text: "You are in the south west corner of the walled garden. Close by, hidden behind a huge ceanothus bush, is a small door leading into the palace.",
    mapName: "Garden",
    options: { S: 44, N: 46 },
    userInputConversions: { "ENTER DOOR": "S" },
    visitedText: "You are in the south west corner of the walled garden.",
  },
  {
    text: "You are in a walled garden filled with blue flowers. There are beds of delphiniums and anchusas. The air is filled with the scent of lavender and buddleia. The palace is on the south side of the garden and some stone steps lead up to a balcony. On the north side a path leads through a gap in the wall.",
    mapName: "Garden",
    options: { N: 48, S: 45, U: 47 },
    visitedText: "You are in the walled garden",
  },
  {
    text: "You are on a balcony. A faint perfume is rising from the walled garden beneath you. Some worn steps lead down to the garden and a French window leads back into the palace.",
    mapName: "Balcony",
    options: { S: 21, D: 46 },
    visitedText: "You are on the balcony.",
  },
  {
    text: `You are on a lawn which leads down to a wide river. A notice on the bank reads:--\n\n\t\t\tDANGER\n\t\t     Piranha Fish.\n\nThere are thorny hedges to the east and west. To the south there is a path through a gap in the wall.`,
    mapName: "River S",
    options: { S: 46, N: "blocked" },
    userInputConversions: { "JUMP IN RIVER": "SWIM", JUMP: "SWIM" },
    visitedText: "You are on the lawn beside the river",
    blockedText: "How are you going to cross the river?",
    items: [
      {
        name: "BATH",
        text: "An old and rusty tin bath is lying on the bank",
        pickUpFailText:
          "The bath is quite heavy. You can only drag it a few metres.",
        holes: [
          {
            hole: "triangular hole",
            filledText: "neatly fits the ",
            solidName: "TETRAHEDRON",
            solidDesc: "platinum tetrahedron",
            filled: false,
          },
          {
            hole: "rectangular hole",
            filledText: "fills the ",
            solidName: "CUBE",
            solidDesc: "gold cube",
            filled: false,
          },
          {
            hole: "large hole with five sides",
            filledText: "has plugged the ",
            solidName: "ICOSAHEDRON",
            solidDesc: "jade icosahedron",
            filled: false,
          },
          {
            hole: "square hole",
            filledText: "has filled the ",
            solidName: "OCTAHEDRON",
            solidDesc: "ivory octahedron",
            filled: false,
          },
          {
            hole: "small hole with five sides",
            filledText: "fits snugly into the ",
            solidName: "DODECAHEDRON",
            solidDesc: "diamond dodecahedron",
            filled: false,
          },
        ],
      },
    ],
  },
  {
    text: "You are on the north bank of the river which is covered in brambles. A narrow path winds to the northeast.",
    mapName: "River N",
    options: { NE: 50, S: "blocked" },
    userInputConversions: { "JUMP IN RIVER": "SWIM", JUMP: "SWIM" },
    visitedText: "You are on the north bank of the river.",
    blockedText: "How are you going to cross the river?",
    items: [
      {
        name: "BATH",
        text: "An old and rusty tin bath is lying on the bank",
        pickUpFailText:
          "The bath is quite heavy. You can only drag it a few metres.",
        holes: [
          {
            hole: "triangular hole",
            filledText: "neatly fits the ",
            solidName: "TETRAHEDRON",
            solidDesc: "platinum tetrahedron",
            filled: true,
          },
          {
            hole: "rectangular hole",
            filledText: "fills the ",
            solidName: "CUBE",
            solidDesc: "gold cube",
            filled: true,
          },
          {
            hole: "large hole with five sides",
            filledText: "has plugged the ",
            solidName: "ICOSAHEDRON",
            solidDesc: "jade icosahedron",
            filled: true,
          },
          {
            hole: "square hole",
            filledText: "has filled the ",
            solidName: "OCTAHEDRON",
            solidDesc: "ivory octahedron",
            filled: true,
          },
          {
            hole: "small hole with five sides",
            filledText: "fits snugly into the ",
            solidName: "DODECAHEDRON",
            solidDesc: "diamond dodecahedron",
            filled: true,
          },
        ],
      },
    ],
  },
  {
    text: "You are in a beautiful orchard and are surrounded by trees laden with many different kinds of fruit, some of which you have never seen before. There is a clearing in the centre of the orchard from which a path leads to the southwest.",
    mapName: "Gardener",
    options: { SW: 49 },
    visitedText: "You are in the orchard.",
    puzzleBot: {
      puzzleId: "tree",
      initialText: `A man, who looks very much like a gardener, is scratching his head and mumbling to himself about a pile of young fruit trees lying on the ground.\n\n"I have something here which you are going to need," he says. "But first you must help me. The Drogos have given me firm instructions to plant these 9 trees in the clearing so that there are 10 straight rows with three trees in each row. I can't seem to do it. Can you help me?"`,
      visitedText: `The gardener looks up as you approach. "Have you come back to help me with these trees?"`,
      triggerPuzzleCommands: yesCommands,
      declinePuzzleCommands: noCommands,
      turnedDownText: `The gardener sighs, and turns back to the clearing.`,
      rewardItems: [
        {
          name: "LADDER",
          text: "There is a rope ladder here",
          inventoryText: "A rope ladder",
          pickUpText: "rope ladder",
        },
      ],
      rewardToInventory: true,
    },
  },
  {
    text: "You are standing in the empty swimming pool. It slopes down gently towards the west. On the north side of the pool is a small hole, about 20cm square, which was once covered by a grating.",
    mapName: "In the pool",
    options: { IN: "blocked", U: 18 },
    blockedText: "You can't fit through a hole that small!",
    userInputConversions: {
      ENTER: "IN",
      "ENTER HOLE": "IN",
      OUT: "U",
      EXIT: "U",
    },
    visitedText: "You are standing in the swimming pool.",
    examinableItems: {
      HOLE: "Peering into the hole, you see a small tunnel sloping downhill. If only you could get in!",
    },
  },
  {
    text: "You are at one end of a dark tunnel littered with brick rubble. A small opening leads out into the light. The tunnel slopes downwards and is just wide enough for you to crawl along.",
    mapName: "Tunnel",
    options: { OUT: 51, D: 53 },
    visitedText: "You are at the top of the tunnel.",
  },
  {
    text: "You are at the bottom of a dark tunnel. It is quite wide here and there is just enough room to stand up. A rough hole knocked through some stonework leads out into the light.",
    mapName: "Tunnel",
    options: { U: 52, S: 54 },
    visitedText: "You are at the bottom of the tunnel.",
  },
  {
    text: "You are in a passage with granite walls and a door to the south. A rough hole has been knocked through the stonework at the north end. On one wall there is a wooden noticeboard with the words:-\n\n\t\tNO BREACH OF SECURITY\n\n\t\tIS TOO SMALL TO IGNORE.",
    mapName: "Passage",
    options: { N: 53, S: "blocked" },
    blockedText: "The door is securely locked",
    userInputConversions: {
      ENTER: "S",
      "OPEN DOOR": "S",
      "UNLOCK DOOR": "USE KEY",
    },
    visitedText: "",
    openDoorList: [{ roomId: 54, newDirection: "S", newPointer: 55 }],
  },
  {
    text: "You are at the bottom of some wooden stairs outside a door which leads north.",
    mapName: "Stairs",
    options: { U: 56, N: 54 },
    visitedText: "",
  },
  {
    text: "You are on the landing at the top of some wooden stairs. There is a door to the East here.",
    mapName: "Landing",
    options: { D: 55, E: 57 },
    visitedText: "You are at the top of the wooden stairs.",
    items: [
      {
        name: "HAIR",
        text: "A long strand of red hair is lying on the ground.",
        inventoryText: "A strand of red hair.",
        pickUpText: "strand of hair",
      },
    ],
  },
  {
    text: "You are in a large circular room beneath a glass dome. Eight identical doors lead to the north, northwest, west, southwest, south, southeast, east, and northeast.",
    mapName: "Circular",
    options: { N: 58, NW: 59, W: 56, SE: 63, NE: 66, E: 65, SW: 73, S: 74 },
    visitedText: "You are in the circular room.",
  },
  {
    text: "You have walked into a broom cupboard.",
    mapName: "Cupboard",
    options: { S: "blocked" },
    blockedText: `The guard is blocking your way`,
    visitedText: "",
    guardBot: {
      guardId: 11,
      type: "deaf",
      initialText:
        "Also in the cupboard is a Drogo Robot Guard with the number 121 emblazoned on his chest. He stands in front of the door blocking your exit.",
    },
    puzzleBot: {
      puzzleId: "calculator",
      initialText: `There is a calculator lying on the ground here.`,
      triggerPuzzleCommands: [
        "GET CALCULATOR",
        "USE CALCULATOR",
        "PRESS BUTTONS",
      ],
      openDoors: true,
    },
    openDoorList: [{ roomId: 58, newDirection: "S", newPointer: 57 }],
  },
  {
    text: "You are in a room which has been left half-decorated. The walls are painted half black and half white. Doors lead to the southeast, west, and north.",
    mapName: "Half Room",
    options: { SE: 57, W: 60, N: 61 },
    visitedText: "You are in the half-decorated room.",
  },
  {
    text: "You have passed through a large door which covers the whole of one side of a wall.\n\nYou are standing in a corridor with several other people. As the door slowly closes behind you, the corridor grows longer and longer, and more people appear. There seem to be doors to the east and west.",
    mapName: "Corridor",
    options: { E: 59, W: "blocked" },
    travelText: {
      E: "As you open the door to leave, the long corridor and all the people vanish!",
    },
    blockedText:
      "As you move, everyone else in the corridor moves too. Before you are half way to the west door, you bump into a cold flat surface which is impossible to pass.",
    visitedText:
      "You have passed thourh a large door which covers the whole of one side of a wall.\n\nYou seem to be standing in a very long corridor with dozens of other people.",
  },
  {
    text: "You are in a cramped space like a chimney. A metal ladder disappears up int the darkness. A wooden door leads south.",
    mapName: "Ladder",
    options: { S: 59, U: 62 },
    visitedText: "You are at the bottom of the metal ladder.",
  },
  {
    text: "It is completely dark. You have reached the top of the ladder. There seems to be a trap door above you.",
    mapName: "Ladder",
    options: { D: 61, U: 70 },
    visitedText: "You are at the top of the metal ladder.",
  },
  {
    text: "You have entered a grim room with a triangular floor and three slanting triangular walls which meet at a point ghigh above you. Doors in each wall lead off to the south, northeast, and northwest. Hundreds of bats are hanging from the slanting walls.",
    mapName: "Triangle",
    options: { NW: "blocked", S: "blocked", N: "blocked" },
    blockedText:
      "As you move towards the door, hundreds of bats swarm around it making it impossible for you to go through.",
    visitedText: "You are in the triangular room.",
    guardBot: {
      type: "bat",
      initialText:
        'One especially large bat is eyeing you suspiciously.\n\n"If you want to get out of this room, give me a nice number between 30 and 90," says the large bat threateningly.',
      openDoors: true,
      addOnText: "The large bat ignores you.",
    },
    openDoorList: [
      { roomId: 63, newDirection: "NW", newPointer: 57 },
      { roomId: 63, newDirection: "N", newPointer: 65 },
      { roomId: 63, newDirection: "S", newPointer: 64 },
    ],
  },
  {
    text: "You are in a room painted a dark shade of blue. Silver stars cover the high ceiling like the night sky. The only door leads north.",
    mapName: "Blue room",
    options: { N: 63 },
    visitedText: "You are in the blue room.",
    items: [
      {
        name: "TICKET",
        text: "An old bus ticket is lying on the ground. It seems to have something written on it.",
        inventoryText: "An old bus ticket.",
        pickUpText: "bus ticket",
        examineText:
          "On the back of the bus ticket is written in spdery handwriting:-\n\nTHE COMBINATION IS A PERFECT SQUARE AND A PERFECT CUBE",
      },
    ],
  },
  {
    text: "You are in a room with six walls. Doors lead to the west and south. On the east wall is a brass plaque engraved with:-\n\n\t\t\t?@3+>*=@\n\t\t\t+33./",
    mapName: "Hexagon",
    options: { W: 57, S: 63 },
    visitedText: "You are in the room with six walls.",
  },
  {
    text: "You have entered a room with a stone floor. In the north wall is the large door of a safe, with a numerical keypad fixed to it. There is a door to the southwest.",
    mapName: "Safe",
    options: { N: "blocked", SW: 57 },
    blockedText: "The door is securely locked.",
    visitedText: "You are in the room with the safe",
    guardBot: {
      guardId: 4096,
      type: "safe",
      initialText: "The door of the safe is locked.",
      openDoors: true,
      addOnText: "The door of the safe is open.",
    },
    openDoorList: [{ roomId: 66, newDirection: "N", newPointer: 67 }],
  },
  {
    text: "You are at the south end of a passage, just inside the safe door. The passage has a strange soft appearance because the floor, walls, and ceiling are completely covered in a deep blue carpet.",
    mapName: "Passage S",
    options: { S: 66, N: 68 },
    visitedText: "You are at the south end of the soft passage.",
  },
  {
    text: "You are at the north end of the soft passage outside a wooden door.",
    mapName: "Passage N",
    options: { S: 67, N: 69 },
    visitedText: "",
  },
  {
    text: "You are in a square room which is full of cobwebs. The only door leads south.",
    mapName: "Spider",
    options: { S: 68 },
    visitedText: "You are in the spider room.",
    puzzleBot: {
      puzzleId: "spider",
      initialText: `A huge black spider is hanging by a thread from the ceiling.\n\nThe spider says, "I have something here that may help you, but though Drogos have made it invisible. Would you like me to help you?"`,
      visitedText: `The spider looks up as you approach. "Would you like me to help you?"`,
      triggerPuzzleCommands: yesCommands,
      declinePuzzleCommands: noCommands,
      turnedDownText: `"Very well," says the spider.`,
      rewardItems: [
        {
          name: "RING",
          text: "A gold ring glistens on the ground",
          inventoryText: "A gold ring",
          pickUpText: "gold ring",
          examineText:
            "You sense that the ring holds huge magical powers. It feels strangely heavy in your hand.",
        },
      ],
    },
  },
  {
    text: 'You are in a tiny attic room with no furniture. A small arched window looks down on to an orchard. There are bars across the window. It is very quiet.\n\nA previous occupant of the room has scratched some numbers on one of the walls:- "121, 49, 196, 25, 64."',
    mapName: "Attic",
    options: { E: "blocked" },
    blockedText: "The door is securely locked.",
    visitedText: "You are in an attic room.",
    openDoorList: [{ roomId: 70, newDirection: "E", newPointer: 71 }],
  },
  {
    text: "You are in an attic passage with doors at the east and west ends. There is a faint smell of stale kippers. Paint is peeling from the walls.",
    mapName: "Passage",
    options: { W: 70, E: 72 },
    visitedText: "You are in the attic passage",
  },
  {
    text: "You are in a green room with a single door to the west. A large chandelier hangs from the ceiling and there are pieces of straw on the floor.",
    mapName: "Pig",
    options: { W: 71 },
    visitedText: "You are in the green room.",
    puzzleBot: {
      puzzleId: "pig",
      initialText: `A large pig is staring at you. It has a piece of paper attached to its collar.`,
      triggerPuzzleCommands: [
        "GET PIG",
        "CATCH PIG",
        "READ PAPER",
        "GET PAPER",
        "EXAMINE PAPER",
      ],
      addOnText:
        "The pig is sitting placidly in the centre of the room. On a piece of paper attached to its collar, you can read a single word of text:- NEUMANN",
    },
  },
  {
    text: "You are in a room with grey walls and grey carpet tiles. A series of flourescent tubes provide stark lighting along with a low buzzing sound. There is a door to the northeast.",
    mapName: "Computer",
    options: { NE: 57 },
    visitedText: "You are in the computer room.",
    puzzleBot: {
      puzzleId: "computer",
      initialText:
        '\nAs you enter the room a disappearing voice says,\n\n\n"Listen, OK, I\'m going to the toilet, OK."\n\n\n"Don\'t touch my computer, OK?"\n\n\n"This game is OK."\n\n\nThere is a computer resting on a large wooden bench.',
      triggerPuzzleCommands: ["USE COMPUTER"],
    },
  },
  {
    text: "You are in a narrow passage running from north to south. The south door is ajar, and through the crack you can see about a dozen Drogo Robot Guards.",
    mapName: "Passage",
    options: { N: 57, S: 75 },
    visitedText: "",
  },
  {
    text: "You are in a shabby room decorated with posters. Against one wall are racks of electronic equipment studded with glowing coloured lights. There are doors to the north and west. About a dozen Drogo Robot Guards are in an untidy line, beneath a huge poster of a middle-aged lady who is smiling resolutely.",
    mapName: "Guards",
    options: { N: 74, W: 76 },
    visitedText: "",
  },
  {
    text: "You are in a sparsely furnished cell. A window is open, but it is too high for you to jump and there is no way to climb down.\n\nA girl with red hair is sitting in one corner.",
    mapName: "Cell",
    options: { E: 75 },
    visitedText: "",
  },
  {
    text: "You gaze around the countryside, thinking over your adventure. There is still so much to discover: What has happened to the abbot? Who are the Drogos? And what did Runia discover about them? What is in the Kempis room? And what is the meaning of the strange symbols on the pendant which Runa wears around her neck?\n\nBut I am afraid I cannot help you answer thse questions. This adventure is over, and what remains is for your imagination.\n\n\nGoodbye.",
    mapName: "Countryside",
    options: {},
    visitedText: "",
  },
];
/**
{
    text: "",
    options: { },
    visitedText: ""
},
*/
