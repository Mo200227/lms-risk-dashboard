# Dynamic Active — AI LMS Prototype (Front-End)

Dynamic Active is a teacher-first Learning Management System (LMS) prototype that demonstrates **explainable, rule-based “AI” decision support** for tracking student progress, identifying at-risk learners, and recommending targeted lessons — all in a **front-end only** web app (no backend).

## Demo Features
- **Teacher Dashboard (Quick Overview)**
  - Class summary cards: total students, at-risk count, average score
  - “Class Skill Signals” pills showing common weak skill areas
  - Intervention history log (nudges, bulk assignments, notes, completed lessons)
  - At-risk filtering + bulk actions (assign refresher, send nudges)

- **Students View**
  - Clickable roster list (left) → detailed student panel (right)
  - Progress + score indicators, weak skill, and risk status badges
  - Teacher notes (saved per student in-memory)
  - AI recommendation section with per-view AI toggle
  - “Open Lesson” workflow

- **Lessons View**
  - Recommended lesson based on student weak skill (rule-based)
  - Mini practice question + explainability (“Why this recommendation?”)
  - Mark lesson complete → logs intervention + returns to student view

- **AI Insights**
  - Class-level summary + explainable “What-If” simulation slider
  - Live status change based on score threshold (≥ 70 → On Track)

- **Search Autocomplete**
  - Top-right search supports **starts-with** matching first (e.g., type “A” → Aisha)
  - Keyboard navigation (↑ ↓ Enter) + click-to-jump to student profile

## Tech Stack
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**

## How the “AI” Works (Explainable Rules)
This prototype uses transparent, rule-based logic (not ML):
- If `lastScore < 60` → **At Risk** and recommend review of `weakSkill`
- If `progress < 50` → **Behind pace**
- Otherwise → **On Track**
- Recommended lesson = first lesson matching `weakSkill`

## Getting Started
1. Download or clone the repo
2. Open `index.html` in your browser (or use a local server)

### Optional (recommended) local server
- VS Code: install **Live Server** extension → right-click `index.html` → **Open with Live Server**
- Or run:
  ```bash
  python -m http.server 5500
