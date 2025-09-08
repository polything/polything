const WhatWeDo = () => {
  return (
    <section className="py-20 relative" id="services">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Strategic Marketing for Visionary Brands</h2>

          <div className="glass p-8 rounded-xl mt-10 relative overflow-hidden">
            {/* Bauhaus-inspired decorative elements inside the glass panel */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FEC502] opacity-10 rounded-br-[40px]"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#02AFF4] opacity-10 rounded-tl-[40px]"></div>

            <div className="relative z-10">
              <p className="text-lg mb-6">
                We're Polything — a strategic marketing consultancy helping tech, eComm, and consumer brands scale with
                clarity and confidence.
              </p>

              <p className="text-lg mb-6">
                From seed-stage startups to listed companies, our clients come to us when marketing becomes a
                bottleneck. They stay because we help them cut through the noise—and get results without the agency
                drama.
              </p>

              {/* Bauhaus-inspired decorative element */}
              <div className="relative h-4 w-full my-8 overflow-hidden rounded-full">
                <div className="absolute left-0 top-0 h-4 w-1/3 bg-[#FEC502]"></div>
                <div className="absolute left-1/3 top-0 h-4 w-1/3 bg-[#02AFF4]"></div>
                <div className="absolute left-2/3 top-0 h-4 w-1/3 bg-[#FD5B06]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
