/**
 * APP.JS
 * Core application logic for the dropout risk dashboard
 * Handles form submission, analysis, visualization, and navigation
 */

// ============================================
// STATE MANAGEMENT
// ============================================

let currentAnalysis = {
    formData: {},
    factorScores: {},
    overallRiskScore: 0,
    riskClassification: {},
    sentimentScore: 0,
    recommendations: [],
    confidenceScore: 0
};

let chartInstance = null; // Store chart instance for cleanup

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    attachFormListeners();
    updateProgress();
});

// ============================================
// FORM INITIALIZATION & LISTENERS
// ============================================

function initializeForm() {
    // Initialize slider value displays
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        updateSliderDisplay(slider);
        slider.addEventListener('input', function () {
            updateSliderDisplay(this);
            updateProgress();
        });
    });

    // Attach change listeners to form fields
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', updateProgress);
    });
}

function attachFormListeners() {
    const form = document.getElementById('assessmentForm');
    form.addEventListener('submit', handleFormSubmit);
}

function updateSliderDisplay(slider) {
    const displayId = slider.id + 'Value';
    const display = document.getElementById(displayId);
    if (!display) return;

    const value = slider.value;
    if (slider.id.includes('Performance') || slider.id.includes('Rate')) {
        display.textContent = value + '%';
    } else if (slider.id.includes('Support') || slider.id.includes('Motivation')) {
        display.textContent = value + '/5';
    } else {
        display.textContent = value + '/5';
    }
}

// ============================================
// PROGRESS TRACKING
// ============================================

function updateProgress() {
    const form = document.getElementById('assessmentForm');
    const inputs = form.querySelectorAll('input[type="text"], input[type="range"], select');
    let filledCount = 0;

    inputs.forEach(input => {
        if (input.value !== '' && input.type !== 'radio') {
            filledCount++;
        }
    });

    // Count filled radio groups
    const radioGroups = new Set();
    form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        radioGroups.add(radio.name);
    });
    filledCount += radioGroups.size;

    const totalFields = inputs.length + 3; // +3 for radio groups
    const progress = Math.round((filledCount / totalFields) * 100);

    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    progressFill.style.width = progress + '%';
    progressPercent.textContent = progress;
}

// ============================================
// FORM SUBMISSION & ANALYSIS
// ============================================

function handleFormSubmit(event) {
    event.preventDefault();

    // Collect form data
    const formData = collectFormData();

    // Validate form
    if (!validateFormData(formData)) {
        alert('Please fill out all required fields.');
        return;
    }

    // Perform analysis
    performAnalysis(formData);

    // Show results
    showScreen(2);
}

function collectFormData() {
    const form = document.getElementById('assessmentForm');
    const formData = {};

    // Text and range inputs
    const inputs = form.querySelectorAll('input[type="text"], input[type="range"], select, textarea');
    inputs.forEach(input => {
        if (input.value) {
            formData[input.id] = input.value;
        }
    });

    // Radio buttons
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        formData[radio.name] = radio.value;
    });

    return formData;
}

function validateFormData(formData) {
    // Check for required fields (at least 70% of fields should be filled)
    const requiredFields = [
        'avgPerformance', 'attendanceRate', 'courseInterest',
        'stressLevel', 'socialIsolation', 'motivation'
    ];

    const filledRequired = requiredFields.filter(field => formData[field]).length;
    return filledRequired >= Math.ceil(requiredFields.length * 0.7);
}

