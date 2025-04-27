import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get API URL from environment or fall back to current origin
const getApiBaseUrl = (): string => {
  // In production, API might be on a different domain
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL as string;
  }
  
  // In development, use the same origin
  return window.location.origin;
};

// Utility to build full API URLs
export const getApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  // Make sure path starts with slash if it doesn't already
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Convert relative API paths to absolute URLs
  const fullUrl = url.startsWith('http') ? url : getApiUrl(url);
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Use getApiUrl to ensure proper URL formatting
    const url = typeof queryKey[0] === 'string' 
      ? (queryKey[0].startsWith('http') ? queryKey[0] : getApiUrl(queryKey[0]))
      : queryKey[0];
      
    const res = await fetch(url as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
