import Link from "next/link"
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <div className="w-48 h-12 mb-6 overflow-visible">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="500 1290 2000 450"
                className="w-full h-full"
                style={{
                  transform: "scale(1.0)",
                  transformOrigin: "left center",
                  marginTop: "0px",
                  zIndex: 10
                }}
              >
                <path
                  fill="white"
                  d="M679.25,1317.91v160.17c38.01-6.79,66.96-40.27,66.96-80.08s-28.96-72.85-66.96-80.09Z"
                />
                <rect fill="white" x="521.34" y="1316.55" width="58.82" height="304.96" />
                <path
                  fill="white"
                  d="M773.34,1511.11c0,48.87,18.1,87.78,60.18,104.52v-209.04c-42.08,17.19-60.18,55.65-60.18,104.52Z"
                />
                <path
                  fill="white"
                  d="M931.71,1407.04l-.45,209.04c42.08-17.19,60.18-55.65,60.18-104.52s-18.1-87.78-59.72-104.52Z"
                />
                <rect fill="white" x="1054.75" y="1291.21" width="52.49" height="330.3" />
                <polygon
                  fill="white"
                  points="1163.46,1399.35 1257.12,1628.3 1282.46,1564.05 1218.21,1399.35 1163.46,1399.35"
                />
                <polygon fill="white" points="1322.28,1467.67 1353.95,1399.8 1291.96,1399.8 1322.28,1467.67" />
                <polygon fill="white" points="1168.89,1692.55 1230.88,1692.55 1168.89,1630.56 1168.89,1692.55" />
                <path
                  fill="white"
                  d="M1475.51,1319.72l-87.33,87.33h34.84v150.67c0,39.82,20.81,63.34,52.49,63.34v-214.01h64.7v-7.24h-64.7v-80.09Z"
                />
                <path fill="white" d="M1730.69,1399.35v222.16h52.03v-149.76c0-47.96-21.27-69.68-52.03-72.39Z" />
                <rect fill="white" x="1585.45" y="1291.21" width="52.03" height="330.3" />
                <rect fill="white" x="1864.15" y="1291.21" width="52.03" height="52.48" />
                <rect fill="white" x="1864.15" y="1399.8" width="52.03" height="221.71" />
                <path fill="white" d="M2142.85,1399.35v222.16h52.03v-149.76c0-47.96-21.27-69.68-52.03-72.39Z" />
                <rect fill="white" x="1997.61" y="1399.35" width="52.03" height="222.16" />
                <path
                  fill="white"
                  d="M2452.77,1472.65c0-33.03-22.62-65.61-54.3-72.85v146.14c31.22-7.24,54.3-39.82,54.3-73.3Z"
                />
                <polygon fill="white" points="2440.55,1399.8 2502.54,1399.8 2502.54,1337.36 2440.55,1399.8" />
                <path
                  fill="white"
                  d="M2406.62,1621.51h-134.83v47.96l132.12,0.45c43.89,0,66.51,15.83,70.13,42.08,1.81-6.33,3.17-13.12,3.17-20.36,0-38.91-31.67-70.13-70.58-70.13Z"
                />
                <path
                  fill="white"
                  d="M2312.51,1545.95v-146.14c-31.22,7.24-54.3,39.82-54.3,73.3s22.63,65.61,54.3,72.84Z"
                />
              </svg>
            </div>
            <p className="text-gray-400">
              Strategic marketing consultancy helping visionary brands scale with clarity and confidence.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#FEC502] transition-colors">
                  Take the Brand Assessment
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#FEC502] transition-colors">
                  Explore Our Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#FEC502] transition-colors">
                  View Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#FEC502] transition-colors">
                  Meet Chris
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">contact@polything.co.uk</li>
              <li className="text-gray-400">+44 208 0640312</li>
              <li className="text-gray-400">London, UK</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Book a Call</h4>
            <p className="text-gray-400 mb-4">
              Ready to elevate your marketing? Schedule a free discovery call today.
            </p>
            <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">Book a Call</Button>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Polything. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
