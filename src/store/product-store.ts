import { create } from "zustand";
import type {
  Product,
  LocalProduct,
  SortOption,
  MultipleSortOptions,
  SortField,
} from "@/types/product";
import { saveProductsToStorage, loadProductsFromStorage } from "@/lib/storage";

interface ProductStore {
  // State
  products: Product[];
  localProducts: LocalProduct[];
  loading: boolean;
  hasMore: boolean;
  searchTerm: string;
  selectedCategory: string;
  sortOptions: MultipleSortOptions;
  categories: string[];

  // Actions
  setProducts: (products: Product[]) => void;
  addProducts: (products: Product[]) => void;
  addLocalProduct: (product: LocalProduct) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortOptions: (options: MultipleSortOptions) => void;
  addSortOption: (option: SortOption) => void;
  removeSortOption: (field: SortField) => void;
  clearSortOptions: () => void;
  setCategories: (categories: string[]) => void;
  loadLocalProducts: () => Promise<void>;

  // Computed
  getAllProducts: () => Product[];
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  localProducts: [],
  loading: false,
  hasMore: true,
  searchTerm: "",
  selectedCategory: "",
  sortOptions: [],
  categories: [],

  // Actions
  setProducts: (products) => set({ products }),

  addProducts: (newProducts) =>
    set((state) => ({
      products: [...state.products, ...newProducts],
    })),

  addLocalProduct: async (product) => {
    const { localProducts, categories } = get();
    const newLocalProducts = [product, ...localProducts];
    const newCategories = [...new Set([...categories, product.category])];

    set({
      localProducts: newLocalProducts,
      categories: newCategories,
    });
    await saveProductsToStorage(newLocalProducts);
  },

  setLoading: (loading) => set({ loading }),
  setHasMore: (hasMore) => set({ hasMore }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSortOptions: (sortOptions) => set({ sortOptions }),

  addSortOption: (option) => {
    const currentOptions = get().sortOptions;
    const existingIndex = currentOptions.findIndex(
      (opt) => opt.field === option.field
    );

    if (existingIndex >= 0) {
      // Update existing sort option
      const newOptions = [...currentOptions];
      newOptions[existingIndex] = option;
      set({ sortOptions: newOptions });
    } else {
      // Add new sort option
      set({ sortOptions: [...currentOptions, option] });
    }
  },

  removeSortOption: (field) => {
    set((state) => ({
      sortOptions: state.sortOptions.filter((opt) => opt.field !== field),
    }));
  },

  clearSortOptions: () => set({ sortOptions: [] }),
  setCategories: (categories) => set({ categories }),

  loadLocalProducts: async () => {
    const localProducts = await loadProductsFromStorage();
    set({ localProducts });
  },

  // Computed getters
  getAllProducts: () => {
    const { products, localProducts } = get();
    return [...localProducts, ...products];
  },

  getFilteredProducts: () => {
    const { searchTerm, selectedCategory, sortOptions } = get();
    let filtered = get().getAllProducts();

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply multiple sorts
    if (sortOptions.length > 0) {
      filtered.sort((a, b) => {
        for (const sortOption of sortOptions) {
          let comparison = 0;

          switch (sortOption.field) {
            case "price":
              comparison = a.price - b.price;
              break;
            case "name":
              comparison = a.title.localeCompare(b.title);
              break;
            case "stock":
              comparison = a.stock - b.stock;
              break;
            case "rating":
              comparison = (a.rating || 0) - (b.rating || 0);
              break;
          }

          if (sortOption.direction === "desc") {
            comparison = -comparison;
          }

          if (comparison !== 0) {
            return comparison;
          }
        }
        return 0;
      });
    }

    return filtered;
  },
}));
