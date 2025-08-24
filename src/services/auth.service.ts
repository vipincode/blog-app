// import { createUser, getUserByEmail } from "@/dal/users/user.dal";
// import { hashPassword, comparePassword } from "@/lib/utils/hash";
// import { signToken, verifyToken } from "@/lib/utils/auth";
// import type { User } from "@prisma/client";

// export async function registerUser(email: string, password: string): Promise<Omit<User, "password">> {
//   const hashed = await hashPassword(password);
//   const user = await createUser({ email, password: hashed });

//   const { password: _, ...safeUser } = user;
//   return safeUser;
// }

// export async function loginUser(email: string, password: string): Promise<string | null> {
//   const user = await getUserByEmail(email);
//   if (!user) return null;

//   const isValid = await comparePassword(password, user.password);
//   if (!isValid) return null;

//   // Create token or set session here
//   const token = signToken({ id: user.id, email: user.email });
//   return token;
// }
