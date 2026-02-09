// Legal-specific scenarios and data for the Lawyer Voice AI demo

export interface LawyerScenario {
  id: string
  title: string
  icon: string
  context: string
  rawDictation: string
  polishedOutput: string
  timeSaved: string
}

export interface ClientConsultation {
  during: {
    title: string
    participants: string[]
    duration: string
    status: string
  }
  after: {
    summary: string
    actionItems: { owner: string; task: string; due: string }[]
    caseFacts: string[]
    liabilityAnalysis: string[]
    keyDates: string[]
  }
}

// Document drafting pipeline - from dictation to polished legal prose
export const DOCUMENT_PIPELINE = {
  dictation: {
    documentType: 'Motion for Summary Judgment',
    rawDictation: "ok so the defendant um argues that there's a genuine dispute of material fact regarding the uh the duty of care but your honor the undisputed evidence shows that defendant knew about the hazardous condition for um at least six months prior to the incident the maintenance logs which are exhibit C clearly document repeated complaints and the defendant's own facility manager testified in his deposition that he was quote aware of the problem end quote so there's really no genuine issue here the plaintiff is entitled to judgment as a matter of law",
    enhanced: `The Defendant argues that a genuine dispute of material fact exists regarding the duty of care. However, the undisputed evidence demonstrates that Defendant had actual knowledge of the hazardous condition for no fewer than six months prior to the incident.

The maintenance logs, attached hereto as Exhibit C, document repeated complaints regarding the condition. Moreover, Defendant's own facility manager testified during his deposition that he was "aware of the problem." (Deposition of J. Mitchell, p. 47, ll. 12-15.)

Accordingly, no genuine issue of material fact exists, and Plaintiff is entitled to judgment as a matter of law pursuant to Fed. R. Civ. P. 56(a).`,
    stats: {
      rawWords: 97,
      enhancedWords: 89,
      dictationTime: '35 seconds',
      typingTime: '4+ minutes'
    }
  }
}

// Context-aware scenarios for lawyers
export const LAWYER_SCENARIOS: LawyerScenario[] = [
  {
    id: 'brief',
    title: 'Brief / Motion Section',
    icon: '\u2696\uFE0F',
    context: 'Word / Legal Document',
    rawDictation: "the court should deny defendant's motion to dismiss because plaintiff has adequately pled all elements of a negligence claim um specifically the complaint alleges that defendant owed a duty of care breached that duty through its failure to maintain the premises and that this breach was the proximate cause of plaintiff's injuries which are supported by the attached medical records",
    polishedOutput: `The Court should deny Defendant's Motion to Dismiss because Plaintiff has adequately pled all elements of a negligence claim. Specifically, the Complaint alleges that: (1) Defendant owed a duty of care to Plaintiff; (2) Defendant breached that duty through its failure to maintain the premises in a reasonably safe condition; and (3) Defendant's breach was the proximate cause of Plaintiff's injuries, which are substantiated by the attached medical records. See Compl. \u00B6\u00B6 12-27.`,
    timeSaved: '5 min saved'
  },
  {
    id: 'email',
    title: 'Client Email',
    icon: '\uD83D\uDCE7',
    context: 'Gmail / Outlook',
    rawDictation: "hi mrs chen I wanted to give you a quick update on your case we received the defendant's discovery responses yesterday and I've reviewed them there are some gaps in what they produced so I'm going to file a motion to compel on the interrogatories regarding their maintenance schedule also the mediation has been set for march 15th please block that date I'll send you a prep memo next week",
    polishedOutput: `Dear Mrs. Chen,

I wanted to provide you with a brief update on your case.

We received the Defendant's discovery responses yesterday. After reviewing them, I identified several gaps in their production. I will be filing a Motion to Compel regarding the interrogatories related to their maintenance schedule.

Additionally, mediation has been scheduled for March 15th. Please block that date on your calendar. I will send you a preparation memorandum the following week so we can discuss strategy beforehand.

Please don't hesitate to reach out if you have any questions.

Best regards,
[Attorney Name]`,
    timeSaved: '4 min saved'
  },
  {
    id: 'time-entry',
    title: 'Billing / Time Entry',
    icon: '\u23F1\uFE0F',
    context: 'Clio / MyCase / Billing Software',
    rawDictation: "chen versus lakewood properties one point five hours reviewed defendant's responses to first set of interrogatories and requests for production identified deficiencies in responses to interrogatories 4 7 and 12 began drafting motion to compel also point three hours phone call with client to discuss mediation scheduling and case strategy",
    polishedOutput: `Chen v. Lakewood Properties, LLC

1.5 hrs \u2014 Review and analysis of Defendant's Responses to Plaintiff's First Set of Interrogatories and Requests for Production of Documents; identified deficiencies in Responses to Interrogatories Nos. 4, 7, and 12; commenced drafting Motion to Compel.

0.3 hrs \u2014 Telephone conference with client re: mediation scheduling and case strategy discussion.

Total: 1.8 hrs`,
    timeSaved: '3 min saved'
  },
  {
    id: 'case-notes',
    title: 'Case Notes / Memo to File',
    icon: '\uD83D\uDCDD',
    context: 'Case Management System',
    rawDictation: "memo to file chen matter just got off the phone with opposing counsel jim Brady he indicated his client might be willing to settle in the range of 85 to 95k which is below our demand of 150 but above their initial offer of 50 he also mentioned they want to avoid trial because their key witness the facility manager relocated to another state need to discuss settlement range with client before mediation",
    polishedOutput: `MEMORANDUM TO FILE
Re: Chen v. Lakewood Properties, LLC
Date: [Current Date]

Spoke with opposing counsel, James Brady, via telephone.

Key Points:
\u2022 Defendant may be willing to settle in the range of $85,000\u2013$95,000
\u2022 Our current demand: $150,000 | Their initial offer: $50,000
\u2022 Defense concern: Key witness (facility manager) has relocated out of state, creating trial complications

Action Required:
\u2192 Schedule call with Mrs. Chen to discuss acceptable settlement range prior to March 15 mediation`,
    timeSaved: '3 min saved'
  }
]

