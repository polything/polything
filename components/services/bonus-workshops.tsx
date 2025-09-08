import { Button } from "@/components/ui/button"

const BonusWorkshops = () => {
  const workshops = ["Customer Value Journey Mapping", "Value Proposition Design", "Content Strategy Hack Days"]

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
                  <span className="text-black font-bold">📚</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">BONUS: Standalone Workshops (Optional)</h2>
              </div>

              <ul className="space-y-4 mb-8">
                {workshops.map((workshop, index) => (
                  <li key={index} className="bg-white/20 p-4 rounded-lg">
                    {workshop}
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">Explore Workshops</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BonusWorkshops
