// Dynamic Active – AI LMS Prototype (front-end only)
// UI prototype (no backend). Data below simulates a class roster.

// -----------------------
// Mock data
// -----------------------
const students = [
  { name: "Aisha Khan", progress: 35, lastScore: 52, weakSkill: "Fractions" },
  { name: "Daniel Brooks", progress: 78, lastScore: 85, weakSkill: "Algebra" },
  { name: "Sofia Martinez", progress: 60, lastScore: 68, weakSkill: "Decimals" },

  { name: "Liam Chen", progress: 42, lastScore: 58, weakSkill: "Fractions" },
  { name: "Noah Patel", progress: 88, lastScore: 91, weakSkill: "Word Problems" },
  { name: "Emma Johnson", progress: 55, lastScore: 62, weakSkill: "Percentages" },

  { name: "Olivia Brown", progress: 30, lastScore: 47, weakSkill: "Decimals" },
  { name: "Ethan Wilson", progress: 67, lastScore: 73, weakSkill: "Ratios" },
  { name: "Mia Rodriguez", progress: 90, lastScore: 94, weakSkill: "Algebra" },

  { name: "Arjun Mehta", progress: 48, lastScore: 59, weakSkill: "Fractions" },
  { name: "Zara Ali", progress: 72, lastScore: 76, weakSkill: "Geometry" },
  { name: "Lucas Thompson", progress: 40, lastScore: 54, weakSkill: "Percentages" }
];

const lessons = [
  { title: "Intro to Fractions", skill: "Fractions" },
  { title: "Decimals Basics", skill: "Decimals" },
  { title: "Algebra Foundations", skill: "Algebra" },
  { title: "Percent & Ratio Drills", skill: "Percentages" },
  { title: "Ratio Reasoning", skill: "Ratios" },
  { title: "Geometry Warm-up", skill: "Geometry" },
  { title: "Word Problems Starter", skill: "Word Problems" }
];

// -----------------------
// App state
// -----------------------
let currentTab = "teacher"; // teacher | student | lesson | insights
let selectedStudentIndex = 0;
let selectedStudentName = students[0].name;

let showAtRiskOnly = false;
let searchQuery = "";
let aiEnabled = true;

// Lightweight “history” to make it feel real
const interventions = []; // { ts, student, action }
const teacherNotes = {};  // { [studentName]: string }

// -----------------------
// Helpers
// -----------------------
function nowStamp() {
  return new Date().toLocaleString();
}

function normalize(str) {
  return (str || "").trim().toLowerCase();
}

function addIntervention(studentName, action) {
  interventions.unshift({ ts: nowStamp(), student: studentName, action });
}

function getStudentByIndex(i) {
  return students[Math.max(0, Math.min(students.length - 1, i))];
}

function getStudentByName(name) {
  return students.find(s => s.name === name) || students[0];
}

function setSelectedStudentByName(name) {
  const idx = students.findIndex(s => s.name === name);
  selectedStudentIndex = idx >= 0 ? idx : 0;
  selectedStudentName = students[selectedStudentIndex].name;
}

function getInsight(student) {
  if (student.lastScore < 60) return `At risk — recommend review of ${student.weakSkill}`;
  if (student.progress < 50) return "Behind pace — assign additional practice";
  return "On track";
}

function recommendLesson(student) {
  if (!aiEnabled) return "AI Suggestions Disabled";
  const match = lessons.find(l => l.skill === student.weakSkill);
  return match ? match.title : "No recommendation available";
}

function filterStudents(list) {
  let out = list;

  if (showAtRiskOnly) out = out.filter(s => s.lastScore < 60);

  if (normalize(searchQuery)) {
    const q = normalize(searchQuery);
    out = out.filter(s => normalize(s.name).includes(q) || normalize(s.weakSkill).includes(q));
  }

  return out;
}

function setHeader(title, sub, subtitle) {
  const pageTitle = document.getElementById("pageTitle");
  const pageSub = document.getElementById("pageSub");
  const pageSubtitle = document.getElementById("pageSubtitle");
  if (!pageTitle || !pageSub || !pageSubtitle) return;

  pageTitle.textContent = title;
  pageSub.textContent = sub;
  pageSubtitle.textContent = subtitle || "";
}

// -----------------------
// DOM refs
// -----------------------
const tabTeacher  = document.getElementById("tabTeacher");
const tabStudent  = document.getElementById("tabStudent");
const tabLesson   = document.getElementById("tabLesson");
const tabInsights = document.getElementById("tabInsights");

