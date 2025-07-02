"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign, 
  Award, 
  Users, 
  Languages,
  GraduationCap,
  Calendar,
  Target
} from "lucide-react";
import { getScholarships, searchScholarships, createScholarshipApplication } from "../actions/getCollegesAndScholarships";
import { PROGRAM_TYPES } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    programType: "",
    city: "",
    university: "",
    languageProgram: "",
    minAmount: "",
    maxAmount: "",
    hskRequired: "",
    ieltsRequired: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  useEffect(() => {
    // Get search term from URL params
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    
    fetchScholarships();
  }, [searchParams]);

  const fetchScholarships = async () => {
    try {
      setIsLoading(true);
      const urlSearch = searchParams.get('search');
      
      const filterParams = {
        programType: filters.programType ? filters.programType as ("bachelor" | "master" | "phd") : undefined,
        city: filters.city || undefined,
        university: filters.university || undefined,
        languageProgram: filters.languageProgram === "true" ? true : filters.languageProgram === "false" ? false : undefined,
        minAmount: filters.minAmount ? parseInt(filters.minAmount) : undefined,
        maxAmount: filters.maxAmount ? parseInt(filters.maxAmount) : undefined,
        hskRequired: filters.hskRequired ? parseInt(filters.hskRequired) : undefined,
        ieltsRequired: filters.ieltsRequired ? parseFloat(filters.ieltsRequired) : undefined,
      };

      let result;
      if (urlSearch || searchTerm) {
        result = await searchScholarships(urlSearch || searchTerm, filterParams);
      } else {
        result = await getScholarships(filterParams);
      }
      
      setScholarships(result);
      
      if (process.env.NODE_ENV === "development") {
        console.log("📚 Scholarships loaded:", result.length);
      }
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      toast({
        title: "Error",
        description: "Failed to load scholarships",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const filterParams = {
        programType: filters.programType ? filters.programType as ("bachelor" | "master" | "phd") : undefined,
        city: filters.city || undefined,
        university: filters.university || undefined,
        languageProgram: filters.languageProgram === "true" ? true : filters.languageProgram === "false" ? false : undefined,
        minAmount: filters.minAmount ? parseInt(filters.minAmount) : undefined,
        maxAmount: filters.maxAmount ? parseInt(filters.maxAmount) : undefined,
        hskRequired: filters.hskRequired ? parseInt(filters.hskRequired) : undefined,
        ieltsRequired: filters.ieltsRequired ? parseFloat(filters.ieltsRequired) : undefined,
      };

      const result = searchTerm 
        ? await searchScholarships(searchTerm, filterParams)
        : await getScholarships(filterParams);
      
      setScholarships(result);
      
      // Update URL with search term
      if (searchTerm) {
        router.push(`/scholarships?search=${encodeURIComponent(searchTerm)}`);
      } else {
        router.push('/scholarships');
      }
    } catch (error) {
      console.error("Error searching scholarships:", error);
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleApply = async (scholarshipId: number) => {
    try {
      const result = await createScholarshipApplication({
        scholarshipId,
        hskLevel: 0,
        ieltsScore: 0,
        previousEducation: "",
        motivationLetter: ""
      });

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Application created! Complete your application now.",
        });
        router.push(`/applications/${result.data.applicationId}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating application:", error);
        toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      programType: "",
      city: "",
      university: "",
      languageProgram: "",
      minAmount: "",
      maxAmount: "",
      hskRequired: "",
      ieltsRequired: ""
    });
    setSearchTerm("");
    router.push('/scholarships');
  };

  const isDeadlineClose = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isDeadlinePassed = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Loading scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Scholarships</h1>
        <p className="text-gray-600">
          Discover Chinese university scholarships tailored for Mongolian students
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scholarships, universities, majors..."
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Program Type</label>
                <Select value={filters.programType} onValueChange={(value) => setFilters({...filters, programType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Programs</SelectItem>
                    <SelectItem value="bachelor">Bachelor's</SelectItem>
                    <SelectItem value="master">Master's</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">City</label>
                <Input
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  placeholder="Beijing, Shanghai..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">University</label>
                <Input
                  value={filters.university}
                  onChange={(e) => setFilters({...filters, university: e.target.value})}
                  placeholder="University name..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Language Program</label>
                <Select value={filters.languageProgram} onValueChange={(value) => setFilters({...filters, languageProgram: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="true">Language Program</SelectItem>
                    <SelectItem value="false">Academic Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Min Amount (¥)</label>
                <Input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Max Amount (¥)</label>
                <Input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                  placeholder="200000"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Max HSK Required</label>
                <Select value={filters.hskRequired} onValueChange={(value) => setFilters({...filters, hskRequired: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Level</SelectItem>
                    <SelectItem value="3">HSK 3 or lower</SelectItem>
                    <SelectItem value="4">HSK 4 or lower</SelectItem>
                    <SelectItem value="5">HSK 5 or lower</SelectItem>
                    <SelectItem value="6">HSK 6 or lower</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Max IELTS Required</label>
                <Input
                  type="number"
                  step="0.5"
                  value={filters.ieltsRequired}
                  onChange={(e) => setFilters({...filters, ieltsRequired: e.target.value})}
                  placeholder="7.0"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button onClick={handleSearch} disabled={isSearching}>
                Apply Filters
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-600">
          Found {scholarships.length} scholarship{scholarships.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Scholarship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant={scholarship.languageProgram ? "secondary" : "default"}>
                  {scholarship.languageProgram ? "Language Program" : PROGRAM_TYPES[scholarship.programType as keyof typeof PROGRAM_TYPES]}
                </Badge>
                {scholarship.scholarshipAmount && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ¥{scholarship.scholarshipAmount.toLocaleString()}
                  </Badge>
                )}
              </div>
              
              <CardTitle className="text-lg line-clamp-2">{scholarship.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {scholarship.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span>{scholarship.major}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="line-clamp-1">{scholarship.university}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{scholarship.city}</span>
                </div>

                {scholarship.hskRequired && (
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-gray-500" />
                    <span>HSK {scholarship.hskRequired} required</span>
                  </div>
                )}

                {scholarship.ieltsRequired && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span>IELTS {scholarship.ieltsRequired} required</span>
                  </div>
                )}

                {scholarship.applicationDeadline && (
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${
                      isDeadlinePassed(scholarship.applicationDeadline) ? 'text-red-500' : 
                      isDeadlineClose(scholarship.applicationDeadline) ? 'text-orange-500' : 'text-gray-500'
                    }`} />
                    <span className={
                      isDeadlinePassed(scholarship.applicationDeadline) ? 'text-red-600 font-medium' : 
                      isDeadlineClose(scholarship.applicationDeadline) ? 'text-orange-600 font-medium' : ''
                    }>
                      Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                      {isDeadlineClose(scholarship.applicationDeadline) && !isDeadlinePassed(scholarship.applicationDeadline) && (
                        <span className="text-orange-600 ml-1">• Soon!</span>
                      )}
                      {isDeadlinePassed(scholarship.applicationDeadline) && (
                        <span className="text-red-600 ml-1">• Expired</span>
                      )}
                    </span>
                  </div>
                )}

                {scholarship._count?.applications > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{scholarship._count.applications} application{scholarship._count.applications !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <Separator className="mb-4" />

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push(`/scholarships/${scholarship.id}`)}
                  className="flex-1"
                >
                  Learn More
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleApply(scholarship.id)}
                  disabled={isDeadlinePassed(scholarship.applicationDeadline)}
                  className="flex-1"
                >
                  {isDeadlinePassed(scholarship.applicationDeadline) ? 'Expired' : 'Apply Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scholarships.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or filters to find more opportunities.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 