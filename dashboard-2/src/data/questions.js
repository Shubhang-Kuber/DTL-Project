/**
 * CRITICAL: Question Configuration with Direction-Aware Scoring
 * 
 * Each question belongs to one of two SEMANTIC TYPES:
 * 
 * POSITIVE (higher = healthier):
 *   - Interest in course
 *   - Motivation
 *   - Academic confidence
 *   - Sense of belonging
 *   Direction: When normalized, higher values DECREASE risk
 * 
 * NEGATIVE (higher = riskier):
 *   - Dropout intention
 *   - Financial burden
 *   - Stress
 *   - Emotional exhaustion
 *   - Lack of interest
 *   Direction: When normalized, higher values INCREASE risk
 * 
 * SCORING RULE (MANDATORY):
 * For NEGATIVE questions (Likert scale 1–5):
 *   invertedValue = 6 - originalValue
 * 
 * This ensures semantic correctness:
 * - Worst answers → HIGH RISK
 * - Best answers → LOW RISK
 */

export const QUESTIONS = [
  {
    id: 'q1',
    text: 'How interested are you in your course?',
    factor: 'Engagement & Motivation',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not interested', 'Very interested'] },
  },
  {
    id: 'q2',
    text: 'How motivated are you to complete your studies?',
    factor: 'Engagement & Motivation',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not motivated', 'Very motivated'] },
  },
  {
    id: 'q3',
    text: 'How confident are you in your academic abilities?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not confident', 'Very confident'] },
  },
  {
    id: 'q4',
    text: 'What is your current stress level?',
    factor: 'Emotional Well-being',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['No stress', 'Extremely stressed'] },
  },
  {
    id: 'q5',
    text: 'How much do financial challenges affect your studies?',
    factor: 'External / Financial Pressure',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Not at all', 'Greatly'] },
  },
  {
    id: 'q6',
    text: 'How supported do you feel by your family?',
    factor: 'Emotional Well-being',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not supported', 'Strongly supported'] },
  },
  {
    id: 'q7',
    text: 'How supported do you feel by your institution?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not supported', 'Strongly supported'] },
  },
  {
    id: 'q8',
    text: 'How often do you feel socially isolated at university?',
    factor: 'Emotional Well-being',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Never', 'Always'] },
  },
  {
    id: 'q9',
    text: 'How much are external work/family commitments affecting your studies?',
    factor: 'External / Financial Pressure',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Not at all', 'Greatly'] },
  },
  {
    id: 'q10',
    text: 'How often do you attend classes?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Rarely', 'Always'] },
  },
  {
    id: 'q11',
    text: 'How involved are you in extracurricular activities?',
    factor: 'Engagement & Motivation',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not involved', 'Very involved'] },
  },
  {
    id: 'q12',
    text: 'Have you considered dropping out?',
    factor: 'Engagement & Motivation',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Never', 'Very often'] },
  },
];

/**
 * Factor definitions and weights
 */
export const FACTORS = {
  'Academic Consistency': {
    description: 'Class attendance, institutional support, academic confidence',
    weight: 0.25,
    questions: ['q3', 'q7', 'q10'],
  },
  'Emotional Well-being': {
    description: 'Stress levels, family support, social integration',
    weight: 0.25,
    questions: ['q4', 'q6', 'q8'],
  },
  'Engagement & Motivation': {
    description: 'Interest in course, motivation, extracurricular involvement',
    weight: 0.25,
    questions: ['q1', 'q2', 'q11', 'q12'],
  },
  'External / Financial Pressure': {
    description: 'Financial challenges, work/family commitments',
    weight: 0.25,
    questions: ['q5', 'q9'],
  },
};

/**
 * Risk thresholds for classification
 */
export const RISK_THRESHOLDS = {
  LOW: 0.33,
  MEDIUM: 0.66,
};

/**
 * Rule-based recommendations mapped to low factor scores
 */
export const RECOMMENDATIONS = {
  'Academic Consistency': [
    {
      severity: 'high',
      title: 'Boost Academic Confidence',
      suggestions: [
        'Attend office hours with your professor',
        'Join study groups or peer tutoring sessions',
        'Visit the academic support center for personalized help',
        'Build a consistent study schedule',
      ],
    },
    {
      severity: 'medium',
      title: 'Strengthen Academic Foundation',
      suggestions: [
        'Review course materials regularly',
        'Form connections with classmates for study partnerships',
        'Identify areas where you need additional support early',
      ],
    },
  ],
  'Emotional Well-being': [
    {
      severity: 'high',
      title: 'Seek Mental Health & Stress Support',
      suggestions: [
        'Contact student counseling services',
        'Explore stress management workshops',
        'Talk to a trusted faculty member or advisor',
        'Consider mindfulness or meditation resources available on campus',
      ],
    },
    {
      severity: 'medium',
      title: 'Build Social Connections',
      suggestions: [
        'Join clubs or organizations aligned with your interests',
        'Attend social events on campus',
        'Connect with roommates or classmates for social support',
      ],
    },
  ],
  'Engagement & Motivation': [
    {
      severity: 'high',
      title: 'Reignite Academic Purpose',
      suggestions: [
        'Speak with an academic advisor about course selection',
        'Explore career services to understand degree relevance',
        'Identify personal goals and connect them to your studies',
        'Talk to a mentor or successful peer about motivation strategies',
      ],
    },
    {
      severity: 'medium',
      title: 'Increase Campus Engagement',
      suggestions: [
        'Join clubs or organizations',
        'Participate in social events',
        'Volunteer or take on leadership roles',
      ],
    },
  ],
  'External / Financial Pressure': [
    {
      severity: 'high',
      title: 'Address Financial & External Challenges',
      suggestions: [
        'Contact financial aid office about emergency funds or grants',
        'Explore scholarship opportunities',
        'Discuss flexible scheduling options with advisors',
        'Access emergency support services for unexpected hardships',
      ],
    },
    {
      severity: 'medium',
      title: 'Manage Time & Resources',
      suggestions: [
        'Explore part-time work options that fit your schedule',
        'Create a balanced schedule between work and studies',
        'Access career services for work-study opportunities',
      ],
    },
  ],
};
