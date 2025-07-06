import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import Link from "next/link";
export default function CoursesPage() {
  return (
   
//    {/* Courses Section */}
   <section id="courses" className="py-20 px-6">
   <div className="max-w-7xl mx-auto">
     <div className="text-center mb-16">
       <h2 className="text-5xl font-bold text-gray-900 mb-6">Сургалтын хөтөлбөрүүд</h2>
       <p className="text-xl text-gray-600 max-w-2xl mx-auto">
         Таны хэрэгцээ, цаг хугацаанд тохирсон сургалтын хөтөлбөрийг сонгоорой
       </p>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       {siteConfig.courses.map((course, index) => (
        <Link href={`/courses/${course.slug}`} key={index}> 
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
                 Дэлгэрэнгүй
               </Button>
             </div>
           </CardContent>
         </Card>
         </Link>
       ))}
     </div>
   </div>
 </section>


    )
  }
    