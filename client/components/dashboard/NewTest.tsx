"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  NewTestFormData,
  NewTestFormSchema,
  PracticeTestSchema,
  PracticeTestType,
  TestSessionType,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import MainButton from "../MainButton";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTestSessionStore } from "@/lib/testSessionStore";
import { useUserStore } from "@/lib/userStorage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useLocalPracticeTestStore } from "@/lib/practiceTestStore";

type PostResponse = {
  status: string;
  data: PracticeTestType;
};

export default function NewTest({ children }: { children: React.ReactNode }) {
  const setLocalPracticeTest = useLocalPracticeTestStore(
    (state) => state.setTestData
  );
  const router = useRouter();
  const firstName = useUserStore((state) => state.firstName);
  const lastName = useUserStore((state) => state.lastName);
  const [open, setOpen] = useState(false);
  const setSessionData = useTestSessionStore((state) => state.setSessionData);
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<NewTestFormData>({
    resolver: zodResolver(NewTestFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: {
      assistant: "Ron" | "Emma";
      practice_name: string;
      status: "Ongoing" | "Cancelled" | "Finished";
    }) =>
      axios
        .post<PostResponse>("http://localhost:8000/practice_test/new", data, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          const validate = PracticeTestSchema.safeParse(response.data.data);
          if (!validate.success) {
            console.error("Could not validate data:", response.data.data);
          }
          setLocalPracticeTest(validate.data as PracticeTestType);
          console.log("Validated and set the test!");
        })
        .catch((error) => console.error(error)),
  });

  const onSubmit: SubmitHandler<NewTestFormData> = (data) => {
    const createdTest = mutation.mutate({
      assistant: data.assisstant,
      practice_name: data.testName,
      status: "Ongoing",
    });
    console.log(createdTest);
    const session: TestSessionType = {
      testName: data.testName,
      assistant: data.assisstant,
      currentPart: 1,
      status: "active",
      startedTime: new Date().toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
      }),
      duration: 0,
      user: firstName + " " + lastName,
    };

    setSessionData(session);
    router.replace("/practice");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="font-geist">
        <DialogHeader className="mb-2">
          <DialogTitle>Create a new test</DialogTitle>
          <DialogDescription>
            Proceed to create a new test and spend 10 credits.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between gap-10 items-start"
        >
          <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-start w-full px-1 md:px-0">
            <div className="space-y-2 w-full flex flex-col items-start justify-start">
              <label
                htmlFor="testName"
                className="text-sm font-medium text-gray-800"
              >
                Test name
              </label>
              <input
                type="text"
                id="testName"
                placeholder="Enter test name"
                className="text-sm focus-within:outline-0 focus-within:border-gray-400 font-normal text-gray-800 rounded-md px-4 py-2 border-2 border-gray-300 transition-all w-full"
                {...register("testName")}
              />
              {errors.testName && (
                <p className="text-red-700 font-normal text-xs">
                  {errors.testName.message}
                </p>
              )}
            </div>
            <div className="space-y-2 flex flex-col items-start justify-start w-full">
              <label
                htmlFor="assisstant"
                className="text-sm font-medium text-gray-800"
              >
                Assisstant
              </label>
              <select
                className="text-sm focus-within:outline-0 focus-within:border-gray-400 transition-all font-normal rounded-md text-gray-800 px-4 py-2 border-2 border-gray-300 w-full"
                id="assisstant"
                {...register("assisstant")}
              >
                <option value="">Select</option>
                <option value="Ron">Ron</option>
                <option value="Emma">Emma</option>
              </select>
              {errors.assisstant && (
                <p className="text-red-700 font-normal text-xs">
                  {errors.assisstant.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 self-end">
            <MainButton type="submit" disabled={isLoading}>
              <Plus className="size-4" />
              <span className="text-xs font-medium font-geist">
                {isLoading ? "Creating..." : "New Test"}
              </span>
            </MainButton>
            <DialogClose asChild>
              <MainButton variant="secondary">
                <span className="text-xs font-medium font-geist px-2">
                  Cancel
                </span>
              </MainButton>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
