import { ANIMATION_TIME, GAME_START_DELAY } from "./config.js";

const images = [
  "🍊",
  "🍌",
  "🍇",
  "🍉",
  "🍒",
  "🍎",
  "🍍",
  "🥝",
  "🍊",
  "🍌",
  "🍇",
  "🍉",
  "🍒",
  "🍎",
  "🍍",
  "🥝",
];

let firstCard = null;
let secondCard = null;
let score = 0;
let timeLeft;
let timerInterval;
let gameTime = 0;

// Elements that are controlled to be hidden/ visible by start/ restart game button
const gameControlDiv = document.getElementById("game-control");
const gameStatsDiv = document.getElementById("game-stats");
const gameGrid = document.getElementById("grid");

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // 0 <= Math.random() < 1
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate the card elements
function generateGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // Clear any existing content
  const shuffledImages = shuffle(images);
  shuffledImages.forEach((image, index) => {
    const card = document.createElement("div");
    card.className =
      "card bg-white flex items-center justify-center text-2xl cursor-pointer hover:bg-violet-200";
    card.dataset.image = image;
    card.textContent = image; // Initially, show the image
    grid.appendChild(card);
  });

  // Show all cards for 2 seconds before flipping them back
  setTimeout(() => {
    // Flip all cards back to hidden state
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("bg-white");
      card.classList.add("bg-gray-300");
      card.textContent = ""; // Hide the image
    });

    // Add event listeners after flipping back the cards
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => flipCard(card));
    });

    // Start the timer after the cards are flipped back
    startTimer();
  }, GAME_START_DELAY * 1000);
}

// Flip the card
function flipCard(card) {
  if (card.classList.contains("flipped") || (firstCard && secondCard)) {
    return;
  }

  card.classList.add("flipped", "bg-white");
  card.textContent = card.dataset.image;

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkForMatch();
  }
}

// Check if two selected cards match
function checkForMatch() {
  if (firstCard.dataset.image === secondCard.dataset.image) {
    // Match found
    score++;
    document.getElementById("score").textContent = score;

    // Change the background color to green for matched cards
    firstCard.classList.add("bg-green-600");
    secondCard.classList.add("bg-green-600");
    // Change the cursor style and hover state color back to normal for matched cards
    firstCard.classList.remove("cursor-pointer");
    firstCard.classList.remove("hover:bg-violet-200");
    secondCard.classList.remove("cursor-pointer");
    secondCard.classList.remove("hover:bg-violet-200");

    firstCard = null;
    secondCard = null;

    if (score === images.length / 2) {
      clearInterval(timerInterval); // Stop the timer when game is won
      showCongratsModal();
      setWinStreak(getWinStreak() + 1);
    }
  } else {
    // No match found
    setTimeout(() => {
      firstCard.classList.remove("flipped", "bg-white");
      firstCard.textContent = "";
      secondCard.classList.remove("flipped", "bg-white");
      secondCard.textContent = "";
      firstCard = null;
      secondCard = null;
    }, ANIMATION_TIME * 1000);
  }
}

// Show the congratulations modal
function showCongratsModal() {
  document.getElementById("finalScore").textContent = score;
  document.getElementById("congratsModal").classList.remove("hidden");
}

// Show the game over modal
function showGameOverModal() {
  document.getElementById("finalScoreGameOver").textContent = score;
  document.getElementById("gameOverModal").classList.remove("hidden");
}

// Start the game timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      timeLeft = 0; // Ensure the timer displays 0
      clearInterval(timerInterval); // Stop the timer
      document.getElementById("timer").textContent = timeLeft;
      showGameOverModal(); // Show Game Over modal
      setWinStreak(0);
    } else {
      document.getElementById("timer").textContent = timeLeft;
    }
  }, 1000);
}

// Starts the game
function startGame() {
  const difficultyInputs = document.getElementsByName("difficulty");
  let selectedDifficulty = "";

  for (const input of difficultyInputs) {
    if (input.checked) {
      selectedDifficulty = input.value;
      break;
    }
  }
  gameTime = parseInt(selectedDifficulty);

  gameControlDiv.classList.add("hidden");
  gameGrid.classList.remove("hidden");
  gameStatsDiv.classList.remove("hidden");

  score = 0;
  timeLeft = gameTime;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("congratsModal").classList.add("hidden");
  document.getElementById("gameOverModal").classList.add("hidden");
  gameControlDiv.classList.add("hidden");
  gameStatsDiv.classList.remove("hidden");
  clearInterval(timerInterval); // Clear any existing intervals
  generateGrid();
}

// Restarts the game
function restartGame() {
  gameControlDiv.classList.remove("hidden");
  document.getElementById("grid").classList.add("hidden");
  gameStatsDiv.classList.add("hidden");
  document.getElementById("congratsModal").classList.add("hidden");
  document.getElementById("gameOverModal").classList.add("hidden");
}

// Gets the win streak from local storage
function getWinStreak() {
  let streak = localStorage.getItem("streak");
  if (!streak) return 0;
  else return parseInt(streak);
}

// Sets the win streak
function setWinStreak(streak) {
  localStorage.setItem("streak", streak.toString());
  document.getElementById("streak").textContent = streak.toString();
}

// Main function
function main() {
  setWinStreak(getWinStreak());
  document.querySelectorAll(".restartGameBtn").forEach((btn) => {
    btn.addEventListener("click", restartGame);
  });
  document.getElementById("startBtn").addEventListener("click", startGame);
}

main();
