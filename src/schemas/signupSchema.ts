import {z} from "zod";
import mongoose from "mongoose";

export const usernameValiation = z
    .string()
    .min(4,"Username must be at least 4 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]{1,20}$/i,"Username must not contain special characters");



export const signupSchema = z.object({
    username: usernameValiation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6,{message: "Password must be at least 6 characters long"})
})