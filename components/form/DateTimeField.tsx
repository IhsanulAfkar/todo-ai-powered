"use client"

import { Controller, Control } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface Props {
  name: string
  label: string
  control: Control<any>
}

export const DateTimeField = ({ name, label, control }: Props) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value = field.value ? new Date(field.value) : null

          const handleDateChange = (date: Date | undefined) => {
            if (!date) return

            const newDate = value ?? new Date()
            newDate.setFullYear(date.getFullYear())
            newDate.setMonth(date.getMonth())
            newDate.setDate(date.getDate())

            field.onChange(newDate)
          }

          const handleTimeChange = (time: string) => {
            const [hours, minutes] = time.split(":").map(Number)

            const newDate = value ?? new Date()
            newDate.setHours(hours)
            newDate.setMinutes(minutes)

            field.onChange(newDate)
          }

          return (
            <div className="flex gap-2">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Time Picker */}
              <input
                type="time"
                className="border rounded-md px-3 py-2 text-sm"
                value={
                  value
                    ? `${String(value.getHours()).padStart(2, "0")}:${String(
                      value.getMinutes()
                    ).padStart(2, "0")}`
                    : ""
                }
                onChange={(e) => handleTimeChange(e.target.value)}
              />
            </div>
          )
        }}
      />
    </div>
  )
}