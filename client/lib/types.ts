import * as z from "zod";
import { v4 as uuidv4 } from "uuid";

export type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type SignInFormData = {
  email: string;
  password: string;
};

export const UserSignUpSchema = z.object({
  firstName: z
    .string({ error: "First name is required" })
    .max(50, "Invalid first name"),
  lastName: z.string().max(50, "Invalid second name"),
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(8, { error: "Password should be at least 8 characters" }),
});

export const UserSignInSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(8, { error: "Password should be at least 8 characters" }),
});

export type NewTestFormData = {
  testName: string;
  assisstant: "Ron" | "Emma";
};

export const NewTestFormSchema = z.object({
  testName: z
    .string()
    .min(1, "Invalid test name")
    .max(40, "Test name must be less than 40 characters"),
  assisstant: z.enum(["Ron", "Emma"]),
});

export const TranscribedMessage = z.object({
  text: z.string(),
  no_speech_prob: z.float64(),
  avg_logprob: z.float64(),
  compression_ratio: z.float64(),
});

export type TranscribedMessageType = z.infer<typeof TranscribedMessage>;

export const TestSessionSchema = z.object({
  testName: z.string(),
  status: z.enum(["active", "inactive"]),
  currentPart: z.number().gte(1).lte(3),
  startedTime: z.string(),
  duration: z.string().default("11-14 min"),
  assistant: z.enum(["Ron", "Emma"]).nullable(),
  user: z.string().nullable(),
});

export type TestSessionType = z.infer<typeof TestSessionSchema>;

export const ChatMessage = z.object({
  role: z.enum(["Assistant", "User"]),
  messageId: z.string(),
  text: z.string(),
});

export type ChatMessageType = z.infer<typeof ChatMessage>;

export const TranscriptionMessage = z.object({
  name: z.string(),
  text: z.string(),
});

export type TranscriptionMessageType = z.infer<typeof TranscriptionMessage>;

const objectSchema = z.record(z.string(), z.any());

const CriterionScoresSchema = z.object({
  fluency: z.float32().multipleOf(0.5),
  grammar: z.float32().multipleOf(0.5),
  lexis: z.float32().multipleOf(0.5),
  pronunciation: z.float32().multipleOf(0.5),
});

const StrongPointsSchema = z.object({
  fluency: z.array(z.string()),
  grammar: z.array(z.string()),
  lexis: z.array(z.string()),
  pronunciation: z.array(z.string()),
});

const WeakSidesSchema = z.object({
  fluency: z.array(z.string()),
  grammar: z.array(z.string()),
  lexis: z.array(z.string()),
  pronunciation: z.array(z.string()),
});

const GeneralTipSchema = z.object({
  fluency: z.array(z.string()),
  grammar: z.array(z.string()),
  lexis: z.array(z.string()),
  pronunciation: z.array(z.string()),
});

const ImprovementSchema = z.object({
  originalSentence: z.string(),
  identifiedMistake: z.array(z.string()),
  suggestedImprovement: z.string(),
  explanation: z.string(),
});

const SenetenceImprovementsSchema = z.object({
  grammarEnhancements: z.array(ImprovementSchema),
  vocabularyEnhancements: z.array(ImprovementSchema),
});

const MistakeSchema = z.object({
  mistakeType: z.string(),
  mistakeDescription: z.string(),
});

const GrammarErrorSchema = z.object({
  originalSentence: z.string(),
  identifiedMistake: z.array(MistakeSchema),
  suggestedImprovement: z.string(),
  explanation: z.string(),
});

const VocabUsageSchema = z.object({
  wordOrPhrase: z.string(),
  cefrLevel: z.string(),
});

const VocabRepetitionSchema = z.object({
  wordOrPhrase: z.string(),
  count: z.number(),
  suggestedSynonyms: z.array(z.string()),
});

const PronunciationErrorSchema = z.object({
  word: z.string(),
  accuracy: z.number().min(0).max(100),
  phonemes: z.string(),
});

