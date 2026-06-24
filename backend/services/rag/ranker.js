const { expandTokens, tokenize } = require("./textUtils");

function buildVector(tokens, idfMap) {
  const frequency = new Map();

  tokens.forEach((token) => {
    frequency.set(token, (frequency.get(token) || 0) + 1);
  });

  const size = tokens.length || 1;
  const vector = new Map();
  let magnitude = 0;

  frequency.forEach((count, token) => {
    const weight = (count / size) * (idfMap.get(token) || 1);
    vector.set(token, weight);
    magnitude += weight * weight;
  });

  return { vector, magnitude: Math.sqrt(magnitude) };
}

function cosineSimilarity(left, right) {
  if (!left.magnitude || !right.magnitude) {
    return 0;
  }

  const [smaller, larger] =
    left.vector.size < right.vector.size ? [left.vector, right.vector] : [right.vector, left.vector];

  let dot = 0;
  smaller.forEach((value, token) => {
    dot += value * (larger.get(token) || 0);
  });

  return dot / (left.magnitude * right.magnitude);
}

function keywordOverlap(queryTokens, documentTokens) {
  if (!queryTokens.length || !documentTokens.length) {
    return 0;
  }

  const documentSet = new Set(documentTokens);
  let matches = 0;

  queryTokens.forEach((token) => {
    if (documentSet.has(token)) {
      matches += 1;
    }
  });

  return matches / queryTokens.length;
}

function getRecencyScore(recordedAt) {
  if (!recordedAt) {
    return 0.2;
  }

  const date = new Date(recordedAt);
  if (Number.isNaN(date.getTime())) {
    return 0.2;
  }

  const daysOld = Math.max(0, (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0.15, 1 - Math.min(daysOld, 365) / 365);
}

function buildIdfMap(tokenizedDocuments) {
  const df = new Map();
  const totalDocs = tokenizedDocuments.length || 1;

  tokenizedDocuments.forEach((tokens) => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((token) => {
      df.set(token, (df.get(token) || 0) + 1);
    });
  });

  const idfMap = new Map();
  df.forEach((count, token) => {
    idfMap.set(token, Math.log((1 + totalDocs) / (1 + count)) + 1);
  });

  return idfMap;
}

function rankChunks(chunks, query, topK) {
  if (!chunks.length) {
    return [];
  }

  const preparedChunks = chunks.map((chunk) => {
    const tokens = expandTokens(tokenize(`${chunk.title} ${chunk.content} ${chunk.sourceLabel}`));
    return { ...chunk, tokens };
  });

  const idfMap = buildIdfMap(preparedChunks.map((chunk) => chunk.tokens));
  const queryTokens = expandTokens(tokenize(query));
  const queryVector = buildVector(queryTokens, idfMap);

  return preparedChunks
    .map((chunk) => {
      const documentVector = buildVector(chunk.tokens, idfMap);
      const semanticScore = cosineSimilarity(queryVector, documentVector);
      const lexicalScore = keywordOverlap(queryTokens, chunk.tokens);
      const recencyScore = getRecencyScore(chunk.recordedAt);
      const profileBoost = chunk.sourceType === "profile" || chunk.sourceType === "activity" ? 0.08 : 0;
      const score = semanticScore * 0.62 + lexicalScore * 0.22 + recencyScore * 0.08 + profileBoost;
      const matchedTerms = queryTokens.filter((token) => chunk.tokens.includes(token)).slice(0, 6);

      return {
        ...chunk,
        matchedTerms,
        score: Number(score.toFixed(4))
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);
}

module.exports = {
  rankChunks
};
