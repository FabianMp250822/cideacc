'use server';

import { summarizeImpactAndLearnings, SummarizeImpactAndLearningsInput } from '@/ai/flows/summarize-impact-and-learnings';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  privacy: z.boolean(),
});

export async function sendContactMessage(values: z.infer<typeof contactFormSchema>) {
  // This is a server action.
  // In a real application, you would process the form data here,
  // e.g., send an email, save to a database, etc.
  console.log('Received contact message:', values);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demonstration, we'll just return a success response.
  // In a real app, you might throw an error if something goes wrong.
  // if (Math.random() > 0.5) {
  //   throw new Error("Failed to send message");
  // }

  return { success: true };
}

export async function generateImpactSummary(input: SummarizeImpactAndLearningsInput) {
  try {
    const summary = await summarizeImpactAndLearnings(input);
    return summary;
  } catch (error) {
    console.error('Error generating impact summary:', error);
    // You can handle the error more gracefully here
    return { summary: 'Error: Could not generate summary.' };
  }
}
