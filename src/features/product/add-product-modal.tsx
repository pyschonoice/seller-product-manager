"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProductStore } from "@/store/product-store"
import type { LocalProduct } from "@/types/product"
import { generateId } from "@/lib/utils"

const addProductSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
})

type AddProductForm = z.infer<typeof addProductSchema>

interface AddProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null);
  const { addLocalProduct } = useProductStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      price: 0,
      category: "",
      stock: 0,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageError(null);
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: AddProductForm) => {
    if (!imageFile) {
      setImageError("Product image is required");
      return; 
    }
    try {
      const newProduct: LocalProduct = {
        id: generateId(),
        title: data.title,
        price: data.price,
        category: data.category,
        stock: data.stock,
        thumbnail: imagePreview || "/placeholder.png?height=200&width=200",
        isNew: true,
        description: `New product: ${data.title}`,
        discountPercentage: 0,
        rating: 0,
        brand: "Local",
        images: [imagePreview || "/placeholder.png?height=200&width=200"],
      }

      await addLocalProduct(newProduct)

      toast.success("Product added successfully!")

      // Reset form and close modal
      reset()
      setImagePreview("")
      setImageFile(null)
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to add product")
      console.error("Error adding product:", error)
    }
  }

  const handleClose = () => {
    reset()
    setImagePreview("")
    setImageFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Add a new product to your inventory. Fill in all the required fields.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} placeholder="Enter product title" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} placeholder="0" />
              {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input id="category" {...register("category")} placeholder="Enter product category" />
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange}  />
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
            {imagePreview && (
              <div className="mt-2 flex items-center justify-center">
                <img
                  src={imagePreview || "/placeholder.png"}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-md border"
                />
                
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
