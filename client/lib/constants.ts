import { BookOpen, MessageSquare, Users } from "lucide-react";

export const tourSteps = [
  {
    target: ".first-step",
    content:
      "This is a 'Test Session' component, where you can track info about the current practice test.",
    title: "Test Session",
    placement: "auto",
    disableBeacon: true,
  },
  {
    target: ".second-step",
    content:
      "In this 'Test Progress' component you can see your test progress.",
    title: "Test Progress",
    placement: "top",
  },
  {
    target: ".third-step",
    content: "Here you can read the description of individual test parts.",
    title: "Test Info",
    placement: "auto",
  },
  {
    target: ".fourth-step",
    content:
      "Once you get to the second part of the test, a question card will be displayed here",
    title: "Part 2 Question",
    placement: "auto",
  },
  {
    target: ".fifth-step",
    content:
      "Here you can control your audio input. Whenever you want to answer the question, press the record button. If you wish to pause or cancell the test, press the pause or cancell buttons, respectively",
    title: "Test Controls",
    placement: "auto",
  },
  {
    target: ".sixth-step",
    content: "Here you can see the detailed speech transcriptions of the test.",
    title: "Test Transcriptions",
    placement: "auto",
  },
  {
    target: ".seventh-step",
    content: "In this menu you can try some of the 'Quick Action' options.",
    title: "Quick Actions",
    placement: "auto",
  },
];

export const dialogInfo = [
  {
    title: "Hello, welcome to the Speaking Test Simulator!",
    description:
      "Before proceeding to the test, do you want to walkthrough a tutorial, explaining the user interface of the test?",
    options: ["Cancel", "Start"],
  },
  {
    title:
      "You have successfully finished part 1 of the test, let's move on to part 2.",
    description:
      "In this part you will be given a question card and 2 minutes for preparation. The preparation timer can be seen on top of the question card. Once the timer is up, the recording will start automatically. When you feel like you have answered the question card fully, you can stop the recording and proceed to the 3 part of the test.",
    options: ["Next"],
  },
  {
    title:
      "You have successfully finished part 2 of the test, let's move on to part 3.",
    description:
      "In this part you will be asked further questions about the topic discussed in part 2 of the test.",
    options: ["Next"],
  },
  {
    title:
      "Congratulations, you have finished the Speaking Test. Click to see your results.",
    description:
      "After finishing the test, you can see your results by clicking on 'See my Results' button. You will be redirected to results page. It will take some time to analyze your speech and give comprehensive feedback.",
    options: ["See my Results"],
  },
];

export const scores = {
  2.0: {
    level: "Beginner",
    code: "A1",
  },
  2.5: {
    level: "Beginner",
    code: "A1",
  },
  3.0: {
    level: "Elementary",
    code: "A2",
  },
  3.5: {
    level: "Elementary",
    code: "A2",
  },
  4.0: {
    level: "Intermediate",
    code: "B1",
  },
  4.5: {
    level: "Intermediate",
    code: "B1",
  },
  5.0: {
    level: "Intermediate",
    code: "B1",
  },
  5.5: {
    level: "Upper Intermediate",
    code: "B2",
  },
  6.0: {
    level: "Upper Intermediate",
    code: "B2",
  },
  6.5: {
    level: "Upper Intermediate",
    code: "B2",
  },
  7.0: {
    level: "Advanced",
    code: "C1",
  },
  7.5: {
    level: "Advanced",
    code: "C1",
  },
  8.0: {
    level: "Advanced",
    code: "C1",
  },
  8.5: {
    level: "Proficient",
    code: "C2",
  },
  9.0: {
    level: "Proficient",
    code: "C2",
  },
};

export type Plan = {
  tier: "Free" | "Starter" | "Pro";
  price: number;
  description: string;
  audience: string;
  features: string[];
  productId: string;
};

export const plansAnnual: Plan[] = [
  {
    tier: "Free",
    price: 0,
    description: "Per user/month billed annualy",
    audience: "For testing out our platform and trying out our features.",
    features: [
      "30 test credits",
      "free analysis",
      "1 assistant available",
      "2 short practices",
    ],
    productId: "",
  },
  {
    tier: "Starter",
    price: 4,
    description: "Per user/month billed annualy",
    audience: "Ideal for students with regular preparation",
    features: [
      "300 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "6 daily pronunciation checks",
      "3 assistants available",
      "30 short practices",
    ],
    productId: "4b6527fc-6c9b-421f-94ce-28deb64860c7",
  },
  {
    tier: "Pro",
    price: 10,
    description: "Per user/month billed annualy",
    audience: "Greate for shared users with intensive preparation",
    features: [
      "800 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "10 daily pronunciation checks",
      "3 assistants available",
      "50 short practices",
    ],
    productId: "4ec53659-48f1-423d-a749-7020732542dc",
  },
];

