"use client"

import Image from "next/image"

const logos = [
  { name: "NME", src: "/images/logos/nme.png" },
  { name: "Boots Hearingcare", src: "/images/logos/boots-hearingcare.png" },
  { name: "Time Inc.", src: "/images/logos/time-inc.png" },
  { name: "Unipart Group", src: "/images/logos/unipart-group.png" },
  { name: "Devon County Council", src: "/images/logos/devon-county-council.png" },
  { name: "South Gloucestershire Council", src: "/images/logos/south-gloucestershire-council.png" },
  { name: "Luton Borough Council", src: "/images/logos/luton-borough-council.png" },
]

const CredibilityStrip = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-lg text-gray-600 mb-8">Trusted by brands with ambition</h3>

        <div className="glass py-8 px-4 rounded-xl">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="w-24 md:w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.name}
                  width={120}
                  height={40}
                  className="max-h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CredibilityStrip