function performAnalysis(formData) {
    // Store original form data
    currentAnalysis.formData = formData;

    // Calculate factor scores
    currentAnalysis.factorScores = calculateFactorScores(formData);

    // Calculate overall risk score
    currentAnalysis.overallRiskScore = calculateOverallRiskScore(currentAnalysis.factorScores);

    // Classify risk
    currentAnalysis.riskClassification = classifyRisk(currentAnalysis.overallRiskScore);

    // Analyze sentiment from feedback
    currentAnalysis.sentimentScore = analyzeSentiment(formData.sentimentFeedback || '');

    // Adjust risk score slightly based on sentiment
    if (currentAnalysis.sentimentScore < -0.3) {
        currentAnalysis.overallRiskScore = Math.min(1, currentAnalysis.overallRiskScore + 0.1);
    } else if (currentAnalysis.sentimentScore > 0.3) {
        currentAnalysis.overallRiskScore = Math.max(0, currentAnalysis.overallRiskScore - 0.05);
    }

    // Recalculate risk classification after sentiment adjustment
    currentAnalysis.riskClassification = classifyRisk(currentAnalysis.overallRiskScore);

    // Calculate confidence score (higher when more fields are filled)
    const filledFields = Object.keys(formData).length;
    currentAnalysis.confidenceScore = Math.round((filledFields / 20) * 100);

    // Generate recommendations
    currentAnalysis.recommendations = generateRecommendations(
        currentAnalysis.factorScores,
        currentAnalysis.overallRiskScore
    );

    console.log('Analysis completed:', currentAnalysis);
}

// ============================================
// SCREEN NAVIGATION
// ============================================

