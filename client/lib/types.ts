import * as z from "zod";

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

export const UpdateUserSchema = z
  .object({
    password: z
      .string()
      // .min(8, { error: "Password should be at least 8 characters" })
      .optional(),
    email: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    avatarFile: z
      .any()
      .optional()
      .refine((value) => value === undefined || value instanceof FileList, {
        message: "Input must be a FileList or undefined",
      })
      .refine(
        (value) => {
          if (
            value === undefined ||
            (value instanceof FileList && value.length === 0)
          )
            return true;
          return value[0]?.size <= 4194304;
        },
        { message: "Max size exceeded (4MB)" }
      )
      .transform((value) => {
        if (value instanceof FileList && value.length > 0) return value[0];
        return undefined;
      }),
  })
  .partial();

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

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

export const QuestionnaireSchema = z.object({
  id: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
  heard_from: z.string().nullable().optional(),
  previous_score: z.float32().nullable().optional(),
  role: z.string().nullable().optional(),
  test_experience: z.float32().nullable().optional(),
  ui_intuitivity: z.float32().nullable().optional(),
  eval_accuracy: z.float32().nullable().optional(),
  suggestion: z.string().nullable().optional(),
});

export const QuestionnaireFormSchema = z.object({
  heard_from: z
    .enum(["search", "youtube", "instagram", "reddit", "twitter", "friend"])
    .nullable()
    .optional(),
  previous_score: z.float32().multipleOf(0.5).nullable().optional(),
  role: z
    .enum(["student", "teacher", "guest", "influencer"])
    .nullable()
    .optional(),
});

export const FeedbackSchema = z.object({
  test_experience: z.float32().optional(),
  ui_intuitivity: z.float32().optional(),
  eval_accuracy: z.float32().optional(),
  suggestion: z.string().optional(),
});

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
  id: z.string().optional().nullable(),
  topic: z.string(),
  text: z.string(),
  practice_id: z.string().optional().nullable(),
});

const QuestionCardSchema = z.object({
  id: z.string(),
  part: z.number().gte(0).lte(1),
  topic: z.string(),
  questions: z.array(z.string()),
});

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

export const UpdatePracticeTestSchema = z.object({
  transcription: TestTranscriptionsSchema.nullable().optional(),
  part_two_card_id: z.string().nullable().optional(),
  reading_cards: z.array(ReadingCardSchema).nullable().optional(),
  status: z.enum(["Ongoing", "Cancelled", "Finished", "Paused"]),
  test_duration: z.number().nullable().optional(),
});

export type UpdatePracticeTestType = z.infer<typeof UpdatePracticeTestSchema>;

export const PronunciationTestSchema = z.object({
  id: z.string(),
  pronunciation_score: z.float32().multipleOf(0.5),
  pronunciation_strong_points: z.array(z.string()),
  pronunciation_weak_sides: z.array(z.string()),
  pronunciation_mistakes: z.array(PronunciationErrorSchema),
  pronunciation_tips: z.array(z.string()),
});

const GrammarCommonMistake = z.object({
  original_sentence: z.string(),
  identified_mistakes: z.array(MistakeSchema),
  suggested_improvement: z.string(),
  frequency: z.number(),
  explanation: z.string(),
});

const VocabularyCommonMistake = z.object({
  original_sentence: z.string(),
  identified_issues: z.array(z.string()),
  suggested_improvement: z.string(),
  frequency: z.number(),
  explanation: z.string(),
});

const PronunciationCommonMistake = z.object({
  word: z.string(),
  accuracy: z.number().min(0).max(100),
  mistake_type: z.string(),
  user_phonemes: z.string(),
  correct_phonemes: z.string(),
  frequency: z.number(),
});

export const BandScoreIncrease = z.object({
  fluency: z.float32(),
  grammar: z.float32(),
  lexis: z.float32(),
  pronunciation: z.float32(),
});

