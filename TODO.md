You are continuing development and architectural discussion of my MERN project called
“Digital Health Portfolio (DHP)”.

Treat this message as FULL and AUTHORITATIVE CONTEXT.
Do NOT re-suggest already finalized ideas.
Do NOT simplify or downgrade the design.
Assume all below decisions are frozen unless I explicitly ask to change them.

========================
PROJECT VISION
========================
DHP is a family-based, collaborative health management system.
It is NOT a single-user app.

Core principle:
- Authentication identities (Users) are NOT the same as health owners.
- Health data belongs to real humans (FamilyMembers), not login accounts.

========================
TECH STACK
========================
Frontend: React
Backend: Node.js + Express
Database: MongoDB (Mongoose)
Auth: JWT
Email: Nodemailer
Background jobs: node-cron
Storage: Cloudinary
AI: Gemini (advisory only)

========================
CORE ENTITIES (FINAL)
========================

User
- Login identity only
- Email, password, verification
- No health data
- One User can belong to multiple families

Family
- Shared workspace
- Exists even if no users
- Status: active / inactive / archived

FamilyUser (CRITICAL)
- Maps User ↔ Family
- Role: ADMIN or MEMBER
- ALL permissions flow through this entity

FamilyMember
- Represents a real human (baby, adult, elder)
- May or may not have login
- Can exist without email
- Can belong to multiple families
- Guardians supported (self-referencing)
- Dependency is derived, NOT stored

HealthProfile
- One-to-one with FamilyMember
- Baseline / long-term context only
- Physical profile (height, weight, blood group)
- Lifestyle profile (habits, sleep, activity)
- Chronic conditions, long-term medications

HealthMetric (VERY IMPORTANT)
- Time-series numerical health data
- Replaces hardcoded BMI, hemoglobin, etc.
- Fields: memberId, metricType, value, unit, recordedAt, source
- Fully ML-ready and extensible

HospitalRecord
- One medical visit / consultation
- Diagnosis, prescriptions, follow-up info
- Doctors can edit medical fields only (with consent)
- Doctors cannot delete records

MedicalReport
- Uploaded medical files (blood test, scans, etc.)
- Raw files preserved
- Extracted findings stored as dynamic key-value
- Extraction can be re-run later
- Supports ML improvement over time

Notification
- System-generated ONLY (cron-based)
- Belongs to FamilyMember
- Recipients are NOT stored
- Delivery resolved dynamically

Consent
- Permission gatekeeper
- Explicit, scoped, revocable
- Required for doctor access and AI/ML analysis
- Family-scoped and member-scoped

Gemini AI
- Advisory only
- No ownership
- No stored AI outputs
- Requires consent for analysis

========================
OWNERSHIP (FROZEN)
========================
User → System
Family → System
FamilyUser → Family
FamilyMember → Family
HealthProfile → FamilyMember
HealthMetric → FamilyMember
HospitalRecord → FamilyMember
MedicalReport → FamilyMember
Notification → FamilyMember
Consent → FamilyMember

========================
KEY RULES (FROZEN)
========================

- User ≠ FamilyMember
- One person may have both, but never duplicated
- Health data NEVER belongs to User
- Dependency is derived:
  - Dependent if no email OR guardians assigned
- Guardianship is optional and multiple
- Admin is per-family, not global
- Admin transfer is automatic
- One User can belong to multiple families
- One real person can belong to multiple families
- Health data is scoped per family (no auto-sharing)

========================
PERMISSIONS (SUMMARY)
========================

Admin:
- Full control
- Edit all profiles
- Delete records
- Fallback notification recipient

Guardian:
- Edit assigned dependents only
- Acknowledge dependent alerts

Independent Member:
- Edit own data
- Acknowledge own alerts

Dependent:
- Cannot edit
- Cannot acknowledge

Doctor:
- Requires explicit consent
- Can edit medical data only
- Can edit only records they create
- Cannot delete, manage consent, or acknowledge alerts

Caregiver:
- Limited, consent-based access

========================
FAMILY JOINING FLOW (FINAL)
========================

- Any User can create a Family → becomes ADMIN
- Only ADMIN can invite users
- Join requests expire automatically
- FamilyMembers can be added without login
- Users can leave family without deleting FamilyMember
- Families persist even if all users leave
- Admin reassignment is automatic:
  1) Guardian with email
  2) Any member with email
  3) Next joining user

========================
NOTIFICATIONS (FINAL)
========================

Types:
- BMI alerts
- Follow-up reminders
- Inactivity reminders

Priority:
- HIGH → in-app + email
- MEDIUM/LOW → in-app only

Recipient resolution (STRICT ORDER):
1) FamilyMember email
2) Guardians
3) Admin fallback

Rules:
- No spam
- Deduplication
- Gentle reminders
- Per FamilyMember + per type preferences

========================
CONSENT MODEL (FINAL)
========================

- Explicit, scoped, revocable
- Dependents never grant consent
- AI always requires consent
- Doctor access always requires consent
- Consent controls external & analytical access only
- Consent does NOT control guardian/admin responsibilities

========================
CURRENT STAGE
========================

- Architecture complete
- ER diagram complete
- MongoDB schema design finalized (strict referencing)
- End-to-end flows validated
- No coding has started yet

NEXT EXPECTED STEPS:
- Convert finalized schemas into Mongoose code
- Design backend API routes
- Implement frontend flows

Continue from this context without re-explaining basics.
