'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Tool } from '@/lib/decision-engine/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ComparePicker({ tools }: { tools: Tool[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selected1, setSelected1] = useState<string>('')
  const [selected2, setSelected2] = useState<string>('')

  const filtered = useMemo(() => {
    if (!query) return tools
    const q = query.toLowerCase()
    return tools.filter(t => t.name.toLowerCase().includes(q))
  }, [tools, query])

  const canCompare = selected1 && selected2 && selected1 !== selected2

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="mb-3">
        <Input
          placeholder="Search tools to compare..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          className="border rounded-md p-2"
          value={selected1}
          onChange={(e) => setSelected1(e.target.value)}
        >
          <option value="">Select tool 1</option>
          {filtered.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select
          className="border rounded-md p-2"
          value={selected2}
          onChange={(e) => setSelected2(e.target.value)}
        >
          <option value="">Select tool 2</option>
          {filtered.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <Button
          disabled={!canCompare}
          onClick={() => {
            if (!canCompare) return
            const [a, b] = [selected1, selected2].sort()
            router.push(`/comparisons/${a}/vs/${b}`)
          }}
        >
          Compare
        </Button>
      </div>
    </div>
  )
}



