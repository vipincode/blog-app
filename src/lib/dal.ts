/**
 * Dal: data access layer, which responsive for fetch data for server component.
 * They mostly just used for getting data.
 * these is not work inside client component
 */

//  move it related dal folder
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { prisma } from './prisma'
import { mockDelay } from './utils'

// Fetch a single issue by ID
export async function getIssue(id: number) {
  try {
    await mockDelay(700)
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: { user: true },
    })
    return issue
  } catch (error) {
    console.error(`Error fetching issue ${id}:`, error)
    throw new Error('Failed to fetch issue')
  }
}

// Fetch all issues
export async function getIssues() {
  'use cache'
  cacheTag('issues')
  try {
    await mockDelay(700)
    const issues = await prisma.issue.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
    return issues
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}
