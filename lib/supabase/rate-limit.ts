import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Serverless-durable rate-limiter using the rate_limits table via createAdminClient() (service role).
 * Safe for server actions without leaking public table access.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number
): Promise<boolean> {
  const adminClient = createAdminClient();
  if (!adminClient) {
    // If service role is not configured (e.g. mock/local dev), allow gracefully
    return true;
  }

  try {
    const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();
    const { count, error } = await adminClient
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('key', key)
      .gte('created_at', windowStart);

    if (error) {
      console.error('Rate limit check error:', error.message);
      return true;
    }

    if ((count ?? 0) >= maxAttempts) {
      return false;
    }

    const { error: insertError } = await adminClient.from('rate_limits').insert({ key });
    if (insertError) {
      console.error('Rate limit insert error:', insertError.message);
    }
    return true;
  } catch (err) {
    console.error('Unexpected error in checkRateLimit:', err);
    return true;
  }
}
