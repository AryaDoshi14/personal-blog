-- Phase 3+/6: allow public read of profile display fields for comment authors.
-- Multiple SELECT policies are OR'd; this opens profiles to anonymous readers.
-- Prefer selecting only full_name / avatar_url in app queries.

DROP POLICY IF EXISTS "Anyone can view profiles for display" ON public.profiles;
CREATE POLICY "Anyone can view profiles for display"
  ON public.profiles FOR SELECT
  USING (TRUE);
