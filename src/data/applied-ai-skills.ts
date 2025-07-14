export interface SkillData {
  name: string;
  proficiency: 'Expert' | 'Advanced' | 'Intermediate';
  yearsExperience?: number;
}

export interface SkillCategory {
  category: string;
  skills: SkillData[];
}

export const appliedAiSkills: SkillCategory[] = [
  {
    category: "AI/ML Technologies",
    skills: [
      { name: "LangChain", proficiency: "Expert", yearsExperience: 2 },
      { name: "Vector Databases", proficiency: "Expert", yearsExperience: 2 },
      { name: "OpenAI API", proficiency: "Expert", yearsExperience: 3 },
      { name: "Anthropic Claude", proficiency: "Advanced", yearsExperience: 2 },
      { name: "Model Fine-tuning", proficiency: "Advanced", yearsExperience: 1 },
      { name: "RAG Systems", proficiency: "Expert", yearsExperience: 2 }
    ]
  },
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", proficiency: "Expert", yearsExperience: 8 },
      { name: "JavaScript/TypeScript", proficiency: "Expert", yearsExperience: 10 },
      { name: "Go", proficiency: "Advanced", yearsExperience: 5 },
      { name: "SQL", proficiency: "Advanced", yearsExperience: 8 }
    ]
  },
  {
    category: "Infrastructure & Cloud",
    skills: [
      { name: "AWS", proficiency: "Expert", yearsExperience: 6 },
      { name: "Kubernetes", proficiency: "Advanced", yearsExperience: 4 },
      { name: "Docker", proficiency: "Expert", yearsExperience: 7 },
      { name: "Terraform", proficiency: "Advanced", yearsExperience: 3 }
    ]
  },
  {
    category: "Web Development",
    skills: [
      { name: "Next.js", proficiency: "Expert", yearsExperience: 5 },
      { name: "React", proficiency: "Expert", yearsExperience: 7 },
      { name: "Tailwind CSS", proficiency: "Advanced", yearsExperience: 3 },
      { name: "Node.js", proficiency: "Expert", yearsExperience: 8 }
    ]
  }
]; 