// Meeting intelligence for client consultation
export const CLIENT_CONSULTATION: ClientConsultation = {
  during: {
    title: "Initial Client Consultation \u2014 Personal Injury",
    participants: ["You (Attorney)", "Margaret Chen"],
    duration: "45 min",
    status: "Recording invisibly..."
  },
  after: {
    summary: "New personal injury matter. Client slipped and fell at Lakewood Properties shopping center on November 12, 2025. Sustained fractured wrist and herniated disc. Client was treated at St. Mary's ER and has been receiving ongoing physical therapy. Property owner had prior notice of the hazardous condition per maintenance logs. Statute of limitations runs November 2027. Client has $47K in medical bills to date and missed 6 weeks of work.",
    actionItems: [
      { owner: "You", task: "Send engagement letter and fee agreement for signature", due: "Today" },
      { owner: "You", task: "Request incident report from Lakewood Properties management", due: "This week" },
      { owner: "You", task: "Send medical records authorization forms to client", due: "Today" },
      { owner: "Paralegal", task: "Order police/incident report and pull property inspection records", due: "This week" },
      { owner: "Margaret", task: "Gather all medical bills, receipts, and wage loss documentation", due: "Next Friday" }
    ],
    caseFacts: [
      "Slip and fall at Lakewood Properties shopping center, Nov. 12, 2025",
      "Wet floor near entrance, no warning signs posted",
      "Fractured right wrist, herniated disc (L4-L5)",
      "ER visit at St. Mary's, ongoing PT 2x/week",
      "$47,000 in medical expenses to date",
      "6 weeks missed work, lost wages ~$12,000",
      "Two eyewitnesses present (names and contacts obtained)"
    ],
    liabilityAnalysis: [
      "Strong premises liability case \u2014 prior notice established via maintenance logs",
      "No comparative negligence concerns \u2014 client wearing appropriate footwear, walking normally",
      "Property owner failed to place warning signs despite known condition",
      "Facility manager deposition likely favorable based on maintenance records"
    ],
    keyDates: [
      "Incident date: November 12, 2025",
      "Statute of limitations: November 12, 2027",
      "Next PT appointment: February 14, 2026",
      "Follow-up with client: February 21, 2026"
    ]
  }
}

// Weekly time savings breakdown
export const TIME_SAVINGS = [
  { task: 'Document drafting (briefs, motions, memos)', typing: 5, voice: 1.25, icon: '\uD83D\uDCDC' },
  { task: 'Client correspondence', typing: 3, voice: 0.75, icon: '\uD83D\uDCE7' },
  { task: 'Time entries / billing', typing: 2.5, voice: 0.5, icon: '\u23F1\uFE0F' },
  { task: 'Client meeting notes', typing: 3, voice: 0, icon: '\uD83D\uDCDE' },
  { task: 'Discovery / deposition prep', typing: 2.5, voice: 0.75, icon: '\uD83D\uDD0D' },
]

// Speed comparison for hero
export const SPEED_COMPARISON = {
  phone: { label: 'Typing on phone', wpm: 25 },
  laptop: { label: 'Typing on laptop', wpm: 45 },
  voice: { label: 'WisprFlow dictation', wpm: 160 },
}
