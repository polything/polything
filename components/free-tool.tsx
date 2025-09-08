import { Button } from "@/components/ui/button"

const FreeTool = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-10 rounded-xl relative overflow-hidden">
            {/* Bauhaus-inspired decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FEC502] opacity-20 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#02AFF4] opacity-20 rounded-full"></div>

            {/* Half-circle element */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-20 h-40 bg-[#FD5B06] opacity-10 rounded-r-full"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-10 w-20 h-40 bg-[#2A2F67] opacity-10 rounded-l-full"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Is your brand distinct—or just busy?</h2>

              <p className="text-lg mb-8 text-center">
                Use the Distinctive Brand Index to see how well your brand actually stands out and connects.
              </p>

              <div className="text-center">
                <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black text-lg px-8 py-6">
                  Take the Free Assessment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreeTool
