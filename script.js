const questions = [
  { number: 1, text: "With the bears and the elephant, full of wonder what will he discover?" },
  { number: 2, text: "There are many where you lie down. One is not the same. Turn me around. What are those?" },
  { number: 3, text: "Find em weekend: How many rats are there?" },
  { number: 4, text: "Find em weekend: How many ghosts are there? (Kitchen Only)" },
  { number: 5, type: "maze", text: "Monday mini game" },
  { number: 6, text: "Trivia Tuesday: Who is the demon in The Exorcist?" },
  { number: 7, text: "Wednesday word scramble: Serial Killer = bedunytd" },
  { number: 8, text: "Who are the ghosts calling out to?" },
  { number: 9, text: "We all live together. Some eat meat, some don’t. Ignoring the ones that talk, I’m not like the others." },
  { number: 10, text: "Find em weekend: How many brains are there?" },
  { number: 11, text: "Find em weekend: How many skulls are there?" },
  { number: 12, type: "snake", text: "Monday mini game" },
  { number: 13, text: "Trivia Tuesday: The book being read and quoted in It Follows?" },
  { number: 14, text: "Wednesday word scramble: Slasher = xetascainhwaaassmacre" },
  { number: 15, text: "Usain Bolt, Jesse Owens, Steve Prefontaine?" },
  { number: 16, text: "Who are the skulls calling out to?" },
  { number: 17, text: "Find em weekend: How many eyes are there?" },
  { number: 18, text: "Find em weekend: How many fingers are there?" },
  { number: 19, type: "pacman", text: "Monday mini game" },
  { number: 20, text: "Trivia Tuesday: Stay out of room ____ ?" },
  { number: 21, text: "Wednesday word scramble: 80s demons = Ceetsnobi" },
  { number: 22, text: "One is not like the others under my many arms that have grown since I left my house of food. The color?" },
  { number: 23, text: "Unearth the mystery of the red stone" },
  { number: 24, text: "Find em weekend: How many snakes are there?" },
  { number: 25, text: "Find em weekend: How many skeletons are there?" },
  { number: 26, type: "maze", text: "Monday mini game" },
  { number: 27, text: "Trivia Tuesday: The book of the dead?" },
  { number: 28, text: "Word scramble: Comedy = Dmegastha" },
  { number: 29, text: "Word scramble: 90s horror = Tfeahultcy" },
  { number: 30, text: "Word scramble (letters can be reused): Campy Horror Movie = dieveadalv" }
];

const correctAnswers = {
  1: ["Elmo"],
  2: ["Initials"],
  3: ["10", "ten"],
  4: ["15", "fifteen"],

  // 5 = maze

  6: ["Pazuzu"],
  7: ["Ted Bundy"],
  8: ["Me", "Hayley"],
  9: ["Dimetrodon"],
  10: ["5", "five"],
  11: ["12", "twelve"],

  // 12 = snake

  13: ["The Idiot"],
  14: ["Texas Chain Saw Massacre"],
  15: ["Purple"],
  16: ["Dorian Sirna"],
  17: ["5", "five"],
  18: ["5", "five"],

  // 19 = Zofran chase

  20: ["237"],
  21: ["Cenobites"],
  22: ["Red"],
  23: ["Big Head"],
  24: ["4", "four"],
  25: ["12", "twelve"],

  // 26 = maze

  27: ["Necronomicon"],
  28: ["Deathgasm"],
  29: ["The Faculty"],
  30: ["Dead Alive", "Evil Dead"]
};

function normalizeAnswer(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "");
}

function isAnswerCorrect(questionNumber, userAnswer) {
  const acceptedAnswers =
    correctAnswers[questionNumber];

  if (!acceptedAnswers) {
    return false;
  }

  const normalizedUserAnswer =
    normalizeAnswer(userAnswer);

  return acceptedAnswers.some(
    (answer) =>
      normalizeAnswer(answer) ===
      normalizedUserAnswer
  );
}

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

const PUZZLE_YEAR = 2026;
const PUZZLE_MONTH = 9;

let activeMaze = null;
let activeSnakeGame = null;
let activePacmanGame = null;

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

const progress =
  loadProgress();

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

  const completed =
    questions.filter(
      (question) =>
        isQuestionComplete(question)
    ).length;

  progressDisplay.textContent =
    `${completed} / ${questions.length} completed`;
}

/* ================================
   QUESTION GATING
================================ */

function hasQuestionDateArrived(
  questionNumber
) {

  const now =
    new Date();

  const unlockDate =
    new Date(
      PUZZLE_YEAR,
      PUZZLE_MONTH,
      questionNumber,
      0,
      0,
      0
    );

  return now >= unlockDate;
}

function isMiniGame(question) {

  return (
    question.type === "maze" ||
    question.type === "snake" ||
    question.type === "pacman"
  );
}

function isQuestionComplete(question) {

  if (isMiniGame(question)) {

    return Boolean(
      progress.mazes[
        question.number
      ]
    );
  }

  const answer =
    progress.answers[
      question.number
    ] ?? "";

  return isAnswerCorrect(
    question.number,
    answer
  );
}

function canShowQuestion(question) {

  if (
    !hasQuestionDateArrived(
      question.number
    )
  ) {
    return false;
  }

  if (question.number === 1) {
    return true;
  }

  const previousQuestion =
    questions.find(
      (item) =>
        item.number ===
        question.number - 1
    );

  return Boolean(
    previousQuestion &&
    isQuestionComplete(
      previousQuestion
    )
  );
}

function revealNextQuestionIfAllowed(
  questionNumber,
  delay = 0
) {

  const nextQuestion =
    questions.find(
      (item) =>
        item.number ===
        questionNumber + 1
    );

  if (
    nextQuestion &&
    hasQuestionDateArrived(
      nextQuestion.number
    )
  ) {

    if (delay > 0) {

      setTimeout(
        renderAvailableQuestions,
        delay
      );

    } else {

      renderAvailableQuestions();
    }
  }
}

/* ================================
   RENDER QUESTIONS
================================ */

function stopRunningMiniGames() {

  if (
    activeSnakeGame?.timer
  ) {
    clearInterval(
      activeSnakeGame.timer
    );
  }

  if (
    activePacmanGame?.timer
  ) {
    clearInterval(
      activePacmanGame.timer
    );
  }

  activeSnakeGame = null;
  activePacmanGame = null;
}

function renderAvailableQuestions() {

  stopRunningMiniGames();

  questionsContainer.innerHTML =
    "";

  mazeGames.clear();

  activeMaze = null;

  for (
    const question
    of questions
  ) {

    if (
      !canShowQuestion(question)
    ) {
      break;
    }

    if (
      question.type === "maze"
    ) {

      renderMazeQuestion(
        question
      );

    } else if (
      question.type === "snake"
    ) {

      renderSnakeQuestion(
        question
      );

    } else if (
      question.type === "pacman"
    ) {

      renderPacmanQuestion(
        question
      );

    } else {

      renderTextQuestion(
        question
      );
    }
  }

  updateProgressDisplay();
}

function renderTextQuestion(
  question
) {

  const section =
    document.createElement(
      "section"
    );

  section.className =
    "question";

  const label =
    document.createElement(
      "label"
    );

  label.htmlFor =
    `question-${question.number}`;

  const number =
    document.createElement(
      "span"
    );

  number.className =
    "question-number";

  number.textContent =
    String(
      question.number
    ).padStart(
      2,
      "0"
    );

  label.appendChild(
    number
  );

  label.appendChild(
    document.createTextNode(
      question.text
    )
  );

  const input =
    document.createElement(
      "input"
    );

  input.type =
    "text";

  input.id =
    `question-${question.number}`;

  input.name =
    `question${question.number}`;

  input.placeholder =
    "Enter your answer";

  input.autocomplete =
    "off";

  input.value =
    progress.answers[
      question.number
    ] ?? "";

  const feedback =
    document.createElement(
      "p"
    );

  feedback.className =
    "answer-feedback";

  input.addEventListener(
    "input",
    () => {

      progress.answers[
        question.number
      ] =
        input.value;

      saveProgress();

      if (
        isAnswerCorrect(
          question.number,
          input.value
        )
      ) {

        revealNextQuestionIfAllowed(
          question.number
        );
      }
    }
  );

  section.appendChild(
    label
  );

  section.appendChild(
    input
  );

  section.appendChild(
    feedback
  );

  questionsContainer.appendChild(
    section
  );
}

/* ================================
   MAZE MINI GAME
================================ */

function renderMazeQuestion(
  question
) {

  const section =
    document.createElement(
      "section"
    );

  section.className =
    "question maze-question";

  const title =
    document.createElement(
      "div"
    );

  title.className =
    "question-title";

  const number =
    document.createElement(
      "span"
    );

  number.className =
    "question-number";

  number.textContent =
    String(
      question.number
    ).padStart(
      2,
      "0"
    );

  title.appendChild(
    number
  );

  title.appendChild(
    document.createTextNode(
      question.text
    )
  );

  const instructions =
    document.createElement(
      "p"
    );

  instructions.className =
    "maze-instructions";

  instructions.textContent =
    "Guide the pumpkin pixel to the ghost. Use the buttons below.";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "maze-wrapper";

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.className =
    "maze-canvas";

  if (
    question.number === 5
  ) {

    canvas.width =
      420;

    canvas.height =
      420;

    canvas.classList.add(
      "first-maze"
    );

  } else {

    canvas.width =
      330;

    canvas.height =
      330;
  }

  canvas.tabIndex =
    0;

  wrapper.appendChild(
    canvas
  );

  const controls =
    createDirectionControls(
      (direction) => {

        activeSnakeGame =
          null;

        activePacmanGame =
          null;

        setActiveMaze(
          question.number
        );

        moveMazePlayer(
          question.number,
          direction
        );

        canvas.focus();
      }
    );

  const status =
    document.createElement(
      "p"
    );

  status.className =
    "maze-status";

  status.textContent =
    "Click the maze to activate keyboard controls.";

  section.appendChild(
    title
  );

  section.appendChild(
    instructions
  );

  section.appendChild(
    wrapper
  );

  section.appendChild(
    controls
  );

  section.appendChild(
    status
  );

  questionsContainer.appendChild(
    section
  );

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

      activeSnakeGame =
        null;

      activePacmanGame =
        null;

      setActiveMaze(
        question.number
      );

      canvas.focus();
    }
  );
}

function seededRandom(seed) {

  let value =
    seed >>> 0;

  return function () {

    value +=
      0x6D2B79F5;

    let t =
      value;

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

function generateMaze(
  columns,
  rows,
  seed
) {

  const random =
    seededRandom(
      seed
    );

  const grid =
    Array.from(
      {
        length: rows
      },
      () =>
        Array(
          columns
        ).fill(1)
    );

  const stack =
    [[1, 1]];

  grid[1][1] =
    0;

  const directions = [
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0]
  ];

  while (
    stack.length
  ) {

    const [x, y] =
      stack[
        stack.length - 1
      ];

    const shuffled =
      [...directions].sort(
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
        nextX >=
          columns - 1 ||
        nextY >=
          rows - 1
      ) {
        continue;
      }

      if (
        grid[
          nextY
        ][
          nextX
        ] === 0
      ) {
        continue;
      }

      grid[
        y + dy / 2
      ][
        x + dx / 2
      ] = 0;

      grid[
        nextY
      ][
        nextX
      ] = 0;

      stack.push(
        [
          nextX,
          nextY
        ]
      );

      carved =
        true;

      break;
    }

    if (
      !carved
    ) {
      stack.pop();
    }
  }

  return grid;
}

function createMaze(
  questionNumber,
  canvas,
  status
) {

  const columns =
    questionNumber === 5
      ? 21
      : 15;

  const rows =
    questionNumber === 5
      ? 21
      : 15;

  const cellSize =
    canvas.width /
    columns;

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

    player:
      completed
        ? {
            x:
              columns - 2,
            y:
              rows - 2
          }
        : {
            x: 1,
            y: 1
          },

    exit: {
      x:
        columns - 2,
      y:
        rows - 2
    },

    completed
  };

  if (
    completed
  ) {

    status.textContent =
      "Escaped! 🎃";

    status.classList.add(
      "completed"
    );
  }

  drawMaze(
    game
  );

  return game;
}

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
    canvas.getContext(
      "2d"
    );

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle =
    "#09060b";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

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

  ctx.fillStyle =
    "#65a653";

  ctx.fillRect(
    left + size * 0.43,
    top + size * 0.12,
    size * 0.16,
    size * 0.2
  );

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

function setActiveMaze(
  questionNumber
) {

  activeMaze =
    questionNumber;

  mazeGames.forEach(
    (
      game,
      number
    ) => {

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
  ] =
    moves[
      direction
    ];

  const newX =
    game.player.x +
    dx;

  const newY =
    game.player.y +
    dy;

  if (
    game.grid[
      newY
    ]?.[
      newX
    ] !== 0
  ) {
    return;
  }

  game.player.x =
    newX;

  game.player.y =
    newY;

  if (
    newX ===
      game.exit.x &&
    newY ===
      game.exit.y
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
      .add(
        "completed"
      );

    saveProgress();

    revealNextQuestionIfAllowed(
      questionNumber,
      600
    );
  }

  drawMaze(
    game
  );
}

/* ================================
   SHARED DIRECTION BUTTONS
================================ */

function createDirectionControls(
  onMove
) {

  const controls =
    document.createElement(
      "div"
    );

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
    ({
      direction,
      symbol
    }) => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

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
        () =>
          onMove(
            direction
          )
      );

      controls.appendChild(
        button
      );
    }
  );

  return controls;
}

/* ================================
   SNAKE MINI GAME
================================ */

function renderSnakeQuestion(
  question
) {

  const section =
    document.createElement(
      "section"
    );

  section.className =
    "question maze-question snake-question";

  const title =
    document.createElement(
      "div"
    );

  title.className =
    "question-title";

  const number =
    document.createElement(
      "span"
    );

  number.className =
    "question-number";

  number.textContent =
    String(
      question.number
    ).padStart(
      2,
      "0"
    );

  title.appendChild(
    number
  );

  title.appendChild(
    document.createTextNode(
      question.text
    )
  );

  const instructions =
    document.createElement(
      "p"
    );

  instructions.className =
    "maze-instructions";

  instructions.textContent =
    "Feed the skeleton snake 10 pumpkins to win. Don't hit the walls or yourself.";

  const score =
    document.createElement(
      "div"
    );

  score.className =
    "snake-score";

  const completed =
    Boolean(
      progress.mazes[
        question.number
      ]
    );

  score.textContent =
    completed
      ? "Pumpkins: 10 / 10"
      : "Pumpkins: 0 / 10";

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "maze-wrapper";

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.className =
    "snake-canvas";

  canvas.width =
    360;

  canvas.height =
    360;

  canvas.tabIndex =
    0;

  wrapper.appendChild(
    canvas
  );

  const status =
    document.createElement(
      "p"
    );

  status.className =
    "maze-status";

  const startButton =
    document.createElement(
      "button"
    );

  startButton.type =
    "button";

  startButton.className =
    "snake-start";

  startButton.textContent =
    completed
      ? "Completed"
      : "Start";

  startButton.disabled =
    completed;

  const game = {
    questionNumber:
      question.number,

    canvas,

    scoreDisplay:
      score,

    status,

    startButton,

    gridSize: 18,

    cellSize: 20,

    snake: [],

    direction: {
      x: 1,
      y: 0
    },

    nextDirection: {
      x: 1,
      y: 0
    },

    pumpkin: {
      x: 13,
      y: 9
    },

    score:
      completed
        ? 10
        : 0,

    timer: null,

    running: false,

    gameOver: false,

    completed
  };

  const controls =
    createDirectionControls(
      (direction) => {

        activeMaze =
          null;

        activePacmanGame =
          null;

        activeSnakeGame =
          game;

        changeSnakeDirection(
          game,
          direction
        );

        canvas.focus();
      }
    );

  startButton.addEventListener(
    "click",
    () => {

      activeMaze =
        null;

      activePacmanGame =
        null;

      activeSnakeGame =
        game;

      startSnakeGame(
        game
      );

      canvas.focus();
    }
  );

  canvas.addEventListener(
    "click",
    () => {

      activeMaze =
        null;

      activePacmanGame =
        null;

      activeSnakeGame =
        game;

      canvas.focus();
    }
  );

  section.appendChild(
    title
  );

  section.appendChild(
    instructions
  );

  section.appendChild(
    score
  );

  section.appendChild(
    wrapper
  );

  section.appendChild(
    controls
  );

  section.appendChild(
    startButton
  );

  section.appendChild(
    status
  );

  questionsContainer.appendChild(
    section
  );

  if (
    completed
  ) {

    status.textContent =
      "You ate 10 pumpkins! Completed 🎃";

    status.classList.add(
      "completed"
    );

    resetSnakeGame(
      game,
      true
    );

  } else {

    status.textContent =
      "Press Start when you're ready.";

    resetSnakeGame(
      game
    );
  }
}

function resetSnakeGame(
  game,
  completed = false
) {

  const middle =
    Math.floor(
      game.gridSize / 2
    );

  game.snake = [
    {
      x: middle,
      y: middle
    },
    {
      x: middle - 1,
      y: middle
    },
    {
      x: middle - 2,
      y: middle
    }
  ];

  game.direction = {
    x: 1,
    y: 0
  };

  game.nextDirection = {
    x: 1,
    y: 0
  };

  game.gameOver =
    false;

  if (
    !completed
  ) {

    game.score =
      0;

    game.scoreDisplay.textContent =
      "Pumpkins: 0 / 10";

    spawnPumpkin(
      game
    );
  }

  drawSnakeGame(
    game
  );
}

function startSnakeGame(
  game
) {

  if (
    game.completed ||
    game.running
  ) {
    return;
  }

  if (
    game.gameOver
  ) {
    resetSnakeGame(
      game
    );
  }

  game.running =
    true;

  game.startButton.disabled =
    true;

  game.startButton.textContent =
    "Running...";

  game.status.textContent =
    "Eat the pumpkins!";

  game.timer =
    setInterval(
      () =>
        updateSnakeGame(
          game
        ),
      150
    );
}

function changeSnakeDirection(
  game,
  direction
) {

  const directions = {
    up: {
      x: 0,
      y: -1
    },

    down: {
      x: 0,
      y: 1
    },

    left: {
      x: -1,
      y: 0
    },

    right: {
      x: 1,
      y: 0
    }
  };

  const next =
    directions[
      direction
    ];

  if (
    !next
  ) {
    return;
  }

  if (
    next.x ===
      -game.direction.x &&
    next.y ===
      -game.direction.y
  ) {
    return;
  }

  game.nextDirection =
    next;
}

