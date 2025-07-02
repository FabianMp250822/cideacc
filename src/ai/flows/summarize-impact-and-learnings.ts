'use server';
/**
 * @fileOverview Summarizes the key impacts and learnings from CIDEACC's projects using AI.
 *
 * - summarizeImpactAndLearnings - A function that generates a summary of CIDEACC's impacts and learnings.
 * - SummarizeImpactAndLearningsInput - The input type for the summarizeImpactAndLearnings function.
 * - SummarizeImpactAndLearningsOutput - The return type for the summarizeImpactAndLearnings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeImpactAndLearningsInputSchema = z.object({
  projectOverview: z
    .string()
    .describe('An overview of CIDEACC projects and initiatives.'),
});
export type SummarizeImpactAndLearningsInput = z.infer<
  typeof SummarizeImpactAndLearningsInputSchema
>;

const SummarizeImpactAndLearningsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key insights, impacts, and learnings from CIDEACC projects.'
    ),
});
export type SummarizeImpactAndLearningsOutput = z.infer<
  typeof SummarizeImpactAndLearningsOutputSchema
>;

export async function summarizeImpactAndLearnings(
  input: SummarizeImpactAndLearningsInput
): Promise<SummarizeImpactAndLearningsOutput> {
  return summarizeImpactAndLearningsFlow(input);
}

const summarizeImpactAndLearningsPrompt = ai.definePrompt({
  name: 'summarizeImpactAndLearningsPrompt',
  input: {schema: SummarizeImpactAndLearningsInputSchema},
  output: {schema: SummarizeImpactAndLearningsOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing key insights and impacts from CIDEACC projects.

  Given the following overview of CIDEACC's projects and initiatives, provide a concise summary of their key impacts and learnings:

  {{projectOverview}}

  Focus on measurable outcomes, organizational improvements, and important lessons learned.
  The summary should be easy to understand for a general audience.
  `, // end of prompt
});

const summarizeImpactAndLearningsFlow = ai.defineFlow(
  {
    name: 'summarizeImpactAndLearningsFlow',
    inputSchema: SummarizeImpactAndLearningsInputSchema,
    outputSchema: SummarizeImpactAndLearningsOutputSchema,
  },
  async input => {
    const {output} = await summarizeImpactAndLearningsPrompt(input);
    return output!;
  }
);
