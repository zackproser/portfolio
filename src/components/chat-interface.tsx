"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { Panel, PanelGroup } from "react-resizable-panels"

export function ChatInterface() {
  const [open, setOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/vectordatabases/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your vector database assistant. Ask me anything about the vector databases in this comparison tool, and I'll help you find the information you need.",
      },
    ],
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messagesEndRef])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed bottom-6 right-6 h-auto py-3 px-4 rounded-full shadow-lg z-50 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none text-white"
        >
          <span className="text-lg">🤖</span>
          <span className="font-medium">Ask me about vector databases</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={100} minSize={30}>
            <div className="flex flex-col h-full bg-white dark:bg-slate-900">
              <SheetHeader className="px-4 py-3 border-b bg-white dark:bg-slate-900">
                <SheetTitle className="text-slate-900 dark:text-white">Vector Database Assistant</SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-1 p-4 bg-white dark:bg-slate-900">
                <div className="space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex items-start gap-3 text-sm", message.role === "user" ? "flex-row-reverse" : "")}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
                          message.role === "user" 
                            ? "bg-zinc-700 text-zinc-50" 
                            : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white",
                        )}
                      >
                        {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 max-w-[85%] whitespace-pre-wrap",
                          message.role === "user" 
                            ? "bg-zinc-700 text-zinc-50" 
                            : "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="border-t p-4 flex items-center gap-2 bg-white dark:bg-slate-900">
                <Input
                  placeholder="Ask about vector databases..."
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="flex-1 border-slate-300 dark:border-slate-700"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Panel>
        </PanelGroup>
      </SheetContent>
    </Sheet>
  )
} 