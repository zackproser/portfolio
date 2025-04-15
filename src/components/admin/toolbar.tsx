"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DotsVerticalIcon, PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface ToolbarProps {
  title: string
  onAction?: (actionId: string) => void
  actions?: {
    id: string
    label: string
  }[]
  entity?: string
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  addLabel?: string
  onAdd?: () => void
}

export function Toolbar({
  title,
  onAction,
  actions,
  entity,
  onSearch,
  searchPlaceholder = "Search...",
  addLabel,
  onAdd,
}: ToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm">
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300">{title}</h1>
      <div className="flex items-center gap-2">
        {onSearch && (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full pl-8 bg-white dark:bg-gray-900"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}
        {onAdd && (
          <Button 
            onClick={onAdd}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {addLabel || `Add ${entity || "Item"}`}
          </Button>
        )}
        {actions && actions.length > 0 && onAction && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="bg-white dark:bg-gray-900"
              >
                <DotsVerticalIcon className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => onAction(action.id)}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
} 