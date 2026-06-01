import { NextRequest, NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/auth-session";
import {
  deleteStoredUser,
  getStoredUserById,
  toPublicUserRecord,
  updateStoredUser,
} from "@/lib/user-store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionUser = await requireSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const record = await getStoredUserById(id);

  if (!record) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ record: toPublicUserRecord(record) });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionUser = await requireSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const record = await updateStoredUser(id, {
      email: body.email,
      username: body.username,
      password: body.password,
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

    if (!record) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ record: toPublicUserRecord(record) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionUser = await requireSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteStoredUser(id);

  if (!deleted) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
