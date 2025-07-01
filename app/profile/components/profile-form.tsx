import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import type React from "react";
import { MapPin, Phone, Mail, User as UserIcon } from "lucide-react";

interface ProfileFormProps {
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

export default function ProfileForm({
  profile,
  setProfile,
  handleSubmit,
  setIsEditing,
}: ProfileFormProps) {
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full-name" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="full-name"
            placeholder="Enter your full name"
            defaultValue={profile?.full_name || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(
                (prev) => ({ ...(prev || {}), full_name: value } as User)
              );
            }}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            defaultValue={profile?.email || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(
                (prev) => ({ ...(prev || {}), email: value } as User)
              );
            }}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            defaultValue={profile?.phone || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(
                (prev) => ({ ...(prev || {}), phone: value } as User)
              );
            }}
          />
        </div>

        {/* Home Address */}
        <div className="space-y-2">
          <Label htmlFor="home-address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Home Address
          </Label>
          <Textarea
            id="home-address"
            placeholder="Enter your complete home address for package delivery..."
            defaultValue={profile?.home_address || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(
                (prev) => ({ ...(prev || {}), home_address: value } as User)
              );
            }}
            className="min-h-[100px]"
            rows={4}
          />
          <p className="text-sm text-gray-500">
            This address will be used as default for all your package deliveries
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button type="submit">Save Profile</Button>
      </CardFooter>
    </motion.form>
  );
}
