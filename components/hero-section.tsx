"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener("loadeddata", () => {
        setIsVideoLoaded(true)
      })

      // Ensure video plays on iOS devices
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented
          // Show a UI element to let the user manually start playback
          console.log("Autoplay prevented")
        })
      }
    }

    return () => {
      if (video) {
        video.removeEventListener("loadeddata", () => {
          setIsVideoLoaded(true)
        })
      }
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 z-0"></div>

      {/* Bauhaus-inspired decorative elements specific to hero */}
      <div className="absolute top-1/4 right-1/4 w-[25vw] h-[25vw] rounded-full bg-white border-[1.5vw] border-[#FEC502] opacity-20 z-10"></div>
      <div className="absolute bottom-10 left-1/3 w-[15vw] h-[15vw] bg-[#02AFF4] opacity-10 rounded-tl-[15vw] z-10"></div>

      {/* Video background layer */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-30" : "opacity-0"
          }`}
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://polything.co.uk/wp-content/uploads/sites/3/2024/09/Polything_Marketing_Consultancy_Web.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="max-w-3xl mx-auto">
          <div className="glass p-10 rounded-xl relative overflow-hidden">
            {/* Decorative element inside the glass panel */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FEC502] opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#02AFF4] opacity-10 rounded-full"></div>

            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Build a Brand That Leads — Without the Guesswork
              </h1>
              <p className="text-lg md:text-xl mb-4 text-gray-800">
                We help founders and teams cut through the noise, sharpen their strategy, and build marketing that
                actually works.
              </p>
              <p className="text-lg md:text-xl mb-8 text-gray-800">No decks. No chaos. Just momentum.</p>
              <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black text-lg px-8 py-6 rounded-lg group">
                Book a Free Discovery Call
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="mt-4 text-sm text-gray-600">A no-pressure chat. Just clarity, grounded in experience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
