import Image from "next/image"
import { Button } from "@/components/ui/button"

const caseStudies = [
  {
    client: "WOLF",
    image: "/images/wolf-case-study.png",
    description: "Relaunched across MENA with influencer + content strategy → 2M+ new users",
  },
  {
    client: "Blackriver Ramps",
    image: "/images/blackriver-case-study.png",
    description: "22% YoY growth from one focused BFCM campaign",
  },
  {
    client: "Bluefort Security",
    image: "/images/bluefort-case-study.png",
    description: "Repositioned their GTM strategy for sharper traction",
  },
]

const CaseStudies = () => {
  return (
    <section className="py-20 bg-gray-50" id="case-studies">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Case Studies Snapshot</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <div key={index} className="glass p-6 rounded-xl group hover:shadow-xl transition-all">
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={study.image || "/placeholder.svg"}
                  alt={study.client}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{study.client}</h3>
              <p className="text-gray-800">{study.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">View All Case Studies</Button>
        </div>
      </div>
    </section>
  )
}

export default CaseStudies
