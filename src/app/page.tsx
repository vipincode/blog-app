import * as React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data - replace with actual data fetching
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js and Prisma",
    content:
      "Learn how to build modern web applications using Next.js and Prisma. This comprehensive guide covers everything from setup to deployment, including best practices for database design and API routes.",
    published: true,
    createdAt: new Date("2024-01-15"),
    author: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    readTime: 8,
  },
  {
    id: 2,
    title: "The Future of Web Development",
    content:
      "Exploring the latest trends and technologies shaping the future of web development. From AI integration to edge computing, discover what's coming next in the world of web technologies.",
    published: true,
    createdAt: new Date("2024-01-12"),
    author: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    readTime: 6,
  },
  {
    id: 3,
    title: "Building Responsive UIs with Tailwind CSS",
    content:
      "Master the art of creating beautiful, responsive user interfaces using Tailwind CSS. Learn about utility-first design principles and how to create maintainable stylesheets.",
    published: true,
    createdAt: new Date("2024-01-10"),
    author: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    readTime: 5,
  },
  {
    id: 4,
    title: "Database Design Best Practices",
    content:
      "Learn essential database design principles that will help you create efficient, scalable, and maintainable database schemas for your applications.",
    published: false,
    createdAt: new Date("2024-01-08"),
    author: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    },
    readTime: 10,
  },
  {
    id: 5,
    title: "Authentication in Modern Web Apps",
    content:
      "A comprehensive guide to implementing secure authentication in modern web applications. Cover JWT tokens, OAuth, and best security practices.",
    published: true,
    createdAt: new Date("2024-01-05"),
    author: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    readTime: 12,
  },
  {
    id: 6,
    title: "TypeScript Tips and Tricks",
    content:
      "Discover advanced TypeScript techniques that will make your code more robust and maintainable. From utility types to advanced patterns.",
    published: true,
    createdAt: new Date("2024-01-03"),
    author: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    readTime: 7,
  },
];

export default function HomePage() {
  // Filter only published posts for the home page
  const publishedPosts = mockPosts.filter((post) => post.published);
  const featuredPosts = publishedPosts.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Posts Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Latest Posts
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our most recent articles covering web development,
                design, and technology trends.
              </p>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* View All Posts Button */}
            <div className="text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Stay Updated
              </h2>
              <p className="text-muted-foreground">
                Subscribe to our newsletter to get the latest posts delivered
                directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="sm:w-auto">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