export const speakingTestParts = [
  {
    id: "part1",
    title: "Part 1",
    subtitle: "Introduction & Interview",
    duration: "4-5 minutes",
    icon: MessageSquare,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description:
      "General questions about yourself, your home, work, studies, and familiar topics",
    tips: [
      "Give full answers with examples, not just yes/no responses",
      "Keep answers natural and conversational, avoid memorized responses",
      "Practice common topics: work, studies, hometown, hobbies, daily routine",
      "Extend answers by adding personal details and explanations",
      "Speak clearly at a natural pace - don't rush your responses",
    ],
  },
  {
    id: "part2",
    title: "Part 2",
    subtitle: "Long Turn (Cue Card)",
    duration: "3-4 minutes",
    icon: BookOpen,
    color: "bg-green-100 text-green-700 border-green-200",
    description:
      "Speak for 1-2 minutes on a given topic after 1 minute of preparation time",
    tips: [
      "Use the full preparation minute to plan - make notes for each bullet point",
      "Address all bullet points on the cue card in your response",
      "Speak for the complete 2 minutes - don't stop early",
      "Include specific examples and personal experiences to develop your ideas",
      "Use linking words to connect your ideas smoothly throughout",
    ],
  },
  {
    id: "part3",
    title: "Part 3",
    subtitle: "Two-way Discussion",
    duration: "4-5 minutes",
    icon: Users,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description:
      "Abstract discussion related to Part 2 topic with more complex questions",
    tips: [
      "Think before speaking - it's okay to pause and consider your answer",
      "Use complex sentence structures and advanced vocabulary",
      "Give balanced arguments and consider different perspectives",
      "Support opinions with logical reasoning and real-world examples",
      "Compare past, present, and future situations when relevant",
    ],
  },
];

export const infoParts = {
  1: {
    title: "Part 1: Short Introduction & Interview",
    description:
      "In part 1, the examiner will first introduce themselves and ask you to confirm your own identity. They will then ask you some general questions on familiar topics such as home, family, work, studies and interests.",
    time: "4 - 5 min speaking",
  },
  2: {
    title: "Part 2: Individual Long Turn",
    description:
      "In Part 2, also known as the 'long turn', requires candidates to speak for 1-2 minutes on a given topic, following a one-minute preparation period. The examiner provides a task card with a specific topic and prompts to guide the candidate's response. ",
    time: "1 min prep + 2 min speaking",
  },
  3: {
    title: "Part 3: Further Dialog and Discussion",
    description:
      "In part 3 of the Speaking test the examiner will ask further questions which are connected to the topics discussed in part 2. This part of the test is designed to give you the opportunity to talk about more abstract issues and ideas.",
    time: "4 - 5 min speaking",
  },
};

export const plansMonthly: Plan[] = [
  {
    tier: "Free",
    price: 0,
    description: "Per user/month billed monthly",
    audience: "For testing out our platform and trying out our features.",
    features: [
      "30 test credits",
      "free analysis",
      "1 assistant available",
      "2 short practices",
    ],
    productId: "",
  },
  {
    tier: "Starter",
    price: 5,
    description: "Per user/month billed monthly",
    audience: "Ideal for students with regular preparation",
    features: [
      "300 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "5 daily pronunciation checks",
      "2 assistants available",
      "20 short practices",
    ],
    productId: "f8e06f4c-d548-45cb-a3b7-0b2df14c64b1",
  },
  {
    tier: "Pro",
    price: 12,
    description: "Per user/month billed monthly",
    audience: "Greate for shared users with intensive preparation",
    features: [
      "800 test credits",
      "unlimited analysis",
      "unlimited export",
      "daily challenges",
      "30 daily pronunciation checks",
      "3 assistants available",
      "50 short practices",
    ],
    productId: "17f01020-8e66-4ebc-8d12-9fdf98da2149",
  },
];
