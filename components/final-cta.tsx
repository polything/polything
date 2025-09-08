import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const FinalCta = () => {
  return (
    <section className="py-20 bg-[#FEC502] relative overflow-hidden">
      {/* Bauhaus-inspired decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-black opacity-10 rounded-l-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white opacity-10 rounded-tr-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
            Ready to stop second-guessing—and start growing with purpose?
          </h2>

          <p className="text-xl mb-8 text-black">
            Give us a call. If we're not the right fit, we'll tell you. No pressure, no pitch.
          </p>

          <Button className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-6 rounded-lg group">
            Book a Free Discovery Call
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default FinalCta
