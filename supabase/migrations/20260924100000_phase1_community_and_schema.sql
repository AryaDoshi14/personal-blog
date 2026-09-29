-- ==============================================================================
-- Migration: Phase 1 - Community Schema & Author Enhancements
-- Description:
--   1. Adds author fields and likes counter to posts
--   2. Adds post_likes table with SECURITY DEFINER trigger to update count
--   3. Adds moderatable comments table with RLS
--   4. Adds storage_path & post_id FK to media table
--   5. Adds rate_limits table for serverless-durable abuse protection
-- ==============================================================================

-- 1. POSTS TABLE ENHANCEMENTS (Author & Likes Counter)
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS author_name_gu TEXT NOT NULL DEFAULT 'સંપાદક',
  ADD COLUMN IF NOT EXISTS author_name_en TEXT DEFAULT 'Editor',
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS likes_count INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_name_gu, author_name_en);
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON public.posts(likes_count DESC);

-- 2. MEDIA TABLE ENHANCEMENTS (Direct Storage Path & Post Association)
ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_media_post_id ON public.media(post_id);

-- 3. POST LIKES TABLE
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);

-- Trigger function for likes counter with SECURITY DEFINER
-- Crucial: SECURITY DEFINER allows non-admin users to update posts.likes_count despite posts UPDATE RLS
CREATE OR REPLACE FUNCTION public.handle_post_like_counter()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_post_like_counter ON public.post_likes;
CREATE TRIGGER trg_post_like_counter
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_like_counter();

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(trim(content)) >= 3 AND char_length(content) <= 1000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_status ON public.comments(post_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_status ON public.comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

DROP TRIGGER IF EXISTS trg_comments_updated_at ON public.comments;
CREATE TRIGGER trg_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. RATE LIMITS TABLE (Serverless-Durable Abuse Protection)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_key_time ON public.rate_limits(key, created_at DESC);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- POST LIKES POLICIES
CREATE POLICY "Anyone can view post likes"
  ON public.post_likes FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own like"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- COMMENTS POLICIES
CREATE POLICY "Public can view approved comments or authors their own"
  ON public.comments FOR SELECT
  USING (
    status = 'approved' 
    OR auth.uid() = user_id 
    OR public.is_admin()
  );

CREATE POLICY "Authenticated users can post comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_id AND status = 'published'
    )
  );

CREATE POLICY "Admins can update comment status"
  ON public.comments FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete any comments"
  ON public.comments FOR DELETE
  USING (public.is_admin());

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- RATE LIMITS POLICIES
-- Server action client executes inserts and rate checks
CREATE POLICY "Allow server clients to manage rate limits"
  ON public.rate_limits FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);
