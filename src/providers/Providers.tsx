import { Toaster } from "sonner"

import { ThemeProvider } from "@/providers/ThemeProvider"

import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <TooltipProvider delay={150}>{children}</TooltipProvider>
      <Toaster richColors position="bottom-right" closeButton />
    </ThemeProvider>
  )
}