const ResultSchema = z.object({
  id: z.string(),
  overall_score: z.float32().multipleOf(0.5),
  criterion_scores: CriterionScoresSchema,
  weak_sides: WeakSidesSchema,
  strong_points: StrongPointsSchema,
  sentence_improvements: SenetenceImprovementsSchema,
  grammar_errors: z.array(GrammarErrorSchema),
  vocabulary_usage: z.array(VocabUsageSchema),
  repeated_words: z.array(VocabRepetitionSchema),
  pronunciation_issues: z.array(PronunciationErrorSchema),
  general_tips: z.array(GeneralTipSchema),
});

const TestTranscriptionsSchema = z.object({
  id: z.string(),
  assistant_responses: z.array(z.string()),
  user_responses: z.array(z.string()),
});

const ReadingCardSchema = z.object({
  id: z.string(),
  topic: z.string(),
  text: z.string(),
});

const QuestionCardSchema = z.object({
  id: z.string(),
  part: z.number().gte(0).lte(1),
  topic: z.string(),
  questions: z.array(z.string()),
});

const PracticeTestSchema = z.object({
  id: z.string(),
  result: ResultSchema.optional(),
  status: z.enum(["Ongoing", "Cancelled", "Finished", "Paused"]),
  practice_name: z.string(),
  assistant: z.enum(["Ron", "Emma"]),
  transcription: TestTranscriptionsSchema.nullable().optional(),
  test_duration: z.number().nullable().optional(),
  test_date: z.date(),
  part_one_card_id: z.string().nullable().optional(),
  part_two_card_id: z.string().nullable().optional(),
  part_one_card: QuestionCardSchema.nullable().optional(),
  part_two_card: QuestionCardSchema.nullable().optional(),
  reading_cards: z.array(ReadingCardSchema).nullable().optional(),
});

const PronunciationTestSchema = z.object({
  id: z.string(),
  pronunciation_score: z.float32().multipleOf(0.5),
  pronunciation_strong_points: z.array(z.string()),
  pronunciation_weak_sides: z.array(z.string()),
  pronunciation_mistakes: z.array(PronunciationErrorSchema),
  pronunciation_tips: z.array(z.string()),
});

const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  subscription: objectSchema.optional(),
  practice_tests: z.array(PracticeTestSchema).optional(),
  analytics: objectSchema.optional(),
  notificates: objectSchema.optional(),
  transcriptions: z.array(TestTranscriptionsSchema).optional(),
  pronunciation_tests: z.array(PronunciationTestSchema).optional(),
});

export type UserType = z.infer<typeof UserSchema>;
export type PronunciationTestType = z.infer<typeof PronunciationTestSchema>;
export type PracticeTestType = z.infer<typeof PracticeTestSchema>;
export type QuestionCardType = z.infer<typeof QuestionCardSchema>;
export type ReadingCardType = z.infer<typeof ReadingCardSchema>;
export type TestTranscriptionsType = z.infer<typeof TestTranscriptionsSchema>;
export type PronunciationErrorType = z.infer<typeof PronunciationErrorSchema>;
export type VocabRepetitionType = z.infer<typeof VocabRepetitionSchema>;
export type VocabUsageType = z.infer<typeof VocabUsageSchema>;
export type GrammarErrorType = z.infer<typeof GrammarErrorSchema>;
export type GrammarMistakeType = z.infer<typeof MistakeSchema>;
export type SentenceImprovementsType = z.infer<
  typeof SenetenceImprovementsSchema
>;
export type ImprovementType = z.infer<typeof ImprovementSchema>;
export type GeneralTipType = z.infer<typeof GeneralTipSchema>;
export type WeakSidesType = z.infer<typeof WeakSidesSchema>;
export type StrongPointsType = z.infer<typeof StrongPointsSchema>;
export type CriterionScoresType = z.infer<typeof CriterionScoresSchema>;
