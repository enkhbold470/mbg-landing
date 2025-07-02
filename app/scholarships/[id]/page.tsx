"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Building2,
  MapPin,
  Award,
  DollarSign,
  Clock,
  Users,
  Languages,
  Target,
  Calendar,
  BookOpen,
  FileText,
  CheckCircle,
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { getScholarshipById, createScholarshipApplication } from "../../actions/getCollegesAndScholarships";
import { PROGRAM_TYPES } from "@/lib/types";
import { toast } from "sonner";

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = parseInt(params.id as string);
  
  const [scholarship, setScholarship] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (scholarshipId) {
      fetchScholarship();
    }
  }, [scholarshipId]);

  const fetchScholarship = async () => {
    try {
      setIsLoading(true);
      const result = await getScholarshipById(scholarshipId);
      setScholarship(result);
    } catch (error) {
      console.error("Error fetching scholarship:", error);
      toast.error("Failed to load scholarship details");
      router.push("/scholarships");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      const result = await createScholarshipApplication({
        scholarshipId,
        hskLevel: 0,
        ieltsScore: 0,
        previousEducation: "",
        motivationLetter: ""
      });

      if (result.success && result.data) {
        toast.success("Application created! Complete your application now.");
        router.push(`/applications/${result.data.applicationId}`);
      } else {
        toast.error(result.error || "Failed to create application");
      }
    } catch (error) {
      console.error("Error creating application:", error);
      toast.error("Failed to create application");
    } finally {
      setIsApplying(false);
    }
  };

  const isDeadlinePassed = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  };

  const isDeadlineClose = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Scholarship not found</h3>
          <Button onClick={() => router.push("/scholarships")}>
            Back to Scholarships
          </Button>
        </div>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed(scholarship.applicationDeadline);
  const deadlineClose = isDeadlineClose(scholarship.applicationDeadline);
  const daysUntilDeadline = getDaysUntilDeadline(scholarship.applicationDeadline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/scholarships")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scholarships
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold">Scholarship Details</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title and Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={scholarship.languageProgram ? "secondary" : "default"} className="text-sm">
                {scholarship.languageProgram ? "Language Program" : PROGRAM_TYPES[scholarship.programType as keyof typeof PROGRAM_TYPES]}
              </Badge>
              {scholarship.scholarshipAmount && (
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <DollarSign className="h-3 w-3" />
                  ¥{scholarship.scholarshipAmount.toLocaleString()}
                </Badge>
              )}
              {scholarship._count?.applications > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Users className="h-3 w-3" />
                  {scholarship._count.applications} application{scholarship._count.applications !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">{scholarship.title}</h1>
            <p className="text-lg text-gray-600">{scholarship.description}</p>
          </div>

          {/* Deadline Alert */}
          {scholarship.applicationDeadline && (
            <Card className={`${
              deadlinePassed ? 'border-red-200 bg-red-50' : 
              deadlineClose ? 'border-orange-200 bg-orange-50' : 
              'border-blue-200 bg-blue-50'
            }`}>
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className={`h-5 w-5 ${
                  deadlinePassed ? 'text-red-600' : 
                  deadlineClose ? 'text-orange-600' : 
                  'text-blue-600'
                }`} />
                <div>
                  <p className={`font-medium ${
                    deadlinePassed ? 'text-red-900' : 
                    deadlineClose ? 'text-orange-900' : 
                    'text-blue-900'
                  }`}>
                    {deadlinePassed ? 'Application Deadline Passed' : 
                     deadlineClose ? 'Application Deadline Approaching' : 
                     'Application Deadline'}
                  </p>
                  <p className={`text-sm ${
                    deadlinePassed ? 'text-red-700' : 
                    deadlineClose ? 'text-orange-700' : 
                    'text-blue-700'
                  }`}>
                    {new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
                      ` (${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} remaining)`
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* University & Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    University & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">University</p>
                      <p className="text-lg font-semibold">{scholarship.university}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {scholarship.city}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Major/Field of Study</p>
                      <p className="text-lg font-semibold">{scholarship.major}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Program Type</p>
                      <p className="text-lg font-semibold">
                        {scholarship.languageProgram ? "Language Program" : PROGRAM_TYPES[scholarship.programType as keyof typeof PROGRAM_TYPES]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Age Range</p>
                      <p className="text-lg font-semibold">
                        {scholarship.minAge} - {scholarship.maxAge} years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p className="text-lg font-semibold">{scholarship.duration} years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scholarship.hskRequired && (
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Languages className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">HSK Level Required</p>
                          <p className="text-sm text-gray-600">HSK {scholarship.hskRequired} or higher</p>
                        </div>
                      </div>
                    )}
                    
                    {scholarship.ieltsRequired && (
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">IELTS Score Required</p>
                          <p className="text-sm text-gray-600">IELTS {scholarship.ieltsRequired} or higher</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {scholarship.requirements && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Additional Requirements</p>
                      <p className="text-gray-700">{scholarship.requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Description */}
              {scholarship.longDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Detailed Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{scholarship.longDescription}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Apply for this Scholarship</CardTitle>
                  <CardDescription>
                    Start your application process now
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scholarship.scholarshipAmount && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Scholarship Amount</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ¥{scholarship.scholarshipAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600">per year</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleApply}
                    disabled={deadlinePassed || isApplying}
                    className="w-full"
                    size="lg"
                  >
                    {isApplying ? "Creating Application..." : 
                     deadlinePassed ? "Application Closed" : "Apply Now"}
                  </Button>
                  
                  {deadlinePassed && (
                    <p className="text-xs text-red-600 text-center">
                      The application deadline has passed
                    </p>
                  )}
                  
                  {!deadlinePassed && (
                    <p className="text-xs text-gray-500 text-center">
                      You'll be guided through the application process
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Key Facts */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Program Level</span>
                    <span className="text-sm font-medium">
                      {PROGRAM_TYPES[scholarship.programType as keyof typeof PROGRAM_TYPES]}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">{scholarship.duration} years</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Age Range</span>
                    <span className="text-sm font-medium">{scholarship.minAge} - {scholarship.maxAge} years</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Language Program</span>
                    <span className="text-sm font-medium">
                      {scholarship.languageProgram ? "Yes" : "No"}
                    </span>
                  </div>
                  {scholarship._count?.applications > 0 && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Applications</span>
                        <span className="text-sm font-medium">{scholarship._count.applications}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 