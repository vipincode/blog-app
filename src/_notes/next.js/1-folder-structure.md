### **Key Principles**

1. **Server Actions** live close to the UI (inside `app`), but they should call DAL functions for DB/API access.
2. **DAL layer** encapsulates all queries/mutations and can use Prisma, Drizzle, Mongoose, or raw SQL.
3. **Domain separation**: separate features/modules (e.g., `users`, `posts`).
4. **Validation & types**: use Zod or TypeScript interfaces.
5. **Reusability**: DAL can be reused in routes, server actions, API endpoints, or scripts.

---

### **Recommended Folder Structure**

```
src/
 ├─ app/
 │   ├─ (auth)/
 │   │   ├─ login/
 │   │   │   ├─ page.tsx
 │   │   │   └─ actions.ts        // server actions for login
 │   │   └─ register/
 │   │       ├─ page.tsx
 │   │       └─ actions.ts
 │   ├─ dashboard/
 │   │   ├─ page.tsx
 │   │   └─ actions.ts            // server actions for dashboard features
 │   └─ layout.tsx
 │
 ├─ lib/
 │   ├─ db.ts                     // Prisma/Drizzle client or DB connection
 │   ├─ utils/
 │   │   ├─ auth.ts               // JWT/session helpers
 │   │   └─ hash.ts               // password hashing
 │
 ├─ dal/                          // DATA ACCESS LAYER
 │   ├─ users/
 │   │   ├─ user.dal.ts           // CRUD for users
 │   │   └─ user.types.ts
 │   ├─ posts/
 │   │   ├─ post.dal.ts
 │   │   └─ post.types.ts
 │   └─ index.ts                  // re-exports for DAL
 │
 ├─ services/                     // Business logic, orchestrates DAL if needed
 │   ├─ auth.service.ts
 │   ├─ user.service.ts
 │   └─ ...
 │
 ├─ schemas/                      // Zod schemas for validation
 │   ├─ user.schema.ts
 │   └─ post.schema.ts
 │
 └─ types/                        // Shared types/interfaces
     └─ index.ts
```

---

---

```
src/
 ├─ app/
 │   └─ (auth)/...
 │
 ├─ components/
 │   ├─ ui/                // Reusable, atomic components (buttons, inputs, modals)
 │   │   ├─ button.tsx
 │   │   ├─ input.tsx
 │   │   └─ ...
 │   ├─ layout/            // Navigation, headers, sidebars, footers
 │   │   ├─ header.tsx
 │   │   └─ sidebar.tsx
 │   ├─ forms/             // Form-specific reusable components
 │   │   ├─ login-form.tsx
 │   │   └─ register-form.tsx
 │   └─ features/          // Feature-specific components
 │       ├─ users/
 │       │   └─ user-card.tsx
 │       └─ posts/
 │           └─ post-card.tsx
 │
 └─ dal/...
```

---

### **How Each Layer Works**

1. **DAL (`dal/users/user.dal.ts`)**

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

2. **Server Action (`app/(auth)/register/actions.ts`)**

   ```ts
   'use server'

   import { createUser } from '@/dal/users/user.dal'
   import { hashPassword } from '@/lib/utils/hash'

   export async function registerUser(formData: FormData) {
     const email = formData.get('email') as string
     const password = await hashPassword(formData.get('password') as string)

     return await createUser({ email, password })
   }
   ```

3. **Schema Validation (`schemas/user.schema.ts`)**

   ```ts
   import { z } from 'zod'

   export const userSchema = z.object({
     email: z.string().email(),
     password: z.string().min(6),
   })

   export type UserSchema = z.infer<typeof userSchema>
   ```

4. **Usage in Page (`app/(auth)/register/page.tsx`)**

   ```tsx
   import { registerUser } from './actions'

   export default function RegisterPage() {
     async function handleSubmit(formData: FormData) {
       'use server'
       await registerUser(formData)
     }

     return (
       <form action={handleSubmit}>
         <input name="email" type="email" />
         <input name="password" type="password" />
         <button type="submit">Register</button>
       </form>
     )
   }
   ```

---

### **Why This Structure Works**

