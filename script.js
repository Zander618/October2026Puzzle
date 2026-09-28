const questions = [
  {
    number: 1,
    text: "With the bears and the elephant, full of wonder what will he discover?"
  },
  {
    number: 2,
    text: "There are many where you lie down. One is not the same inside is the answer."
  },
  {
    number: 3,
    text: "Find em weekend: How many rats are there?"
  },
  {
    number: 4,
    text: "Find em weekend: How many ghosts are there?"
  },
  {
    number: 5,
    type: "maze",
    text: "Monday mini game"
  },
  {
    number: 6,
    text: "Trivia Tuesday: Who is the demon in The Exorcist?"
  },
  {
    number: 7,
    text: "Wednesday word scramble: Serial Killer = bedunytd"
  },
  {
    number: 8,
    text: "Who are the ghosts calling out to?"
  },
  {
    number: 9,
    text: "We all live together. Some eat meat, some don’t. Ignoring the ones that talk, I’m not like the others."
  },
  {
    number: 10,
    text: "Find em weekend: How many brains are there?"
  },
  {
    number: 11,
    text: "Find em weekend: How many skulls are there?"
  },
  {
    number: 12,
    type: "maze",
    text: "Monday mini game"
  },
  {
    number: 13,
    text: "Trivia Tuesday: The book being read and quoted in It Follows?"
  },
  {
    number: 14,
    text: "Wednesday word scramble: Slasher = xetascainhwaaassmacre"
  },
  {
    number: 15,
    text: "Usain Bolt, Jesse Owens, Steve Prefontaine?"
  },
  {
    number: 16,
    text: "Who are the skulls calling out to?"
  },
  {
    number: 17,
    text: "Find em weekend: How many eyes are there?"
  },
  {
    number: 18,
    text: "Find em weekend: How many fingers are there?"
  },
  {
    number: 19,
    type: "maze",
    text: "Monday mini game"
  },
  {
    number: 20,
    text: "Trivia Tuesday: Stay out of room ____ ?"
  },
  {
    number: 21,
    text: "Wednesday word scramble: 80s demons = Ceetsnobi"
  },
  {
    number: 22,
    text: "Unearth the mystery of the red stone"
  },
  {
    number: 23,
    text: "One is not like the others under my many arms that have grown since I left my house of food. The color?"
  },
  {
    number: 24,
    text: "Find em weekend: How many snakes are there?"
  },
  {
    number: 25,
    text: "Find em weekend: How many skeletons are there?"
  },
  {
    number: 26,
    type: "maze",
    text: "Monday mini game"
  },
  {
    number: 27,
    text: "Trivia Tuesday: The book of the dead?"
  },
  {
    number: 28,
    text: "Word scramble: Comedy = Dmegastha"
  },
  {
    number: 29,
    text: "Word scramble: 90s horror = Tfeahultcy"
  },
  {
    number: 30,
    text: "Word scramble (letters can be reused): Campy Horror Movie = dieveadalv"
  }
];

const questionsContainer =
  document.querySelector("#questions");

const quizForm =
  document.querySelector("#quiz-form");

const result =
  document.querySelector("#result");

const progressDisplay =
  document.querySelector("#progress");

const STORAGE_KEY =
  "october-puzzle-2026";

let activeMaze = null;

const mazeGames = new Map();

/* ================================
   SAVED PROGRESS
================================ */

function loadProgress() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        answers: {},
        mazes: {}
      };
    }

    return JSON.parse(saved);
  } catch {
    return {
      answers: {},
      mazes: {}
    };
  }
}

const progress = loadProgress();

progress.answers ??= {};
progress.mazes ??= {};

function saveProgress() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(progress)
  );

  updateProgressDisplay();
}

