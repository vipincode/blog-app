"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data matching your Prisma schema
const allPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js and Prisma",
    content:
      "Learn how to build modern web applications using Next.js and Prisma. This comprehensive guide covers everything from setup to deployment, including best practices for database design and API routes. We'll explore how to create efficient database schemas, implement authentication, and optimize performance for production applications.",
    published: true,
    authorId: 1,
    createdAt: new Date("2024-01-15"),
    author: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date("2023-01-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    readTime: 8,
  },
  {
    id: 2,
    title: "The Future of Web Development",
    content:
      "Exploring the latest trends and technologies shaping the future of web development. From AI integration to edge computing, discover what's coming next in the world of web technologies. We'll dive deep into emerging frameworks, development methodologies, and the tools that will define the next decade of web development.",
    published: true,
    authorId: 2,
    createdAt: new Date("2024-01-12"),
    author: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      createdAt: new Date("2023-02-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    readTime: 6,
  },
  {
    id: 3,
    title: "Building Responsive UIs with Tailwind CSS",
    content:
      "Master the art of creating beautiful, responsive user interfaces using Tailwind CSS. Learn about utility-first design principles and how to create maintainable stylesheets. This guide covers advanced techniques, custom components, and best practices for scalable CSS architecture.",
    published: true,
    authorId: 3,
    createdAt: new Date("2024-01-10"),
    author: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      createdAt: new Date("2023-03-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    readTime: 5,
  },
  {
    id: 4,
    title: "Database Design Best Practices",
    content:
      "Learn essential database design principles that will help you create efficient, scalable, and maintainable database schemas for your applications. We'll cover normalization, indexing strategies, and performance optimization techniques that every developer should know.",
    published: true,
    authorId: 1,
    createdAt: new Date("2024-01-08"),
    author: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date("2023-01-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
    readTime: 10,
  },
  {
    id: 5,
    title: "Authentication in Modern Web Apps",
    content:
      "A comprehensive guide to implementing secure authentication in modern web applications. Cover JWT tokens, OAuth, and best security practices. Learn how to protect your users' data and implement robust authentication flows that scale with your application.",
    published: true,
    authorId: 2,
    createdAt: new Date("2024-01-05"),
    author: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      createdAt: new Date("2023-02-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    readTime: 12,
  },
  {
    id: 6,
    title: "TypeScript Tips and Tricks",
    content:
      "Discover advanced TypeScript techniques that will make your code more robust and maintainable. From utility types to advanced patterns, learn how to leverage TypeScript's powerful type system to catch bugs early and improve developer experience.",
    published: true,
    authorId: 3,
    createdAt: new Date("2024-01-03"),
    author: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      createdAt: new Date("2023-03-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    readTime: 7,
  },
  {
    id: 7,
    title: "React Server Components Deep Dive",
    content:
      "Understanding React Server Components and how they're changing the way we build React applications. Learn about the benefits, implementation strategies, and how to migrate existing applications to take advantage of this powerful new paradigm.",
    published: true,
    authorId: 1,
    createdAt: new Date("2024-01-01"),
    author: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date("2023-01-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    readTime: 9,
  },
  {
    id: 8,
    title: "CSS Grid vs Flexbox: When to Use What",
    content:
      "A comprehensive comparison of CSS Grid and Flexbox, helping you choose the right layout method for your projects. Learn the strengths and weaknesses of each approach and when to apply them for optimal results.",
    published: true,
    authorId: 2,
    createdAt: new Date("2023-12-28"),
    author: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      createdAt: new Date("2023-02-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1545670723-196ed0954986?w=800&h=400&fit=crop",
    readTime: 6,
  },
  {
    id: 9,
    title: "Building APIs with Node.js and Express",
    content:
      "Learn how to create robust and scalable APIs using Node.js and Express. Cover routing, middleware, error handling, and best practices for building production-ready backend services that can handle high traffic loads.",
    published: true,
    authorId: 3,
    createdAt: new Date("2023-12-25"),
    author: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      createdAt: new Date("2023-03-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop",
    readTime: 11,
  },
  {
    id: 10,
    title: "Optimizing React Performance",
    content:
      "Master React performance optimization techniques to build lightning-fast applications. Learn about memoization, code splitting, lazy loading, and other strategies to improve your app's performance and user experience.",
    published: true,
    authorId: 1,
    createdAt: new Date("2023-12-20"),
    author: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date("2023-01-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
    readTime: 8,
  },
  {
    id: 11,
    title: "GraphQL vs REST: Making the Right Choice",
    content:
      "Compare GraphQL and REST APIs to help you make informed decisions for your next project. Understand the trade-offs, benefits, and use cases for each approach in modern web development.",
    published: true,
    authorId: 2,
    createdAt: new Date("2023-12-15"),
    author: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      createdAt: new Date("2023-02-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    readTime: 7,
  },
  {
    id: 12,
    title: "Docker for Frontend Developers",
    content:
      "Learn how to use Docker to streamline your frontend development workflow. From containerizing applications to setting up development environments, discover how Docker can improve your productivity and deployment process.",
    published: true,
    authorId: 3,
    createdAt: new Date("2023-12-10"),
    author: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      createdAt: new Date("2023-03-01"),
    },
    thumbnail:
      "https://images.unsplash.com/photo-1605745341112-85968b19335a?w=800&h=400&fit=crop",
    readTime: 9,
  },
];

const categories = [
  "All",
  "Web Development",
  "React",
  "TypeScript",
  "CSS",
  "Node.js",
  "Database",
];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
  { value: "title", label: "Title A-Z" },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const postsPerPage = 9;

  // Filter and sort posts
  const filteredAndSortedPosts = React.useMemo(() => {
    const filtered = allPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch && post.published;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          return (b.readTime || 0) - (a.readTime || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Simulate loading state
  const handleSearch = (value: string) => {
    setIsLoading(true);
    setSearchQuery(value);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of posts section
    document.getElementById("posts-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Our Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover insights, tutorials, and stories from our community of
                developers and designers.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Input
                  type="search"
                  placeholder="Search articles, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Filters and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Sort by:
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="text-center text-sm text-muted-foreground">
                {isLoading
                  ? "Searching..."
                  : `Showing ${filteredAndSortedPosts.length} article${
                      filteredAndSortedPosts.length !== 1 ? "s" : ""
                    }`}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section id="posts-section" className="py-16">
          <div className="container mx-auto">
            {isLoading ? (
              /* Loading Skeleton */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-xl" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-5/6" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-muted rounded-full" />
                        <div className="h-3 bg-muted rounded w-20" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : currentPosts.length > 0 ? (
              <>
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {currentPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + postsPerPage,
                        filteredAndSortedPosts.length
                      )}{" "}
                      of {filteredAndSortedPosts.length} articles
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <div className="flex space-x-1">
                        {Array.from(
                          { length: Math.min(totalPages, 5) },
                          (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNumber}
                                variant={
                                  currentPage === pageNumber
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                className="w-10"
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn&nbsp;t find any articles matching your search
                  criteria. Try adjusting your search terms or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSortBy("newest");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Never Miss an Update
              </h2>
              <p className="text-muted-foreground">
                Subscribe to our newsletter and get the latest articles
                delivered directly to your inbox every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
