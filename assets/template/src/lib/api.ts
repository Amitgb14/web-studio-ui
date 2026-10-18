/** One fetch helper for the whole app. GET without a body, POST JSON with one.
 *  Errors carry the HTTP status and the server's own message, so screens can
 *  say what went wrong (and tell "sign in" apart from "server down"). */
export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message) }
}

export async function api<T>(url: string, body?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, body === undefined ? { credentials: "same-origin" } : {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError("Can't reach the server. Is it running?", 0)
  }
  const text = await res.text()
  let data: unknown = null
  try { data = text ? JSON.parse(text) : null } catch { /* not JSON */ }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error ?? (text.slice(0, 200) || res.statusText)
    throw new ApiError(msg, res.status)
  }
  return data as T
}
