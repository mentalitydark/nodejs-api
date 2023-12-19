import z from "zod";

export const UserSchema = {
  email: z.string().email(),
  password: z.string().trim().min(6),
  username: z.string().trim().min(3)
}