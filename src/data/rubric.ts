import { MeterDefinition, Question } from '../types/scoring';

export const METERS: MeterDefinition[] = [
  {
    id: 1,
    name: "Meter 1: Technical Stack & Skill Competency",
    shortName: "Tech Stack & Skills",
    weight: 0.20,
    weightPercentage: 20,
    description: "Evaluates team programming capability, developer ecosystem documentation, and required hardware constraints.",
    questionIds: ["Q1", "Q2", "Q3"]
  },
  {
    id: 2,
    name: "Meter 2: Institutional, Data, & Ethical Clearance",
    shortName: "Data & Clearances",
    weight: 0.20,
    weightPercentage: 20,
    description: "Assesses dataset availability, ethics board / MOA approvals, and data privacy compliance risks.",
    questionIds: ["Q4", "Q5", "Q6"]
  },
  {
    id: 3,
    name: "Meter 3: Panel Defensibility & Algorithmic Depth",
    shortName: "Panel Defensibility",
    weight: 0.20,
    weightPercentage: 20,
    description: "Measures computational core depth, algorithmic defense readiness, and novelty over off-the-shelf tools.",
    questionIds: ["Q7", "Q8", "Q9"]
  },
  {
    id: 4,
    name: "Meter 4: Scope Delimitation & Anti-Creep",
    shortName: "Scope Delimitation",
    weight: 0.15,
    weightPercentage: 15,
    description: "Verifies boundary crispness in Chapter 1, external environmental dependencies, and modular failure resilience.",
    questionIds: ["Q10", "Q11", "Q12"]
  },
  {
    id: 5,
    name: "Meter 5: Empirical Validation & Testing Rigor",
    shortName: "Validation & Testing",
    weight: 0.15,
    weightPercentage: 15,
    description: "Evaluates measurable quantitative benchmarks, comparative baselines, and test user participant access.",
    questionIds: ["Q13", "Q14", "Q15"]
  },
  {
    id: 6,
    name: "Meter 6: Team Velocity & Work Distribution",
    shortName: "Team Velocity",
    weight: 0.10,
    weightPercentage: 10,
    description: "Analyzes balanced technical task allocation, MVP timeline velocity, and post-graduation marketability.",
    questionIds: ["Q16", "Q17", "Q18"]
  }
];

