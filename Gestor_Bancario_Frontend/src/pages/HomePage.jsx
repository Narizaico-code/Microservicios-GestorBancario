import { LandingNavbar } from '../features/landing/components/LandingNavbar.jsx'
import { HeroSection } from '../features/landing/components/HeroSection.jsx'
import { MarqueeTicker } from '../features/landing/components/MarqueeTicker.jsx'
import { FeaturesSection } from '../features/landing/components/FeaturesSection.jsx'
import { ServicesSection } from '../features/landing/components/ServicesSection.jsx'
import { CtaBanner } from '../features/landing/components/CtaBanner.jsx'
import { TestimonialsSection } from '../features/landing/components/TestimonialsSection.jsx'
import { AboutSection } from '../features/landing/components/AboutSection.jsx'
import { LandingFooter } from '../features/landing/components/LandingFooter.jsx'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <LandingNavbar />
      <HeroSection />
      <MarqueeTicker />
      <FeaturesSection />
      <ServicesSection />
      <CtaBanner />
      <TestimonialsSection />
      <AboutSection />
      <LandingFooter />
    </main>
  )
}
