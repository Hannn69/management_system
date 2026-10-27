import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-proxy";

type Context = { params: Promise<{ id: string }> };

async function forward(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return proxyToApi(request, `/users/${encodeURIComponent(id)}`);
}

export const GET = forward;
export const PATCH = forward;
export const DELETE = forward;
