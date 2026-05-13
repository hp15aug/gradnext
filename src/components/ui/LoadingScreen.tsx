"use client";

import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background backdrop-blur-md"
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex items-center justify-center h-24 w-24 rounded-full bg-primary/10"
        >
          <LayoutDashboard className="h-10 w-10 text-primary" />
        </motion.div>
        
        <div className="flex flex-col items-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            Analytics Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            Synchronizing securely with Google Workspace...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
