export type NewsletterTemplateType = 
  | "tool-review" 
  | "roundup" 
  | "tutorial" 
  | "opinion" 
  | "general"

interface NewsletterTemplate {
  name: string
  description: string
  structure: string
}

export const NEWSLETTER_TEMPLATES: Record<NewsletterTemplateType, NewsletterTemplate> = {
  "tool-review": {
    name: "Tool Review / Deep-Dive",
    description: "In-depth review of a specific tool or product",
    structure: `## Table of contents

## [Hook: Start with a specific moment or problem]

I just spent [timeframe] using [tool name], and here's what I discovered...

## What is [Tool Name]?

[Brief explanation of what the tool does - 2-3 sentences]

## Why This Matters

[The problem it solves and why developers should care]

## How I Actually Use It

[Your personal workflow and integration - be specific with examples]

### My Setup

[Configuration, settings, integrations you use]

### Daily Workflow

[How it fits into your routine]

## Key Features

### [Feature 1]

[Description with example]

### [Feature 2]

[Description with example]

### [Feature 3]

[Description with example]

## The Honest Assessment

### What Works Well

- [Pro 1]
- [Pro 2]
- [Pro 3]

### What Could Be Better

- [Con 1]
- [Con 2]

### Who This Is Best For

[Specific audience and use cases]

## The Verdict

[Clear recommendation with any caveats]

## Try It Yourself

[Call to action with link]

---

*What tools are you using for [related task]? Reply and let me know.*
`
  },
  
  "roundup": {
    name: "Weekly Roundup",
    description: "Curated links with your commentary",
    structure: `## Table of contents

## This Week in AI/Dev Tools

[Brief intro on the theme or why these links matter this week]

---

## 🔗 Links Worth Your Time

### 1. [Title of First Link]

[Link URL]

[2-3 sentence summary of why it's interesting]

**My Take:** [Your personal perspective or how you might use this]

---

### 2. [Title of Second Link]

[Link URL]

[2-3 sentence summary]

**My Take:** [Your perspective]

---

### 3. [Title of Third Link]

[Link URL]

[2-3 sentence summary]

**My Take:** [Your perspective]

---

### 4. [Title of Fourth Link]

[Link URL]

[2-3 sentence summary]

**My Take:** [Your perspective]

---

### 5. [Title of Fifth Link] (Optional)

[Link URL]

[2-3 sentence summary]

**My Take:** [Your perspective]

---

## 📝 What I'm Working On

[Brief personal update - what you're building, thinking about, or learning]

---

## 💬 Reply & Share

Found something interesting this week? Hit reply and share it with me.

[Call to action - share the newsletter, check out a resource, etc.]
`
  },
  
  "tutorial": {
    name: "Tutorial / How-To",
    description: "Step-by-step guide with code examples",
    structure: `## Table of contents

## The Problem

[What pain point or goal are we addressing? Make it relatable with a specific scenario]

## What We're Building

[High-level overview of the solution - what readers will have by the end]

### Prerequisites

- [Prerequisite 1]
- [Prerequisite 2]
- [Any tools or accounts needed]

## Step 1: [First Step Title]

[Explanation of what we're doing and why]

\`\`\`typescript
// Code example
\`\`\`

[Brief explanation of the code]

## Step 2: [Second Step Title]

[Explanation]

\`\`\`typescript
// Code example
\`\`\`

[Explanation]

## Step 3: [Third Step Title]

[Explanation]

\`\`\`typescript
// Code example
\`\`\`

[Explanation]

## Step 4: [Fourth Step Title]

[Explanation]

\`\`\`typescript
// Code example
\`\`\`

[Explanation]

## Putting It All Together

[Show the complete solution or how the pieces connect]

\`\`\`typescript
// Complete example
\`\`\`

## Tips & Common Gotchas

### ⚠️ [Gotcha 1]

[Common mistake and how to avoid it]

### ⚠️ [Gotcha 2]

[Common mistake and how to avoid it]

### 💡 Pro Tip

[Advanced tip for those who want to go further]

## Resources

- [Resource 1 with link]
- [Resource 2 with link]
- [Documentation link]

## What's Next?

[Encourage readers to try it and share results]

---

*Questions? Reply to this email or find me on [platform].*
`
  },
  
  "opinion": {
    name: "Opinion / Commentary",
    description: "Industry insights and hot takes",
    structure: `## Table of contents

## [The Hot Take / Main Thesis]

[Lead with your main opinion or controversial statement - make it bold and clear]

## The Context

[Background that explains why this matters now - recent events, trends, or changes that prompted this piece]

## Why I Think This

[Detailed argument with evidence and examples]

### [Supporting Point 1]

[Explanation with specific examples or data]

### [Supporting Point 2]

[Explanation with specific examples or data]

### [Supporting Point 3]

[Explanation with specific examples or data]

## The Other Side

[Acknowledge counterarguments fairly - what would someone who disagrees say?]

[Why you still hold your position despite these counterpoints]

## What This Means

### For Individual Developers

[Implications and action items]

### For Teams/Companies

[Implications and action items]

### For the Industry

[Broader implications]

## My Prediction

[Where do you think this is heading? Be specific about timeframe if possible]

## What Do You Think?

[Invite discussion - genuinely want to hear alternative viewpoints]

---

*Agree? Disagree? Reply and tell me why I'm wrong (or right).*
`
  },
  
  "general": {
    name: "General / Flexible",
    description: "Open format for any topic",
    structure: `## Table of contents

## [Compelling Hook / Opening]

[Start with something that grabs attention - a story, surprising fact, or relatable problem]

## [Main Section 1]

[Your first major point or section]

## [Main Section 2]

[Your second major point or section]

## [Main Section 3]

[Your third major point or section]

## Key Takeaways

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

## What's Next

[Call to action - what should readers do with this information?]

---

*[Closing line - invite replies, shares, or point to additional resources]*
`
  }
}


