"use client"

import { useEffect, useCallback } from "react"
import { useProductStore } from "@/store/product-store"
import type { ProductsResponse } from "@/types/product"

const API_BASE_URL = "https://dummyjson.com/products"
const PRODUCTS_PER_PAGE = 20

export function useProducts() {
  const {
    products,
    loading,
    hasMore,
    setProducts,
    addProducts,
    setLoading,
    setHasMore,
    setCategories,
    loadLocalProducts,
  } = useProductStore()

  const fetchProducts = useCallback(
    async (skip = 0, reset = false) => {
      if (loading) return

      setLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}?limit=${PRODUCTS_PER_PAGE}&skip=${skip}`)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data: ProductsResponse = await response.json()

        if (reset) {
          setProducts(data.products)
        } else {
          addProducts(data.products)
        }

        // Check if we have more products to load
        setHasMore(skip + data.products.length < data.total)

        // Extract unique categories from all products
        const existingCategories = reset ? [] : useProductStore.getState().categories
        const newCategories = [...new Set([...existingCategories, ...data.products.map((p) => p.category)])]
        setCategories(newCategories)
      } catch (error) {
        console.error("Error fetching products:", error)
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    },
    [loading, setProducts, addProducts, setLoading, setHasMore, setCategories],
  )

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(products.length)
    }
  }, [fetchProducts, loading, hasMore, products.length])

  const refresh = useCallback(() => {
    fetchProducts(0, true)
  }, [fetchProducts])

  useEffect(() => {
    // Load local products first
    loadLocalProducts()

    // Then fetch API products if we don't have any
    if (products.length === 0) {
      fetchProducts(0, true)
    }
  }, [])

  return {
    loadMore,
    refresh,
    loading,
    hasMore,
  }
}
