import { Button } from "@/components/ui/button"

const ServicesSnapshot = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Services Snapshot</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="glass p-8 rounded-xl h-full flex flex-col relative overflow-hidden">
            {/* Bauhaus-inspired decorative element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#FEC502] opacity-20 rounded-tl-full"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#FEC502] mb-6"></div>
              <h3 className="text-2xl font-bold mb-4">Strategy & Positioning</h3>
              <p className="flex-grow mb-6">Refine your message. Align your team. Build a plan that sticks.</p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="glass p-8 rounded-xl h-full flex flex-col relative overflow-hidden">
            {/* Bauhaus-inspired decorative element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#02AFF4] opacity-20 rounded-tl-full"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-[#02AFF4] mb-6"></div>
              <h3 className="text-2xl font-bold mb-4">Fractional Marketing Team</h3>
              <p className="flex-grow mb-6">Plug in senior marketers and creatives fast—no onboarding drama.</p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="glass p-8 rounded-xl h-full flex flex-col relative overflow-hidden">
            {/* Bauhaus-inspired decorative element */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#FD5B06] opacity-20 rounded-tl-full"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#FD5B06] mb-6 rotate-45"></div>
              <h3 className="text-2xl font-bold mb-4">Founder Mentoring</h3>
              <p className="flex-grow mb-6">Personalised support for ND and NT founders building their own way.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">Explore Services</Button>
        </div>
      </div>
    </section>
  )
}

export default ServicesSnapshot
