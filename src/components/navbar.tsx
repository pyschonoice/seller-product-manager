import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">Seller Product Manager</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
