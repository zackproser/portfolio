'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PreviewModalProps {
  newsletterId: string
  onClose: () => void
}

export function PreviewModal({ newsletterId, onClose }: PreviewModalProps) {
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    // Load preview in iframe
    setPreviewUrl(`/api/admin/newsletter/${newsletterId}/preview`)
    setLoading(false)
  }, [newsletterId])

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 w-full h-full sm:h-[90vh] sm:max-w-4xl sm:rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Email Preview
            </h2>
            <Button
              onClick={() => window.open(previewUrl, '_blank')}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden relative bg-gray-100 dark:bg-gray-900">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Email preview"
              sandbox="allow-same-origin"
            />
          )}
        </div>

        {/* Footer - Mobile only */}
        <div className="sm:hidden p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => window.open(previewUrl, '_blank')}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Browser
          </Button>
        </div>
      </div>
    </div>
  )
}
