export const siteConfig = {
  name: "MBG Scholarship",
  description: "Expert guidance for Mongolian students pursuing Chinese scholarships",
  tagline: "Your pathway to Chinese education excellence",
  url: "https://mbg-scholarship.com",
  ogImage: "https://mbg-scholarship.com/og.jpg",
  
  // Service details
  service: {
    target: "Mongolian students seeking Chinese college scholarships",
    coverage: "All scholarship types: Government, Local, University, Stipends",
    sources: "Comprehensive data from campuschina.org and official sources",
    languages: ["English", "Mongolian", "Chinese"],
    fee_structure: {
      consultation: "Free initial consultation",
      basic_plan: "Application guidance and document review",
      premium_plan: "Full-service application management",
      success_fee: "Only pay when you get accepted"
    }
  },

  // Features
  features: {
    scholarship_discovery: "AI-powered matching with 1000+ scholarships",
    college_selection: "Expert guidance on university choices", 
    document_management: "Complete document preparation and review",
    application_tracking: "Real-time status updates",
    interview_prep: "Mock interviews and coaching",
    visa_support: "Student visa application assistance"
  },

  // Contact information
  contact: {
    email: "info@china-scholarship-navigator.com",
    phone: "+976 11 123456",
    wechat: "ChinaScholarshipMN",
    office: "Ulaanbaatar, Mongolia"
  },

  // Social links
  links: {
    twitter: "https://twitter.com/mbgscholarship",
    github: "https://github.com/enkhbold470/mbg-cargo",
    discord: "https://discord.gg/bJWTS7qem6",
  },

  // Navigation
  mainNav: [
    {
      title: "Scholarships",
      href: "/scholarships",
    },
    {
      title: "Colleges",
      href: "/colleges", 
    },
    {
      title: "My Applications",
      href: "/applications",
    },
    {
      title: "Documents",
      href: "/documents",
    },
    {
      title: "Pricing",
      href: "/pricing",
    }
  ],

  // Scholarship categories
  scholarshipTypes: [
    "CSC Government Scholarships",
    "Provincial Government Scholarships", 
    "University Scholarships",
    "Belt and Road Initiative",
    "Confucius Institute Scholarships",
    "MOFCOM Scholarships",
    "Private Foundation Scholarships",
    "Language Program Scholarships"
  ],

  // Study levels
  studyLevels: [
    "Bachelor's Degree",
    "Master's Degree", 
    "PhD/Doctoral",
    "Language Programs",
    "Exchange Programs",
    "Summer Schools"
  ],

  // Popular study fields
  popularFields: [
    "Engineering & Technology",
    "Business & Economics", 
    "Medicine & Health Sciences",
    "Computer Science & IT",
    "International Relations",
    "Chinese Language & Literature",
    "Environmental Science",
    "Architecture & Design"
  ],

  supportedPrograms: [
    "Bachelor's Degree",
    "Master's Degree", 
    "PhD/Doctorate",
    "Chinese Language Program",
    "Exchange Programs"
  ],

  servicePlans: [
    {
      name: "Free Consultation",
      price: 0,
      features: [
        "Initial assessment",
        "Basic scholarship recommendations",
        "Application timeline",
        "Requirements checklist"
      ]
    },
    {
      name: "Basic Plan",
      price: 299,
      features: [
        "Everything in Free Plan",
        "Document review",
        "3 scholarship applications",
        "Email support",
        "Basic interview prep"
      ]
    },
    {
      name: "Premium Plan", 
      price: 799,
      features: [
        "Everything in Basic Plan",
        "Unlimited applications",
        "Personal agent support",
        "Document translation help",
        "Visa application support",
        "Interview coaching",
        "Success guarantee"
      ]
    }
  ]
} as const

export type SiteConfig = typeof siteConfig

export const metaConfig = {
  generator: 'Next.js',
  applicationName: 'MBG College Scholarship Finder',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'MBG College', 'Scholarships', 'Education', 'International Students',
    'Bachelor Degree', 'Master Degree', 'HSK', 'IELTS', 'China Education',
    'Study Abroad', 'Scholarship Application', 'Academic Programs'
  ],
  authors: [{ name: 'Enkhbold Ganbold', url: 'https://github.com/enkhbold470' }],
  creator: 'MBG College Team',
  publisher: 'MBG College',
};