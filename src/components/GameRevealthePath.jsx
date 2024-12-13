// Configuration
const gridSize = 5;
const grid = [];
const player = { x: 0, y: 0 }; // Player starts at the top-left
const goal = { x: 4, y: 4 }; // Goal is at the bottom-right
let messageElement;

// Generate random correct/incorrect cells
const generateGrid = () => {
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      if (x === 0 && y === 0) {
        grid[y][x] = "start"; // Start position
      } else if (x === goal.x && y === goal.y) {
        grid[y][x] = "goal"; // Goal position
      } else {
        grid[y][x] = Math.random() > 0.5 ? "correct" : "incorrect";
      }
    }
  }
};

// Draw the grid
const drawGrid = () => {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = ""; // Clear existing cells
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (x === player.x && y === player.y) {
        cell.classList.add("player");
      } else if (grid[y][x] === "goal") {
        cell.classList.add("goal");
      } else if (grid[y][x] === "correct") {
        cell.classList.add("correct");
      } else if (grid[y][x] === "incorrect") {
        cell.classList.add("incorrect");
      }
      gridElement.appendChild(cell);
    }
  }
};

// Move the player
const movePlayer = (dx, dy) => {
  const newX = player.x + dx;
  const newY = player.y + dy;

  if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
    const cellType = grid[newY][newX];

    if (cellType === "incorrect") {
      messageElement.textContent = "Wrong info! Dead end!";
    } else {
      player.x = newX;
      player.y = newY;
      messageElement.textContent = "";

      if (cellType === "correct") {
        messageElement.textContent = "Correct info! Keep going!";
      }

      if (newX === goal.x && newY === goal.y) {
        messageElement.textContent = "You made it home!";
      }
    }
    drawGrid();
  }
};

// Handle keyboard input
const handleKeyPress = (event) => {
  switch (event.key) {
    case "ArrowUp":
      movePlayer(0, -1);
      break;
    case "ArrowDown":
      movePlayer(0, 1);
      break;
    case "ArrowLeft":
      movePlayer(-1, 0);
      break;
    case "ArrowRight":
      movePlayer(1, 0);
      break;
  }
};

// Initialize the game
const initializeGame = () => {
  messageElement = document.getElementById("message");
  generateGrid();
  drawGrid();
  document.addEventListener("keydown", handleKeyPress);
};

initializeGame();

