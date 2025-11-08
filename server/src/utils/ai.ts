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

const simplifySentence = (sentence: string): string => {
  const trimmed = sentence
    .replace(/Section\s+\d+/gi, "this bill")
    .replace(/Notwithstanding.*?[,;]/gi, "")
    .replace(/\bshall\b/gi, "will")
    .replace(/\bthereof\b/gi, "of it");
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export function summarize(text: string, category: string): string {
  const sentences = cleanSentences(text);
  if (!sentences.length) {
    return `Plain-language recap:\n- This ${category.toLowerCase()} bill currently lacks detailed text, but CivicLens will summarize it when the full language becomes available.`;
  }

  const takeaways = sentences.slice(0, MAX_SENTENCES).map((sentence) => simplifySentence(sentence));

  if (takeaways.length < MAX_SENTENCES && sentences.length > MAX_SENTENCES) {
    takeaways.push(simplifySentence(sentences[sentences.length - 1]));
  }

  const bullets = takeaways.map((sentence) => `- ${sentence}`);
  return [`Plain-language recap (${category}):`, ...bullets, "- Track agency updates and funding details in committee markups."].join(
    "\n"
  );
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
