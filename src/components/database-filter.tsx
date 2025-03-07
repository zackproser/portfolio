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
  const [searchTerm, setSearchTerm] = useState("")

  const toggleDatabase = (id: string) => {
    if (selectedDatabases.includes(id)) {
      setSelectedDatabases(selectedDatabases.filter((dbId) => dbId !== id))
    } else {
      // Prevent adding duplicates
      if (!selectedDatabases.includes(id)) {
        setSelectedDatabases([...selectedDatabases, id])
      }
    }
    setOpen(false) // Close popover after selection
  }

  const selectAll = () => {
    // Get unique database IDs
    const uniqueIds = Array.from(new Set(databases.map((db) => db.id)))
    setSelectedDatabases(uniqueIds)
  }

  const clearAll = () => {
    setSelectedDatabases([])
  }

  // Filter out databases that are already selected from the dropdown
  const availableDatabases = databases.filter(
    (db) => !selectedDatabases.includes(db.id)
  )

  // Get unique selected databases
  const uniqueSelectedDatabases = Array.from(new Set(selectedDatabases))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border rounded-md">
        {uniqueSelectedDatabases.map((id) => {
          const db = databases.find((db) => db.id === id)
          if (!db) return null // Skip if database not found
          return (
            <div key={`selected-${db.id}`} className="flex items-center">
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900"
              >
                {db.name}
                <button
                  onClick={() => toggleDatabase(id)}
                  className="ml-2 hover:text-destructive focus:outline-none"
                  aria-label={`Remove ${db.name}`}
                >
                  ×
                </button>
              </Badge>
            </div>
          )
        })}
      </div>

      <div className="flex gap-4 flex-wrap">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={open} 
              className="justify-between min-w-[200px]"
              disabled={availableDatabases.length === 0}
            >
              {availableDatabases.length > 0 ? "Select databases" : "All databases selected"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="Search database..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No database found.</CommandEmpty>
                <CommandGroup>
                  {availableDatabases
                    .filter(db => 
                      db.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((db) => (
                      <CommandItem
                        key={db.id}
                        value={db.id}
                        onSelect={() => toggleDatabase(db.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedDatabases.includes(db.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {db.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button 
          variant="outline" 
          onClick={selectAll}
          disabled={selectedDatabases.length === databases.length}
        >
          Select All
        </Button>

        <Button 
          variant="outline" 
          onClick={clearAll}
          disabled={selectedDatabases.length === 0}
        >
          Clear All
        </Button>
      </div>
    </div>
  )
} 