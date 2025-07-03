import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ImpactLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <header className="text-center space-y-4 animate-fade-in">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </header>
      
      <section className="mt-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="text-center p-6">
              <CardContent className="p-0 space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="mt-20">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}