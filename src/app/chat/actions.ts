'use server';

import { ai } from '@/ai/genkit';
import { generate, type MessageData } from 'genkit';

// Maps our simplified Message roles to Genkit's expected roles.
function toGenkitRole(role: 'user' | 'assistant'): 'user' | 'model' {
  return role === 'user' ? 'user' : 'model';
}

export async function getAIResponse(
  history: { role: 'user' | 'assistant'; content: string }[]
) {
  try {
    const llm = ai.model;

    // Convert our message history to the format Genkit expects.
    const genkitMessages: MessageData[] = history.map(message => ({
      role: toGenkitRole(message.role),
      content: [{ text: message.content }],
    }));

    const response = await generate({
      model: llm,
      prompt: {
        messages: genkitMessages,
      },
    });

    return { success: true, message: response.text };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}
