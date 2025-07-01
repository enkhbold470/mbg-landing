export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: {
    url: string;
    height: number;
    width: number;
  };
  ogUrl: string;
  ogType: string;
  links: {
    github: string;
  };
  contacts: {
    email: string;
    phone: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "MBG Cargo",
  title: "MBG Cargo - Global Freight Solutions",
  description: "Professional cargo shipping services with real-time tracking, insurance coverage, and competitive rates worldwide.",
  url: "https://mbg-cargo.com",
  ogImage: {
    url: "https://placekeanu.com/500",
    height: 630,
    width: 1200
  },
  ogUrl: "https://mbg-cargo.com",
  ogType: "website",
  links: {
    github: "https://github.com/enkhbold470/mbg-cargo",
  },
  contacts: {
    email: "support@mbg-cargo.com",
    phone: "+86-400-888-9999",
  },
};

export const metaConfig = {
  generator: 'Next.js',
  applicationName: 'MBG Cargo',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Cargo Shipping', 'Freight', 'Logistics', 'International Shipping',
    'Cargo Tracking', 'Air Freight', 'Sea Freight', 'Land Transport',
    'Insurance', 'Global Shipping', 'Supply Chain', 'Import Export'
  ],
  authors: [{ name: 'Enkhbold Ganbold', url: 'https://github.com/enkhbold470' }],
  creator: 'MBG Cargo Team',
  publisher: 'MBG Cargo',
};