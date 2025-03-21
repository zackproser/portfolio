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
import { Mail, Calendar, Save, Upload, Sparkles, Tag, Bookmark, MessageSquarePlus, Zap } from "lucide-react"
// Update the imports to include the new ContentLibrarySidebar component
import ContentLibrarySidebar from "./content-library-sidebar"
// Add the import for NewsletterSidebar
import NewsletterSidebar from "./newsletter-sidebar"

// Mock data for demonstration
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

  const handleLinkAdd = useCallback(async (url: string, addToOfflineQueue = true) => {
    if (isOffline && addToOfflineQueue) {
      setOfflineQueue((prev) => [...prev, { type: "addLink", data: { url } }])

      // Create a placeholder link for offline mode
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

      return
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
        return
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
    } catch (error) {
      console.error("Error adding link:", error)
      toast({
        title: "Error adding link",
        description: "An error occurred while adding the link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [isOffline, setOfflineQueue, setLinks, setSelectedLinkId, toast]);

  // Define processOfflineQueue before it's used
  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return

    toast({
      title: "Processing offline changes",
      description: `Processing ${offlineQueue.length} pending changes`,
    })

    for (const item of offlineQueue) {
      if (item.type === "addLink") {
        // Process the queued link
        await handleLinkAdd(item.data.url, false)
      }
      // Add other operations as needed
    }

    // Clear the queue after processing
    setOfflineQueue([])

    toast({
      title: "Synchronization complete",
      description: "All offline changes have been processed",
    })
  }, [offlineQueue, handleLinkAdd, toast])

  // Check for offline status
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

  // Load draft if edit ID is provided
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

  // Add the handleContentSelect function inside the NewsletterBuilder component, after the other handler functions
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
      
      // Generate the HTML content for the newsletter
      const html = generateNewsletterHtml()
      
      if (campaignId) {
        // We have a campaign ID, so we're updating an existing campaign
        toast({
          title: "Updating campaign...",
          description: "Saving changes to existing campaign"
        });
        
        // Update the existing campaign on EmailOctopus
        await updateCampaign(campaignId, {
          subject,
          html
        })
        
        toast({
          title: "Campaign updated",
          description: "Your changes have been saved to the existing campaign",
        })
      } else {
        // No campaign ID, so save locally
        toast({
          title: "Saving draft...",
          description: "Saving draft locally"
        });
        
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

    if (links.length === 0) {
      toast({
        title: "No content",
        description: "Please add at least one link to your newsletter",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      toast({
        title: "Creating campaign...",
        description: "Uploading your newsletter to EmailOctopus"
      });
      
      const html = generateNewsletterHtml()
      const result = await createCampaign({
        subject,
        html,
      })

      // Store the new campaign ID for future reference
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

  const handleAddToBulletPoints = (expandedNote: string) => {
    if (selectedLinkId) {
      handleAddBulletPoint(selectedLinkId, expandedNote)
    } else if (links.length > 0) {
      handleAddBulletPoint(links[0].id, expandedNote)
    } else {
      toast({
        title: "No link selected",
        description: "Please add a link first to add bullet points",
        variant: "destructive",
      })
    }
  }

  const handleQuickNoteAdd = (note: string) => {
    if (selectedLinkId) {
      handleAddBulletPoint(selectedLinkId, note)
      toast({
        title: "Note added",
        description: "Note has been added to the selected link",
      })
    } else if (links.length > 0) {
      handleAddBulletPoint(links[0].id, note)
      toast({
        title: "Note added",
        description: "Note has been added to the first link",
      })
    } else {
      toast({
        title: "No link available",
        description: "Please add a link first to add notes",
        variant: "destructive",
      })
    }
  }

  const handleSelectNewsletter = async (id: string) => {
    try {
      setIsLoading(true);
      
      toast({
        title: "Loading campaign...",
        description: "Getting content for editing"
      });
      
      // Fetch the campaign content
      const campaignData = await fetchCampaign(id);
      
      console.log("Campaign data for editing:", campaignData);
      
      if (campaignData) {
        // Update local state with the campaign content
        setCampaignId(id); // Keep the original ID for updating later
        setSubject(campaignData.subject || "");
        
        // Extract HTML content if available
        if (campaignData.content && typeof campaignData.content === 'object') {
          console.log("Campaign content structure:", campaignData.content);
          
          // EmailOctopus API returns content in different formats
          let htmlContent = null;
          
          // Try different known paths to find HTML content
          if (campaignData.content.html) {
            htmlContent = campaignData.content.html;
          } else if (campaignData.content.body) { 
            htmlContent = campaignData.content.body;
          } else if (campaignData.content.text) {
            htmlContent = campaignData.content.text;
          }
          
          if (htmlContent) {
            console.log("Found HTML content:", htmlContent.substring(0, 100) + "...");
            
            // Create some sample links based on the content
            const sampleLink: LinkItem = {
              id: Date.now().toString(),
              url: "https://example.com/placeholder",
              title: "Placeholder Content",
              description: "This content was imported from an existing campaign.",
              image: "",
              bulletPoints: ["Imported from existing campaign"],
              tags: [],
            };
            
            setLinks([sampleLink]);
            
            // Now that we've set the links, the preview should update automatically
          } else {
            console.log("No HTML content found in campaign data");
            setLinks([]);
          }
        } else {
          console.log("No content field in campaign data");
          // If no HTML content, just set empty links
          setLinks([]);
        }
        
        // Update the URL to indicate we're editing
        router.push(`/admin/newsletter?edit=${id}`);
        
        toast({
          title: "Campaign loaded",
          description: "You can now edit the campaign",
        });
      }
    } catch (error) {
      console.error("Error loading campaign:", error);
      
      toast({
        title: "Error loading campaign",
        description: "An error occurred while loading the campaign content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewDraft = () => {
    // Reset the current state
    setSubject("")
    setLinks([])
    setSelectedLinkId(null)
    setCampaignId(null)

    // Remove the edit parameter from the URL
    router.push("/admin/newsletter")

    toast({
      title: "New draft created",
      description: "Start building your new newsletter",
    })
  }

  const handleDuplicateNewsletter = async (id: string) => {
    try {
      setIsLoading(true);
      
      toast({
        title: "Loading template...",
        description: "Getting content from the selected campaign"
      });
      
      // Fetch the campaign to get its content
      const campaignData = await fetchCampaign(id);
      
      console.log("Campaign data for duplication:", campaignData);
      
      if (campaignData) {
        // Populate the editor with this campaign's content
        setSubject(`Copy of: ${campaignData.subject || ''}`);
        
        // Extract HTML content if available
        if (campaignData.content && typeof campaignData.content === 'object') {
          console.log("Campaign content structure:", campaignData.content);
          
          // EmailOctopus API returns content in different formats
          let htmlContent = null;
          
          // Try different known paths to find HTML content
          if (campaignData.content.html) {
            htmlContent = campaignData.content.html;
          } else if (campaignData.content.body) { 
            htmlContent = campaignData.content.body;
          } else if (campaignData.content.text) {
            htmlContent = campaignData.content.text;
          }
          
          if (htmlContent) {
            console.log("Found HTML content:", htmlContent.substring(0, 100) + "...");
            
            // Use our generateNewsletter function to recreate the HTML
            const newHtml = generateNewsletterHtml();
            
            // Create some sample links based on the content
            const sampleLink: LinkItem = {
              id: Date.now().toString(),
              url: "https://example.com/placeholder",
              title: "Placeholder Content",
              description: "This content was imported from an existing campaign.",
              image: "",
              bulletPoints: ["Imported from existing campaign"],
              tags: [],
            };
            
            setLinks([sampleLink]);
            
            // Now that we've set the links, the preview should update automatically
          } else {
            console.log("No HTML content found in campaign data");
            setLinks([]);
          }
        } else {
          console.log("No content field in campaign data");
          // If no HTML content, just set empty links
          setLinks([]);
        }
        
        // Important: Clear campaignId so we create a new one on save
        setCampaignId(null);
        
        // Remove any edit parameter from URL
        router.push("/admin/newsletter");
        
        toast({
          title: "Template loaded",
          description: "Content loaded from the selected campaign",
        });
      }
    } catch (error) {
      console.error("Error loading campaign template:", error);
      
      toast({
        title: "Error loading template",
        description: "Failed to get content from the selected campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewsletterHtml = () => {
    const linksHtml = links
      .map(
        (link) => `
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
    `,
      )
      .join("")

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
          ${linksHtml}
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4 px-0">
        {isOffline && (
          <div className="bg-yellow-600/20 border border-yellow-600/50 text-yellow-200 px-4 py-3 rounded-md flex items-center justify-between mx-1">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              <span>You&apos;re currently offline. Changes will be saved locally and synced when you&apos;re back online.</span>
            </div>
            <div className="text-sm">
              {offlineQueue.length} pending {offlineQueue.length === 1 ? "change" : "changes"}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Left Sidebar - Newsletter List */}
          <div className="lg:col-span-1">
            <NewsletterSidebar
              currentId={editId || undefined}
              onSelectNewsletter={handleSelectNewsletter}
              onCreateNewDraft={handleCreateNewDraft}
              onDuplicateNewsletter={handleDuplicateNewsletter}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Newsletter Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-white/20 border-white/20 placeholder:text-white/50 text-white"
                  />
                  <Button
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/20"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>

                {subject.startsWith('Copy of:') && (
                  <div className="bg-blue-900/60 text-blue-200 p-2 rounded-md text-sm">
                    You're working with content from an existing campaign. Add your own links and content below.
                  </div>
                )}

                <div className="space-y-3">
                  <LinkDropZone onLinkAdd={handleLinkAdd} isLoading={isLoading} />
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        try {
                          const data = JSON.parse(event.target?.result as string)
                          setLinks(data.links || [])
                          setSubject(data.subject || "")
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
                  }}
                />
              </div>
            </div>

            <Tabs defaultValue="edit" className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <TabsList className="bg-white/20 m-1 p-1">
                <TabsTrigger value="edit" className="data-[state=active]:bg-blue-600 text-white px-3 py-1 h-7">
                  Edit Content
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-blue-600 text-white px-3 py-1 h-7">
                  Preview Newsletter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="p-2 space-y-2">
                <LinkList
                  links={links}
                  selectedLinkId={selectedLinkId}
                  onSelectLink={setSelectedLinkId}
                  onBulletPointChange={handleBulletPointChange}
                  onAddBulletPoint={handleAddBulletPoint}
                  onRemoveBulletPoint={handleRemoveBulletPoint}
                  onRemoveLink={handleRemoveLink}
                  onMoveLink={handleMoveLink}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  onCreateTag={handleCreateTag}
                  availableTags={availableTags}
                />
              </TabsContent>

              <TabsContent value="preview" className="p-2">
                <NewsletterPreview subject={subject} links={links} html={generateNewsletterHtml()} />
              </TabsContent>
            </Tabs>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 space-y-2">
              <h3 className="text-lg font-bold text-white mb-1">Newsletter Actions</h3>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateCampaign}
                  disabled={isLoading || !subject || links.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button
                  onClick={() => handleSendCampaign()}
                  disabled={isLoading || !campaignId}
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Send
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
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-white/20 text-white hover:bg-white/20"
              >
                <Upload className="h-4 w-4 mr-2" />
                Load Draft
              </Button>
            </div>

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

          {/* Right Sidebar - Content Library */}
          <div className="lg:col-span-1 space-y-3 flex flex-col">
            <div className="flex-1">
              <ContentLibrarySidebar onContentSelect={handleContentSelect} />
            </div>
            <div className="flex-1 max-h-[45vh] overflow-auto">
              <QuickNotes onAddToBulletPoints={handleAddToBulletPoints} />
            </div>
          </div>
        </div>
      </div>

      <QuickCapture onLinkAdd={handleLinkAdd} onNoteAdd={handleQuickNoteAdd} />
    </DndProvider>
  )
}

