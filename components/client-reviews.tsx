import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"

const reviews = [
  {
    quote: "They became an embedded part of our team.",
    author: "Chris Dicker",
    position: "CEO, Candr Media",
    image: "/images/clients/chris-dicker.webp",
  },
  {
    quote: "Polything helped refine our value prop and hit real goals.",
    author: "Benoit Collin",
    position: "Founder",
    image: "/images/clients/benoit-collin.png",
  },
  {
    quote: "They helped us go from chaos to clarity.",
    author: "Ellora Coupe",
    position: "Entrepreneur",
    image: "/images/clients/ellora-coupe.jpeg",
  },
]

const ClientReviews = () => {
  return (
    <section className="py-20 bg-gray-50" id="reviews">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Client Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="glass border-none h-full">
              <CardContent className="p-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#FEC502]">
                    <Image
                      src={review.image || "/placeholder.svg"}
                      alt={review.author}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{review.author}</p>
                    <p className="text-gray-600 text-sm">{review.position}</p>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="text-[#FEC502] absolute -top-2 -left-2 h-6 w-6 opacity-50" />
                  <p className="text-xl font-medium mb-4 pt-4 px-4">{review.quote}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-[#FEC502] hover:bg-[#e0b002] text-black">Read More Reviews</Button>
        </div>
      </div>
    </section>
  )
}

export default ClientReviews