function showScreen(screenNumber) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    const selectedScreen = document.getElementById('screen' + screenNumber);
    selectedScreen.classList.add('active');

    // Execute screen-specific setup
    switch (screenNumber) {
        case 2:
            renderRiskSummary();
            break;
        case 3:
            renderFactorVisualization();
            break;
        case 4:
            renderRecommendations();
            break;
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function resetForm() {
    document.getElementById('assessmentForm').reset();
    document.querySelectorAll('.slider').forEach(slider => {
        updateSliderDisplay(slider);
    });
    updateProgress();
    showScreen(1);
    currentAnalysis = {
        formData: {},
        factorScores: {},
        overallRiskScore: 0,
        riskClassification: {},
        sentimentScore: 0,
        recommendations: [],
        confidenceScore: 0
    };
}

// ============================================
// SCREEN 2: RISK SUMMARY
// ============================================

function renderRiskSummary() {
    const riskCard = document.getElementById('riskCard');
    const { level, color, class: riskClass } = currentAnalysis.riskClassification;
    const score = currentAnalysis.overallRiskScore;
    const percentile = Math.round(score * 100);

    // Build risk badge HTML
    const riskBadgeHTML = `
        <div class="risk-badge">
            <span class="${riskClass}">${level}</span>
            <p style="margin-top: 10px; font-weight: 600; color: var(--text-primary);">Risk Score</p>
        </div>
    `;

    // Build risk details HTML
    const riskDetailsHTML = `
        <div class="risk-details">
            <p class="risk-explanation">
                This risk level is based on your responses across academic, emotional, engagement, 
                and environmental factors. It's designed to identify areas where additional support 
                may be beneficial.
            </p>
            <div class="risk-metrics">
                <div class="metric">
                    <span class="metric-label">Risk Score</span>
                    <span class="metric-value">${percentile}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Assessment Confidence</span>
                    <span class="metric-value">${currentAnalysis.confidenceScore}%</span>
                </div>
            </div>
        </div>
    `;

    riskCard.innerHTML = riskBadgeHTML + riskDetailsHTML;
}

// ============================================
// SCREEN 3: FACTOR VISUALIZATION
// ============================================

function renderFactorVisualization() {
    const canvas = document.getElementById('factorChart');

    // Clean up previous chart if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Prepare data for chart
    const chartData = formatFactorScoresForChart(currentAnalysis.factorScores);

    // Create bar chart
    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function (context) {
                            return 'Score: ' + context.parsed.x.toFixed(1) + '/100';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: 500
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// SCREEN 4: RECOMMENDATIONS
// ============================================

function renderRecommendations() {
    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = '';

    if (currentAnalysis.recommendations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No specific recommendations at this time.</p>';
        return;
    }

    currentAnalysis.recommendations.forEach(rec => {
        const priorityClass = `${rec.priority}-priority`;
        const card = document.createElement('div');
        card.className = `recommendation-card ${priorityClass}`;

        const actionsHTML = rec.actions
            .map(action => `<li style="margin-left: 20px;">${action}</li>`)
            .join('');

        card.innerHTML = `
            <div class="recommendation-header">
                <span class="recommendation-icon">${rec.icon}</span>
                <h4 class="recommendation-title">${rec.title}</h4>
            </div>
            <p class="recommendation-description">${rec.description}</p>
            <div class="recommendation-actions">
                <strong>Suggested Actions:</strong>
                <ul style="margin-top: 8px;">
                    ${actionsHTML}
                </ul>
            </div>
        `;

        container.appendChild(card);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Export analysis results as JSON for backend integration
 */
function exportAnalysisResults() {
    return {
        timestamp: new Date().toISOString(),
        formInputs: currentAnalysis.formData,
        factorScores: currentAnalysis.factorScores,
        overallRiskScore: currentAnalysis.overallRiskScore,
        riskClassification: currentAnalysis.riskClassification.level,
        sentimentScore: currentAnalysis.sentimentScore,
        confidenceScore: currentAnalysis.confidenceScore,
        recommendations: currentAnalysis.recommendations
    };
}

/**
 * Download analysis as JSON file
 */
function downloadAnalysis() {
    const data = exportAnalysisResults();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dropout_risk_analysis_${new Date().getTime()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * Log analysis for debugging
 */
function logAnalysis() {
    console.group('📊 Dropout Risk Analysis Results');
    console.log('Form Data:', currentAnalysis.formData);
    console.log('Factor Scores:', currentAnalysis.factorScores);
    console.log('Overall Risk Score:', currentAnalysis.overallRiskScore);
    console.log('Risk Classification:', currentAnalysis.riskClassification);
    console.log('Sentiment Score:', currentAnalysis.sentimentScore);
    console.log('Confidence:', currentAnalysis.confidenceScore + '%');
    console.log('Recommendations:', currentAnalysis.recommendations);
    console.groupEnd();
}

// ============================================
// KEYBOARD NAVIGATION (ACCESSIBILITY)
// ============================================

document.addEventListener('keydown', function (event) {
    // Allow Escape to go back
    if (event.key === 'Escape') {
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen.id === 'screen2') {
            showScreen(1);
        } else if (currentScreen.id === 'screen3') {
            showScreen(2);
        } else if (currentScreen.id === 'screen4') {
            showScreen(3);
        }
    }
});

// ============================================
// MOBILE OPTIMIZATIONS
// ============================================

// Detect if device is mobile
const isMobile = () => window.innerWidth <= 768;

// Adjust form on mobile
window.addEventListener('resize', function () {
    if (isMobile()) {
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.style.padding = '15px';
        });
    }
});

// ============================================
// DEBUGGING & DEVELOPMENT TOOLS
// ============================================

// Uncomment to enable console logging of all form submissions
// document.addEventListener('submit', function(e) {
//     console.log('Form submitted with data:', collectFormData());
// });

// Function to load sample data (for testing)
function loadSampleData() {
    const sampleData = {
        avgPerformance: '75',
        attendanceRate: '80',
        courseInterest: '4',
        studyHours: '2',
        stressLevel: '3',
        socialIsolation: '2',
        helpSeeking: '3',
        familySupport: '4',
        motivation: '4',
        extracurricular: '2',
        workCommitment: '2',
        overwhelm: '2',
        financialProblems: '4',
        healthIssues: '5',
        institutionSupport: '4',
        sentimentFeedback: 'I enjoy my courses and have good support from family.'
    };

    // Populate form with sample data
    const form = document.getElementById('assessmentForm');
    for (const [fieldId, value] of Object.entries(sampleData)) {
        const field = form.querySelector(`#${fieldId}`);
        if (field) {
            field.value = value;
            // Trigger change event for sliders
            if (field.type === 'range') {
                updateSliderDisplay(field);
            }
        }
    }

    updateProgress();
}

// Make sample data loader available in console
window.loadSampleData = loadSampleData;

// ============================================
// PAGE UNLOAD HANDLER
// ============================================

window.addEventListener('beforeunload', function (event) {
    // Destroy chart on page unload to prevent memory leaks
    if (chartInstance) {
        chartInstance.destroy();
    }
});
