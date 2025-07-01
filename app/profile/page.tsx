"use client";

import { getProfile, saveUserProfile } from "@/app/actions/saveProfile";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@prisma/client";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import LoadingProfile from "./components/loading-profile";
import ProfileDisplay from "./components/profile-display";
import ProfileForm from "./components/profile-form";
import Logout from "./components/logout";
import { UserProfile } from "@/lib/types";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("👤 Loading profile page");
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);

      try {
        const existingProfile = await getProfile();

        if (existingProfile) {
          setProfile(existingProfile);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }

        if (process.env.NODE_ENV === "development") {
          console.log("👤 Profile loaded:", existingProfile ? "found" : "not found");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);

        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });

        setIsEditing(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (profile) {
      try {
        if (process.env.NODE_ENV === "development") {
          console.log("💾 Saving profile:", profile);
        }

        // Convert User to UserProfile type
        const profileData: UserProfile = {
          full_name: profile.full_name || undefined,
          phone: profile.phone || undefined,
          home_address: profile.home_address || undefined,
          email: profile.email || undefined,
        };

        await saveUserProfile(profileData);

        toast({
          title: "Success!",
          description: "Your profile has been saved.",
        });

        const updatedProfile = await getProfile();

        if (updatedProfile) setProfile(updatedProfile);

        setIsEditing(false);

        if (process.env.NODE_ENV === "development") {
          console.log("✅ Profile saved successfully");
        }
      } catch (error) {
        console.error("Failed to save profile:", error);

        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.error("Attempted to save a null or incomplete profile.");

      toast({
        title: "Error",
        description: "Profile data is incomplete. Please fill out the form.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingProfile />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 min-h-screen pb-20">
      <Card className="flex-col gap-4 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {isEditing ? "Edit Profile" : "Your Profile"} <Logout />
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your delivery information below."
              : "Manage your delivery profile and preferences."}
          </CardDescription>
        </CardHeader>
        {isEditing ? (
          <ProfileForm
            profile={profile}
            setProfile={setProfile}
            handleSubmit={handleSubmit}
            setIsEditing={setIsEditing}
          />
        ) : profile ? (
          <ProfileDisplay profile={profile} setIsEditing={setIsEditing} />
        ) : (
          <div className="p-4 text-center">
            Could not load profile. Try refreshing.
          </div>
        )}
      </Card>
    </div>
  );
}
