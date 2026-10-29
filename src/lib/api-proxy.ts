import { NextRequest, NextResponse } from "next/server";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

/** Forwards a request to the API with the caller's session cookies and relays the JSON answer. */
export async function proxyToApi(request: NextRequest, path: string) {
  const hasBody = request.method !== "GET" && request.method !== "DELETE";

  const response = await fetch(`${apiBase}${path}${request.nextUrl.search}`, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      cookie: request.headers.get("cookie") || "",
    },
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  }).catch(() => null);

  if (!response) {
    return NextResponse.json({ message: "The API is unreachable." }, { status: 502 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