const viewWelcome = document.getElementById("viewWelcome");
const viewStudent = document.getElementById("viewStudent");
const viewLesson  = document.getElementById("viewLesson");
const viewInsights = document.getElementById("viewInsights");

const navButtons = document.querySelectorAll(".nav-btn");

// Topbar search + dropdown
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");
let ddIndex = -1;

// Sidebar AI toggle
const toggleAi = document.getElementById("toggleAi");

function setActiveTab(activeButton) {
  navButtons.forEach(btn => btn.classList.remove("active"));
  if (activeButton) activeButton.classList.add("active");
}

function hideAllViews() {
  if (viewWelcome) viewWelcome.style.display = "none";
  if (viewStudent) viewStudent.style.display = "none";
  if (viewLesson) viewLesson.style.display = "none";
  if (viewInsights) viewInsights.style.display = "none";
}

function renderCurrent() {
  hideAllViews();

  if (currentTab === "teacher") {
    setHeader(
      "Dashboard",
      "Monitor progress, spot risk early, and take action.",
      "Teacher-first LMS prototype with explainable, rule-based “AI” insights."
    );
    renderWelcomeView();
    viewWelcome.style.display = "block";
    return;
  }

  if (currentTab === "student") {
    setHeader(
      "Students",
      "Open any student to see risk, confidence, notes, and recommendations.",
      "Tip: Use the search bar to jump to a student instantly."
    );
    renderStudentView();
    viewStudent.style.display = "block";
    return;
  }

  if (currentTab === "lesson") {
    setHeader(
      "Lessons",
      "Mini practice + explainable logic behind each recommendation.",
      "This is a simulation—no backend model is used."
    );
    renderLessonView();
    viewLesson.style.display = "block";
    return;
  }

  if (currentTab === "insights") {
    setHeader(
      "AI Insights",
      "Class patterns + what-if simulation to explain decision support.",
      "Everything is rule-based for transparency."
    );
    renderInsightsView();
    viewInsights.style.display = "block";
    return;
  }
}

