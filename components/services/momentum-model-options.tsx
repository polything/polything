import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const MomentumModelOptions = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8 justify-center">
            <div className="w-8 h-8 rounded-full bg-[#FEC502] flex items-center justify-center mr-3">
              <span className="text-black font-bold">📈</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">MOMENTUM MODEL OPTIONS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Discovery Trial */}
            <div className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg rounded-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold mb-4">Discovery Trial</h3>
                <div className="mb-4">
                  <p className="font-medium">Format: 1/2 day workshop</p>
                  <p className="font-medium">Online: Bring your team to the strategy board</p>
                </div>
                <p className="mb-4">
                  This half-day workshop is designed to uncover your unique marketing challenges and opportunities. We
                  use a unique customer value journey to uncover what marketing is working and what isn't.
                </p>
                <p className="mb-4">
                  We'll dive deep into your target audience, competitive landscape, and current marketing efforts to
                  create a clear roadmap for your marketing journey.
                </p>
              </div>

              <div className="p-6 border-b border-gray-200 flex-grow">
                <div className="h-1 w-full bg-gray-200 my-6"></div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Comprehensive analysis of current marketing initiatives</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Identification of growth opportunities and challenges</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>In-depth exploration of target audience and buyer personas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Evaluation of competitive landscape and market positioning</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Collaborative brainstorming sessions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Actionable insights and recommendations</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 border-b border-gray-200">
                <h4 className="font-bold mb-2">Who it's for:</h4>
                <p>
                  Businesses looking to gain clarity on their marketing strategy and identify areas for improvement
                  before committing to a full engagement.
                </p>
              </div>

              <div className="p-6 flex justify-center">
                <Button className="bg-[#04A876] hover:bg-[#038761] text-white">Trial - £750</Button>
              </div>
            </div>

            {/* Momentum Model - Highlighted */}
            <div className="bg-[#04A876] text-white rounded-xl overflow-hidden flex flex-col transform scale-105 shadow-xl">
              <div className="p-6 border-b border-white/20">
                <h3 className="text-2xl font-bold mb-4">Momentum Model</h3>
                <div className="mb-4">
                  <p className="font-medium">Format: A series of strategy workshops</p>
                  <p className="font-medium">
                    Online & In-person: An individual plan to take you from the discovery stage to implementation.
                    Including ongoing support for the whole period.
                  </p>
                </div>
                <p className="mb-4">
                  Our signature is our most popular service marketing strategy service, the Momentum Model, which is a
                  comprehensive approach to unlocking your business's growth potential.
                </p>
                <p className="mb-4">
                  It includes the discovery deliverables as well as a comprehensive plan to deliver a complete strategy
                  and test and learn programme.
                </p>
                <p className="mb-4">
                  We'll work closely with you to develop and implement a tailored marketing strategy that drives
                  results.
                </p>
              </div>

              <div className="p-6 border-b border-white/20 flex-grow">
                <div className="h-1 w-full bg-white/30 my-6"></div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-white mr-2 mt-1 flex-shrink-0" />
                    <span>Customised marketing strategy development</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-white mr-2 mt-1 flex-shrink-0" />
                    <span>Integration of digital marketing channels (SEO, PPC, social media, email marketing)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-white mr-2 mt-1 flex-shrink-0" />
                    <span>Brand positioning and messaging refinement</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-white mr-2 mt-1 flex-shrink-0" />
                    <span>Content and channel strategy</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-white mr-2 mt-1 flex-shrink-0" />
                    <span>Performance tracking and optimisation</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 border-b border-white/20">
                <h4 className="font-bold mb-2">Who it's for:</h4>
                <p>
                  Businesses ready to invest in a long-term, strategic approach to marketing that delivers sustainable
                  growth and measurable ROI.
                </p>
              </div>

              <div className="p-6 flex justify-center">
                <Button className="bg-white hover:bg-gray-100 text-[#04A876]">Starting from £5,000</Button>
              </div>
            </div>

            {/* Bespoke */}
            <div className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg rounded-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold mb-4">Bespoke</h3>
                <div className="mb-4">
                  <p className="font-medium">Typical Hours of Work: 120 hours per month</p>
                  <p className="font-medium">Givens: A dedicated Project Manager</p>
                </div>
                <p className="mb-4">
                  For businesses with unique needs and complex challenges, we offer fully customised marketing strategy
                  engagements. Often these companies need additional support or more intensive strategy development.
                </p>
                <p className="mb-4">
                  Our team will work with you to create a bespoke solution that addresses your specific goals and
                  requirements.
                </p>
              </div>

              <div className="p-6 border-b border-gray-200 flex-grow">
                <div className="h-1 w-full bg-gray-200 my-6"></div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Tailored scope of work based on your needs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Flexible pricing and engagement models</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Access to our full suite of marketing services and expertise</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Dedicated account management and support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Regular progress reports and strategic reviews</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-[#FEC502] mr-2 mt-1 flex-shrink-0" />
                    <span>Customised performance metrics and KPIs</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 border-b border-gray-200">
                <h4 className="font-bold mb-2">Who it's for:</h4>
                <p>
                  Businesses with specific marketing challenges or those operating in niche industries that require a
                  highly customised approach to achieve their growth objectives.
                </p>
              </div>

              <div className="p-6 flex justify-center">
                <Button className="bg-[#04A876] hover:bg-[#038761] text-white">Enquire</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MomentumModelOptions
