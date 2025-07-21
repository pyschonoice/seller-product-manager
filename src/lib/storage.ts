import type { LocalProduct } from "@/types/product"

const STORAGE_KEY = "seller-products"

export const saveProductsToStorage = (products: LocalProduct[]) => {
  try {
    // Convert the array to a JSON string before saving
    const productsJson = JSON.stringify(products)
    localStorage.setItem(STORAGE_KEY, productsJson)
  } catch (error) {
    console.error("Failed to save products to storage:", error)
  }
}

export const loadProductsFromStorage = (): LocalProduct[] => {
  try {
    const productsJson = localStorage.getItem(STORAGE_KEY)
    
    // If no data exists, return an empty array
    if (productsJson === null) {
      return []
    }
    
    // Parse the JSON string back into a JavaScript array
    return JSON.parse(productsJson)
  } catch (error) {
    console.error("Failed to load products from storage:", error)
    return []
  }
}