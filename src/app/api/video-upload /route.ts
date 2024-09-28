import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // to interact with models created // connecting db
l;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
  bytes: number;
  duration?: number; // i.e optional
}

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ err: "unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;

    if (!file) {
      return NextResponse.json({ err: "no file" }, { status: 400 });
    }
    //file's property arraybuffer to have  bytes to create buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    ////
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "video-uploads",
            transformation: [
              {
                quality: "auto ",
                fetch_format: "mp4",
              },
            ],
          }, //create folder
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(buffer);
      }
    );
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        originalSize: originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      },
    });
    return NextResponse.json(video);
  } catch (err: any) {
    return NextResponse.json({ err: "video upload failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
