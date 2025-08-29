import axios from "axios";
import { toast } from "sonner";
import {
  AnalyticsSchema,
  AnalyticsType,
  CreditCardType,
  GrammarCommonMistakeType,
  NotificationType,
  PracticeTestSchema,
  PracticeTestType,
  PronunciationCommonMistakeType,
  QuestionCardType,
  ReadingCardType,
  ResultSchema,
  ResultType,
  SubscriptionSchema,
  SubscriptionType,
  SubscriptionUpdateType,
  TestTranscriptionsType,
  UpdatePracticeTestType,
  UserSchema,
  VocabularyCommonMistakeType,
} from "./types";
import { UserData, UserDataServer } from "./userStorage";

type PostResponse = {
  status: string;
  data: PracticeTestType;
};

export async function fetchUser(setUserData: (data: UserData) => void) {
  try {
    console.log("Fetching user...");
    const response = await axios.get<UserDataServer>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/users/me`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const validate = await UserSchema.safeParseAsync(response.data);
    if (validate.error) {
      throw validate.error;
    }
    const data = validate.data;
    const user = {
      id: data.id,
      email: data.email,
      isActive: data.is_active,
      isVerified: data.is_verified,
      isSuperuser: data.is_superuser,
      firstName: data.first_name,
      lastName: data.last_name,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
      avatar_path: data.avatar_path,
    };
    // @ts-expect-error it is compatible
    setUserData(user);
    return user;
  } catch (error) {
    toast("Error Fetching User", {
      description: "Could not fetch user data",
      action: {
        label: "Log",
        onClick: () => console.error(error),
      },
    });
    return undefined;
  }
}

export async function sendReadingCardSpeech(
  audioBlobs: Blob
): Promise<string | undefined> {
  const formData = new FormData();
  formData.append("audio", audioBlobs, `recording-${Date.now()}.wav`);

  try {
    const response = await axios.post("/api/tts", formData);
    const result: { message: string; filePath: string } = response.data;
    console.log(result);
    return result.filePath;
  } catch (error) {
    toast("Error while sending reading speech", {
      description: "Could not upload audio to S3 storage",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
    return undefined;
  }
}

export async function logOutUser() {
  try {
    await axios.post(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/auth/jwt/logout`,
      undefined,
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    toast("Error while sending reading speech", {
      description: "Could not upload audio to S3 storage",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function fetchPart2QuestionCard(
  setPart2Question: (card: QuestionCardType) => void
): Promise<QuestionCardType | undefined> {
  try {
    const response = await axios.get<{ questions: QuestionCardType[] }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/questions/?part=2`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const question = response.data.questions[0];
    setPart2Question(question);
    return question;
  } catch (error) {
    toast("No Question Card", {
      description: "No Part 2 question card found",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
    return undefined;
  }
}

export async function fetchReadingCard(
  setReadingCard: (readingCard: ReadingCardType[]) => void
): Promise<ReadingCardType | undefined> {
  try {
    const response = await axios.get<{ cards: ReadingCardType[] }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/reading_cards/?random=true&count=1`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const readingCard = response.data.cards[0];
    setReadingCard([readingCard]);
    return readingCard;
  } catch (error) {
    toast("No Reading Card", {
      description: "Could not fetch a reading card",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
    return undefined;
  }
}

export async function createPracticeTest(data: {
  assistant: "Ron" | "Emma";
  practice_name: string;
  status: "Ongoing" | "Cancelled" | "Finished";
}) {
  try {
    const response = await axios.post<PostResponse>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/practice_test/new`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const validate = await PracticeTestSchema.safeParseAsync(
      response.data.data
    );
    if (!validate.success) {
      throw new Error("Could not validate schema");
    }
    return validate.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePracticeTest({
  data,
  practiceTestId,
}: {
  data: UpdatePracticeTestType;
  practiceTestId: string;
}) {
  try {
    await axios.put(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/practice_test/${practiceTestId}`,
      data,
      { withCredentials: true }
    );
    console.log(practiceTestId, data);
    return true;
  } catch (error) {
    throw error;
  }
}

export async function fetchPracticeTests(
  setGlobalPracticeTests: (data: PracticeTestType[]) => void
) {
  try {
    const response = await axios.get<{ data: PracticeTestType[] }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/practice_test/?user_id=true`,
      { withCredentials: true }
    );
    if (response.data.data.length === 0) {
      return [];
    }
    const validated = await PracticeTestSchema.safeParseAsync(
      response.data.data.at(-1)
    );
    if (validated.error) {
      throw validated.error;
    }
    console.log(response.data.data);
    setGlobalPracticeTests(response.data.data);
    return response.data.data;
  } catch (error) {
    toast("Error Fetching Practice Tests", {
      description: "Could not fetch analytics",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function fetchAvatar(
  path: string,
  setAvatarUrl: (url: string) => void
): Promise<string | undefined> {
  const cachedUrl = sessionStorage.getItem(`avatar-url`);
  if (cachedUrl) {
    setAvatarUrl(cachedUrl);
    console.log("Returing a cached value");
    return cachedUrl;
  }
  try {
    const response = await axios.get<{ url: string }>(`/api/avatar`, {
      params: {
        filename: path,
      },
    });
    const url = response.data.url;
    sessionStorage.setItem("avatar-url", url);
    setAvatarUrl(url);
    return response.data.url;
  } catch (error) {
    toast("Error Fetching Avatar", {
      description: "Could not fetch the avatar",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function deleteAvatar() {
  try {
    await axios.delete(`https://${process.env.NEXT_PUBLIC_FASTAPI}/avatar/me`, {
      withCredentials: true,
    });
  } catch (error) {
    toast("Error Deleting Avatar", {
      description: "Could not delete avatar",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function fetchNotifications() {
  try {
    const response = await axios.get<{ data: NotificationType[] }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/notifications/me?today=true`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    toast("Error Fetching Notifications", {
      description: "Could not delete avatar",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function authorizeGoogle() {
  try {
    const response = await axios.get<{ authorization_url: string }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/auth/google/authorize`
    );

    const url = response.data.authorization_url;
    return url;
  } catch (error) {
    toast("Error Fetching Auth Google URL", {
      description: "Could not fetch Auth URL",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}
export async function fetchPracticeTestById(testId: string) {
  try {
    const response = await axios.get<{ data: PracticeTestType[] }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/practice_test/?test_ids=${testId}&user_id=true`,
      { withCredentials: true }
    );
    const validated = await PracticeTestSchema.safeParseAsync(
      response.data.data[0]
    );
    if (validated.error) {
      throw validated.error;
    }
    console.log(response.data.data);
    return response.data.data[0];
  } catch (error) {
    toast("Error Fetching Practice Test By Id", {
      description: "Could not fetch practice test",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function fetchSubscription(
  setData: (data: SubscriptionType) => void
) {
  try {
    const response = await axios.get<{ data: SubscriptionType }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/subscription/me`,
      {
        withCredentials: true,
      }
    );
    const validate = await SubscriptionSchema.safeParseAsync(
      response.data.data
    );
    if (validate.error) {
      throw new Error(validate.error.message);
    }
    setData(validate.data);
    return validate.data;
  } catch (error) {
    toast("Error Fetching Subscription", {
      description: "Could not fetch subscription",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function updateSubscription(updateSchema: SubscriptionUpdateType) {
  try {
    await axios.put(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/subscription`,
      updateSchema,
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    toast("Error Updating Subscription", {
      description: "Could not update subscription",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function updateCreditCard(creditCard: CreditCardType) {
  try {
    await axios.post(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/subscription/card`,
      creditCard,
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    toast("Error Updating Credit Card", {
      description: "Could not update credit card",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function updateAnalytics(data: {
  practice_time?: number;
  tests_completed?: number;
  current_bandscore?: number;
  average_band_scores?: {
    fluency: number;
    grammar: number;
    lexis: number;
    pronunciation: number;
  };
  average_band?: number;
  grammar_common_mistakes?: GrammarCommonMistakeType[];
  lexis_common_mistakes?: VocabularyCommonMistakeType[];
  pronunciation_common_mistakes?: PronunciationCommonMistakeType[];
  streak_days?: number;
}) {
  try {
    const response = await axios.put<{ data: AnalyticsType }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/analytics/`,
      {
        ...data,
      },
      {
        withCredentials: true,
      }
    );
    console.log("Analytics: ", response.data);
    const validated = await AnalyticsSchema.safeParseAsync(response.data.data);
    if (validated.error) {
      throw validated.error;
    }
    return validated.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchAnalytics(
  setAnalytics: (data: AnalyticsType) => void
) {
  try {
    const response = await axios.get<{ data: AnalyticsType }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/analytics/?limit=4`,
      { withCredentials: true }
    );
    const validated = await AnalyticsSchema.safeParseAsync(response.data.data);
    if (validated.error) {
      throw validated.error;
    }
    setAnalytics(validated.data);
    return validated.data;
  } catch (error) {
    toast("Error fetching analytics", {
      description: "Could not fetch analytics",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
    return undefined;
  }
}

export async function spendCredits(credits: number = 10) {
  try {
    await axios.put(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/subscription/`,
      {
        credits_left: credits,
      },
      { withCredentials: true }
    );

    return true;
  } catch (error) {
    toast("Could not spend credits", {
      description: "Could not fetch analytics",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}

export async function postTestResults({
  readingCard,
  transcription,
  readingCardAudioPath,
  testId,
}: {
  readingCard: ReadingCardType;
  transcription: TestTranscriptionsType;
  readingCardAudioPath: string;
  testId: string;
}) {
  const body = {
    readingCard: {
      topic: readingCard.topic,
      text: readingCard.text,
    },
    transcription: {
      test_id: testId,
      part_one: transcription.part_one,
      part_two: transcription.part_two,
      part_three: transcription.part_three,
    },
  };
  try {
    const response = await axios.post<{ data: ResultType }>(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/results/?reading_audio_path=${readingCardAudioPath}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(response.data);
    const validate = await ResultSchema.safeParseAsync(response.data.data);
    if (validate.error) {
      console.error(validate.error.message);
      throw new Error("Error");
    }
    return validate.data;
  } catch (error) {
    throw error;
  }
}

export async function cancellPracticeTest(testId: string) {
  try {
    const response = await axios.put(
      `https://${process.env.NEXT_PUBLIC_FASTAPI}/practice_test/${testId}`,
      { status: "Cancelled" },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    toast("Could not cancell a practice test", {
      description: "Could not cancell a practice test",
      action: {
        label: "Log",
        onClick: () => console.log(error),
      },
    });
  }
}
