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
 * 
 * UPDATED: 21 questions based on real survey data (Responses CSV File.csv)
 */

export const QUESTIONS = [
  // ============ ACADEMIC CONSISTENCY (6 questions) ============
  {
    id: 'q1',
    text: 'How confident are you in understanding engineering subjects this semester?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not confident', 'Very confident'] },
    csvColumn: 'How confident are you in understanding engineering subjects this semester?'
  },
  {
    id: 'q2',
    text: 'How often do you seek help from faculty or peers when stuck in a course?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Never', 'Always'] },
    csvColumn: 'How often do you seek help from faculty or peers when stuck in a course?'
  },
  {
    id: 'q3',
    text: 'How would you rate the quality of teaching and learning resources?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Very poor', 'Excellent'] },
    csvColumn: 'Quality of Teaching and Learning Resources'
  },
  {
    id: 'q4',
    text: 'How available is academic support (mentoring, tutoring) at your institution?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not available', 'Very available'] },
    csvColumn: 'Availability of Academic Support (e.g., mentoring, tutoring)'
  },
  {
    id: 'q5',
    text: 'How satisfied are you with college administration support?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not satisfied', 'Very satisfied'] },
    csvColumn: 'Satisfaction with College Administration Support'
  },
  {
    id: 'q6',
    text: 'How often do you attend counseling or mentorship sessions?',
    factor: 'Academic Consistency',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Never', 'Weekly'] },
    csvColumn: 'Frequency of Counseling or Mentorship Sessions'
  },

  // ============ EMOTIONAL WELL-BEING (5 questions) ============
  {
    id: 'q7',
    text: 'What is your level of stress or anxiety related to studies?',
    factor: 'Emotional Well-being',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['No stress', 'Extremely stressed'] },
    csvColumn: 'Level of Stress or Anxiety Related to Studies'
  },
  {
    id: 'q8',
    text: 'Do you feel socially isolated or left out in college?',
    factor: 'Emotional Well-being',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Never', 'Always'] },
    csvColumn: 'Do you feel socially isolated or left out in college?'
  },
  {
    id: 'q9',
    text: 'How supported do you feel by your family for education?',
    factor: 'Emotional Well-being',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not supported', 'Strongly supported'] },
    csvColumn: 'Family Support for Education'
  },
  {
    id: 'q10',
    text: 'How often do you feel overwhelmed by academic workload?',
    factor: 'Emotional Well-being',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Never', 'Always'] },
    csvColumn: 'How often do you feel overwhelmed by academic workload?'
  },
  {
    id: 'q11',
    text: 'Do you have any health issues affecting your studies?',
    factor: 'Emotional Well-being',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['No issues', 'Severe issues'] },
    csvColumn: 'Do you have any health issues affecting your studies?'
  },

  // ============ ENGAGEMENT & MOTIVATION (5 questions) ============
  {
    id: 'q12',
    text: 'How interested are you in your course?',
    factor: 'Engagement & Motivation',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not interested', 'Very interested'] },
    csvColumn: 'Interest in the Course'
  },
  {
    id: 'q13',
    text: 'How motivated are you to continue your studies?',
    factor: 'Engagement & Motivation',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Not motivated', 'Very motivated'] },
    csvColumn: 'Motivation to Continue Studies'
  },
  {
    id: 'q14',
    text: 'Do you engage in extracurricular or sports activities?',
    factor: 'Engagement & Motivation',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Never', 'Regularly'] },
    csvColumn: 'Do you engage in extracurricular or sports activities?'
  },
  {
    id: 'q15',
    text: 'How often do you attend classes?',
    factor: 'Engagement & Motivation',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Below 40%', '90% and above'] },
    csvColumn: 'Attendance Rate'
  },
  {
    id: 'q16',
    text: 'Would you consider dropping out of your course?',
    factor: 'Engagement & Motivation',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Never', 'Definitely yes'] },
    csvColumn: 'Would you consider dropping out of your course?'
  },

  // ============ EXTERNAL / FINANCIAL PRESSURE (5 questions) ============
  {
    id: 'q17',
    text: 'How much do financial problems affect your studies?',
    factor: 'External / Financial Pressure',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['Not at all', 'Greatly'] },
    csvColumn: 'Do financial problems affect your studies?'
  },
  {
    id: 'q18',
    text: 'Do you depend on scholarships or loans for your education?',
    factor: 'External / Financial Pressure',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['No dependency', 'Fully dependent'] },
    csvColumn: 'Do you depend on scholarships or loans?'
  },
  {
    id: 'q19',
    text: 'Do you have a part-time job or other major commitments?',
    factor: 'External / Financial Pressure',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['No commitments', 'Multiple commitments'] },
    csvColumn: 'Do you have a part-time job or other major commitments?'
  },
  {
    id: 'q20',
    text: 'How many hours per day do you dedicate to studying?',
    factor: 'External / Financial Pressure',
    direction: 'positive',
    scale: { min: 1, max: 5, labels: ['Less than 1 hour', 'More than 6 hours'] },
    csvColumn: 'Study Hours per Day'
  },
  {
    id: 'q21',
    text: 'How many dependents does your family have?',
    factor: 'External / Financial Pressure',
    direction: 'negative',
    scale: { min: 1, max: 5, labels: ['None', '5 or more'] },
    csvColumn: 'Number of Dependents in Family'
  },
];

/**
 * Factor definitions and weights
 * Updated for 21 questions
 */
export const FACTORS = {
  'Academic Consistency': {
    description: 'Academic confidence, faculty support, teaching quality, institutional support',
    weight: 0.25,
    questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
  },
  'Emotional Well-being': {
    description: 'Stress levels, social integration, family support, health, workload management',
    weight: 0.25,
    questions: ['q7', 'q8', 'q9', 'q10', 'q11'],
  },
  'Engagement & Motivation': {
    description: 'Course interest, motivation, extracurricular involvement, attendance, dropout consideration',
    weight: 0.25,
    questions: ['q12', 'q13', 'q14', 'q15', 'q16'],
  },
  'External / Financial Pressure': {
    description: 'Financial challenges, scholarships/loans, work commitments, study time, family dependents',
    weight: 0.25,
    questions: ['q17', 'q18', 'q19', 'q20', 'q21'],
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
        'Attend counseling or mentorship sessions regularly',
      ],
    },
    {
      severity: 'medium',
      title: 'Strengthen Academic Foundation',
      suggestions: [
        'Review course materials regularly',
        'Form connections with classmates for study partnerships',
        'Identify areas where you need additional support early',
        'Utilize available tutoring and mentoring resources',
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
        'If health issues are affecting you, visit the campus health center',
      ],
    },
    {
      severity: 'medium',
      title: 'Build Social Connections',
      suggestions: [
        'Join clubs or organizations aligned with your interests',
        'Attend social events on campus',
        'Connect with roommates or classmates for social support',
        'Break down large tasks to reduce feeling overwhelmed',
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
        'Improve attendance - it directly impacts performance',
      ],
    },
    {
      severity: 'medium',
      title: 'Increase Campus Engagement',
      suggestions: [
        'Join clubs or organizations',
        'Participate in extracurricular or sports activities',
        'Volunteer or take on leadership roles',
        'Set small achievable goals to build momentum',
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
        'Consider reducing work hours if possible during exam periods',
      ],
    },
    {
      severity: 'medium',
      title: 'Manage Time & Resources',
      suggestions: [
        'Create a balanced schedule between work and studies',
        'Explore part-time work options that fit your schedule',
        'Access career services for work-study opportunities',
        'Dedicate at least 2-4 hours daily to studying',
      ],
    },
  ],
};
