// follows with slug [slug]
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import Image from "next/image";
import { youtubeVideo } from "@/lib/utils";

export default function CourseDetailPage({ params }: { params: { slug: string } }) { 

    const course = siteConfig.courses.find((course) => course.slug === params.slug);
    console.log(course);

    return (
        <div>
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-gray-500">{course?.description}</p>
            <p className="text-gray-500">{course?.price}</p>
            <p className="text-gray-500">{course?.duration}</p>
            <p className="text-gray-500">{course?.subtitle}</p>
            <p className="text-gray-500">{course?.slug}</p>
            <p className="text-gray-500">{course?.highlighted}</p>
            <p className="text-gray-500">{course?.signupForm}</p>
            <iframe width="560" height="315" src={youtubeVideo(course?.video || "")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <Image src={course?.image || ""} alt={course?.title || ""} width={500} height={500} />


            <Link href={course?.signupForm || ""}>
                <Button>
                    <p>Signup</p>
                </Button>
            </Link>
        </div>
    )
}