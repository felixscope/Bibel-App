"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect zur Lesen-Seite mit Matthäus 1 als Default
    // (Genesis/AT ist temporär deaktiviert)
    router.replace("/lesen/matthew/1");
  }, [router]);

  // Loading-Zustand während Redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center">
        <div className="animate-pulse text-[var(--text-muted)]">
          Wird geladen...
        </div>
      </div>
    </div>
  );
}
