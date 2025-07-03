import HumanoidSection from '@/components/scroll-section'
import { TestimonialsSection } from '@/components/testimonies'
import { ProjectsList } from '@/modules/home/ui/components/projects-list'
import { SignedIn } from '@clerk/nextjs'
import React from 'react'
import { Hero } from './hero'
import { SpecificationsSection } from '@/components/specsection'
import { Footer } from '@/components/footer'

const page = () => {
  return (
    <div>
      <Hero />
    <SignedIn>
        <div className="relative z-10">
          <ProjectsList />
        </div>
            
      </SignedIn>
       <TestimonialsSection />
             <SpecificationsSection />
      <HumanoidSection />
      <Footer />
 
 
    </div>
  )
}

export default page