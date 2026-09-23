# Capstone Title Feasibility & Defensibility Evaluator

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCardboardB0X%2FFeasibility-Scoring-Tool)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS_v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Encryption](https://img.shields.io/badge/AES--256--GCM-Zero--Knowledge-emerald?style=for-the-badge&logo=security)](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)

An Apple-minimalist, mobile-optimized, zero-knowledge encrypted decision support system designed for collegiate Computer Science, Engineering, and Information Technology research teams.

Evaluate **2 to 9 proposed capstone titles** using an 18-question closed-choice Likert rubric, 6 weighted feasibility meters, immediate disqualification filters ("The Red Line"), and an automated Composite Title Score (CTS) calculation engine.

---

## 🌟 Pages & Architecture

1. **Homepage (`/home`)**:
   - Clean Apple-minimalist presentation.
   - **Create Room**: Configure 2 to 9 proposed titles with an evaluator role.
   - **Join with Code**: Enter a 6-character room code (`CAP-XXXX`) to decrypt shared room data on the client.
   - **Demo Sample**: Instant benchmark exploration.
   - **Resume Active Room**: 1-click re-entry if an active room is stored.

2. **Dashboard Page (`/dashboard`)**:
   - Room code with 1-click copy and live AES-256 cloud sync badge.
   - Candidate title cards with live progress bars (`X/18 answered`).
   - Quick launch into Quizizz-style flashcard questionnaire or analytical outcomes.

3. **Questionnaire Page (`/questionnaire`) — Flashcard / Quizizz-Style**:
   - **100% Zero Spoilers**: Graphs, outcome meters, CTS gauges, and leaderboards are completely hidden during the questionnaire to eliminate cognitive bias.
   - **Tactile Flashcard Flow**: 1 focused question at a time with directional slide animations.
   - **Tactile Option Bounce**: Anchors 1 to 5 with explicit contextual definitions.
   - **Keyboard Navigation**: Press keys `1`–`5` to auto-advance; Left/Right arrow keys for back/forth.
   - **Celebration Confetti**: Full-screen confetti cannon on completing all 18 questions.

4. **Results & Outcomes Page (`/results`)**:
   - Composite Title Score (CTS) gauge and verdict badge.
   - 6-Meter feasibility breakdown with 3.30 threshold comparison bars.
   - Cross-title side-by-side comparison matrix and leaderboard.
   - Automated Adviser Defense Pitch with panel talking points.
   - Committee-ready printable PDF report with signature blocks.

5. **Edit Page (`/edit`)**:
   - Add, edit, or remove candidate titles (2 to 9 titles).
   - Manage evaluator team members and roles.

6. **Account Page (`/account`)**:
   - Researcher profile (name, email, role, avatar).
   - "My Saved Evaluation Rooms" catalog with 1-click re-entry.
   - Danger Zone: 1-click "Clear All Data & Reset App".

---

## 🔐 Zero-Knowledge End-to-End Encryption

All room data and user profiles are encrypted **client-side** using the browser's native Web Crypto API before transmission:

```
[Client Browser]
       │
       ▼  (AES-256-GCM Encryption with PBKDF2 100,000 rounds)
[Encrypted Ciphertext: {iv, ciphertext, version: 1}]
       │
       ▼  (HTTPS / REST / Serverless Relay)
[Persistent Cloud Database / KVDB / Vercel API]
       │
       ▼  (Opaque ciphertext blob stored & synced)
[Other Evaluator Devices]
       │
       ▼  (Decryption via Room Code or User Secret Key)
[Decrypted Evaluation State & Consolidated Consensus]
```

- **Room Data**: Key derived from the 6-character Room Code (`CAP-XXXX`).
- **User Accounts**: Key derived from user email and salted password hash.
- **Zero-Knowledge**: Neither Vercel serverless functions nor KVDB stores can inspect room titles, scores, or evaluator responses in plaintext.

---

## 📐 The Master Scoring Rubric

### 6 Weighted Feasibility Meters
| Meter | Feasibility Dimension | Weight | Questions |
| :--- | :--- | :---: | :---: |
| **M1** | Technical Stack & Skill Competency | **20%** | Q1, Q2, Q3 |
| **M2** | Institutional, Data, & Ethical Clearance | **20%** | Q4, Q5, Q6 |
| **M3** | Panel Defensibility & Algorithmic Depth | **20%** | Q7, Q8, Q9 |
| **M4** | Scope Delimitation & Anti-Creep | **15%** | Q10, Q11, Q12 |
| **M5** | Empirical Validation & Testing Rigor | **15%** | Q13, Q14, Q15 |
| **M6** | Team Velocity & Work Distribution | **10%** | Q16, Q17, Q18 |

### Discrete 5-Point Anchor Scale
- `[1]` Strongly Disagree (Critical blocker / Major risk)
- `[2]` Disagree (Significant friction / Major doubts)
- `[3]` Neutral / Uncertain (Passable with reservations)
- `[4]` Agree (Low risk / Clear path forward)
- `[5]` Strongly Agree (Optimal condition / Zero blocker)

### 🚨 The Red Line Rule (Immediate Disqualification)
If any evaluator selects `[1]` on any of the three fatal criteria:
1. **Q1 = 1**: Team lacks internal programming competence to build the core engine.
2. **Q4 = 1**: Hardware components, specialized sensors, or compute environments are unobtainable.
3. **Q5 = 1**: Dataset or APIs are proprietary, confidential, or blocked by ethics/IRB clearances.

The candidate title is **immediately dropped** and marked **Disqualified** regardless of its overall score.

### Composite Title Score (CTS) Formula
$$\text{CTS} = (M_1 \times 0.20) + (M_2 \times 0.20) + (M_3 \times 0.20) + (M_4 \times 0.15) + (M_5 \times 0.15) + (M_6 \times 0.10)$$

### Decision Thresholds
- **$\text{CTS} \ge 4.00$**: **Approved Finalist** (Green light for defense presentation).
- **$3.30 \le \text{CTS} < 4.00$**: **Conditional Backup** (Cut high-risk modules before proposal).
- **$\text{CTS} < 3.30$**: **Discarded** (Lacks technical depth or feasibility).

---

## 🚀 Public Deployment to Vercel

### Option 1: 1-Click Import from GitHub
1. Fork or push this repository to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **"Add New..."** $\rightarrow$ **"Project"**.
3. Import `CardboardB0X/Feasibility-Scoring-Tool`.
4. Leave build settings as default:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your site will be live on a `*.vercel.app` domain with instant HTTPS and serverless API functions!

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/CardboardB0X/Feasibility-Scoring-Tool.git
cd Feasibility-Scoring-Tool

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suites (74 tests)
npm test

# 5. Production build
npm run build
```

---

## 🧪 Automated Test Suite (74/74 Passing)

```bash
npm test
```
- `test/verify-scoring.mjs`: 23 tests (rubric weights, red line triggers, CTS calculations)
- `test/verify-crypto.mjs`: 21 tests (AES-256-GCM encryption, room codes, tamper rejection)
- `test/verify-auth.mjs`: 21 tests (SHA-256 password hashing, cross-device sessions, history)
- `test/verify-cloud-db.mjs`: 9 tests (cloud KV persistence, local caching, multi-engine fallback)

---

## 📄 License
MIT License. Free for academic, university, and research team evaluation use.
