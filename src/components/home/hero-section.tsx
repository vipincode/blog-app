import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              BlogApp
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing stories, insights, and ideas from our community of
            writers. Join us to share your own thoughts and connect with
            like-minded readers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/blog">Explore Posts</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/sign-up">Start Writing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
