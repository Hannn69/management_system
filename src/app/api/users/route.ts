import { NextRequest } from "next/server";
import { proxyToApi } from "@/lib/api-proxy";

export const GET = (request: NextRequest) => proxyToApi(request, "/users");
export const POST = (request: NextRequest) => proxyToApi(request, "/users");
