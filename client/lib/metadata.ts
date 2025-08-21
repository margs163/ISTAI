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