// -----------------------
// Views
// -----------------------
function renderWelcomeView() {
  const atRiskCount = students.filter(s => s.lastScore < 60).length;
  const avgScore = Math.round(students.reduce((sum, s) => sum + s.lastScore, 0) / students.length);

  const skillCounts = {};
  students.forEach(s => { skillCounts[s.weakSkill] = (skillCounts[s.weakSkill] || 0) + 1; });
  const heatmap = Object.entries(skillCounts)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 6)
    .map(([skill,count]) => `<span class="pill">${skill} • ${count}</span>`)
    .join("");

  viewWelcome.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2 style="margin:0;">Quick Overview</h2>
        <span class="muted small">Last updated: ${nowStamp()}</span>
      </div>

      <div class="summary" style="margin-top:14px;">
        <div class="summary-card"><strong>${students.length}</strong><span>Students</span></div>
        <div class="summary-card"><strong>${atRiskCount}</strong><span>At Risk</span></div>
        <div class="summary-card"><strong>${avgScore}%</strong><span>Avg Score</span></div>
      </div>

      <div class="card" style="margin-top:12px;">
        <div class="card-head">
          <h3 style="margin:0;">Class Skill Signals</h3>
          <span class="muted small">Most common weak areas</span>
        </div>
        <div class="pills">${heatmap || '<span class="muted">No signals yet</span>'}</div>
      </div>

      <div class="card" style="margin-top:12px;">
        <h3 style="margin:0;">Recent Interventions</h3>
        ${renderInterventionsList()}
      </div>

      <div class="card-actions" style="margin-top:12px;">
        <button class="primary-btn" id="goStudents">View Students</button>
        <button class="ghost-btn" id="goInsights">View AI Insights</button>
      </div>
    </div>

    <div style="margin-top:14px;"></div>
    ${renderTeacherMiniBoard()}
  `;

  const goStudents = document.getElementById("goStudents");
  if (goStudents) goStudents.onclick = () => {
    currentTab = "student";
    setActiveTab(tabStudent);
    renderCurrent();
  };

  const goInsights = document.getElementById("goInsights");
  if (goInsights) goInsights.onclick = () => {
    currentTab = "insights";
    setActiveTab(tabInsights);
    renderCurrent();
  };

  // Wire mini-board actions
  const filterAtRiskBtn = document.getElementById("filterAtRisk");
  const filterAllBtn = document.getElementById("filterAll");
  if (filterAtRiskBtn) filterAtRiskBtn.onclick = () => { showAtRiskOnly = true; renderWelcomeView(); };
  if (filterAllBtn) filterAllBtn.onclick = () => { showAtRiskOnly = false; renderWelcomeView(); };

  const bulkAssign = document.getElementById("bulkAssign");
  const bulkNudge = document.getElementById("bulkNudge");
  if (bulkAssign) bulkAssign.onclick = () => {
    const atRiskStudents = students.filter(s => s.lastScore < 60);
    atRiskStudents.forEach(s => addIntervention(s.name, `Assigned ${s.weakSkill} refresher (bulk)`));
    alert(`Assigned refresher to ${atRiskStudents.length} at-risk student(s).`);
    renderWelcomeView();
  };
  if (bulkNudge) bulkNudge.onclick = () => {
    students.forEach(s => addIntervention(s.name, "Sent encouragement nudge (bulk)"));
    alert(`Sent nudges to ${students.length} student(s).`);
    renderWelcomeView();
  };

  document.querySelectorAll("[data-open]").forEach(btn => {
    btn.onclick = () => {
      setSelectedStudentByName(btn.getAttribute("data-open"));
      currentTab = "student";
      setActiveTab(tabStudent);
      renderCurrent();
    };
  });

  document.querySelectorAll("[data-nudge]").forEach(btn => {
    btn.onclick = () => {
      const name = btn.getAttribute("data-nudge");
      addIntervention(name, "Sent encouragement nudge");
      alert(`Nudge sent to ${name} 📩`);
      renderWelcomeView();
    };
  });
}

function renderTeacherMiniBoard() {
  const visibleStudents = filterStudents(students);

  let html = `
    <div class="controls">
      <button class="chip ${showAtRiskOnly ? "chip-active" : ""}" id="filterAtRisk">
        ${showAtRiskOnly ? "Showing: At-Risk Only" : "Filter: At-Risk Only"}
      </button>
      <button class="chip ${!showAtRiskOnly ? "chip-active" : ""}" id="filterAll">Show All</button>

      <button class="primary-btn" id="bulkAssign">Assign Refresher to All At-Risk</button>
      <button class="ghost-btn" id="bulkNudge">Send Encouragement Nudge</button>
    </div>

    <div class="cards">
  `;

  if (visibleStudents.length === 0) {
    html += `
      <div class="card">
        <p class="muted">No students match your current filters/search.</p>
      </div>
    `;
  } else {
    visibleStudents.forEach(student => {
      const badgeClass = student.lastScore < 60 ? "badge-risk" : "badge-ok";
      html += `
        <div class="card">
          <div class="card-head">
            <h3 style="margin:0;">${student.name}</h3>
            <span class="badge ${badgeClass}">${getInsight(student)}</span>
          </div>

          <div class="meta"><span>Progress</span><strong>${student.progress}%</strong></div>
          <div class="bar"><div style="width:${student.progress}%"></div></div>

          <div class="meta"><span>Last Score</span><strong>${student.lastScore}%</strong></div>
          <div class="meta"><span>Weak Skill</span><strong>${student.weakSkill}</strong></div>

          <div class="card-actions">
            <button class="ghost-btn" data-open="${student.name}">Open Student</button>
            <button class="ghost-btn" data-nudge="${student.name}">Nudge</button>
          </div>
        </div>
      `;
    });
  }

  html += `</div>`;
  return html;
}

function renderStudentView() {
  const student = getStudentByIndex(selectedStudentIndex);

  let html = `
    <div class="student-layout">
      <div class="student-list card">
        <div class="card-head">
          <h3 style="margin:0;">Class Roster</h3>
          <span class="muted small">${students.length} total</span>
        </div>

        <div class="student-items">
  `;

  students.forEach((s, i) => {
    const isActive = i === selectedStudentIndex;
    const riskDot = s.lastScore < 60 ? "risk-dot" : "ok-dot";

    html += `
      <button class="student-row ${isActive ? "active" : ""}" data-index="${i}">
        <span class="dot ${riskDot}"></span>
        <div class="student-row-main">
          <div class="student-row-name">${s.name}</div>
          <div class="student-row-meta">${s.progress}% • ${s.lastScore}% • ${s.weakSkill}</div>
        </div>
      </button>
    `;
  });

  html += `
        </div>
      </div>

      <div class="student-detail">
        <div class="card">
          <div class="student-header">
            <h2 style="margin:0;">${student.name}</h2>
            <span class="badge ${student.lastScore < 60 ? "badge-risk" : "badge-ok"}">
              ${getInsight(student)}
            </span>
          </div>

          <div class="meta"><span>Progress</span><strong>${student.progress}%</strong></div>
          <div class="bar"><div style="width:${student.progress}%"></div></div>

          <div class="meta" style="margin-top:10px;"><span>Last Score</span><strong>${student.lastScore}%</strong></div>
          <div class="meta"><span>Weak Skill</span><strong>${student.weakSkill}</strong></div>
        </div>

        <div class="grid-3" style="margin-top:16px;">
          <div class="card">
            <h3 style="margin:0;">Risk Timeline</h3>
            <ul class="list">
              <li>Week 1: 78% — On Track</li>
              <li>Week 2: 65% — Warning</li>
              <li>Week 3: ${student.lastScore}% — ${student.lastScore < 60 ? "At Risk" : "On Track"}</li>
            </ul>
          </div>

          <div class="card">
            <h3 style="margin:0;">Learning Confidence</h3>
            <p style="margin-top:10px;">
              Estimated confidence:
              <strong>${Math.min(95, Math.max(20, Math.round((student.progress + student.lastScore) / 2)))}%</strong>
            </p>
            <p class="muted">Based on consistency (progress) and recent performance (score).</p>
          </div>

          <div class="card">
            <h3 style="margin:0;">Teacher Notes</h3>
            <textarea id="teacherNote" placeholder="Write a quick note...">${teacherNotes[student.name] || ""}</textarea>
            <div class="btn-row">
              <button class="primary-btn" id="saveNoteBtn">Save Note</button>
              <button class="ghost-btn" id="nudgeBtn">Send Encouragement Nudge</button>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:16px;">
          <div class="ai-row">
            <h3 style="margin:0;">AI Recommendation</h3>
            <label class="switch">
              <input type="checkbox" ${aiEnabled ? "checked" : ""} id="aiToggle" />
              <span class="slider"></span>
            </label>
          </div>

          <p style="margin-top:10px;"><strong>Recommended lesson:</strong> ${recommendLesson(student)}</p>
          <p class="muted">Explainable rules (not a black-box model).</p>

          <div class="card-actions">
            <button class="primary-btn" id="openLessonBtn">Open Lesson</button>
            <button class="ghost-btn" id="assignAtRiskBtn">Assign to All At-Risk</button>
          </div>
        </div>

        <div class="card" style="margin-top:16px;">
          <h3 style="margin:0;">Intervention History</h3>
          ${renderInterventionsList(student.name)}
        </div>
      </div>
    </div>
  `;

  viewStudent.innerHTML = html;

  // clicking in roster updates the panel
  document.querySelectorAll(".student-row").forEach(btn => {
    btn.onclick = () => {
      selectedStudentIndex = Number(btn.dataset.index);
      selectedStudentName = students[selectedStudentIndex].name;
      renderStudentView();
    };
  });

  document.getElementById("saveNoteBtn").onclick = () => {
    teacherNotes[student.name] = document.getElementById("teacherNote").value || "";
    addIntervention(student.name, "Saved teacher note");
    alert("Note saved ✅ (demo)");
    renderStudentView();
  };

  document.getElementById("nudgeBtn").onclick = () => {
    addIntervention(student.name, "Sent encouragement nudge");
    alert("Nudge sent 📩");
    renderStudentView();
  };

  document.getElementById("assignAtRiskBtn").onclick = () => {
    const atRiskStudents = students.filter(s => s.lastScore < 60);
    atRiskStudents.forEach(s => addIntervention(s.name, `Assigned ${s.weakSkill} refresher (bulk)`));
    alert(`Assigned refresher to ${atRiskStudents.length} at-risk student(s).`);
    renderStudentView();
  };

  document.getElementById("aiToggle").onchange = (e) => {
    aiEnabled = !!e.target.checked;
    renderStudentView();
  };

  document.getElementById("openLessonBtn").onclick = () => {
    currentTab = "lesson";
    setActiveTab(tabLesson);
    renderCurrent();
  };
}

function renderLessonView() {
  const student = getStudentByName(selectedStudentName);
  const recommended = recommendLesson(student);

  viewLesson.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2 style="margin:0;">Lesson</h2>
        <span class="badge ${student.lastScore < 60 ? "badge-risk" : "badge-ok"}">${student.name}</span>
      </div>

      <p style="margin-top:10px;"><strong>Today’s Recommended Lesson (AI):</strong> ${recommended}</p>

      <div class="card-actions">
        <button class="primary-btn" id="completeLesson">Mark as Completed</button>
        <button class="ghost-btn" id="backStudent">Back to Student</button>
      </div>
    </div>

    <div class="card">
      <h3 style="margin:0;">Mini Practice</h3>
      <p style="margin-top:10px;">Q1) What is 1/2 + 1/4 ?</p>
      <button class="ghost-btn" id="showAnswer">Show Answer</button>
      <p class="muted" style="margin-top:10px;">Next step: update progress and adjust recommendations.</p>
    </div>

    <div class="card">
      <h3 style="margin:0;">Why this recommendation?</h3>
      <ul class="list">
        <li>Last score is ${student.lastScore}% ${student.lastScore < 60 ? "(below 60%)" : ""}</li>
        <li>Weak skill detected: ${student.weakSkill}</li>
        <li>Rule-based logic: low score → targeted practice</li>
      </ul>
      <p class="muted">Explainable logic (not a black-box model).</p>
    </div>
  `;

  document.getElementById("showAnswer").onclick = () => alert("Correct answer: 3/4");

  document.getElementById("completeLesson").onclick = () => {
    addIntervention(student.name, `Completed lesson: ${recommended}`);
    alert("Completed ✅");
    currentTab = "student";
    setActiveTab(tabStudent);
    renderCurrent();
  };

  document.getElementById("backStudent").onclick = () => {
    currentTab = "student";
    setActiveTab(tabStudent);
    renderCurrent();
  };
}

