Prisma transactions let you execute multiple queries as a single unit of work. Either **all queries succeed**, or **none of them are applied** (rolled back). This ensures data consistency, especially when performing multiple related updates or inserts.

---

## **Types of Transactions in Prisma**

### 1. **`$transaction` API (Recommended)**

- Allows running multiple queries atomically.
- Two main patterns:

  - **Batch transactions (array)** – all queries run in a single transaction.
  - **Interactive transactions (callback)** – allows conditional logic and multiple steps.

---

### **1. Batch Transactions (Array)**

```ts
const [newUser, newPost] = await prisma.$transaction([
  prisma.user.create({
    data: { email: "john@example.com", name: "John" },
  }),
  prisma.post.create({
    data: {
      title: "My first post",
      content: "Hello world!",
      author: { connect: { email: "john@example.com" } },
    },
  }),
]);
```

**How it works:**

- Runs both queries in a single transaction.
- If any query fails, the entire transaction is rolled back.
- Good for simple use cases.

---

### **2. Interactive Transactions (Callback)**

```ts
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: "jane@example.com", name: "Jane" },
  });

  await tx.post.create({
    data: {
      title: "Jane’s first post",
      content: "Hello!",
      authorId: user.id,
    },
  });

  // You can even add conditions
  const postCount = await tx.post.count({ where: { authorId: user.id } });
  if (postCount > 5) {
    throw new Error("Too many posts"); // Rolls back everything
  }
});
```

**Benefits:**

- Allows using variables from previous queries.
- Can add conditions and loops.
- More control over transaction flow.

---

### **When to Use Transactions**

- Creating related records (user and profile).
- Performing financial operations (debits and credits).
- Updating multiple tables that must stay consistent.
- Deleting data with dependencies.

---

### **Best Practices**

1. Keep transactions short to avoid database locks.
2. Avoid long-running or external API calls inside transactions.
3. Use `interactive transactions` when you need conditional logic.
4. Use proper error handling (try/catch).

---

Would you like me to **create a one-page Prisma Transactions Cheat Sheet (PDF)** like I did for Aggregations?
