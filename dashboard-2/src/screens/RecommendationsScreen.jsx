import React from 'react';
import { ScreenContainer, RecommendationCard, Card, Button } from '../components/index.jsx';
import { RECOMMENDATIONS } from '../data/questions.js';
import jsPDF from 'jspdf';

/**
 * Screen 4: Recommendations & Insights
 * 
 * Personalized, rule-based suggestions mapped to low factor scores
 * with supportive language and system disclaimer
 */
// Advisor email address - update this with your advisor's email
const ADVISOR_EMAIL = 'advisor@university.edu'; // TODO: Replace with actual advisor email

export function RecommendationsScreen({ recommendations, analysisData, onBack, onRestart, onViewMLModel }) {
  const hasRecommendations = recommendations && recommendations.length > 0;

  // Export functionality
  const handleCopySummary = () => {
    const summary = generateTextSummary(analysisData, recommendations);
    navigator.clipboard.writeText(summary).then(() => {
      alert('Summary copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy. Please try again.');
    });
  };

  // Open Gmail draft to share with advisor
  const handleShareWithAdvisor = () => {
    const summary = generateTextSummary(analysisData, recommendations);
    const riskLevel = analysisData?.overallScore <= 0.33 ? 'Low Risk' : 
                     analysisData?.overallScore <= 0.66 ? 'Medium Risk' : 'High Risk';
    
    const subject = encodeURIComponent('Student Risk Assessment - Support Request');
    const body = encodeURIComponent(
      `Dear Academic Advisor,\n\n` +
      `I recently completed a self-assessment through the DTL Early-Warning System.\n\n` +
      `Assessment Results:\n` +
      `- Risk Level: ${riskLevel}\n` +
      `- Risk Score: ${analysisData ? (analysisData.overallScore * 100).toFixed(1) : 0}%\n\n` +
      `Full Assessment Summary:\n${summary}\n\n` +
      `I would appreciate the opportunity to discuss these findings and available support resources.\n\n` +
      `Thank you,\n` +
      `[Your Name]`
    );
    
    // Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ADVISOR_EMAIL)}&su=${subject}&body=${body}`;
    
    // Open in new tab
    window.open(gmailUrl, '_blank');
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;
    
    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };
    
    // Helper function to add text with word wrap
    const addText = (text, fontSize, fontStyle = 'normal', color = [0, 0, 0], lineHeight = fontSize * 1.5) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(...color);
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      const textHeight = lines.length * lineHeight;
      
      checkPageBreak(textHeight + 10);
      
      lines.forEach((line) => {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };
    
    // Helper function to add a divider line
    const addDivider = () => {
      checkPageBreak(15);
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(1);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
    };
    
    // Generate report data
    const data = analysisData;
    const recs = recommendations;
    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const riskLevel = data.overallScore <= 0.33 ? 'Low Risk' : 
                     data.overallScore <= 0.66 ? 'Moderate Risk' : 'High Risk';
    const algorithmName = data.algorithmUsed === 'random_forest' ? 'Random Forest Classifier' : 'XGBoost with SMOTE Enhancement';
    
    // HEADER
    pdf.setFillColor(41, 98, 255);
    pdf.rect(0, 0, pageWidth, 100, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STUDENT WELLNESS ASSESSMENT REPORT', pageWidth / 2, 40, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Confidential Psychological Evaluation', pageWidth / 2, 65, { align: 'center' });
    
    yPosition = 130;
    
    // ASSESSMENT INFORMATION
    addText('ASSESSMENT INFORMATION', 14, 'bold', [41, 98, 255]);
    yPosition += 5;
    addDivider();
    
    addText(`Date of Assessment: ${dateStr}`, 10, 'normal');
    addText(`Time of Completion: ${timeStr}`, 10, 'normal');
    addText(`Assessment Tool: Student Dropout Risk Prediction System`, 10, 'normal');
    addText(`ML Algorithm Used: ${algorithmName}`, 10, 'normal');
    addText(`Report Type: Comprehensive Wellness Evaluation`, 10, 'normal');
    addText(`Confidentiality Level: Protected Health Information`, 10, 'normal');
    yPosition += 10;
    
    // EXECUTIVE SUMMARY
    checkPageBreak(100);
    addText('EXECUTIVE SUMMARY', 14, 'bold', [41, 98, 255]);
    yPosition += 5;
    addDivider();
    
    addText(`Overall Risk Classification: ${riskLevel.toUpperCase()}`, 11, 'bold', [220, 38, 38]);
    addText(`Risk Score: ${(data.overallScore * 100).toFixed(1)}%`, 10, 'normal');
    addText(`Prediction: ${data.prediction || 'N/A'}`, 10, 'normal');
    addText(`Confidence Level: ${data.confidence ? (data.confidence * 100).toFixed(1) + '%' : 'N/A'}`, 10, 'normal');
    yPosition += 10;
    
    // Clinical Impression
    addText('CLINICAL IMPRESSION:', 11, 'bold');
    yPosition += 5;
    
    let impression = '';
    if (riskLevel === 'High Risk') {
      impression = 'The assessment indicates significant risk factors that warrant immediate attention and intervention. Student demonstrates multiple indicators suggesting potential academic disengagement and/or psychological distress. Immediate referral to student support services is strongly recommended.';
    } else if (riskLevel === 'Moderate Risk') {
      impression = 'The assessment reveals moderate risk factors that suggest the student may benefit from proactive support and monitoring. While not at immediate risk, early intervention may prevent escalation of concerns. Regular check-ins and resource provision are recommended.';
    } else {
      impression = 'The assessment indicates low risk with positive indicators of academic engagement and emotional well-being. Student appears to have adequate support systems and coping mechanisms. Continue current positive practices and maintain awareness of available resources.';
    }
    addText(impression, 10, 'normal');
    yPosition += 15;
    
    // MULTI-DIMENSIONAL ANALYSIS
    checkPageBreak(100);
    addText('MULTI-DIMENSIONAL ANALYSIS', 14, 'bold', [41, 98, 255]);
    yPosition += 5;
    addDivider();
    
    const factorDescriptions = {
      'Academic Consistency': 'Academic performance, faculty relationships, institutional support utilization',
      'Emotional Well-being': 'Stress management, social connections, family support, health status',
      'Engagement & Motivation': 'Course interest, study motivation, extracurricular involvement, attendance',
      'External / Financial Pressure': 'Financial challenges, external commitments, study time availability'
    };
    
    Object.entries(data.factorScores || {}).forEach(([factor, score]) => {
      checkPageBreak(80);
      const scorePercent = (score * 100).toFixed(1);
      const severity = score > 0.66 ? 'HIGH CONCERN' : score > 0.33 ? 'MODERATE CONCERN' : 'LOW CONCERN';
      const severityColor = score > 0.66 ? [220, 38, 38] : score > 0.33 ? [234, 179, 8] : [34, 197, 94];
      
      addText(factor.toUpperCase(), 11, 'bold');
      pdf.setTextColor(...severityColor);
      addText(`Risk Score: ${scorePercent}% | Severity: ${severity}`, 10, 'bold');
      pdf.setTextColor(0, 0, 0);
      addText(`Domain: ${factorDescriptions[factor] || ''}`, 9, 'normal');
      yPosition += 10;
    });
    
    // PERSONALIZED RECOMMENDATIONS
    checkPageBreak(100);
    addText('PERSONALIZED RECOMMENDATIONS', 14, 'bold', [41, 98, 255]);
    yPosition += 5;
    addDivider();
    
    if (recs && recs.length > 0) {
      recs.forEach((rec, idx) => {
        checkPageBreak(60);
        addText(`${idx + 1}. ${rec.title.toUpperCase()}`, 11, 'bold');
        addText(`Priority Level: ${rec.severity.toUpperCase()}`, 9, 'italic', [100, 100, 100]);
        addText('Recommended Actions:', 10, 'bold');
        
        rec.suggestions.forEach(suggestion => {
          checkPageBreak(30);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          const bulletLines = pdf.splitTextToSize(`• ${suggestion}`, contentWidth - 20);
          bulletLines.forEach((line) => {
            pdf.text(line, margin + 10, yPosition);
            yPosition += 14;
          });
        });
        yPosition += 10;
      });
    } else {
      addText('No specific interventions required at this time. Student demonstrates adequate functioning across assessed domains.', 10, 'normal');
    }
    
    yPosition += 10;
    
    // FOLLOW-UP PLAN
    checkPageBreak(100);
    addText('CLINICAL RECOMMENDATIONS & FOLLOW-UP PLAN', 14, 'bold', [41, 98, 255]);
    yPosition += 5;
    addDivider();
    
    addText('Follow-Up Actions:', 11, 'bold');
    yPosition += 5;
    
    if (riskLevel === 'High Risk') {
      addText('• Schedule meeting with academic advisor within 3-5 business days', 9, 'normal');
      addText('• Referral to student counseling services (urgent)', 9, 'normal');
      addText('• Weekly check-ins for first month', 9, 'normal');
      addText('• Re-assessment recommended in 30 days', 9, 'normal');
    } else if (riskLevel === 'Moderate Risk') {
      addText('• Schedule meeting with academic advisor within 2 weeks', 9, 'normal');
      addText('• Consider referral to student support services', 9, 'normal');
      addText('• Bi-weekly check-ins recommended', 9, 'normal');
      addText('• Re-assessment recommended in 60 days', 9, 'normal');
    } else {
      addText('• Maintain regular communication with academic advisor', 9, 'normal');
      addText('• Utilize campus resources as needed', 9, 'normal');
      addText('• Annual wellness check recommended', 9, 'normal');
    }
    yPosition += 15;
    
    // AVAILABLE RESOURCES
    addText('Available Campus Resources:', 11, 'bold');
    yPosition += 5;
    const resources = [
      'Student Counseling & Psychological Services',
      'Academic Support & Tutoring Center',
      'Financial Aid & Emergency Assistance Office',
      'Career Development & Planning Services',
      'Disability Support Services',
      'Student Health & Wellness Center',
      'Peer Mentoring Programs'
    ];
    resources.forEach(resource => {
      addText(`• ${resource}`, 9, 'normal');
    });
    yPosition += 15;
    
    // DISCLAIMERS
    checkPageBreak(150);
    addText('IMPORTANT DISCLAIMERS', 14, 'bold', [220, 38, 38]);
    yPosition += 5;
    addDivider();
    
    pdf.setFillColor(255, 243, 224);
    const disclaimerHeight = 120;
    checkPageBreak(disclaimerHeight + 20);
    pdf.rect(margin - 10, yPosition - 10, contentWidth + 20, disclaimerHeight, 'F');
    
    addText('CONFIDENTIALITY NOTICE:', 10, 'bold', [0, 0, 0], 12);
    addText('This assessment is confidential and intended solely for identifying students who may benefit from additional support services.', 9, 'normal', [0, 0, 0], 12);
    yPosition += 5;
    
    addText('LIMITATION OF ASSESSMENT:', 10, 'bold', [0, 0, 0], 12);
    addText('This is a screening tool, not a diagnostic instrument. Results should be interpreted as indicators for further exploration rather than definitive conclusions.', 9, 'normal', [0, 0, 0], 12);
    yPosition += 5;
    
    addText('CRISIS INTERVENTION:', 10, 'bold', [220, 38, 38], 12);
    addText('If experiencing thoughts of self-harm or suicide, contact emergency services immediately (911) or your institution\'s crisis hotline.', 9, 'normal', [0, 0, 0], 12);
    
    yPosition += 20;
    
    // FOOTER
    addDivider();
    addText('Generated by: DTL Student Dropout Risk Prediction System', 8, 'italic', [100, 100, 100], 11);
    addText('Institution: RV College of Engineering', 8, 'italic', [100, 100, 100], 11);
    addText(`Report Generated: ${dateStr} at ${timeStr}`, 8, 'italic', [100, 100, 100], 11);
    
    // Save PDF
    const filename = `Student_Wellness_Assessment_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  };

  const generatePsychologyReport = (data, recs) => {
    if (!data) return 'No assessment data available.';
    
    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const riskLevel = data.overallScore <= 0.33 ? 'Low Risk' : 
                     data.overallScore <= 0.66 ? 'Moderate Risk' : 'High Risk';
    
    const algorithmName = data.algorithmUsed === 'random_forest' ? 'Random Forest Classifier' : 'XGBoost with SMOTE Enhancement';
    
    let report = '';
    report += '═══════════════════════════════════════════════════════════════════════\n';
    report += '                    STUDENT WELLNESS ASSESSMENT REPORT\n';
    report += '                  Confidential Psychological Evaluation\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';
    
    report += 'ASSESSMENT INFORMATION\n';
    report += '─────────────────────────────────────────────────────────────────────\n';
    report += `Date of Assessment:        ${dateStr}\n`;
    report += `Time of Completion:        ${timeStr}\n`;
    report += `Assessment Tool:           Student Dropout Risk Prediction System\n`;
    report += `ML Algorithm Used:         ${algorithmName}\n`;
    report += `Report Type:               Comprehensive Wellness Evaluation\n`;
    report += `Confidentiality Level:     Protected Health Information\n\n`;
    
    report += '═══════════════════════════════════════════════════════════════════════\n';
    report += '                           EXECUTIVE SUMMARY\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';
    
    report += `OVERALL RISK CLASSIFICATION: ${riskLevel.toUpperCase()}\n`;
    report += `Risk Score: ${(data.overallScore * 100).toFixed(1)}%\n`;
    report += `Prediction: ${data.prediction || 'N/A'}\n`;
    report += `Confidence Level: ${data.confidence ? (data.confidence * 100).toFixed(1) + '%' : 'N/A'}\n\n`;
    
    if (riskLevel === 'High Risk') {
      report += 'CLINICAL IMPRESSION:\n';
      report += 'The assessment indicates significant risk factors that warrant immediate attention\n';
      report += 'and intervention. Student demonstrates multiple indicators suggesting potential\n';
      report += 'academic disengagement and/or psychological distress. Immediate referral to\n';
      report += 'student support services is strongly recommended.\n\n';
    } else if (riskLevel === 'Moderate Risk') {
      report += 'CLINICAL IMPRESSION:\n';
      report += 'The assessment reveals moderate risk factors that suggest the student may\n';
      report += 'benefit from proactive support and monitoring. While not at immediate risk,\n';
      report += 'early intervention may prevent escalation of concerns. Regular check-ins and\n';
      report += 'resource provision are recommended.\n\n';
    } else {
      report += 'CLINICAL IMPRESSION:\n';
      report += 'The assessment indicates low risk with positive indicators of academic\n';
      report += 'engagement and emotional well-being. Student appears to have adequate support\n';
      report += 'systems and coping mechanisms. Continue current positive practices and maintain\n';
      report += 'awareness of available resources.\n\n';
    }
    
    report += '═══════════════════════════════════════════════════════════════════════\n';
    report += '                      MULTI-DIMENSIONAL ANALYSIS\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';
    
    const factorDescriptions = {
      'Academic Consistency': {
        desc: 'Academic performance, faculty relationships, institutional support utilization',
        clinical: 'Indicators related to academic self-efficacy and institutional integration'
      },
      'Emotional Well-being': {
        desc: 'Stress management, social connections, family support, health status',
        clinical: 'Psychological and emotional functioning assessment'
      },
      'Engagement & Motivation': {
        desc: 'Course interest, study motivation, extracurricular involvement, attendance',
        clinical: 'Academic motivation and behavioral engagement indicators'
      },
      'External / Financial Pressure': {
        desc: 'Financial challenges, external commitments, study time availability',
        clinical: 'External stressors and resource availability assessment'
      }
    };
    
    Object.entries(data.factorScores || {}).forEach(([factor, score]) => {
      const scorePercent = (score * 100).toFixed(1);
      const severity = score > 0.66 ? 'HIGH CONCERN' : score > 0.33 ? 'MODERATE CONCERN' : 'LOW CONCERN';
      const factorInfo = factorDescriptions[factor] || { desc: '', clinical: '' };
      
      report += `${factor.toUpperCase()}\n`;
      report += `Risk Score: ${scorePercent}% | Severity: ${severity}\n`;
      report += `Domain: ${factorInfo.desc}\n`;
      report += `Clinical Relevance: ${factorInfo.clinical}\n`;
      
      if (score > 0.66) {
        report += '⚠ RECOMMENDATION: Immediate intervention required in this domain.\n';
      } else if (score > 0.33) {
        report += '⚡ RECOMMENDATION: Monitor closely and provide targeted support.\n';
      } else {
        report += '✓ FINDING: Functioning well in this domain.\n';
      }
      report += '\n';
    });
    
    if (data.sentimentAnalysis) {
      report += '─────────────────────────────────────────────────────────────────────\n';
      report += 'QUALITATIVE TEXT ANALYSIS\n';
      report += '─────────────────────────────────────────────────────────────────────\n';
      const sentimentScore = data.sentimentScore || 0;
      const sentimentLabel = sentimentScore > 0.2 ? 'Positive' : sentimentScore < -0.2 ? 'Negative' : 'Neutral';
      report += `Emotional Tone: ${sentimentLabel} (Score: ${sentimentScore.toFixed(2)})\n`;
      if (data.sentimentAnalysis.details?.dropoutSignals > 0) {
        report += '⚠ ALERT: Dropout-related language detected in written response.\n';
      }
      report += 'Analysis: Student\'s written responses were analyzed for emotional valence and\n';
      report += 'academic distress indicators using natural language processing techniques.\n\n';
    }
    
    report += '═══════════════════════════════════════════════════════════════════════\n';
    report += '                    PERSONALIZED RECOMMENDATIONS\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';
    
    if (recs && recs.length > 0) {
      recs.forEach((rec, idx) => {
        report += `${idx + 1}. ${rec.title.toUpperCase()}\n`;
        report += `   Priority Level: ${rec.severity.toUpperCase()}\n`;
        report += `   Recommended Actions:\n`;
        rec.suggestions.forEach(suggestion => {
          report += `   • ${suggestion}\n`;
        });
        report += '\n';
      });
    } else {
      report += 'No specific interventions required at this time. Student demonstrates\n';
      report += 'adequate functioning across assessed domains. Encourage continuation of\n';
      report += 'current positive practices and self-care strategies.\n\n';
    }
    
    report += '═══════════════════════════════════════════════════════════════════════\n';
    report += '                        CLINICAL RECOMMENDATIONS\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';
    
    report += 'FOLLOW-UP PLAN:\n';
    if (riskLevel === 'High Risk') {
      report += '• Schedule meeting with academic advisor within 3-5 business days\n';
      report += '• Referral to student counseling services (urgent)\n';
      report += '• Weekly check-ins for first month\n';
      report += '• Re-assessment recommended in 30 days\n';
    } else if (riskLevel === 'Moderate Risk') {
      report += '• Schedule meeting with academic advisor within 2 weeks\n';
      report += '• Consider referral to student support services\n';
      report += '• Bi-weekly check-ins recommended\n';
      report += '• Re-assessment recommended in 60 days\n';
    } else {
      report += '• Maintain regular communication with academic advisor\n';
      report += '• Utilize campus resources as needed\n';
      report += '• Annual wellness check recommended\n';
    }
    report += '\n';
    
    report += 'AVAILABLE CAMPUS RESOURCES:\n';
    report += '• Student Counseling & Psychological Services\n';
    report += '• Academic Support & Tutoring Center\n';
    report += '• Financial Aid & Emergency Assistance Office\n';
    report += '• Career Development & Planning Services\n';
    report += '• Disability Support Services\n';
    report += '• Student Health & Wellness Center\n';
    report += '• Peer Mentoring Programs\n\n';
    
    report += '═══════════════════════════════════════════════════════════════════════\n';
    report += '                     IMPORTANT DISCLAIMERS\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';
    
    report += 'CONFIDENTIALITY NOTICE:\n';
    report += 'This assessment is confidential and intended solely for the purpose of\n';
    report += 'identifying students who may benefit from additional support services.\n';
    report += 'Information contained herein should not be shared without explicit consent.\n\n';
    
    report += 'LIMITATION OF ASSESSMENT:\n';
    report += 'This is a screening tool, not a diagnostic instrument. Results should be\n';
    report += 'interpreted as indicators for further exploration rather than definitive\n';
    report += 'conclusions. Clinical judgment and professional evaluation supersede\n';
    report += 'automated risk scores.\n\n';
    
    report += 'CRISIS INTERVENTION:\n';
    report += 'If experiencing thoughts of self-harm or suicide, contact emergency services\n';
    report += 'immediately (911 in US) or your institution\'s crisis hotline. This assessment\n';
    report += 'is not a substitute for emergency mental health intervention.\n\n';
    
    report += '═══════════════════════════════════════════════════════════════════════\n';
    report += '                          TECHNICAL APPENDIX\n';
    report += '═══════════════════════════════════════════════════════════════════════\n\n';
    
    report += `Machine Learning Model: ${algorithmName}\n`;
    report += `Assessment Questions: 21 validated items across 4 domains\n`;
    report += `Model Accuracy: ${data.mlPrediction?.metrics?.accuracy ? (data.mlPrediction.metrics.accuracy * 100).toFixed(1) + '%' : 'See model documentation'}\n`;
    report += `Training Dataset: Real engineering student survey responses\n`;
    report += `Validation Method: Cross-validation with stratified sampling\n\n`;
    
    report += '─────────────────────────────────────────────────────────────────────\n';
    report += 'Generated by: DTL Student Dropout Risk Prediction System\n';
    report += 'Institution: RV College of Engineering\n';
    report += `Report Generated: ${dateStr} at ${timeStr}\n`;
    report += 'For questions or concerns, contact Student Support Services.\n';
    report += '─────────────────────────────────────────────────────────────────────\n\n';
    report += '                    END OF ASSESSMENT REPORT\n';
    
    return report;
  };

  const generateTextSummary = (data, recs) => {
    if (!data) return 'No assessment data available.';
    
    const riskLevel = data.overallScore <= 0.33 ? 'Low Risk' : 
                     data.overallScore <= 0.66 ? 'Medium Risk' : 'High Risk';
    
    let summary = 'STUDENT DROPOUT RISK ASSESSMENT SUMMARY\n';
    summary += '='.repeat(50) + '\n\n';
    summary += `Assessment Date: ${new Date().toLocaleDateString()}\n`;
    summary += `Overall Risk Level: ${riskLevel}\n`;
    summary += `Risk Score: ${(data.overallScore * 100).toFixed(1)}%\n\n`;
    
    summary += 'FACTOR BREAKDOWN:\n';
    summary += '-'.repeat(50) + '\n';
    Object.entries(data.factorScores || {}).forEach(([factor, score]) => {
      summary += `${factor}: ${(score * 100).toFixed(1)}%\n`;
    });
    summary += '\n';
    
    if (recs && recs.length > 0) {
      summary += 'PERSONALIZED RECOMMENDATIONS:\n';
      summary += '-'.repeat(50) + '\n';
      recs.forEach((rec, idx) => {
        summary += `${idx + 1}. ${rec.title} (${rec.severity.toUpperCase()} PRIORITY)\n`;
        rec.suggestions.forEach(suggestion => {
          summary += `   • ${suggestion}\n`;
        });
        summary += '\n';
      });
    }
    
    summary += '\n' + '='.repeat(50) + '\n';
    summary += 'This is an early-warning support tool, not a final decision system.\n';
    summary += 'For emergencies, contact your institution\'s crisis services.\n';
    
    return summary;
  };

  return (
    <ScreenContainer
      title="Personalized Support Recommendations"
      subtitle="Based on your assessment, here are targeted resources and next steps"
    >
      {/* Introduction */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Your Support Plan
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          The following recommendations are tailored to the areas where you indicated needing support.
          These are suggestions—not requirements. You are in control of what resources to explore.
        </p>
      </Card>

      {/* Recommendations */}
      {hasRecommendations ? (
        <div className="space-y-4 mb-8">
          {recommendations.map((rec, idx) => (
            <RecommendationCard key={idx} recommendation={rec} />
          ))}
        </div>
      ) : (
        <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 mb-8 text-center">
          <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
            ✓ You're Doing Well!
          </h3>
          <p className="text-green-800 dark:text-green-300 text-sm">
            Your assessment indicates strong engagement and support. Keep up the excellent work!
          </p>
        </Card>
      )}

      {/* Additional Resources Section */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Campus Resources Available to All Students
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            {
              title: 'Student Counseling Services',
              description: 'Free, confidential mental health support',
            },
            {
              title: 'Academic Support Center',
              description: 'Tutoring, study groups, and academic coaching',
            },
            {
              title: 'Financial Aid Office',
              description: 'Emergency grants, loans, and financial planning',
            },
            {
              title: 'Career Services',
              description: 'Career planning and employment resources',
            },
            {
              title: 'Disability Services',
              description: 'Accommodations and accessibility support',
            },
            {
              title: 'Student Health Services',
              description: 'Medical care and wellness programs',
            },
          ].map((resource, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-gray-700 rounded border border-purple-200 dark:border-purple-700">
              <p className="font-semibold text-gray-800 dark:text-white">{resource.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* System Disclaimer */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 mb-8">
        <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
          ⚠️ Important: System Disclaimer
        </h3>
        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
          <strong>This is an early-warning support tool, not a final decision system.</strong>
        </p>
        <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-2">
          <li>✓ This assessment is <strong>confidential and anonymous</strong>.</li>
          <li>✓ Results are used <strong>only for personalized support recommendations</strong>.</li>
          <li>✓ No data is shared with faculty, parents, or other systems.</li>
          <li>✓ This is <strong>not a prediction of failure or success</strong>.</li>
          <li>✓ If you're experiencing mental health crises, contact emergency services or your institution's crisis hotline immediately.</li>
        </ul>
      </Card>

      {/* Call to Action */}
      <Card className="text-center mb-8">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
          Ready to Take Action?
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Reach out to one of the resources above, or speak with your academic advisor about next steps.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleShareWithAdvisor}
          >
            Share with Advisor
          </Button>
        </div>
      </Card>

      {/* Export / Share Options */}
      <Card className="bg-gray-50 dark:bg-gray-800 mb-8">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-center">
          Keep Your Results
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center">
          Download a comprehensive professional report to share with your academic advisor or counselor.
        </p>
        <div className="flex justify-center">
          <Button variant="primary" size="lg" onClick={handleDownloadPDF}>
            📥 Download Professional Report
          </Button>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 mb-8">
        <Button onClick={onBack} variant="secondary" size="md">
          ← Back to Analysis
        </Button>
        <Button variant="primary" size="md" onClick={onRestart}>
          Retake Assessment
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-300 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Design Thinking Lab • Student Dropout Risk Prediction System
          <br />
          Questions? Contact your academic advisor or student support services.
        </p>
      </div>
    </ScreenContainer>
  );
}
