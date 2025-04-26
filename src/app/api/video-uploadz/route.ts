import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs"; // <----- ADD THIS LINE ✅

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes); // Now OK because we told Next.js it's Node.js

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "video-uploads",
            transformation: [{ quality: "auto", fetch_format: "mp4" }],
          },
          (error: any, result: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    const publicId = result.public_id;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: publicId,
        originalSize: originalSize,
        compressedSize: String(result.bytes),
      },
    });

    const videos = await prisma.video.findMany({
      where: { publicId: publicId },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Upload video failed", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