function updateProgressDisplay() {
  let completed = 0;

  questions.forEach((question) => {

    if (question.type === "maze") {
      if (progress.mazes[question.number]) {
        completed++;
      }

      return;
    }

    const answer =
      progress.answers[question.number];

    if (answer && answer.trim()) {
      completed++;
    }
  });

  progressDisplay.textContent =
    `${completed} / ${questions.length} completed`;
}

/* ================================
   RENDER QUESTIONS
================================ */

questions.forEach((question) => {

  if (question.type === "maze") {
    renderMazeQuestion(question);
  } else {
    renderTextQuestion(question);
  }

});

function renderTextQuestion(question) {

  const section =
    document.createElement("section");

  section.className =
    "question";

  const label =
    document.createElement("label");

  label.htmlFor =
    `question-${question.number}`;

  const number =
    document.createElement("span");

  number.className =
    "question-number";

  number.textContent =
    String(question.number)
      .padStart(2, "0");

  label.appendChild(number);

  label.appendChild(
    document.createTextNode(question.text)
  );

  const input =
    document.createElement("input");

  input.type = "text";

  input.id =
    `question-${question.number}`;

  input.name =
    `question${question.number}`;

  input.placeholder =
    "Enter your answer";

  input.autocomplete =
    "off";

  input.value =
    progress.answers[question.number] ?? "";

  input.addEventListener(
    "input",
    () => {
      progress.answers[question.number] =
        input.value;

      saveProgress();
    }
  );

  section.appendChild(label);

  section.appendChild(input);

  questionsContainer.appendChild(section);
}

/* ================================
   MAZE QUESTION
================================ */

function renderMazeQuestion(question) {

  const section =
    document.createElement("section");

  section.className =
    "question maze-question";

  const title =
    document.createElement("div");

  title.className =
    "question-title";

  const number =
    document.createElement("span");

  number.className =
    "question-number";

  number.textContent =
    String(question.number)
      .padStart(2, "0");

  title.appendChild(number);

  title.appendChild(
    document.createTextNode(question.text)
  );

  const instructions =
    document.createElement("p");

  instructions.className =
    "maze-instructions";

  instructions.textContent =
    "Guide the pumpkin pixel to the ghost. Use the arrow keys, WASD, or the buttons below.";

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "maze-wrapper";

  const canvas =
    document.createElement("canvas");

  canvas.className =
    "maze-canvas";

  canvas.width = 330;
  canvas.height = 330;

  canvas.tabIndex = 0;

  wrapper.appendChild(canvas);

  const controls =
    document.createElement("div");

  controls.className =
    "maze-controls";

  const controlInfo = [
    {
      direction: "up",
      symbol: "▲"
    },
    {
      direction: "left",
      symbol: "◀"
    },
    {
      direction: "down",
      symbol: "▼"
    },
    {
      direction: "right",
      symbol: "▶"
    }
  ];

  controlInfo.forEach(
    ({ direction, symbol }) => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        `maze-control ${direction}`;

      button.textContent =
        symbol;

      button.setAttribute(
        "aria-label",
        direction
      );

      button.addEventListener(
        "click",
        () => {
          setActiveMaze(question.number);

          moveMazePlayer(
            question.number,
            direction
          );
        }
      );

      controls.appendChild(button);
    }
  );

  const status =
    document.createElement("p");

  status.className =
    "maze-status";

  status.textContent =
    "Click the maze to activate it.";

  section.appendChild(title);

  section.appendChild(instructions);

  section.appendChild(wrapper);

  section.appendChild(controls);

  section.appendChild(status);

  questionsContainer.appendChild(section);

  const game =
    createMaze(
      question.number,
      canvas,
      status
    );

  mazeGames.set(
    question.number,
    game
  );

  canvas.addEventListener(
    "click",
    () => {
      setActiveMaze(question.number);

      canvas.focus();
    }
  );
}

/* ================================
   SEEDED RANDOM NUMBER GENERATOR

   This makes each Monday's maze
   different, while keeping that
   particular maze the same after
   a page refresh.
================================ */

