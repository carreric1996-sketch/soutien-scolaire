/**
 * Get the base URL for the application.
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL environment variable
 * 2. NEXT_PUBLIC_VERCEL_URL (for Vercel deployments)
 * 3. window.location.origin (if in the browser)
 * 4. http://localhost:3000 (default fallback)
 */
export const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null) ??
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  // Ensure path ends with /
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};
