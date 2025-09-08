import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const ClientTestimonials = () => {
  const testimonials = [
    {
      quote: "They transformed how we think—and how we grow.",
      author: "Jon Case",
      position: "CEO, SSS Learning",
    },
    {
      quote: "Polything's strategy helped us scale to 2M+ users faster than we thought possible.",
      author: "Adam Gold",
      position: "CCO, WOLF",
    },
    {
      quote: "They became a true extension of our leadership team.",
      author: "Chris Dicker",
      position: "CEO, Candr Media",
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
                  <span className="text-black font-bold">✨</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">WHY CLIENTS CHOOSE THE MOMENTUM MODEL</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-white/30 border-none">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Quote className="text-[#FEC502] h-6 w-6 opacity-70" />
                      </div>
                      <p className="text-lg font-medium mb-4">{testimonial.quote}</p>
                      <p className="text-sm">
                        — {testimonial.author}, {testimonial.position}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClientTestimonials
