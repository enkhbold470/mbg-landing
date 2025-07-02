"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Award, 
  Building2, 
  MapPin,
  Plus,
  Edit,
  Eye,
  Send
} from "lucide-react";
import { getUserApplications, submitApplication } from "../actions/getCollegesAndScholarships";
import { APPLICATION_STATUS_LABELS, ApplicationStatus } from "@/lib/types";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingIds, setSubmittingIds] = useState<Set<string>>(new Set());

  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const result = await getUserApplications();
      setApplications(result);
      
      if (process.env.NODE_ENV === "development") {
        console.log("📄 Applications loaded:", result.length);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitApplication = async (applicationId: string) => {
    try {
      setSubmittingIds(prev => new Set([...prev, applicationId]));
      
      const result = await submitApplication(applicationId);
      
      if (result.success) {
        toast.success("Application submitted successfully!");
        await fetchApplications();
      } else {
        toast.error(result.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setSubmittingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.DRAFT:
        return <Edit className="h-4 w-4" />;
      case ApplicationStatus.SUBMITTED:
        return <Clock className="h-4 w-4" />;
      case ApplicationStatus.UNDER_REVIEW:
        return <AlertCircle className="h-4 w-4" />;
      case ApplicationStatus.APPROVED:
        return <CheckCircle className="h-4 w-4" />;
      case ApplicationStatus.REJECTED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.DRAFT:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case ApplicationStatus.SUBMITTED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ApplicationStatus.UNDER_REVIEW:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ApplicationStatus.APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressPercentage = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.DRAFT:
        return 20;
      case ApplicationStatus.SUBMITTED:
        return 40;
      case ApplicationStatus.UNDER_REVIEW:
        return 70;
      case ApplicationStatus.APPROVED:
        return 100;
      case ApplicationStatus.REJECTED:
        return 100;
      default:
        return 0;
    }
  };

  const isDeadlinePassed = (deadline: any) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    return deadlineDate < new Date();
  };

  const canSubmit = (app: any) => {
    return app.status === ApplicationStatus.DRAFT && 
           !isDeadlinePassed(app.scholarship?.applicationDeadline) &&
           app.hskLevel !== null &&
           app.ieltsScore !== null &&
           app.previousEducation &&
           app.motivationLetter;
  };

  const draftApplications = applications.filter(app => app.status === ApplicationStatus.DRAFT);
  const activeApplications = applications.filter(app => 
    [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW].includes(app.status)
  );
  const completedApplications = applications.filter(app => 
    [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED].includes(app.status)
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <Button onClick={() => router.push("/scholarships")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </div>
        <p className="text-gray-600">
          Track and manage your scholarship applications
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{draftApplications.length}</div>
            <p className="text-sm text-gray-600">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activeApplications.length}</div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {applications.filter(app => app.status === ApplicationStatus.APPROVED).length}
            </div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-4">
            Start your journey by applying for scholarships that match your profile.
          </p>
          <Button onClick={() => router.push("/scholarships")}>
            <Plus className="h-4 w-4 mr-2" />
            Browse Scholarships
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({draftApplications.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeApplications.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {applications.map((app) => (
                <ApplicationCard 
                  key={app.id} 
                  application={app} 
                  onSubmit={handleSubmitApplication}
                  isSubmitting={submittingIds.has(app.applicationId)}
                  canSubmit={canSubmit(app)}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                  getProgressPercentage={getProgressPercentage}
                  isDeadlinePassed={isDeadlinePassed}
                  router={router}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="mt-6">
            <div className="space-y-4">
              {draftApplications.map((app) => (
                <ApplicationCard 
                  key={app.id} 
                  application={app} 
                  onSubmit={handleSubmitApplication}
                  isSubmitting={submittingIds.has(app.applicationId)}
                  canSubmit={canSubmit(app)}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                  getProgressPercentage={getProgressPercentage}
                  isDeadlinePassed={isDeadlinePassed}
                  router={router}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">
              {activeApplications.map((app) => (
                <ApplicationCard 
                  key={app.id} 
                  application={app} 
                  onSubmit={handleSubmitApplication}
                  isSubmitting={submittingIds.has(app.applicationId)}
                  canSubmit={canSubmit(app)}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                  getProgressPercentage={getProgressPercentage}
                  isDeadlinePassed={isDeadlinePassed}
                  router={router}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {completedApplications.map((app) => (
                <ApplicationCard 
                  key={app.id} 
                  application={app} 
                  onSubmit={handleSubmitApplication}
                  isSubmitting={submittingIds.has(app.applicationId)}
                  canSubmit={canSubmit(app)}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                  getProgressPercentage={getProgressPercentage}
                  isDeadlinePassed={isDeadlinePassed}
                  router={router}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ApplicationCard({ 
  application, 
  onSubmit, 
  isSubmitting, 
  canSubmit, 
  getStatusIcon,
  getStatusColor,
  getProgressPercentage,
  isDeadlinePassed,
  router 
}: any) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg line-clamp-1">
                {application.scholarship?.title || 'Scholarship Application'}
              </CardTitle>
              <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                {APPLICATION_STATUS_LABELS[application.status as keyof typeof APPLICATION_STATUS_LABELS] || application.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {application.scholarship?.university || 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {application.scholarship?.city || 'N/A'}
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {application.scholarship?.major || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Application Progress</span>
            <span>{getProgressPercentage(application.status)}%</span>
          </div>
          <Progress value={getProgressPercentage(application.status)} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500">Application ID</p>
            <p className="font-medium">{application.applicationId}</p>
          </div>
          
          <div>
            <p className="text-gray-500">Applied</p>
            <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
          </div>
          
          {application.scholarship?.applicationDeadline && (
            <div>
              <p className="text-gray-500">Deadline</p>
              <p className={`font-medium ${isDeadlinePassed(application.scholarship.applicationDeadline) ? 'text-red-600' : ''}`}>
                {new Date(application.scholarship.applicationDeadline).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {application.scholarship?.scholarshipAmount && (
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">¥{application.scholarship.scholarshipAmount.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Documents Status */}
        {application.documents && application.documents.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Documents ({application.documents.length})</p>
            <div className="flex flex-wrap gap-2">
              {application.documents.map((doc: any) => (
                <Badge key={doc.id} variant="outline" className="text-xs">
                  {doc.documentType}: {doc.status}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="mb-4" />

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/applications/${application.applicationId}`)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          
          {application.status === ApplicationStatus.DRAFT && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/applications/${application.applicationId}/edit`)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          
          {canSubmit && (
            <Button 
              size="sm"
              onClick={() => onSubmit(application.applicationId)}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 