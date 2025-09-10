// ⚠️  PROTECTED FILE - DO NOT MODIFY ⚠️
// This is the homepage and has been redeveloped with a new design system.
// Any changes to this file require explicit approval.
// Last protected: 2025-01-27

import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import CredibilityStrip from "@/components/credibility-strip"
import WhatWeDo from "@/components/what-we-do"
import OurApproach from "@/components/our-approach"
import ServicesSnapshot from "@/components/services-snapshot"
import CaseStudies from "@/components/case-studies"
import FreeTool from "@/components/free-tool"
import ClientReviews from "@/components/client-reviews"
import AboutPolything from "@/components/about-polything"
import FinalCta from "@/components/final-cta"
import Footer from "@/components/footer"
import BauhausElements from "@/components/bauhaus-elements"

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      {/* Bauhaus decorative elements positioned absolutely */}
      <BauhausElements />

      <Navbar />
      <HeroSection />
      <CredibilityStrip />
      <WhatWeDo />
      <OurApproach />
      <ServicesSnapshot />
      <CaseStudies />
      <FreeTool />
      <ClientReviews />
      <AboutPolything />
      <FinalCta />
      <Footer />
    </main>
  )
}
