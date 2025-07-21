export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  isNew?: boolean // For locally added products
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface LocalProduct {
  id: number
  title: string
  price: number
  category: string
  thumbnail: string
  stock: number
  isNew: true
  description: string
  discountPercentage: 0
  rating: 0
  brand: string
  images: string[]
}

export type SortField = "price" | "name" | "stock" | "rating"
export type SortDirection = "asc" | "desc"

export interface SortOption {
  field: SortField
  direction: SortDirection
  label: string
}

export type MultipleSortOptions = SortOption[]
