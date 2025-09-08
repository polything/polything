import Image from "next/image"
import { Button } from "@/components/ui/button"

const AboutPolything = () => {
  return (
    <section className="py-20 relative" id="about">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-10 rounded-xl relative overflow-hidden">
            {/* Bauhaus-inspired decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FEC502] opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#02AFF4] opacity-10 rounded-full"></div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="md:w-1/3">
                <div className="relative">
                  {/* Yellow circle behind image */}
                  <div className="absolute inset-0 bg-[#FEC502] opacity-10 rounded-full transform scale-110"></div>

                  {/* Profile image */}
                  <div className="relative rounded-full overflow-hidden border-2 border-[#FEC502] aspect-square">
                    <Image
                      src="/images/chris-talintyre.jpeg"
                      alt="Chris, Polything Founder"
                      width={400}
                      height={400}
                      className="object-cover"
                    />
                  </div>

                  {/* Bauhaus decorative element */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#02AFF4] opacity-20 rounded-tl-2xl"></div>
                </div>
              </div>

              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Polything</h2>

                <h3 className="text-xl font-bold mb-4">Hi, I'm Chris. I lead every project here.</h3>

                <p className="mb-4">
                  With over two decades of experience across brands like Ford, EE, Jeep, and Nintendo, I've helped
                  startups and scaleups get unstuck and find their edge. I also coach and mentor founders—especially
                  neurodivergent leaders carving their own path.
                </p>

                <p className="mb-6">
                  I built Polything to be the kind of support I wish I'd had sooner: Strategic. Grounded. Human.
                </p>

                <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">About Chris</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPolything
