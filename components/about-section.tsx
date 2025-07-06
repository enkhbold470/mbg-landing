import { Card, CardContent } from "@/components/ui/card"
import { aboutUs } from "@/config/site"
import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-r from-gray-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">{aboutUs.title}</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {aboutUs.description}
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm max-w-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <Image 
                  src={aboutUs.image} 
                  alt={aboutUs.title} 
                  width={400} 
                  height={400} 
                  className="rounded-2xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 