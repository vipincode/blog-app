Here’s how you can implement **server actions** for signup, signin, and email verification based on your Prisma schema in the latest Next.js App Router setup:

---

### **Key Points Before Starting**

- **Server actions** run on the server and can securely access your database and environment variables.
- For **email sending**, you can use [Nodemailer](https://nodemailer.com/) or services like [Resend](https://resend.com/) or \[SendGrid].
- **Hash passwords** using `bcrypt`.
- **JWT** or session-based auth can be used, but here signup and signin actions return tokens or session info.
- **Email verification** will involve sending a link with a `verificationToken` stored in DB.

---

### **1. Install Dependencies**

```bash
npm install bcrypt jsonwebtoken nodemailer
```

---

### **2. Create the Server Actions**

**Directory structure:**

```
/app
  /actions
    auth.ts
  /lib
    prisma.ts
    mail.ts
```

---

#### **`lib/prisma.ts`**

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;
```

---

#### **`lib/mail.ts`** (email utility)

```ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail", // or SMTP config for other providers
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your account",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`,
  });
}
```

---

#### **`app/actions/auth.ts`**

```ts
"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function signup(name: string, email: string, password: string) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification token
  const token = crypto.randomUUID();
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpiry: tokenExpiry,
    },
  });

  // Send verification email
  await sendVerificationEmail(email, token);

  return { message: "Signup successful. Please verify your email." };
}

export async function signin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  if (!user.isVerified) {
    throw new Error("Email not verified");
  }

  const valid =
    user.password && (await bcrypt.compare(password, user.password));
  if (!valid) throw new Error("Invalid email or password");

  // Create a JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  // Optionally set a cookie
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

  if (!user) {
    throw new Error("Invalid or expired token");
  }

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

### **3. How to Use These Server Actions**

**In a Next.js component:**

```tsx
"use client";
import { useTransition, useState } from "react";
import { signup } from "../actions/auth";

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {
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
    <form onSubmit={handleSignup}>
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

### **4. Next Steps**

- **Token security:** Use JWT secrets from `.env`.
- **OAuth:** Integrate [NextAuth.js](https://next-auth.js.org/) with your `Account` model for Google/GitHub logins.
- **Password reset:** Similar to email verification, generate token and send via email.
- **Rate limiting:** Protect signup/signin endpoints.
- **Production email:** Prefer providers like SendGrid/Resend for better deliverability.

---

Would you like me to **add OAuth support (Google/GitHub)** in these server actions too? Or **integrate these with NextAuth** using your `Account` model?
