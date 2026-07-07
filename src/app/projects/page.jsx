import { createMetadata } from '@/utils/createMetadata'
import ProjectsClient from './projects-client'

export const metadata = createMetadata({
  title: "Zachary Proser's projects",
  description: "A searchable catalog of Zachary Proser's projects and open-source contributions across AI, machine learning, infrastructure, developer tools, and the web.",
  author: "Zachary Proser",
  type: "website",
});

import ProjectsData from './projects-data'

export default function Projects() {
  return <ProjectsClientWrapper />
}

function ProjectsClientWrapper() {
  const { projects, categories, allTags, companies } = ProjectsData
  return (
    <ProjectsClient
      projects={projects}
      categories={categories}
      allTags={allTags}
      companies={companies}
    />
  )
}
