# LMS Risk Dashboard: Front-End Prototype

A teacher-facing Learning Management System prototype that demonstrates **explainable, rule-based decision support** for tracking student progress, flagging at-risk learners, and recommending targeted lessons. Front-end only (HTML, CSS, vanilla JavaScript), with no backend and no ML.

## Demo Features

- **Teacher Dashboard (Quick Overview)**
  - Class summary cards: total students, at-risk count, average score
  - "Class Skill Signals" pills showing common weak skill areas
  - Intervention history log (nudges, bulk assignments, notes, completed lessons)
  - At-risk filtering + bulk actions (assign refresher, send nudges)

- **Students View**
  - Clickable roster list (left) and detailed student panel (right)
  - Progress + score indicators, weak skill, and risk status badges
  - Teacher notes (saved per student in memory)
  - Recommendation section with a per-view toggle
  - "Open Lesson" workflow

- **Lessons View**
  - Recommended lesson based on the student's weak skill (rule-based)
  - Mini practice question + explainability ("Why this recommendation?")
  - Mark lesson complete: logs an intervention and returns to the student view

- **Insights**
  - Class-level summary + explainable "What-If" simulation slider
  - Live status change based on a score threshold (70 or above = On Track)

- **Search Autocomplete**
  - Top-right search matches names that start with the typed letters first (e.g., type "A" to find Aisha)
  - Keyboard navigation (Up, Down, Enter) + click to jump to a student profile

## Tech Stack

- HTML5
- CSS3
- JavaScript (vanilla)

## How the Recommendations Work (Explainable Rules)

This prototype uses transparent, rule-based logic (not machine learning):

- If `lastScore < 60`: **At Risk**, and recommend a review of `weakSkill`
- If `progress < 50`: **Behind pace**
- Otherwise: **On Track**
- Recommended lesson = the first lesson matching `weakSkill`

## Getting Started

1. Download or clone the repo
2. Open `index.html` in your browser (or use a local server)

### Optional local server

- VS Code: install the **Live Server** extension, right-click `index.html`, then choose **Open with Live Server**
- Or run:

```bash
  python -m http.server 5500
```

  Then open http://localhost:5500
