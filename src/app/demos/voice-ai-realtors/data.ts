// Real estate-specific scenarios and data for the Realtor Voice AI demo

export interface RealtorScenario {
  id: string
  title: string
  icon: string
  context: string
  rawDictation: string
  polishedOutput: string
  timeSaved: string
}

export interface BuyerConsultation {
  during: {
    title: string
    participants: string[]
    duration: string
    status: string
  }
  after: {
    summary: string
    actionItems: { owner: string; task: string; due: string }[]
    clientPreferences: string[]
    keyDecisions: string[]
  }
}

// Listing description pipeline - from walk-through to MLS
export const LISTING_PIPELINE = {
  walkThrough: {
    room: 'Kitchen',
    rawDictation: "ok so this kitchen is um amazing the countertops are quartz I think yeah quartz with a waterfall island there's seating for like four people custom soft close cabinets stainless steel appliances looks like bosch or maybe thermador french doors going out to the backyard which has a nice flagstone patio",
    enhanced: "Chef's kitchen featuring quartz countertops with waterfall island and seating for four. Custom soft-close cabinetry paired with premium stainless steel appliances. French doors open to a private backyard with flagstone patio — perfect for entertaining.",
    stats: {
      rawWords: 58,
      enhancedWords: 38,
      dictationTime: '22 seconds',
      typingTime: '2+ minutes'
    }
  },
  fullListing: {
    rawDictation: "stunning fully renovated colonial in sought after oak hills step into the open concept main level featuring wide plank hardwood floors throughout the chefs kitchen boasts quartz countertops a waterfall island with seating for four custom soft close cabinetry and high end stainless appliances french doors lead to a private backyard with mature landscaping and a flagstone patio perfect for entertaining the primary suite includes a spa inspired bath with dual vanities frameless glass shower and heated tile floors three additional bedrooms a finished basement with wet bar and a two car garage complete this exceptional home",
    enhanced: `Stunning fully renovated colonial in sought-after Oak Hills. Step into the open-concept main level featuring wide-plank hardwood floors throughout.

The chef's kitchen boasts quartz countertops, a waterfall island with seating for four, custom soft-close cabinetry, and high-end stainless appliances. French doors lead to a private backyard with mature landscaping and a flagstone patio perfect for entertaining.

The primary suite includes a spa-inspired bath with dual vanities, a frameless glass shower, and heated tile floors. Three additional bedrooms, a finished basement with wet bar, and a two-car garage complete this exceptional home.`,
    stats: {
      words: 108,
      dictationTime: '60 seconds',
      typingTime: '5-7 minutes'
    }
  }
}

