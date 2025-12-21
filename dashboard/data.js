/**
 * DATA.JS
 * Mock factor data and rule-based recommendation engine
 * Structured to match the Factor Analysis outputs from the analysis backend
 */

// ============================================
// FACTOR DEFINITIONS
// ============================================

const FACTORS = {
    ACADEMIC_SUPPORT: {
        id: 'academic_support',
        name: 'Academic Support & Quality',
        color: '#3498db',
        description: 'Teaching quality, resources, and academic guidance',
        weight: 0.2
    },
    FINANCIAL_STRESS: {
        id: 'financial_stress',
        name: 'Financial & Stress Management',
        color: '#e74c3c',
        description: 'Financial stability and anxiety levels',
        weight: 0.2
    },
    INSTITUTIONAL_FIT: {
        id: 'institutional_fit',
        name: 'Institutional & Academic Environment',
        color: '#f39c12',
        description: 'Course fit and institutional support',
        weight: 0.2
    },
    MOTIVATION: {
        id: 'motivation',
        name: 'Course Interest & Motivation',
        color: '#2ecc71',
        description: 'Personal drive and subject engagement',
        weight: 0.2
    },
    SOCIAL_WELLBEING: {
        id: 'social_wellbeing',
        name: 'Social Integration & Well-being',
        color: '#9b59b6',
        description: 'Peer connections and mental health',
        weight: 0.2
    }
};

// ============================================
// RISK CLASSIFICATION RULES
// ============================================

const RISK_THRESHOLDS = {
    LOW: 0.33,      // score <= 0.33 = Low Risk
    MEDIUM: 0.66,   // 0.33 < score <= 0.66 = Medium Risk
    HIGH: 1.0       // score > 0.66 = High Risk
};

// ============================================
// SENTIMENT ANALYSIS MAPPING
// ============================================

const SENTIMENT_KEYWORDS = {
    NEGATIVE: ['stress', 'anxiety', 'overwhelm', 'struggle', 'difficult', 'fail', 'drop', 'lonely', 'isolated', 'depressed', 'helpless', 'afraid', 'worried', 'sick', 'problem', 'issue', 'hard', 'tough', 'bad', 'poor'],
    POSITIVE: ['good', 'happy', 'excited', 'motivated', 'confident', 'support', 'help', 'love', 'enjoy', 'grateful', 'proud', 'strong', 'well', 'great', 'best', 'improve'],
    ACADEMIC: ['study', 'class', 'course', 'exam', 'grade', 'subject', 'learn', 'academic', 'performance', 'attendance', 'assignment', 'lecture']
};

// ============================================
// FORM FIELD MAPPING TO FACTORS
// ============================================

const FIELD_TO_FACTOR_MAPPING = {
    // Academic Support & Quality
    'avgPerformance': { factor: 'academic_support', inverse: false, weight: 0.25 },
    'attendanceRate': { factor: 'academic_support', inverse: false, weight: 0.25 },
    'institutionSupport': { factor: 'academic_support', inverse: false, weight: 0.25 },
    'helpSeeking': { factor: 'academic_support', inverse: false, weight: 0.25 },

    // Financial & Stress Management
    'stressLevel': { factor: 'financial_stress', inverse: true, weight: 0.33 },
    'financialProblems': { factor: 'financial_stress', inverse: false, weight: 0.33 },
    'overwhelm': { factor: 'financial_stress', inverse: true, weight: 0.34 },

    // Institutional & Academic Environment
    'courseInterest': { factor: 'institutional_fit', inverse: false, weight: 0.33 },
    'workCommitment': { factor: 'institutional_fit', inverse: true, weight: 0.33 },
    'healthIssues': { factor: 'institutional_fit', inverse: false, weight: 0.34 },

    // Motivation
    'motivation': { factor: 'motivation', inverse: false, weight: 0.5 },
    'extracurricular': { factor: 'motivation', inverse: false, weight: 0.5 },

    // Social Integration & Well-being
    'socialIsolation': { factor: 'social_wellbeing', inverse: true, weight: 0.33 },
    'familySupport': { factor: 'social_wellbeing', inverse: false, weight: 0.33 },
    'studyHours': { factor: 'social_wellbeing', inverse: false, weight: 0.34 }
};

// ============================================
// RULE-BASED RECOMMENDATIONS ENGINE
// ============================================

