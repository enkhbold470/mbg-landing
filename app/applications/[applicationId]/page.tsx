"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  User, 
  GraduationCap, 
  Upload, 
  CheckCircle, 
  Building2,
  MapPin,
  Award,
  DollarSign,
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  Check
} from "lucide-react";
import { getApplicationById, submitApplication } from "../../actions/getCollegesAndScholarships";
import { APPLICATION_STATUS_LABELS, ApplicationStatus } from "@/lib/types";
import { toast } from "sonner";

const APPLICATION_STEPS = [
  {
    id: "overview",
    title: "Overview",
    description: "Application summary",
    icon: FileText
  },
  {
    id: "personal",
    title: "Personal Info",
    description: "Basic information",
    icon: User
  },
  {
    id: "academic",
    title: "Academic Background",
    description: "Education details",
    icon: GraduationCap
  },
  {
    id: "documents",
    title: "Documents",
    description: "Required files",
    icon: Upload
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Final review",
    icon: CheckCircle
  }
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;
  
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hskLevel: 0,
    ieltsScore: 0,
    previousEducation: "",
    motivationLetter: "",
    personalInfo: {
      phone: "",
      age: "",
      nationality: ""
    }
  });

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      const result = await getApplicationById(applicationId);
      
      if (!result) {
        toast.error("Application not found");
        router.push("/applications");
        return;
      }

      setApplication(result);
      setFormData({
        hskLevel: result.hskLevel || 0,
        ieltsScore: result.ieltsScore || 0,
        previousEducation: result.previousEducation || "",
        motivationLetter: result.motivationLetter || "",
        personalInfo: {
          phone: result.user?.phone || "",
          age: result.user?.age?.toString() || "",
          nationality: result.user?.nationality || ""
        }
      });
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application");
      router.push("/applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      setIsSubmitting(true);
      const result = await submitApplication(applicationId);
      
      if (result.success) {
        toast.success("Application submitted successfully!");
        router.push("/applications");
      } else {
        toast.error(result.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepCompletion = (stepId: string) => {
    switch (stepId) {
      case "personal":
        return formData.personalInfo.phone && formData.personalInfo.age && formData.personalInfo.nationality;
      case "academic":
        return formData.hskLevel > 0 && formData.ieltsScore > 0 && formData.previousEducation;
      case "documents":
        return true;
      case "review":
        return formData.motivationLetter.length > 50;
      default:
        return true;
    }
  };

  const getTotalProgress = () => {
    const completedSteps = APPLICATION_STEPS.filter(step => getStepCompletion(step.id)).length;
    return (completedSteps / APPLICATION_STEPS.length) * 100;
  };

  const canSubmit = () => {
    return APPLICATION_STEPS.every(step => getStepCompletion(step.id)) && 
           application?.status === ApplicationStatus.DRAFT;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Application not found</h3>
          <Button onClick={() => router.push("/applications")}>
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Application Overview</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Scholarship Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">{application.scholarship?.title}</h3>
                <p className="text-gray-600">{application.scholarship?.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>{application.scholarship?.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{application.scholarship?.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span>{application.scholarship?.programType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>${application.scholarship?.scholarshipAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    {APPLICATION_STATUS_LABELS[application.status as keyof typeof APPLICATION_STATUS_LABELS]}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    ID: {application.applicationId}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Progress</span>
                    <span>{Math.round(getTotalProgress())}%</span>
                  </div>
                  <Progress value={getTotalProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "personal":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      value={application.user?.fullName || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      value={application.user?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone"
                      placeholder="+976-9999-1234"
                      value={formData.personalInfo.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, phone: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input 
                      id="age"
                      type="number"
                      placeholder="22"
                      value={formData.personalInfo.age}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, age: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input 
                      id="nationality"
                      placeholder="Mongolian"
                      value={formData.personalInfo.nationality}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, nationality: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "academic":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Academic Background</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Language Proficiency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hskLevel">HSK Level *</Label>
                    <Select 
                      value={formData.hskLevel.toString()} 
                      onValueChange={(value) => setFormData({...formData, hskLevel: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select HSK Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No HSK Certificate</SelectItem>
                        <SelectItem value="1">HSK Level 1</SelectItem>
                        <SelectItem value="2">HSK Level 2</SelectItem>
                        <SelectItem value="3">HSK Level 3</SelectItem>
                        <SelectItem value="4">HSK Level 4</SelectItem>
                        <SelectItem value="5">HSK Level 5</SelectItem>
                        <SelectItem value="6">HSK Level 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ieltsScore">IELTS Score *</Label>
                    <Input 
                      id="ieltsScore"
                      type="number"
                      step="0.5"
                      placeholder="7.0"
                      value={formData.ieltsScore}
                      onChange={(e) => setFormData({...formData, ieltsScore: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Educational Background</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="previousEducation">Previous Education *</Label>
                <Textarea 
                  id="previousEducation"
                  placeholder="Describe your educational background..."
                  value={formData.previousEducation}
                  onChange={(e) => setFormData({...formData, previousEducation: e.target.value})}
                  rows={5}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Required Documents</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Document Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Passport Copy", required: true },
                  { name: "Academic Transcripts", required: true },
                  { name: "Diploma Certificate", required: true },
                  { name: "HSK Certificate", required: formData.hskLevel > 0 },
                  { name: "IELTS Certificate", required: formData.ieltsScore > 0 },
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.required ? "Required" : "Optional"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Review & Submit</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Motivation Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Write your motivation letter here..."
                  value={formData.motivationLetter}
                  onChange={(e) => setFormData({...formData, motivationLetter: e.target.value})}
                  rows={10}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Minimum 50 characters. Current: {formData.motivationLetter.length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Personal Information</p>
                    <p className="text-gray-600">
                      {formData.personalInfo.phone ? "✓ Complete" : "✗ Incomplete"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Academic Background</p>
                    <p className="text-gray-600">
                      {formData.previousEducation ? "✓ Complete" : "✗ Incomplete"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Language Scores</p>
                    <p className="text-gray-600">
                      HSK: {formData.hskLevel}, IELTS: {formData.ieltsScore}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Motivation Letter</p>
                    <p className="text-gray-600">
                      {formData.motivationLetter.length > 50 ? "✓ Complete" : "✗ Too short"}
                    </p>
                  </div>
                </div>
                
                {canSubmit() && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <p className="font-medium">Ready to Submit</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Your application is complete and ready for submission.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push("/applications")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold">Application Details</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              {application?.status === ApplicationStatus.DRAFT && (
                <Button 
                  size="sm"
                  onClick={handleSubmitApplication}
                  disabled={!canSubmit() || isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="w-80 shrink-0">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Application Steps</CardTitle>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(getTotalProgress())}%</span>
                  </div>
                  <Progress value={getTotalProgress()} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {APPLICATION_STEPS.map((step) => {
                    const Icon = step.icon;
                    const isCompleted = getStepCompletion(step.id);
                    const isActive = activeStep === step.id;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          isActive ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                        }`}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600' 
                            : isActive 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${
                            isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                          }`}>
                            {step.title}
                          </p>
                          <p className={`text-xs ${
                            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Step Details */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                {renderStepContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
