"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"
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

  // Debug information
  useEffect(() => {
    console.log(`DatabaseFilter received:`, {
      databasesCount: databases.length,
      selectedCount: selectedDatabases.length,
      databaseNames: databases.map(db => db.name),
      selectedIds: selectedDatabases,
      databaseIds: databases.map(db => db.id)
    });
  }, [databases, selectedDatabases]);

  // Ensure all databases have valid IDs
  const databasesWithValidIds = databases.map(db => {
    if (!db.id) {
      console.warn(`Database ${db.name} has no ID in filter, generating one`);
      return {
        ...db,
        id: db.name.toLowerCase().replace(/\s+/g, '-')
      };
    }
    return db;
  });

  const toggleDatabase = (id: string) => {
    if (selectedDatabases.includes(id)) {
      setSelectedDatabases(selectedDatabases.filter(dbId => dbId !== id))
    } else {
      setSelectedDatabases([...selectedDatabases, id])
    }
  }

  const filteredDatabases = databasesWithValidIds.filter(database => {
    return database.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const selectAll = () => {
    setSelectedDatabases(databasesWithValidIds.map(db => db.id))
  }

  const clearAll = () => {
    setSelectedDatabases([])
  }

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[300px] justify-between"
          >
            <span className="flex items-center gap-2">
              <span>Databases</span>
              <Badge className="ml-2" variant="secondary">
                {selectedDatabases.length}
              </Badge>
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search databases..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No database found.</CommandEmpty>
              <CommandGroup>
                <div className="flex justify-between p-2 border-b">
                  <Button variant="ghost" size="sm" onClick={selectAll}>
                    Select All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
                {filteredDatabases.map((database) => (
                  <CommandItem
                    key={database.id}
                    onSelect={() => toggleDatabase(database.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDatabases.includes(database.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center">
                      <span>{database.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 