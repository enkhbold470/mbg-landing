import { Card, CardContent } from "@/components/ui/card"
import { valueProposition } from "@/config/site"

export function ValueProposition() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">{valueProposition.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {valueProposition.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProposition.benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/70 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 