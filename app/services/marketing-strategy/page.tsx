import Navbar from "@/components/navbar"
import ServiceHero from "@/components/services/service-hero"
import WhyItMatters from "@/components/services/why-it-matters"
import WhatYouGet from "@/components/services/what-you-get"
import HowItWorks from "@/components/services/how-it-works"
import ClientTestimonials from "@/components/services/client-testimonials"
import MomentumModelOptions from "@/components/services/momentum-model-options"
import BonusWorkshops from "@/components/services/bonus-workshops"
import FinalServiceCta from "@/components/services/final-service-cta"
import Footer from "@/components/footer"
import BauhausElements from "@/components/bauhaus-elements"

export default function MarketingStrategyPage() {
  return (
    <main className="relative overflow-x-hidden">
      {/* Bauhaus decorative elements positioned absolutely */}
      <BauhausElements />

      <Navbar />
      <ServiceHero
        headline="Fix Your Focus. Fuel Your Growth."
        subheadline="Build a marketing strategy that moves—not one that lives in a deck."
        description="The Momentum Model™ helps founders cut through noise, sharpen strategy, and build marketing engines that scale—without the agency fluff."
        benefits={[
          "Free Discovery Call — zero pressure",
          "Strategy and execution, not just ideas",
          "Built to work with your real team, not theoretical org charts",
        ]}
      />
      <WhyItMatters />
      <WhatYouGet />
      <HowItWorks />
      <ClientTestimonials />
      <MomentumModelOptions />
      <FinalServiceCta />
      <BonusWorkshops />
      <Footer />
    </main>
  )
}
