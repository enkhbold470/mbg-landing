import { motion } from "framer-motion";

export default function LoadingProfile() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center"
    >
      <p>Loading profile...</p>
    </motion.div>
  );
} 