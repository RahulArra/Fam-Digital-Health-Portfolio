const { formatList } = require("./textUtils");

function deriveBMI(profile) {
  if (!profile) {
    return null;
  }

  const latestBmiRecord = Array.isArray(profile.bmiRecords) && profile.bmiRecords.length
    ? profile.bmiRecords[profile.bmiRecords.length - 1]
    : null;

  if (latestBmiRecord?.bmi) {
    return Number(latestBmiRecord.bmi);
  }

  if (profile.height && profile.weight) {
    const heightMeters = profile.height / 100;
    return Number((profile.weight / (heightMeters * heightMeters)).toFixed(2));
  }

  return null;  
}

function buildProfileChunks(profile) {
  if (!profile) {
    return [];
  }

  const latestBmi = deriveBMI(profile);
  const latestBmiRecord = Array.isArray(profile.bmiRecords) && profile.bmiRecords.length
    ? profile.bmiRecords[profile.bmiRecords.length - 1]
    : null;

  const chunks = [
    {
      id: "profile-overview",
      sourceType: "profile",
      sourceLabel: "Health Profile",
      title: "Patient baseline profile",
      content: `Patient age ${profile.age || "unknown"}, height ${profile.height || "unknown"} cm, weight ${
        profile.weight || "unknown"
      } kg, BMI ${latestBmi || "unknown"}. Health conditions: ${formatList(
        profile.healthConditions
      )}. Medications: ${formatList(profile.medications)}. Therapies: ${formatList(
        profile.therapies
      )}. Bad habits: ${formatList(profile.badHabits)}.`,
      recordedAt: profile.updatedAt || latestBmiRecord?.date || null
    },
    {
      id: "profile-activity",
      sourceType: "activity",
      sourceLabel: "Lifestyle Signals",
      title: "Daily activity and recovery habits",
      content: `Exercise level: ${formatList(profile.dailyActivity?.exercise)}. Daily steps: ${formatList(
        profile.dailyActivity?.steps
      )}. Water intake: ${formatList(profile.dailyActivity?.waterIntake)}. Sleep hours: ${formatList(
        profile.dailyActivity?.sleepHours
      )}.`,
      recordedAt: profile.updatedAt || null
    }
  ];

  if (latestBmiRecord || latestBmi) {
    const bmiHistoryText = Array.isArray(profile.bmiRecords) && profile.bmiRecords.length
      ? profile.bmiRecords
          .slice(-5)
          .map((record) => `BMI ${record.bmi} on ${new Date(record.date || Date.now()).toLocaleDateString("en-CA")}`)
          .join("; ")
      : `Current BMI ${latestBmi}`;

    chunks.push({
      id: "profile-bmi-trend",
      sourceType: "bmi",
      sourceLabel: "BMI Trend",
      title: "Recent BMI trend",
      content: bmiHistoryText,
      recordedAt: latestBmiRecord?.date || profile.updatedAt || null
    });
  }

  return chunks;
}

function buildRecordChunks(records) {
  return records.flatMap((record) => {
    const visitDate = record.visitDate ? new Date(record.visitDate).toLocaleDateString("en-CA") : "unknown";
    const nextAppointment = record.nextAppointment
      ? new Date(record.nextAppointment).toLocaleDateString("en-CA")
      : "not scheduled";
    const hospitalName = record.hospitalName || "Hospital";

    return [
      {
        id: `record-${record._id}-summary`,
        sourceType: "hospital_record",
        sourceLabel: hospitalName,
        title: `${hospitalName} visit summary`,
        content: `Visit date ${visitDate}. Doctor ${record.doctorName || "unknown"}. Diagnosis: ${
          record.diagnosis || "not recorded"
        }. Tests: ${record.tests || "not recorded"}.`,
        recordedAt: record.visitDate || record.createdAt || null,
        metadata: {
          recordId: String(record._id),
          nextAppointment,
          followUpRequired: Boolean(record.followUpRequired)
        }
      },
      {
        id: `record-${record._id}-care-plan`,
        sourceType: "care_plan",
        sourceLabel: hospitalName,
        title: `${hospitalName} treatment and follow-up`,
        content: `Medications prescribed: ${record.medications || "none recorded"}. Follow-up required: ${
          record.followUpRequired ? "yes" : "no"
        }. Next appointment: ${nextAppointment}.`,
        recordedAt: record.visitDate || record.createdAt || null,
        metadata: {
          recordId: String(record._id),
          nextAppointment,
          followUpRequired: Boolean(record.followUpRequired)
        }
      }
    ];
  });
}

function buildKnowledgeBase(profile, records) {
  return [...buildProfileChunks(profile), ...buildRecordChunks(records)];
}

module.exports = {
  buildKnowledgeBase,
  buildProfileChunks,
  buildRecordChunks,
  deriveBMI
};
