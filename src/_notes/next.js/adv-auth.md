Awesome—let’s wire in **JWT security**, **NextAuth (Google/GitHub OAuth + Credentials)**, **password reset**, **rate limiting**, and **Resend** for production email, all on top of your schema.

> ⚠️ **Important Prisma notes for NextAuth compatibility**
>
> The official Prisma Adapter expects a few exact field names/types:
>
> - `Session.expires` (not `expiresAt`)
> - `Account.type` (e.g. `"oauth" | "oidc" | "credentials"`)
> - `Account.expires_at` as `Int?` (Unix seconds) instead of `DateTime?`
>
> If you’ll use the Prisma Adapter (recommended), update your schema as below. If you **cannot** change the schema, you’d need a custom adapter (more work).

---

# 1) Prisma schema (minimal changes for NextAuth)

```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id                      String    @id @default(uuid())
  name                    String
  email                   String    @unique
  password                String?
  role                    Role      @default(USER)
  isVerified              Boolean   @default(false)
  verificationToken       String?
  verificationTokenExpiry DateTime?
  resetPasswordToken      String?
  resetPasswordExpiry     DateTime?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  profile  Profile?
  posts    Post[]
  sessions Session[]
  accounts Account[]
}

model Profile {
  id        String  @id @default(uuid())
  userId    String  @unique
  bio       String?
  avatarUrl String?
  age       Int?
  user      User    @relation(fields: [userId], references: [id])
}

model Post {
  id         String   @id @default(uuid())
  title      String
  content    String?
  coverImage String?
  author     User     @relation(fields: [authorId], references: [id])
  authorId   String
  published  Boolean  @default(false)
  readTime   Int?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  sessionToken String   @unique
  createdAt    DateTime @default(now())
  // 🔄 rename expiresAt -> expires
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id])

  @@index([sessionToken])
  @@index([expires])
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  // ✅ required by NextAuth
  type              String
  provider          String
  providerAccountId String
  // ✅ NextAuth expects epoch seconds as Int?
  expires_at        Int?
  access_token      String?
  refresh_token     String?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  // keep friendly aliases if you also use them elsewhere (optional):
  // expiresAt       DateTime? @map("expires_at")
  // accessToken     String?   @map("access_token")
  // refreshToken    String?   @map("refresh_token")
  // tokenType       String?   @map("token_type")
  // idToken         String?   @map("id_token")

  user User @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
}
```

Then:

```bash
npx prisma migrate dev -n "nextauth_compat"
```

---

# 2) Environment

```env
# JWT
JWT_SECRET=super-strong-long-random-string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${JWT_SECRET}

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...

# Resend
RESEND_API_KEY=...
EMAIL_FROM="Your App <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Upstash (for rate limiting)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

# 3) Libraries

```bash
npm i next-auth @auth/prisma-adapter bcrypt jsonwebtoken resend @upstash/ratelimit @upstash/redis
```

---

# 4) Core libs: Prisma, Mail (Resend), Rate limit

`/lib/prisma.ts`

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;
```

`/lib/mail.ts`

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
      <p>Click the button to verify your account (valid for 24 hours):</p>
      <p><a href="${verifyUrl}">Verify Account</a></p>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Reset your password",
    html: `
      <h2>Password reset requested</h2>
      <p>Click to set a new password (valid for 60 minutes):</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
    `,
  });
}
```

`/lib/ratelimit.ts`

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests / minute / identifier
  analytics: true,
  prefix: "rl:auth:",
});

export async function rateLimitOrThrow(bucket: string) {
  const h = headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "127.0.0.1";
  const { success, limit, remaining, reset } = await authLimiter.limit(
    `${bucket}:${ip}`
  );
  if (!success) {
    const wait = Math.max(0, reset - Math.floor(Date.now() / 1000));
    const err = new Error(`Too many requests. Try again in ${wait}s.`);
    (err as any).meta = { limit, remaining, reset };
    throw err;
  }
}
```

---

# 5) NextAuth setup (OAuth + Credentials)

`/app/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Use JWT sessions to avoid DB sessions complexity
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user || !user.password) return null;
        if (!user.isVerified)
          throw new Error("Please verify your email before signing in.");
        const ok = await bcrypt.compare(creds.password, user.password);
        return ok
          ? ({
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            } as any)
          : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // merge role/id into token
      if (user) {
        token.id = (user as any).id ?? token.id;
        token.role = (user as any).role ?? token.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) (session.user as any).id = token.id;
      if (token?.role) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    // you can customize signIn/signOut/error pages if you want
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

> With this, users can sign in via **Google/GitHub** or **email+password**.
> Your custom signup/verify/reset flows (below) remain in place; Credentials uses your same users.

---

# 6) Server Actions (signup, signin via JWT cookie if you still want it, verify email, password reset) + Rate limiting

`/app/actions/auth.ts`

```ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";
import { rateLimitOrThrow } from "@/lib/ratelimit";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

