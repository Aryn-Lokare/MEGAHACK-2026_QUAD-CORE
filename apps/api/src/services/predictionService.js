import Groq from "groq-sdk";
import prisma from '@repo/database';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class PredictionService {
  async predictStudentPerformance(studentId, metrics) {
    const { averageGrade, completionRate, lateSubmissionRate, activityScore } = metrics;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an educational AI assistant. Predict student performance. Return JSON with riskLevel (High, Medium, Low), predictedGrade (A, B, C, D, F), and recommendation."
          },
          {
            role: "user",
            content: `Student Stats: Avg Grade: ${averageGrade}, Completion: ${completionRate}%, Late: ${lateSubmissionRate}%, Activity: ${activityScore}.`
          }
        ],
        model: "llama-3.1-70b-versatile",
        response_format: { type: "json_object" }
      });

      const prediction = JSON.parse(completion.choices[0].message.content);

      // Persist to DB
      const result = await prisma.prediction.create({
        data: {
          studentId,
          riskLevel: prediction.riskLevel,
          predictedGrade: prediction.predictedGrade,
          recommendation: prediction.recommendation
        }
      });

      return result;
    } catch (error) {
      console.error("AI Prediction failed:", error);
      return {
        studentId,
        riskLevel: "Medium",
        predictedGrade: "B",
        recommendation: "Monitor progress and provide additional resources."
      };
    }
  }

  async getLatestPrediction(studentId) {
    return await prisma.prediction.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
