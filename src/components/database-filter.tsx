"use client"

import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"
import type { Database } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

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

  const toggleDatabase = (id: string, event?: React.MouseEvent) => {
    // If event exists, stop propagation to prevent double firing
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    console.log(`Toggling database: ${id}`);
    console.log(`Current selection: ${selectedDatabases}`);
    
    if (selectedDatabases.includes(id)) {
      const newSelection = selectedDatabases.filter(dbId => dbId !== id);
      console.log(`Removing from selection, new: ${newSelection}`);
      setSelectedDatabases([...newSelection]);
    } else {
      const newSelection = [...selectedDatabases, id];
      console.log(`Adding to selection, new: ${newSelection}`);
      setSelectedDatabases([...newSelection]);
    }
  }

  const filteredDatabases = databasesWithValidIds.filter(database => {
    return database.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const selectAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const allIds = databasesWithValidIds.map(db => db.id);
    console.log(`Selecting all: ${allIds}`);
    setSelectedDatabases([...allIds]);
  }

  const clearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('Clearing all selections');
    setSelectedDatabases([]);
  }

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[300px] justify-between bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600"
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
        <PopoverContent className="w-[300px] p-0 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-lg z-50">
          <div className="bg-white dark:bg-slate-800">
            <div className="border-b border-slate-300 dark:border-slate-600 p-2">
              <input
                placeholder="Search databases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 px-2 py-1 text-sm placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
              />
            </div>
            
            <div className="max-h-[300px] overflow-auto">
              {filteredDatabases.length === 0 && (
                <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No database found.
                </div>
              )}
              
              <div className="flex justify-between p-2 border-b border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={selectAll} 
                  className="text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                  type="button"
                >
                  Select All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll} 
                  className="text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                  type="button"
                >
                  Clear All
                </Button>
              </div>
              
              <div>
                {filteredDatabases.map((database) => (
                  <div
                    key={database.id}
                    className="flex items-center py-2 px-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={(e) => toggleDatabase(database.id, e)}
                  >
                    <div className="flex-shrink-0 mr-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedDatabases.includes(database.id)}
                        className="border-slate-400 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                        onCheckedChange={() => toggleDatabase(database.id)}
                      />
                    </div>
                    <span className="text-slate-900 dark:text-white">{database.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 