"use client"

import { useEffect, useState } from "react"

const BauhausElements = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="bauhaus-container">
      {/* Large half-circle at the top right */}
      <div className="fixed -z-10 top-0 right-0 w-[40vw] h-[40vw] bg-[#FEC502] rounded-bl-[40vw] opacity-40"></div>

      {/* Quarter circle at the bottom left */}
      <div className="fixed -z-10 bottom-0 left-0 w-[30vw] h-[30vw]">
        <div className="absolute bottom-0 left-0 w-full h-full bg-[#02AFF4] rounded-tr-[30vw] opacity-40"></div>
      </div>

      {/* Overlapping circles */}
      <div className="fixed -z-10 top-[40vh] left-[10vw] w-[20vw] h-[20vw] bg-[#FD5B06] rounded-full opacity-40"></div>
      <div className="fixed -z-10 top-[35vh] left-[5vw] w-[15vw] h-[15vw] bg-[#2A2F67] rounded-full opacity-30"></div>

      {/* Diagonal rectangle */}
      <div className="fixed -z-10 top-[60vh] right-[15vw] w-[25vw] h-[10vw] bg-[#D50618] opacity-30 rotate-12"></div>

      {/* Small geometric elements */}
      <div className="fixed -z-10 top-[20vh] right-[30vw] w-[8vw] h-[8vw] bg-[#04A876] opacity-30 rotate-45"></div>
      <div className="fixed -z-10 bottom-[15vh] right-[10vw] w-[10vw] h-[10vw] rounded-full border-[1vw] border-[#FEC502] opacity-40"></div>

      {/* Grid lines */}
      <div className="fixed -z-20 inset-0 grid grid-cols-12 gap-4 opacity-5 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-full border-l border-gray-300"></div>
        ))}
      </div>

      {/* Horizontal lines */}
      <div className="fixed -z-20 inset-0 flex flex-col opacity-5 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full border-t border-gray-300 flex-1"></div>
        ))}
      </div>
    </div>
  )
}

export default BauhausElements
