const WhyItMatters = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-8 rounded-xl relative overflow-hidden">
            {/* Bauhaus-inspired decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FEC502] opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#02AFF4] opacity-10 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-[#FEC502] flex items-center justify-center mr-3">
                  <span className="text-black font-bold">🎯</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">WHY IT MATTERS</h2>
              </div>

              <p className="text-lg mb-6">Without a clear, adaptive strategy, even great businesses stall.</p>

              <div className="space-y-2 mb-6">
                <p className="text-lg font-medium">Teams spin.</p>
                <p className="text-lg font-medium">Budgets bleed.</p>
                <p className="text-lg font-medium">Good ideas drift into disconnected tactics.</p>
              </div>

              <p className="text-lg">
                That's why we built the Momentum Model™—a practical system that connects high-level clarity with
                real-world execution. No buzzwords. No bloated retainers. Just work that moves the needle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyItMatters
