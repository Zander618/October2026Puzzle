const questions = [
  {
    number: 1,
    text: "With the bears and the elephant, full of wonder what will he discover?"
  },
  {
    number: 2,
    text: "There are many where you lie down. One is not the same. Turn me around. What are those?"
  },
  {
    number: 3,
    text: "Find em weekend: How many rats are there?"
  },
  {
    number: 4,
    text: "Find em weekend: How many ghosts are there? (Kitchen Only)"
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
  type: "snake",
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
    text: "One is not like the others under my many arms that have grown since I left my house of food. The color?"
  },
  {
    number: 23,
    text: "Unearth the mystery of the red stone"
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

  // 12 = maze

  13: ["The Idiot"],
  14: ["Texas Chain Saw Massacre"],

  15: ["Purple"],

  16: ["Dorian A Sirna"],

  17: ["4", "four"],
  18: ["5", "five"],

  // 19 = maze

  // Room number — words are NOT accepted here
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
  const acceptedAnswers = correctAnswers[questionNumber];

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

let activeMaze = null;
let activeSnakeGame = null;

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

  questions.forEach(
    (question) => {

      if (
        isQuestionComplete(question)
      ) {
        completed++;
      }
    }
  );

  progressDisplay.textContent =
    `${completed} / ${questions.length} completed`;
}

/* ================================
   RENDER QUESTIONS
================================ */

const PUZZLE_YEAR = 2026;
const PUZZLE_MONTH = 9; // JavaScript months start at 0, so 9 = October

function hasQuestionDateArrived(questionNumber) {
  const now = new Date();

  const unlockDate = new Date(
    PUZZLE_YEAR,
    PUZZLE_MONTH,
    questionNumber,
    0,
    0,
    0
  );

  return now >= unlockDate;
}

function isQuestionComplete(question) {

  if (
    question.type === "maze" ||
    question.type === "snake"
  ) {
    return Boolean(
      progress.mazes[question.number]
    );
  }

  const answer =
    progress.answers[question.number] ?? "";

  return isAnswerCorrect(
    question.number,
    answer
  );
}

function canShowQuestion(question) {

  /*
    The calendar date must have arrived.
  */

  if (!hasQuestionDateArrived(question.number)) {
    return false;
  }

  /*
    Question 1 has no previous question.
  */

  if (question.number === 1) {
    return true;
  }

  const previousQuestion =
    questions.find(
      (item) =>
        item.number === question.number - 1
    );

  return isQuestionComplete(
    previousQuestion
  );
}

function renderAvailableQuestions() {

  /*
    Start fresh so locked questions disappear
    if an earlier answer is changed.
  */

    if (
    activeSnakeGame &&
    activeSnakeGame.timer
  ) {
    clearInterval(
      activeSnakeGame.timer
    );
  }

  activeSnakeGame = null;

  questionsContainer.innerHTML = "";

  mazeGames.clear();

  activeMaze = null;

  for (const question of questions) {

    /*
      IMPORTANT:
      Stop at the first locked question.

      This prevents someone from jumping
      farther ahead even if old saved data
      exists.
    */

    if (!canShowQuestion(question)) {
      break;
    }
    if (question.type === "maze") {

      renderMazeQuestion(question);

    } else if (question.type === "snake") {

      renderSnakeQuestion(question);

    } else {

      renderTextQuestion(question);

    }
  }

  updateProgressDisplay();
}

renderAvailableQuestions();

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

    /*
      If the answer is now correct AND
      tomorrow's/day's question is already
      allowed by the calendar, reveal it.
    */

    if (
      isAnswerCorrect(
        question.number,
        input.value
      )
    ) {

      const nextQuestion =
        questions.find(
          (item) =>
            item.number ===
            question.number + 1
        );

      if (
        nextQuestion &&
        hasQuestionDateArrived(
          nextQuestion.number
        )
      ) {
        renderAvailableQuestions();
      }
    }
  }
);

const feedback =
  document.createElement("p");

feedback.className =
  "answer-feedback";

section.appendChild(label);
section.appendChild(input);
section.appendChild(feedback);

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
    "Guide the pumpkin pixel to the ghost. Use the buttons below.";

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "maze-wrapper";

  const canvas =
    document.createElement("canvas");

  canvas.className =
    "maze-canvas";
if (question.number === 5) {

  canvas.width = 420;
  canvas.height = 420;

  canvas.classList.add(
    "first-maze"
  );

} else {

  canvas.width = 330;
  canvas.height = 330;
}

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
   SNAKE MINI GAME
================================ */

function renderSnakeQuestion(question) {

  const section =
    document.createElement("section");

  section.className =
    "question maze-question snake-question";

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
    document.createTextNode(
      question.text
    )
  );

  const instructions =
    document.createElement("p");

  instructions.className =
    "maze-instructions";

  instructions.textContent =
    "Feed the skeleton snake 10 pumpkins to win. Don't hit the walls or yourself.";

  const score =
    document.createElement("div");

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
    document.createElement("div");

  wrapper.className =
    "maze-wrapper";

  const canvas =
    document.createElement("canvas");

  canvas.className =
    "snake-canvas";

  canvas.width = 360;
  canvas.height = 360;

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

  const status =
    document.createElement("p");

  status.className =
    "maze-status";

  const startButton =
    document.createElement("button");

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
    scoreDisplay: score,
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

  controlInfo.forEach(
    ({ direction, symbol }) => {

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
        () => {

          activeMaze = null;
          activeSnakeGame = game;

          changeSnakeDirection(
            game,
            direction
          );

          canvas.focus();
        }
      );

      controls.appendChild(
        button
      );
    }
  );

  startButton.addEventListener(
    "click",
    () => {

      activeMaze = null;
      activeSnakeGame = game;

      startSnakeGame(game);

      canvas.focus();
    }
  );

  canvas.addEventListener(
    "click",
    () => {

      activeMaze = null;
      activeSnakeGame = game;

      canvas.focus();
    }
  );

  section.appendChild(title);
  section.appendChild(instructions);
  section.appendChild(score);
  section.appendChild(wrapper);
  section.appendChild(controls);
  section.appendChild(startButton);
  section.appendChild(status);

  questionsContainer.appendChild(
    section
  );

  if (completed) {

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

    resetSnakeGame(game);
  }
}


/* ================================
   RESET SNAKE
================================ */

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

  if (!completed) {

    game.score = 0;

    game.scoreDisplay.textContent =
      "Pumpkins: 0 / 10";

    spawnPumpkin(game);
  }

  drawSnakeGame(game);
}


/* ================================
   START SNAKE
================================ */

function startSnakeGame(game) {

  if (
    game.completed ||
    game.running
  ) {
    return;
  }

  if (game.gameOver) {
    resetSnakeGame(game);
  }

  game.running = true;

  game.startButton.disabled =
    true;

  game.startButton.textContent =
    "Running...";

  game.status.textContent =
    "Eat the pumpkins!";

  game.timer =
    setInterval(
      () => {
        updateSnakeGame(game);
      },
      150
    );
}


/* ================================
   CHANGE DIRECTION
================================ */

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
    directions[direction];

  if (!next) {
    return;
  }

  /*
    Prevent instantly reversing
    into the snake's own body.
  */
  if (
    next.x ===
      -game.direction.x &&
    next.y ===
      -game.direction.y
  ) {
    return;
  }

  game.nextDirection = next;
}


/* ================================
   UPDATE SNAKE
================================ */

function updateSnakeGame(game) {

  if (!game.running) {
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

  if (hitWall) {

    loseSnakeGame(game);

    return;
  }

  const eatingPumpkin =
    newHead.x ===
      game.pumpkin.x &&
    newHead.y ===
      game.pumpkin.y;

  /*
    Ignore the final tail segment
    when it is about to move away.
  */
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

  if (hitSelf) {

    loseSnakeGame(game);

    return;
  }

  game.snake.unshift(
    newHead
  );

  if (eatingPumpkin) {

    game.score++;

    game.scoreDisplay.textContent =
      `Pumpkins: ${game.score} / 10`;

    if (game.score >= 10) {

      winSnakeGame(game);

      return;
    }

    spawnPumpkin(game);

  } else {

    game.snake.pop();
  }

  drawSnakeGame(game);
}


/* ================================
   PUMPKIN LOCATION
================================ */

function spawnPumpkin(game) {

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

  game.pumpkin = pumpkin;
}


/* ================================
   LOSE
================================ */

function loseSnakeGame(game) {

  game.running = false;
  game.gameOver = true;

  clearInterval(
    game.timer
  );

  game.timer = null;

  game.status.textContent =
    "The skeleton snake crashed! Tap Restart.";

  game.startButton.disabled =
    false;

  game.startButton.textContent =
    "Restart";
}


/* ================================
   WIN
================================ */

function winSnakeGame(game) {

  game.running = false;
  game.completed = true;

  clearInterval(
    game.timer
  );

  game.timer = null;

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

  drawSnakeGame(game);

  saveProgress();

  const nextQuestion =
    questions.find(
      (item) =>
        item.number ===
        game.questionNumber + 1
    );

  if (
    nextQuestion &&
    hasQuestionDateArrived(
      nextQuestion.number
    )
  ) {

    setTimeout(
      renderAvailableQuestions,
      800
    );
  }
}


/* ================================
   DRAW SNAKE GAME
================================ */

function drawSnakeGame(game) {

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

  /*
    Subtle graveyard-style grid.
  */
  ctx.strokeStyle =
    "rgba(255,255,255,0.035)";

  ctx.lineWidth = 1;

  for (
    let i = 0;
    i <= game.gridSize;
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

  /*
    Draw bones connecting the
    skeleton together.
  */
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
      game.snake[i + 1];

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

  /*
    Vertebrae.
  */
  game.snake.forEach(
    (segment, index) => {

      if (index === 0) {
        return;
      }

      const centerX =
        segment.x * size +
        size / 2;

      const centerY =
        segment.y * size +
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


/* ================================
   SNAKE SKULL
================================ */

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

  /*
    Eye sockets.
  */
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

  /*
    Little skull nose.
  */
  ctx.fillRect(
    centerX -
      size * 0.04,
    centerY +
      size * 0.08,
    size * 0.08,
    size * 0.09
  );
}


/* ================================
   PUMPKIN FOOD
================================ */

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

  /*
    Tiny jack-o-lantern eyes.
  */
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

  /*
    Make the first maze larger/harder.
  */
  const columns =
    questionNumber === 5
      ? 21
      : 15;

  const rows =
    questionNumber === 5
      ? 21
      : 15;

  const cellSize =
    canvas.width / columns;

  /*
    Each Monday gets a different,
    repeatable maze.
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

  /*
    Check whether this maze was
    already completed previously.
  */
  const completed =
    Boolean(
      progress.mazes[
        questionNumber
      ]
    );

  /*
    Create the actual game object.
  */
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

  /*
    If already completed,
    show the completed state.
  */
  if (completed) {

    status.textContent =
      "Escaped! 🎃";

    status.classList.add(
      "completed"
    );
  }

  /*
    Actually draw the maze.
  */
  drawMaze(game);

  /*
    This is important because
    renderMazeQuestion stores this
    object inside mazeGames.
  */
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

  const nextQuestion =
    questions.find(
      (item) =>
        item.number ===
        questionNumber + 1
    );

  /*
    If the next day's date has already
    arrived, reveal it immediately.
  */

  if (
    nextQuestion &&
    hasQuestionDateArrived(
      nextQuestion.number
    )
  ) {

    setTimeout(
      renderAvailableQuestions,
      600
    );
  }
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
  activeSnakeGame &&
  activeSnakeGame.running
) {
  return;
}

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

document.addEventListener(
  "keydown",
  (event) => {

    if (
      !activeSnakeGame ||
      !activeSnakeGame.running
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

    changeSnakeDirection(
      activeSnakeGame,
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

    let correctCount = 0;
    let answeredCount = 0;

    questions.forEach((question) => {

      /*
        Maze questions
      */
      if (
  question.type === "maze" ||
  question.type === "snake"
) {

        if (
          progress.mazes[
            question.number
          ]
        ) {
          correctCount++;
          answeredCount++;
        }

        return;
      }

      const input =
        document.querySelector(
          `#question-${question.number}`
        );

      if (!input) {
        return;
      }

      const feedback =
        input.parentElement.querySelector(
          ".answer-feedback"
        );

      const userAnswer =
        input.value.trim();

      /*
        Nothing entered
      */
      if (!userAnswer) {

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

      answeredCount++;

      const correct =
        isAnswerCorrect(
          question.number,
          userAnswer
        );

      if (correct) {

        correctCount++;

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
    });

    result.textContent =
      `${correctCount} of 30 completed correctly.`;
  }
);

updateProgressDisplay();