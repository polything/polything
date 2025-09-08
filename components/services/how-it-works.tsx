import { Button } from "@/components/ui/button"

const HowItWorks = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-8 rounded-xl relative overflow-hidden">
            {/* Bauhaus-inspired decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FEC502] opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#02AFF4] opacity-10 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 rounded-full bg-[#FEC502] flex items-center justify-center mr-3">
                  <span className="text-black font-bold">🧩</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">HOW IT WORKS</h2>
              </div>

              {/* Step 1 */}
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-4">Step 1: Discovery Workshop</h3>
                <p className="mb-4">A half-day deep dive to spot the real gaps—and the right opportunities.</p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <li className="bg-white/20 p-4 rounded-lg">Customer Value Journey Mapping</li>
                  <li className="bg-white/20 p-4 rounded-lg">Audience and Competitive Insight</li>
                  <li className="bg-white/20 p-4 rounded-lg">Tactical Growth Opportunities</li>
                  <li className="bg-white/20 p-4 rounded-lg">Actionable Summary Report</li>
                </ul>

                <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">Book Discovery Workshop – £750</Button>
              </div>

              {/* Step 2 */}
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-4">Step 2: Strategy Build-Out</h3>
                <p className="mb-4">
                  Collaborate with us to design a focused, flexible marketing plan ready for real-world execution.
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <li className="bg-white/20 p-4 rounded-lg">Customised Strategy + Roadmap</li>
                  <li className="bg-white/20 p-4 rounded-lg">Messaging and Positioning Refinement</li>
                  <li className="bg-white/20 p-4 rounded-lg">Tactical Channel Planning (Paid, Content, SEO, Email)</li>
                  <li className="bg-white/20 p-4 rounded-lg">Priority Test-and-Learn Programmes</li>
                  <li className="bg-white/20 p-4 rounded-lg">KPI and Measurement Setup</li>
                </ul>

                <p className="font-medium">From £5,000.</p>
              </div>

              {/* Step 3 */}
              <div>
                <h3 className="text-xl font-bold mb-4">Step 3: Grow & Optimise</h3>
                <p className="mb-4">
                  Either implement with your internal team—or keep us on as your fractional marketing partners.
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="bg-white/20 p-4 rounded-lg">Ongoing Strategic Support</li>
                  <li className="bg-white/20 p-4 rounded-lg">Performance Dashboards</li>
                  <li className="bg-white/20 p-4 rounded-lg">Quarterly Optimisation Workshops</li>
                  <li className="bg-white/20 p-4 rounded-lg">Flexible Channel, Creative, and Campaign Support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
