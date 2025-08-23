import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-md text-center space-y-6">
          <div className="text-6xl">📝</div>
          <h1 className="text-3xl font-bold tracking-tight">Post Not Found</h1>
          <p className="text-muted-foreground">
            The blog post you&nbsp;re looking for doesn&nbsp;t exist or may have
            been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/blog">Browse All Posts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
