import { Card, CardContent } from "@/components/ui/card"
import { aboutUs } from "@/config/site"
import Image from "next/image"
import { youtubeVideo } from "@/lib/utils"

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

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Image Card */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-center">
                <Image 
                  src={aboutUs.image} 
                  alt={aboutUs.title} 
                  width={400} 
                  height={400} 
                  className="rounded-2xl w-full h-auto max-w-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Video Card */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
            <CardContent className="flex p-4 sm:p-6 lg:pt-14 lg:pb-14">
              <div className="aspect-video w-full rounded-2xl overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={youtubeVideo(aboutUs.video)} 
                  title="MBG Education танилцуулга видео" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
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