import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="py-12 bg-muted/30">
          <div className="container max-w-4xl">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center space-x-2 mb-8">
              <Skeleton className="h-4 w-12" />
              <span>/</span>
              <Skeleton className="h-4 w-16" />
              <span>/</span>
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-6">
              {/* Tags Skeleton */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </div>

              {/* Meta Information Skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-18" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image Skeleton */}
        <section className="py-8">
          <div className="container max-w-4xl">
            <Skeleton className="aspect-video rounded-xl" />
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="py-4">
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
