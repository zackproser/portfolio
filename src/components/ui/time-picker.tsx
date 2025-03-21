"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TimePickerDemoProps {
  setTime: (hours: number, minutes: number) => void
  date?: Date
}

export function TimePickerDemo({ setTime, date }: TimePickerDemoProps) {
  const [hours, setHours] = React.useState<number>(date ? date.getHours() : 12)
  const [minutes, setMinutes] = React.useState<number>(date ? date.getMinutes() : 0)

  React.useEffect(() => {
    if (date) {
      setHours(date.getHours())
      setMinutes(date.getMinutes())
    }
  }, [date])

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 23) {
      setHours(value)
      setTime(value, minutes)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value)
      setTime(hours, value)
    }
  }

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Input
          id="hours"
          type="number"
          min={0}
          max={23}
          value={hours}
          onChange={handleHoursChange}
          className="w-16 text-center"
        />
      </div>
      <span className="text-xl">:</span>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Input
          id="minutes"
          type="number"
          min={0}
          max={59}
          value={minutes}
          onChange={handleMinutesChange}
          className="w-16 text-center"
        />
      </div>
    </div>
  )
}

