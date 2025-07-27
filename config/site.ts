export const aboutUs = {
  title: "Танилцуулга",
  description: "MBG Education Center нь 2016 оноос хойш тасралтгүй үйл ажиллагаагаа зохион байгуулж, ажиллаж байна. MBG ХХК нь...Боловсрол, Сургалт аялал, Мэдээлэл зөвлөгөө чиглэлээр 9 дахь жилдээ...Тэг-с ТЭТГЭЛЭГТ ТЭНЦЭХ хүртэл нь... MBG гэдэг нь Mongolian Business Guide гэсэн үг. Зөвхөн сургалтын үйл ажиллагаагаа зохион байгуулаад зогсохгүй, бид бусад үйл ажиллагаагаа нэмэлтээр үйл ажиллаж байна.",
  image: "https://raw.githubusercontent.com/enkhbold470/mbg-landing/refs/heads/main/public/og.jpg",
  video: "https://www.youtube.com/watch?v=2dJnlynLmVM",
  facebook: [
    {
      name: "Learning China",
      url: "https://www.facebook.com/learningchina"
    },
  ]
}
export const ctaSection = {
  title: "Өнөөдөр л эхлээрэй",
  subtitle: "Хятад хэлийг эзэмшиж, ирээдүйн боломжуудыг нээж аваарай",
  primaryCta: {
    text: "Үнэгүй зөвлөгөө авах",
    href: "/#contact"
  },
  secondaryCta: { 
    text: "🇲🇳 Сургалтын хөтөлбөрүүд",
    href: "/courses"
  }
}

export const siteConfig = {
  name: "MBG Education",
  description: "Хятадын хэлийг эзэмших мэргэжлийн сургалт",
  tagline: "Тэгээс тэтгэлэгт тэнцэх нь",
  slogan: "MBG гээс бүгдийг нь",
  url: "https://mbg.mn",
  ogImage: "https://raw.githubusercontent.com/enkhbold470/mbg-landing/refs/heads/main/public/og.png",
  
  // Холбоо барих мэдээлэл
  contact: {
    email: "info@mbg.com",
    phones: [
      "(+976) 77117678",
      "(+976) 99797678", 
    ],
    address: {
      mongolian: "Танан төв 202, Сүхбаатар дүүрэг, 8-р хороо, Улаанбаатар",
      english: "Tanan center-202, 8th khoroo, Ulaanbaatar Mongolia"
    },
    social: {
      facebook: [
        {
          name: "Learning China",
          url: "https://www.facebook.com/learningchina"
        },
        {
          name: "MBG Education", 
          url: "https://www.facebook.com/MBGeduMBGtourMBGConsulting"
        }
      ]
    }
  },

  // Нийгмийн холбоосууд
  links: {
    github: "mailto:enkhbold470@gmail.com",
    facebook: "https://www.facebook.com/learningchina",
  },

  
} as const

export type SiteConfig = typeof siteConfig

export const metaConfig = {
  generator: 'Next.js',
  title: 'MBG Боловсрол',
  description: 'Хятадын хэлийг эзэмших мэргэжлийн сургалт',
  url: 'https://mbg.mn',
  ogImage: 'https://raw.githubusercontent.com/enkhbold470/mbg-landing/refs/heads/main/public/og.png',
  keywords: [
    'MBG Боловсрол', 'Хятад хэл', 'HSK', 'Хятадын боловсрол',
    'Хэл сургалт', 'Монгол', 'Хятад хэлний сургалт', 'Улаанбаатар'
  ],
  applicationName: 'MBG Боловсрол',
  referrer: 'origin-when-cross-origin',
  
  authors: [{ name: 'Энхболд Ганболд', url: 'https://github.com/enkhbold470' }],
  creator: 'MBG Center',
  publisher: 'MBG Center',
};
