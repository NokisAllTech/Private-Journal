const prompts = [
  "What is one thing you learned about yourself today?",
  "What emotion showed up the strongest today, and why?",
  "What is something you handled better than your old self would have?",
  "What are you avoiding, and what is one small step toward facing it?",
  "What made you feel calm, proud, or grateful today?",
  "What is one thought you want to release before tomorrow?",
  "What choice today moved you closer to the person you want to become?",
  "Where did you show patience, courage, or discipline today?",
  "What would make tomorrow meaningful?",
  "What do you need to forgive yourself for today?",
];

export function getDailyPrompt() {
  const today = new Date().toISOString().split("T")[0];

  let hash = 0;

  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % prompts.length;

  return prompts[index];
}