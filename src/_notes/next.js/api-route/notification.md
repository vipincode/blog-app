Thought for 4sLet me search for the latest Next.js notification implementation patterns and best practices.

Found notification patterns# Notification Services in Next.js

## Types of Notifications

### 1. **Push Notifications (Browser)**

### 2. **Real-time In-App Notifications**

### 3. **Email Notifications**

### 4. **SMS Notifications**

### 5. **Server-Sent Events (SSE)**

Let me show you how to implement each type:

## 1. Push Notifications (Web Push API)

### Service Worker Setup

```javascript
// public/sw.js
self.addEventListener('push', function (event) {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/images/checkmark.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png',
      },
    ],
  }

  event.waitUntil(self.registration.showNotification('Your App', options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/notifications'))
  }
})
```

### Push Notification API Route

```typescript
// app/api/notifications/push/route.ts
import webpush from 'web-push'

// Configure VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(request: Request) {
  const { subscription, payload } = await request.json()

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: '/icon-192x192.png',
        url: payload.url,
      }),
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error('[v0] Push notification error:', error)
    return Response.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
```

### Client-Side Push Setup

```typescript
// hooks/use-push-notifications.ts
import { useState, useEffect } from 'react'

export function usePushNotifications() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window)
  }, [])

  const subscribeToPush = async () => {
    if (!isSupported) return

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      setSubscription(sub)

      // Save subscription to your backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub }),
      })
    } catch (error) {
      console.error('[v0] Push subscription error:', error)
    }
  }

  const sendTestNotification = async () => {
    if (!subscription) return

    await fetch('/api/notifications/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        payload: {
          title: 'Test Notification',
          body: 'This is a test push notification!',
          url: '/notifications',
        },
      }),
    })
  }

  return {
    subscription,
    isSupported,
    subscribeToPush,
    sendTestNotification,
  }
}
```

## 2. Real-time In-App Notifications with Server-Sent Events

### SSE API Route

```typescript
// app/api/notifications/stream/route.ts
import { redis } from '@/lib/redis'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return Response.json({ error: 'User ID required' }, { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

      // Poll for notifications every 5 seconds
      const interval = setInterval(async () => {
        try {
          const notifications = await redis.lrange(`notifications:${userId}`, 0, 4)

          if (notifications.length > 0) {
            const parsedNotifications = notifications.map((n) => JSON.parse(n))

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'notifications',
                  data: parsedNotifications,
                })}\n\n`,
              ),
            )
          }
        } catch (error) {
          console.error('[v0] SSE error:', error)
        }
      }, 5000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
```

### Real-time Notifications Hook

```typescript
// hooks/use-realtime-notifications.ts
import { useState, useEffect } from 'react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
  read: boolean
}

export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!userId) return

    const eventSource = new EventSource(`/api/notifications/stream?userId=${userId}`)

    eventSource.onopen = () => {
      console.log('[v0] SSE connection opened')
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'notifications') {
        setNotifications(data.data)
      }
    }

    eventSource.onerror = () => {
      console.error('[v0] SSE connection error')
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId, userId }),
    })

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    )
  }

  return {
    notifications,
    isConnected,
    markAsRead,
    unreadCount: notifications.filter((n) => !n.read).length,
  }
}
```

## 3. Creating Notifications API

### Add Notification API Route

```typescript
// app/api/notifications/create/route.ts
import { redis } from '@/lib/redis'

export async function POST(request: Request) {
  const { userId, title, message, type = 'info' } = await request.json()

  const notification = {
    id: crypto.randomUUID(),
    title,
    message,
    type,
    timestamp: Date.now(),
    read: false,
  }

  try {
    // Add to user's notification list
    await redis.lpush(`notifications:${userId}`, JSON.stringify(notification))

    // Keep only last 50 notifications
    await redis.ltrim(`notifications:${userId}`, 0, 49)

    // Set expiration for the list (30 days)
    await redis.expire(`notifications:${userId}`, 2592000)

    return Response.json({ success: true, notification })
  } catch (error) {
    console.error('[v0] Error creating notification:', error)
    return Response.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
```

### Notification Service Class

```typescript
// lib/notification-service.ts
import { redis } from '@/lib/redis'

export class NotificationService {
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    metadata?: any,
  ) {
    const notification = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false,
      metadata,
    }

    // Store in Redis
    await redis.lpush(`notifications:${userId}`, JSON.stringify(notification))
    await redis.ltrim(`notifications:${userId}`, 0, 49)

    // Send push notification if user is subscribed
    await this.sendPushNotification(userId, notification)

    return notification
  }

  static async sendPushNotification(userId: string, notification: any) {
    try {
      // Get user's push subscription from database
      const subscription = await this.getUserPushSubscription(userId)

      if (subscription) {
        await fetch('/api/notifications/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            payload: {
              title: notification.title,
              body: notification.message,
              url: '/notifications',
            },
          }),
        })
      }
    } catch (error) {
      console.error('[v0] Push notification failed:', error)
    }
  }

  static async getUserPushSubscription(userId: string) {
    // Implement based on your user storage system
    const subscription = await redis.get(`push_subscription:${userId}`)
    return subscription ? JSON.parse(subscription as string) : null
  }

  // Bulk notifications
  static async notifyMultipleUsers(
    userIds: string[],
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
  ) {
    const promises = userIds.map((userId) => this.createNotification(userId, title, message, type))

    await Promise.all(promises)
  }
}
```

## 4. Email Notifications

```typescript
// app/api/notifications/email/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { to, subject, html, userId } = await request.json()

  try {
    const { data, error } = await resend.emails.send({
      from: 'notifications@yourapp.com',
      to,
      subject,
      html,
    })

    if (error) {
      throw new Error(error.message)
    }

    // Log email notification
    await redis.lpush(
      `email_notifications:${userId}`,
      JSON.stringify({
        id: data?.id,
        to,
        subject,
        sentAt: Date.now(),
        status: 'sent',
      }),
    )

    return Response.json({ success: true, emailId: data?.id })
  } catch (error) {
    console.error('[v0] Email notification error:', error)
    return Response.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
```

## 5. Notification Component

```typescript
// components/notification-center.tsx
'use client'

import { useState } from 'react'
import { Bell, X, Check } from 'lucide-react'
import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NotificationCenterProps {
  userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, isConnected } = useRealtimeNotifications(userId)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications yet</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

## Usage Example

```typescript
// In your API routes or server actions
import { NotificationService } from '@/lib/notification-service'

// Create a notification when user completes an action
await NotificationService.createNotification(
  userId,
  'Order Confirmed',
  'Your order #12345 has been confirmed and is being processed.',
  'success',
)

// Notify multiple users
await NotificationService.notifyMultipleUsers(
  ['user1', 'user2', 'user3'],
  'System Maintenance',
  'Scheduled maintenance will begin at 2 AM UTC.',
  'warning',
)
```

This comprehensive notification system provides real-time in-app notifications, push notifications, and email capabilities. You can extend it further with SMS notifications using services like Twilio, or integrate with WebSocket for even more real-time features. The Redis-based approach ensures scalability and persistence of notification data.
https://www.webpushnotifications.com/
