-- =====================================================
-- Bibel App - Initial Database Schema
-- Supabase Migration v1
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- 1. User Profiles Table
-- Extends auth.users with additional profile information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,

  -- User Preferences (synced across devices)
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  font_size TEXT NOT NULL DEFAULT 'md' CHECK (font_size IN ('sm', 'md', 'lg', 'xl', '2xl')),
  font_family TEXT NOT NULL DEFAULT 'serif' CHECK (font_family IN ('system', 'serif', 'modern', 'classic')),
  preferred_translation TEXT NOT NULL DEFAULT 'eu' CHECK (preferred_translation IN ('eu', 'neu', 'elb')),

  -- Reading Statistics
  chapters_read INTEGER NOT NULL DEFAULT 0,
  total_reading_time_minutes INTEGER NOT NULL DEFAULT 0,
  current_streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak_days INTEGER NOT NULL DEFAULT 0,
  last_read_date DATE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Highlights Table
-- Stores user's verse highlights with colors
CREATE TABLE public.highlights (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'orange')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Prevent duplicate highlights for same verse
  UNIQUE(user_id, book_id, chapter, verse)
);

-- 3. Notes Table
-- Stores user's Bible study notes
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Bookmarks Table
-- Stores user's bookmarked verses
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Prevent duplicate bookmarks
  UNIQUE(user_id, book_id, chapter, verse_start, verse_end)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Highlights indexes
CREATE INDEX idx_highlights_user_id ON public.highlights(user_id);
CREATE INDEX idx_highlights_user_book_chapter ON public.highlights(user_id, book_id, chapter);
CREATE INDEX idx_highlights_created_at ON public.highlights(created_at DESC);

-- Notes indexes
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_user_book_chapter ON public.notes(user_id, book_id, chapter);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX idx_notes_updated_at ON public.notes(updated_at DESC);

-- Bookmarks indexes
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_bookmarks_user_book_chapter ON public.bookmarks(user_id, book_id, chapter);
CREATE INDEX idx_bookmarks_created_at ON public.bookmarks(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Highlights Policies
-- Users can view their own highlights
CREATE POLICY "Users can view own highlights"
  ON public.highlights
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own highlights
CREATE POLICY "Users can insert own highlights"
  ON public.highlights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own highlights
CREATE POLICY "Users can update own highlights"
  ON public.highlights
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own highlights
CREATE POLICY "Users can delete own highlights"
  ON public.highlights
  FOR DELETE
  USING (auth.uid() = user_id);

-- Notes Policies
-- Users can view their own notes
CREATE POLICY "Users can view own notes"
  ON public.notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own notes
CREATE POLICY "Users can insert own notes"
  ON public.notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update own notes"
  ON public.notes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON public.notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Bookmarks Policies
-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
  ON public.bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to update updated_at on notes
CREATE TRIGGER on_notes_updated
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.profiles IS 'User profiles with preferences and reading statistics';
COMMENT ON TABLE public.highlights IS 'User verse highlights with color coding';
COMMENT ON TABLE public.notes IS 'User Bible study notes';
COMMENT ON TABLE public.bookmarks IS 'User bookmarked verses';

COMMENT ON COLUMN public.profiles.theme IS 'UI theme preference: light, dark, or system';
COMMENT ON COLUMN public.profiles.font_size IS 'Bible text font size preference';
COMMENT ON COLUMN public.profiles.font_family IS 'Bible text font family preference';
COMMENT ON COLUMN public.profiles.preferred_translation IS 'Default Bible translation';
COMMENT ON COLUMN public.profiles.chapters_read IS 'Total number of chapters read';
COMMENT ON COLUMN public.profiles.total_reading_time_minutes IS 'Total reading time in minutes';
COMMENT ON COLUMN public.profiles.current_streak_days IS 'Current consecutive days reading';
COMMENT ON COLUMN public.profiles.longest_streak_days IS 'Longest streak achieved';
COMMENT ON COLUMN public.profiles.last_read_date IS 'Last date user read the Bible';
