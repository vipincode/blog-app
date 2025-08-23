Prisma **Middleware** and **Extensions** are advanced features that give you more control and customization over your Prisma Client. Here’s a complete breakdown:

---

## **1. Prisma Middleware**

Middleware in Prisma allows you to intercept and run custom logic **before or after** a query is executed. Think of it like Express middleware but for database operations.

### **When to Use Middleware**

- Logging queries for debugging or analytics.
- Enforcing authorization checks.
- Modifying query arguments before execution.
- Adding global soft deletes (filtering out records with `deletedAt`).
- Performance monitoring.

### **Example: Logging and Soft Delete**

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware
prisma.$use(async (params, next) => {
  // Logging
  console.log(`Query: ${params.model}.${params.action}`);
  console.log(`Params:`, params.args);

  // Soft delete example: modify findMany to exclude deleted records
  if (params.action === "findMany" && params.model === "User") {
    params.args.where = {
      ...params.args.where,
      deletedAt: null,
    };
  }

  const result = await next(params);
  return result;
});

// Usage
const users = await prisma.user.findMany();
```

---

## **2. Prisma Extensions**

Extensions allow you to **extend Prisma Client** by adding:

- **Custom methods** on models or the client.
- **Custom computed fields** or utilities.
- **Reusable logic** encapsulated in Prisma API style.

They’re useful for **domain logic**, **helper functions**, and **DRY principles**.

### **When to Use Extensions**

- Adding reusable custom queries like `findActiveUsers`.
- Adding computed properties like `fullName` on `User`.
- Wrapping raw SQL queries inside a method.
- Abstracting repetitive logic from services to Prisma layer.

### **Example: Adding a Custom Method**

```ts
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client/extension";

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      // Custom method to find active users
      findActiveUsers() {
        return prisma.user.findMany({
          where: { isActive: true },
        });
      },
    },
  },
  result: {
    user: {
      // Add a computed field
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
    },
  },
});

// Usage
const activeUsers = await prisma.user.findActiveUsers();
console.log(activeUsers[0].fullName);
```

---

## **Key Differences**

- **Middleware:** Good for **cross-cutting concerns** (logging, filtering, modifying queries globally).
- **Extensions:** Good for **extending Prisma API** with domain-specific utilities and computed fields.

---

### **Best Practices**

- Use **middleware sparingly** to avoid performance issues.
- Keep logic in **extensions** model-specific and reusable.
- Combine both if necessary: middleware for global concerns, extensions for domain utilities.

---

Would you like me to **create a PDF cheatsheet** similar to the Aggregations one, covering **Middleware and Extensions with visuals and examples**?
