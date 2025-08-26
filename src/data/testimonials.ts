// Prefer CDN URLs for reliability in all environments
const JimBrikman = 'https://zackproser.b-cdn.net/images/jim-brikman.webp'
import JohnFunge from '@/images/john-funge.webp'
const SachinFernandes = 'https://zackproser.b-cdn.net/images/sachin-fernandes.webp'
import PhilinaFan from '@/images/philina.webp'
import StevenFusco from '@/images/steven-fusco.webp'
import ChristianPaulus from '@/images/christian-paulus.webp'
import AnthonyDavanzo from '@/images/anthony-davanzo.webp'
import TomLandesman from '@/images/tom-landesman.webp'
import TomLuechtefeld from '@/images/tom-luechtefeld.webp'
import JoeryVanDruten from '@/images/joery.webp'
import CorbettWaddingham from '@/images/testimonials/cory.webp'
import KevinButler from '@/images/testimonials/kevin.webp'

/**
 * Structure for a testimonial author
 */
export interface TestimonialAuthor {
  name: string;
  role: string;
  imageUrl?: any;
}

/**
 * Structure for a testimonial
 */
export interface Testimonial {
  content: string;
  author: TestimonialAuthor;
  category?: string[]; // For categorizing testimonials (e.g., 'technical', 'teaching', 'leadership')
}

// Featured testimonial from Jim Brikman
export const featuredTestimonial: Testimonial = {
  content: "When I ran your software, I felt joy",
  author: {
    name: "Jim Brikman",
    role: "Co-founder of Gruntwork, OpenTofu and author of Terraform Up and Running",
    imageUrl: JimBrikman
  },
  category: ['product', 'engineering']
};

// Collection of all testimonials with categorization
export const allTestimonials: Testimonial[] = [
  featuredTestimonial,
  
  // Technical expertise testimonials
  {
    content: "He is a brilliant engineer who truly cares about his code and the people who use it. He has the remarkable ability to pick apart hard problems (technical or otherwise) and put together a solution that benefits everyone.",
    author: {
      name: "Sachin Fernandes",
      role: "Technical Lead at Cloudflare",
      imageUrl: SachinFernandes
    },
    category: ['technical', 'engineering', 'problem-solving']
  },
  
  // Educational/teaching testimonials
  {
    content: "He is one of the most hardworking and self-motivated individuals I have ever met. He has also always been a kind and patient teacher to me, whenever I had any inquiries about implementation.",
    author: {
      name: "Philina Fan",
      role: "Product Designer at Asana",
      imageUrl: PhilinaFan
    },
    category: ['teaching', 'mentorship', 'patience']
  },
  
  // Practical implementation testimonials 
  {
    content: "Zack thinks fast, adapts to shifting requirements, and has proven he can quickly ramp up on the latest technologies to put them to good use.",
    author: {
      name: "Steven Fusco",
      role: "Senior Engineering Manager at Kryptowire",
      imageUrl: StevenFusco
    },
    category: ['technical', 'adaptability', 'learning']
  },
  
  // High-value expertise testimonials
  {
    content: "Zack was clearly the most talented, skilled and hard working developer in his team. I frequently tapped his brain for technical questions and he was always there to help.",
    author: {
      name: "Christian Paulus",
      role: "VP Product Marketing at Cohesity",
      imageUrl: ChristianPaulus
    },
    category: ['expertise', 'technical', 'helpfulness']
  },
  
  // Complex subject matter testimonials
  {
    content: "When challenging ideas were presented, Zack would jump at the opportunity to learn without any hint of hesitation to take on difficulty.",
    author: {
      name: "Anthony Davanzo",
      role: "Technical Product Marketing Manager at HashiCorp",
      imageUrl: AnthonyDavanzo
    },
    category: ['learning', 'challenge', 'problem-solving']
  },
  
  // Full testimonials from the testimonials page
  {
    content: "Zack is very resourceful, entrepreneurial and scrappy. He'll figure out a way of getting whatever it is done. As well as technical skills, Zack is rounded. He can write and he has broad interests - such as visual arts.",
    author: {
      name: "John Funge",
      role: "Chief Product Officer at DataTribe",
      imageUrl: JohnFunge
    },
    category: ['versatility', 'entrepreneurial', 'creativity']
  },
  {
    content: "Take a look at the span of job titles, levels of seniority, and teams reflected in Zack's other recommendations. It's clear Zack brings the same level of near-crazy passion and dedication from his art to every aspect of his professional work.",
    author: {
      name: "Tom Landesman",
      role: "Staff Data Scientist at Proofpoint",
      imageUrl: TomLandesman
    },
    category: ['passion', 'dedication', 'professionalism']
  },
  {
    content: "Zack helped us build web applications for our cancer clinical trial research studies. He was a pleasure to work with, I frequently come back to ask his advice on our other web development projects.",
    author: {
      name: "Tom Luechtefeld",
      role: "CEO at Insilica",
      imageUrl: TomLuechtefeld
    },
    category: ['technical', 'consulting', 'healthcare']
  },
  {
    content: "Zack is extremely self-driven, coachable and always has the intention to move forward seeking to improve. He is very detail oriented and will not stop until he delivered what was asked for.",
    author: {
      name: "Joery van Druten",
      role: "Project Manager at Cloudflare",
      imageUrl: JoeryVanDruten
    },
    category: ['dedication', 'detail-oriented', 'improvement']
  },
  {
    content: "Zack is one of the most talented coders I've worked with. His ability to think outside the box and find novel solutions to old problems is unmatched. On top of all that, his stage presence, whether conducting a webinar or giving a presentation to a crowded room, is top tier. And personally he's a great guy to work with, always willing to help and go above and beyond.",
    author: {
      name: "Corbett Waddingham",
      role: "Senior Staff Engineer at Gruntwork",
      imageUrl: CorbettWaddingham
    },
    category: ['technical', 'creativity', 'presentation', 'helpfulness']
  },
  {
    content: "I had the pleasure of working closely with Zack on the Pinecone Showcase project—a platform we built to empower the entire Pinecone team with on-demand, interactive demos to showcase the power of vector databases. Together, we developed everything from full-stack infrastructure (database, authentication, front-end, and backend) to a suite of compelling, real-world demonstrations. Zack brought deep full-stack expertise to the table, and I was consistently impressed not just by how much he already knew, but by how quickly he could pick up new technologies with curiosity, discipline, and zero reliance on shortcuts. He approaches challenges head-on, with a blend of thoroughness and creativity that's rare and refreshing. Beyond his technical chops, Zack is a fantastic teammate. He's a go-to sounding board—both thoughtful and generous with his time—and he brings a great sense of humor that makes collaboration fun. He's also a natural in developer relations: clear, patient, and compelling in front of any audience. I'd trust him to represent a product, teach a workshop, or dive deep into code with a customer—he's that versatile. Zack is the kind of person you want on your team—technically exceptional, endlessly curious, and genuinely enjoyable to work with.",
    author: {
      name: "Kevin Butler",
      role: "Senior Software Engineer at Pinecone",
      imageUrl: KevinButler
    },
    category: ['technical', 'full-stack', 'learning', 'teamwork', 'devrel']
  }
];

