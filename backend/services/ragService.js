const mongoose = require("mongoose");
const HealthProfile = require("../models/HealthProfile");
const HospitalRecord = require("../models/HospitalRecord");
const { buildKnowledgeBase, deriveBMI } = require("./rag/chunkBuilder");
const { buildContextBlock, buildGroundingSummary, buildTransientContext, serializeGrounding } = require("./rag/grounding");
const { rankChunks } = require("./rag/ranker");

async function fetchPatientData(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const [profile, records] = await Promise.all([
    HealthProfile.findOne({ userId }).lean(),
    HospitalRecord.find({ userId }).sort({ visitDate: -1 }).limit(25).lean()
  ]);

  return { profile, records };
}

async function retrieveRelevantPatientContext(userId, query, options = {}) {
  const topK = options.topK || 5;
  const { profile, records } = await fetchPatientData(userId);
  const knowledgeBase = buildKnowledgeBase(profile, records);
  const matches = rankChunks(knowledgeBase, query, topK);

  return {
    profile,
    records,
    matches,
    contextBlock: buildContextBlock(matches),
    summary: buildGroundingSummary(profile, records, matches, deriveBMI)
  };
}

module.exports = {
  buildTransientContext,
  deriveBMI,
  retrieveRelevantPatientContext,
  serializeGrounding
};
