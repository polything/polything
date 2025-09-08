import { ArrowRight } from "lucide-react"

const OurApproach = () => {
  return (
    <section className="py-20 bg-gray-50" id="approach">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Strategy That Moves</h2>

          <div className="glass p-8 rounded-xl mt-10">
            <p className="text-lg mb-8 text-center">
              We work at the intersection of clarity, creativity, and execution. Our Momentum Model helps you stop
              reacting and start building something sustainable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/40 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <ArrowRight className="mr-2 text-[#FEC502]" />
                  Show us
                </h3>
                <p>Need clarity? We'll co-create your strategy.</p>
              </div>

              <div className="bg-white/40 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <ArrowRight className="mr-2 text-[#FEC502]" />
                  Do it for us
                </h3>
                <p>Need execution? We'll lead delivery, hands-on.</p>
              </div>

              <div className="bg-white/40 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <ArrowRight className="mr-2 text-[#FEC502]" />
                  Help us grow
                </h3>
                <p>Need support? We mentor teams to scale with confidence.</p>
              </div>
            </div>

            <p className="text-center mt-10 text-lg font-medium">
              Every engagement starts with discovery—and ends with momentum.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurApproach
