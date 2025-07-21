import type { Product } from "@/types/product"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.thumbnail || "/placeholder.png"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {product.isNew && <Badge className="absolute right-2 top-2 bg-green-500 hover:bg-green-600">New</Badge>}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-2 font-semibold text-sm leading-tight">{product.title}</h3>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
          <span>Stock: {product.stock}</span>
          {product.rating > 0 && <span className="flex items-center gap-1">⭐ {product.rating.toFixed(1)}</span>}
        </div>
      </CardFooter>
    </Card>
  )
}
