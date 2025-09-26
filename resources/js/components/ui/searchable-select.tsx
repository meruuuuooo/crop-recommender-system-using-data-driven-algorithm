import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface SearchableSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
  loading?: boolean
  emptyMessage?: string
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  clearable = false,
  loading = false,
  emptyMessage = "No results found.",
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  const selectedOption = options.find((option) => option.value === value)

  // Reset highlighted index when options change
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions])

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue)
    setOpen(false)
    setSearch("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange?.("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          handleSelect(filteredOptions[highlightedIndex].value)
        }
        break
      case "Escape":
        setOpen(false)
        setSearch("")
        break
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-[#005a23] bg-transparent px-3 py-2 text-sm shadow-xs transition-colors",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#98d26f] focus:ring-opacity-20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "text-[#619154] placeholder:text-[#619154]",
            className
          )}
          disabled={disabled || loading}
          type="button"
        >
          <span className={cn("truncate", !selectedOption && "text-[#619154] opacity-70")}>
            {loading ? "Loading..." : selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {clearable && selectedOption && !disabled && (
              <XIcon
                className="h-4 w-4 opacity-50 hover:opacity-70"
                onClick={handleClear}
              />
            )}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </div>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "z-50 min-w-[var(--radix-popover-trigger-width)] rounded-md border bg-white p-1 shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
          align="start"
          sideOffset={4}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center border-b border-gray-200 px-3 pb-2">
            <SearchIcon className="mr-2 h-4 w-4 opacity-50" />
            <Input
              className="border-0 p-0 placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-2 px-2 text-sm text-gray-500">{emptyMessage}</div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center rounded-sm py-2 px-2 text-sm text-[#619154]",
                    "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                    "disabled:pointer-events-none disabled:opacity-50",
                    index === highlightedIndex && "bg-gray-100"
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="flex-1 truncate text-left">{option.label}</span>
                  {value === option.value && (
                    <CheckIcon className="ml-2 h-4 w-4" />
                  )}
                </button>
              ))
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export type { SearchableSelectOption, SearchableSelectProps }
