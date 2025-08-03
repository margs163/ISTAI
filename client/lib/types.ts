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
  firstName: z.string().max(50, "Invalid first name"),
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
  assisstant: "Ron" | "Kate";
};

export const NewTestFormSchema = z.object({
  testName: z
    .string()
    .min(1, "Invalid test name")
    .max(40, "Test name must be less than 40 characters"),
  assisstant: z.enum(["Ron", "Kate"]),
});
