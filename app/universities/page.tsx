"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Building2, 
  Award, 
  ChevronRight,
  GraduationCap,
  University,
  Star
} from "lucide-react";
import { getUniversities } from "../actions/getCollegesAndScholarships";

interface UniversityData {
  name: string;
  city: string;
  scholarshipCount: number;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<UniversityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    // Filter universities based on search term
    if (searchTerm.trim() === "") {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uni.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [searchTerm, universities]);

  const fetchUniversities = async () => {
    try {
      setIsLoading(true);
      const result = await getUniversities();
      setUniversities(result);
      setFilteredUniversities(result);
      
      if (process.env.NODE_ENV === "development") {
        console.log("🏫 Universities loaded:", result.length);
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUniversityClick = (universityName: string) => {
    router.push(`/universities/${encodeURIComponent(universityName)}`);
  };

  // Get top cities by scholarship count
  const topCities = universities.reduce((acc, uni) => {
    if (!acc[uni.city]) {
      acc[uni.city] = { count: 0, universities: 0 };
    }
    acc[uni.city].count += uni.scholarshipCount;
    acc[uni.city].universities += 1;
    return acc;
  }, {} as Record<string, { count: number; universities: number }>);

  const sortedCities = Object.entries(topCities)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Loading universities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Universities</h1>
        <p className="text-gray-600">
          Explore Chinese universities offering scholarships for international students
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
            <University className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{universities.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scholarships</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {universities.reduce((sum, uni) => sum + uni.scholarshipCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cities Covered</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(universities.map(uni => uni.city)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Cities */}
      {sortedCities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sortedCities.map(([city, data]) => (
              <Card key={city} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSearchTerm(city)}>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-semibold text-sm">{city}</p>
                  <p className="text-xs text-gray-500">{data.universities} unis</p>
                  <p className="text-xs text-gray-500">{data.count} scholarships</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search universities or cities..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          {searchTerm ? `Found ${filteredUniversities.length} universities` : `Showing all ${universities.length} universities`}
        </p>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUniversities.map((university, index) => (
          <Card 
            key={`${university.name}-${university.city}`} 
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleUniversityClick(university.name)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {university.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {university.city}
                  </CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {university.scholarshipCount} scholarship{university.scholarshipCount !== 1 ? 's' : ''} available
                  </span>
                </div>
                
                {university.scholarshipCount >= 5 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Popular
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUniversityClick(university.name);
                  }}
                  className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                >
                  View Scholarships
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUniversities.length === 0 && (
        <div className="text-center py-12">
          <University className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No universities found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No universities match "${searchTerm}". Try a different search term.`
              : "No universities are currently available."
            }
          </p>
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")} variant="outline">
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Educational Note */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-4">
          <GraduationCap className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Why Study in China?</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              China offers world-class education, rich cultural experiences, and excellent career opportunities. 
              With over 2,900 universities and colleges, students can choose from diverse programs taught in 
              Chinese or English. The Chinese Government Scholarship (CGS) and various university scholarships 
              make quality education accessible to international students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 