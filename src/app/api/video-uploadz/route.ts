export const runtime = "nodejs"; // important for Prisma + Node APIs

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

// Prisma singleton to avoid multiple instances in dev (serverless)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const originalSize = formData.get("originalSize") as string | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Invalid or missing file" },
        { status: 400 }
      );
    }
    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    // Convert Blob to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    const result: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "video-uploads",
            transformation: [{ quality: "auto", fetch_format: "mp4" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Save video metadata to database
    const video = await prisma.video.create({
      data: {
        title,
        description: description ?? "",
        publicId: result.public_id,
        originalSize: originalSize ?? "",
        compressedSize: result.bytes ? String(result.bytes) : "",
        // duration: result.duration ?? 0, // optionally save duration if available
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Upload video failed:", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  } finally {
    // Do NOT disconnect Prisma here in serverless env
    // await prisma.$disconnect();
  }
}
