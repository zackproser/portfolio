type Draft = {
    subject: string
    links: any[]
    html: string
    dateCreated: string
  }
  
  type Campaign = {
    subject: string
    html: string
  }
  
  type SendOptions = {
    campaignId: string
    sendAt?: string
  }

  type FetchCampaignsOptions = {
    limit?: number
    page?: number
    status?: string
  }
  
  export async function saveDraft(draft: Draft) {
    try {
      // For simplicity, we'll save to localStorage in this example
      localStorage.setItem("newsletter-draft", JSON.stringify(draft))
  
      // Also download as a JSON file for backup
      const dataStr = JSON.stringify(draft, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
  
      const exportFileDefaultName = `newsletter-draft-${new Date().toISOString().split("T")[0]}.json`
  
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
  
      return { success: true }
    } catch (error) {
      console.error("Error saving draft:", error)
      throw error
    }
  }
  
  export async function loadDraft() {
    try {
      const savedDraft = localStorage.getItem("newsletter-draft")
      if (savedDraft) {
        return JSON.parse(savedDraft)
      }
      return null
    } catch (error) {
      console.error("Error loading draft:", error)
      return null
    }
  }
  
  export async function createCampaign(campaign: Campaign) {
    try {
      const response = await fetch("/api/email-octopus/create-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create campaign")
      }
  
      return data
    } catch (error: any) {
      console.error("Error creating campaign:", error)
      throw new Error(error.message || "Failed to create campaign")
    }
  }
  
  export async function sendCampaign(options: SendOptions) {
    try {
      const response = await fetch("/api/email-octopus/send-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to send campaign")
      }
  
      return data
    } catch (error: any) {
      console.error("Error sending campaign:", error)
      throw new Error(error.message || "Failed to send campaign")
    }
  }

  export async function fetchCampaigns(options: FetchCampaignsOptions = {}) {
    try {
      const { limit = 50, page = 1, status } = options;
      
      let url = `/api/email-octopus/campaigns?limit=${limit}&page=${page}`;
      
      if (status) {
        url += `&status=${status}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      
      // Log response details for debugging
      if (!response.ok) {
        console.error("Failed to fetch campaigns:", {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        throw new Error(
          data.error || 
          (data.detail ? `API Error: ${data.detail}` : null) || 
          `HTTP Error: ${response.status} ${response.statusText}` || 
          "Failed to fetch campaigns"
        );
      }
  
      return data;
    } catch (error: any) {
      // Just log and rethrow the error
      console.error("Error in fetchCampaigns:", error);
      throw error;
    }
  }

  export async function fetchCampaign(campaignId: string) {
    try {
      const response = await fetch(`/api/email-octopus/campaigns/${campaignId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      // Log response for debugging
      console.log("Campaign data received:", {
        id: data.id,
        subject: data.subject,
        contentExists: data.content ? true : false,
        htmlExists: data.content?.html ? true : false,
      });

      if (!response.ok) {
        console.error("Failed to fetch campaign:", {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        throw new Error(
          data.error || 
          (data.detail ? `API Error: ${data.detail}` : null) || 
          `HTTP Error: ${response.status} ${response.statusText}` || 
          "Failed to fetch campaign"
        );
      }

      return data;
    } catch (error: any) {
      console.error("Error in fetchCampaign:", error);
      throw error;
    }
  }

  export async function updateCampaign(campaignId: string, updates: { subject?: string; html?: string }) {
    try {
      const response = await fetch(`/api/email-octopus/update-campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          ...updates
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to update campaign:", {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        throw new Error(
          data.error || 
          (data.detail ? `API Error: ${data.detail}` : null) || 
          `HTTP Error: ${response.status} ${response.statusText}` || 
          "Failed to update campaign"
        );
      }

      return data;
    } catch (error: any) {
      console.error("Error in updateCampaign:", error);
      throw error;
    }
  }
  
  