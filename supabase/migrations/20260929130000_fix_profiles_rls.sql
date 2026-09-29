-- ==============================================================================
-- Migration: 20260929130000_fix_profiles_rls.sql
-- Description:
--   Restore essential RLS policies on profiles that allow authenticated users
--   to read and manage their own profile. These were accidentally left out of
--   the previous migration that dropped the public "Anyone can view profiles"
--   policy. Without these policies, getCurrentViewer() returned null for logged-in
--   users, causing the header to show Login/Sign Up even when authenticated.
-- ==============================================================================

-- Allow each logged-in user to see their own profile (needed for HeaderAuthWidget)
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

-- Allow admins to see all profiles (for user management)
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

-- Allow users to update their own profile (display name, avatar)
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

-- Allow admins to update any profile (role management)
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

-- Allow the signup trigger (SECURITY DEFINER) to insert new user profiles
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
