"use client"

import { ArrowUpDown, X, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useProductStore } from "@/store/product-store"
import type { SortField, SortDirection } from "@/types/product"
import { cn } from "@/lib/utils"

const sortFields: { field: SortField; label: string }[] = [
  { field: "price", label: "Price" },
  { field: "name", label: "Name" },
  { field: "stock", label: "Stock" },
  { field: "rating", label: "Rating" },
]

export function MultiSortPopover() {
  const { sortOptions, addSortOption, removeSortOption, clearSortOptions } = useProductStore()

  const hasActiveSorting = sortOptions.length > 0

  const handleAddSort = (field: SortField, direction: SortDirection) => {
    const label = `${sortFields.find((f) => f.field === field)?.label} ${direction === "asc" ? "↑" : "↓"}`
    addSortOption({ field, direction, label })
  }

  const toggleSortDirection = (field: SortField) => {
    const existingSort = sortOptions.find((opt) => opt.field === field)
    if (existingSort) {
      const newDirection = existingSort.direction === "asc" ? "desc" : "asc"
      handleAddSort(field, newDirection)
    }
  }

  const getSortLabel = () => {
    if (sortOptions.length === 0) return "Sort"
    if (sortOptions.length === 1) return sortOptions[0].label
    return `${sortOptions.length} sorts`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex items-center gap-2 min-w-[120px] justify-between", hasActiveSorting && "border-primary")}
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="truncate">{getSortLabel()}</span>
          </div>
          {hasActiveSorting && <div className="h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Sort Products</h4>
            {hasActiveSorting && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSortOptions}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Active Sorts */}
          {sortOptions.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-medium text-muted-foreground mb-2">Active Sorts</div>
              <div className="flex flex-wrap gap-1">
                {sortOptions.map((sort, index) => (
                  <Badge key={`${sort.field}-${index}`} variant="secondary" className="flex items-center gap-1 text-xs">
                    <span>{index + 1}.</span>
                    <span>{sort.label}</span>
                    <button
                      onClick={() => toggleSortDirection(sort.field)}
                      className="ml-1 hover:bg-accent rounded p-0.5"
                    >
                      {sort.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => removeSortOption(sort.field)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-3" />

          {/* Add New Sort */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Add Sort Criteria</div>
            {sortFields.map((field) => {
              const isActive = sortOptions.some((opt) => opt.field === field.field)
              return (
                <div key={field.field} className="flex items-center justify-between">
                  <span className="text-sm">{field.label}</span>
                  <div className="flex gap-1">
                    
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleAddSort(field.field, "asc")}
                      className="h-7 px-2 text-xs"
                      disabled={isActive && sortOptions.find((opt) => opt.field === field.field)?.direction === "asc"}
                    >
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Asc
                    </Button>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleAddSort(field.field, "desc")}
                      className="h-7 px-2 text-xs"
                      disabled={isActive && sortOptions.find((opt) => opt.field === field.field)?.direction === "desc"}
                    >
                      <ArrowDown className="h-3 w-3 mr-1" />
                      Desc
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {hasActiveSorting && (
            <>
              <Separator className="my-3" />
              <Button variant="outline" size="sm" onClick={clearSortOptions} className="w-full text-xs bg-transparent">
                <X className="h-3 w-3 mr-1" />
                Clear All Sorts
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
