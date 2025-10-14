"use client";
import LoadingUI from "@/components/loadingUI";
import {
  createQuestionnaireRecord,
  postQuestionnaireAnswers,
} from "@/lib/queries";
import { QuestionnaireFormSchema, QuestionnaireFormType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, MoveLeft, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const questions = [
  {
    title: "Where did you learn about us?",
  },
  {
    title:
    "Have you ever passed an IELTS Speaking exam? If so, what was your Speaking score?",
  },
  {
    title: "What is your role?",
  },
];

export default function Page() {
  useEffect(() => mutationCreate.mutate(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitted },
    trigger,
    getValues,
    setValue,
  } = useForm<QuestionnaireFormType>({
    resolver: zodResolver(QuestionnaireFormSchema),
  });

  const [currentStage, setCurrentStage] = useState(0);
  const router = useRouter();
  const [passed, setPassed] = useState(true);
  const mutationUpdate = useMutation({
    mutationKey: ["questionnaire-post"],
    mutationFn: postQuestionnaireAnswers,
  });

  const mutationCreate = useMutation({
    mutationKey: ["questionnaire-create"],
    mutationFn: createQuestionnaireRecord,
  });

  const onSubmit: SubmitHandler<QuestionnaireFormType> = useCallback(
    async (data: QuestionnaireFormType) => {
      mutationUpdate.mutate(data);
      router.replace("/dashboard");
    },
    []
  );

  const handleNextQuestion = useCallback(() => {
    setCurrentStage((prev) => (prev < 2 ? prev + 1 : prev));
  }, []);

  const handleQuestionsSubmit = useCallback(async () => {
    const isValid = await trigger();

    console.log("SUBMITTING THE FORM, VALID:", isValid);
    console.log(getValues());
    if (isValid) {
      await handleSubmit(onSubmit)();
    }
  }, []);

  if (isLoading) return <LoadingUI />;


  return (
    <div className="flex flex-col p-4 gap-3 font-geist">
      <section className="flex flex-row gap-1 h-1.5">
        {questions.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex-1/4 rounded-xl h-full",
              currentStage >= index ? "bg-indigo-400" : "bg-gray-300"
            )}
          ></div>
        ))}
      </section>
      <section className="flex items-center">
        <button
          className={cn(
            "flex items-center text-gray-500 text-sm font-medium gap-2 mr-auto",
            currentStage === 0 && "hidden"
          )}
          onClick={() => setCurrentStage((prev) => prev - 1)}
        >
          <ArrowLeft className="size-5 text-gray-400" />
          Previous
        </button>
        <button
          className={cn(
            "flex items-center text-gray-500 text-sm font-medium gap-2 ml-auto",
            currentStage === 2 && "hidden"
          )}
          onClick={() => setCurrentStage((prev) => prev + 1)}
        >
          Next
          <ArrowRight className="size-5 text-gray-400" />
        </button>
      </section>
      <section className="flex flex-col gap-10 items-center mt-10">
        <header className="text-center space-y-2">
          <p className="text-sm font-medium text-indigo-600">
            Question {currentStage + 1} / 3
          </p>
          <h1 className="text-2xl font-bold text-gray-800 max-w-[600px]">
            {questions[currentStage].title}
          </h1>
        </header>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div
            className={cn(
              "grid grid-cols-2 gap-2",
              currentStage !== 0 && "hidden"
            )}
          >
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="reddit"
                value={"reddit"}
                {...register("heard_from")}
              />
              <label
                htmlFor="reddit"
                className="text-sm font-medium text-gray-800"
              >
                Reddit
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="twitter"
                value={"twitter"}
                {...register("heard_from")}
              />
              <label
                htmlFor="twitter"
                className="text-sm font-medium text-gray-800"
              >
                Twitter (X)
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="instagram"
                value={"instagram"}
                {...register("heard_from")}
              />
              <label
                htmlFor="instagram"
                className="text-sm font-medium text-gray-800"
              >
                Instagram
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="youtube"
                value={"youtube"}
                {...register("heard_from")}
              />
              <label
                htmlFor="youtube"
                className="text-sm font-medium text-gray-800"
              >
                Youtube
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="google"
                value={"google"}
                {...register("heard_from")}
              />
              <label
                htmlFor="google"
                className="text-sm font-medium text-gray-800"
              >
                Google Search
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="friend"
                value={"friend"}
                {...register("heard_from")}
              />
              <label
                htmlFor="friend"
                className="text-sm font-medium text-gray-800"
              >
                Friend
              </label>
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col gap-4",
              currentStage !== 1 && "hidden"
            )}
          >
            <div className="flex gap-4 items-center " aria-disabled={!passed}>
              <label
                htmlFor="score"
                className="text-base font-medium text-gray-800"
              >
                Yes, my score was:
              </label>
              <input
                type="number"
                id="score"
                min={0}
                max={9}
                step={0.5}
                {...register("previous_score", { valueAsNumber: true })}
                disabled={!passed}
                className="p-2 text-center rounded-md border-2 border-gray-200 focus-within:outline-0 focus-within:border-indigo-300 disabled:focus-within:border-gray-200 text-sm font-medium text-gray-800"
              />
            </div>
            <div className="w-full py-3 bg-gray-200 rounded-md flex items-center gap-2 px-4">
              <input
                type="checkbox"
                id="no"
                onChange={() => {
                  setPassed((prev) => !prev);
                  setValue("previous_score", null);
                }}
                className="rounded-2xl"
              />
              <label htmlFor="no" className="text-sm font-medium text-gray-800">
                No, I haven&apos;t
              </label>
            </div>
          </div>
          <div
            className={cn(
              "grid grid-cols-2 gap-2",
              currentStage !== 2 && "hidden"
            )}
          >
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="student"
                value={"student"}
                {...register("role")}
              />
              <label
                htmlFor="student"
                className="text-sm font-medium text-gray-800"
              >
                Student
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="teacher"
                value={"teacher"}
                {...register("role")}
              />
              <label
                htmlFor="teacher"
                className="text-sm font-medium text-gray-800"
              >
                Teacher
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="guest"
                value={"guest"}
                {...register("role")}
              />
              <label
                htmlFor="guest"
                className="text-sm font-medium text-gray-800"
              >
                Guest
              </label>
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-3 rounded-md bg-gray-200">
              <input
                type="radio"
                id="influencer"
                value={"influencer"}
                {...register("role")}
              />
              <label
                htmlFor="influencer"
                className="text-sm font-medium text-gray-800"
              >
                Influencer
              </label>
            </div>
          </div>
          {
            <button
              className="px-6 py-3 mx-auto rounded-full text-sm text-white font-medium active:bg-indigo-600 hover:bg-indigo-600 bg-indigo-500 disabled:bg-indigo-400 mt-12 flex gap-2 items-center"
              type={"button"}
              disabled={isLoading}
              onClick={async () =>
                currentStage !== 2
                  ? handleNextQuestion()
                  : handleQuestionsSubmit()
              }
            >
              {isLoading
                ? "Sending Answers"
                : currentStage === 2
                ? "Send Answers"
                : "Next Question"}
              <MoveRight className="size-4.5" />
            </button>
          }
        </form>
      </section>
    </div>
  );
}
