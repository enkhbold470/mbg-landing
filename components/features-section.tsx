import { Card, CardContent } from "@/components/ui/card"
import { features } from "@/config/site"
import { getFeatures } from "@/app/actions/config"

export async function FeaturesSection() {
  const featuresData = await getFeatures();
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Онцлог боломжууд</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Бид дараах онцлог боломжуудыг санал болгож байна
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <Card
              key={index}
              className="group rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50"
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 