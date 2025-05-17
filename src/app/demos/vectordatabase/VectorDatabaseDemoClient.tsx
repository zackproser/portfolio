'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

// Reuse the visualizer from the embeddings demo
const VectorSpaceVisualizer = dynamic(
  () => import('../embeddings/components/VectorSpaceVisualizer'),
  { ssr: false }
)

function generateNamespace() {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let name = ''
  for (let i = 0; i < 8; i++) {
    name += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${name}-${Date.now()}`
}

function getRandomVector(dim: number = 20) {
  return Array.from({ length: dim }, () => Math.random() * 2 - 1)
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dot / (magA * magB)
}

export default function VectorDatabaseDemoClient() {
  const [expanded, setExpanded] = useState<number>(0)
  const [namespace] = useState(generateNamespace())
  const samplePhrases = [
    'The quick brown fox jumps over the lazy dog',
    'To be or not to be, that is the question',
    'All that glitters is not gold'
  ]
  const [selected, setSelected] = useState<string[]>([])
  const [metadata, setMetadata] = useState<{[k:string]:string}>({})
  const [keyField, setKeyField] = useState('')
  const [valueField, setValueField] = useState('')
  const [embeddings, setEmbeddings] = useState<{[text:string]: number[]}>({})
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{text:string, score:number}[]>([])
  const [queryEmbedding, setQueryEmbedding] = useState<number[]>()

  const togglePhrase = (text: string) => {
    setSelected(sel => sel.includes(text) ? sel.filter(t => t!==text) : [...sel, text])
  }

  const handleGenerate = () => {
    const newEmbeds = { ...embeddings }
    selected.forEach(t => {
      if (!newEmbeds[t]) newEmbeds[t] = getRandomVector(20)
    })
    setEmbeddings(newEmbeds)
    setExpanded(3)
  }

  const handleAddMetadata = () => {
    if (keyField && valueField) {
      setMetadata(m => ({ ...m, [keyField]: valueField }))
      setKeyField('')
      setValueField('')
    }
  }

  const handleSearch = () => {
    const qVec = getRandomVector(20)
    setQueryEmbedding(qVec)
    const res = Object.entries(embeddings).map(([text, vec]) => ({
      text,
      score: cosineSimilarity(qVec, vec)
    })).sort((a,b) => b.score - a.score)
    setResults(res)
    setExpanded(4)
  }

  const handleReset = () => {
    setSelected([])
    setMetadata({})
    setEmbeddings({})
    setQuery('')
    setResults([])
    setQueryEmbedding(undefined)
    setExpanded(0)
  }

  const sections = [
    {
      title: 'Step 1: Create an Index',
      content: (
        <div className="p-4 text-zinc-700 dark:text-zinc-300">
          <p className="mb-4">Indexes organize and make vectors searchable. This demo uses a pre-created index named <strong>vector-database-demo</strong>.</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setExpanded(1)}>Next: Create Namespace</button>
        </div>
      )
    },
    {
      title: 'Step 2: Create a Namespace',
      content: (
        <div className="p-4 text-zinc-700 dark:text-zinc-300">
          <p className="mb-4">Namespaces act like partitions within an index. For this session your namespace is:</p>
          <input className="w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded" value={namespace} readOnly />
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setExpanded(2)}>Next: Upsert Vectors</button>
        </div>
      )
    },
    {
      title: 'Step 3: Upsert Vectors with Metadata',
      content: (
        <div className="p-4 space-y-4 text-zinc-700 dark:text-zinc-300">
          <p>Select phrases to embed and upsert.</p>
          {samplePhrases.map(text => (
            <div key={text} className={`cursor-pointer p-2 rounded border ${selected.includes(text) ? 'bg-blue-600 text-white' : 'border-zinc-300'}`} onClick={() => togglePhrase(text)}>
              {text}
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input placeholder="key" className="p-1 border rounded" value={keyField} onChange={e=>setKeyField(e.target.value)} />
            <input placeholder="value" className="p-1 border rounded" value={valueField} onChange={e=>setValueField(e.target.value)} />
            <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={handleAddMetadata}>Add</button>
          </div>
          {Object.keys(metadata).length>0 && (
            <pre className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded text-xs">{JSON.stringify(metadata,null,2)}</pre>
          )}
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={selected.length===0} onClick={handleGenerate}>Generate Embeddings & Upsert</button>
        </div>
      )
    },
    {
      title: 'Step 4: Perform a Query',
      content: (
        <div className="p-4 space-y-4 text-zinc-700 dark:text-zinc-300">
          <input value={query} onChange={e=>setQuery(e.target.value)} className="w-full p-2 border rounded" placeholder="Search phrase" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={!query || Object.keys(embeddings).length===0} onClick={handleSearch}>Search</button>
          {results.length>0 && (
            <div className="mt-4 space-y-2">
              {results.map(r=> (
                <div key={r.text} className="flex justify-between border-b pb-1">
                  <span>{r.text}</span>
                  <span className="text-sm text-zinc-500">{(r.score*100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Step 5: Visualize Vector Space',
      content: (
        <div className="p-4">
          <VectorSpaceVisualizer embeddings={embeddings} currentEmbedding={queryEmbedding} currentLabel={query} />
        </div>
      )
    },
    {
      title: 'Step 6: Clean Up',
      content: (
        <div className="p-4 text-zinc-700 dark:text-zinc-300">
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleReset}>Reset Demo</button>
        </div>
      )
    }
  ]

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-700">
      {sections.map((section, idx) => (
        <div key={idx}>
          <button className="w-full flex justify-between items-center p-4" onClick={() => setExpanded(expanded===idx ? -1 : idx)}>
            <span className="font-medium text-left">{section.title}</span>
            {expanded===idx ? <FiChevronDown /> : <FiChevronRight />}
          </button>
          {expanded===idx && <div className="border-t border-zinc-200 dark:border-zinc-700">{section.content}</div>}
        </div>
      ))}
    </div>
  )
}
