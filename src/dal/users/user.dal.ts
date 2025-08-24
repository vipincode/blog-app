/**
 * Dal: data access layer, which responsive for fetch data for server component.
 * They mostly just used for getting data.
 * these is not work inside client component
 */

import { cache } from 'react'
import { getSession } from '@/lib/auth'
import { mockDelay } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

// Current user
export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session) return null

  // Skip DB query during prerendering in production build
  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    return null
  }

  await mockDelay(700)
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })
    return user
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
})

// Get user by email
export const getUserByEmail = cache(async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
})
