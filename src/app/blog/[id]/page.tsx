import * as React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCard } from "@/components/blog/blog-card";

// Extended mock data - in a real app, this would come from your database
const allPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js and Prisma",
    content: `# Getting Started with Next.js and Prisma

Next.js and Prisma make a powerful combination for building modern web applications. In this comprehensive guide, we'll walk through everything you need to know to get started with these technologies.

## What is Next.js?

Next.js is a React framework that provides a lot of features out of the box, including:

- **Server-side rendering (SSR)** for better performance and SEO
- **Static site generation (SSG)** for blazing-fast websites
- **API routes** for building full-stack applications
- **Automatic code splitting** for optimized loading
- **Built-in CSS support** including CSS Modules and Sass

## What is Prisma?

Prisma is a next-generation ORM that makes database access easy with:

- **Type-safe database client** generated from your schema
- **Declarative data modeling** with Prisma Schema Language
- **Visual database browser** with Prisma Studio
- **Powerful migration system** for database schema changes

## Setting Up Your Project

Let's start by creating a new Next.js project and adding Prisma to it.

### Step 1: Create a Next.js Project

\`\`\`bash
npx create-next-app@latest my-blog-app
cd my-blog-app
\`\`\`

### Step 2: Install Prisma

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

### Step 3: Configure Your Database

Update your \`.env\` file with your database connection string:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
\`\`\`

## Creating Your First Model

Define your data models in the \`schema.prisma\` file:

\`\`\`prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
\`\`\`

## Best Practices

When working with Next.js and Prisma, keep these best practices in mind:

1. **Use TypeScript** for better type safety
2. **Implement proper error handling** for database operations
3. **Use connection pooling** for production deployments
4. **Optimize your queries** with Prisma's include and select
5. **Implement proper authentication** and authorization

## Conclusion

Next.js and Prisma provide an excellent foundation for building modern web applications. With their powerful features and developer-friendly APIs, you can focus on building great user experiences while they handle the complex infrastructure concerns.

Happy coding!`,
    published: true,
    createdAt: new Date("2024-01-15"),
    author: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      bio: "Full-stack developer passionate about modern web technologies and best practices.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    readTime: 8,
    tags: ["Next.js", "Prisma", "React", "Database"],
  },
  {
    id: 2,
    title: "The Future of Web Development",
    content: `# The Future of Web Development

The web development landscape is constantly evolving, with new technologies and paradigms emerging regularly. Let's explore what the future holds for web developers and the technologies that will shape our industry.

## Current Trends Shaping the Future

### 1. AI Integration

Artificial Intelligence is becoming increasingly integrated into web development workflows:

- **AI-powered code completion** tools like GitHub Copilot
- **Automated testing** and bug detection
- **Content generation** and personalization
- **Design assistance** and layout optimization

### 2. Edge Computing

Moving computation closer to users for better performance:

- **Edge functions** for serverless computing
- **CDN integration** for global distribution
- **Reduced latency** for better user experience
- **Improved scalability** and reliability

### 3. Web Assembly (WASM)

Bringing near-native performance to web applications:

- **High-performance applications** in the browser
- **Language diversity** beyond JavaScript
- **Complex computations** on the client-side
- **Gaming and multimedia** applications

## Emerging Technologies

### Progressive Web Apps (PWAs)

PWAs continue to bridge the gap between web and native applications:

- **Offline functionality** with service workers
- **Push notifications** for user engagement
- **App-like experience** on mobile devices
- **Installation** without app stores

### WebRTC and Real-time Communication

Real-time features are becoming standard:

- **Video conferencing** built into web apps
- **Live collaboration** tools
- **Real-time data synchronization**
- **Peer-to-peer communication**

## Development Practices

### Component-Driven Development

Building applications with reusable components:

- **Design systems** for consistency
- **Storybook** for component documentation
- **Micro-frontends** for large applications
- **Shared component libraries**

### JAMstack Architecture

JavaScript, APIs, and Markup for modern web apps:

- **Static site generation** for performance
- **Headless CMS** for content management
- **API-first** development approach
- **Global CDN** distribution

## The Developer Experience

The future of web development is also about improving the developer experience:

- **Better tooling** and IDE integration
- **Faster build times** and hot reloading
- **Improved debugging** capabilities
- **Automated deployment** pipelines

## Conclusion

The future of web development is exciting and full of possibilities. As developers, staying curious and continuously learning will be key to thriving in this evolving landscape.

What trends are you most excited about? Let me know in the comments below!`,
    published: true,
    createdAt: new Date("2024-01-12"),
    author: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      bio: "Tech writer and developer advocate with a passion for emerging technologies.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop",
    readTime: 6,
    tags: ["Web Development", "Future Tech", "AI", "Edge Computing"],
  },
  // ... existing posts from your home page
  {
    id: 3,
    title: "Building Responsive UIs with Tailwind CSS",
    content: `# Building Responsive UIs with Tailwind CSS

Tailwind CSS has revolutionized how we approach styling in modern web development. This utility-first framework provides a comprehensive set of classes that make building responsive, beautiful interfaces faster and more maintainable.

## Why Tailwind CSS?

### Utility-First Approach
Instead of writing custom CSS, you compose designs using utility classes:

\`\`\`html
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  <h2 class="text-xl font-bold mb-2">Card Title</h2>
  <p class="text-blue-100">Card content goes here.</p>
</div>
\`\`\`

### Benefits of Utility-First CSS

1. **Faster Development** - No need to think of class names
2. **Consistent Design** - Predefined spacing and color scales
3. **Smaller CSS Bundle** - Only includes used utilities
4. **Easy Maintenance** - Changes are localized to components

## Responsive Design Made Easy

Tailwind's responsive prefixes make it simple to create adaptive layouts:

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Responsive grid that adapts to screen size -->
</div>
\`\`\`

### Breakpoint System

- **sm:** 640px and up
- **md:** 768px and up  
- **lg:** 1024px and up
- **xl:** 1280px and up
- **2xl:** 1536px and up

## Advanced Techniques

### Custom Components with @apply

For repeated patterns, use the @apply directive:

\`\`\`css
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
\`\`\`

### Dark Mode Support

Tailwind makes dark mode implementation straightforward:

\`\`\`html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content that adapts to dark mode
</div>
\`\`\`

## Best Practices

1. **Use the Design System** - Stick to Tailwind's spacing and color scales
2. **Extract Components** - Use @apply for repeated patterns
3. **Customize Thoughtfully** - Extend the default theme when needed
4. **Purge Unused CSS** - Configure PurgeCSS for production builds

## Conclusion

Tailwind CSS empowers developers to build beautiful, responsive interfaces quickly and efficiently. Its utility-first approach might feel different at first, but once you embrace it, you'll find it hard to go back to traditional CSS approaches.

Start small, experiment with the utilities, and gradually build up your Tailwind expertise. Your future self will thank you for the maintainable, consistent designs you create.`,
    published: true,
    createdAt: new Date("2024-01-10"),
    author: {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      bio: "Frontend developer and UI/UX enthusiast focused on creating beautiful user experiences.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    readTime: 5,
    tags: ["CSS", "Tailwind", "Responsive Design", "Frontend"],
  },
];

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