- **Separation of concerns:** DAL is responsible for persistence, services can hold logic, server actions are thin wrappers for UI.
- **Scalability:** Easy to add new features by creating a new folder in `dal` and linking it.
- **Reusability:** DAL can be reused in cron jobs, API routes, or CLI scripts.
- **Security:** Server actions and DAL never run on the client; no sensitive logic leaks.

---

Perfect, if you’re using **server actions** (no `/api` endpoints), the idea is very similar—you still want an `auth.service.ts` to hold your **authentication business logic**, but instead of being called from API routes, you’ll call it **directly in your server actions**.

The main change is:

- **Server actions** live inside your `app` folder and are tied to a page, layout, or component.
- **`auth.service.ts`** stays in `src/services` and keeps your logic clean and reusable.

---

### **How It Looks in Server Actions Flow**

**Folder structure example:**

```
src/
 ├─ app/
 │   ├─ (auth)/
 │   │   ├─ login/
 │   │   │   ├─ page.tsx
 │   │   │   └─ actions.ts   // server actions for login
 │   │   └─ register/
 │   │       ├─ page.tsx
 │   │       └─ actions.ts   // server actions for register
 │
 ├─ services/
 │   └─ auth.service.ts      // authentication logic
 │
 ├─ dal/users/user.dal.ts    // DB queries
 └─ lib/utils/...            // hashing, jwt helpers
```

---

### **`auth.service.ts` (for server actions)**

This file is almost the same as before, just ensure **it’s server-only code** (never imported into client components):

```ts
import { createUser, getUserByEmail } from '@/dal/users/user.dal'
import { hashPassword, comparePassword } from '@/lib/utils/hash'
import { signToken, verifyToken } from '@/lib/utils/auth'
import type { User } from '@prisma/client'

export async function registerUser(
  email: string,
  password: string,
): Promise<Omit<User, 'password'>> {
  const hashed = await hashPassword(password)
  const user = await createUser({ email, password: hashed })

  const { password: _, ...safeUser } = user
  return safeUser
}

export async function loginUser(email: string, password: string): Promise<string | null> {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await comparePassword(password, user.password)
  if (!isValid) return null

  // Create token or set session here
  const token = signToken({ id: user.id, email: user.email })
  return token
}
```

---

### **Server Action Example: `app/(auth)/login/actions.ts`**

```ts
'use server'

import { loginUser } from '@/services/auth.service'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const token = await loginUser(email, password)

  // Here you can set a cookie if needed
  // cookies().set("token", token, { httpOnly: true });

  return token
}
```

---

### **Page Usage: `app/(auth)/login/page.tsx`**

```tsx
import { loginAction } from './actions'

export default function LoginPage() {
  return (
    <form action={loginAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

---

### **Why still keep `auth.service.ts`?**

- Keeps your **server actions lean** (just orchestration).
- Makes it easy to **reuse auth logic** across multiple server actions or pages (register, login, forgot password).
- Easier to **test**—you can unit test the service without touching Next.js server actions.

---

Good question.

`// re-exports for DAL` just means **a single entry point file** that re-exports everything from your DAL folders, so you don’t have to import each DAL file separately. It’s a convenience and organization step.

---

### **Why use `index.ts` for re-exports?**

- Without it, your imports would look like this:

  ```ts
  import { createUser } from '@/dal/users/user.dal'
  import { createPost } from '@/dal/posts/post.dal'
  ```

- With `dal/index.ts`, you can just:

  ```ts
  import { createUser, createPost } from '@/dal'
  ```

---

### **Example `dal/index.ts`**

```ts
// Re-export everything from each DAL module
export * from './users/user.dal'
export * from './posts/post.dal'
```

Now, anywhere in your app you can just:

```ts
import { createUser, getUserByEmail, createPost } from '@/dal'
```

---

### **Optional Types Re-export**

If you also want to collect all DAL-related types:

```ts
export * from './users/user.types'
export * from './posts/post.types'
```

This makes it **easy to maintain** and **shortens import paths**.

---

Would you like me to show a **full DAL example with CRUD for users and posts** and how the `index.ts` helps? Or **explain when to split DAL into more files (e.g., queries vs mutations)**?
