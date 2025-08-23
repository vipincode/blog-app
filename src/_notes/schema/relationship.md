Prisma supports three main types of relationships, and your schema already uses all of them:

---

## **1. One-to-One Relationship**

- **Definition**: One record in model A is related to **only one** record in model B.
- **Example in your schema**: `User` ↔ `Profile`

**How it’s defined**:

```prisma
model User {
  id      String   @id @default(uuid())
  profile Profile? // optional, but one-to-one
}

model Profile {
  id     String @id @default(uuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

- `Profile.userId` is a **foreign key** that references `User.id`.
- `@unique` ensures a `Profile` belongs to only one `User`.
- The `?` means it’s optional (a `User` may not have a `Profile` yet).

**Usage example:**

```ts
await prisma.user.create({
  data: {
    name: "Alice",
    email: "alice@example.com",
    profile: {
      create: { bio: "Hello!", age: 25 },
    },
  },
});
```

---

## **2. One-to-Many Relationship**

- **Definition**: One record in model A can be related to **multiple** records in model B, but each record in B belongs to **one** A.
- **Example in your schema**: `User` ↔ `Post`, `User` ↔ `Session`

**How it’s defined**:

```prisma
model User {
  id      String   @id @default(uuid())
  posts   Post[]
  sessions Session[]
}

model Post {
  id      String @id @default(uuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id])
}

model Session {
  id      String @id @default(uuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id])
}
```

- `Post` and `Session` have a `userId` foreign key linking back to `User.id`.
- In `User`, the related records are represented as **arrays**: `posts: Post[]`, `sessions: Session[]`.

**Usage example:**

```ts
await prisma.user.create({
  data: {
    name: "Bob",
    email: "bob@example.com",
    posts: {
      create: [{ title: "First Post" }, { title: "Second Post" }],
    },
  },
});
```

---

## **3. Many-to-Many Relationship**

- **Definition**: Multiple records in model A can be related to **multiple** records in model B.
- **Example in your schema**: `User` ↔ `Account` can also be seen as many-to-many when extended for OAuth providers.

For a **true many-to-many**, Prisma creates an implicit **join table** for you:

```prisma
model User {
  id       String     @id @default(uuid())
  accounts Account[]
}

model Account {
  id       String @id @default(uuid())
  users    User[]
}
```

**How it works:**

- Prisma automatically creates a hidden join table (e.g., `_AccountToUser`).
- If you need extra fields on the join, you make an **explicit join table**:

```prisma
model User {
  id      String         @id @default(uuid())
  accounts UserAccount[]
}

model Account {
  id      String         @id @default(uuid())
  users   UserAccount[]
}

model UserAccount {
  userId    String
  accountId String
  role      String
  user      User    @relation(fields: [userId], references: [id])
  account   Account @relation(fields: [accountId], references: [id])

  @@id([userId, accountId]) // composite primary key
}
```

---

## **How Relations Work in Prisma**

- **`@relation`**: Defines how two models are linked (`fields` = local foreign keys, `references` = target keys).
- **`@unique` / `@@id`**: Enforces uniqueness in one-to-one and composite keys.
- **Nested writes**: You can `create`, `connect`, `update`, or `delete` related records in a single query.
- **Querying**: Use `include` or `select` to fetch related data.

Example:

```ts
await prisma.user.findMany({
  include: {
    profile: true,
    posts: true,
    accounts: true,
  },
});
```

---

### Want me to **draw a small diagram** of how your `User`, `Profile`, `Post`, `Session`, and `Account` models connect? Or should I give **best practices for designing these relationships in production**?
