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

async function model(contents, history) {
  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    history,
    config: {
      safetySettings,
    },
  });

  return chat.sendMessageStream(contents);
}

export default model;
