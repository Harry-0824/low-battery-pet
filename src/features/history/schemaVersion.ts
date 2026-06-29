import type {
  ContextTag,
  DerivedUserState,
  MoodTag,
  StressLevel,
  UserMood
} from "../checkIn/checkInTypes";
import { deriveUserState } from "../checkIn/deriveUserState";
import { calculatePetState } from "../pet/petStateEngine";
import type {
  PetAccessory,
  PetAnimation,
  PetMoodState,
  PetVisualEffect
} from "../pet/petTypes";
import type { ReplyTone } from "../reply/replyTypes";
import type { CheckInHistoryRecord } from "./historyTypes";

export const CURRENT_VERSION = 2;

export type VersionedCheckInHistoryRecord = CheckInHistoryRecord & {
  dataVersion: typeof CURRENT_VERSION;
};

const MOOD_TAGS = new Set<MoodTag>([
  "energized",
  "joyful",
  "content",
  "okay",
  "low_battery",
  "annoyed",
  "lonely",
  "no_thoughts"
]);

const CONTEXT_TAGS = new Set<ContextTag>([
  "small_win",
  "rested_well",
  "connected",
  "wallet_pressure",
  "work_stress",
  "social_fatigue",
  "dinner_problem",
  "want_to_rest"
]);

const USER_MOODS = new Set<UserMood>([
  "bright",
  "content",
  "neutral",
  "tired",
  "angry",
  "lonely",
  "overloaded"
]);

const ENERGY_LEVELS = new Set<DerivedUserState["energyLevel"]>([
  "full",
  "normal",
  "low",
  "critical"
]);

const STRESS_LEVELS = new Set<StressLevel>(["low", "medium", "high"]);

const PET_MOODS = new Set<PetMoodState>([
  "idle",
  "charged",
  "joyful",
  "calm",
  "low_power",
  "stressed",
  "lonely",
  "grumpy",
  "hungry"
]);

const PET_ANIMATIONS = new Set<PetAnimation>(["idle", "sleep", "shake", "hide", "bounce", "sway"]);
const PET_EFFECTS = new Set<PetVisualEffect>([
  "none",
  "spark",
  "warm_glow",
  "low_battery",
  "black_cloud",
  "rain",
  "coins"
]);
const PET_ACCESSORIES = new Set<PetAccessory>(["none", "sun_dot", "coin", "rice_ball"]);
const REPLY_TONES = new Set<ReplyTone>(["calm", "soft", "grounding", "warm", "minimal"]);

export const toCurrentVersionRecord = (
  record: CheckInHistoryRecord
): VersionedCheckInHistoryRecord => ({
  ...record,
  dataVersion: CURRENT_VERSION
});

export const migrate = (rawRecord: unknown): VersionedCheckInHistoryRecord | null => {
  const record = asObject(rawRecord);

  if (!record || !isMoodTag(record.moodTag) || typeof record.createdAt !== "string") {
    return null;
  }

  if (isVersion2Record(rawRecord)) {
    return rawRecord;
  }

  const input = {
    moodTag: record.moodTag,
    contextTags: parseContextTags(record.contextTags)
  };
  const derivedUserState = deriveUserState(input);

  return {
    moodTag: input.moodTag,
    contextTags: input.contextTags,
    shortText: typeof record.shortText === "string" ? record.shortText : "",
    derivedUserState,
    petState: calculatePetState(derivedUserState),
    companionReply: isCompanionReply(record.companionReply)
      ? record.companionReply
      : {
          reply: "",
          petLine: "",
          tinyAction: "",
          tone: "minimal"
        },
    createdAt: record.createdAt,
    dataVersion: CURRENT_VERSION
  };
};

const isVersion2Record = (value: unknown): value is VersionedCheckInHistoryRecord => {
  const record = asObject(value);

  if (!record) {
    return false;
  }

  return (
    record.dataVersion === CURRENT_VERSION &&
    isMoodTag(record.moodTag) &&
    Array.isArray(record.contextTags) &&
    record.contextTags.every(isContextTag) &&
    typeof record.shortText === "string" &&
    isDerivedUserState(record.derivedUserState) &&
    isPetState(record.petState) &&
    isCompanionReply(record.companionReply) &&
    typeof record.createdAt === "string"
  );
};

const parseContextTags = (value: unknown): ContextTag[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isContextTag);
};

const isMoodTag = (value: unknown): value is MoodTag =>
  typeof value === "string" && MOOD_TAGS.has(value as MoodTag);

const isContextTag = (value: unknown): value is ContextTag =>
  typeof value === "string" && CONTEXT_TAGS.has(value as ContextTag);

const isDerivedUserState = (value: unknown): value is DerivedUserState => {
  const state = asObject(value);

  if (!state) {
    return false;
  }

  return (
    typeof state.needsComfort === "boolean" &&
    typeof state.hasWalletPressure === "boolean" &&
    typeof state.needsRest === "boolean" &&
    typeof state.needsFoodSuggestion === "boolean" &&
    typeof state.mood === "string" &&
    USER_MOODS.has(state.mood as UserMood) &&
    typeof state.energyLevel === "string" &&
    ENERGY_LEVELS.has(state.energyLevel as DerivedUserState["energyLevel"]) &&
    typeof state.stressLevel === "string" &&
    STRESS_LEVELS.has(state.stressLevel as StressLevel)
  );
};

const isPetState = (value: unknown): value is CheckInHistoryRecord["petState"] => {
  const petState = asObject(value);

  if (!petState) {
    return false;
  }

  return (
    typeof petState.mood === "string" &&
    PET_MOODS.has(petState.mood as PetMoodState) &&
    typeof petState.animation === "string" &&
    PET_ANIMATIONS.has(petState.animation as PetAnimation) &&
    typeof petState.effect === "string" &&
    PET_EFFECTS.has(petState.effect as PetVisualEffect) &&
    typeof petState.accessory === "string" &&
    PET_ACCESSORIES.has(petState.accessory as PetAccessory)
  );
};

const isCompanionReply = (value: unknown): value is CheckInHistoryRecord["companionReply"] => {
  const reply = asObject(value);

  if (!reply) {
    return false;
  }

  return (
    typeof reply.reply === "string" &&
    typeof reply.petLine === "string" &&
    typeof reply.tinyAction === "string" &&
    typeof reply.tone === "string" &&
    REPLY_TONES.has(reply.tone as ReplyTone) &&
    (reply.note === undefined || typeof reply.note === "string")
  );
};

const asObject = (value: unknown) =>
  value !== null && typeof value === "object" ? (value as Record<string, unknown>) : null;
