type ApiOk<T> = { data: T; error?: never }
type ApiErr = { data?: never; error: string }
type ApiResult<T> = ApiOk<T> | ApiErr

async function request<T>(path: string, options?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
      credentials: "include",
    })
    const json = await res.json()
    if (!res.ok) return { error: (json as { error?: string }).error ?? "Request failed" }
    return { data: json as T }
  } catch {
    return { error: "Network error. Please try again." }
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
