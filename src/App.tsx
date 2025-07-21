import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { ProductsPage } from "@/pages/products-page"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="seller-product-manager-theme">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <ProductsPage />
        </main>
        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  )
}

export default App
