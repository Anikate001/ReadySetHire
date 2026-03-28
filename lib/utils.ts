import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatQuestionResponse = (response: string) => {
  const startIndex = response?.indexOf('Question:');
  const endIndex = response?.indexOf('Hint:');
  if (startIndex !== -1 && endIndex !== -1) {
    const question = response.substring(startIndex + 10, endIndex).trim();
    const hint = response.substring(endIndex + 5).trim();
    return { question, hint };
  }
  return { question: '', hint: '' };
};
export const formatQuestionResponseGroq = (response: string) => {
  const startIndex = response?.indexOf('Question:');
  const endIndex = response?.indexOf('Answer:');
  if (startIndex !== -1 && endIndex !== -1) {
    const question = response.substring(startIndex + 10, endIndex).trim();
    const answer = response.substring(endIndex + 7).trim();
    return { question, answer };
  }
  return { question: '', answer: '' };
};

export function trimLink(link: string): string {
  // Extract the part after 'meeting/'
  const trimmedPart = link.split('meeting/')[1];
  // Prepend 'meeting/' to the extracted part
  const newLink = 'meeting/' + trimmedPart;
  return newLink;
}