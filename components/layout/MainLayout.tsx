"use client";

import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Main Content Area */}
      <main className="md:ml-64 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
