"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/supabase/types";
import { useToast } from "./ToastProvider";
import { migrateLocalDataToSupabase } from "@/lib/migrations/migrateToSupabase";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { showToast } = useToast();

  // Load user profile
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);

      // Trigger data migration on first login
      const migrationKey = `migration_completed_${userId}`;
      const migrationCompleted = localStorage.getItem(migrationKey);

      if (!migrationCompleted) {
        try {
          await migrateLocalDataToSupabase(userId);
          localStorage.setItem(migrationKey, "true");
        } catch (migrationError) {
          console.error("Migration error:", migrationError);
          // Don't block user, migration will retry on next login
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        // Email confirmation required
        showToast("Bitte bestätige deine E-Mail-Adresse", "check");
      }
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getGermanErrorMessage(authError));
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      showToast("Erfolgreich angemeldet", "check");
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getGermanErrorMessage(authError));
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getGermanErrorMessage(authError));
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast("Erfolgreich abgemeldet", "check");
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getGermanErrorMessage(authError));
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;
      showToast("Passwort-Reset-Link wurde gesendet", "check");
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getGermanErrorMessage(authError));
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("Nicht angemeldet");

    try {
      // @ts-expect-error - Supabase client type inference issue with Database generic
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) throw error;

      // Reload profile
      await loadProfile(user.id);
      showToast("Profil aktualisiert", "check");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Profil konnte nicht aktualisiert werden");
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.email) throw new Error("Nicht angemeldet");

    try {
      // Re-authenticate with current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Das aktuelle Passwort ist falsch");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      showToast("Passwort erfolgreich geändert", "check");
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getGermanErrorMessage(authError));
    }
  };

  // Delete account
  const deleteAccount = async (password: string) => {
    if (!user?.email) throw new Error("Nicht angemeldet");

    try {
      // Re-authenticate with password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });

      if (signInError) {
        throw new Error("Das Passwort ist falsch");
      }

      // Call API route to delete user data
      const response = await fetch("/api/account/delete", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Account konnte nicht gelöscht werden");
      }

      // Sign out (this will also trigger navigation via middleware)
      await supabase.auth.signOut();
      showToast("Dein Konto wurde gelöscht", "check");
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Helper to translate Supabase errors to German
function getGermanErrorMessage(error: AuthError): string {
  const errorMessages: Record<string, string> = {
    "Invalid login credentials": "Ungültige Anmeldedaten",
    "Email not confirmed": "E-Mail-Adresse wurde noch nicht bestätigt",
    "User already registered": "E-Mail-Adresse ist bereits registriert",
    "Password should be at least 6 characters": "Passwort muss mindestens 6 Zeichen lang sein",
    "Unable to validate email address: invalid format": "Ungültiges E-Mail-Format",
    "Signup requires a valid password": "Bitte gib ein gültiges Passwort ein",
    "Email rate limit exceeded": "Zu viele Anfragen. Bitte versuche es später erneut",
    "Invalid email or password": "Ungültige E-Mail oder Passwort",
    "New password should be different from the old password": "Das neue Passwort muss sich vom alten unterscheiden",
    "Das aktuelle Passwort ist falsch": "Das aktuelle Passwort ist falsch",
    "Das Passwort ist falsch": "Das Passwort ist falsch",
  };

  return errorMessages[error.message] || error.message || "Ein Fehler ist aufgetreten";
}