export const AnalyticsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  practice_time: z.number().int(),
  tests_completed: z.number().int(),
  current_bandscore: z.float32(),
  average_band_scores: AverageBandScores,
  scores_increase: BandScoreIncrease.nullable().optional(),
  average_band: z.float32(),
  grammar_common_mistakes: z.array(GrammarCommonMistake).optional().nullable(),
  lexis_common_mistakes: z.array(VocabularyCommonMistake).optional().nullable(),
  pronunciation_common_mistakes: z
    .array(PronunciationCommonMistake)
    .optional()
    .nullable(),
  streak_days: z.number().int(),
});

export const CreditCardSchema = z.object({
  id: z.string().optional().nullable(),
  payment_id: z.string().optional().nullable(),
  payment_method: z.string().optional().nullable(),
  card_holder_name: z.string(),
  card_type: z.string(),
  last_four: z.string().max(4),
  expiry_year: z.number().int(),
  expiry_month: z.number().int(),
  country: z.string().max(50),
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  user_id: z.string(),

  status: z.string().nullable().optional(),
  polar_product_id: z.string().optional().nullable(),
  polar_subscription_id: z.string().optional().nullable(),
  polar_customer_id: z.string().optional().nullable(),
  polar_price_id: z.string().optional().nullable(),
  subscription_tier: z.enum(["Free", "Starter", "Pro"]),
  polar_subscription_status: z.string().optional().nullable(),
  subscription_created_at: z.string().optional().nullable(),
  subscription_next_billed_at: z.string().optional().nullable(),

  subscription_cancelled_at: z.string().optional().nullable(),
  cancellation_reason: z.string().optional().nullable(),
  cancellation_comment: z.string().optional().nullable(),

  total_money_spent: z.float32(),

  // credit_card: CreditCardSchema.optional().nullable(),
  credits_total_purchased: z.number(),
  credits_left: z.number(),
  pronunciation_tests_left: z.number(),

  billing_interval: z.string().nullable(),
  billing_frequency: z.int().nullable(),

  // paddle_update_url: z.string().nullable().optional(),
  // paddle_cancel_url: z.string().nullable().optional(),
});

export const SubscriptionUpdateSchema = z.object({
  status: z.string().optional().nullable(),
  paddle_product_id: z.string().optional().nullable(),
  paddle_subscription_id: z.string().optional().nullable(),
  paddle_price_id: z.string().optional().nullable(),
  subscription_tier: z.enum(["Free", "Starter", "Pro"]).optional().nullable(),
  paddle_subscription_status: z.string().optional().nullable(),
  subscription_created_at: z.string().optional().nullable(),
  subscription_next_billed_at: z.string().optional().nullable(),
  total_money_spent: z.float32().optional().nullable(),

  credit_card: CreditCardSchema.optional().nullable(),
  credits_total_purchased: z.number().optional().nullable(),
  credits_left: z.number().optional().nullable(),
  pronunciation_tests_left: z.number().optional().nullable(),

  billing_interval: z.string().optional().nullable(),
  billing_frequency: z.int().optional().nullable(),
});

export const NotificationSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  type: z.enum([
    "Greeting",
    "Test Info",
    "Profile Change",
    "Streak",
    "Credit Balance",
    "Credit Purchase",
    "Plan Change",
  ]),
  message: z.string(),
  time: z.union([z.date(), z.string()]).optional(),
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
  avatar_path: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  last_login_at: z.coerce.date(),
  subscription: SubscriptionSchema.optional(),
  practice_tests: z.array(PracticeTestSchema).optional(),
  analytics: AnalyticsSchema.optional(),
  notificates: z.array(NotificationSchema).optional(),
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
export type CreditCardType = z.infer<typeof CreditCardSchema>;
export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
export type NotificationType = z.infer<typeof NotificationSchema>;
export type SubscriptionUpdateType = z.infer<typeof SubscriptionUpdateSchema>;
export type GrammarCommonMistakeType = z.infer<typeof GrammarCommonMistake>;
export type VocabularyCommonMistakeType = z.infer<
  typeof VocabularyCommonMistake
>;
export type PronunciationCommonMistakeType = z.infer<
  typeof PronunciationCommonMistake
>;
export type QuestionnaireType = z.infer<typeof QuestionnaireSchema>;
export type QuestionnaireFormType = z.infer<typeof QuestionnaireFormSchema>;
export type FeedbackType = z.infer<typeof FeedbackSchema>;