// Function to get testimonials by category
export function getTestimonialsByCategory(categories: string[]): Testimonial[] {
  return allTestimonials.filter(testimonial => 
    testimonial.category && 
    testimonial.category.some(category => categories.includes(category))
  );
}

// Function to get best testimonials for product/course conversion
export function getConversionTestimonials(count: number = 3): Testimonial[] {
  // We'll create a prioritized list of testimonials for conversion
  const prioritizedTestimonials: Testimonial[] = [
    // Start with the featured testimonial
    featuredTestimonial,
    
    // Technical expertise testimonials (particularly effective for technical products)
    ...getTestimonialsByCategory(['technical', 'expertise']),
    
    // Problem-solving testimonials (show you can tackle complex issues)
    ...getTestimonialsByCategory(['problem-solving']),
    
    // Teaching-related testimonials (good for courses)
    ...getTestimonialsByCategory(['teaching', 'mentorship']),
    
    // Dedication and work ethic testimonials
    ...getTestimonialsByCategory(['dedication', 'detail-oriented']),
    
    // Add any remaining testimonials at lower priority
    ...allTestimonials
  ];
  
  // Filter out duplicates using Set
  const uniqueTestimonials = Array.from(
    new Map(prioritizedTestimonials.map(item => [item.content, item])).values()
  );
  
  // Return the requested number
  return uniqueTestimonials.slice(0, count);
}

// Export sample testimonials for marketing
export const sampleProductTestimonials = [
  [
    {
      content:
        'The RAG pipeline examples in this book helped us reduce our API costs by 40%. A must-read for anyone building production LLM applications.',
      author: {
        name: 'Sarah Chen',
        role: 'ML Engineer at TechCorp',
      },
    },
    {
      content:
        'Finally, a practical guide that goes beyond theory. The chunking strategies section alone was worth the price of the book.',
      author: {
        name: 'Michael Rodriguez',
        role: 'Senior Developer at DataAI',
      },
    },
  ],
  [
    {
      content:
        'This book helped our team standardize our RAG implementation across multiple projects. The production deployment chapter is excellent.',
      author: {
        name: 'Emily Thompson',
        role: 'Tech Lead at AIScale',
      },
    },
    {
      content:
        'Clear explanations of complex concepts. The cost optimization strategies have already saved us thousands in API costs.',
      author: {
        name: 'David Kim',
        role: 'CTO at SearchAI',
      },
    },
  ],
  [
    {
      content:
        'The best resource I\'ve found on building production-ready RAG systems. The error handling section is particularly valuable.',
      author: {
        name: 'Lisa Patel',
        role: 'AI Engineer at SearchTech',
      },
    },
    {
      content:
        'Comprehensive and practical. The monitoring and evaluation chapter helped us improve our RAG pipeline\'s accuracy significantly.',
      author: {
        name: 'James Wilson',
        role: 'Lead Developer at AIHub',
      },
    },
  ],
];
