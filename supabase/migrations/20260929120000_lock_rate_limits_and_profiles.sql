-- ==============================================================================
-- Migration: 20260929120000_lock_rate_limits_and_profiles.sql
-- Description:
--   1. Restrict rate_limits to service_role only (drop public permissive policy)
--   2. Drop public display policy on profiles to prevent email and role exposure
--   3. Create public_profiles view (id, full_name, avatar_url only)
--   4. Add SECURITY DEFINER function get_approved_comments for safe public comment fetching
-- ==============================================================================

-- 1. LOCK RATE LIMITS TO SERVICE ROLE ONLY
DROP POLICY IF EXISTS "Allow server clients to manage rate limits" ON public.rate_limits;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 2. DROP PUBLIC EXPOSURE POLICY ON PROFILES
DROP POLICY IF EXISTS "Anyone can view profiles for display" ON public.profiles;

-- Ensure standard RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure authenticated users can always read their own profile row
-- (critical for HeaderAuthWidget / getCurrentViewer to work after login)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can read their own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can read their own profile"
      ON public.profiles FOR SELECT
      USING (auth.uid() = id)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Admins can view all profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can view all profiles"
      ON public.profiles FOR SELECT
      USING (public.is_admin())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can update their own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can insert their own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert their own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Admins can update profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update profiles"
      ON public.profiles FOR UPDATE
      USING (public.is_admin())';
  END IF;
END $$;

-- 3. CREATE PUBLIC_PROFILES VIEW (id, full_name, avatar_url only)
CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT id, full_name, avatar_url
  FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 4. SECURITY DEFINER FUNCTION FOR FETCHING APPROVED COMMENTS SAFELY
CREATE OR REPLACE FUNCTION public.get_approved_comments(p_post_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', c.id,
        'post_id', c.post_id,
        'user_id', c.user_id,
        'content', c.content,
        'status', c.status,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'user', jsonb_build_object(
          'id', p.id,
          'full_name', p.full_name,
          'avatar_url', p.avatar_url
        )
      ) ORDER BY c.created_at ASC
    ),
    '[]'::jsonb
  ) INTO result
  FROM public.comments c
  LEFT JOIN public.profiles p ON c.user_id = p.id
  WHERE c.post_id = p_post_id AND c.status = 'approved';

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_approved_comments(UUID) TO anon, authenticated;
