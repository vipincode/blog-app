Here’s a clear step-by-step guide to set up Prisma ORM with Next.js:

---

### **1. Install Dependencies**

Run the following commands in your Next.js project:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

---

### **2. Initialize Prisma**

Run:

```bash
npx prisma init
```

This will:

- Create a `prisma/` folder containing a `schema.prisma` file.
- Add a `.env` file to your project root.

---

### **3. Configure the Database Connection**

In your `.env` file, set your database URL. For example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

You can use PostgreSQL, MySQL, SQLite, MongoDB, or any supported database.

---

### **4. Define Your Schema**

Edit `prisma/schema.prisma`. Example with a `User` model:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

---

### **5. Run Migration**

To create tables in the database:

```bash
npx prisma migrate dev --name init
```

---

### **6. Generate Prisma Client**

If not already generated:

```bash
npx prisma generate
```

This creates a fully typed Prisma Client that you can import into your code.

---

### **7. Create a Prisma Client Instance**

Create a file `lib/prisma.ts` to prevent multiple instances during hot reloads:

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

---

### **8. Use Prisma in Your Next.js App**

Example in an API route (`app/api/users/route.ts` or `pages/api/users.ts`):

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

---

### **9. Explore Prisma Studio**

Run:

```bash
npx prisma studio
```

This opens a visual editor for your database in the browser.

---

### **Best Practices**

- Always use the singleton pattern for Prisma in Next.js to avoid multiple connections.
- Keep environment variables secret.
- Use Prisma Migrate for production migrations.
- In App Router (Next.js 13+), use `route.ts` files for API endpoints.

---

Would you like me to **show a complete example with a TODO app schema and API routes** using Prisma + Next.js App Router? Or **setup for Neon/PlanetScale (serverless DB)**?
