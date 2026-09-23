import { CapstoneTitle, Researcher } from '../types/scoring';

export const DEFAULT_RESEARCHERS: Researcher[] = [
  { id: 'R1', name: 'Lead Dev (Researcher 1)', role: 'Core Logic & Architecture', avatarColor: 'bg-blue-600' },
  { id: 'R2', name: 'Data Specialist (Researcher 2)', role: 'Data Pipelines & Algorithms', avatarColor: 'bg-emerald-600' },
  { id: 'R3', name: 'QA & Docs (Researcher 3)', role: 'Testing & Empirical Validation', avatarColor: 'bg-purple-600' }
];

export const INITIAL_TITLES: CapstoneTitle[] = [
  {
    id: 'TITLE-1',
    title: 'Automated Campus Waste Segregation & Telemetry using Edge Computer Vision',
    description: 'Hardware bin running lightweight MobileNet to classify recyclable, biodegradable, and non-biodegradable waste in real-time.',
    category: 'Computer Vision / IoT',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 5, Q2: 5, Q3: 4, // M1: 4.67
        Q4: 5, Q5: 5, Q6: 5, // M2: 5.00
        Q7: 4, Q8: 4, Q9: 5, // M3: 4.33
        Q10: 4, Q11: 4, Q12: 4, // M4: 4.00
        Q13: 5, Q14: 4, Q15: 5, // M5: 4.67
        Q16: 4, Q17: 4, Q18: 5  // M6: 4.33
      }
    }
  },
  {
    id: 'TITLE-2',
    title: 'Smart Aquaculture Water Quality Monitoring & Dissolved Oxygen Predictive Regulating Loop',
    description: 'IoT sensor buoy utilizing time-series forecasting (LSTM) to alert fishpond operators and trigger aerator switches.',
    category: 'IoT / Embedded Systems',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 4, Q2: 4, Q3: 4,
        Q4: 4, Q5: 4, Q6: 5,
        Q7: 4, Q8: 4, Q9: 4,
        Q10: 4, Q11: 3, Q12: 4,
        Q13: 4, Q14: 4, Q15: 4,
        Q16: 4, Q17: 4, Q18: 4
      }
    }
  },
  {
    id: 'TITLE-3',
    title: 'Intelligent Traffic Signal Timing Optimization using YOLOv8 Vehicle Density Estimation',
    description: 'Real-time adaptive green-light duration calculation based on live camera density counters at high-congestion intersections.',
    category: 'AI / Intelligent Transportation',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 4, Q2: 5, Q3: 4,
        Q4: 4, Q5: 4, Q6: 4,
        Q7: 4, Q8: 4, Q9: 4,
        Q10: 4, Q11: 4, Q12: 4,
        Q13: 5, Q14: 4, Q15: 4,
        Q16: 4, Q17: 4, Q18: 5
      }
    }
  },
  {
    id: 'TITLE-4',
    title: 'Cross-Platform Adaptive Micro-Learning System with Spaced Repetition Logic',
    description: 'Student learning assistant implementing SuperMemo SM-2 spaced repetition algorithms for board exam flashcards.',
    category: 'EdTech / Mobile App',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 4, Q2: 4, Q3: 5,
        Q4: 4, Q5: 4, Q6: 3,
        Q7: 3, Q8: 3, Q9: 3,
        Q10: 3, Q11: 4, Q12: 4,
        Q13: 3, Q14: 4, Q15: 4,
        Q16: 4, Q17: 4, Q18: 4
      }
    }
  },
  {
    id: 'TITLE-5',
    title: 'Audio-Spectrogram Acoustic Analysis for Early Respiratory Wheezing Detection',
    description: 'CNN model trained on digital stethoscope acoustic recordings to detect wheezes and crackles.',
    category: 'Biomedical Signal Processing',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 4, Q2: 4, Q3: 4,
        Q4: 4, Q5: 3, Q6: 3,
        Q7: 4, Q8: 4, Q9: 4,
        Q10: 3, Q11: 3, Q12: 3,
        Q13: 4, Q14: 4, Q15: 3,
        Q16: 3, Q17: 3, Q18: 5
      }
    }
  },
  {
    id: 'TITLE-6',
    title: 'AI-Driven Diabetic Retinopathy Screening using Mobile Fundus Camera Adapter',
    description: 'Mobile attachment for retina screening. Triggers Red Line due to requiring Hospital IRB ethics board approvals.',
    category: 'Healthcare AI',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 4, Q2: 4, Q3: 3,
        Q4: 3, Q5: 1, Q6: 2, // Q5 = 1 -> Red Line Triggered!
        Q7: 5, Q8: 4, Q9: 5,
        Q10: 3, Q11: 2, Q12: 2,
        Q13: 5, Q14: 4, Q15: 1,
        Q16: 3, Q17: 2, Q18: 5
      }
    }
  },
  {
    id: 'TITLE-7',
    title: 'Autonomous Drone Swarm for Urban Search and Rescue Post-Disaster Survivor Detection',
    description: 'Triggers Red Line due to lack of team internal programming capability for autonomous drone flight firmware.',
    category: 'Robotics / Autonomous Systems',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 1, Q2: 2, Q3: 1, // Q1 = 1 -> Red Line Triggered!
        Q4: 3, Q5: 2, Q6: 4,
        Q7: 5, Q8: 2, Q9: 5,
        Q10: 2, Q11: 1, Q12: 1,
        Q13: 4, Q14: 2, Q15: 2,
        Q16: 1, Q17: 1, Q18: 5
      }
    }
  },
  {
    id: 'TITLE-8',
    title: 'Decentralized Blockchain Land Title Registry for Agrarian Municipal Records',
    description: 'Triggers Red Line due to provincial land records being proprietary and unaccessible to researchers.',
    category: 'Blockchain / GovTech',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 3, Q2: 3, Q3: 3,
        Q4: 1, Q5: 2, Q6: 2, // Q4 = 1 -> Red Line Triggered!
        Q7: 3, Q8: 2, Q9: 3,
        Q10: 2, Q11: 2, Q12: 2,
        Q13: 2, Q14: 1, Q15: 2,
        Q16: 2, Q17: 2, Q18: 3
      }
    }
  },
  {
    id: 'TITLE-9',
    title: 'Barangay Wet Market Online Vendor Directory and Stall Rental Billing Portal',
    description: 'Basic CRUD website with basic search and filter. Low computational complexity and easily replicated by Google Forms.',
    category: 'Web Information Systems',
    createdAt: new Date().toISOString(),
    evaluations: {
      R1: {
        Q1: 4, Q2: 4, Q3: 5,
        Q4: 3, Q5: 4, Q6: 3,
        Q7: 1, Q8: 1, Q9: 1, // M3 basic CRUD & easily solved by off the shelf
        Q10: 3, Q11: 3, Q12: 3,
        Q13: 1, Q14: 1, Q15: 3,
        Q16: 2, Q17: 4, Q18: 1
      }
    }
  }
];

export function getFreshEmptyTitles(): CapstoneTitle[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `TITLE-${i + 1}`,
    title: `Proposed Capstone Title ${i + 1}`,
    description: `Enter project scope, target domain, or technical objective for Title ${i + 1}.`,
    createdAt: new Date().toISOString(),
    evaluations: {}
  }));
}