// Simulate API call - replace with actual data fetching
async function getPost(id: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const post = allPosts.find((p) => p.id === parseInt(id));
  if (!post) {
    return null;
  }
  return post;
}

// Get related posts (excluding current post)
function getRelatedPosts(currentPostId: number, limit: number = 3) {
  return allPosts
    .filter((post) => post.id !== currentPostId && post.published)
    .slice(0, limit);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.id);
  const formattedDate = format(new Date(post.createdAt), "MMMM dd, yyyy");
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  // Get author initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Post Header */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <span>/</span>
              <span className="text-foreground">{post.title}</span>
            </nav>

            {/* Post Header */}
            <div className="space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.author.bio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <time dateTime={post.createdAt.toISOString()}>
                    {formattedDate}
                  </time>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                  <span>•</span>
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.thumbnail && (
          <section className="py-8">
            <div className="container mx-auto max-w-4xl">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* Post Content */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {/* Simple markdown-like content rendering */}
              <div
                className="space-y-6"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(
                      /^# (.*$)/gim,
                      '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>'
                    )
                    .replace(
                      /^## (.*$)/gim,
                      '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>'
                    )
                    .replace(
                      /^### (.*$)/gim,
                      '<h3 class="text-xl font-medium mt-4 mb-2">$1</h3>'
                    )
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(
                      /```([\s\S]*?)```/g,
                      '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>'
                    )
                    .replace(
                      /`(.*?)`/g,
                      '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
                    )
                    .replace(/^\- (.*$)/gim, "<li>$1</li>")
                    .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/^(?!<[h|l|p|d])/gm, '<p class="mb-4">')
                    .replace(
                      /(<li>.*<\/li>)/,
                      '<ul class="list-disc list-inside space-y-1 mb-4">$1</ul>'
                    ),
                }}
              />
            </article>
          </div>
        </section>

        {/* Author Bio */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="h-20 w-20 mx-auto sm:mx-0">
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold mb-2">
                      Written by {post.author.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {post.author.bio}
                    </p>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Related Articles
                </h2>
                <p className="text-muted-foreground">
                  Continue reading with these related posts
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/blog">View All Posts</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
