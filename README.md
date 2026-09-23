# Capstone Title Feasibility & Defensibility Evaluator

An Apple-styled, mobile-optimized, encrypted decision-support system designed for collegiate engineering, computer science, and IT research teams. It enables researchers to evaluate **at least 2 and up to 9 proposed capstone titles** using a clean, closed-choice 18-question Likert rubric, 6 weighted feasibility meters, an immediate disqualification filter ("The Red Line"), and an automated Composite Score (CTS) calculation engine.

---

## 🌟 Key Features

- **Minimalist, Distraction-Free Questions**: Only the clean question title and concise radio options are shown—eliminating clutter and long paragraph walls for maximum answering speed.
- **Pre-Evaluation Start Menu (2 to 9 Titles)**:
  - Choose exactly how many candidate titles to evaluate (**2 to 9 titles**).
  - Type the proposed titles and set up your research team.
- **Working Database with End-to-End Encryption & Room Codes**:
  - Automatically generates a 6-character Room Code (e.g. `CAP-7842`).
  - **AES-256-GCM client-side encryption** via the Web Crypto API. The Room Code serves as the private decryption key.
  - Anyone with the Room Code can join the room, fill out their evaluation, and see **live shared results and group consensus** in real-time!
- **The Red Line (Immediate Disqualification)**:
  - If any evaluator selects `[1]` on **Q1 (Programming Capability)**, **Q4 (Dataset Access)**, or **Q5 (Institutional / Legal Clearances)**, the title is dropped immediately and marked Disqualified regardless of CTS.
- **6 Weighted Feasibility Meters**:
  - **Meter 1**: Technical Stack & Skill Competency (**20%**)
  - **Meter 2**: Institutional, Data, & Ethical Clearance (**20%**)
  - **Meter 3**: Panel Defensibility & Algorithmic Depth (**20%**)
  - **Meter 4**: Scope Delimitation & Anti-Creep (**15%**)
  - **Meter 5**: Empirical Validation & Testing Rigor (**15%**)
  - **Meter 6**: Team Velocity & Work Distribution (**10%**)
- **Composite Score (CTS) Formula**:
  $$\text{CTS} = (M_1 \times 0.20) + (M_2 \times 0.20) + (M_3 \times 0.20) + (M_4 \times 0.15) + (M_5 \times 0.15) + (M_6 \times 0.10)$$
- **Adviser Decision Thresholds**:
  - $\text{CTS} \ge 4.00$: **Approved Finalist** (Ready for adviser endorsement and defense presentation).
  - $3.30 \le \text{CTS} < 4.00$: **Conditional Backup** (Requires cutting or delimiting risky modules).
  - $\text{CTS} < 3.30$: **Discarded** (Fails feasibility or academic depth thresholds).
- **Mobile-First Apple Design**:
  - Touch targets $\ge 48\text{px}$, smooth spring transitions (`active:scale-[0.98]`).
  - Mobile bottom floating scorecard with real-time CTS and Red Line alert indicators.
  - Printable **Adviser Defense Report** with formal signature blocks.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run locally in development
npm run dev

# 3. Run automated tests
npx tsx test/verify-crypto.mjs
npx tsx test/verify-scoring.mjs

# 4. Production build
npm run build
```

---

## 🔐 How Room Codes & Encrypted Sync Work

1. **Host Creates a Room**:
   - Go to the Start Menu $\rightarrow$ Select number of titles (e.g. 3 titles) $\rightarrow$ Enter title names $\rightarrow$ Click **"Create Encrypted Room"**.
   - A unique 6-character code is generated (e.g., `CAP-7842`).
2. **Share Code with Co-Researchers**:
   - Click **"Copy Code"** or **"Share Link"** in the top bar.
3. **Co-Researchers Join**:
   - Other researchers open the website $\rightarrow$ Click **"Join with Code"** $\rightarrow$ Enter `CAP-7842` and their name.
   - The room data is decrypted in their browser using Web Crypto AES-256-GCM.
4. **Live Collaborative Results**:
   - As each researcher answers questions, scores are synced to the cloud.
   - Switch between individual evaluations or view the **Consolidated Group Consensus** and **Comparison Matrix** together!

---

## ⚡ Deployment to Vercel

The project is pre-configured with `vercel.json` (including cache-busting headers) and serverless function `/api/room.ts`:
1. Push to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Vercel automatically deploys the latest commit.

---

## 📄 License
MIT License. Free for academic and research evaluation use.
