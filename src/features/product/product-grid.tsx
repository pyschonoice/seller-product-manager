"use client"

import { useProductStore } from "@/store/product-store"
import { useProducts } from "@/hooks/use-products"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { ProductCard } from "./product-card"
import { LoadingSkeleton } from "./loading-skeleton"
import { useEffect } from "react"

export function ProductGrid() {
  const { getFilteredProducts, loading } = useProductStore()
  const { loadMore, hasMore } = useProducts()
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  })

  const products = getFilteredProducts()

  // Load more products when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore()
    }
  }, [isIntersecting, hasMore, loading, loadMore])

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={`${product.id}-${product.isNew ? "local" : "api"}`} product={product} />
        ))}

        {/* Loading Skeletons */}
        {loading && <LoadingSkeleton count={10} />}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && !loading && products.length > 0 && (
        <div ref={targetRef} className="h-20 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Loading more products...
          </div>
        </div>
      )}

      {/* No More Products */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No more products to load</p>
        </div>
      )}

      {/* No Products Found */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </div>
      )}

      {/* Initial Loading State */}
      {products.length === 0 && loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <LoadingSkeleton count={10} />
        </div>
      )}
    </div>
  )
}