export async function signup(name: string, email: string, password: string) {
  await rateLimitOrThrow("signup");

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email already registered");

  const hash = await bcrypt.hash(password, 10);
  const token = crypto.randomUUID();
  const tokenExpiry = new Date(Date.now() + ONE_DAY_MS);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      verificationToken: token,
      verificationTokenExpiry: tokenExpiry,
    },
  });

  await sendVerificationEmail(email, token);
  return { message: "Signup successful. Check your email to verify." };
}

export async function signinWithJwtCookie(email: string, password: string) {
  await rateLimitOrThrow("signin");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new Error("Invalid email or password");
  if (!user.isVerified) throw new Error("Please verify your email first");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  return { message: "Signed in", token };
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

export async function requestPasswordReset(email: string) {
  await rateLimitOrThrow("pwreset:request");

  const user = await prisma.user.findUnique({ where: { email } });
  // For privacy, do not reveal whether the email exists
  if (!user)
    return { message: "If that account exists, an email has been sent." };

  const token = crypto.randomUUID();
  const expiry = new Date(Date.now() + ONE_HOUR_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: token,
      resetPasswordExpiry: expiry,
    },
  });

  await sendPasswordResetEmail(email, token);
  return { message: "If that account exists, an email has been sent." };
}

export async function resetPassword(token: string, newPassword: string) {
  await rateLimitOrThrow("pwreset:confirm");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new Error("Invalid or expired reset link");

  const hash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hash,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return { message: "Password has been reset. You can sign in now." };
}
```

---

# 7) Minimal UI hooks

- **Email verification page** `/app/verify/page.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { verifyEmail } from "../actions/auth";

export default function VerifyPage() {
  const [msg, setMsg] = useState("Verifying...");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || "";
    (async () => {
      try {
        const res = await verifyEmail(token);
        setMsg(res.message);
      } catch (e: any) {
        setMsg(e.message || "Verification failed");
      }
    })();
  }, []);
  return <p>{msg}</p>;
}
```

- **Password reset request** `/app/forgot-password/page.tsx`

```tsx
"use client";
import { useState } from "react";
import { requestPasswordReset } from "../actions/auth";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await requestPasswordReset(email);
        setMsg(res.message);
      }}
    >
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        required
      />
      <button>Send reset link</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
```

- **Password reset confirm** `/app/reset-password/page.tsx`

```tsx
"use client";
import { useEffect, useState } from "react";
import { resetPassword } from "../actions/auth";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const res = await resetPassword(token, pwd);
          setMsg(res.message);
        } catch (e: any) {
          setMsg(e.message || "Failed to reset");
        }
      }}
    >
      <input
        type="password"
        placeholder="New password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        required
      />
      <button>Reset password</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
```

---

# 8) Optional: Protect routes (middleware)

If you want JWT-cookie protection for custom routes (separate from NextAuth):

`/middleware.ts`

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PROTECTED = ["/dashboard", "/settings"]; // add your paths

export function middleware(req: NextRequest) {
  if (!PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p)))
    return NextResponse.next();

  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/signin", req.url));

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = { matcher: ["/dashboard/:path*", "/settings/:path*"] };
```

If you’re using **NextAuth** session protection instead, you can check `getServerSession(authOptions)` within server components or route handlers and redirect if missing.

---

# 9) Security + Production tips

- **JWT secret:** keep it long and random; rotate periodically.
- **Password policy:** enforce minimum length, common-password denylist, and hashing with `bcrypt` cost 10–12.
- **Rate limiting:** already added (Upstash). Consider CAPTCHAs for signup.
- **Email deliverability:** Resend domain verified + DMARC/SPF/DKIM configured.
- **Logging:** log auth events (with redaction).
- **Account linking:** NextAuth will link OAuth accounts to the same email automatically (provider-dependent). For stricter control, use `events.linkAccount`.

---

If you want, I can also:

- generate **typed Zod schemas** for all forms,
- add **ShadCN** UI forms with toasts,
- or wire a **role-based guard** that reads `session.user.role`.