function seededRandom(seed) {

  let value = seed >>> 0;

  return function () {

    value += 0x6D2B79F5;

    let t = value;

    t =
      Math.imul(
        t ^ (t >>> 15),
        t | 1
      );

    t ^=
      t +
      Math.imul(
        t ^ (t >>> 7),
        t | 61
      );

    return (
      (
        t ^
        (t >>> 14)
      ) >>> 0
    ) / 4294967296;
  };
}

/* ================================
   GENERATE MAZE
================================ */

function generateMaze(
  columns,
  rows,
  seed
) {

  const random =
    seededRandom(seed);

  const grid =
    Array.from(
      { length: rows },
      () =>
        Array(columns).fill(1)
    );

  const stack =
    [[1, 1]];

  grid[1][1] = 0;

  const directions = [
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0]
  ];

  while (stack.length) {

    const current =
      stack[
        stack.length - 1
      ];

    const [x, y] =
      current;

    const shuffled =
      [...directions]
        .sort(
          () =>
            random() - 0.5
        );

    let carved =
      false;

    for (
      const [dx, dy]
      of shuffled
    ) {

      const nextX =
        x + dx;

      const nextY =
        y + dy;

      if (
        nextX <= 0 ||
        nextY <= 0 ||
        nextX >= columns - 1 ||
        nextY >= rows - 1
      ) {
        continue;
      }

      if (
        grid[nextY][nextX] === 0
      ) {
        continue;
      }

      grid[
        y + dy / 2
      ][
        x + dx / 2
      ] = 0;

      grid[nextY][nextX] =
        0;

      stack.push(
        [nextX, nextY]
      );

      carved =
        true;

      break;
    }

    if (!carved) {
      stack.pop();
    }
  }

  return grid;
}

/* ================================
   CREATE GAME
================================ */

function createMaze(
  questionNumber,
  canvas,
  status
) {

  const columns = 15;
  const rows = 15;

  const cellSize =
    canvas.width / columns;

  /*
    Different seed for each Monday.
  */

  const seed =
    20261000 +
    questionNumber * 731;

  const grid =
    generateMaze(
      columns,
      rows,
      seed
    );

  const completed =
    Boolean(
      progress.mazes[
        questionNumber
      ]
    );

  const game = {
    questionNumber,
    canvas,
    status,
    grid,
    columns,
    rows,
    cellSize,

    player: completed
      ? {
          x: columns - 2,
          y: rows - 2
        }
      : {
          x: 1,
          y: 1
        },

    exit: {
      x: columns - 2,
      y: rows - 2
    },

    completed
  };

  if (completed) {

    status.textContent =
      "Escaped! 🎃";

    status.classList.add(
      "completed"
    );
  }

  drawMaze(game);

  return game;
}

/* ================================
   DRAW MAZE
================================ */