const RECOMMENDATIONS_DB = {
    academic_support: {
        LOW: [
            {
                priority: 'high',
                icon: '📚',
                title: 'Seek Academic Support',
                description: 'Your academic performance or support-seeking behavior indicates room for improvement.',
                actions: [
                    'Schedule regular tutoring sessions with faculty or peer tutors',
                    'Attend office hours to discuss concepts you find challenging',
                    'Join study groups focused on difficult subjects',
                    'Explore online academic resources and learning platforms'
                ]
            },
            {
                priority: 'high',
                icon: '🎯',
                title: 'Develop a Structured Study Plan',
                description: 'Consistent, focused study can significantly improve academic outcomes.',
                actions: [
                    'Create a weekly study schedule with specific time blocks',
                    'Break courses into smaller, manageable study sessions',
                    'Use active learning techniques: summarization, practice problems',
                    'Track your progress and adjust your strategy as needed'
                ]
            }
        ],
        MEDIUM: [
            {
                priority: 'medium',
                icon: '📖',
                title: 'Strengthen Academic Resources',
                description: 'You can further develop your academic foundation.',
                actions: [
                    'Consider attending workshops on study techniques',
                    'Use the library or online resources more actively',
                    'Build relationships with instructors for guidance'
                ]
            }
        ],
        HIGH: [
            {
                priority: 'low',
                icon: '✅',
                title: 'Maintain Academic Excellence',
                description: 'Your strong academic support and performance are commendable.',
                actions: [
                    'Continue leveraging available academic resources',
                    'Consider becoming a peer tutor to reinforce your knowledge',
                    'Explore advanced or specialized courses in your interest areas'
                ]
            }
        ]
    },

    financial_stress: {
        LOW: [
            {
                priority: 'high',
                icon: '💰',
                title: 'Financial & Mental Health Support',
                description: 'High stress or financial pressures require immediate attention.',
                actions: [
                    'Contact your institution\'s financial aid office for scholarship or loan options',
                    'Reach out to counseling services for stress management and mental health support',
                    'Explore part-time work or flexible study options if needed',
                    'Connect with financial literacy workshops to manage resources better'
                ]
            },
            {
                priority: 'high',
                icon: '🧘',
                title: 'Stress Management & Wellness',
                description: 'Developing coping strategies is essential for your well-being.',
                actions: [
                    'Practice mindfulness, meditation, or yoga regularly',
                    'Maintain a balanced lifestyle with adequate sleep and exercise',
                    'Consider stress-relief groups or counseling sessions',
                    'Develop a support network of trusted friends and mentors'
                ]
            }
        ],
        MEDIUM: [
            {
                priority: 'medium',
                icon: '⚖️',
                title: 'Balance Work and Studies',
                description: 'Managing stress and finances helps maintain academic focus.',
                actions: [
                    'Evaluate your time commitments and workload',
                    'Seek financial planning advice from student services',
                    'Join stress-reduction or wellness programs'
                ]
            }
        ],
        HIGH: [
            {
                priority: 'low',
                icon: '😌',
                title: 'Maintain Healthy Balance',
                description: 'You are managing stress and finances effectively.',
                actions: [
                    'Continue your current wellness practices',
                    'Help peers by sharing your stress management strategies',
                    'Explore optional wellness activities or retreats'
                ]
            }
        ]
    },

    institutional_fit: {
        LOW: [
            {
                priority: 'high',
                icon: '🔄',
                title: 'Re-evaluate Course & Path Fit',
                description: 'Low course interest or poor institutional fit may impact your success.',
                actions: [
                    'Meet with your academic advisor to discuss course satisfaction',
                    'Explore electives or specializations that align with your interests',
                    'Consider if a course change, minor, or different focus area would better suit you',
                    'Attend departmental events or seminars to deepen engagement'
                ]
            },
            {
                priority: 'high',
                icon: '📋',
                title: 'Manage Competing Commitments',
                description: 'External commitments may be affecting your academic focus.',
                actions: [
                    'Review your work and personal commitments',
                    'Explore flexible work arrangements or reduced hours',
                    'Prioritize your education and discuss time management with advisors',
                    'Use institutional resources to reduce competing demands'
                ]
            }
        ],
        MEDIUM: [
            {
                priority: 'medium',
                icon: '🎓',
                title: 'Clarify Your Academic Goals',
                description: 'Stronger alignment with your course will improve engagement.',
                actions: [
                    'Attend career counseling sessions',
                    'Connect course content to your career goals',
                    'Find role models or mentors in your field'
                ]
            }
        ],
        HIGH: [
            {
                priority: 'low',
                icon: '🌟',
                title: 'You\'re on the Right Track',
                description: 'Your course fit and institutional engagement are strong.',
                actions: [
                    'Continue pursuing your academic goals with confidence',
                    'Lead group projects or student organizations',
                    'Mentor peers who may be struggling with course fit'
                ]
            }
        ]
    },

    motivation: {
        LOW: [
            {
                priority: 'high',
                icon: '💡',
                title: 'Reconnect with Your Purpose',
                description: 'Low motivation often signals a mismatch between goals and current path.',
                actions: [
                    'Reflect on why you chose this course and career path',
                    'Speak with career advisors about alternative options',
                    'Connect with successful alumni or professionals in your field',
                    'Identify short-term and long-term goals to reignite passion'
                ]
            },
            {
                priority: 'high',
                icon: '🎯',
                title: 'Find Engaging Opportunities',
                description: 'Involvement outside the classroom can boost motivation.',
                actions: [
                    'Join clubs, competitions, or projects related to your field',
                    'Pursue internships or real-world learning opportunities',
                    'Take on leadership roles in academic or social settings',
                    'Attend seminars or workshops that excite you'
                ]
            }
        ],
        MEDIUM: [
            {
                priority: 'medium',
                icon: '🚀',
                title: 'Build Momentum',
                description: 'Increasing engagement can strengthen your motivation.',
                actions: [
                    'Set achievable short-term academic milestones',
                    'Find study partners with shared goals',
                    'Explore specialized topics within your course'
                ]
            }
        ],
        HIGH: [
            {
                priority: 'low',
                icon: '⭐',
                title: 'You\'re Driven and Engaged',
                description: 'Your motivation is a key strength in your academic journey.',
                actions: [
                    'Continue pursuing challenging opportunities',
                    'Inspire and support peers who may lack motivation',
                    'Explore advanced or specialized paths in your field'
                ]
            }
        ]
    },

    social_wellbeing: {
        LOW: [
            {
                priority: 'high',
                icon: '🤝',
                title: 'Build Social Connections',
                description: 'Feeling isolated or lacking social support affects academic well-being.',
                actions: [
                    'Join clubs, groups, or societies aligned with your interests',
                    'Participate in campus social events and activities',
                    'Form or join study groups and collaborative projects',
                    'Connect with roommates, classmates, or student communities'
                ]
            },
            {
                priority: 'high',
                icon: '👨‍👩‍👧‍👦',
                title: 'Strengthen Family & Peer Support',
                description: 'Having a support network is crucial for navigating challenges.',
                actions: [
                    'Maintain regular contact with family and close friends',
                    'Seek mentorship from senior students or faculty',
                    'Build peer support groups for shared challenges',
                    'Attend counseling to develop healthy relationships'
                ]
            }
        ],
        MEDIUM: [
            {
                priority: 'medium',
                icon: '💬',
                title: 'Expand Your Network',
                description: 'Deepening connections can provide additional support.',
                actions: [
                    'Attend social or academic events regularly',
                    'Build relationships with classmates and faculty',
                    'Connect with alumni or professionals in your field'
                ]
            }
        ],
        HIGH: [
            {
                priority: 'low',
                icon: '❤️',
                title: 'Your Social Support is Strong',
                description: 'You have a healthy social network supporting your studies.',
                actions: [
                    'Continue nurturing your relationships',
                    'Be a supportive peer for others in need',
                    'Participate in community or volunteer activities'
                ]
            }
        ]
    }
};

