import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import type React from "react";
import { MapPin, Phone, Mail, User as UserIcon, Edit } from "lucide-react";

interface ProfileDisplayProps {
  profile: User;
  setIsEditing: (isEditing: boolean) => void;
}

export default function ProfileDisplay({
  profile,
  setIsEditing,
}: ProfileDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <UserIcon className="h-4 w-4" />
            Full Name
          </div>
          <p className="text-lg font-medium">
            {profile.full_name || "Not provided"}
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Mail className="h-4 w-4" />
            Email Address
          </div>
          <p className="text-gray-800">
            {profile.email || "Not provided"}
          </p>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Phone className="h-4 w-4" />
            Phone Number
          </div>
          <p className="text-gray-800">
            {profile.phone || "Not provided"}
          </p>
        </div>

        {/* Home Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <MapPin className="h-4 w-4" />
            Home Address
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-line">
              {profile.home_address || "No address provided"}
            </p>
            {!profile.home_address && (
              <p className="text-sm text-blue-600 mt-2">
                💡 Add your home address to auto-fill delivery forms
              </p>
            )}
          </div>
        </div>

        {/* Profile Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">Profile Status</div>
          <div className="flex gap-2">
            {profile.full_name && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                ✓ Name Added
              </Badge>
            )}
            {profile.email && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                ✓ Email Added
              </Badge>
            )}
            {profile.phone && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                ✓ Phone Added
              </Badge>
            )}
            {profile.home_address && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
                ✓ Address Added
              </Badge>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-2 pt-4 border-t">
          <div className="text-sm font-medium text-gray-600">Account Information</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Member Since:</span>
              <div>{new Date(profile.created_at).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <div>{new Date(profile.updated_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={() => setIsEditing(true)} className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </CardFooter>
    </motion.div>
  );
}
