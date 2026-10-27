"use client";

// The access cookie lives 15 minutes. When a request to the API (or our /api routes) answers 401,
// refresh the session once and retry; if the refresh fails the session is over, so go to login.

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

let refreshing: Promise<boolean> | null = null;

function refreshSession() {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

function needsSession(url: string) {
  if (url.startsWith("/api/auth/")) return false;
  return url.startsWith("/api/") || url.startsWith(apiBase);
}

if (typeof window !== "undefined" && !(window as { __authFetch?: boolean }).__authFetch) {
  (window as { __authFetch?: boolean }).__authFetch = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const response = await originalFetch(input, init);

    if (response.status !== 401 || !needsSession(url)) {
      return response;
    }

    if (await refreshSession()) {
      return originalFetch(input, init);
    }

    window.location.assign("/");
    return response;
  };
}
