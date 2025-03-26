"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LinkDropZone from "./link-drop-zone"
import LinkList from "./link-list"
import NewsletterPreview from "./newsletter-preview"
import QuickNotes from "./quick-notes"
import QuickCapture from "./quick-capture"
import { saveDraft, createCampaign, sendCampaign, fetchCampaign, updateCampaign } from "@/lib/email-octopus"
import { fetchMetadata } from "@/lib/fetch-metadata"
import { useToast } from "@/hooks/use-toast"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, Calendar, Save, Upload, Sparkles, Tag, Bookmark, MessageSquarePlus, Zap, Copy, Search, Trash, Send, X } from "lucide-react"
import ContentLibrarySidebar from "./content-library-sidebar"
import NewsletterSidebar from "./newsletter-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import RichTextEditor from "./rich-text-editor"

const mockEpisodes = [
  {
    id: "1",
    subject: "Latest Web Development Trends - March 2025",
    dateCreated: "2025-03-15T10:30:00Z",
    dateSent: "2025-03-16T09:00:00Z",
    links: [
      {
        id: "101",
        url: "https://example.com/react-2025",
        title: "The Future of React in 2025",
        description: "Exploring the upcoming features and changes in React",
        image: "",
        bulletPoints: ["New concurrent mode features", "Improved server components"],
        tags: ["React", "JavaScript", "Frontend"],
      },
      {
        id: "102",
        url: "https://example.com/container-queries",
        title: "CSS Container Queries: A Complete Guide",
        description: "Learn how to use container queries for responsive design",
        image: "",
        bulletPoints: ["Responsive to parent elements", "Better than media queries for components"],
        tags: ["CSS", "Web Design", "Frontend"],
      },
    ],
  },
  {
    id: "2",
    subject: "AI Tools for Developers - February 2025",
    dateCreated: "2025-02-20T14:15:00Z",
    dateSent: "2025-02-22T09:00:00Z",
    links: [
      {
        id: "201",
        url: "https://example.com/ai-coding",
        title: "Top 10 AI Coding Assistants",
        description: "The best AI tools to help you write better code faster",
        image: "",
        bulletPoints: ["Code completion features", "Integration with popular IDEs"],
        tags: ["AI", "Tools", "Productivity"],
      },
      {
        id: "202",
        url: "https://example.com/gpt5-code",
        title: "How to Use GPT-5 for Code Generation",
        description: "Leveraging the latest GPT model for programming tasks",
        image: "",
        bulletPoints: ["Prompt engineering for code", "Handling complex requirements"],
        tags: ["AI", "GPT", "Code Generation"],
      },
    ],
  },
]

export type LinkItem = {
  id: string
  url: string
  title: string
  description: string
  image: string
  bulletPoints: string[]
  tags?: string[]
}

