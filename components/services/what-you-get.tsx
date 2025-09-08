const WhatYouGet = () => {
  const benefits = [
    {
      title: "Clarity & Focus",
      description: "Know exactly what to say, where to show up, and how to grow.",
    },
    {
      title: "Data-Led Insight",
      description: "Build strategies around real customer behaviour—not assumptions.",
    },
    {
      title: "Strategic Execution",
      description: "High-level thinking tied directly to actions that drive results.",
    },
    {
      title: "Agile Optimisation",
      description: "Test, learn, and refine as you scale—without getting stuck.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass p-8 rounded-xl relative overflow-hidden">
            {/* Bauhaus-inspired decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FEC502] opacity-10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#02AFF4] opacity-10 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 rounded-full bg-[#FEC502] flex items-center justify-center mr-3">
                  <span className="text-black font-bold">🔥</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">WHAT YOU GET</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 bg-white/30 font-bold text-lg">Core Benefit</th>
                      <th className="text-left py-3 px-4 bg-white/30 font-bold text-lg">What It Means For You</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benefits.map((benefit, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white/10" : "bg-white/20"}>
                        <td className="py-4 px-4 font-medium">{benefit.title}</td>
                        <td className="py-4 px-4">{benefit.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatYouGet
