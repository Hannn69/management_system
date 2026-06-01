import { NextRequest, NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/auth-session";
import {
  createStoredUser,
  listStoredUsers,
  toPublicUserRecord,
} from "@/lib/user-store";

export async function GET(request: NextRequest) {
  const sessionUser = await requireSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const sort = searchParams.get("sort") || "createdAt";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const result = await listStoredUsers({
    search,
    page,
    limit,
    sort,
    order,
  });

  return NextResponse.json({
    ...result,
    records: result.records.map(toPublicUserRecord),
  });
}

export async function POST(request: NextRequest) {
  const sessionUser = await requireSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { message: "Email, username, and password are required." },
        { status: 400 }
      );
    }

    const record = await createStoredUser({
      email: String(body.email),
      username: String(body.username),
      password: String(body.password),
      firstName: body.firstName,
      lastName: body.lastName,
      displayName: body.displayName,
      phoneNumber: body.phoneNumber,
      loginEnabled: body.loginEnabled,
      companyId:
        body.companyId == null || body.companyId === ""
          ? null
          : Number(body.companyId),
      locationId:
        body.locationId == null || body.locationId === ""
          ? null
          : Number(body.locationId),
    });

    return NextResponse.json({ record: toPublicUserRecord(record) }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create user.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
