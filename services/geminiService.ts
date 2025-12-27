
import { GoogleGenAI } from "@google/genai";

// Always use the named parameter and direct process.env.API_KEY reference
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartReportSummary = async (studentName: string, grades: any[]) => {
  const prompt = `Analiza las siguientes notas del estudiante ${studentName} del Instituto Cristiano Misión Boston y genera un resumen motivador para los padres en español.
  Notas: ${JSON.stringify(grades)}
  Sé empático, resalta fortalezas y sugiere áreas de mejora con el lema 'Sabiduría, Fe y Amor'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No se pudo generar el resumen inteligente en este momento.";
  }
};

export const generateSchoolNotice = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escribe una circular escolar formal sobre: ${topic}. Para el Instituto Cristiano Misión Boston.`,
      config: {
        systemInstruction: "Eres el asistente administrativo de una institución educativa cristiana. Tu tono es profesional, acogedor y respetuoso.",
      }
    });
    return response.text;
  } catch (error) {
    return "Error generando circular.";
  }
};
