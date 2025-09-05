'use server';

/**
 * @fileOverview This file contains a Genkit flow for improving a given message using the Gemini API.
 *
 * It exports:
 * - `improveMessage`: An async function that takes an `ImproveMessageInput` and returns an `ImproveMessageOutput`.
 * - `ImproveMessageInput`: The TypeScript type definition for the input object.
 * - `ImproveMessageOutput`: The TypeScript type definition for the output object.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveMessageInputSchema = z.object({
  message: z.string().describe('The message to be improved.'),
});

export type ImproveMessageInput = z.infer<typeof ImproveMessageInputSchema>;

const ImproveMessageOutputSchema = z.object({
  improvedMessage: z.string().describe('The improved message.'),
});

export type ImproveMessageOutput = z.infer<typeof ImproveMessageOutputSchema>;

export async function improveMessage(input: ImproveMessageInput): Promise<ImproveMessageOutput> {
  return improveMessageFlow(input);
}

const improveMessagePrompt = ai.definePrompt({
  name: 'improveMessagePrompt',
  input: {schema: ImproveMessageInputSchema},
  output: {schema: ImproveMessageOutputSchema},
  prompt: `Please rewrite the following message to improve its clarity, grammar, and overall quality:\n\n{{{message}}}`,
});

const improveMessageFlow = ai.defineFlow(
  {
    name: 'improveMessageFlow',
    inputSchema: ImproveMessageInputSchema,
    outputSchema: ImproveMessageOutputSchema,
  },
  async input => {
    const {output} = await improveMessagePrompt(input);
    return output!;
  }
);