export const QUESTIONS: Question[] = [
  // --- METER 1 ---
  {
    id: "Q1",
    number: 1,
    meterId: 1,
    meterName: "Technical Stack & Skill Competency",
    text: "Our team has the programming capability to write the core logic without hiring an external programmer.",
    isRedLineQuestion: true,
    redLineWarning: "Selecting [1] triggers Immediate Disqualification: If no one knows how to build the core engine, the capstone cannot be completed.",
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "No one in the group knows how to build the core engine",
        isRedLineTrigger: true
      },
      {
        point: 2,
        label: "Disagree",
        description: "Only 1 person has basic knowledge; massive learning curve"
      },
      {
        point: 3,
        label: "Neutral",
        description: "We know the basics, but will struggle with core implementation"
      },
      {
        point: 4,
        label: "Agree",
        description: "At least 2 members have solid familiarity with the stack"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Entire team or lead dev has already built similar systems"
      }
    ]
  },
  {
    id: "Q2",
    number: 2,
    meterId: 1,
    meterName: "Technical Stack & Skill Competency",
    text: "The required libraries, frameworks, or APIs are open-source, free, and well-documented.",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "Requires paid enterprise APIs or unmaintained libraries"
      },
      {
        point: 2,
        label: "Disagree",
        description: "Documentation is sparse, outdated, or in a foreign language"
      },
      {
        point: 3,
        label: "Neutral",
        description: "Free tier exists, but has strict rate limits"
      },
      {
        point: 4,
        label: "Agree",
        description: "Standard open-source libraries with active community support"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Industry standard tools with extensive documentation and tutorials"
      }
    ]
  },
  {
    id: "Q3",
    number: 3,
    meterId: 1,
    meterName: "Technical Stack & Skill Competency",
    text: "The system can be built and run entirely on the laptops and hardware the team already owns.",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "Requires buying expensive GPUs, servers, or rare sensors"
      },
      {
        point: 2,
        label: "Disagree",
        description: "Requires renting cloud compute that exceeds our student budget"
      },
      {
        point: 3,
        label: "Neutral",
        description: "Current laptops will run it, but compilation/training will be very slow"
      },
      {
        point: 4,
        label: "Agree",
        description: "Runs on existing laptops with minor free cloud hosting tiers"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Fully runnable locally on any standard machine with zero extra hardware"
      }
    ]
  },

  // --- METER 2 ---
  {
    id: "Q4",
    number: 4,
    meterId: 2,
    meterName: "Institutional, Data, & Ethical Clearance",
    text: "The raw dataset, sensor feed, or API access is already in our hands or publicly downloadable.",
    isRedLineQuestion: true,
    redLineWarning: "Selecting [1] triggers Immediate Disqualification: If data does not exist or cannot be accessed, empirical capstone cannot proceed.",
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "Data does not exist yet; we have to scrape or manually gather everything",
        isRedLineTrigger: true
      },
      {
        point: 2,
        label: "Disagree",
        description: "Data belongs to a third party that hasn't agreed to share it"
      },
      {
        point: 3,
        label: "Neutral",
        description: "Public datasets exist, but require heavy cleaning and reformatting"
      },
      {
        point: 4,
        label: "Agree",
        description: "Verified open dataset or API key is already tested and working"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Dataset is downloaded and verified, or API is fully integrated"
      }
    ]
  },
  {
    id: "Q5",
    number: 5,
    meterId: 2,
    meterName: "Institutional, Data, & Ethical Clearance",
    text: "This project requires formal institutional or legal clearance (e.g., Hospital Ethics, Police, LGU, MOA).",
    isRedLineQuestion: true,
    redLineWarning: "Selecting [1] triggers Immediate Disqualification: Complex ethics boards or legal MOAs that take months will derail academic deadlines.",
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Yes, requires complex ethics board / legal MOA that takes months",
        isRedLineTrigger: true
      },
      {
        point: 2,
        label: "2 pts",
        description: "Yes, requires formal permission letters with high risk of rejection"
      },
      {
        point: 3,
        label: "3 pts",
        description: "Yes, but only simple department/school-level permission required"
      },
      {
        point: 4,
        label: "4 pts",
        description: "No, but we need informal consent forms from test users"
      },
      {
        point: 5,
        label: "5 pts",
        description: "No clearance, permits, or MOAs required whatsoever"
      }
    ]
  },
  {
    id: "Q6",
    number: 6,
    meterId: 2,
    meterName: "Institutional, Data, & Ethical Clearance",
    text: "Compliance with Data Privacy Laws (e.g., sensitive personal info, medical records, financial data).",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Handles highly sensitive personal/financial/health data with high liability"
      },
      {
        point: 2,
        label: "2 pts",
        description: "Handles private user data requiring complex encryption and legal disclaimers"
      },
      {
        point: 3,
        label: "3 pts",
        description: "Collects basic user profiles (emails, names) with standard risk"
      },
      {
        point: 4,
        label: "4 pts",
        description: "Handles only non-sensitive, operational business records"
      },
      {
        point: 5,
        label: "5 pts",
        description: "Zero private or sensitive human data used (uses synthetic/public telemetry data)"
      }
    ]
  },

  // --- METER 3 ---
  {
    id: "Q7",
    number: 7,
    meterId: 3,
    meterName: "Panel Defensibility & Algorithmic Depth",
    text: "What is the primary technical core of this proposed capstone?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Basic CRUD / Form-filling / Informational website"
      },
      {
        point: 2,
        label: "2 pts",
        description: "Standard database operations with basic search and filter"
      },
      {
        point: 3,
        label: "3 pts",
        description: "Integration of pre-built third-party API / Basic rule-based engine"
      },
      {
        point: 4,
        label: "4 pts",
        description: "Custom optimization algorithm, computer vision pipeline, or IoT sensor loop"
      },
      {
        point: 5,
        label: "5 pts",
        description: "Novel data pipeline, tailored ML model, or complex mathematical/logic system"
      }
    ]
  },
  {
    id: "Q8",
    number: 8,
    meterId: 3,
    meterName: "Panel Defensibility & Algorithmic Depth",
    text: "How easily can your team justify your technical decisions during an aggressive panel grilling?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "We cannot explain the math/architecture under pressure"
      },
      {
        point: 2,
        label: "Disagree",
        description: "Only 1 member understands the theory; high risk during individual Q&A"
      },
      {
        point: 3,
        label: "Neutral",
        description: "We can explain the high level, but struggle with low-level details"
      },
      {
        point: 4,
        label: "Agree",
        description: "We understand why we chose this algorithm/stack over alternatives"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Every member can defend the architectural trade-offs thoroughly"
      }
    ]
  },
  {
    id: "Q9",
    number: 9,
    meterId: 3,
    meterName: "Panel Defensibility & Algorithmic Depth",
    text: "The problem this title solves cannot be solved by a simple off-the-shelf tool (like Google Forms or Excel).",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "A Google Sheet or Shopify store solves this completely"
      },
      {
        point: 2,
        label: "Disagree",
        description: "A low-code or CMS tool can do 90% of what we are proposing"
      },
      {
        point: 3,
        label: "Neutral",
        description: "Partially solved by commercial tools, but lacks custom local integration"
      },
      {
        point: 4,
        label: "Agree",
        description: "Commercial tools are too expensive, rigid, or not tailored to the domain"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Requires a custom computational solution; zero off-the-shelf equivalents"
      }
    ]
  },

  // --- METER 4 ---
  {
    id: "Q10",
    number: 10,
    meterId: 4,
    meterName: "Scope Delimitation & Anti-Creep",
    text: "The boundary of this project is strictly defined and easy to delimit in Chapter 1.",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "Vague scope; panel can easily demand 5 extra features"
      },
      {
        point: 2,
        label: "Disagree",
        description: "Scope has several gray areas that invite panel expansion"
      },
      {
        point: 3,
        label: "Neutral",
        description: "Defined scope, but dependent on client feature requests"
      },
      {
        point: 4,
        label: "Agree",
        description: "Clear deliverables; easy to write what is in and out of scope"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Bulletproof scope; strictly bounded inputs, outputs, and modules"
      }
    ]
  },
  {
    id: "Q11",
    number: 11,
    meterId: 4,
    meterName: "Scope Delimitation & Anti-Creep",
    text: "The project relies on uncontrollable external conditions (e.g., weather, unstable client schedules).",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Highly dependent on factors we cannot control (e.g., outdoor rain, farm growth cycles)"
      },
      {
        point: 2,
        label: "2 pts",
        description: "Moderately dependent on an external business partner's responsiveness"
      },
      {
        point: 3,
        label: "3 pts",
        description: "Dependent on standard internet connectivity and basic client availability"
      },
      {
        point: 4,
        label: "4 pts",
        description: "Minimal external dependencies; can use simulated environments if needed"
      },
      {
        point: 5,
        label: "5 pts",
        description: "100% controlled inside a laboratory or local development environment"
      }
    ]
  },
  {
    id: "Q12",
    number: 12,
    meterId: 4,
    meterName: "Scope Delimitation & Anti-Creep",
    text: "If one complex module fails or gets cut, does the entire capstone collapse?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Yes, tightly coupled; if one part fails, the whole system cannot be demonstrated"
      },
      {
        point: 2,
        label: "2 pts",
        description: "High dependency; cutting a feature requires rewriting half the project"
      },
      {
        point: 3,
        label: "3 pts",
        description: "Moderate coupling; will require significant workarounds to isolate"
      },
      {
        point: 4,
        label: "4 pts",
        description: "Modular; if an advanced feature fails, the core system still functions"
      },
      {
        point: 5,
        label: "5 pts",
        description: "Fully decoupled architecture; modules can be demonstrated and defended independently"
      }
    ]
  },

  // --- METER 5 ---
  {
    id: "Q13",
    number: 13,
    meterId: 5,
    meterName: "Empirical Validation & Testing Rigor",
    text: "How will system success and accuracy be measured?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Purely subjective user feedback (\"Did users like the UI?\")"
      },
      {
        point: 2,
        label: "2 pts",
        description: "Basic checklist of working features without performance data"
      },
      {
        point: 3,
        label: "3 pts",
        description: "Standard Usability Scale (SUS) survey with 30 respondents"
      },
      {
        point: 4,
        label: "4 pts",
        description: "Mixed metrics: quantitative performance (latency/error rate) + user survey"
      },
      {
        point: 5,
        label: "5 pts",
        description: "Formal statistical/engineering benchmarks (e.g., Precision, Recall, F1, Load test)"
      }
    ]
  },
  {
    id: "Q14",
    number: 14,
    meterId: 5,
    meterName: "Empirical Validation & Testing Rigor",
    text: "Is there an existing benchmark, manual process, or baseline system to compare results against?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "No baseline exists; impossible to prove our system improved anything"
      },
      {
        point: 2,
        label: "Disagree",
        description: "Baseline is anecdotal or unrecorded"
      },
      {
        point: 3,
        label: "Neutral",
        description: "We must spend 2 weeks recording the manual process ourselves first"
      },
      {
        point: 4,
        label: "Agree",
        description: "Clear manual logbooks or standard operational metrics exist for comparison"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Established academic/industry benchmark or published ground-truth dataset exists"
      }
    ]
  },
  {
    id: "Q15",
    number: 15,
    meterId: 5,
    meterName: "Empirical Validation & Testing Rigor",
    text: "Can the team easily recruit 20 to 30 test users for evaluation within 7 days?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "Target users are rare/hard to reach: doctors, CEOs, government officials"
      },
      {
        point: 2,
        label: "Disagree",
        description: "Requires traveling to a remote community or securing special visitor passes"
      },
      {
        point: 3,
        label: "Neutral",
        description: "Target users are local businesses who must take time off work"
      },
      {
        point: 4,
        label: "Agree",
        description: "Target users are campus students, teachers, or our personal contacts"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Testing can be automated via test suites, scripts, or on-demand classmates"
      }
    ]
  },

  // --- METER 6 ---
  {
    id: "Q16",
    number: 16,
    meterId: 6,
    meterName: "Team Velocity & Work Distribution",
    text: "How easily can tasks be divided among all researchers?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Solo burden: 1 person does all the coding, others have nothing technical to do"
      },
      {
        point: 2,
        label: "2 pts",
        description: "Uneven: 1 person codes, 1 writes documentation, others are idle"
      },
      {
        point: 3,
        label: "3 pts",
        description: "Acceptable: Work split into UI, backend, and documentation"
      },
      {
        point: 4,
        label: "4 pts",
        description: "Good: Clear modular division (Frontend, Backend/API, Database, QA/Testing)"
      },
      {
        point: 5,
        label: "5 pts",
        description: "Perfect balance: Every member has an independent, defensible technical component"
      }
    ]
  },
  {
    id: "Q17",
    number: 17,
    meterId: 6,
    meterName: "Team Velocity & Work Distribution",
    text: "Realistic timeline to build a working Minimum Viable Product (MVP):",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "1 pt",
        description: "Over 12 weeks / Doubtful we can finish before final defense"
      },
      {
        point: 2,
        label: "2 pts",
        description: "9–11 weeks (Leaves almost no time for testing and paper revisions)"
      },
      {
        point: 3,
        label: "3 pts",
        description: "6–8 weeks (Standard timeline, moderate pressure)"
      },
      {
        point: 4,
        label: "4 pts",
        description: "4–5 weeks (Leaves ample time for testing, documentation, and mock defense)"
      },
      {
        point: 5,
        label: "5 pts",
        description: "2–3 weeks (Rapid prototype, maximum safety buffer)"
      }
    ]
  },
  {
    id: "Q18",
    number: 18,
    meterId: 6,
    meterName: "Team Velocity & Work Distribution",
    text: "Does this project teach skills that help group members get hired after graduation?",
    isRedLineQuestion: false,
    options: [
      {
        point: 1,
        label: "Strongly Disagree",
        description: "Uses obsolete tech; no portfolio value"
      },
      {
        point: 2,
        label: "Disagree",
        description: "Generic tech; unremarkable on a resume"
      },
      {
        point: 3,
        label: "Neutral",
        description: "Standard web/mobile tech; decent entry-level portfolio piece"
      },
      {
        point: 4,
        label: "Agree",
        description: "Modern, high-demand stack relevant to software/engineering roles"
      },
      {
        point: 5,
        label: "Strongly Agree",
        description: "Standout capstone project that will dominate interviews and portfolios"
      }
    ]
  }
];

export const MASTER_LIKERT_ANCHORS = [
  { point: 1, label: "[1] Strongly Disagree", note: "Critical blocker / Major risk" },
  { point: 2, label: "[2] Disagree", note: "Significant friction / Major doubts" },
  { point: 3, label: "[3] Neutral / Uncertain", note: "Passable with reservations" },
  { point: 4, label: "[4] Agree", note: "Low risk / Clear path forward" },
  { point: 5, label: "[5] Strongly Agree", note: "Optimal condition / Zero blocker" }
];
