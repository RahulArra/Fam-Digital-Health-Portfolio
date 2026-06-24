const { formatList } = require("./textUtils");

function buildGroundingSummary(profile, records, matches, deriveBMI) {
  const latestBmi = deriveBMI(profile);
  const upcomingFollowUps = records.filter((record) => record.followUpRequired).length;

  return {
    latestBmi,
    conditionsIndexed: profile?.healthConditions?.length || 0,
    medicationsIndexed: profile?.medications?.length || 0,
    recordsIndexed: records.length,
    chunksRetrieved: matches.length,
    pendingFollowUps: upcomingFollowUps
  };
}

function buildContextBlock(matches) {
  return matches
    .map(
      (match, index) =>
        `Source ${index + 1} | ${match.title} | ${match.sourceLabel}\n${match.content}`
    )
    .join("\n\n");
}

function buildTransientContext(payload = {}) {
  const latestBmi =
    payload.height && payload.weight
      ? Number((payload.weight / ((payload.height / 100) * (payload.height / 100))).toFixed(2))
      : null;

  const content = `Patient age ${payload.age || "unknown"}, height ${payload.height || "unknown"} cm, weight ${
    payload.weight || "unknown"
  } kg, BMI ${latestBmi || "unknown"}. Health conditions: ${formatList(
    payload.healthConditions
  )}. Medications: ${formatList(payload.medications)}. Therapies: ${formatList(
    payload.therapies
  )}. Daily activity: ${formatList(payload.dailyActivity)}. Bad habits: ${formatList(payload.badHabits)}.`;

  return {
    profile: payload,
    records: [],
    matches: [
      {
        id: "request-context",
        sourceType: "request",
        sourceLabel: "Live request payload",
        title: "Current user supplied health context",
        content,
        score: 1,
        matchedTerms: []
      }
    ],
    contextBlock: `Source 1 | Current user supplied health context | Live request payload\n${content}`,
    summary: {
      latestBmi,
      conditionsIndexed: Array.isArray(payload.healthConditions) ? payload.healthConditions.length : 0,
      medicationsIndexed: Array.isArray(payload.medications) ? payload.medications.length : 0,
      recordsIndexed: 0,
      chunksRetrieved: 1,
      pendingFollowUps: 0
    }
  };
}

function serializeGrounding(matches, summary) {
  return {
    summary,
    sources: matches.map((match) => ({
      id: match.id,
      title: match.title,
      sourceType: match.sourceType,
      sourceLabel: match.sourceLabel,
      score: match.score,
      snippet: match.content,
      matchedTerms: match.matchedTerms,
      metadata: match.metadata || {}
    }))
  };
}

module.exports = {
  buildContextBlock,
  buildGroundingSummary,
  buildTransientContext,
  serializeGrounding
};