function drawMaze(game) {

  const {
    canvas,
    grid,
    rows,
    columns,
    cellSize,
    player,
    exit
  } = game;

  const ctx =
    canvas.getContext("2d");

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /*
    Background
  */

  ctx.fillStyle =
    "#09060b";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /*
    Maze
  */

  for (
    let y = 0;
    y < rows;
    y++
  ) {

    for (
      let x = 0;
      x < columns;
      x++
    ) {

      if (
        grid[y][x] === 1
      ) {

        ctx.fillStyle =
          "#382640";

        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );

        ctx.fillStyle =
          "#442f4d";

        ctx.fillRect(
          x * cellSize + 3,
          y * cellSize + 3,
          cellSize - 6,
          cellSize - 6
        );

      } else {

        ctx.fillStyle =
          "#100c13";

        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }

  drawGhost(
    ctx,
    exit.x,
    exit.y,
    cellSize
  );

  drawPumpkin(
    ctx,
    player.x,
    player.y,
    cellSize
  );
}

/* ================================
   PIXEL PUMPKIN
================================ */

function drawPumpkin(
  ctx,
  x,
  y,
  size
) {

  const left =
    x * size;

  const top =
    y * size;

  ctx.fillStyle =
    "#ff7518";

  ctx.fillRect(
    left + size * 0.2,
    top + size * 0.28,
    size * 0.6,
    size * 0.55
  );

  ctx.fillRect(
    left + size * 0.12,
    top + size * 0.38,
    size * 0.76,
    size * 0.35
  );

  /*
    Stem
  */

  ctx.fillStyle =
    "#65a653";

  ctx.fillRect(
    left + size * 0.43,
    top + size * 0.12,
    size * 0.16,
    size * 0.2
  );

  /*
    Eyes
  */

  ctx.fillStyle =
    "#27130a";

  ctx.fillRect(
    left + size * 0.28,
    top + size * 0.44,
    size * 0.1,
    size * 0.1
  );

  ctx.fillRect(
    left + size * 0.62,
    top + size * 0.44,
    size * 0.1,
    size * 0.1
  );
}

/* ================================
   PIXEL GHOST EXIT
================================ */

function drawGhost(
  ctx,
  x,
  y,
  size
) {

  const left =
    x * size;

  const top =
    y * size;

  ctx.fillStyle =
    "#f4eee6";

  ctx.fillRect(
    left + size * 0.25,
    top + size * 0.25,
    size * 0.5,
    size * 0.6
  );

  ctx.fillRect(
    left + size * 0.17,
    top + size * 0.38,
    size * 0.66,
    size * 0.3
  );

  ctx.fillStyle =
    "#171119";

  ctx.fillRect(
    left + size * 0.33,
    top + size * 0.43,
    size * 0.1,
    size * 0.12
  );

  ctx.fillRect(
    left + size * 0.58,
    top + size * 0.43,
    size * 0.1,
    size * 0.12
  );
}

/* ================================
   ACTIVE MAZE
================================ */

function setActiveMaze(
  questionNumber
) {

  activeMaze =
    questionNumber;

  mazeGames.forEach(
    (game, number) => {

      game.canvas
        .classList
        .toggle(
          "active",
          number ===
            questionNumber
        );

    }
  );
}

/* ================================
   MOVE PLAYER
================================ */

function moveMazePlayer(
  questionNumber,
  direction
) {

  const game =
    mazeGames.get(
      questionNumber
    );

  if (
    !game ||
    game.completed
  ) {
    return;
  }

  const moves = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  };

  const [
    dx,
    dy
  ] = moves[direction];

  const newX =
    game.player.x + dx;

  const newY =
    game.player.y + dy;

  if (
    game.grid[newY]?.[newX]
    !== 0
  ) {
    return;
  }

  game.player.x =
    newX;

  game.player.y =
    newY;

  if (
    newX === game.exit.x &&
    newY === game.exit.y
  ) {

    game.completed =
      true;

    progress.mazes[
      questionNumber
    ] = true;

    game.status.textContent =
      "Escaped! 🎃";

    game.status
      .classList
      .add("completed");

    saveProgress();
  }

  drawMaze(game);
}

/* ================================
   KEYBOARD CONTROLS
================================ */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      activeMaze === null
    ) {
      return;
    }

    const keyMap = {
      ArrowUp: "up",
      w: "up",
      W: "up",

      ArrowDown: "down",
      s: "down",
      S: "down",

      ArrowLeft: "left",
      a: "left",
      A: "left",

      ArrowRight: "right",
      d: "right",
      D: "right"
    };

    const direction =
      keyMap[event.key];

    if (!direction) {
      return;
    }

    event.preventDefault();

    moveMazePlayer(
      activeMaze,
      direction
    );
  }
);

/* ================================
   FORM
================================ */

quizForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    saveProgress();

    result.textContent =
      "Your progress has been saved on this device. 🎃";
  }
);

updateProgressDisplay();