-- ==============================================================================
-- Migration: Phase 2 - Public User Auth
-- Description:
--   1. Allow authenticated users to update their own profile (display name)
--   2. Add avatar_url to profiles for future use
-- ==============================================================================

-- Allow users to update their own profile (name/avatar only)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Self-update policy (viewers can update their own name & avatar)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Self-insert policy (triggered on signup, but also needed for edge cases)
-- The handle_new_user trigger runs SECURITY DEFINER so INSERT is fine,
-- but we need a policy to not block the trigger.
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
