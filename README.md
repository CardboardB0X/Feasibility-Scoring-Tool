# Capstone Title Feasibility & Defensibility Evaluator

A web-based closed-choice decision support system designed for collegiate engineering, computer science, and IT research teams. It enables researchers and thesis panels to rigorously evaluate proposed capstone titles using a 18-question Likert rubric, 6 weighted feasibility meters, an immediate disqualification filter ("The Red Line"), and an automated Composite Score (CTS) calculation engine.

---

## 🌟 Features

- **100% Closed-Choice Discrete Radio Interface**: 18 structured questions with custom, domain-specific descriptive anchors for every choice (1 to 5 points).
- **The Red Line (Immediate Disqualification)**: Instant visual warning and project drop if any evaluator gives a score of `[1]` on **Q1 (Programming Capability)**, **Q4 (Dataset Access)**, or **Q5 (Institutional/Legal Clearances)**.
- **6 Weighted Feasibility Meters**:
  - **Meter 1**: Technical Stack & Skill Competency (**20%**)
  - **Meter 2**: Institutional, Data, & Ethical Clearance (**20%**)
  - **Meter 3**: Panel Defensibility & Algorithmic Depth (**20%**)
  - **Meter 4**: Scope Delimitation & Anti-Creep (**15%**)
  - **Meter 5**: Empirical Validation & Testing Rigor (**15%**)
  - **Meter 6**: Team Velocity & Work Distribution (**10%**)
- **Consolidated Composite Score (CTS)**:
  $$\text{CTS} = (M_1 \times 0.20) + (M_2 \times 0.20) + (M_3 \times 0.20) + (M_4 \times 0.15) + (M_5 \times 0.15) + (M_6 \times 0.10)$$
- **Adviser Presentation Filter**:
  - $\text{CTS} \ge 4.00$: **Approved Finalist** (Ready for adviser endorsement and defense presentation).
  - $3.30 \le \text{CTS} < 4.00$: **Conditional Backup** (Acceptable only after delimiting or cutting risky modules).
  - $\text{CTS} < 3.30$: **Discarded** (Fails feasibility or academic depth thresholds).
- **Multi-Title Matrix (9+ Titles)**: Compare up to 9 (or more) candidate titles in a real-time leaderboard with sorting and filtering.
- **Multi-Researcher Consensus**: Allows individual members (Lead Dev, Data Engineer, QA/Docs) to evaluate titles separately or view consolidated group consensus.
- **Export & Presentation Tools**:
  - Export all title evaluations to **CSV**.
  - Backup & restore evaluations via **JSON**.
  - Printable **Adviser Presentation & Defense Report** with committee signature blocks.
- **Preloaded Benchmark Dataset**: One-click "Load Benchmark Sample" with 9 diverse capstone titles (Computer Vision, IoT, Healthcare AI, Robotics, Blockchain, EdTech, etc.) demonstrating every evaluation outcome.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Run Locally
```bash
# 1. Clone repository
git clone <your-repo-url>
cd "Scoring Scale"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Run Automated Scoring Engine Verification
```bash
npx tsx test/verify-scoring.mjs
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📦 How to Post to GitHub

Follow these steps to upload your project to GitHub:

### Step 1: Initialize Git in the Project Folder
Open your terminal (PowerShell or Bash) in this project folder:
```bash
git init
git add .
git commit -m "feat: initial commit of Capstone Title Feasibility Evaluator"
```

### Step 2: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Enter a repository name (e.g., `capstone-feasibility-evaluator`).
3. Choose **Public** or **Private**.
4. Leave "Add a README file" unchecked (since we already have one).
5. Click **Create repository**.

### Step 3: Link and Push to GitHub
Copy the commands shown on GitHub and run them:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

---

## ⚡ How to Deploy to Vercel

Vercel provides automatic deployments and fast global CDN hosting for Vite applications.

### Method 1: Deploy via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Select your GitHub repository (`capstone-feasibility-evaluator`) and click **"Import"**.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**.
6. In about 30 seconds, your site will be live with a free `*.vercel.app` URL (e.g., `https://capstone-feasibility-evaluator.vercel.app`)!

### Method 2: Deploy via Vercel CLI
You can also deploy directly from your terminal:
```bash
# Run Vercel CLI
npx vercel

# Follow the on-screen prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope? (Select your account)
# ? Link to existing project? [y/N] n
# ? What's your project's name? capstone-feasibility-evaluator
# ? In which directory is your code located? ./
# Vercel will build and deploy your project automatically.

# For production deployment:
npx vercel --prod
```

---

## 📊 Rubric Reference

### Master Likert Anchors
- `[1]` **Strongly Disagree** (Critical blocker / Major risk)
- `[2]` **Disagree** (Significant friction / Major doubts)
- `[3]` **Neutral / Uncertain** (Passable with reservations)
- `[4]` **Agree** (Low risk / Clear path forward)
- `[5]` **Strongly Agree** (Optimal condition / Zero blocker)

### The 18 Closed-Choice Questions
- **Meter 1: Technical Stack & Skill Competency (20%)**
  - **Q1**: Programming capability to write core logic without hiring external programmers. *(Red Line if 1)*
  - **Q2**: Libraries, frameworks, or APIs are open-source, free, and well-documented.
  - **Q3**: System can be built and run entirely on laptops and hardware already owned.
- **Meter 2: Institutional, Data, & Ethical Clearance (20%)**
  - **Q4**: Raw dataset, sensor feed, or API access is already in hand or downloadable. *(Red Line if 1)*
  - **Q5**: Project requires formal institutional or legal clearance (Hospital Ethics, MOA). *(Red Line if 1)*
  - **Q6**: Compliance with Data Privacy Laws.
- **Meter 3: Panel Defensibility & Algorithmic Depth (20%)**
  - **Q7**: Primary technical core of proposed capstone (CRUD vs Algorithm vs ML).
  - **Q8**: Ability to justify technical decisions during panel grilling.
  - **Q9**: Problem cannot be solved by off-the-shelf tools (Google Forms, Excel).
- **Meter 4: Scope Delimitation & Anti-Creep (15%)**
  - **Q10**: Boundary of project strictly defined in Chapter 1.
  - **Q11**: Dependence on uncontrollable external conditions.
  - **Q12**: Modular decoupling if a complex feature fails.
- **Meter 5: Empirical Validation & Testing Rigor (15%)**
  - **Q13**: Measurement of system success and accuracy.
  - **Q14**: Baseline system or benchmark for comparative evaluation.
  - **Q15**: Feasibility of recruiting 20 to 30 test users within 7 days.
- **Meter 6: Team Velocity & Work Distribution (10%)**
  - **Q16**: Division of technical tasks among all researchers.
  - **Q17**: Realistic timeline to build MVP.
  - **Q18**: Teaches high-demand skills for post-graduation employability.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Animation & Visuals**: Canvas Confetti
- **Deployment Target**: Vercel (`vercel.json` included) + GitHub Pages ready

---

## 📄 License
MIT License. Free for academic and research evaluation use.
