"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import type { Database } from "@/types/database"
import { Badge } from "@/components/ui/badge"

interface DatabaseFilterProps {
  databases: Database[]
  selectedDatabases: string[]
  setSelectedDatabases: (ids: string[]) => void
}

export function DatabaseFilter({ databases, selectedDatabases, setSelectedDatabases }: DatabaseFilterProps) {
  const [open, setOpen] = useState(false)

  const toggleDatabase = (id: string) => {
    if (selectedDatabases.includes(id)) {
      setSelectedDatabases(selectedDatabases.filter((dbId) => dbId !== id))
    } else {
      setSelectedDatabases([...selectedDatabases, id])
    }
  }

  const selectAll = () => {
    setSelectedDatabases(databases.map((db) => db.id))
  }

  const clearAll = () => {
    setSelectedDatabases([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedDatabases.map((id) => {
          const db = databases.find((db) => db.id === id)
          return (
            <Badge key={id} variant="secondary" className="flex items-center gap-1">
              {db?.name}
              <button onClick={() => toggleDatabase(id)} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )
        })}
      </div>

      <div className="flex gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
              Select databases
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search database..." />
              <CommandList>
                <CommandEmpty>No database found.</CommandEmpty>
                <CommandGroup>
                  {databases.map((db) => (
                    <CommandItem
                      key={db.id}
                      value={db.id}
                      onSelect={() => {
                        toggleDatabase(db.id)
                        setOpen(true)
                      }}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedDatabases.includes(db.id) ? "opacity-100" : "opacity-0")}
                      />
                      {db.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={selectAll}>
          Select All
        </Button>

        <Button variant="outline" onClick={clearAll}>
          Clear All
        </Button>
      </div>
    </div>
  )
} 