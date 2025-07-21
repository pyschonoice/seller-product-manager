import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-muted animate-pulse" />

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />

          <div className="flex items-center justify-between pt-2">
            <div className="h-6 bg-muted rounded w-16 animate-pulse" />
            <div className="h-6 bg-muted rounded w-20 animate-pulse" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="h-4 bg-muted rounded w-16 animate-pulse" />
          <div className="h-4 bg-muted rounded w-12 animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  )
}
