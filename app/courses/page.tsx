"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  duration: string;
  classSize: string;
  startDate: string;
  image: string;
  slug: string;
  signupForm: string;
  highlighted: boolean;
}

export default function CoursesPage() {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const courses = await response.json();
        setCoursesData(courses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Сургалтууд ачаалж байна...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Дахин оролдох
          </Button>
        </div>
      </div>
    );
  }

  // Sort courses to show highlighted courses first
  const sortedCourses = [...coursesData].sort((a: Course, b: Course) => { 
    if (a.highlighted && !b.highlighted) return -1;
    if (!a.highlighted && b.highlighted) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Сургалтууд
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Таны хэрэгцээ, цаг хугацаанд тохирсон хятад хэлний сургалтын хөтөлбөрийг сонгоорой
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {sortedCourses.map((course: Course, index: number) => (
              <Card
                key={course.id || index}
                className={`group relative overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  course.highlighted
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                    : "bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50"
                }`}
              >
                <CardContent className="p-8">
                  {course.highlighted && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-400 text-yellow-900">
                        Онцлох
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={200}
                      className="rounded-2xl w-full h-48 object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${course.highlighted ? "text-white" : "text-gray-900"}`}>
                        {course.title}
                      </h3>
                      <p className={`text-lg font-medium mb-2 ${course.highlighted ? "text-purple-100" : "text-purple-600"}`}>
                        {course.subtitle}
                      </p>
                      <p className={`text-sm ${course.highlighted ? "text-purple-100" : "text-gray-600"}`}>
                        {course.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className={`flex items-center gap-1 text-sm ${course.highlighted ? "text-purple-100" : "text-gray-600"}`}>
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${course.highlighted ? "text-purple-100" : "text-gray-600"}`}>
                        <Users className="w-4 h-4" />
                        {course.classSize}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${course.highlighted ? "text-purple-100" : "text-gray-600"}`}>
                        <Calendar className="w-4 h-4" />
                        {course.startDate}-нөөс эхлэх
                      </div>
                    </div>

                    <div className={`text-3xl font-bold ${course.highlighted ? "text-white" : "text-gray-900"}`}>
                      {course.price}
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/courses/${course.slug}`} className="flex-1">
                        <Button
                          className={`w-full rounded-xl transition-all duration-300 group ${
                            course.highlighted
                              ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                          }`}
                        >
                          Дэлгэрэнгүй
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      
                      <Link href={course.signupForm} target="_blank">
                        <Button
                          variant="outline"
                          className={`px-6 rounded-xl transition-all duration-300 ${
                            course.highlighted
                              ? "border-white/30 text-black hover:bg-white hover:text-purple-600"
                              : "border-purple-300 text-purple-600 hover:bg-purple-500"
                          }`}
                        >
                          Бүртгүүлэх
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
    