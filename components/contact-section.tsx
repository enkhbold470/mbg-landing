import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Facebook } from "lucide-react"
import { siteConfig } from "@/config/site"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6 bg-gradient-to-r from-gray-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Холбоо барих</h2>
          <p className="text-lg lg:text-xl text-gray-600">Бидэнтэй холбогдож, нэмэлт мэдээлэл авна уу</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address Card */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Хаяг</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">{siteConfig.contact.address.mongolian}</p>
                  {/* <p className="text-sm text-gray-500">{siteConfig.contact.address.english}</p> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Утас</h3>
                  <div className="space-y-2">
                    {siteConfig.contact.phones.map((phone, index) => (
                      <p key={index} className="text-gray-700 font-medium">{phone}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">И-мэйл</h3>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Card */}
          <Card className="rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Facebook className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Facebook</h3>
                  <div className="space-y-2">
                    {siteConfig.contact.social.facebook.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className="text-purple-600 hover:text-purple-700 transition-colors block font-medium"
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 