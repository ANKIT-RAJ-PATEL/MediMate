const { GoogleGenerativeAI } = require('@google/generative-ai');
const Report = require('../models/Report');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeReport(reportId) {
  try {
    const report = await Report.findById(reportId);
    if (!report || !report.extractedText) throw new Error('Report not found or no extracted text');

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a medical AI assistant. Analyze this medical report and provide a comprehensive, easy-to-understand explanation.

Report Type: ${report.reportType}
Extracted Data: ${report.extractedText}

Structured Parameters: ${JSON.stringify(report.structuredData?.parameters || [])}

Please provide:
1. A clear summary of what this report shows
2. Risk level assessment (low/moderate/high/critical)
3. For EACH parameter found, explain:
   - What it measures
   - Whether the value is normal, high, or low
   - What it means for health
   - Possible causes if abnormal
4. Lifestyle recommendations:
   - Diet suggestions (foods to eat and avoid)
   - Exercise recommendations
   - Suggested specialist doctor type
5. Overall health assessment

Format your response as JSON with this structure:
{
  "summary": "...",
  "riskLevel": "low|moderate|high|critical",
  "explanations": [
    { "parameter": "...", "explanation": "...", "recommendation": "..." }
  ],
  "lifestyleRecommendations": {
    "diet": ["..."],
    "exercise": ["..."],
    "foods_to_avoid": ["..."],
    "suggestedSpecialist": "..."
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let aiAnalysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      aiAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: text, riskLevel: 'moderate', explanations: [], lifestyleRecommendations: {} };
    } catch {
      aiAnalysis = { summary: text, riskLevel: 'moderate', explanations: [], lifestyleRecommendations: {} };
    }

    aiAnalysis.generatedAt = new Date();

    await Report.findByIdAndUpdate(reportId, { aiAnalysis, analysisStatus: 'completed' });
    return aiAnalysis;
  } catch (error) {
    await Report.findByIdAndUpdate(reportId, { analysisStatus: 'failed' });
    throw error;
  }
}

async function generateChatResponse(message, context, userProfile) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are MediMind AI, a helpful healthcare assistant. Answer the user's health question based on their profile and any medical context provided.

${userProfile ? `Patient Profile: ${userProfile}` : ''}
${context ? `Medical Context: ${context}` : ''}

User Question: ${message}

Provide a helpful, accurate, and easy-to-understand response. Always remind the user to consult a healthcare professional for personalized medical advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return "I'm having trouble processing your request right now. Please try again later or consult a healthcare professional.";
  }
}

module.exports = { analyzeReport, generateChatResponse };
