"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass py-2" : "bg-transparent py-4"}`}>
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <div className="h-12 w-48 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 3000 3000"
              className="absolute inset-0 w-full h-full"
              style={{
                transform: "scale(4.5)",
                transformOrigin: "0% center",
                marginTop: "0px",
                marginLeft: "-12px",
              }}
            >
              <path
                fill="#020a0a"
                d="M679.25,1317.91v160.17c38.01-6.79,66.96-40.27,66.96-80.08s-28.96-72.85-66.96-80.09Z"
              />
              <rect fill="#020a0a" x="521.34" y="1316.55" width="58.82" height="304.96" />
              <path
                fill="#020a0a"
                d="M773.34,1511.11c0,48.87,18.1,87.78,60.18,104.52v-209.04c-42.08,17.19-60.18,55.65-60.18,104.52Z"
              />
              <path
                fill="#020a0a"
                d="M931.71,1407.04l-.45,209.04c42.08-17.19,60.18-55.65,60.18-104.52s-18.1-87.78-59.72-104.52Z"
              />
              <rect fill="#020a0a" x="1054.75" y="1291.21" width="52.49" height="330.3" />
              <polygon
                fill="#020a0a"
                points="1163.46,1399.35 1257.12,1628.3 1282.46,1564.05 1218.21,1399.35 1163.46,1399.35"
              />
              <polygon fill="#020a0a" points="1322.28,1467.67 1353.95,1399.8 1291.96,1399.8 1322.28,1467.67" />
              <polygon fill="#020a0a" points="1168.89,1692.55 1230.88,1692.55 1168.89,1630.56 1168.89,1692.55" />
              <path
                fill="#020a0a"
                d="M1475.51,1319.72l-87.33,87.33h34.84v150.67c0,39.82,20.81,63.34,52.49,63.34v-214.01h64.7v-7.24h-64.7v-80.09Z"
              />
              <path fill="#020a0a" d="M1730.69,1399.35v222.16h52.03v-149.76c0-47.96-21.27-69.68-52.03-72.39Z" />
              <rect fill="#020a0a" x="1585.45" y="1291.21" width="52.03" height="330.3" />
              <rect fill="#020a0a" x="1864.15" y="1291.21" width="52.03" height="52.48" />
              <rect fill="#020a0a" x="1864.15" y="1399.8" width="52.03" height="221.71" />
              <path fill="#020a0a" d="M2142.85,1399.35v222.16h52.03v-149.76c0-47.96-21.27-69.68-52.03-72.39Z" />
              <rect fill="#020a0a" x="1997.61" y="1399.35" width="52.03" height="222.16" />
              <path
                fill="#020a0a"
                d="M2452.77,1472.65c0-33.03-22.62-65.61-54.3-72.85v146.14c31.22-7.24,54.3-39.82,54.3-73.3Z"
              />
              <polygon fill="#020a0a" points="2440.55,1399.8 2502.54,1399.8 2502.54,1337.36 2440.55,1399.8" />
              <path
                fill="#020a0a"
                d="M2406.62,1621.51h-134.83v47.96l132.12,0.45c43.89,0,66.51,15.83,70.13,42.08,1.81-6.33,3.17-13.12,3.17-20.36,0-38.91-31.67-70.13-70.58-70.13Z"
              />
              <path
                fill="#020a0a"
                d="M2312.51,1545.95v-146.14c-31.22,7.24-54.3,39.82-54.3,73.3s22.63,65.61,54.3,72.84Z"
              />
            </svg>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#services" className="text-black hover:text-yellow-500 transition-colors">
            Services
          </Link>
          <Link href="/services/marketing-strategy" className="text-black hover:text-yellow-500 transition-colors">
            Marketing Strategy
          </Link>
          <Link href="#approach" className="text-black hover:text-yellow-500 transition-colors">
            Approach
          </Link>
          <Link href="#case-studies" className="text-black hover:text-yellow-500 transition-colors">
            Case Studies
          </Link>
          <Link href="#reviews" className="text-black hover:text-yellow-500 transition-colors">
            Reviews
          </Link>
          <Link href="#about" className="text-black hover:text-yellow-500 transition-colors">
            About
          </Link>
          <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">Book a call</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-dark absolute top-full left-0 right-0 p-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="#services"
              className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/services/marketing-strategy"
              className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketing Strategy
            </Link>
            <Link
              href="#approach"
              className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Approach
            </Link>
            <Link
              href="#case-studies"
              className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Case Studies
            </Link>
            <Link
              href="#reviews"
              className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link
              href="#about"
              className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black w-full">Book a call</Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
