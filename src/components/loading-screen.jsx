"use client";

import { TextShimmer } from "@/components/animation/text-shimmer";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export function LoadingScreen({ loadingText }) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <TextShimmer className="font-mono text-lg md:text-xl" duration={0.8}>
        {loadingText}
      </TextShimmer>

      <Icon
        key={Date.now()}
        icon="svg-spinners:3-dots-move"
        className="mt-4 size-10 text-primary"
      />
    </motion.div>
  );
}
