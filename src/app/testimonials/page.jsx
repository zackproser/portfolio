import Head from 'next/head'
import Image from 'next/image'

import { SimpleLayout } from '@/components/SimpleLayout'

import JimBrikman from '@/images/jim-brikman.webp'
import JohnFunge from '@/images/john-funge.webp'
import SachinFernandes from '@/images/sachin-fernandes.webp'
import PhilinaFan from '@/images/philina.webp'
import LeoScott from '@/images/leo-scott.webp'
import JoeryVanDruten from '@/images/joery.webp'
import EvelynTam from '@/images/evelyn-tam.webp'
import VenkatViswanathan from '@/images/venkat.webp'
import George from '@/images/george.webp'
import StevenFusco from '@/images/steven-fusco.webp'
import TomLuechtefeld from '@/images/tom-luechtefeld.webp'
import TomLandesman from '@/images/tom-landesman.webp'
import ChristianPaulus from '@/images/christian-paulus.webp'
import AnthonyDavanzo from '@/images/anthony-davanzo.webp'

import { generateOgUrl } from '@/utils/ogUrl'

const data = {
  title: 'Testimonials and social proof',
  description: 'What is it like to work with me?',
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Zack Proser&apos;s portfolio',
    images: [
      {
        url: ogUrl,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const featuredTestimonial = {
  body: "When I ran your software, I felt joy",
  author: {
    name: "Jim Brikman",
    title: "Co-founder of Gruntwork, OpenTofu and author of Terraform Up and Running",
    imageUrl: JimBrikman,
  },
}
const testimonials = [


  [
    [
      {
        body: "Zack is very resourceful, entrepreneurial and scrappy. He'll figure out a way of getting whatever it is done. As well as technical skills, Zack is rounded. He can write and he has broad interests - such as visual arts. Zack has a lot of initiative and will proactively take action when he sees something that needs to be done. I'd be remiss if I didn't mention Zack's work ethic. He never shied away from our demanding hours and would regularly spend the little after-work time he had deepening his technical skills. Lastly, Zack has a great sense of humor and is one of those folks that just makes work more fun. He's someone you want on your team.",
        author: {
          name: "John Funge",
          title: "Chief Product Officer at DataTribe",
          imageUrl: JohnFunge,
        },
      },
      {
        body: "Having a dedicated developer for a Marketing team is hard to come by, especially if they are a good one. Working with Zack at Cloudmark was the best. He always had a collaborative, team player mentality and exceeded expectations on all assigned projects, even those that required a quick turnaround. More importantly, Zack had great communications skills - from proactively providing a project status to any red flags during initial conversations. I would work with Zack again in a heartbeat.",
        author: {
          name: "Evelyn Tam",
          title: "Senior Communications Manager at MariaDB",
          imageUrl: EvelynTam,
        },
      },
      {
        body: "Take a look at the span of job titles, levels of seniority, and teams reflected in Zack's other recommendations. It's clear Zack brings the same level of near-crazy passion and dedication from his art to every aspect of his professional work. Whether it was cross-team collaboration, picking up a new technology, or complex problem solving, Zack excelled without skipping a beat. From my view, Zack's most impressive, and all-too-rare, trait is deep introspection. Given a problematic shortcoming or knowledge gap, he wields this introspection to quickly diagnose and navigate past situations that would pose as major hurdles to most people. Teapot approved, A+",
        author: {
          name: "Tom Landesman",
          title: "Staff Data Scientist at Proofpoint",
          imageUrl: TomLandesman,
        },
      },

    ],
    [
      {
        body: "I have worked with Zack on multiple projects. Every one of these encounters with him has not only made me a better engineer, but a better person. He is a brilliant engineer who truly cares about his code and the people who use it. He has the remarkable ability to pick apart hard problems (technical or otherwise) and put together a solution that benefits everyone. He is articulate, thoughtful, kind and exceptionally intelligent. Zack is also one of the only people I have ever met to have a real world implementation of an AI bot. His talents are as rare as they get and I unequivocally recommend him.",
        author: {
          name: "Sachin Fernandes",
          title: "Technical Lead at Cloudflare",
          imageUrl: SachinFernandes,
        },
      },
      {
        body: "I had the pleasure to work with Zack on several platform and web-services projects. Zack is extremely self-driven, coachable and always has the intention to move forward seeking to improve. He is very detail oriented and will not stop until he delivered what was asked for. He is very knowledgeable and has the patience to explain technical challenges to non-technical co-workers and stakeholders in such a way that they understand what is going on. Zack moved on to a different team where there is more room for him to grow and I have no doubt that he will succeed there as well. I would definitely recommend Zack to any team or company and if there is an opportunity, I would love to work with him again.",
        author: {
          name: "Joery van Druten",
          title: "Project Manager at Cloudflare",
          imageUrl: JoeryVanDruten,
        },
      },
      {
        body: "Zack is exactly the type of engineer you want on your team. He's smart, collaborative, and tremendously effective. Zack and I worked together building tools and websites to drive revenue and customer success. When challenging ideas were presented, Zack would jump at the opportunity to learn without any hint of hesitation to take on difficulty. Personally, he's kind, willing to help, and keeps a good sense of humor.",
        author: {
          name: "Anthony Davanzo",
          title: "Technical Product Marketing Manager at HashiCorp",
          imageUrl: AnthonyDavanzo,
        },
      },
    ],
  ],
  [
    [
      {
        body: "In my nearly two years at Cloudflare, I have had the pleasure of working closely with Zack. He is one of the most hardworking and self-motivated individuals I have ever met. He constantly does outstanding work and will go above and beyond on any project that he is part of. He has also always been a kind and patient teacher to me, whenever I had any inquiries about implementation. He is someone I would highly recommend for any future opportunities as he would be a valuable asset to any team he joins.",
        author: {
          name: "Philina Fan",
          title: "Product Designer at Asana",
          imageUrl: PhilinaFan,
        },
      },
      {
        body: "Zack helped us build web applications for our cancer clinical trial research studies. He was a pleasure to work with, I frequently come back to ask his advice on our other web development projects. If you have an opportunity to work with Zack you should take it.",
        author: {
          name: "Tom Luechtefeld",
          title: "CEO at Insilica",
          imageUrl: TomLuechtefeld,
        },
      },
      {
        body: "Zack is a great addition to any development team. He thinks fast, adapts to shifting requirements, and has proven he can quickly ramp up on the latest technologies to put them to good use.",
        author: {
          name: "Steven Fusco",
          title: "Senior Engineering Manager at Kryptowire",
          imageUrl: StevenFusco,
        },
      },
      {
        body: "I worked closely with Zack at Cloudflare. Zack was clearly the most talented, skilled and hard working developer in his team. I frequently tapped his brain for technical questions and he was always there to help. He is a true pleasure to work with and I can highly recommend him.",
        author: {
          name: "Christian Paulus",
          title: "VP Product Marketing at Cohesity",
          imageUrl: ChristianPaulus,
        },
      },
    ],
    [
      {
        body: "Zack is an all-round business athlete. Whether he's helping to brainstorm viral marketing strategies or working on your development team he's going to provide a ton of value. He's a fast learner and a hard worker, and is fun to work with.",
        author: {
          name: "Leo Scott",
          title: "Chief Innovation Officer at DataTribe",
          imageUrl: LeoScott,
        },
      },
      {
        body: "I had the opportunity to work with Zack at Cloudflare. Zack is very hard working and self motivated. Whenever he is given a new task he puts in the effort to learn and successfully complete it. But the most important quality I admire is he makes sure he shares that knowledge with everyone and always willing to help. Zack is amazing to work with and a great asset to the team.",
        author: {
          name: "Venkat Viswanathan",
          title: "Group Product Manager at Okta",
          imageUrl: VenkatViswanathan,
        },
      },
      {
        body: "Zack was an amazing contributor on the UX frontend for a new product we were launching. It was both a new market (Enterprise) and and new product (Spear phishing). As a result - it required a fair amount of intuitive design experience and iterative patience. Zack and his colleagues were instrumental in getting early versions of the UX built and adapting it as we developed insights into both how the user might experience things AND how the technology would interpret things. A very strong contributor to a new initiative and a dynamic environment.",
        author: {
          name: "George Riedel",
          title: "CEO at Cloudmark. Professor at Harvard Business School",
          imageUrl: George,
        },
      }

    ],
  ],
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <>
      <Head>
        <title>Zachary Proser testimonials</title>
        <meta
          name="description"
          content="testimonials from people who have worked with me"
        />
      </Head>
      <SimpleLayout
        title="What's it like to work with me?"
        intro="Let's ask some folks who have..."
      >
        <div className="relative isolate">
          <div
            className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
            aria-hidden="true"
          >
            <div
              className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-blue-600 to-blue-400"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-blue-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400 sm:text-2xl">
                From colleagues, clients and collaborators
              </h2>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 dark:text-gray-300 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
              <figure className="col-span-2 hidden sm:block sm:rounded-2xl sm:bg-white sm:shadow-lg sm:ring-1 sm:ring-gray-900/5 dark:sm:bg-gray-800 dark:sm:ring-gray-700/5 xl:col-start-2 xl:row-end-1">
                <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                  <p>{`"${featuredTestimonial.body}"`}</p>
                </blockquote>
                <figcaption className="flex items-center gap-x-4 border-t border-gray-100 dark:border-gray-700 px-6 py-4">
                  <Image
                    className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-700"
                    src={featuredTestimonial.author.imageUrl}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{featuredTestimonial.author.name}</div>
                    <div className="text-gray-600 dark:text-gray-400">{`${featuredTestimonial.author.title}`}</div>
                  </div>
                </figcaption>
              </figure>
              
              {testimonials.map((columnGroup, columnGroupIdx) => (
                <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
                  {columnGroup.map((column, columnIdx) => (
                    <div
                      key={columnIdx}
                      className={classNames(
                        (columnGroupIdx === 0 && columnIdx === 0) ||
                          (columnGroupIdx === testimonials.length - 1 && columnIdx === columnGroup.length - 1)
                          ? 'xl:row-span-2'
                          : '',
                        'space-y-8'
                      )}
                    >
                      {column.map((testimonial) => (
                        <figure
                          key={testimonial.author.name}
                          className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700/5"
                        >
                          <blockquote className="text-gray-900 dark:text-gray-100">
                            <p>{`"${testimonial.body}"`}</p>
                          </blockquote>
                          <figcaption className="mt-6 flex items-center gap-x-4">
                            <Image
                              className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-700"
                              src={testimonial.author.imageUrl}
                              alt=""
                              width={40}
                              height={40}
                            />
                            <div>
                              <div className="font-semibold text-blue-700 dark:text-blue-300">{testimonial.author.name}</div>
                              <div className="text-gray-600 dark:text-gray-400">{`${testimonial.author.title}`}</div>
                            </div>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SimpleLayout>
    </>
  )
}

