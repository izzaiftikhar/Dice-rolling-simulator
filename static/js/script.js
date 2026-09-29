const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

const die1El = document.getElementById("die1");
const die2El = document.getElementById("die2");
const totalEl = document.getElementById("total");
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const historyEl = document.getElementById("history");

let rolls = [];

function drawDie(el, value) {
  el.innerHTML = "";
  el.setAttribute("aria-label", `Die showing ${value}`);
  for (let i = 0; i < 9; i++) {
    const pip = document.createElement("span");
    pip.className = "pip" + (PIPS[value].includes(i) ? " on" : "");
    el.appendChild(pip);
  }
}

function randomFace() {
  return Math.floor(Math.random() * 6) + 1;
}

async function rollDice() {
  rollBtn.disabled = true;
  die1El.classList.add("rolling");
  die2El.classList.add("rolling");

  const shuffle = setInterval(() => {
    drawDie(die1El, randomFace());
    drawDie(die2El, randomFace());
  }, 90);

  try {
    const [res] = await Promise.all([
      fetch("/api/roll", { method: "POST" }).then((r) => r.json()),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ]);
    clearInterval(shuffle);
    drawDie(die1El, res.die1);
    drawDie(die2El, res.die2);
    totalEl.innerHTML = `${res.die1} + ${res.die2} = <strong>${res.total}</strong>`;
    rolls.push(res.total);
    await updateStats();
  } catch (err) {
    totalEl.textContent = "Could not roll. Check your connection and try again.";
  } finally {
    clearInterval(shuffle);
    die1El.classList.remove("rolling");
    die2El.classList.remove("rolling");
    rollBtn.disabled = false;
  }
}

async function updateStats() {
  const stats = await fetch("/api/stats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rolls }),
  }).then((r) => r.json());

  document.getElementById("statCount").textContent = stats.count;
  document.getElementById("statHighest").textContent = stats.highest;
  document.getElementById("statLowest").textContent = stats.lowest;
  document.getElementById("statAverage").textContent = stats.average;
  renderHistory(stats.highest);
}

function renderHistory(highest) {
  historyEl.innerHTML = "";
  if (rolls.length === 0) {
    historyEl.innerHTML = '<li class="empty">No rolls yet</li>';
    return;
  }
  rolls.slice(-10).reverse().forEach((value) => {
    const li = document.createElement("li");
    li.textContent = value;
    if (value === highest) li.className = "best";
    historyEl.appendChild(li);
  });
}

function reset() {
  rolls = [];
  totalEl.textContent = "Roll the dice to start";
  ["statCount", "statHighest", "statLowest", "statAverage"].forEach((id) => {
    document.getElementById(id).textContent = "0";
  });
  drawDie(die1El, 1);
  drawDie(die2El, 1);
  renderHistory(0);
}

rollBtn.addEventListener("click", rollDice);
resetBtn.addEventListener("click", reset);
reset();