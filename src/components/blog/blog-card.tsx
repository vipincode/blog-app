"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date;
  author: {
    id: number;
    name: string;
    email: string;
  };
  thumbnail?: string;
  readTime?: number;
}

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  // Create summary from content (first 150 characters)
  const summary =
    post.content.length > 150
      ? post.content.substring(0, 150) + "..."
      : post.content;

  // Get author initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      <Link href={`/blog/${post.id}`} className="block">
        {/* Thumbnail Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-xl">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <div className="text-4xl font-bold text-muted-foreground">
                {post.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={post.published ? "default" : "secondary"}>
              {post.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
            {post.readTime && <span>{post.readTime} min read</span>}
          </div>

          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>

          <CardDescription className="line-clamp-3">{summary}</CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            {/* Author Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author.name}`}
                />
                <AvatarFallback className="text-xs">
                  {getInitials(post.author.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {post.author.name}
                </p>
              </div>
            </div>

            {/* Read More Button */}
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Read more →
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
