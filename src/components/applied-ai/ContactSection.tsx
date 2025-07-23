'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Linkedin, Calendar, Download, MessageCircle, Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ContactMethod {
  type: 'email' | 'linkedin' | 'calendar' | 'phone'
  value: string
  label: string
  primary?: boolean
}

interface Downloadable {
  title: string
  description: string
  url: string
  type: 'pdf' | 'link'
}

interface ContactSectionProps {
  headline: string
  description: string
  contactMethods: ContactMethod[]
  downloadables: Downloadable[]
}

const ContactMethodCard = ({ method, index }: { method: ContactMethod; index: number }) => {
  const ref = useRef<HTMLDivElement>(null)

  const getIcon = () => {
    switch (method.type) {
      case 'email':
        return <Mail className="w-6 h-6" />
      case 'linkedin':
        return <Linkedin className="w-6 h-6" />
      case 'calendar':
        return <Calendar className="w-6 h-6" />
      case 'phone':
        return <Phone className="w-6 h-6" />
      default:
        return <MessageCircle className="w-6 h-6" />
    }
  }

  const getHref = () => {
    switch (method.type) {
      case 'email':
        return `mailto:${method.value}`
      case 'linkedin':
        return method.value
      case 'calendar':
        return method.value
      case 'phone':
        return `tel:${method.value}`
      default:
        return method.value
    }
  }

  const getColorClasses = () => {
    if (method.type === 'linkedin' || method.type === 'calendar') {
      return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    }
    if (method.primary) {
      return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    }
    return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700';
  }

  return (
    <div ref={ref}>
      <Card className={`transition-all duration-300 hover:shadow-lg ${method.primary ? 'ring-2 ring-blue-500' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              method.primary 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {getIcon()}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {method.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {method.type === 'email' ? method.value : 'Click to connect'}
              </p>
            </div>
            
            <Button 
              asChild 
              className={getColorClasses()}
              size="sm"
            >
              <Link href={getHref() as any} target="_blank" rel="noopener noreferrer">
                Connect
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const DownloadableCard = ({ item, index }: { item: Downloadable; index: number }) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref}>
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {item.type === 'pdf' ? (
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            {item.title}
          </CardTitle>
          <CardDescription>
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={item.url as any} target="_blank" rel="noopener noreferrer">
              {item.type === 'pdf' ? (
                <Download className="w-4 h-4 mr-2" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              {item.type === 'pdf' ? 'Download PDF' : 'View Profile'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const defaultContactData = {
  headline: "Ready to Discuss Applied AI Opportunities?",
  description: "I'm currently exploring Applied AI engineering roles where I can help enterprises adopt frontier AI systems safely and effectively.",
  contactMethods: [
    { type: 'email' as const, value: 'zackproser@gmail.com', label: 'Email Me', primary: true },
    { type: 'linkedin' as const, value: 'https://linkedin.com/in/zackproser', label: 'Connect on LinkedIn' },
    { type: 'calendar' as const, value: 'https://calendly.com/zackproser', label: 'Schedule a Call' }
  ],
  downloadables: [
    { title: 'GitHub Portfolio', description: 'Open source projects and contributions', url: 'https://github.com/zackproser', type: 'link' as const }
  ]
}

export function ContactSection({ 
  headline = defaultContactData.headline,
  description = defaultContactData.description,
  contactMethods = defaultContactData.contactMethods,
  downloadables = defaultContactData.downloadables
}: Partial<ContactSectionProps>) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {headline}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h3>
            
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <ContactMethodCard key={index} method={method} index={index} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Resources
            </h3>
            
            <div className="space-y-4">
              {downloadables.map((item, index) => (
                <DownloadableCard key={index} item={item} index={index} />
              ))}
            </div>
            
            <div className="mt-8">
              {/* Availability badges removed as requested */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 