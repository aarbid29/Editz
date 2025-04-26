import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (err: any) {
    console.error("Error fetching videos:", err);
    return NextResponse.json({ error: "Error occurred" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
