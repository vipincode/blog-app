If you decide to use **API routes** instead of server actions, you’ll want to separate your **API layer** cleanly but still keep the **DAL (Data Access Layer)** pattern. The structure changes slightly because now you have a `route.ts` (or `route.tsx`) for each API endpoint.

Here’s a recommended **production-ready folder structure** for Next.js App Router + API routes + DAL:

---

### **Folder Structure**

```
src/
 ├─ app/
 │   ├─ api/
 │   │   ├─ users/
 │   │   │   └─ route.ts             // Handles /api/users (POST, GET)
 │   │   ├─ users/
 │   │   │   └─ [id]/route.ts        // Handles /api/users/:id
 │   │   ├─ posts/
 │   │   │   └─ route.ts
 │   │   └─ ...
 │   │
 │   ├─ (auth)/
 │   │   ├─ login/page.tsx
 │   │   └─ register/page.tsx
 │   └─ dashboard/page.tsx
 │
 ├─ components/                       // UI components
 │   ├─ ui/
 │   ├─ features/
 │   └─ layout/
 │
 ├─ dal/                              // DATA ACCESS LAYER
 │   ├─ users/
 │   │   ├─ user.dal.ts               // CRUD logic (DB queries)
 │   │   └─ user.types.ts
 │   ├─ posts/
 │   │   └─ post.dal.ts
 │   └─ index.ts
 │
 ├─ services/                         // Business logic (optional)
 │   ├─ auth.service.ts
 │   ├─ user.service.ts
 │   └─ ...
 │
 ├─ schemas/                          // Zod schemas
 │   ├─ user.schema.ts
 │   └─ post.schema.ts
 │
 ├─ lib/
 │   ├─ db.ts                         // Prisma/Drizzle client
 │   └─ utils/
 │       ├─ auth.ts
 │       └─ hash.ts
 │
 └─ types/
     └─ index.ts
```

---

### **How the Flow Works**

1. **API Route**: Defines the HTTP interface and request/response handling.
2. **Service Layer (optional)**: Business logic if needed (validation, orchestration).
3. **DAL**: Pure database operations.
4. **lib/db.ts**: Single DB client instance.

---

### **Example**

#### DAL: `dal/users/user.dal.ts`

```ts
import { db } from '@/lib/db'
import { User } from '@prisma/client'

export async function createUser(data: { email: string; password: string }): Promise<User> {
  return db.user.create({ data })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return db.user.findUnique({ where: { email } })
}
```

#### API Route: `app/api/users/route.ts`

```ts
import { NextResponse } from 'next/server'
import { createUser } from '@/dal/users/user.dal'
import { userSchema } from '@/schemas/user.schema'
import { hashPassword } from '@/lib/utils/hash'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = userSchema.parse(body)

    const hashedPassword = await hashPassword(parsed.password)
    const user = await createUser({ email: parsed.email, password: hashedPassword })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data or server error' }, { status: 400 })
  }
}

export async function GET() {
  // Optionally return all users
}
```

---

### **Why This Works**

- **API routes** live in `app/api`—clear separation of frontend pages and backend endpoints.
- **DAL** stays clean and reusable. It can be used in API routes, server actions, cron jobs, etc.
- **Services** let you add logic between DAL and route (optional but nice for scaling).
- **Schemas** keep validation consistent (Zod is great here).
- **Components** stay UI-only and separate from API logic.

---

### **Extra Tips**

- Use **route grouping** for large projects: `app/api/(v1)/users/route.ts`
- Use **middleware.ts** in `app/` for auth and request validation.
- DAL functions should never know about HTTP—they just return data.

---

Good question. A `services/auth.service.ts` file is where you **keep your business logic for authentication**, separate from the API route or server action.

Think of it like this:

- **API route / server action** = Handles the request/response, validates input.
- **Service** = Handles business rules and orchestration (hashing passwords, generating JWTs, calling DAL functions).
- **DAL** = Only talks to the database (no logic).

This separation makes your code **testable, reusable, and clean**.

---

### **Example: `services/auth.service.ts`**

Here’s what typically goes in an `auth.service.ts`:

#### 1. **Register a User**

- Validates and hashes password
- Calls DAL to create a user
- Returns sanitized user

#### 2. **Login a User**

- Fetches user from DB (DAL)
- Compares password hash
- Generates JWT / session token
- Returns token or error

#### 3. **Verify Token / Session**

- Decodes JWT
- Fetches user if needed

---

**Sample Code**

```ts
import { createUser, getUserByEmail } from '@/dal/users/user.dal'
import { hashPassword, comparePassword } from '@/lib/utils/hash'
import { signToken, verifyToken } from '@/lib/utils/auth' // your JWT helpers
import type { User } from '@prisma/client'

export async function registerUser(
  email: string,
  password: string,
): Promise<Omit<User, 'password'>> {
  const hashed = await hashPassword(password)
  const user = await createUser({ email, password: hashed })

  // never return password
  const { password: _, ...safeUser } = user
  return safeUser
}

export async function loginUser(email: string, password: string): Promise<string | null> {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await comparePassword(password, user.password)
  if (!isValid) return null

  // Create JWT token
  const token = signToken({ id: user.id, email: user.email })
  return token
}

export async function authenticateToken(token: string): Promise<User | null> {
  try {
    const payload = verifyToken(token)
    if (!payload) return null

    const user = await getUserByEmail(payload.email)
    return user
  } catch {
    return null
  }
}
```

---

### **When to Call These**

**API route example:** `app/api/auth/login/route.ts`

```ts
import { NextResponse } from 'next/server'
import { loginUser } from '@/services/auth.service'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const token = await loginUser(email, password)

  if (!token) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  return NextResponse.json({ token })
}
```

**Server action example:** `app/(auth)/login/actions.ts`

```ts
'use server'

import { loginUser } from '@/services/auth.service'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  return await loginUser(email, password)
}
```

---

### **Why Have a Service Layer**

- **Keeps routes thin** (just HTTP handling).
- **Centralizes logic** (easy to reuse across API routes, server actions, CRON jobs).
- **Testable** (you can unit test `auth.service.ts` without worrying about Next.js).
- **Flexible** (swap DAL or JWT logic later without touching routes).

---

Would you like me to:

1. Add **Zod validation** inside the service?
2. Show a **full auth flow with cookies and middleware**?
3. Show a **folder structure for JWT + OAuth (NextAuth)**?
