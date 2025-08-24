[Ref](https://nextjs.org/blog/next-15-4)
[Ref](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)

Thought for 3sLet me search for the latest Next.js caching documentation to give you the most accurate and up-to-date information.

Found Next.js caching info# Caching in Next.js with DAL Approach

## Overview of Next.js Caching

Next.js provides a comprehensive caching system with multiple layers to optimize performance. Here's how it works and how to implement it with a Data Access Layer (DAL) approach.

## Types of Caching in Next.js

### 1. **Data Cache (Server-side)**

- Automatically caches `fetch` requests on the server
- Default behavior: `cache: 'force-cache'`
- Persists across requests and deployments

### 2. **Request Memoization**

- React automatically deduplicates identical requests during rendering
- Only applies within a single request lifecycle

### 3. **Full Route Cache**

- Caches entire route segments at build time
- Works with static and dynamic routes

### 4. **Router Cache (Client-side)**

- Caches route segments in the browser
- Reduces server requests during navigation

## Caching Strategies

### Time-based Revalidation

```javascript
// Revalidate every hour
fetch('https://api.example.com/data', {
  next: { revalidate: 3600 },
})

// Or using segment config
export const revalidate = 3600
```

### On-demand Revalidation

```javascript
import { revalidateTag, revalidatePath } from 'next/cache'

// Tag-based revalidation
fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
})

// Trigger revalidation
revalidateTag('posts')
revalidatePath('/posts')
```

### Opt-out of Caching

```javascript
// No caching
fetch('https://api.example.com/data', {
  cache: 'no-store',
})

// Or revalidate on every request
fetch('https://api.example.com/data', {
  next: { revalidate: 0 },
})
```

## DAL (Data Access Layer) Approach

A DAL centralizes data fetching logic, making caching strategies consistent and maintainable.

### Basic DAL Structure

```typescript
// lib/dal.ts
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

// User data access
export const getUser = cache(async (id: string) => {
  const response = await fetch(`/api/users/${id}`, {
    next: {
      tags: [`user-${id}`],
      revalidate: 3600, // 1 hour
    },
  })
  return response.json()
})

// Posts with different caching strategy
export const getPosts = cache(async () => {
  const response = await fetch('/api/posts', {
    next: {
      tags: ['posts'],
      revalidate: 300, // 5 minutes
    },
  })
  return response.json()
})

// Real-time data (no cache)
export const getLiveData = cache(async () => {
  const response = await fetch('/api/live', {
    cache: 'no-store',
  })
  return response.json()
})
```

### Advanced DAL with Database Queries

```typescript
// lib/dal.ts
import { unstable_cache } from 'next/cache'
import { sql } from '@/lib/db' // Your database client

// Cache database queries
export const getUserFromDB = unstable_cache(
  async (id: string) => {
    const user = await sql`SELECT * FROM users WHERE id = ${id}`
    return user[0]
  },
  ['user'], // Cache key
  {
    tags: [`user-${id}`],
    revalidate: 3600,
  },
)

export const getPostsFromDB = unstable_cache(
  async (limit: number = 10) => {
    const posts = await sql`
      SELECT * FROM posts 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `
    return posts
  },
  ['posts'],
  {
    tags: ['posts'],
    revalidate: 300,
  },
)
```

### Using DAL in Components

```typescript
// app/user/[id]/page.tsx
import { getUser } from '@/lib/dal'

export default async function UserPage({ params }: { params: { id: string } }) {
  // This will be cached and reused
  const user = await getUser(params.id)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Revalidation in Server Actions

```typescript
// app/actions.ts
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string, data: any) {
  // Update user in database
  await sql`UPDATE users SET ${data} WHERE id = ${id}`

  // Revalidate cached data
  revalidateTag(`user-${id}`)
  revalidateTag('users')
}

export async function createPost(data: any) {
  // Create post
  await sql`INSERT INTO posts ${data}`

  // Revalidate posts cache
  revalidateTag('posts')
}
```

## Best Practices

### 1. **Strategic Cache Tags**

```typescript
// Hierarchical tagging
export const getPost = cache(async (id: string) => {
  const response = await fetch(`/api/posts/${id}`, {
    next: {
      tags: ['posts', `post-${id}`, `author-${post.authorId}`],
    },
  })
  return response.json()
})
```

### 2. **Environment-based Caching**

```typescript
const isDev = process.env.NODE_ENV === 'development'

export const getData = cache(async () => {
  const response = await fetch('/api/data', {
    next: {
      revalidate: isDev ? 0 : 3600, // No cache in dev
    },
  })
  return response.json()
})
```

### 3. **Error Handling with Caching**

```typescript
export const getSafeData = cache(async () => {
  try {
    const response = await fetch('/api/data', {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch')
    }

    return response.json()
  } catch (error) {
    // Return cached data or fallback
    console.error('Data fetch failed:', error)
    return { error: 'Failed to load data' }
  }
})
```

## Key Benefits of DAL + Caching

1. **Centralized Logic**: All data fetching and caching rules in one place
2. **Consistent Performance**: Uniform caching strategies across your app
3. **Easy Maintenance**: Update caching behavior from a single location
4. **Type Safety**: Better TypeScript support with centralized data types
5. **Testability**: Easier to mock and test data access patterns

The DAL approach combined with Next.js caching provides a robust, scalable solution for managing data in modern web applications while maintaining excellent performance characteristics.