// ============================================
// UTILITY FUNCTIONS FOR ANALYSIS
// ============================================

/**
 * Normalize a numeric value to 0-1 range
 */
function normalizeValue(value, min, max) {
    if (value < min) return 0;
    if (value > max) return 1;
    return (value - min) / (max - min);
}

/**
 * Inverse a normalized value (1 - value)
 */
function inverseValue(value) {
    return 1 - value;
}

/**
 * Classify risk level based on score
 */
function classifyRisk(score) {
    if (score <= RISK_THRESHOLDS.LOW) {
        return { level: 'Low Risk', color: '#2ecc71', class: 'risk-level-low' };
    } else if (score <= RISK_THRESHOLDS.MEDIUM) {
        return { level: 'Medium Risk', color: '#f39c12', class: 'risk-level-medium' };
    } else {
        return { level: 'High Risk', color: '#e74c3c', class: 'risk-level-high' };
    }
}

/**
 * Calculate factor scores from form input
 */
function calculateFactorScores(formData) {
    const factorScores = {
        academic_support: [],
        financial_stress: [],
        institutional_fit: [],
        motivation: [],
        social_wellbeing: []
    };

    for (const [fieldName, mapping] of Object.entries(FIELD_TO_FACTOR_MAPPING)) {
        let value = formData[fieldName];
        if (value === undefined || value === '') continue;

        // Normalize based on field type
        let normalized = 0;
        if (fieldName.includes('Performance') || fieldName.includes('Rate')) {
            normalized = normalizeValue(parseInt(value), 0, 100);
        } else if (fieldName.includes('Support') || fieldName.includes('Stress') || fieldName.includes('Motivation')) {
            normalized = normalizeValue(parseInt(value), 1, 5);
        } else if (fieldName.includes('Problems') || fieldName.includes('Issues')) {
            // These are inverse: 5=no problems, 1=severe problems
            normalized = normalizeValue(parseInt(value), 1, 5);
        } else {
            normalized = normalizeValue(parseInt(value), 1, 5);
        }

        // Apply inverse if needed
        if (mapping.inverse) {
            normalized = inverseValue(normalized);
        }

        factorScores[mapping.factor].push(normalized * mapping.weight);
    }

    // Calculate mean for each factor
    const finalScores = {};
    for (const factor in factorScores) {
        if (factorScores[factor].length > 0) {
            finalScores[factor] = Math.min(1, factorScores[factor].reduce((a, b) => a + b, 0));
        } else {
            finalScores[factor] = 0.5; // Default if no data
        }
    }

    return finalScores;
}

