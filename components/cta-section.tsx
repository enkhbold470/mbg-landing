import { Button } from "@/components/ui/button"
import { ctaSection } from "@/config/site"
import { ArrowRight, Phone } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">{ctaSection.title}</h2>
        <p className="text-lg lg:text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
          {ctaSection.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={ctaSection.primaryCta.href}>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[250px] group"
            >
              <Phone className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              {ctaSection.primaryCta.text}
            </Button>
          </Link>

          <Link href={ctaSection.secondaryCta.href}>
            <Button
              size="lg"
              variant="outline"
              className="border-2  hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-2xl min-w-[250px] transition-all duration-300 group"
            >
              {ctaSection.secondaryCta.text}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 