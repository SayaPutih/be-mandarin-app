import groq from "../../config/groqai.js";
import { translationEvaluationPromptBuilder } from "../../ai/prompt/translation-evaluation.prompt.js";

export const evaluateEnglishTranslation = async ({
  mandarinText,
  expectedAnswer,
  userAnswer
}) => {

  
  const prompt = translationEvaluationPromptBuilder({
    mandarinText,
    expectedAnswer,
    userAnswer,
  });


  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  console.log("----evaluateEnglishTranslation----");
  console.log("---Raw---");
  console.log(response);
  console.log("---RawChoices---");
  console.log(response.choices);
  console.log("---Final---");
  console.log(response.choices[0].message.content);

  try {
    const content = response.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(content);
  } catch (err) {
    console.log(response.choices[0].message.content);

    return {
      score: 0,
      isCorrect: false,
      feedback: "Failed to parse LLM response",
    };
  }
}