function renderInsightsView() {
  const atRisk = students.filter(s => s.lastScore < 60).length;
  const avgScore = Math.round(students.reduce((sum, s) => sum + s.lastScore, 0) / students.length);

  viewInsights.innerHTML = `
    <div class="card">
      <h2 style="margin:0;">AI Insights</h2>
      <p style="margin-top:10px;"><strong>Class Average Score:</strong> ${avgScore}%</p>
      <p><strong>Students At Risk:</strong> ${atRisk} / ${students.length}</p>
    </div>

    <div class="card">
      <h3 style="margin:0;">What-If Simulation</h3>

      <label class="muted small" style="display:block; margin-top:10px;">Simulated next score</label>
      <input id="simScore" type="range" min="40" max="100" value="52" style="width:100%;" />

      <div style="margin-top:10px;">
        <strong id="simValue">52%</strong>
        <span id="simStatus" class="badge badge-risk" style="margin-left:10px;">At Risk</span>
      </div>

      <p class="muted" style="margin-top:8px;">
        If score ≥ 70%, status changes to <strong>On Track</strong>.
      </p>
    </div>

    <div class="card">
      <h3 style="margin:0;">Suggested Actions</h3>
      <ul class="list">
        <li>Assign a quick refresher to students scoring below 60%.</li>
        <li>Schedule a 10-minute small group review for weak skills.</li>
        <li>Use mastery checks after each lesson to update recommendations.</li>
      </ul>
      <p class="muted">This prototype uses explainable, rule-based logic to simulate AI decisions.</p>
    </div>

    <div class="card">
      <h3 style="margin:0;">Intervention Comparison</h3>
      <p style="margin-top:10px;"><strong>Practice</strong> → +18% improvement (simulated)</p>
      <p><strong>No action</strong> → −5% decline (simulated)</p>
      <p class="muted">Shown for demo purposes to explain decision-support thinking.</p>
    </div>
  `;

  const sim = document.getElementById("simScore");
  const simValue = document.getElementById("simValue");
  const simStatus = document.getElementById("simStatus");

  function updateSim(val) {
    simValue.innerText = `${val}%`;
    if (Number(val) >= 70) {
      simStatus.innerText = "On Track";
      simStatus.classList.remove("badge-risk");
      simStatus.classList.add("badge-ok");
    } else {
      simStatus.innerText = "At Risk";
      simStatus.classList.remove("badge-ok");
      simStatus.classList.add("badge-risk");
    }
  }

  updateSim(sim.value);
  sim.addEventListener("input", () => updateSim(sim.value));
}

