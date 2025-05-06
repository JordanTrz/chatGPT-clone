import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_PUBLIC_KEY });

const safetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_LOW_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_LOW_AND_ABOVE',
  },
];

async function model(contents, setAnswer) {
  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    history: [
      {
        role: 'user',
        parts: [{ text: 'Hello' }],
      },
      {
        role: 'model',
        parts: [{ text: 'Great to meet you. What would you like to know?' }],
      },
    ],
    config: {
      safetySettings,
    },
  });

  const stream = await chat.sendMessageStream(contents);
  let response = '';

  for await (const chunk of stream) {
    response += chunk.text;
    setAnswer(response);
  }
}

export default model;