// Context-aware scenarios for realtors
export const REALTOR_SCENARIOS: RealtorScenario[] = [
  {
    id: 'mls',
    title: 'MLS Listing Description',
    icon: '🏠',
    context: 'MLS System',
    rawDictation: "charming three bed two bath ranch on a quiet cul de sac updated kitchen with granite counters and stainless appliances hardwood floors throughout main level spacious fenced backyard with deck new roof in 2024 two car attached garage move in ready",
    polishedOutput: `Charming 3BR/2BA ranch on a quiet cul-de-sac. Updated kitchen with granite counters and stainless appliances. Hardwood floors throughout the main level. Spacious fenced backyard with deck — perfect for summer entertaining. New roof (2024). Two-car attached garage. Move-in ready.`,
    timeSaved: '4 min saved'
  },
  {
    id: 'email',
    title: 'Client Follow-Up Email',
    icon: '📧',
    context: 'Gmail / Outlook',
    rawDictation: "hi sarah and tom thanks for meeting me at 123 oak street today based on your budget of 425k and the home office requirement I have two more properties that check every box I'll send you the listings tonight and we can schedule showings for this weekend if you're available",
    polishedOutput: `Hi Sarah and Tom,

Thanks for meeting me at 123 Oak Street today! Based on your budget of $425K and the home office requirement, I have two more properties that check every box.

I'll send you the listings tonight and we can schedule showings for this weekend if you're available.

Looking forward to finding your perfect home,
[Agent Name]`,
    timeSaved: '3 min saved'
  },
  {
    id: 'crm',
    title: 'CRM Contact Notes',
    icon: '📋',
    context: 'Follow Up Boss / KVCore',
    rawDictation: "showing feedback for the garcias at 456 elm they loved the kitchen layout and the backyard but concerned about the road noise from the highway also thought the master bedroom was too small budget firm at 450k need to show them the maple ridge listing next week",
    polishedOutput: `Showing: 456 Elm St
Clients: The Garcias

Liked: Kitchen layout, backyard size
Concerns: Road noise from highway, master bedroom too small
Budget: Firm at $450K

Next step: Show Maple Ridge listing next week`,
    timeSaved: '2 min saved'
  },
  {
    id: 'showing-notes',
    title: 'Showing Debrief',
    icon: '📝',
    context: 'Notes App',
    rawDictation: "just finished three showings with the johnsons first house on pine street was a no they didn't like the split level layout second house on maple they really liked especially the renovated basement but over budget by 30k third house on birch was their favorite great flow open concept and in budget need to write offer tonight",
    polishedOutput: `Showing Debrief — The Johnsons

1. Pine St: NO — didn't like split-level layout
2. Maple Ave: LIKED — loved renovated basement, but $30K over budget
3. Birch Lane: FAVORITE — great flow, open concept, in budget

Action: Write offer on Birch Lane tonight`,
    timeSaved: '3 min saved'
  }
]

// Meeting intelligence for buyer consultation
export const BUYER_CONSULTATION: BuyerConsultation = {
  during: {
    title: "Initial Buyer Consultation — The Garcias",
    participants: ["You (Agent)", "Maria Garcia", "Carlos Garcia"],
    duration: "35 min",
    status: "Recording invisibly..."
  },
  after: {
    summary: "First-time buyers relocating from Austin for Carlos's new position at Merck. Timeline: close by August 1 for school enrollment. Pre-approved at $475K through Wells Fargo. Maria works remotely and needs dedicated office space.",
    actionItems: [
      { owner: "You", task: "Send 5 listings in Oak Hills and Riverside (3BR+, home office)", due: "Tonight" },
      { owner: "You", task: "Schedule showings for Saturday morning", due: "Tomorrow" },
      { owner: "You", task: "Connect Garcias with Sarah Chen (lender) for rate lock discussion", due: "Tomorrow" },
      { owner: "Maria", task: "Send school district preferences for search refinement", due: "Wednesday" }
    ],
    clientPreferences: [
      "3+ bedrooms, dedicated home office",
      "Good school district (elementary priority)",
      "Quiet neighborhood, low traffic",
      "Updated kitchen preferred, willing to renovate bathrooms",
      "Fenced yard for future dog",
      "Max 25 min commute to Merck campus"
    ],
    keyDecisions: [
      "Budget: $475K max, prefer under $450K",
      "Timeline: Must close by August 1",
      "Pre-approved through Wells Fargo at 6.25%",
      "Will consider homes that need minor updates"
    ]
  }
}

// Weekly time savings breakdown
export const TIME_SAVINGS = [
  { task: 'Listing descriptions', typing: 3, voice: 0.75, icon: '🏠' },
  { task: 'Client follow-up emails', typing: 4, voice: 1, icon: '📧' },
  { task: 'Showing notes & CRM', typing: 3.5, voice: 0.75, icon: '📋' },
  { task: 'Client call notes', typing: 3, voice: 0, icon: '📞' },
  { task: 'Offer & transaction docs', typing: 1.5, voice: 0.5, icon: '📄' },
]

// Speed comparison for hero
export const SPEED_COMPARISON = {
  phone: { label: 'Typing on phone', wpm: 25 },
  laptop: { label: 'Typing on laptop', wpm: 45 },
  voice: { label: 'WisprFlow dictation', wpm: 160 },
}