function updateSnakeGame(
  game
) {

  if (
    !game.running
  ) {
    return;
  }

  game.direction = {
    ...game.nextDirection
  };

  const currentHead =
    game.snake[0];

  const newHead = {
    x:
      currentHead.x +
      game.direction.x,

    y:
      currentHead.y +
      game.direction.y
  };

  const hitWall =
    newHead.x < 0 ||
    newHead.y < 0 ||
    newHead.x >=
      game.gridSize ||
    newHead.y >=
      game.gridSize;

  if (
    hitWall
  ) {

    loseSnakeGame(
      game
    );

    return;
  }

  const eatingPumpkin =
    newHead.x ===
      game.pumpkin.x &&
    newHead.y ===
      game.pumpkin.y;

  const bodyToCheck =
    eatingPumpkin
      ? game.snake
      : game.snake.slice(
          0,
          -1
        );

  const hitSelf =
    bodyToCheck.some(
      (segment) =>
        segment.x ===
          newHead.x &&
        segment.y ===
          newHead.y
    );

  if (
    hitSelf
  ) {

    loseSnakeGame(
      game
    );

    return;
  }

  game.snake.unshift(
    newHead
  );

  if (
    eatingPumpkin
  ) {

    game.score++;

    game.scoreDisplay.textContent =
      `Pumpkins: ${game.score} / 10`;

    if (
      game.score >= 10
    ) {

      winSnakeGame(
        game
      );

      return;
    }

    spawnPumpkin(
      game
    );

  } else {

    game.snake.pop();
  }

  drawSnakeGame(
    game
  );
}

function spawnPumpkin(
  game
) {

  let pumpkin;

  do {

    pumpkin = {
      x:
        Math.floor(
          Math.random() *
          game.gridSize
        ),

      y:
        Math.floor(
          Math.random() *
          game.gridSize
        )
    };

  } while (
    game.snake.some(
      (segment) =>
        segment.x ===
          pumpkin.x &&
        segment.y ===
          pumpkin.y
    )
  );

  game.pumpkin =
    pumpkin;
}

function loseSnakeGame(
  game
) {

  game.running =
    false;

  game.gameOver =
    true;

  clearInterval(
    game.timer
  );

  game.timer =
    null;

  game.status.textContent =
    "The skeleton snake crashed! Tap Restart.";

  game.startButton.disabled =
    false;

  game.startButton.textContent =
    "Restart";
}

function winSnakeGame(
  game
) {

  game.running =
    false;

  game.completed =
    true;

  clearInterval(
    game.timer
  );

  game.timer =
    null;

  progress.mazes[
    game.questionNumber
  ] = true;

  game.scoreDisplay.textContent =
    "Pumpkins: 10 / 10";

  game.status.textContent =
    "You ate 10 pumpkins! Completed 🎃";

  game.status.classList.add(
    "completed"
  );

  game.startButton.disabled =
    true;

  game.startButton.textContent =
    "Completed";

  drawSnakeGame(
    game
  );

  saveProgress();

  revealNextQuestionIfAllowed(
    game.questionNumber,
    800
  );
}

