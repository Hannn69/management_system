import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Return summary data
    const summaryData = {
      inventoryTracked: 1250,
      openLicenses: 42,
      accessoriesReady: 89,
      supplyAlerts: 5,
    };

    return NextResponse.json(summaryData);
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
