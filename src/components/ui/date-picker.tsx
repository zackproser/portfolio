"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerDemo } from "./time-picker"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  showTimePicker?: boolean
}

export function DatePicker({ date, setDate, showTimePicker = false }: DatePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    setSelectedDateTime(date)
  }, [date])

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // If we already have a date with time, preserve the time
      if (selectedDateTime) {
        selectedDate.setHours(selectedDateTime.getHours())
        selectedDate.setMinutes(selectedDateTime.getMinutes())
      }
      setSelectedDateTime(selectedDate)
      setDate(selectedDate)
    }
  }

  const handleTimeChange = (hours: number, minutes: number) => {
    if (selectedDateTime) {
      const newDateTime = new Date(selectedDateTime)
      newDateTime.setHours(hours)
      newDateTime.setMinutes(minutes)
      setSelectedDateTime(newDateTime)
      setDate(newDateTime)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, showTimePicker ? "PPP p" : "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selectedDateTime} onSelect={handleSelect} initialFocus />
        {showTimePicker && selectedDateTime && (
          <div className="p-3 border-t">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Time</span>
            </div>
            <TimePickerDemo setTime={(hours, minutes) => handleTimeChange(hours, minutes)} date={selectedDateTime} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

