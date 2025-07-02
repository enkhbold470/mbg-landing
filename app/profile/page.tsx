"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  Globe, 
  FileText, 
  Award,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { getCurrentUser } from "../actions/getCurrentUser";
import { saveUserProfile, getUserApplicationsCount, getUserDocumentsCount } from "../actions/saveProfile";
import { toast } from "sonner";

interface UserProfile {
  userId: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  age: number | null;
  nationality: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    nationality: ""
  });
  const [applicationStats, setApplicationStats] = useState({
    totalApplications: 0,
    documentsUploaded: 0
  });

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const [user, applicationCount, documentCount] = await Promise.all([
        getCurrentUser(),
        getUserApplicationsCount(),
        getUserDocumentsCount()
      ]);
      
      if (user) {
        setProfile(user);
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          age: user.age?.toString() || "",
          nationality: user.nationality || ""
        });
        setApplicationStats({
          totalApplications: applicationCount,
          documentsUploaded: documentCount
        });
      }
      
      if (process.env.NODE_ENV === "development") {
        console.log("👤 Profile loaded:", user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const profileData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        nationality: formData.nationality
      };

      const result = await saveUserProfile(profileData);
      
      if (result.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        await fetchProfile(); // Refresh profile data
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        age: profile.age?.toString() || "",
        nationality: profile.nationality || ""
      });
    }
    setIsEditing(false);
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.age,
      profile.nationality
    ];
    
    const filledFields = fields.filter(field => field !== null && field !== undefined && field !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const getMissingFields = () => {
    if (!profile) return [];
    
    const missing = [];
    if (!profile.fullName) missing.push("Full Name");
    if (!profile.email) missing.push("Email");
    if (!profile.phone) missing.push("Phone");
    if (!profile.age) missing.push("Age");
    if (!profile.nationality) missing.push("Nationality");
    
    return missing;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-500 mb-4">
            Unable to load your profile information.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const completeness = getProfileCompleteness();
  const missingFields = getMissingFields();

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
        <p className="text-gray-600">
          Manage your personal information and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Profile Completeness
              </CardTitle>
              <CardDescription>
                Complete your profile to improve your scholarship application success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        completeness === 100 ? 'bg-green-500' : 
                        completeness >= 75 ? 'bg-blue-500' : 
                        completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${completeness}%` }}
                    ></div>
                  </div>
                </div>
                {completeness === 100 ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                )}
              </div>
              
              {missingFields.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Missing information: {missingFields.join(", ")}. 
                    Complete these fields to improve your application chances.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!isEditing}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  placeholder="+976-9999-9999"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    disabled={!isEditing}
                    placeholder="25"
                    min="16"
                    max="50"
                  />
                </div>

                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Mongolian"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Applications</span>
                </div>
                <Badge variant="secondary">{applicationStats.totalApplications}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Documents</span>
                </div>
                <Badge variant="secondary">{applicationStats.documentsUploaded}</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Member since</span>
                  <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last updated</span>
                  <span>{new Date(profile.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/applications")}
                className="w-full justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Applications
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/scholarships")}
                className="w-full justify-start"
              >
                <Award className="h-4 w-4 mr-2" />
                Browse Scholarships
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/universities")}
                className="w-full justify-start"
              >
                <Globe className="h-4 w-4 mr-2" />
                Explore Universities
              </Button>
            </CardContent>
          </Card>

          {/* Profile Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">💡 Profile Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Use your official name as it appears on documents</p>
                <p>• Keep your contact information up to date</p>
                <p>• A complete profile increases your chances</p>
                <p>• Verify your email for important notifications</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 