import Link from 'next/link';
import RandomImage from '@/components/RandomImage';
import RenderNumYearsExperience from '@/components/NumYearsExperience';
import { Container } from '@/components/Container';

const HeroSection = ({ title, content, href, imageSrc, imageAlt, buttonText, reverse = false }) => (
  <section className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center min-h-screen px-4 md:px-6`}>
    <div className="flex-1 md:mb-0">
      <h2 className="text-3xl md:text-4xl font-bold mx-4 text-gray-800 dark:text-white">{title}</h2>
      <p className="text-lg m-4 text-gray-600 dark:text-zinc-400">{content}</p>
      <Link href={href}>
        <button className="bg-blue-500 hover:bg-blue-600 text-white mt-6 font-bold p-4 mx-4 rounded transition duration-300">
          {buttonText}
        </button>
      </Link>
    </div>
    <div className="flex-1 flex justify-center mx-6">
      <RandomImage />
    </div>
  </section>
);

export default function AboutPage() {

  const devDescription = `With ${RenderNumYearsExperience()} years of experience in software development, I bring a wealth of knowledge to every project. My expertise spans multiple languages and frameworks, allowing me to tackle complex challenges with innovative solutions.`

  return (
    <Container>
      <div className="container mx-auto">
        <HeroSection
          title="Staff-Level Developer"
          content={devDescription}
          imageSrc="/images/developer.jpg"
          href="/projects"
          imageAlt="Developer at work"
          buttonText="View Projects"
        />
        <HeroSection
          title="Content Creator"
          content="As a passionate content creator, I craft engaging and informative material that resonates with audiences. From blog posts to video scripts, I bring ideas to life in compelling ways."
          imageSrc="/images/content-creation.jpg"
          href="/blog"
          imageAlt="Content creation process"
          buttonText="Explore Content"
          reverse={true}
        />
        <HeroSection
          title="Technical Writer"
          content="Clear, concise, and accurate technical documentation is my specialty. I bridge the gap between complex technical concepts and user-friendly explanations, ensuring that information is accessible to all."
          imageSrc="/images/technical-writing.jpg"
          href="/publications"
          imageAlt="Technical writing example"
          buttonText="See Publications"
        />
      </div>
    </Container>);
}
