// Only allow redirecting to an internal dashboard page.
// Blocks external URLs ("https://evil.com", "//evil.com") and auth pages (would loop).
export const getSafeRedirect = (redirect?: string | null, fallback = "/dashboard") => {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//") || redirect.startsWith("/\\")) {
    return fallback;
  }
  if (!/^\/dashboard(\/|\?|#|$)/.test(redirect)) return fallback;
  return redirect;
};
