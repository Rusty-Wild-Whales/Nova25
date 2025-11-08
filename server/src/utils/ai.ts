import type { Bill, UserProfile } from "../types";

// Replace this module with calls to real AI services (OpenAI, Claude, etc.)
// or custom ML pipelines when integrating production-grade intelligence.

const MAX_SENTENCES = 4;

const cleanSentences = (text: string): string[] => {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

export function summarize(text: string, category: string): string {
  const sentences = cleanSentences(text);
  if (!sentences.length) {
    return `This ${category.toLowerCase()} bill currently lacks detailed text, but CivicLens will summarize it when the full language becomes available.`;
  }

  const intro = sentences.slice(0, Math.min(MAX_SENTENCES, sentences.length)).join(" ");
  const closing =
    sentences.length > MAX_SENTENCES
      ? sentences.slice(-2).join(" ")
      : sentences.slice(-1).join(" ");

  return [
    `Focus area: ${category}.`,
    intro,
    sentences.length > MAX_SENTENCES ? `Key follow-up: ${closing}` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

export function recommend(bills: Bill[], userProfile: UserProfile): Bill[] {
  if (!userProfile.state && !userProfile.interests?.length) {
    return bills.slice(0, 3);
  }

  return bills.filter((bill) => {
    const matchesState = userProfile.state && bill.state === userProfile.state;
    const matchesInterest = userProfile.interests?.some(
      (interest) => interest.toLowerCase() === bill.category.toLowerCase()
    );
    return matchesState || matchesInterest;
  });
}
