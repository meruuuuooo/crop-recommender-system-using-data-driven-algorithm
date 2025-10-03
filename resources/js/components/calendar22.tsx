"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar22() {
  const [open, setOpen] = React.useState(false)
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="start-date" className="px-1">
        Start Date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="start-date"
            name="start-date"
            className="w-48 justify-between font-normal"
          >
            {startDate ? startDate.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      <Label htmlFor="end-date" className="px-1">
        End Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            id="end-date"
            name="end-date"
            className="w-48 justify-between font-normal"
            >
            {endDate ? endDate.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
