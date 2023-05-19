import Head from 'next/head'

import Image from 'next/image'

import JohnFunge from '@/images/john-funge.jpg'
import SachinFernandes from '@/images/sachin-fernandes.jpg'
import PhilinaFan from '@/images/philina.jpg'
import LeoScott from '@/images/leo-scott.jpg'
import JoeryVanDruten from '@/images/joery.jpg'
import EvelynTam from '@/images/evelyn-tam.jpg'
import VenkatViswanathan from '@/images/venkat.jpg'
import George from '@/images/george.jpg'
import StevenFusco from '@/images/steven-fusco.jpg'
import TomLuechtefeld from '@/images/tom-luechtefeld.jpg'
import TomLandesman from '@/images/tom-landesman.jpg'
import ChristianPaulus from '@/images/christian-paulus.jpg'
import AnthonyDavanzo from '@/images/anthony-davanzo.jpg'

import { SimpleLayout } from '@/components/SimpleLayout'

const testimonials = [
  {
    "name": "John Funge",
    "title": "Chief Product Officer at DataTribe",
    "quote": "Zack is very resourceful, entrepreneurial and scrappy. He’ll figure out a way of getting whatever it is done. As well as technical skills, Zack is rounded. He can write and he has broad interests - such as visual arts. Zack has a lot of initiative and will proactively take action when he sees something that needs to be done. I’d be remiss if I didn’t mention Zack’s work ethic. He never shied away from our demanding hours and would regularly spend the little after-work time he had deepening his technical skills. Lastly, Zack has a great sense of humor and is one of those folks that just makes work more fun. He’s someone you want on your team.",
    "imgSrc": JohnFunge,
  },
  {
    "name": "Sachin Fernandes",
    "title": "Systems Engineer at Cloudflare",
    "quote": "I have worked with Zack on multiple projects. Every one of these encounters with him has not only made me a better engineer, but a better person. He is a brilliant engineer who truly cares about his code and the people who use it. He has the remarkable ability to pick apart hard problems (technical or otherwise) and put together a solution that benefits everyone. He is articulate, thoughtful, kind and exceptionally intelligent. Zack is also one of the only people I have ever met to have a real world implementation of an AI bot. His talents are as rare as they get and I unequivocally recommend him.",
    "imgSrc": SachinFernandes,
  },
  {
    "name": "Philina Fan",
    "title": "Product Designer at Asana",
    "quote": "In my nearly two years at Cloudflare, I have had the pleasure of working closely with Zack. He is one of the most hardworking and self-motivated individuals I have ever met. He constantly does outstanding work and will go above and beyond on any project that he is part of. He has also always been a kind and patient teacher to me, whenever I had any inquiries about implementation. He is someone I would highly recommend for any future opportunities as he would be a valuable asset to any team he joins.",
    "imgSrc": PhilinaFan,
  },
  {
    "name": "Leo Scott",
    "title": "CTO at WealthEngine",
    "quote": "Zack is an all-round business athlete. Whether he’s helping to brainstorm viral marketing strategies or working on your development team he’s going to provide a ton of value. He’s a fast learner and a hard worker, and is fun to work with.",
    "imgSrc": LeoScott,

  },
  {
    "name": "Joery van Druten",
    "title": "Project Manager at Cloudflare",
    "quote": "I had the pleasure to work with Zack on several platform and web-services projects. Zack is extremely self-driven, coachable and always has the intention to move forward seeking to improve. He is very detail oriented and will not stop until he delivered what was asked for. He is very knowledgeable and has the patience to explain technical challenges to non-technical co-workers and stakeholders in such a way that they understand what is going on. Zack moved on to a different team where there is more room for him to grow and I have no doubt that he will succeed there as well. I would definitely recommend Zack to any team or company and if there is an opportunity, I would love to work with him again.",
    "imgSrc": JoeryVanDruten,
  },
  {
    "name": "Evelyn Tam",
    "title": "Senior Marketing Communications Manager at WePay",
    "quote": "Having a dedicated developer for a Marketing team is hard to come by, especially if they are a good one. Working with Zack at Cloudmark was the best. He always had a collaborative, team player mentality and exceeded expectations on all assigned projects, even those that required a quick turnaround. More importantly, Zack had great communications skills - from proactively providing a project status to any red flags during initial conversations. I would work with Zack again in a heartbeat.",
    "imgSrc": EvelynTam,
  },
  {
    "name": "Tom Luechtefeld",
    "title": "Data scientist at Sysrev.com, Chemchart.com, Johns Hopkins",
    "quote": "Zack helped us build web applications for our cancer clinical trial research studies. He was a pleasure to work with, I frequently come back to ask his advice on our other web development projects. If you have an opportunity to work with Zack you should take it.",
    "imgSrc": TomLuechtefeld,
  },
  {
    "name": "Venkat Viswanathan",
    "title": "Software engineer at Cloudflare",
    "quote": "I had the opportunity to work with Zack at Cloudflare. Zack is very hard working and self motivated. Whenever he is given a new task he puts in the effort to learn and successfully complete it. But the most important quality I admire is he makes sure he shares that knowledge with everyone and always willing to help. Zack is amazing to work with and a great asset to the team.",
    "imgSrc": VenkatViswanathan,
  },
  {
    "name": "George Riedel",
    "title": "CEO at Cloudmark. Professor at Harvard Business School",
    "quote": "Zack was an amazing contributor on the UX frontend for a new product we were launching. It was both a new market (Enterprise) and and new product (Spear phishing). As a result - it required a fair amount of intuitive design experience and iterative patience. Zack and his colleagues were instrumental in getting early versions of the UX built and adapting it as we developed insights into both how the user might experience things AND how the technology would interpret things. A very strong contributor to a new initiative and a dynamic environment.",
    "imgSrc": George,
  },
  {
    "name": "Tom Landesman",
    "title": "Security focused data scientist at Proofpoint",
    "quote": "Take a look at the span of job titles, levels of seniority, and teams reflected in Zack's other recommendations. It's clear Zack brings the same level of near-crazy passion and dedication from his art to every aspect of his professional work. Whether it was cross-team collaboration, picking up a new technology, or complex problem solving, Zack excelled without skipping a beat. From my view, Zack's most impressive, and all-too-rare, trait is deep introspection. Given a problematic shortcoming or knowledge gap, he wields this introspection to quickly diagnose and navigate past situations that would pose as major hurdles to most people. Teapot approved, A+",
    "imgSrc": TomLandesman,
  },
  {
    "name": "Steven Fusco",
    "title": "Senior Software Developer, R&D at AlienVault",
    "quote": "Zack is a great addition to any development team. He thinks fast, adapts to shifting requirements, and has proven he can quickly ramp up on the latest technologies to put them to good use.",
    "imgSrc": StevenFusco,
  },
  {
    "name": "Christian Paulus",
    "title": "VP Product Marketing at Cohesity",
    "quote": "I worked closely with Zack at Cloudflare. Zack was clearly the most talented, skilled and hard working developer in his team. I frequently tapped his brain for technical questions and he was always there to help. He is a true pleasure to work with and I can highly recommend him.",
    "imgSrc": ChristianPaulus,
  },
  {
    "name": "Anthony Davanzo",
    "title": "Technical Product Marketing Manager at HashiCorp",
    "quote": "Zack is exactly the type of engineer you want on your team. He's smart, collaborative, and tremendously effective. Zack and I worked together building tools and websites to drive revenue and customer success. When challenging ideas were presented, Zack would jump at the opportunity to learn without any hint of hesitation to take on difficulty. Personally, he 's kind, willing to help, and keeps a good sense of humor.",
    "imgSrc": AnthonyDavanzo,
  }
]

export default function Example() {
  return (
    <>
      <Head>
        <title>Zachary Proser reviews and @images</title>
        <meta
          name="description"
          content="@images and reviews from people who have worked with me"
        />
      </Head>
      <SimpleLayout
        title="What's it like to work with me?"
        intro="Let's ask some folks who have..."
      >
        <div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
              <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                    <h1>{testimonial.body}</h1>
                    <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                      <figcaption className="mt-6 flex items-center gap-x-4 p-2">
                        <Image className="h-20 w-20 rounded-full bg-gray-50" width={350} height={350} src={testimonial.imgSrc} />
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="font-semibold text-gray-900">{testimonial.body}</div>
                          <div className="text-gray-600">{testimonial.title}</div>
                        </div>
                      </figcaption>
                      <blockquote className="text-gray-900">
                        <p>{testimonial.quote}</p>
                      </blockquote>
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SimpleLayout>
    </>
  )
}