export default function NewsletterBuilder() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get("edit")

  const [links, setLinks] = useState<LinkItem[]>([])
  const [subject, setSubject] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
  const [rawHtmlContent, setRawHtmlContent] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState<string>("")
  const [availableTags, setAvailableTags] = useState<string[]>([
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "CSS",
    "HTML",
    "Node.js",
    "Backend",
    "Frontend",
    "DevOps",
    "AI",
    "Tools",
    "Productivity",
    "Tutorial",
    "Web Design",
    "Performance",
    "Security",
    "Mobile",
    "Desktop",
    "Cloud",
  ])
  const [isOffline, setIsOffline] = useState(false)
  const [offlineQueue, setOfflineQueue] = useState<{ type: string; data: any }[]>([])
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState("")

  const handleLinkAdd = useCallback(async (url: string, addToOfflineQueue = true) => {
    if (isOffline && addToOfflineQueue) {
      setOfflineQueue((prev) => [...prev, { type: "addLink", data: { url } }])

      const placeholderLink: LinkItem = {
        id: Date.now().toString(),
        url,
        title: "Loading... (Offline)",
        description: "This link will be processed when you are back online",
        image: "",
        bulletPoints: [""],
        tags: ["Offline"],
      }

      setLinks((prev) => [...prev, placeholderLink])
      setSelectedLinkId(placeholderLink.id)

      toast({
        title: "Link queued",
        description: "Link will be processed when you&apos;re back online",
      })

      return Promise.resolve()
    }

    try {
      setIsLoading(true)
      const metadata = await fetchMetadata(url)

      if (!metadata) {
        toast({
          title: "Error fetching metadata",
          description: "Could not fetch metadata for the provided URL",
          variant: "destructive",
        })
        setIsLoading(false)
        return Promise.reject(new Error("Failed to fetch metadata"))
      }

      const newLink: LinkItem = {
        id: Date.now().toString(),
        url,
        title: metadata.title || url,
        description: metadata.description || "",
        image: metadata.image || "",
        bulletPoints: [""],
        tags: [],
      }

      setLinks((prev) => [...prev, newLink])
      setSelectedLinkId(newLink.id)

      toast({
        title: "Link added",
        description: "Link has been added to your newsletter",
      })
      
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding link:", error)
      toast({
        title: "Error adding link",
        description: "An error occurred while adding the link",
        variant: "destructive",
      })
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }, [isOffline, setOfflineQueue, setLinks, setSelectedLinkId, toast])

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return

    toast({
      title: "Processing offline changes",
      description: `Processing ${offlineQueue.length} pending changes`,
    })

    for (const item of offlineQueue) {
      if (item.type === "addLink") {
        await handleLinkAdd(item.data.url, false)
      }
    }

    setOfflineQueue([])

    toast({
      title: "Synchronization complete",
      description: "All offline changes have been processed",
    })
  }, [offlineQueue, handleLinkAdd, toast])

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      processOfflineQueue()
    }

    const handleOffline = () => {
      setIsOffline(true)
      toast({
        title: "You're offline",
        description: "Changes will be saved locally and synced when you're back online",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast, processOfflineQueue])

  useEffect(() => {
    if (editId) {
      const episode = mockEpisodes.find((ep) => ep.id === editId)
      if (episode) {
        setSubject(episode.subject)
        setLinks(episode.links)
        if (episode.links.length > 0) {
          setSelectedLinkId(episode.links[0].id)
        }
        toast({
          title: "Draft loaded",
          description: "Newsletter draft has been loaded for editing",
        })
      }
    }
  }, [editId, toast])

  const handleContentSelect = (content: any) => {
    try {
      setIsLoading(true)

      const newLink: LinkItem = {
        id: Date.now().toString(),
        url: `${window.location.origin}${content.url}`,
        title: content.title,
        description: content.description,
        image: content.image,
        bulletPoints: [""],
        tags: content.tags || [],
      }

      setLinks((prev) => [...prev, newLink])
      setSelectedLinkId(newLink.id)
      toast({
        title: "Content added",
        description: "Your content has been added to the newsletter",
      })
    } catch (error) {
      toast({
        title: "Error adding content",
        description: "An error occurred while adding your content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulletPointChange = (linkId: string, index: number, value: string) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === linkId) {
          const newBulletPoints = [...link.bulletPoints]
          newBulletPoints[index] = value
          return { ...link, bulletPoints: newBulletPoints }
        }
        return link
      }),
    )
  }

  const handleAddBulletPoint = (linkId: string, content = "") => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === linkId) {
          return { ...link, bulletPoints: [...link.bulletPoints, content] }
        }
        return link
      }),
    )
  }

  const handleRemoveBulletPoint = (linkId: string, index: number) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === linkId) {
          const newBulletPoints = [...link.bulletPoints]
          newBulletPoints.splice(index, 1)
          return { ...link, bulletPoints: newBulletPoints }
        }
        return link
      }),
    )
  }

  const handleRemoveLink = (linkId: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== linkId))
    if (selectedLinkId === linkId) {
      const remainingLinks = links.filter((link) => link.id !== linkId)
      setSelectedLinkId(remainingLinks.length > 0 ? remainingLinks[0].id : null)
    }
    toast({
      title: "Link removed",
      description: "Link has been removed from the newsletter",
    })
  }

  const handleMoveLink = (dragIndex: number, hoverIndex: number) => {
    const draggedLink = links[dragIndex]
    const newLinks = [...links]
    newLinks.splice(dragIndex, 1)
    newLinks.splice(hoverIndex, 0, draggedLink)
    setLinks(newLinks)
  }

  const handleAddTag = (linkId: string, tag: string) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === linkId) {
          const currentTags = link.tags || []
          if (!currentTags.includes(tag)) {
            return { ...link, tags: [...currentTags, tag] }
          }
        }
        return link
      }),
    )
  }

  const handleRemoveTag = (linkId: string, tag: string) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === linkId) {
          const currentTags = link.tags || []
          return { ...link, tags: currentTags.filter((t) => t !== tag) }
        }
        return link
      }),
    )
  }

  const handleCreateTag = (tag: string) => {
    if (!availableTags.includes(tag)) {
      setAvailableTags((prev) => [...prev, tag])
    }
  }

  const handleSaveDraft = async () => {
    try {
      setIsLoading(true)
      
      // Use raw HTML if available, otherwise use editor content or generate from links
      const html = rawHtmlContent || editorContent || generateNewsletterHtml()
      
      if (campaignId) {
        toast({
          title: "Updating campaign...",
          description: "Saving changes to existing campaign"
        })
        
        await updateCampaign(campaignId, {
          subject,
          html
        })
        
        toast({
          title: "Campaign updated",
          description: "Your changes have been saved to the existing campaign",
        })
      } else {
        toast({
          title: "Saving draft...",
          description: "Saving draft locally"
        })
        
        await saveDraft({
          subject,
          links,
          html,
          dateCreated: new Date().toISOString(),
        })
        
        toast({
          title: "Draft saved",
          description: "Your draft has been saved locally. Use 'Create Campaign' when ready to publish.",
        })
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error saving draft",
        description: "An error occurred while saving your content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    if (!subject) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for your newsletter",
        variant: "destructive",
      })
      return
    }

    if (links.length === 0 && !rawHtmlContent) {
      toast({
        title: "No content",
        description: "Please add content to your newsletter",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      toast({
        title: "Creating campaign...",
        description: "Uploading your newsletter to EmailOctopus"
      })
      
      // Use raw HTML if available, otherwise generate from links
      const html = rawHtmlContent || generateNewsletterHtml()
      const result = await createCampaign({
        subject,
        html,
      })

      setCampaignId(result.id)
      
      toast({
        title: "Campaign created",
        description: "Your newsletter has been created in EmailOctopus and is ready to send",
      })
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Error creating campaign",
        description: "An error occurred while creating the campaign in EmailOctopus",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendCampaign = async (schedule?: Date) => {
    if (!campaignId) {
      toast({
        title: "No campaign",
        description: "Please create a campaign first",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await sendCampaign({
        campaignId,
        sendAt: schedule ? schedule.toISOString() : undefined,
      })

      setShowScheduleDialog(false)

      toast({
        title: schedule ? "Campaign scheduled" : "Campaign sent",
        description: schedule
          ? `Newsletter will be sent on ${schedule.toLocaleDateString()} at ${schedule.toLocaleTimeString()}`
          : "Newsletter has been sent successfully",
      })
    } catch (error) {
      toast({
        title: "Error sending campaign",
        description: "An error occurred while sending the campaign",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToBulletPoints = (note: string) => {
    if (!selectedLinkId) {
      toast({
        title: "No link selected",
        description: "Please select a link first to add a bullet point",
        variant: "destructive",
      });
      return;
    }

    handleAddBulletPoint(selectedLinkId, note);
    
    toast({
      title: "Bullet point added",
      description: "The note has been added as a bullet point",
    });
  };

  const handleQuickNoteAdd = (note: string) => {
    // Store the note for future use
    const existingNotes = JSON.parse(localStorage.getItem("quick-notes") || "[]");
    const updatedNotes = [note, ...existingNotes.slice(0, 19)]; // Keep only the 20 most recent notes
    localStorage.setItem("quick-notes", JSON.stringify(updatedNotes));
    
    toast({
      title: "Note saved",
      description: "Your note has been saved for future use",
    });
  };

  const handleSelectNewsletter = async (id: string) => {
    try {
      setIsLoading(true)
      
      toast({
        title: "Loading campaign...",
        description: "Getting content for editing"
      })
      
      const campaignData = await fetchCampaign(id)
      
      console.log("Campaign data for editing:", campaignData)
      
      if (campaignData) {
        setCampaignId(id)
        setSubject(campaignData.subject || "")
        
        if (campaignData.content && typeof campaignData.content === 'object') {
          console.log("Campaign content structure:", campaignData.content)
          
          let htmlContent = null
          
          if (campaignData.content.html) {
            htmlContent = campaignData.content.html
          } else if (campaignData.content.body) { 
            htmlContent = campaignData.content.body
          } else if (campaignData.content.text) {
            htmlContent = campaignData.content.text
          }
          
          if (htmlContent) {
            console.log("Found HTML content:", htmlContent.substring(0, 100) + "...")
            
            // Store the raw HTML content for direct editing
            setRawHtmlContent(htmlContent)
            setEditorContent(htmlContent) // Set the WYSIWYG editor content
            
            // Also extract links for the structured editor as a fallback
            const extractedLinks = extractLinksFromHtml(htmlContent)
            
            if (extractedLinks.length > 0) {
              setLinks(extractedLinks)
              if (extractedLinks[0]) {
                setSelectedLinkId(extractedLinks[0].id)
              }
              console.log(`Extracted ${extractedLinks.length} links from the campaign content`)
            } else {
              const placeholderLink: LinkItem = {
                id: Date.now().toString(),
                url: "https://example.com/placeholder",
                title: "Placeholder Content",
                description: "This content was imported from an existing campaign.",
                image: "",
                bulletPoints: ["Imported from existing campaign"],
                tags: [],
              }
              
              setLinks([placeholderLink])
              setSelectedLinkId(placeholderLink.id)
              console.log("No links extracted, using placeholder link")
            }
          } else {
            console.log("No HTML content found in campaign data")
            setLinks([])
            setRawHtmlContent(null)
          }
        } else {
          console.log("No content field in campaign data")
          setLinks([])
          setRawHtmlContent(null)
        }
        
        router.push(`/admin/newsletter?edit=${id}`)
        
        toast({
          title: "Campaign loaded",
          description: "You can now edit the campaign",
        })
      }
    } catch (error) {
      console.error("Error loading campaign:", error)
      
      toast({
        title: "Error loading campaign",
        description: "An error occurred while loading the campaign content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNewDraft = () => {
    setSubject("")
    setLinks([])
    setSelectedLinkId(null)
    setCampaignId(null)
    setRawHtmlContent(null)

    router.push("/admin/newsletter")

    toast({
      title: "New draft created",
      description: "Start building your new newsletter",
    })
  }

  const handleDuplicateNewsletter = async (id: string) => {
    try {
      setIsLoading(true)
      
      toast({
        title: "Loading template...",
        description: "Getting content from the selected campaign"
      })
      
      const campaignData = await fetchCampaign(id)
      
      console.log("Campaign data for duplication:", campaignData)
      
      if (campaignData) {
        setSubject(`Copy of: ${campaignData.subject || ''}`)
        
        if (campaignData.content && typeof campaignData.content === 'object') {
          console.log("Campaign content structure:", campaignData.content)
          
          let htmlContent = null
          
          if (campaignData.content.html) {
            htmlContent = campaignData.content.html
          } else if (campaignData.content.body) { 
            htmlContent = campaignData.content.body
          } else if (campaignData.content.text) {
            htmlContent = campaignData.content.text
          }
          
          if (htmlContent) {
            console.log("Found HTML content:", htmlContent.substring(0, 100) + "...")
            
            setRawHtmlContent(htmlContent)
            setEditorContent(htmlContent) // Set the WYSIWYG editor content
            
            const extractedLinks = extractLinksFromHtml(htmlContent)
            
            if (extractedLinks.length > 0) {
              setLinks(extractedLinks)
              if (extractedLinks[0]) {
                setSelectedLinkId(extractedLinks[0].id)
              }
              console.log(`Extracted ${extractedLinks.length} links from the campaign content`)
            } else {
              const placeholderLink: LinkItem = {
                id: Date.now().toString(),
                url: "https://example.com/placeholder",
                title: "Placeholder Content",
                description: "This content was imported from an existing campaign.",
                image: "",
                bulletPoints: ["Imported from existing campaign"],
                tags: [],
              }
              
              setLinks([placeholderLink])
              setSelectedLinkId(placeholderLink.id)
              console.log("No links extracted, using placeholder link")
            }
          } else {
            console.log("No HTML content found in campaign data")
            setLinks([])
            setRawHtmlContent(null)
          }
        } else {
          console.log("No content field in campaign data")
          setLinks([])
          setRawHtmlContent(null)
        }
        
        setCampaignId(null)
        
        router.push("/admin/newsletter")
        
        toast({
          title: "Template loaded",
          description: "Content loaded from the selected campaign",
        })
      }
    } catch (error) {
      console.error("Error loading campaign template:", error)
      
      toast({
        title: "Error loading template",
        description: "Failed to get content from the selected campaign",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const extractLinksFromHtml = (html: string): LinkItem[] => {
    try {
      console.log("Starting HTML extraction, HTML length:", html.length)
      console.log("HTML sample:", html.substring(0, 200) + "...")
      
      const extractedLinks: LinkItem[] = []
      
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      
      console.log("Temp div created with inner HTML")
      
      const standardTemplateItems = tempDiv.querySelectorAll('div[style*="margin-bottom: 40px"]')
      if (standardTemplateItems.length > 0) {
        console.log(`Found ${standardTemplateItems.length} items using standard template pattern`)
        
        standardTemplateItems.forEach((section, index) => {
          const linkElement = section.querySelector('h2 a')
          let url = 'https://example.com'
          let title = `Item ${index + 1}`
          
          if (linkElement) {
            url = linkElement.getAttribute('href') || url
            title = linkElement.textContent?.trim() || title
          }
          
          let description = ''
          const descElement = section.querySelector('p')
          if (descElement) {
            description = descElement.textContent?.trim() || ''
          }
          
          let image = ''
          const imgElement = section.querySelector('img')
          if (imgElement) {
            image = imgElement.getAttribute('src') || ''
          }
          
          const bulletPoints: string[] = []
          const bulletElements = section.querySelectorAll('ul li')
          
          if (bulletElements.length > 0) {
            bulletElements.forEach(bullet => {
              const text = bullet.textContent?.trim()
              if (text) bulletPoints.push(text)
            })
          } else {
            bulletPoints.push('')
          }
          
          const linkItem: LinkItem = {
            id: Date.now().toString() + '-' + index,
            url,
            title,
            description,
            image,
            bulletPoints,
            tags: [],
          }
          
          extractedLinks.push(linkItem)
        })
        
        console.log(`Extracted ${extractedLinks.length} links using standard template pattern`)
        return extractedLinks
      }
      
      console.log("Standard template pattern not found, trying alternative approaches")
      
      const contentBlocks = Array.from(tempDiv.querySelectorAll('div > h2, div > h3, div > p, .content > div'))
      
      if (contentBlocks.length > 0) {
        console.log(`Found ${contentBlocks.length} potential content blocks`)
        
        let currentLinkData: {
          url?: string
          title?: string
          description?: string
          image?: string
          bulletPoints: string[]
        } | null = null
        
        for (let i = 0; i < contentBlocks.length; i++) {
          const block = contentBlocks[i]
          
          const headerLink = block.tagName?.match(/^H[23]$/i) ? block.querySelector('a') : null
          
          if (headerLink) {
            if (currentLinkData?.url && currentLinkData?.title) {
              extractedLinks.push({
                id: Date.now().toString() + '-' + extractedLinks.length,
                url: currentLinkData.url,
                title: currentLinkData.title,
                description: currentLinkData.description || '',
                image: currentLinkData.image || '',
                bulletPoints: currentLinkData.bulletPoints.length ? currentLinkData.bulletPoints : [''],
                tags: [],
              })
            }
            
            currentLinkData = {
              url: headerLink.getAttribute('href') || 'https://example.com',
              title: headerLink.textContent?.trim() || `Link ${extractedLinks.length + 1}`,
              description: '',
              image: '',
              bulletPoints: [],
            }
          }
          else if (currentLinkData) {
            if (block.tagName === 'P') {
              currentLinkData.description = block.textContent?.trim() || ''
            }
            const img = block.querySelector('img')
            if (img && !currentLinkData.image) {
              currentLinkData.image = img.getAttribute('src') || ''
            }
            const bullets = block.querySelectorAll('li')
            if (bullets.length > 0) {
              bullets.forEach(bullet => {
                const text = bullet.textContent?.trim()
                if (text) currentLinkData?.bulletPoints.push(text)
              })
            }
          }
        }
        
        if (currentLinkData?.url && currentLinkData?.title) {
          extractedLinks.push({
            id: Date.now().toString() + '-' + extractedLinks.length,
            url: currentLinkData.url,
            title: currentLinkData.title,
            description: currentLinkData.description || '',
            image: currentLinkData.image || '',
            bulletPoints: currentLinkData.bulletPoints.length ? currentLinkData.bulletPoints : [''],
            tags: [],
          })
        }
        
        if (extractedLinks.length > 0) {
          console.log(`Extracted ${extractedLinks.length} links using content block approach`)
          return extractedLinks
        }
      }
      
      const mainLinks = Array.from(tempDiv.querySelectorAll('a[href]'))
        .filter(link => {
          const href = link.getAttribute('href') || ''
          return !href.includes('unsubscribe') && 
                 !href.includes('mailto:') && 
                 !href.includes('twitter.com') &&
                 !href.includes('facebook.com') &&
                 !href.includes('instagram.com') &&
                 !href.includes('linkedin.com') &&
                 !href.includes('#') &&
                 link.textContent?.trim().length > 3
        })
      
      if (mainLinks.length > 0) {
        console.log(`Found ${mainLinks.length} potential main links`)
        
        mainLinks.forEach((link, index) => {
          const url = link.getAttribute('href') || 'https://example.com'
          const title = link.textContent?.trim() || `Link ${index + 1}`
          
          let description = ''
          let parent = link.parentElement
          while (parent && !description && parent.tagName !== 'BODY') {
            const siblingParagraph = Array.from(parent.children)
              .find(el => el.tagName === 'P' && el !== link && el.textContent?.trim().length > 0)
            
            if (siblingParagraph) {
              description = siblingParagraph.textContent?.trim() || ''
              break
            }
            parent = parent.parentElement
          }
          
          const linkItem: LinkItem = {
            id: Date.now().toString() + '-' + index,
            url,
            title,
            description,
            image: '',
            bulletPoints: [''],
            tags: [],
          }
          
          extractedLinks.push(linkItem)
        })
        
        console.log(`Extracted ${extractedLinks.length} links using last resort approach`)
      }
      
      const uniqueLinks = extractedLinks.filter((link, index, self) => 
        index === self.findIndex(l => l.url === link.url)
      )
      
      console.log(`Returning ${uniqueLinks.length} unique links`)
      return uniqueLinks
    } catch (error) {
      console.error("Error extracting links from HTML:", error)
      return []
    }
  }

  const generateNewsletterHtml = () => {
    // Create a temporary div to parse the editor content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorContent || ''

    // Replace newsletter link cards with their final HTML
    const linkCards = tempDiv.querySelectorAll('div[data-link-id]')
    linkCards.forEach((card) => {
      const linkId = card.getAttribute('data-link-id')
      const link = links.find(l => l.id === linkId)
      if (link) {
        const linkHtml = `
          <div style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 30px;">
            <h2 style="font-size: 22px; margin-bottom: 12px; color: #333;">
              <a href="${link.url}" style="color: #0066cc; text-decoration: none; font-weight: 600;">${link.title}</a>
            </h2>
            ${
              link.image
                ? `
              <div style="margin-bottom: 20px;">
                <a href="${link.url}" style="text-decoration: none;">
                  <img src="${link.image}" alt="${link.title}" style="max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #eee;" />
                </a>
              </div>
            `
                : ""
            }
            <p style="color: #555; margin-bottom: 15px; line-height: 1.6;">${link.description}</p>
            ${
              link.bulletPoints.filter((bp) => bp.trim()).length > 0
                ? `
              <ul style="padding-left: 20px; margin-bottom: 20px; color: #444;">
                ${link.bulletPoints
                  .filter((bp) => bp.trim())
                  .map(
                    (bp) => `
                  <li style="margin-bottom: 8px; line-height: 1.5;">${bp}</li>
                `,
                  )
                  .join("")}
              </ul>
            `
                : ""
            }
            <div style="margin-top: 15px;">
              <a href="${link.url}" style="display: inline-block; padding: 8px 16px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">Read More</a>
            </div>
          </div>
        `
        card.outerHTML = linkHtml
      }
    })

    // Get the processed HTML content
    const processedContent = tempDiv.innerHTML

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          a {
            color: #0066cc;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          .header {
            margin-bottom: 30px;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
          }
          .header h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
          }
          .header p {
            color: #666;
            margin: 0;
          }
          @media only screen and (max-width: 600px) {
            body {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${subject}</h1>
          <p>${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        
        <main>
          ${processedContent}
        </main>
        
        <div class="footer">
          <p>Thank you for subscribing to our newsletter!</p>
          <p>If you no longer wish to receive these emails, you can <a href="{{unsubscribe}}" style="color: #999;">unsubscribe here</a>.</p>
          <p>&copy; ${new Date().getFullYear()} Modern Coding. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string)
          
          if (data.links) {
            setLinks(data.links)
          }
          
          if (data.subject) {
            setSubject(data.subject)
          }
          
          if (data.html) {
            setRawHtmlContent(data.html)
          }
          
          toast({
            title: "Draft loaded",
            description: "Newsletter draft has been loaded successfully",
          })
        } catch (error) {
          toast({
            title: "Error loading draft",
            description: "The selected file is not a valid newsletter draft",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const handleSelectLink = (id: string) => {
    setSelectedLinkId(id);
  }

  const handleUpdateLink = (id: string, updates: Partial<LinkItem>) => {
    setLinks(prev =>
      prev.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    );
  }

  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    if (selectedLinkId === id) {
      setSelectedLinkId(null);
    }
  }

  const handleReorderLinks = (newOrder: LinkItem[]) => {
    setLinks(newOrder);
  }

  const sanitizeHtml = (html: string) => {
    try {
      // Create a new DOMParser to safely parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Check for parsing errors
      const errors = doc.getElementsByTagName('parsererror');
      if (errors.length > 0) {
        console.warn('HTML parsing errors detected:', errors[0].textContent);
        // Return a message about the parsing error, wrapped in proper HTML
        return `<div style="color: red; padding: 20px; background: #ffeeee; border: 1px solid #ffcccc; border-radius: 4px;">
          <h3>HTML Parsing Error</h3>
          <p>There was an error parsing the HTML. Please check the HTML editor for issues.</p>
          <pre style="background: #fff; padding: 10px; overflow: auto;">${
            errors[0].textContent?.replace(/</g, '&lt;').replace(/>/g, '&gt;') || 'Unknown error'
          }</pre>
        </div>`;
      }
      
      // If no errors, return the original HTML
      return html;
    } catch (error) {
      console.error('Error sanitizing HTML:', error);
      // Return a fallback message if the sanitization process itself fails
      return `<div style="color: red; padding: 20px; background: #ffeeee; border: 1px solid #ffcccc; border-radius: 4px;">
        <h3>HTML Processing Error</h3>
        <p>There was an error processing the HTML content: ${String(error)}</p>
      </div>`;
    }
  }

  // When the editorContent changes, update the rawHtmlContent or HTML textarea view
  useEffect(() => {
    if (editorContent && !rawHtmlContent) {
      setRawHtmlContent(editorContent);
    }
  }, [editorContent, rawHtmlContent]);

  // When rawHtmlContent changes from the HTML editor, update the WYSIWYG editor
  useEffect(() => {
    if (rawHtmlContent) {
      setEditorContent(rawHtmlContent);
    }
  }, [rawHtmlContent]);

  return (
    <>
      <div className="grid lg:grid-cols-12 h-full gap-4">
        <div className="lg:col-span-4 h-full">
          <NewsletterSidebar
            currentId={campaignId}
            onSelectNewsletter={handleSelectNewsletter}
            onCreateNewDraft={handleCreateNewDraft}
            onDuplicateNewsletter={handleDuplicateNewsletter}
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject" className="text-white">
                    Newsletter Subject:
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter a subject for your newsletter..."
                    className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Newsletter Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue={rawHtmlContent ? "html" : "edit"} className="bg-blue-900/50 backdrop-blur-sm rounded-lg border border-blue-800/50">
                <TabsList className="bg-blue-800/50 m-1">
                  <TabsTrigger value="edit">Edit Content</TabsTrigger>
                  <TabsTrigger value="html">Edit HTML</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="edit" className="p-2 space-y-2">
                  <DndProvider backend={HTML5Backend}>
                    <div className="space-y-4">
                      <div className="bg-blue-950/50 border border-blue-900 rounded-md p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-white">WYSIWYG Editor</h3>
                        </div>
                        <RichTextEditor 
                          content={editorContent}
                          onChange={(html) => {
                            setEditorContent(html);
                            // Keep rawHtmlContent in sync if it's being used
                            if (rawHtmlContent) {
                              setRawHtmlContent(html);
                            }
                          }}
                          links={links}
                          onLinkRemove={handleDeleteLink}
                        />
                      </div>
                      
                      <div className="bg-blue-950/50 border border-blue-900 rounded-md p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-white">Links</h3>
                          <div className="space-x-2">
                            <Input
                              placeholder="Enter URL..."
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              className="w-40 sm:w-60 bg-blue-900/50 border-blue-800 text-white"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && urlInput) {
                                  handleLinkAdd(urlInput);
                                  setUrlInput("");
                                }
                              }}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 text-green-300 hover:bg-green-800/50"
                              onClick={() => {
                                if (urlInput) {
                                  handleLinkAdd(urlInput);
                                  setUrlInput("");
                                }
                              }}
                              disabled={!urlInput || isLoading}
                            >
                              Add Link
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {links.map((link) => (
                            <div
                              key={link.id}
                              className="p-3 bg-blue-900/30 rounded-md hover:bg-blue-900/40 transition-colors cursor-move"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/link-id', link.id);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{link.title}</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-300 hover:text-red-100 hover:bg-red-900/20"
                                  onClick={() => handleDeleteLink(link.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              {link.description && (
                                <p className="text-sm text-blue-200 mt-1">{link.description}</p>
                              )}
                              {link.tags && link.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {link.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-blue-800/50 text-blue-200 px-2 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DndProvider>
                </TabsContent>

                <TabsContent value="html" className="p-2 space-y-2">
                  <div className="bg-blue-950/50 border border-blue-900 p-4 rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-white">HTML Editor</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-500 text-blue-300 hover:bg-blue-800/50"
                          onClick={() => {
                            if (links.length > 0 && !rawHtmlContent) {
                              const generatedHtml = generateNewsletterHtml()
                              setRawHtmlContent(generatedHtml)
                            }
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate from Links
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500 text-red-300 hover:bg-red-800/50"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to clear the HTML content?")) {
                              setRawHtmlContent(null)
                            }
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Clear HTML
                        </Button>
                      </div>
                    </div>
                    
                    <textarea 
                      className="w-full h-[500px] bg-blue-950 text-white p-4 font-mono text-sm rounded-md border border-blue-900"
                      value={rawHtmlContent || editorContent || generateNewsletterHtml()}
                      onChange={(e) => setRawHtmlContent(e.target.value)}
                      spellCheck="false"
                    />
                    
                    <div className="text-sm text-blue-300">
                      <p>Edit the HTML directly to customize your newsletter. Changes here override the structured editor.</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="p-2">
                  <div className="bg-white rounded-md p-4">
                    {(() => {
                      try {
                        // Show loading state if the editor is fetching content
                        if (isLoading) {
                          return (
                            <div className="flex items-center justify-center p-12">
                              <LoadingSpinner size={32} />
                              <span className="ml-3 text-gray-500">Loading preview...</span>
                            </div>
                          );
                        }

                        // Generate HTML content from either raw HTML, rich editor content, or link structure
                        const htmlContent = rawHtmlContent || editorContent || generateNewsletterHtml();
                        
                        // Check if content is valid
                        if (!htmlContent || htmlContent.trim() === '') {
                          return (
                            <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
                              <h3 className="text-lg font-bold mb-2">No Content</h3>
                              <p>There is no content to preview. Please add links, use the WYSIWYG editor, or add HTML content.</p>
                            </div>
                          );
                        }
                        
                        // Use an iframe for proper isolation of the HTML content
                        return (
                          <>
                            <div className="mb-4 flex justify-between items-center">
                              <h3 className="text-gray-700 font-medium">Newsletter Preview</h3>
                              <div className="text-sm text-gray-500">
                                {subject && <span>Subject: {subject}</span>}
                              </div>
                            </div>
                            <iframe 
                              srcDoc={sanitizeHtml(htmlContent)}
                              title="Newsletter Preview"
                              className="w-full border-0 min-h-[600px]"
                              sandbox="allow-same-origin"
                            />
                          </>
                        );
                      } catch (error) {
                        console.error("Error rendering preview:", error);
                        return (
                          <div className="p-4 bg-red-50 text-red-800 rounded-md">
                            <h3 className="text-lg font-bold mb-2">Error Rendering Preview</h3>
                            <p>There was an error rendering the HTML preview: {String(error)}</p>
                            <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto text-sm">
                              {error instanceof Error ? error.stack : 'Unknown error'}
                            </pre>
                            <div className="mt-4">
                              <h4 className="font-semibold">Debugging Steps:</h4>
                              <ol className="list-decimal pl-5 mt-2 space-y-1">
                                <li>Check the HTML editor for invalid HTML markup</li>
                                <li>Ensure all tags are properly closed</li>
                                <li>Verify there are no script tags or other restricted content</li>
                                <li>Try clearing the HTML and regenerating from links</li>
                              </ol>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Newsletter Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/20"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-300 hover:bg-blue-800/50"
                  onClick={handleCreateCampaign}
                  disabled={isLoading || !subject || links.length === 0}
                >
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-white/20 text-white hover:bg-white/20"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Load Draft
                </Button>
              </div>
              
              {campaignId && (
                <div className="pt-2 flex space-x-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleSendCampaign()}
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                  
                  <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                    <DialogTrigger asChild>
                      <Button
                        disabled={isLoading || !campaignId}
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/20"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 text-white border-gray-700">
                      <DialogHeader>
                        <DialogTitle>Schedule Newsletter</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Select a date and time to send your newsletter
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-2">
                        <DatePicker date={scheduleDate} setDate={setScheduleDate} showTimePicker />
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => handleSendCampaign(scheduleDate)}
                          disabled={!scheduleDate}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Schedule Send
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              
              {(subject.startsWith('Copy of:') || subject.includes('Copy of')) && (
                <div className="bg-blue-900/60 text-blue-200 p-2 rounded-md text-sm mt-2">
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2" />
                    <span>You're working with duplicated content from an existing campaign.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center">
              <MessageSquarePlus className="h-5 w-5 mr-2 text-blue-300" />
              AI Subject Suggestions
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-blue-200 mb-1">
                Based on your content, here are some suggested subject lines:
              </p>
              <div className="space-y-1">
                {links.length > 0 ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-white/20 text-white hover:bg-white/20 text-left h-auto py-1"
                      onClick={() => setSubject(`${links.length} Essential Resources for Modern Developers`)}
                    >
                      {links.length} Essential Resources for Modern Developers
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-white/20 text-white hover:bg-white/20 text-left h-auto py-1"
                      onClick={() =>
                        setSubject(`This Week in Tech: ${links[0]?.title?.split(":")[0] || "Latest Updates"}`)
                      }
                    >
                      This Week in Tech: {links[0]?.title?.split(":")[0] || "Latest Updates"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-white/20 text-white hover:bg-white/20 text-left h-auto py-1"
                      onClick={() =>
                        setSubject(
                          `Modern Coding Digest - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
                        )
                      }
                    >
                      Modern Coding Digest -{" "}
                      {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-blue-300 italic">
                    Add some links to get AI-generated subject line suggestions
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3 flex flex-col">
          <div className="flex-1">
            <ContentLibrarySidebar onContentSelect={handleContentSelect} />
          </div>
          <div className="flex-1 max-h-[45vh] overflow-auto">
            <QuickNotes onAddToBulletPoints={handleAddToBulletPoints} />
          </div>
        </div>
      </div>

      <QuickCapture onLinkAdd={handleLinkAdd} onNoteAdd={handleQuickNoteAdd} />
    </>
  )
}

