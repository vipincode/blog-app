'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ProfileFormData {
  name: string
  email: string
  bio: string
  website: string
  location: string
}

const SettingsPage = () => {
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false)
  const [passwordSuccess, setPasswordSuccess] = React.useState(false)
  const [profileSuccess, setProfileSuccess] = React.useState(false)
  const [isEditingProfile, setIsEditingProfile] = React.useState(false)

  // Mock user data - in real app, this would come from API/context
  const [userData, setUserData] = React.useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer passionate about creating amazing web experiences.',
    website: 'https://johndoe.dev',
    location: 'San Francisco, CA',
    avatar: '',
    joinedDate: 'January 2023',
    postsCount: 12,
  })

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      name: userData.name,
      email: userData.email,
      bio: userData.bio,
      website: userData.website,
      location: userData.location,
    },
  })

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdatingPassword(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('Password update data:', data)

    setIsUpdatingPassword(false)
    setPasswordSuccess(true)
    passwordForm.reset()

    setTimeout(() => {
      setPasswordSuccess(false)
    }, 3000)
  }

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Profile update data:', data)

    // Update local state
    setUserData((prev) => ({ ...prev, ...data }))
    setIsUpdatingProfile(false)
    setProfileSuccess(true)
    setIsEditingProfile(false)

    setTimeout(() => {
      setProfileSuccess(false)
    }, 3000)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto py-8 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>

          {/* Success Messages */}
          {passwordSuccess && (
            <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Password Updated!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Your password has been successfully changed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {profileSuccess && (
            <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Profile Updated!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Your profile information has been successfully updated.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-8">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    disabled={isUpdatingProfile}
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!isEditingProfile ? (
                  // Profile Display Mode
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Avatar className="h-20 w-20 mx-auto sm:mx-0">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback className="text-lg">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl font-semibold mb-1">{userData.name}</h3>
                        <p className="text-muted-foreground mb-2">{userData.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <Badge variant="secondary">Joined {userData.joinedDate}</Badge>
                          <Badge variant="secondary">{userData.postsCount} Posts</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Bio</h4>
                        <p className="text-muted-foreground">{userData.bio || 'No bio provided'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Website</h4>
                        <p className="text-muted-foreground">
                          {userData.website || 'No website provided'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <p className="text-muted-foreground">
                          {userData.location || 'No location provided'}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Email</h4>
                        <p className="text-muted-foreground">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Profile Edit Mode
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          rules={{
                            required: 'Name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters',
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          rules={{
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://yourwebsite.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us about yourself..."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description about yourself (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4">
                        <Button type="submit" disabled={isUpdatingProfile}>
                          {isUpdatingProfile ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditingProfile(false)}
                          disabled={isUpdatingProfile}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            {/* Password Change Section */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      rules={{
                        required: 'Current password is required',
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your current password"
                              {...field}
                              disabled={isUpdatingPassword}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      rules={{
                        required: 'New password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message:
                            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your new password"
                              {...field}
                              disabled={isUpdatingPassword}
                            />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters with uppercase, lowercase, and
                            number.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      rules={{
                        required: 'Please confirm your new password',
                        validate: (value) =>
                          value === passwordForm.getValues('newPassword') ||
                          'Passwords do not match',
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your new password"
                              {...field}
                              disabled={isUpdatingPassword}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating Password...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Additional account preferences and settings.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for new comments and messages
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SettingsPage
