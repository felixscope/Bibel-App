"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-[var(--text-primary)] mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[var(--text-secondary)] text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Card */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-md)] p-8">
        {children}
      </div>
    </motion.div>
  );
}