function renderInterventionsList(onlyStudentName) {
  const items = onlyStudentName
    ? interventions.filter(i => i.student === onlyStudentName)
    : interventions;

  if (items.length === 0) {
    return `<p class="muted">No interventions yet. AI will suggest actions when risk increases.</p>`;
  }

  const top = items.slice(0, 6);
  return `
    <ul class="list">
      ${top.map(i => `<li><strong>${i.student}</strong> — ${i.action} <span class="muted small">(${i.ts})</span></li>`).join("")}
    </ul>
  `;
}

// -----------------------
// Autocomplete (top search)
// -----------------------
function getAutocompleteMatches(query) {
  const q = normalize(query);
  if (!q) return [];

  // Starts-with matches first (your request)
  const starts = students.filter(s => normalize(s.name).startsWith(q));
  // fallback contains
  const contains = students.filter(s => !starts.includes(s) && normalize(s.name).includes(q));

  return [...starts, ...contains].slice(0, 7);
}

function closeDropdown() {
  if (!searchDropdown) return;
  searchDropdown.style.display = "none";
  searchDropdown.innerHTML = "";
  ddIndex = -1;
}

function openDropdown(items) {
  if (!searchDropdown) return;

  if (!items.length) {
    closeDropdown();
    return;
  }

  searchDropdown.innerHTML = items.map((s, idx) => {
    const tag = s.lastScore < 60 ? "At Risk" : "On Track";
    return `
      <button class="search-item" type="button" data-name="${s.name}" data-idx="${idx}">
        <div class="left">
          <div class="name">${s.name}</div>
          <div class="meta">${s.progress}% • ${s.lastScore}% • ${s.weakSkill}</div>
        </div>
        <span class="tag">${tag}</span>
      </button>
    `;
  }).join("");

  searchDropdown.style.display = "block";

  searchDropdown.querySelectorAll(".search-item").forEach(btn => {
    btn.onclick = () => {
      const name = btn.getAttribute("data-name");
      setSelectedStudentByName(name);

      // jump to student view
      currentTab = "student";
      setActiveTab(tabStudent);
      renderCurrent();

      // clear + close
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      closeDropdown();
      if (searchInput) searchInput.blur();
    };
  });
}

