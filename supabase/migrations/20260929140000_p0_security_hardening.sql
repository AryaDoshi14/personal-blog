-- ==============================================================================
-- Migration: 20260929140000_p0_security_hardening.sql
-- Description:
--   P0 security fixes:
--   1. Block role self-elevation: trigger prevents non-admins changing their role
--   2. Fix profiles INSERT policy: force role = 'viewer'
--   3. Fix comments INSERT policy: force status = 'pending'
--   4. Lock messages to service-role only (contact form uses server action)
--   5. Restrict post_likes SELECT to the owner only (prevent like-spying)
--   6. Add SET search_path = public to handle_new_user and is_admin
--   7. Add column-level length CHECKs on messages
--   8. Prune old rate_limits rows
-- ==============================================================================

-- ----------------------------------------------------------------------------
-- 1. BLOCK ROLE SELF-ELEVATION ON profiles
--    A BEFORE UPDATE trigger fires for every UPDATE on profiles.
--    If the calling user is NOT an admin and tries to change the role column,
--    it raises an exception and aborts the statement.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only enforce for non-admin callers
  IF NOT public.is_admin() THEN
    -- Reject any attempt to change the role column
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Permission denied: you cannot change your own role.';
    END IF;
    -- Also lock the id column (belt-and-suspenders)
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Permission denied: you cannot change your user id.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- ----------------------------------------------------------------------------
-- 2. FIX profiles INSERT POLICY: force role = 'viewer'
--    The old policy only checked auth.uid() = id but didn't restrict the role
--    column, letting a caller INSERT with role = 'admin'.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
    AND role = 'viewer'
  );

-- ----------------------------------------------------------------------------
-- 3. FIX comments INSERT POLICY: force status = 'pending'
--    The old policy checked user + published post but did NOT force status,
--    so a caller could INSERT with status = 'approved', bypassing moderation.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.comments;
CREATE POLICY "Authenticated users can post comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND status = 'published'
    )
  );

-- ----------------------------------------------------------------------------
-- 4. LOCK messages TO SERVICE-ROLE ONLY
--    The contact form is a server action that uses the service-role client.
--    Removing the anon INSERT policy prevents direct API spam.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can submit a message" ON public.messages;

-- ----------------------------------------------------------------------------
-- 5. RESTRICT post_likes SELECT TO OWNER AND ADMINS
--    The previous policy let any visitor enumerate who liked what.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view post likes" ON public.post_likes;
CREATE POLICY "Users can view their own likes"
  ON public.post_likes FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. ADD SET search_path = public TO handle_new_user AND is_admin
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      SPLIT_PART(NEW.email, '@', 1)
    ),
    'viewer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- ----------------------------------------------------------------------------
-- 7. ADD COLUMN-LEVEL LENGTH CHECKs ON messages
-- ----------------------------------------------------------------------------
ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_name_length,
  DROP CONSTRAINT IF EXISTS messages_email_length,
  DROP CONSTRAINT IF EXISTS messages_subject_length,
  DROP CONSTRAINT IF EXISTS messages_message_length;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_name_length    CHECK (char_length(trim(name))    BETWEEN 1 AND 120),
  ADD CONSTRAINT messages_email_length   CHECK (char_length(trim(email))   BETWEEN 3 AND 254),
  ADD CONSTRAINT messages_subject_length CHECK (subject IS NULL OR char_length(trim(subject)) <= 200),
  ADD CONSTRAINT messages_message_length CHECK (char_length(trim(message)) BETWEEN 5 AND 5000);

-- ----------------------------------------------------------------------------
-- 8. PRUNE rate_limits OLDER THAN 24 HOURS
-- ----------------------------------------------------------------------------
DELETE FROM public.rate_limits
WHERE created_at < NOW() - INTERVAL '24 hours';

-- If pg_cron is available (Supabase Pro/Team), uncomment:
-- SELECT cron.schedule(
--   'prune-rate-limits',
--   '0 3 * * *',
--   $$DELETE FROM public.rate_limits WHERE created_at < NOW() - INTERVAL '24 hours'$$
-- );
