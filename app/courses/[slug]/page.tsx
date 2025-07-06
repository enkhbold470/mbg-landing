// follows with slug [slug]
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Calendar, BookOpen, User, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { youtubeVideo } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getCourses } from "@/app/actions/config";

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const [coursesData] = await Promise.all([
        getCourses(),
    ])
    const course = coursesData.find((course) => course.slug === slug);

    if (!course) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
            {/* Header */}
            <section className="pt-32 pb-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link 
                        href="/courses" 
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Буцах
                    </Link>
                    
                    <div className="text-center">
                        {course.highlighted && (
                            <Badge className="bg-yellow-400 text-yellow-900 mb-4">
                                Онцлох хөтөлбөр
                            </Badge>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {course.fullTitle}
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 mb-8">
                            {course.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Course Details */}
            <section className="pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Left Column - Course Info */}
                        <div className="space-y-6">
                            
                            {/* Main Course Info */}
                            <Card className="rounded-3xl border-0 shadow-lg bg-white">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Хичээлийн мэдээлэл</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Эхлэх огноо</p>
                                                <p className="font-semibold text-gray-900">Хичээл {course.startDate}- нөөс эхлэх болно</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Нийт хичээлийн цаг</p>
                                                <p className="font-semibold text-gray-900">{course.duration}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Хичээлийн хуваарь</p>
                                                <p className="font-semibold text-gray-900">{course.schedule}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Давтамж</p>
                                                <p className="font-semibold text-gray-900">{course.frequency}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Анги дүүргэлт</p>
                                                <p className="font-semibold text-gray-900">{course.classSize}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Багш</p>
                                                <p className="font-semibold text-gray-900">{course.teacher}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-2">Төлбөр</p>
                                            <p className="text-4xl font-bold text-purple-600">{course.price}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Course Features */}
                            <Card className="rounded-3xl border-0 shadow-lg bg-white">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Хичээлийн онцлогууд</h3>
                                    <div className="space-y-3">
                                        {course.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Enrollment Button */}
                            <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                <CardContent className="p-8 text-center">
                                    <h3 className="text-2xl font-bold mb-4">Одоо бүртгүүлээрэй!</h3>
                                    <p className="text-purple-100 mb-6">
                                        Хязгаарлагдмал суудлын тоо. Өөрийн байр авахыг хурдан болгоорой.
                                    </p>
                                    <Link href={course.signupForm} target="_blank">
                                        <Button 
                                            size="lg"
                                            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300"
                                        >
                                            БҮРТГҮҮЛЭХ
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Media */}
                        <div className="space-y-6">
                            
                            {/* Course Image */}
                            <Card className="rounded-3xl border-0 shadow-lg overflow-hidden bg-white">
                                <Image 
                                    src={course.image} 
                                    alt={course.fullTitle} 
                                    width={600} 
                                    height={400} 
                                    className="w-full h-64 object-cover"
                                />
                            </Card>

                            {/* Course Video */}
                            <Card className="rounded-3xl border-0 shadow-lg overflow-hidden bg-white">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Танилцуулга видео</h3>
                                    <div className="relative rounded-2xl overflow-hidden">
                                        <iframe 
                                            width="100%" 
                                            height="315" 
                                            src={youtubeVideo(course.video)} 
                                            title="Course Introduction Video" 
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
                </div>
            </section>

            {/* Google Form Embed */}
            {/* <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <Card className="rounded-3xl border-0 shadow-lg bg-white">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Бүртгэлийн маягт
                            </h3>
                            <div className="w-full h-96 rounded-2xl overflow-hidden bg-gray-50">
                                <iframe 
                                    src={course.signupForm}
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0" 
                                    marginHeight={0} 
                                    marginWidth={0}
                                    className="rounded-2xl"
                                >
                                    Loading…
                                </iframe>
                            </div>
                            <p className="text-center text-gray-500 text-sm mt-4">
                                Дээрх маягтыг бөглөж, бидэнтэй холбогдоно уу
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section> */}
        </div>
    )
}