"use client"

import { useState } from "react"
import { ProductFilters } from "@/features/product/product-filters"
import { ProductGrid } from "@/features/product/product-grid"
import { AddProductModal } from "@/features/product/add-product-modal"

export function ProductsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <ProductFilters onAddProduct={() => setIsAddModalOpen(true)} />
      <ProductGrid />

      <AddProductModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  )
}
