"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Award,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  DollarSign
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "./actions/getCurrentUser";
import { getScholarships, getScholarshipStats } from "./actions/getCollegesAndScholarships";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredScholarships, setFeaturedScholarships] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userProfile, scholarships, scholarshipStats] = await Promise.all([
          getCurrentUser(),
          getScholarships(),
          getScholarshipStats()
        ]);
        
        setProfile(userProfile);
        // Get top 3 featured scholarships
        setFeaturedScholarships(scholarships.slice(0, 3));
        setStats(scholarshipStats);
        
        if (process.env.NODE_ENV === "development") {
          console.log("📚 Home data loaded");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/scholarships?search=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push("/scholarships");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p>Loading {siteConfig.name}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {siteConfig.name}
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">
              {siteConfig.tagline}
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Expert guidance for Mongolian students pursuing Chinese college scholarships. 
              We handle everything so you can focus on your studies.
            </p>
          </div>

          {/* Quick Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search scholarships, universities..."
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                />
              </div>
              <Button onClick={handleQuickSearch}>
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {!profile ? (
              <>
                <Button size="lg" onClick={() => router.push("/sign-up")} className="w-full md:w-auto">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/scholarships")} className="w-full md:w-auto">
                  Browse Scholarships
                </Button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Welcome back, {profile.full_name || 'Student'}!</p>
                <div className="flex gap-4">
                  <Button onClick={() => router.push("/applications")}>
                    My Applications
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/scholarships")}>
                    Find More Scholarships
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Service Features */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Service?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're not just a platform - we're your personal agents dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Expert Agent Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dedicated agents guide you through every step. From document preparation to interview coaching.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Comprehensive Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access to 1000+ scholarships from campuschina.org and official sources. Government, university, and private options.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Success-Based Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fair pricing model. Free consultation, reasonable service fees, and success bonuses only when you get accepted.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Scholarships */}
        {featuredScholarships.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Scholarships</h2>
                <p className="text-gray-600">Hand-picked opportunities for Mongolian students</p>
              </div>
              <Link href="/scholarships">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="default">
                        {scholarship.program_type === "bachelor" ? "Bachelor" : 
                         scholarship.program_type === "master" ? "Master" : "PhD"}
                      </Badge>
                      {scholarship.scholarship_amount && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ¥{scholarship.scholarship_amount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{scholarship.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {scholarship.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>{scholarship.major}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{scholarship.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="line-clamp-1">{scholarship.university}</span>
                      </div>
                      {scholarship.application_deadline && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            Deadline: {new Date(scholarship.application_deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => router.push(`/scholarships/${scholarship.id}`)}
                      className="w-full"
                      size="sm"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Process Steps */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Simple 4-step process to your Chinese scholarship</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Free Consultation",
                description: "Tell us about your background, goals, and preferences. We'll assess your chances."
              },
              {
                step: "02", 
                title: "Personalized Matching",
                description: "Our experts find scholarships that match your profile and maximize success probability."
              },
              {
                step: "03",
                title: "Application Preparation", 
                description: "We help prepare all documents, essays, and applications. Professional review included."
              },
              {
                step: "04",
                title: "Submission & Follow-up",
                description: "We submit applications and track progress. Interview prep and visa support included."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        {stats && (
          <section className="mb-16">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalScholarships}+</div>
                  <div className="text-gray-600">Available Scholarships</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.popularUniversities?.length || 300}+</div>
                  <div className="text-gray-600">Partner Universities</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(stats.successRate)}%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalApplications}+</div>
                  <div className="text-gray-600">Applications Processed</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of Mongolian students who've successfully received Chinese scholarships
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => router.push("/sign-up")}>
              Get Free Consultation
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/scholarships")} className="text-white border-white hover:bg-white hover:text-blue-600">
              Browse Scholarships
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
