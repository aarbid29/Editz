import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

// Cloudinary config
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
  console.log("Received POST request to /api/recolor-object");
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const prompt = formData.get("prompt");
    const color = formData.get("color");

    if (!file || typeof prompt !== "string" || typeof color !== "string") {
      return NextResponse.json(
        { error: "Missing file, prompt or color" },
        { status: 400 }
      );
    }

    // Sanitize prompt and color: allow alphanumeric, dash, underscore, comma, semicolon
    const sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9-_,; ]/g, "-").trim();
    const sanitizedColor = color.replace(/[^a-zA-Z0-9#]/g, "").trim();

    const colorForCloudinary = sanitizedColor.startsWith("#")
      ? sanitizedColor.slice(1)
      : sanitizedColor;

    const effectValue = `gen_recolor:prompt_(${sanitizedPrompt});to-color_${colorForCloudinary}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            transformation: [
              {
                effect: effectValue,
              },
            ],
          },
          (error: any, result: any) => {
            if (error) {
              console.error("Cloudinary transformation error:", error);
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );

        uploadStream.end(buffer);
      }
    );

    console.log(result);

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.error("Image processing failed:", error);
    return NextResponse.json(
      { error: "Image processing failed" },
      { status: 500 }
    );
  }
}
