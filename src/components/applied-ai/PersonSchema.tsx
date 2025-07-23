'use client'

import { appliedAiSkills } from '@/data/applied-ai-skills'
import { appliedAiExperience } from '@/data/applied-ai-experience'

export default function PersonSchema() {
  const allSkills = appliedAiSkills.flatMap(category => 
    category.skills.map(skill => skill.name)
  )

  const currentRole = appliedAiExperience[0] // Most recent experience

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Zachary D Proser",
    "alternateName": ["Zack Proser", "Zachary Proser"],
    "jobTitle": [
      "Staff AI Engineer",
      "Applied AI Engineer", 
      "Developer Education Specialist",
      "AI Technical Trainer"
    ],
    "description": "Staff-level Applied AI Engineer with 13+ years experience building scalable systems and 3+ years specializing in AI/LLM solutions, RAG systems, and enterprise AI infrastructure. Specializes in vector databases, machine learning, and AI architecture.",
    "url": "https://zackproser.com",
    "sameAs": [
      "https://linkedin.com/in/zackproser",
      "https://github.com/zackproser",
      "https://twitter.com/zackproser"
    ],
    "email": "zackproser@gmail.com",
    "image": "https://zackproser.com/avatars/zachary-proser-avatar.jpg",
    "knowsAbout": allSkills,
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Staff AI Engineer",
      "description": "Senior-level AI engineering role focusing on enterprise AI system architecture, LLM integration, and production AI infrastructure",
      "occupationLocation": "Remote",
      "estimatedSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": 180000,
          "maxValue": 250000,
          "unitText": "YEAR"
        }
      },
      "skills": allSkills.join(", "),
      "qualifications": "13+ years software engineering, 3+ years AI/ML infrastructure",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://zackproser.com/applied-ai-engineer"
      }
    },
    "worksFor": {
      "@type": "Organization",
      "name": currentRole.company,
      "url": currentRole.company === "WorkOS" ? "https://workos.com" : undefined
    },
    "alumniOf": [
      {
        "@type": "Organization", 
        "name": "Pinecone",
        "url": "https://pinecone.io"
      },
      {
        "@type": "Organization",
        "name": "Gruntwork", 
        "url": "https://gruntwork.io"
      },
      {
        "@type": "Organization",
        "name": "Cloudflare",
        "url": "https://cloudflare.com"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "AI Engineering Expertise",
        "credentialCategory": "Professional Experience",
        "competencyRequired": "RAG Systems, Vector Databases, LLM Integration"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Engineering Consulting",
          "description": "Enterprise AI system architecture and implementation"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "AI Technical Training",
          "description": "Corporate workshops on AI fundamentals and implementation"
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
} 