import { generateQuestions } from '../lib/llm';

async function testLlm() {
  const content = "The impact of artificial intelligence on modern society is profound and far-reaching. AI technologies are reshaping industries, enhancing productivity, and raising ethical questions about privacy and job displacement.";
  
  try {
    const questions = await generateQuestions(content);
    console.log("Generated questions:");
    questions.forEach((q, index) => console.log(`${index + 1}. ${q}`));
  } catch (error) {
    console.error("Error:", error);
  }
}

testLlm();