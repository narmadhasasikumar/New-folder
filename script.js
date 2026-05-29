// script.js

// ---------------- TIMER ----------------

let time = 25 * 60;
let timer;
let running = false;

const timerDisplay = document.getElementById("timer");

function updateTimer() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;

  timerDisplay.innerText = `${minutes}:${seconds}`;
}

document.getElementById("startBtn").addEventListener("click", () => {
  if (running) return;

  running = true;

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateTimer();
    }
  }, 1000);
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  clearInterval(timer);
  running = false;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  clearInterval(timer);

  time = 25 * 60;

  updateTimer();

  running = false;
});

// ---------------- TASK MANAGER ----------------

const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", () => {
  const task = taskInput.value;

  if (task === "") return;

  const li = document.createElement("li");

  li.innerHTML = `
    ${task}
    <button class="deleteBtn">X</button>
  `;

  taskList.appendChild(li);

  taskInput.value = "";

  li.querySelector(".deleteBtn").addEventListener("click", () => {
    li.remove();
  });
});

// ---------------- QUOTES ----------------

const quotes = [
  "Stay focused and never give up.",
  "Small progress is still progress.",
  "Discipline creates success.",
  "Consistency beats motivation.",
];

const quote = document.getElementById("quote");

setInterval(() => {
  const random = Math.floor(Math.random() * quotes.length);

  quote.innerText = quotes[random];
}, 5000);

// ---------------- DARK MODE ----------------

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});
