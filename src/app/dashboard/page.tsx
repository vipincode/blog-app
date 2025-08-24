// import React from "react";

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface BlogFormData {
  title: string;
  content: string;
  tags: string;
  thumbnail?: string;
}

export default function DashboardPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(false);
  const [isDraft, setIsDraft] = React.useState(false);

  const form = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      thumbnail: "",
    },
  });

  const onSubmit = async (
    data: BlogFormData,
    publishType: "publish" | "draft"
  ) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Blog form data:", {
      ...data,
      published: publishType === "publish",
    });

    setIsSubmitting(false);

    if (publishType === "publish") {
      setIsPublished(true);
      setTimeout(() => {
        setIsPublished(false);
        form.reset();
      }, 3000);
    } else {
      setIsDraft(true);
      setTimeout(() => {
        setIsDraft(false);
      }, 3000);
    }
  };

  const handlePublish = () => {
    form.handleSubmit((data) => onSubmit(data, "publish"))();
  };

  const handleSaveDraft = () => {
    form.handleSubmit((data) => onSubmit(data, "draft"))();
  };

  const wordCount = form.watch("content")?.replace(/<[^>]*>/g, "").length || 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Create New Blog Post
            </h1>
            <p className="text-muted-foreground">
              Share your thoughts and ideas with the community.
            </p>
          </div>

          {/* Success Messages */}
          {isPublished && (
            <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎉</div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Blog Post Published!
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Your blog post has been successfully published and is now
                      live.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isDraft && (
            <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💾</div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                      Draft Saved!
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Your blog post has been saved as a draft.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Write Your Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="space-y-6">
                      {/* Title Field */}
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{
                          required: "Title is required",
                          minLength: {
                            value: 5,
                            message: "Title must be at least 5 characters",
                          },
                          maxLength: {
                            value: 100,
                            message: "Title must be less than 100 characters",
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blog Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your blog post title..."
                                className="text-lg font-medium"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              A compelling title that captures your post&nbsp;‘s
                              essence ({field.value?.length || 0}/100)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Thumbnail URL Field */}
                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thumbnail Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional: Add a thumbnail image URL for your blog
                              post
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Rich Text Editor */}
                      <FormField
                        control={form.control}
                        name="content"
                        rules={{
                          required: "Content is required",
                          minLength: {
                            value: 50,
                            message: "Content must be at least 50 characters",
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content *</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isSubmitting}
                                placeholder="Start writing your blog post..."
                              />
                            </FormControl>
                            <FormDescription>
                              Write your blog content using the rich text editor
                              above
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Tags Field */}
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="React, Next.js, Web Development (comma separated)"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              Add relevant tags to help readers discover your
                              post (comma separated)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button
                          type="button"
                          onClick={handlePublish}
                          disabled={isSubmitting}
                          size="lg"
                          className="flex-1"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Publishing...
                            </>
                          ) : (
                            "Publish Post"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSaveDraft}
                          disabled={isSubmitting}
                          size="lg"
                          className="flex-1"
                        >
                          {isSubmitting ? "Saving..." : "Save as Draft"}
                        </Button>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Post Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Post Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Word Count:
                      </span>
                      <Badge variant="secondary">{wordCount}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Est. Read Time:
                      </span>
                      <Badge variant="secondary">{estimatedReadTime} min</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Characters:
                      </span>
                      <Badge variant="secondary">
                        {form.watch("title")?.length || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Writing Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Writing Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Use clear, engaging headlines
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Break up text with subheadings
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Add relevant images and links
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Keep paragraphs concise
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Use bullet points for lists
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Formatting Guide */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Formatting Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Ctrl+B
                        </Badge>
                        <span className="text-muted-foreground">Bold text</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Ctrl+I
                        </Badge>
                        <span className="text-muted-foreground">
                          Italic text
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Ctrl+K
                        </Badge>
                        <span className="text-muted-foreground">Add link</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
