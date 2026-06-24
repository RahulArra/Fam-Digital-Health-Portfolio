const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "was",
  "what",
  "when",
  "with",
  "you",
  "your"
]);

const QUERY_SYNONYMS = {
  sugar: ["diabetes", "glucose"],
  diabetic: ["diabetes", "glucose"],
  bp: ["blood", "pressure", "hypertension"],
  heart: ["cardiac", "cholesterol"],
  medicine: ["medication", "medications", "prescription"],
  medicines: ["medication", "medications", "prescription"],
  workout: ["exercise", "activity", "fitness"],
  workouts: ["exercise", "activity", "fitness"],
  sleep: ["rest", "recovery"],
  diet: ["nutrition", "foods", "meal"],
  reminder: ["medication", "followup", "appointment"],
  reminders: ["medication", "followup", "appointment"]
};

function formatList(value) {
  if (!value) {
    return "None";
  }

  if (Array.isArray(value)) {
    const filtered = value.map((item) => String(item).trim()).filter(Boolean);
    return filtered.length ? filtered.join(", ") : "None";
  }

  if (typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, item]) => item !== undefined && item !== null && String(item).trim() !== "")
      .map(([key, item]) => `${key}: ${item}`);

    return entries.length ? entries.join(", ") : "None";
  }

  const text = String(value).trim();
  return text || "None";
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && token.length > 1 && !STOP_WORDS.has(token));
}

function expandTokens(tokens) {
  const expanded = new Set(tokens);

  tokens.forEach((token) => {
    const synonyms = QUERY_SYNONYMS[token] || [];
    synonyms.forEach((synonym) => expanded.add(synonym));
  });

  return [...expanded];
}

module.exports = {
  expandTokens,
  formatList,
  tokenize
};
