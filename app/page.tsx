import { HeroSection } from "@/components/hero-section"
// import { PartnersSection } from "@/components/partners-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { AboutSection } from "@/components/about-section"
import { FaqSection } from "@/components/faq-section"
import { CtaSection } from "@/components/cta-section"
import { ContactSection } from "@/components/contact-section"
// Performance: remove scroll-based reveal wrapper

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      
      {/* 1. Hero Section (Above the Fold) */}
      <HeroSection />
      
      {/* 2. Team & Company Information */}
      <AboutSection />
      {/* 3. Social Proof & Trust Builders - Partners */}
      {/* <PartnersSection /> */}
      
      {/* 4. Product or Service Details - Features */}
      <FeaturesSection />
      
      {/* 5. Social Proof & Trust Builders - Testimonials */}
      <TestimonialsSection />
      
      {/* 7. FAQs */}
      <FaqSection />
      
      {/* 8. Additional Conversion Elements - CTA */}
      <CtaSection />
      
      {/* 9. Contact Information */}
      <ContactSection />
      
    </div>
  )
}
