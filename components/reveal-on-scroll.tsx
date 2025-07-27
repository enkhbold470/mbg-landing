"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface RevealOnScrollProps {
  children: React.ReactNode
  threshold?: number
  delay?: number
}

export function RevealOnScroll({
  children,
  threshold = 0.1,
  delay = 0.2,
}: RevealOnScrollProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: threshold,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay }}
    >
      {children}
    </motion.div>
  )
}