
import Image from "next/image"
import Link from "next/link"
import { getPartners } from "@/app/actions/config"

export async function PartnersSection() {
  const partnersData = await getPartners();
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Бидний хамтрагчид</h2>
          <p className="text-xl text-gray-600">
            Дэлхийн алдартай их сургуулиуд болон боловсролын байгууллагуудтай хамтран ажиллаж байна
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partnersData.map((partner, index) => (
            <Link
              key={index}
              href={partner.url}
              className="group transition-all duration-300 hover:scale-110 hover:shadow-lg rounded-2xl p-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white rounded-2xl p-6 shadow-md group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={150}
                  className="grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <p className="text-center text-gray-600 mt-3 text-sm font-medium group-hover:text-purple-600 transition-colors">
                {partner.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 