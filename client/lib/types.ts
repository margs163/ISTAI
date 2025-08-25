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
  duration: z.number().default(0),
  assistant: z.enum(["Ron", "Emma"]).nullable(),
  user: z.string().nullable(),
});

export type TestSessionType = z.infer<typeof TestSessionSchema>;

export const ChatMessage = z.object({
  role: z.enum(["Assistant", "User"]),
  messageId: z.string(),
  text: z.string(),
  time: z.number(),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Password should be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type NewPasswordType = z.infer<typeof NewPasswordSchema>;

export const PasswordResetSchema = z.object({
  email: z.email({ error: "Invalid email" }),
});

export type PasswordResetType = z.infer<typeof PasswordResetSchema>;

export type ChatMessageType = z.infer<typeof ChatMessage>;

export const TranscriptionMessage = z.object({
  name: z.string(),
  text: z.string(),
  time: z.number(),
});

export type TranscriptionMessageType = z.infer<typeof TranscriptionMessage>;

export type ChatSocketMessage = {
  type: "userResponse" | "part2QuestionCard";
  part: 1 | 2 | 3;
  text: string;
  assistant: string;
  questionCard?: Omit<QuestionCardType, "id" | "part">;
};

export const ChatSocketResponseSchema = z.object({
  type: z.enum(["ttsFileName", "switchToPart2", "endTest"]),
  filename: z.string().optional(),
  text: z.string(),
});

export type ChatSocketResponse = z.infer<typeof ChatSocketResponseSchema>;

const objectSchema = z.record(z.string(), z.any());

const CriterionScoresSchema = z.object({
  fluency: z.float32().multipleOf(0.5),
  grammar: z.float32().multipleOf(0.5),
  lexis: z.float32().multipleOf(0.5),
  pronunciation: z.float32().multipleOf(0.5),
});

const AverageBandScores = z.object({
  fluency: z.float32(),
  grammar: z.float32(),
  lexis: z.float32(),
  pronunciation: z.float32(),
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
  original_sentence: z.string(),
  identified_issues: z.array(z.string()),
  suggested_improvement: z.string(),
  explanation: z.string(),
});

const SenetenceImprovementsSchema = z.object({
  grammar_enhancements: z.array(ImprovementSchema),
  vocabulary_enhancements: z.array(ImprovementSchema),
});

const MistakeSchema = z.object({
  mistake_type: z.string(),
  description: z.string(),
});

const GrammarErrorSchema = z.object({
  original_sentence: z.string(),
  identified_mistakes: z.array(MistakeSchema),
  suggested_improvement: z.string(),
  explanation: z.string(),
});

const VocabUsageSchema = z.object({
  word_or_phrase: z.string(),
  cefr_level: z.string(),
});

const VocabRepetitionSchema = z.object({
  word_or_phrase: z.string(),
  count: z.number(),
  suggested_synonyms: z.array(z.string()),
});

const PronunciationErrorSchema = z.object({
  word: z.string(),
  accuracy: z.number().min(0).max(100),
  mistake_type: z.string(),
  user_phonemes: z.string(),
  correct_phonemes: z.string(),
});

const GrammarAnalysis = z.object({
  grammar_analysis: z.array(GrammarErrorSchema),
});

export const ResultSchema = z.object({
  id: z.string().optional().nullable(),
  practice_test_id: z.string().optional().nullable(),
  overall_score: z.float32().multipleOf(0.5),
  criterion_scores: CriterionScoresSchema,
  weak_sides: WeakSidesSchema,
  strong_points: StrongPointsSchema,
  sentence_improvements: SenetenceImprovementsSchema,
  grammar_errors: GrammarAnalysis,
  vocabulary_usage: z.array(VocabUsageSchema),
  repeated_words: z.array(VocabRepetitionSchema),
  pronunciation_issues: z.array(PronunciationErrorSchema),
  general_tips: GeneralTipSchema,
});

const TestTranscriptionsSchema = z.object({
  id: z.string().optional(),
  part_one: z.array(TranscriptionMessage),
  part_two: z.array(TranscriptionMessage),
  part_three: z.array(TranscriptionMessage),
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

// assistant: "Emma"
// id: "d80ab77a-8a5a-4323-9ea7-bf3d9ce89d24"
// part_one_card: null
// part_one_card_id: null
// part_two_card: null
// part_two_card_id: null
// practice_name: "Test Iteration 4"
// reading_cards: Array []
// result: null
// status: "Ongoing"
// test_date: "2025-08-18T14:14:06.442190"
// test_duration: null
// transcription: null
// user_id: "5bd3cfa3-05be-4946-b141-2301565ec06f"

export const PracticeTestSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  result: ResultSchema.nullable().optional(),
  status: z.enum(["Ongoing", "Cancelled", "Finished", "Paused"]),
  practice_name: z.string(),
  assistant: z.enum(["Ron", "Emma"]),
  transcription: TestTranscriptionsSchema.nullable().optional(),
  test_duration: z.number().nullable().optional(),
  test_date: z.string(),
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

// class AnalyticsSchema(BaseModel):
//     id: str | None = Field(default=None)
//     user_id: UUID
//     practice_time: int
//     tests_completed: int
//     current_bandscore: float
//     average_band_scores: AverageBandScores
//     average_band: float
//     common_mistakes: dict[str, Any]
//     streak_days: int

// id: Mapped[UUID_ID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
// user_id: Mapped[UUID_ID] = mapped_column(
//     GUID, ForeignKey("user_table.id"), index=True
// )
// user: Mapped[User] = relationship(back_populates="analytics")
// practice_time: Mapped[int] = mapped_column(Integer, default=0)
// tests_completed: Mapped[int] = mapped_column(Integer)
// current_bandscore: Mapped[float] = mapped_column(Float)
// average_band_scores: Mapped[dict[str, float]] = mapped_column(JSONB)
// average_band: Mapped[float] = mapped_column(Float)
// common_mistakes: Mapped[dict[str, Any]] = mapped_column(JSONB)
// streak_days: Mapped[int] = mapped_column(Integer, default=0)a

export const AnalyticsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  practice_time: z.number().int(),
  tests_completed: z.number().int(),
  current_bandscore: z.float32(),
  average_band_scores: AverageBandScores,
  average_band: z.float32(),
  common_mistakes: objectSchema.optional(),
  streak_days: z.number().int(),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  is_verified: z.boolean().default(false),
  is_active: z.boolean().default(false),
  is_superuser: z.boolean().default(false),
  password: z.string().optional(),
  first_name: z.string(),
  last_name: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  subscription: objectSchema.optional(),
  practice_tests: z.array(PracticeTestSchema).optional(),
  analytics: AnalyticsSchema.optional(),
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
export type ResultType = z.infer<typeof ResultSchema>;
export type AnalyticsType = z.infer<typeof AnalyticsSchema>;
export type GrammarAnalysisType = z.infer<typeof GrammarAnalysis>;