function drawSnakeGame(
  game
) {

  const ctx =
    game.canvas.getContext(
      "2d"
    );

  const size =
    game.cellSize;

  ctx.clearRect(
    0,
    0,
    game.canvas.width,
    game.canvas.height
  );

  ctx.fillStyle =
    "#080609";

  ctx.fillRect(
    0,
    0,
    game.canvas.width,
    game.canvas.height
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.035)";

  ctx.lineWidth =
    1;

  for (
    let i = 0;
    i <=
      game.gridSize;
    i++
  ) {

    ctx.beginPath();

    ctx.moveTo(
      i * size,
      0
    );

    ctx.lineTo(
      i * size,
      game.canvas.height
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
      0,
      i * size
    );

    ctx.lineTo(
      game.canvas.width,
      i * size
    );

    ctx.stroke();
  }

  drawSnakePumpkin(
    ctx,
    game.pumpkin.x,
    game.pumpkin.y,
    size
  );

  ctx.strokeStyle =
    "#ddd5c5";

  ctx.lineWidth =
    Math.max(
      3,
      size * 0.18
    );

  ctx.lineCap =
    "round";

  for (
    let i = 0;
    i <
      game.snake.length - 1;
    i++
  ) {

    const first =
      game.snake[i];

    const second =
      game.snake[
        i + 1
      ];

    ctx.beginPath();

    ctx.moveTo(
      first.x * size +
        size / 2,
      first.y * size +
        size / 2
    );

    ctx.lineTo(
      second.x * size +
        size / 2,
      second.y * size +
        size / 2
    );

    ctx.stroke();
  }

  game.snake.forEach(
    (
      segment,
      index
    ) => {

      if (
        index === 0
      ) {
        return;
      }

      const centerX =
        segment.x *
          size +
        size / 2;

      const centerY =
        segment.y *
          size +
        size / 2;

      ctx.fillStyle =
        "#eee7d7";

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        size * 0.22,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle =
        "#080609";

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        size * 0.09,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  drawSnakeSkull(
    ctx,
    game.snake[0].x,
    game.snake[0].y,
    size
  );
}

function drawSnakeSkull(
  ctx,
  x,
  y,
  size
) {

  const centerX =
    x * size +
    size / 2;

  const centerY =
    y * size +
    size / 2;

  ctx.fillStyle =
    "#f4eee0";

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY,
    size * 0.38,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle =
    "#09070a";

  ctx.beginPath();

  ctx.arc(
    centerX -
      size * 0.14,
    centerY -
      size * 0.05,
    size * 0.08,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.arc(
    centerX +
      size * 0.14,
    centerY -
      size * 0.05,
    size * 0.08,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillRect(
    centerX -
      size * 0.04,
    centerY +
      size * 0.08,
    size * 0.08,
    size * 0.09
  );
}

function drawSnakePumpkin(
  ctx,
  x,
  y,
  size
) {

  const centerX =
    x * size +
    size / 2;

  const centerY =
    y * size +
    size / 2;

  ctx.fillStyle =
    "#ff7518";

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY +
      size * 0.05,
    size * 0.32,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle =
    "#6e9b45";

  ctx.fillRect(
    centerX -
      size * 0.05,
    centerY -
      size * 0.38,
    size * 0.1,
    size * 0.2
  );

  ctx.fillStyle =
    "#3a1908";

  ctx.fillRect(
    centerX -
      size * 0.16,
    centerY,
    size * 0.07,
    size * 0.07
  );

  ctx.fillRect(
    centerX +
      size * 0.09,
    centerY,
    size * 0.07,
    size * 0.07
  );
}

/* ================================
   ZOFRAN CHASE MINI GAME
================================ */

function renderPacmanQuestion(
  question
) {

  const section =
    document.createElement(
      "section"
    );

  section.className =
    "question maze-question pacman-question";

  const title =
    document.createElement(
      "div"
    );

  title.className =
    "question-title";

  const number =
    document.createElement(
      "span"
    );

  number.className =
    "question-number";

  number.textContent =
    String(
      question.number
    ).padStart(
      2,
      "0"
    );

  title.appendChild(
    number
  );

  title.appendChild(
    document.createTextNode(
      question.text
    )
  );

  const instructions =
    document.createElement(
      "p"
    );

  instructions.className =
    "maze-instructions";

  instructions.textContent =
    "Clear every Zofran pill from the haunted maze while four embryo monsters chase you. You have 3 lives.";

  const hud =
    document.createElement(
      "div"
    );

  hud.className =
    "pacman-hud";

  const pillDisplay =
    document.createElement(
      "span"
    );

  const livesDisplay =
    document.createElement(
      "span"
    );

  hud.appendChild(
    pillDisplay
  );

  hud.appendChild(
    livesDisplay
  );

  const wrapper =
    document.createElement(
      "div"
    );

  wrapper.className =
    "maze-wrapper";

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.className =
    "pacman-canvas";

  canvas.width =
    380;

  canvas.height =
    420;

  canvas.tabIndex =
    0;

  wrapper.appendChild(
    canvas
  );

  const status =
    document.createElement(
      "p"
    );

  status.className =
    "maze-status";

  const startButton =
    document.createElement(
      "button"
    );

  startButton.type =
    "button";

  startButton.className =
    "pacman-start";

  const completed =
    Boolean(
      progress.mazes[
        question.number
      ]
    );

  const game =
    createPacmanGame(
      question.number,
      canvas,
      pillDisplay,
      livesDisplay,
      status,
      startButton,
      completed
    );

  const controls =
    createDirectionControls(
      (direction) => {

        activeMaze =
          null;

        activeSnakeGame =
          null;

        activePacmanGame =
          game;

        setPacmanDirection(
          game,
          direction
        );

        canvas.focus();
      }
    );

  startButton.addEventListener(
    "click",
    () => {

      activeMaze =
        null;

      activeSnakeGame =
        null;

      activePacmanGame =
        game;

      startPacmanGame(
        game
      );

      canvas.focus();
    }
  );

  canvas.addEventListener(
    "click",
    () => {

      activeMaze =
        null;

      activeSnakeGame =
        null;

      activePacmanGame =
        game;

      canvas.focus();
    }
  );

  section.appendChild(
    title
  );

  section.appendChild(
    instructions
  );

  section.appendChild(
    hud
  );

  section.appendChild(
    wrapper
  );

  section.appendChild(
    controls
  );

  section.appendChild(
    startButton
  );

  section.appendChild(
    status
  );

  questionsContainer.appendChild(
    section
  );

  updatePacmanHud(
    game
  );

  drawPacmanGame(
    game
  );
}

function createPacmanGrid() {

  const rows =
    21;

  const columns =
    19;

  const grid =
    Array.from(
      {
        length: rows
      },
      () =>
        Array(
          columns
        ).fill(0)
    );

  for (
    let x = 0;
    x < columns;
    x++
  ) {

    grid[0][x] =
      1;

    grid[
      rows - 1
    ][x] =
      1;
  }

  for (
    let y = 0;
    y < rows;
    y++
  ) {

    grid[y][0] =
      1;

    grid[y][
      columns - 1
    ] =
      1;
  }

  const addH =
    (
      y,
      fromX,
      toX
    ) => {

      for (
        let x =
          fromX;
        x <= toX;
        x++
      ) {

        grid[y][x] =
          1;
      }
    };

  const addV =
    (
      x,
      fromY,
      toY
    ) => {

      for (
        let y =
          fromY;
        y <= toY;
        y++
      ) {

        grid[y][x] =
          1;
      }
    };

  addH(
    3,
    2,
    6
  );

  addH(
    3,
    12,
    16
  );

  addV(
    4,
    2,
    5
  );

  addV(
    14,
    2,
    5
  );

  addH(
    6,
    2,
    4
  );

  addH(
    6,
    6,
    8
  );

  addH(
    6,
    10,
    12
  );

  addH(
    6,
    14,
    16
  );

  addV(
    8,
    2,
    4
  );

  addV(
    10,
    2,
    4
  );

  addH(
    9,
    6,
    8
  );

  addH(
    9,
    10,
    12
  );

  addV(
    6,
    9,
    12
  );

  addV(
    12,
    9,
    12
  );

  addH(
    12,
    6,
    8
  );

  addH(
    12,
    10,
    12
  );

  addH(
    14,
    2,
    4
  );

  addH(
    14,
    6,
    8
  );

  addH(
    14,
    10,
    12
  );

  addH(
    14,
    14,
    16
  );

  addV(
    4,
    15,
    18
  );

  addV(
    14,
    15,
    18
  );

  addH(
    17,
    2,
    6
  );

  addH(
    17,
    12,
    16
  );

  addV(
    8,
    16,
    18
  );

  addV(
    10,
    16,
    18
  );

  addH(
    10,
    8,
    10
  );

  return grid;
}

function buildPacmanPills(
  grid,
  blockedPositions
) {

  const pills =
    new Set();

  for (
    let y = 1;
    y <
      grid.length - 1;
    y++
  ) {

    for (
      let x = 1;
      x <
        grid[0].length - 1;
      x++
    ) {

      if (
        grid[y][x] !== 0
      ) {
        continue;
      }

      const key =
        `${x},${y}`;

      if (
        blockedPositions.has(
          key
        )
      ) {
        continue;
      }

      if (
        (x + y) % 3 === 0
      ) {

        pills.add(
          key
        );
      }
    }
  }

  return pills;
}

function createPacmanGame(
  questionNumber,
  canvas,
  pillDisplay,
  livesDisplay,
  status,
  startButton,
  completed
) {

  const grid =
    createPacmanGrid();

  const playerStart = {
    x: 9,
    y: 18
  };

  const enemyStarts = [
    {
      x: 8,
      y: 11
    },
    {
      x: 10,
      y: 11
    },
  ];

  const blocked =
    new Set([
      `${playerStart.x},${playerStart.y}`,

      ...enemyStarts.map(
        (enemy) =>
          `${enemy.x},${enemy.y}`
      )
    ]);

  const pills =
    completed
      ? new Set()
      : buildPacmanPills(
          grid,
          blocked
        );

  const game = {
    questionNumber,

    canvas,

    pillDisplay,

    livesDisplay,

    status,

    startButton,

    grid,

    rows:
      grid.length,

    columns:
      grid[0].length,

    cellSize: 20,

    playerStart,

    enemyStarts,

    player: {
      ...playerStart
    },

    direction: {
      x: 0,
      y: 0
    },

    nextDirection: {
      x: 0,
      y: 0
    },

    enemies: [],

    pills,

    initialPills:
      new Set(
        pills
      ),

    pillsEaten: 0,

    totalPills:
      pills.size,

    lives: 3,

    timer: null,

    running: false,

    gameOver: false,

    completed,

    pausedUntil: 0,

    tickCount: 0
  };

  resetPacmanPositions(
    game
  );

  if (
    completed
  ) {

    startButton.textContent =
      "Completed";

    startButton.disabled =
      true;

    status.textContent =
      "Maze cleared. The embryos have been defeated. 💊🎃";

    status.classList.add(
      "completed"
    );

  } else {

    startButton.textContent =
      "Start";

    startButton.disabled =
      false;

    status.textContent =
      "Press Start when you're ready.";
  }

  return game;
}

function resetPacmanPositions(
  game
) {

  game.player = {
    ...game.playerStart
  };

  game.direction = {
    x: 0,
    y: 0
  };

  game.nextDirection = {
    x: 0,
    y: 0
  };

  const embryoColors = [
    "#e98aa7",
    "#d56f96",
    "#f0a1b6",
    "#c95b83"
  ];

  game.enemies =
    game.enemyStarts.map(
      (
        start,
        index
      ) => ({
        x:
          start.x,

        y:
          start.y,

        startX:
          start.x,

        startY:
          start.y,

        direction: {
          x:
            index % 2 === 0
              ? 1
              : -1,

          y: 0
        },

        color:
          embryoColors[
            index
          ]
      })
    );
}

function resetPacmanLevel(
  game
) {

  game.pills =
    new Set(
      game.initialPills
    );

  game.pillsEaten =
    0;

  game.lives =
    3;

  game.gameOver =
    false;

  game.completed =
    false;

  game.pausedUntil =
    0;

  game.tickCount =
    0;

  resetPacmanPositions(
    game
  );

  updatePacmanHud(
    game
  );

  drawPacmanGame(
    game
  );
}

function startPacmanGame(
  game
) {

  if (
    game.completed ||
    game.running
  ) {
    return;
  }

  if (
    game.gameOver
  ) {

    resetPacmanLevel(
      game
    );
  }

  game.running =
    true;

  game.startButton.disabled =
    true;

  game.startButton.textContent =
    "Running...";

  game.status.textContent =
    "Eat the Zofran. Avoid the embryos!";

  game.timer =
    setInterval(
      () =>
        updatePacmanGame(
          game
        ),
      175
    );
}

function setPacmanDirection(
  game,
  direction
) {

  const directions = {
    up: {
      x: 0,
      y: -1
    },

    down: {
      x: 0,
      y: 1
    },

    left: {
      x: -1,
      y: 0
    },

    right: {
      x: 1,
      y: 0
    }
  };

  const next =
    directions[
      direction
    ];

  if (
    !next
  ) {
    return;
  }

  game.nextDirection =
    next;
}

function canPacmanMove(
  game,
  entity,
  direction
) {

  const nextX =
    entity.x +
    direction.x;

  const nextY =
    entity.y +
    direction.y;

  return (
    game.grid[
      nextY
    ]?.[
      nextX
    ] === 0
  );
}

function movePacmanPlayer(
  game
) {

  if (
    canPacmanMove(
      game,
      game.player,
      game.nextDirection
    )
  ) {

    game.direction = {
      ...game.nextDirection
    };
  }

  if (
    canPacmanMove(
      game,
      game.player,
      game.direction
    )
  ) {

    game.player.x +=
      game.direction.x;

    game.player.y +=
      game.direction.y;
  }
}

function validEnemyDirections(
  game,
  enemy
) {

  const directions = [
    {
      x: 0,
      y: -1
    },
    {
      x: 0,
      y: 1
    },
    {
      x: -1,
      y: 0
    },
    {
      x: 1,
      y: 0
    }
  ];

  const valid =
    directions.filter(
      (direction) =>
        canPacmanMove(
          game,
          enemy,
          direction
        )
    );

  if (
    valid.length <= 1
  ) {
    return valid;
  }

  const reverse = {
    x:
      -enemy.direction.x,

    y:
      -enemy.direction.y
  };

  const withoutReverse =
    valid.filter(
      (direction) =>
        !(
          direction.x ===
            reverse.x &&
          direction.y ===
            reverse.y
        )
    );

  return withoutReverse.length
    ? withoutReverse
    : valid;
}

function chooseEnemyDirection(
  game,
  enemy
) {

  const choices =
    validEnemyDirections(
      game,
      enemy
    );

  if (
    !choices.length
  ) {
    return {
      x: 0,
      y: 0
    };
  }

  if (
    Math.random() <
    0.68
  ) {

    let best =
      choices[0];

    let bestDistance =
      Infinity;

    choices.forEach(
      (direction) => {

        const nextX =
          enemy.x +
          direction.x;

        const nextY =
          enemy.y +
          direction.y;

        const distance =
          Math.abs(
            nextX -
              game.player.x
          ) +
          Math.abs(
            nextY -
              game.player.y
          );

        if (
          distance <
          bestDistance
        ) {

          bestDistance =
            distance;

          best =
            direction;
        }
      }
    );

    return best;
  }

  return choices[
    Math.floor(
      Math.random() *
      choices.length
    )
  ];
}

function movePacmanEnemies(
  game
) {

  // Embryos only move every other tick
  if (
    game.tickCount % 2 !== 0
  ) {
    return;
  }

  game.enemies.forEach(
    (enemy) => {

      enemy.direction =
        chooseEnemyDirection(
          game,
          enemy
        );

      enemy.x +=
        enemy.direction.x;

      enemy.y +=
        enemy.direction.y;
    }
  );
}

function pacmanCollision(
  game
) {

  return game.enemies.some(
    (enemy) =>
      enemy.x ===
        game.player.x &&
      enemy.y ===
        game.player.y
  );
}

function collectPacmanPill(
  game
) {

  const key =
    `${game.player.x},${game.player.y}`;

  if (
    !game.pills.has(
      key
    )
  ) {
    return false;
  }

  game.pills.delete(
    key
  );

  game.pillsEaten++;

  updatePacmanHud(
    game
  );

  return true;
}

function losePacmanLife(
  game
) {

  game.lives--;

  updatePacmanHud(
    game
  );

  if (
    game.lives <= 0
  ) {

    game.running =
      false;

    game.gameOver =
      true;

    clearInterval(
      game.timer
    );

    game.timer =
      null;

    game.status.textContent =
      "The embryos got you. Tap Restart and try again.";

    game.startButton.disabled =
      false;

    game.startButton.textContent =
      "Restart";

    drawPacmanGame(
      game
    );

    return;
  }

  resetPacmanPositions(
    game
  );

  game.pausedUntil =
    Date.now() +
    800;

  game.status.textContent =
    `Oof. ${game.lives} ${
      game.lives === 1
        ? "life"
        : "lives"
    } left.`;

  drawPacmanGame(
    game
  );
}

function winPacmanGame(
  game
) {

  game.running =
    false;

  game.completed =
    true;

  clearInterval(
    game.timer
  );

  game.timer =
    null;

  progress.mazes[
    game.questionNumber
  ] = true;

  game.status.textContent =
    "All Zofran collected! The embryo swarm has been defeated. 💊🎃";

  game.status.classList.add(
    "completed"
  );

  game.startButton.disabled =
    true;

  game.startButton.textContent =
    "Completed";

  updatePacmanHud(
    game
  );

  drawPacmanGame(
    game
  );

  saveProgress();

  revealNextQuestionIfAllowed(
    game.questionNumber,
    900
  );
}

function updatePacmanGame(
  game
) {

  if (
    !game.running
  ) {
    return;
  }

  if (
    Date.now() <
    game.pausedUntil
  ) {
    return;
  }

  game.tickCount++;

  movePacmanPlayer(
    game
  );

  if (
    pacmanCollision(
      game
    )
  ) {

    losePacmanLife(
      game
    );

    return;
  }

  collectPacmanPill(
    game
  );

  if (
    game.pills.size === 0
  ) {

    winPacmanGame(
      game
    );

    return;
  }

  movePacmanEnemies(
    game
  );

  if (
    pacmanCollision(
      game
    )
  ) {

    losePacmanLife(
      game
    );

    return;
  }

  drawPacmanGame(
    game
  );
}

function updatePacmanHud(
  game
) {

  game.pillDisplay.textContent =
    `Zofran: ${game.pillsEaten} / ${game.totalPills}`;

  game.livesDisplay.textContent =
    `Lives: ${game.lives}`;
}

function drawPacmanGame(
  game
) {

  const ctx =
    game.canvas.getContext(
      "2d"
    );

  const size =
    game.cellSize;

  ctx.clearRect(
    0,
    0,
    game.canvas.width,
    game.canvas.height
  );

  ctx.fillStyle =
    "#070509";

  ctx.fillRect(
    0,
    0,
    game.canvas.width,
    game.canvas.height
  );

  for (
    let y = 0;
    y < game.rows;
    y++
  ) {

    for (
      let x = 0;
      x < game.columns;
      x++
    ) {

      if (
        game.grid[y][x] !== 1
      ) {
        continue;
      }

      ctx.fillStyle =
        "#33213e";

      ctx.fillRect(
        x * size,
        y * size,
        size,
        size
      );

      ctx.strokeStyle =
        "#674479";

      ctx.lineWidth =
        1.5;

      ctx.strokeRect(
        x * size + 2,
        y * size + 2,
        size - 4,
        size - 4
      );
    }
  }

  game.pills.forEach(
    (key) => {

      const [
        x,
        y
      ] =
        key
          .split(",")
          .map(Number);

      drawZofranPill(
        ctx,
        x,
        y,
        size
      );
    }
  );

  game.enemies.forEach(
    (
      enemy,
      index
    ) => {

      drawEmbryoEnemy(
        ctx,
        enemy.x,
        enemy.y,
        size,
        enemy.color,
        index
      );
    }
  );

  drawGlassesHero(
    ctx,
    game.player.x,
    game.player.y,
    size,
    game.direction
  );
}

function drawZofranPill(
  ctx,
  x,
  y,
  size
) {

  const centerX =
    x * size +
    size / 2;

  const centerY =
    y * size +
    size / 2;

  ctx.save();

  ctx.translate(
    centerX,
    centerY
  );

  ctx.rotate(
    -0.35
  );

  ctx.fillStyle =
    "#f4eee6";

  ctx.beginPath();

  ctx.roundRect(
    -size * 0.28,
    -size * 0.15,
    size * 0.56,
    size * 0.3,
    size * 0.14
  );

  ctx.fill();

  ctx.fillStyle =
    "#df9ab1";

  ctx.fillRect(
    0,
    -size * 0.15,
    size * 0.28,
    size * 0.3
  );

  ctx.strokeStyle =
    "#6f5364";

  ctx.lineWidth =
    1;

  ctx.strokeRect(
    -size * 0.02,
    -size * 0.13,
    size * 0.02,
    size * 0.26
  );

  ctx.restore();

  ctx.fillStyle =
    "#261421";

  ctx.font =
    `bold ${Math.max(
      7,
      size * 0.34
    )}px Arial`;

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  ctx.fillText(
    "Z",
    centerX - 1,
    centerY
  );
}

function drawEmbryoEnemy(
  ctx,
  x,
  y,
  size,
  color,
  index
) {

  const centerX =
    x * size +
    size / 2;

  const centerY =
    y * size +
    size / 2;

  ctx.save();

  ctx.fillStyle =
    color;

  ctx.strokeStyle =
    "#7c3d58";

  ctx.lineWidth =
    1.3;

  ctx.beginPath();

  ctx.ellipse(
    centerX,
    centerY,
    size * 0.3,
    size * 0.36,
    index % 2 === 0
      ? 0.35
      : -0.35,
    0,
    Math.PI * 2
  );

  ctx.fill();
  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    centerX +
      size * 0.18,
    centerY +
      size * 0.16
  );

  ctx.quadraticCurveTo(
    centerX +
      size * 0.46,
    centerY +
      size * 0.34,
    centerX +
      size * 0.2,
    centerY +
      size * 0.45
  );

  ctx.stroke();

  ctx.fillStyle =
    "#1a0d13";

  ctx.beginPath();

  ctx.arc(
    centerX -
      size * 0.07,
    centerY -
      size * 0.08,
    size * 0.055,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.moveTo(
    centerX -
      size * 0.15,
    centerY -
      size * 0.18
  );

  ctx.lineTo(
    centerX -
      size * 0.02,
    centerY -
      size * 0.14
  );

  ctx.stroke();

  ctx.restore();
}

function drawGlassesHero(
  ctx,
  x,
  y,
  size,
  direction
) {

  const centerX =
    x * size +
    size / 2;

  const centerY =
    y * size +
    size / 2;

  let mouthAngle =
    0;

  if (
    direction.x < 0
  ) {

    mouthAngle =
      Math.PI;

  } else if (
    direction.y < 0
  ) {

    mouthAngle =
      -Math.PI / 2;

  } else if (
    direction.y > 0
  ) {

    mouthAngle =
      Math.PI / 2;
  }

  ctx.fillStyle =
    "#f1c84a";

  ctx.beginPath();

  ctx.moveTo(
    centerX,
    centerY
  );

  ctx.arc(
    centerX,
    centerY,
    size * 0.39,
    mouthAngle + 0.34,
    mouthAngle +
      Math.PI * 2 -
      0.34
  );

  ctx.closePath();

  ctx.fill();

  ctx.strokeStyle =
    "#3b263e";

  ctx.lineWidth =
    1.6;

  const glassesY =
    centerY -
    size * 0.1;

  ctx.strokeRect(
    centerX -
      size * 0.29,
    glassesY -
      size * 0.1,
    size * 0.2,
    size * 0.18
  );

  ctx.strokeRect(
    centerX +
      size * 0.07,
    glassesY -
      size * 0.1,
    size * 0.2,
    size * 0.18
  );

  ctx.beginPath();

  ctx.moveTo(
    centerX -
      size * 0.09,
    glassesY
  );

  ctx.lineTo(
    centerX +
      size * 0.07,
    glassesY
  );

  ctx.stroke();

  ctx.fillStyle =
    "#e56a9c";

  ctx.beginPath();

  ctx.moveTo(
    centerX +
      size * 0.13,
    centerY -
      size * 0.31
  );

  ctx.lineTo(
    centerX +
      size * 0.34,
    centerY -
      size * 0.42
  );

  ctx.lineTo(
    centerX +
      size * 0.31,
    centerY -
      size * 0.18
  );

  ctx.closePath();

  ctx.fill();

  ctx.beginPath();

  ctx.moveTo(
    centerX +
      size * 0.18,
    centerY -
      size * 0.3
  );

  ctx.lineTo(
    centerX +
      size * 0.4,
    centerY -
      size * 0.2
  );

  ctx.lineTo(
    centerX +
      size * 0.35,
    centerY -
      size * 0.43
  );

  ctx.closePath();

  ctx.fill();

  ctx.fillStyle =
    "#8a345c";

  ctx.beginPath();

  ctx.arc(
    centerX +
      size * 0.28,
    centerY -
      size * 0.3,
    size * 0.07,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

/* ================================
   KEYBOARD CONTROLS
================================ */

function isTypingTarget(
  target
) {

  return (
    target instanceof
      HTMLInputElement ||
    target instanceof
      HTMLTextAreaElement ||
    target instanceof
      HTMLSelectElement
  );
}

document.addEventListener(
  "keydown",
  (event) => {

    if (
      isTypingTarget(
        event.target
      )
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
      keyMap[
        event.key
      ];

    if (
      !direction
    ) {
      return;
    }

    if (
      activePacmanGame
        ?.running
    ) {

      event.preventDefault();

      setPacmanDirection(
        activePacmanGame,
        direction
      );

      return;
    }

    if (
      activeSnakeGame
        ?.running
    ) {

      event.preventDefault();

      changeSnakeDirection(
        activeSnakeGame,
        direction
      );

      return;
    }

    if (
      activeMaze !== null
    ) {

      event.preventDefault();

      moveMazePlayer(
        activeMaze,
        direction
      );
    }
  }
);

/* ================================
   CHECK ANSWERS BUTTON
================================ */

quizForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    saveProgress();

    questions.forEach(
      (question) => {

        if (
          isMiniGame(
            question
          )
        ) {
          return;
        }

        const input =
          document.querySelector(
            `#question-${question.number}`
          );

        if (
          !input
        ) {
          return;
        }

        const feedback =
          input.parentElement
            .querySelector(
              ".answer-feedback"
            );

        const userAnswer =
          input.value.trim();

        if (
          !userAnswer
        ) {

          input.classList.remove(
            "correct",
            "incorrect"
          );

          feedback.className =
            "answer-feedback";

          feedback.textContent =
            "";

          return;
        }

        const correct =
          isAnswerCorrect(
            question.number,
            userAnswer
          );

        if (
          correct
        ) {

          input.classList.remove(
            "incorrect"
          );

          input.classList.add(
            "correct"
          );

          feedback.className =
            "answer-feedback correct";

          feedback.textContent =
            "Correct 🎃";

        } else {

          input.classList.remove(
            "correct"
          );

          input.classList.add(
            "incorrect"
          );

          feedback.className =
            "answer-feedback incorrect";

          feedback.textContent =
            "Not quite...";
        }
      }
    );

    const correctCount =
      questions.filter(
        (question) =>
          isQuestionComplete(
            question
          )
      ).length;

    result.textContent =
      `${correctCount} of 30 completed correctly.`;
  }
);

renderAvailableQuestions();