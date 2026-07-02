const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const Report = require('../models/Report');

const REPORT_PATTERNS = {
  blood_test: {
    patterns: [
      { name: 'Hemoglobin', regex: /hemoglobin[:\s]*(\d+\.?\d*)\s*(g\/dL|g\/dl)/i, unit: 'g/dL', range: '12-16' },
      { name: 'RBC Count', regex: /rbc[:\s]*(\d+\.?\d*)\s*(million|mil)/i, unit: 'million/µL', range: '4.5-5.5' },
      { name: 'WBC Count', regex: /wbc[:\s]*(\d+\.?\d*)\s*(thousand|k)/i, unit: 'thousand/µL', range: '4-11' },
      { name: 'Platelets', regex: /platelets[:\s]*(\d+\.?\d*)\s*(thousand|k|lakh)/i, unit: 'thousand/µL', range: '150-400' },
    ]
  },
  glucose: {
    patterns: [
      { name: 'Fasting Glucose', regex: /fasting\s*(glucose|sugar)[:\s]*(\d+\.?\d*)\s*(mg\/dL|mg\/dl)/i, unit: 'mg/dL', range: '70-100' },
      { name: 'Random Glucose', regex: /random\s*(glucose|sugar)[:\s]*(\d+\.?\d*)\s*(mg\/dL)/i, unit: 'mg/dL', range: '70-140' },
      { name: 'HbA1c', regex: /hba1c[:\s]*(\d+\.?\d*)\s*%?/i, unit: '%', range: '<5.7' },
    ]
  },
  lipid: {
    patterns: [
      { name: 'Total Cholesterol', regex: /total\s*cholesterol[:\s]*(\d+\.?\d*)\s*(mg\/dL)/i, unit: 'mg/dL', range: '<200' },
      { name: 'HDL Cholesterol', regex: /hdl[:\s]*(\d+\.?\d*)\s*(mg\/dL)/i, unit: 'mg/dL', range: '40-60' },
      { name: 'LDL Cholesterol', regex: /ldl[:\s]*(\d+\.?\d*)\s*(mg\/dL)/i, unit: 'mg/dL', range: '<100' },
      { name: 'Triglycerides', regex: /triglycerides[:\s]*(\d+\.?\d*)\s*(mg\/dL)/i, unit: 'mg/dL', range: '<150' },
    ]
  }
};

async function extractTextFromPDF(buffer) {
  const data = await pdf(buffer);
  return data.text;
}

async function extractTextFromImage(buffer) {
  const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
  return text;
}

function parseReportData(text, reportType) {
  const parameters = [];
  const allPatterns = Object.values(REPORT_PATTERNS).flatMap(p => p.patterns);

  for (const pattern of allPatterns) {
    const match = text.match(pattern.regex);
    if (match) {
      const value = parseFloat(match[1]);
      const rangeParts = pattern.range.split('-').map(Number);
      let status = 'normal';
      if (rangeParts.length === 2) {
        if (value < rangeParts[0]) status = 'low';
        else if (value > rangeParts[1]) status = 'high';
      } else if (pattern.range.startsWith('<')) {
        if (value >= parseFloat(pattern.range.slice(1))) status = 'high';
      }
      parameters.push({
        name: pattern.name, value: match[1], unit: pattern.unit,
        referenceRange: pattern.range, status
      });
    }
  }
  return { parameters };
}

async function processReportOCR(reportId) {
  try {
    const report = await Report.findById(reportId);
    if (!report) return;

    await Report.findByIdAndUpdate(reportId, { ocrStatus: 'processing' });

    const response = await fetch(report.fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    let extractedText;
    if (report.fileType === 'pdf') {
      extractedText = await extractTextFromPDF(buffer);
    } else {
      extractedText = await extractTextFromImage(buffer);
    }

    const structuredData = parseReportData(extractedText, report.reportType);

    await Report.findByIdAndUpdate(reportId, {
      extractedText, structuredData, ocrStatus: 'completed'
    });

    return { extractedText, structuredData };
  } catch (error) {
    await Report.findByIdAndUpdate(reportId, { ocrStatus: 'failed' });
    throw error;
  }
}

module.exports = { processReportOCR, extractTextFromPDF, extractTextFromImage, parseReportData };
