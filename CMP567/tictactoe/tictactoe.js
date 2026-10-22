let playerTurn = true;
let computerMoveTimeout = 0;

const gameStatus = {
   MORE_MOVES_LEFT: 1,
   HUMAN_WINS: 2,
   COMPUTER_WINS: 3,
   DRAW_GAME: 4
};

window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
   document.getElementById("newGameButton").addEventListener("click", newGame);
   document.getElementById("playAgainButton").addEventListener("click", newGame);

   const buttons = getGameBoardButtons();
   for (let button of buttons) {
      button.addEventListener("click", function() {
         boardButtonClicked(button);
      });
   }

   newGame();
}

function getGameBoardButtons() {
   return document.querySelectorAll("#gameBoard > button");
}

function checkForWinner() {
   const buttons = getGameBoardButtons();
   const possibilities = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
   ];

   for (let indices of possibilities) {
      if (
         buttons[indices[0]].innerHTML !== "" &&
         buttons[indices[0]].innerHTML === buttons[indices[1]].innerHTML &&
         buttons[indices[1]].innerHTML === buttons[indices[2]].innerHTML
      ) {
         if (buttons[indices[0]].innerHTML === "X") {
            return gameStatus.HUMAN_WINS;
         }
         return gameStatus.COMPUTER_WINS;
      }
   }

   for (let button of buttons) {
      if (button.innerHTML !== "X" && button.innerHTML !== "O") {
         return gameStatus.MORE_MOVES_LEFT;
      }
   }

   return gameStatus.DRAW_GAME;
}

function newGame() {
   clearTimeout(computerMoveTimeout);
   computerMoveTimeout = 0;

   const buttons = getGameBoardButtons();
   for (let button of buttons) {
      button.innerHTML = "";
      button.removeAttribute("class");
      button.removeAttribute("disabled");
   }

   playerTurn = true;
   document.getElementById("turnInfo").textContent = "Your turn";
   hideWinnerBillboard();
   clearConfetti();
}

function boardButtonClicked(button) {
   if (playerTurn && button.innerHTML === "") {
      button.innerHTML = "X";
      button.classList.add("x");
      button.setAttribute("disabled", "true");
      switchTurn();
   }
}

function switchTurn() {
   const status = checkForWinner();
   const turnInfo = document.getElementById("turnInfo");

   if (status === gameStatus.MORE_MOVES_LEFT) {
      if (playerTurn) {
         computerMoveTimeout = setTimeout(makeComputerMove, 1000);
      }

      playerTurn = !playerTurn;
      turnInfo.textContent = playerTurn ? "Your turn" : "Computer's turn";
      return;
   }

   playerTurn = false;

   if (status === gameStatus.HUMAN_WINS) {
      turnInfo.textContent = "You win!";
      showWinnerBillboard("🏆", "You win!", "Tic-tac-toe champion!");
      launchConfetti();
   }
   else if (status === gameStatus.COMPUTER_WINS) {
      turnInfo.textContent = "Computer wins!";
      showWinnerBillboard("🤖", "Computer wins!", "Ready for a rematch?");
   }
   else {
      turnInfo.textContent = "Draw game";
      showWinnerBillboard("🤝", "Draw game", "An evenly matched battle!");
   }
}

function makeComputerMove() {
   computerMoveTimeout = 0;

   const availableButtons = [];
   const buttons = getGameBoardButtons();

   for (let button of buttons) {
      if (button.innerHTML === "") {
         availableButtons.push(button);
      }
   }

   if (availableButtons.length === 0) {
      switchTurn();
      return;
   }

   const randomIndex = Math.floor(Math.random() * availableButtons.length);
   const selectedButton = availableButtons[randomIndex];

   selectedButton.innerHTML = "O";
   selectedButton.classList.add("o");
   selectedButton.setAttribute("disabled", "true");
   switchTurn();
}

function showWinnerBillboard(icon, title, message) {
   const billboard = document.getElementById("winnerBillboard");
   document.getElementById("billboardIcon").textContent = icon;
   document.getElementById("billboardTitle").textContent = title;
   document.getElementById("billboardMessage").textContent = message;
   billboard.classList.add("show");
   billboard.setAttribute("aria-hidden", "false");
}

function hideWinnerBillboard() {
   const billboard = document.getElementById("winnerBillboard");
   billboard.classList.remove("show");
   billboard.setAttribute("aria-hidden", "true");
}

function launchConfetti() {
   clearConfetti();

   const layer = document.getElementById("confettiLayer");
   const colors = ["#ff4f9a", "#50e3ff", "#ffd166", "#8c7cff", "#7dffb2"];

   for (let i = 0; i < 120; ++i) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.setProperty("--duration", 2.6 + Math.random() * 2.2 + "s");
      piece.style.setProperty("--delay", Math.random() * 0.7 + "s");
      piece.style.setProperty("--drift", -90 + Math.random() * 180 + "px");
      layer.appendChild(piece);
   }

   setTimeout(clearConfetti, 5600);
}

function clearConfetti() {
   document.getElementById("confettiLayer").replaceChildren();
}
