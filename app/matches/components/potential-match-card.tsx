"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "@/lib/framer-motion-facade";
import type { MatchedUser } from "@/lib/types";
import { MessageCircleHeart, ThumbsDown, ThumbsUp } from "lucide-react";

interface PotentialMatchCardProps {
  potentialMatch: MatchedUser;
  onAction: (targetUserId: string, action: "interested" | "pass") => void;
  loading: boolean;
}

export default function PotentialMatchCard({
  potentialMatch,
  onAction,
  loading,
}: PotentialMatchCardProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-96"
      >
        <p>Finding potential teammates...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[500px]"
    >
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>
            {potentialMatch?.user_id
              ? `Potential Teammate ID: ${potentialMatch.user_id.slice(5, 9)}`
              : "Potential Teammate"}
          </CardTitle>
          <CardDescription>
            React the thumb up or down to show interest or pass
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5" />
              <h3 className="text-base font-bold">Project Experience</h3>
            </div>
            <p>{potentialMatch?.project_experience || "Not specified"}</p>
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5" />
              <h3 className="text-base font-bold">What I want to build</h3>
            </div>
            <p>{potentialMatch?.future_plans || "Not specified"}</p>
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5" />
              <h3 className="text-base font-bold">Self-Description</h3>
            </div>
            <p>{potentialMatch?.self_description || "Not specified"}</p>
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5" />
              <h3 className="text-base font-bold">Fun Fact</h3>
            </div>
            <p>{potentialMatch?.fun_fact || "Not specified"}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <motion.div
            whileTap={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {" "}
            {/* Add animation on button press */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12"
              onClick={() => onAction(potentialMatch.user_id, "pass")}
            >
              <ThumbsDown className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            whileTap={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {" "}
            {/* Add animation on button press */}
            <Button
              variant="default"
              size="icon"
              className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600"
              onClick={() => onAction(potentialMatch.user_id, "interested")}
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
