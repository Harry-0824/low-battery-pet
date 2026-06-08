import { deriveUserState } from "../checkIn/deriveUserState";
import type { MoodTag } from "../checkIn/checkInTypes";
import { calculatePetState } from "../pet/petStateEngine";
import type { PetMoodState } from "../pet/petTypes";
import type { CompanionReply, CompanionReplyInput, ReplyTone } from "./replyTypes";

const moodTemplates: Record<
  MoodTag,
  {
    reply: string;
    tone: ReplyTone;
  }
> = {
  okay: {
    reply: "Steady enough counts. I can sit here with you while you keep the pace small.",
    tone: "calm"
  },
  low_battery: {
    reply: "Your battery sounds low. No big moves first, just one tiny reset.",
    tone: "soft"
  },
  annoyed: {
    reply: "That irritation is allowed to exist. We can lower the heat before choosing anything.",
    tone: "grounding"
  },
  lonely: {
    reply: "Lonely evenings feel heavier. I am here, and you do not have to perform.",
    tone: "warm"
  },
  no_thoughts: {
    reply: "No thoughts is still a signal. Let us make the next step very small.",
    tone: "minimal"
  }
};

const petLineTemplates: Record<PetMoodState, string> = {
  idle: "I will stay nearby and blink slowly.",
  low_power: "I am dimming the room lights for you.",
  stressed: "Tiny paws on the floor. We breathe first.",
  lonely: "I will keep the little light on beside you.",
  grumpy: "I am guarding the coin pile with you.",
  hungry: "I found the smallest dinner path."
};

export const generateCompanionReply = (input: CompanionReplyInput): CompanionReply => {
  const derivedUserState = deriveUserState(input);
  const petState = calculatePetState(derivedUserState);
  const moodTemplate = moodTemplates[input.moodTag];
  const note = input.shortText?.trim();

  return {
    reply: moodTemplate.reply,
    petLine: petLineTemplates[petState.mood],
    tinyAction: selectTinyAction(derivedUserState),
    tone: moodTemplate.tone,
    ...(note ? { note } : {})
  };
};

const selectTinyAction = (
  derivedUserState: ReturnType<typeof deriveUserState>
): string => {
  if (derivedUserState.hasWalletPressure) {
    return "Open one bill or balance, then stop after naming the next due date.";
  }

  if (derivedUserState.needsFoodSuggestion) {
    return "Pick the easiest warm option available, even if it is not perfect.";
  }

  if (derivedUserState.needsRest) {
    return "Set a 10 minute no-output rest block and put the phone face down.";
  }

  if (derivedUserState.energyLevel === "critical") {
    return "Drink water and lie down for five quiet minutes.";
  }

  if (derivedUserState.stressLevel === "high") {
    return "Name the annoying thing once, then unclench your hands.";
  }

  return "Choose one tiny task and make it smaller before starting.";
};
