import { Toaster } from "sonner"

import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TooltipProvider delay={150}>{children}</TooltipProvider>
      <Toaster theme="dark" richColors position="bottom-right" closeButton />
    </>
  )
}
