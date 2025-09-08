"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

interface ServiceHeroProps {
  headline: string
  subheadline: string
  description: string
  benefits: string[]
}

const ServiceHero = ({ headline, subheadline, description, benefits }: ServiceHeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center py-20 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 z-0"></div>

      {/* Bauhaus-inspired decorative elements specific to hero */}
      <div className="absolute top-1/4 right-1/4 w-[25vw] h-[25vw] rounded-full bg-white border-[1.5vw] border-[#FEC502] opacity-20 z-10"></div>
      <div className="absolute bottom-10 left-1/3 w-[15vw] h-[15vw] bg-[#02AFF4] opacity-10 rounded-tl-[15vw] z-10"></div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="max-w-3xl mx-auto">
          <div className="glass p-10 rounded-xl relative overflow-hidden">
            {/* Decorative element inside the glass panel */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FEC502] opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#02AFF4] opacity-10 rounded-full"></div>

            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{headline}</h1>
              <p className="text-lg md:text-xl mb-4 text-gray-800 font-medium">{subheadline}</p>
              <p className="text-lg mb-8 text-gray-800">{description}</p>

              <div className="bg-white/30 p-6 rounded-lg mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start mb-3 last:mb-0">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>

              <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black text-lg px-8 py-6 rounded-lg group">
                Book Your Free Discovery Call
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceHero
