To connect Prisma with **Supabase**, you’ll treat Supabase like a hosted **PostgreSQL database**, because Prisma communicates via PostgreSQL. Here’s how to set it up:

---

### **1. Get Supabase Connection String**

1. Log in to [Supabase](https://supabase.com).
2. Open your project → **Settings → Database**.
3. Under **Connection Info**, copy the **connection string (URI)**. It looks like:

   ```text
   postgres://postgres:[PASSWORD]@db.[project-ref].supabase.co:5432/postgres
   ```

**Important:** Replace `[PASSWORD]` with your database password (found under **Settings → Database → Connection string → Password**).

---

### **2. Update `.env`**

In your Next.js project, add this to `.env`:

```env
DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres"
```

---

### **3. Configure Prisma**

Your `schema.prisma` should have:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### **4. Migrate & Generate**

Push your schema to Supabase:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

You’ll see your tables appear in the **Supabase Table Editor**.

---

### **5. Use Prisma Client in Next.js**

Example in an API route:

**`lib/prisma.ts`**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**`app/api/users/route.ts`**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

---

### **6. Notes for Supabase**

- Supabase gives you **Row-Level Security (RLS)** and **Auth**. If you plan to use Supabase Auth or storage, you can combine Prisma for database CRUD and Supabase SDK for auth.
- Prisma only talks to the database; it doesn’t use Supabase client libraries for auth/storage.
- For production, store your `.env` secrets securely.

---

Would you like me to show:

1. **A full example: Prisma + Supabase + Next.js (with `User` schema)**, or
2. **How to combine Supabase Auth with Prisma models for users**?
