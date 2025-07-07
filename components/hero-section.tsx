
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export function HeroSection() {
  return (  
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 mr-2" />
          {siteConfig.slogan || "Тэгээс тэтгэлэгт тэнцэх нь"}
        </div>

        <h1 className="text-4xl lg:text-7xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {siteConfig.name || "MBG Education"}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
            {siteConfig.tagline || "Хятадын хэлийг эзэмших мэргэжлийн сургалт"}
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          {siteConfig.description || "Хятадын хэлийг эзэмших мэргэжлийн сургалт"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/courses">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[300px] group"
            >
              🇲🇳 Танхим сургалт
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/apply-college">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-2xl min-w-[300px] transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              🇨🇳 Суралцах зуучлал
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 