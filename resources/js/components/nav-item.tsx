import type React from "react"
import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"

interface NavItemProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
  className?: string
  external?: boolean
}

export function NavItem({ href, children, isActive = false, className, external = false }: NavItemProps) {
  const baseClasses =
    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

  const stateClasses = isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"

  const combinedClasses = cn(baseClasses, stateClasses, className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={combinedClasses}>
      {children}
    </Link>
  )
}