function highlightDropdownIndex() {
  if (!searchDropdown) return;
  const items = [...searchDropdown.querySelectorAll(".search-item")];
  items.forEach(el => el.classList.remove("active"));

  if (ddIndex >= 0 && ddIndex < items.length) {
    items[ddIndex].classList.add("active");
    items[ddIndex].scrollIntoView({ block: "nearest" });
  }
}

// -----------------------
// Navigation
// -----------------------
tabTeacher.onclick  = () => { currentTab = "teacher";  setActiveTab(tabTeacher);  renderCurrent(); };
tabStudent.onclick  = () => { currentTab = "student";  setActiveTab(tabStudent);  renderCurrent(); };
tabLesson.onclick   = () => { currentTab = "lesson";   setActiveTab(tabLesson);   renderCurrent(); };
tabInsights.onclick = () => { currentTab = "insights"; setActiveTab(tabInsights); renderCurrent(); };

// Sidebar AI toggle
toggleAi.addEventListener("change", (e) => {
  aiEnabled = !!e.target.checked;
  renderCurrent();
});

// Search input behavior
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value || "";

  // Update dashboard filtering while typing (nice touch)
  if (currentTab === "teacher") renderCurrent();

  // Autocomplete dropdown
  const matches = getAutocompleteMatches(searchQuery);
  openDropdown(matches);
});

searchInput.addEventListener("keydown", (e) => {
  if (!searchDropdown || searchDropdown.style.display === "none") return;

  const items = [...searchDropdown.querySelectorAll(".search-item")];
  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    ddIndex = Math.min(items.length - 1, ddIndex + 1);
    highlightDropdownIndex();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    ddIndex = Math.max(0, ddIndex - 1);
    highlightDropdownIndex();
  } else if (e.key === "Enter") {
    if (ddIndex >= 0 && ddIndex < items.length) {
      e.preventDefault();
      items[ddIndex].click();
    }
  } else if (e.key === "Escape") {
    closeDropdown();
  }
});

document.addEventListener("click", (e) => {
  const wrap = document.querySelector(".search-wrap");
  if (!wrap) return;
  if (!wrap.contains(e.target)) closeDropdown();
});

// -----------------------
// Initial load
// -----------------------
renderCurrent();
