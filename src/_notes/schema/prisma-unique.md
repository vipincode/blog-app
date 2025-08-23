In Prisma, `@@unique` defines a **unique constraint** at the **model level**.

### What it means

- `@@unique([provider, providerAccountId])` means **the combination of `provider` and `providerAccountId` must be unique** in that table.
- No two rows can have the same values for both fields together.

### Why use it

- Sometimes one field alone doesn’t need to be unique, but a pair (or more) must be.
- Example in your `Account` model:

  - `provider` = `"google"`, `providerAccountId` = `"12345"` → unique for this Google account.
  - You could have another record with `provider` = `"github"`, `providerAccountId` = `"12345"` (different provider, same ID is okay).

### Difference from `@unique`

- `@unique` is **field-level**: only that column must be unique.
- `@@unique` is **multi-field (composite)**: the **combination** must be unique.

---

### Example

```prisma
model Account {
  id                String   @id @default(uuid())
  userId            String
  provider          String
  providerAccountId String
  user              User     @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId]) // composite unique constraint
}
```

**Result:**

- Allowed: `(google, 123)`, `(github, 123)`
- Not allowed: `(google, 123)` twice.

---

Would you like me to **list other places in your schema where composite `@@unique` might make sense** (like tokens)?
