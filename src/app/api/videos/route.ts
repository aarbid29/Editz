import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // to interact with models created // connecting db

export async function GET(request: NextRequest) {
  try {
    ``;
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (err: any) {
    return NextResponse.json({ error: "error occured" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