/**
 * Calculate overall risk score (weighted average of factors)
 */
function calculateOverallRiskScore(factorScores) {
    const weights = {
        academic_support: FACTORS.ACADEMIC_SUPPORT.weight,
        financial_stress: FACTORS.FINANCIAL_STRESS.weight,
        institutional_fit: FACTORS.INSTITUTIONAL_FIT.weight,
        motivation: FACTORS.MOTIVATION.weight,
        social_wellbeing: FACTORS.SOCIAL_WELLBEING.weight
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const factor in factorScores) {
        const score = factorScores[factor];
        const weight = weights[factor] || 0.2;
        totalWeightedScore += score * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? totalWeightedScore : 0.5;
}

/**
 * Analyze sentiment from user feedback
 * Returns score from -1 (very negative) to +1 (very positive)
 */
function analyzeSentiment(text) {
    if (!text || text.trim().length === 0) return 0;

    const lowerText = text.toLowerCase();
    let negativeCount = 0;
    let positiveCount = 0;
    let academicMentioned = false;

    for (const word of SENTIMENT_KEYWORDS.NEGATIVE) {
        if (lowerText.includes(word)) negativeCount++;
    }

    for (const word of SENTIMENT_KEYWORDS.POSITIVE) {
        if (lowerText.includes(word)) positiveCount++;
    }

    for (const word of SENTIMENT_KEYWORDS.ACADEMIC) {
        if (lowerText.includes(word)) academicMentioned = true;
    }

    const totalMentions = negativeCount + positiveCount;
    if (totalMentions === 0) return 0;

    let sentimentScore = (positiveCount - negativeCount) / totalMentions;

    // Boost impact if academic topics are mentioned
    if (academicMentioned) {
        sentimentScore *= 1.2;
    }

    // Clamp to [-1, 1]
    return Math.max(-1, Math.min(1, sentimentScore));
}

/**
 * Generate recommendations based on factor scores and risk level
 */
function generateRecommendations(factorScores, overallRiskScore) {
    const recommendations = [];
    const riskLevel = classifyRisk(overallRiskScore).level.split(' ')[0]; // 'Low', 'Medium', 'High'

    for (const [factorId, score] of Object.entries(factorScores)) {
        let severity;
        if (score <= RISK_THRESHOLDS.LOW) {
            severity = 'HIGH';
        } else if (score <= RISK_THRESHOLDS.MEDIUM) {
            severity = 'MEDIUM';
        } else {
            severity = 'LOW';
        }

        if (RECOMMENDATIONS_DB[factorId] && RECOMMENDATIONS_DB[factorId][severity]) {
            const recs = RECOMMENDATIONS_DB[factorId][severity];
            recommendations.push(...recs);
        }
    }

    // Remove duplicates based on title
    const uniqueRecs = Array.from(
        new Map(recommendations.map(item => [item.title, item])).values()
    );

    // Sort by priority
    const priorityMap = { 'high': 0, 'medium': 1, 'low': 2 };
    uniqueRecs.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);

    return uniqueRecs;
}

/**
 * Format factor scores for visualization
 */
function formatFactorScoresForChart(factorScores) {
    return {
        labels: [
            FACTORS.ACADEMIC_SUPPORT.name,
            FACTORS.FINANCIAL_STRESS.name,
            FACTORS.INSTITUTIONAL_FIT.name,
            FACTORS.MOTIVATION.name,
            FACTORS.SOCIAL_WELLBEING.name
        ],
        datasets: [
            {
                label: 'Your Factor Scores',
                data: [
                    factorScores.academic_support * 100,
                    factorScores.financial_stress * 100,
                    factorScores.institutional_fit * 100,
                    factorScores.motivation * 100,
                    factorScores.social_wellbeing * 100
                ],
                backgroundColor: [
                    FACTORS.ACADEMIC_SUPPORT.color,
                    FACTORS.FINANCIAL_STRESS.color,
                    FACTORS.INSTITUTIONAL_FIT.color,
                    FACTORS.MOTIVATION.color,
                    FACTORS.SOCIAL_WELLBEING.color
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };
}
