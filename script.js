let habits = JSON.parse(localStorage.getItem("habits")) || [];
let checks = JSON.parse(localStorage.getItem("checks")) || {};
let currentDate = new Date();

// buttons
document.getElementById("addBtn").onclick = addHabit;
document.getElementById("prevBtn").onclick = prevWeek;
document.getElementById("nextBtn").onclick = nextWeek;
document.getElementById("todayBtn").onclick = goToday;

function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("checks", JSON.stringify(checks));
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getWeekStart(date) {
  let d = new Date(date);
  let day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1); // Monday start
  return d;
}

function addHabit() {
  let input = document.getElementById("habitInput");

  if (!input.value.trim()) return;

  habits.push(input.value.trim());
  input.value = "";

  save();
  render();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  save();
  render();
}

function renameHabit(index) {
  let name = prompt("Rename habit:", habits[index]);
  if (!name) return;

  habits[index] = name.trim();
  save();
  render();
}

function toggle(habit, date) {
  let key = habit + "_" + date;

  if (checks[key]) {
    delete checks[key];
  } else {
    checks[key] = true;
  }

  save();
  render();
}

function getStreak(habit) {
  let count = 0;
  let d = new Date();

  while (true) {
    let date = formatDate(d);

    if (checks[habit + "_" + date]) {
      count++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return count;
}

function render() {
  let grid = document.getElementById("grid");
  grid.innerHTML = "";

  if (habits.length === 0) {
    grid.innerHTML = "<div class='empty'>No habits yet</div>";
    return;
  }

  let start = getWeekStart(currentDate);

  // header
  let header = document.createElement("div");
  header.className = "grid-row";

  let h = "<div></div>";

  for (let i = 0; i < 7; i++) {
    let d = new Date(start);
    d.setDate(d.getDate() + i);
    h += `<div class="cell">${d.toDateString().slice(0,3)}</div>`;
  }

  h += "<div>🔥</div>";
  header.innerHTML = h;
  grid.appendChild(header);

  // rows
  habits.forEach((habit, index) => {
    let row = document.createElement("div");
    row.className = "grid-row";

    let html = `
      <div class="habit-name">
        ${habit}
        <div class="actions">
          <span onclick="renameHabit(${index})">✏</span>
          <span onclick="deleteHabit(${index})">✖</span>
        </div>
      </div>
    `;

    for (let i = 0; i < 7; i++) {
      let d = new Date(start);
      d.setDate(d.getDate() + i);

      let date = formatDate(d);
      let checked = checks[habit + "_" + date];
      let today = formatDate(d) === formatDate(new Date());

      html += `
        <div class="cell ${checked ? "checked" : ""} ${today ? "today" : ""}"
          onclick="toggle('${habit}', '${date}')">
          ${checked ? "✔" : ""}
        </div>
      `;
    }

    html += `<div>${getStreak(habit)}</div>`;

    row.innerHTML = html;
    grid.appendChild(row);
  });
}

function prevWeek() {
  currentDate.setDate(currentDate.getDate() - 7);
  render();
}

function nextWeek() {
  currentDate.setDate(currentDate.getDate() + 7);
  render();
}

function goToday() {
  currentDate = new Date();
  render();
}

render();
``