import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Facebook, ArrowRight, Sparkles } from "lucide-react"

export default function LandingPage() {
  const courses = [
    {
      title: "40 цаг",
      subtitle: "HSK 4 түвшин",
      description: "Хятад хэлний үндсийг эзэмших",
      price: "450,000₮",
      duration: "40 цаг",
      highlighted: true,
    },
    {
      title: "6 сар",
      subtitle: "Үндсэн хичээл",
      description: "Бүрэн дүүрэн хичээлийн хөтөлбөр",
      price: "1,800,000₮",
      duration: "6 сар",
    },
    {
      title: "5+5 сар",
      subtitle: "Монгол + Хятад",
      description: "Хосолсон олон улсын сургалт",
      price: "5,800,000₮",
      duration: "10 сар",
    },
    {
      title: "1 жил",
      subtitle: "Бүрэн хөтөлбөр",
      description: "Мэргэжлийн түвшинд хүрэх",
      price: "2,800,000₮",
      duration: "12 сар",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
  

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Тэгээс тэтгэлэгт тэнцэх нь
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Хятад хэлний
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
              сургалт
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Дэлхийн хамгийн том эдийн засгийн гүрний хэлийг эзэмшиж, ирээдүйн боломжуудыг нээж аваарай
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[300px] group"
            >
              Монгол дахь танхим сургалт
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-2xl min-w-[300px] transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              Хятадын зуучлалыг бүртгэл
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Сургалтын хөтөлбөрүүд</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Таны хэрэгцээ, цаг хугацаанд тохирсон сургалтын хөтөлбөрийг сонгоорой
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  course.highlighted
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                    : "bg-white/70 backdrop-blur-sm hover:bg-white"
                }`}
              >
                <CardContent className="p-8">
                  {course.highlighted && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  <div className="text-center">
                    <div
                      className={`text-sm font-medium mb-2 ${course.highlighted ? "text-purple-200" : "text-purple-600"}`}
                    >
                      {course.duration}
                    </div>

                    <h3 className={`text-2xl font-bold mb-2 ${course.highlighted ? "text-white" : "text-gray-900"}`}>
                      {course.title}
                    </h3>

                    <p
                      className={`text-lg font-medium mb-4 ${course.highlighted ? "text-purple-100" : "text-gray-700"}`}
                    >
                      {course.subtitle}
                    </p>

                    <div className="h-16 flex items-center justify-center mb-6">
                      <p
                        className={`text-sm leading-relaxed ${course.highlighted ? "text-purple-100" : "text-gray-600"}`}
                      >
                        {course.description}
                      </p>
                    </div>

                    <div className={`text-2xl font-bold mb-6 ${course.highlighted ? "text-white" : "text-gray-900"}`}>
                      {course.price}
                    </div>

                    <Button
                      className={`w-full rounded-xl transition-all duration-300 ${
                        course.highlighted
                          ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      Бүртгүүлэх
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Холбоо барих</h2>
            <p className="text-xl text-gray-600">Бидэнтэй холбогдож, нэмэлт мэдээлэл авна уу</p>
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
                    <p className="text-gray-700 leading-relaxed mb-2">Танан төв -202, Сүхбаатар дүүрэг, 8-р хороо</p>
                    <p className="text-gray-700 leading-relaxed mb-3">Улаанбаатар, Монгол улс</p>
                    <p className="text-sm text-gray-500">Tanan center-202, 8th khoroo, Ulaanbaatar Mongolia</p>
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
                      <p className="text-gray-700 font-medium">(+976) 77117678</p>
                      <p className="text-gray-700 font-medium">(+976) 99797678</p>
                      <p className="text-gray-700 font-medium">(+976) 80098089</p>
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
                      href="mailto:mbgedumn@gmail.com"
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      mbgedumn@gmail.com
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
                      <a
                        href="https://www.facebook.com/learningchina"
                        className="text-purple-600 hover:text-purple-700 transition-colors block font-medium"
                      >
                        Learning China
                      </a>
                      <a
                        href="https://www.facebook.com/MBGeduMBGtourMBGConsulting"
                        className="text-purple-600 hover:text-purple-700 transition-colors block font-medium"
                      >
                        MBG Education
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      
    </div>
  )
}
