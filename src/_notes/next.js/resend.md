Here’s the updated version using **[Resend](https://resend.com/)** for sending emails instead of Nodemailer. This simplifies email delivery and is production-friendly.

---

### **1. Install Resend SDK**

```bash
npm install resend
```

---

### **2. Environment Variables**

Add these to `.env`:

```
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Your App <noreply@yourdomain.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

---

### **3. `lib/mail.ts`**

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Verify your account",
    html: `
      <h2>Welcome!</h2>
      <p>Please verify your account by clicking the link below:</p>
      <p><a href="${verifyUrl}" target="_blank">Verify your account</a></p>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
```

---

### **4. `lib/prisma.ts`**

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;
```

---

### **5. Server Actions: `app/actions/auth.ts`**

```ts
"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "@/lib/mail";

export async function signup(name: string, email: string, password: string) {
  // Check if email exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification token
  const token = crypto.randomUUID();
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  // Create user
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpiry: tokenExpiry,
    },
  });

  // Send email using Resend
  await sendVerificationEmail(email, token);

  return { message: "Signup successful. Please check your email to verify." };
}

export async function signin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");
  if (!user.isVerified)
    throw new Error("Please verify your email before signing in");

  const valid =
    user.password && (await bcrypt.compare(password, user.password));
  if (!valid) throw new Error("Invalid email or password");

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Store token in cookie (optional)
  cookies().set("auth_token", token, { httpOnly: true });

  return { message: "Signin successful", token };
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new Error("Invalid or expired verification link");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  return { message: "Email verified successfully" };
}
```

---

### **6. Example Signup Form**

```tsx
"use client";
import { useTransition, useState } from "react";
import { signup } from "../actions/auth";

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    startTransition(async () => {
      try {
        const res = await signup(name, email, password);
        alert(res.message);
      } catch (err: any) {
        setError(err.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button disabled={isPending}>Sign Up</button>
    </form>
  );
}
```

---

### **Next Steps**

- **Verify page:** Create a `/verify/page.tsx` to handle token verification by calling `verifyEmail(token)`.
- **OAuth login:** Can be integrated via NextAuth.js using your `Account` model.
- **Production domain:** Ensure `EMAIL_FROM` is verified in Resend dashboard.

---

Would you also like me to **add a `/verify` route page** that consumes `verifyEmail` action and shows a success/failure message?
