// =====================================================
// Supabase Database TypeScript Definitions
// Auto-generated types based on database schema
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          theme: 'light' | 'dark' | 'system'
          font_size: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
          font_family: 'system' | 'serif' | 'modern' | 'classic'
          preferred_translation: 'eu' | 'neu' | 'elb'
          chapters_read: number
          total_reading_time_minutes: number
          current_streak_days: number
          longest_streak_days: number
          last_read_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          theme?: 'light' | 'dark' | 'system'
          font_size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
          font_family?: 'system' | 'serif' | 'modern' | 'classic'
          preferred_translation?: 'eu' | 'neu' | 'elb'
          chapters_read?: number
          total_reading_time_minutes?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_read_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          theme?: 'light' | 'dark' | 'system'
          font_size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
          font_family?: 'system' | 'serif' | 'modern' | 'classic'
          preferred_translation?: 'eu' | 'neu' | 'elb'
          chapters_read?: number
          total_reading_time_minutes?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_read_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      highlights: {
        Row: {
          id: string
          user_id: string
          book_id: string
          chapter: number
          verse: number
          color: 'yellow' | 'green' | 'blue' | 'pink' | 'orange'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          chapter: number
          verse: number
          color: 'yellow' | 'green' | 'blue' | 'pink' | 'orange'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          chapter?: number
          verse?: number
          color?: 'yellow' | 'green' | 'blue' | 'pink' | 'orange'
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          book_id: string
          chapter: number
          verse_start: number
          verse_end: number
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          chapter: number
          verse_start: number
          verse_end: number
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          chapter?: number
          verse_start?: number
          verse_end?: number
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          book_id: string
          chapter: number
          verse_start: number
          verse_end: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          chapter: number
          verse_start: number
          verse_end: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          chapter?: number
          verse_start?: number
          verse_end?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// =====================================================
// Convenience Types
// =====================================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Highlight = Database['public']['Tables']['highlights']['Row']
export type HighlightInsert = Database['public']['Tables']['highlights']['Insert']
export type HighlightUpdate = Database['public']['Tables']['highlights']['Update']

export type Note = Database['public']['Tables']['notes']['Row']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']

export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
export type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert']
export type BookmarkUpdate = Database['public']['Tables']['bookmarks']['Update']

// Color types
export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange'
export type Theme = 'light' | 'dark' | 'system'
export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type FontFamily = 'system' | 'serif' | 'modern' | 'classic'
export type Translation = 'eu' | 'neu' | 'elb'
