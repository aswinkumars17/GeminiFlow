'use server';

/**
 * @fileOverview A flow to generate a first message suggestion for a chatbot based on a given topic.
 *
 * - generateFirstMessage - A function that generates a starting message for a conversation.
 * - GenerateFirstMessageInput - The input type for the generateFirstMessage function.
 * - GenerateFirstMessageOutput - The return type for the generateFirstMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFirstMessageInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a starting message suggestion.'),
});
export type GenerateFirstMessageInput = z.infer<typeof GenerateFirstMessageInputSchema>;

const GenerateFirstMessageOutputSchema = z.object({
  suggestedMessage: z.string().describe('A suggested starting message for the given topic.'),
});
export type GenerateFirstMessageOutput = z.infer<typeof GenerateFirstMessageOutputSchema>;

export async function generateFirstMessage(input: GenerateFirstMessageInput): Promise<GenerateFirstMessageOutput> {
  return generateFirstMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFirstMessagePrompt',
  input: {schema: GenerateFirstMessageInputSchema},
  output: {schema: GenerateFirstMessageOutputSchema},
  prompt: `You are a chatbot assistant that helps users start conversations.
  Based on the topic provided by the user, suggest a starting message that is engaging and relevant.

  Topic: {{{topic}}}
  `,
});

const generateFirstMessageFlow = ai.defineFlow(
  {
    name: 'generateFirstMessageFlow',
    inputSchema: GenerateFirstMessageInputSchema,
    outputSchema: GenerateFirstMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
