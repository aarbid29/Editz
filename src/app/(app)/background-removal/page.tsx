"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";

export default function SizeEdit() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log("Selected File:", selectedFile);
    setFile(selectedFile || null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      console.log("Upload Response:", response);
      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      console.log("Response Data:", data);
      setUploadedImage(data.publicId);
    } catch (error: any) {
      console.log("Error uploading image:", error);
      alert("Failed to upload image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    fetch(downloadUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "downloaded-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="flex flex-col items-center p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">
        Remove Object from Image
      </h1>
      <p className="text-gray-600 mb-6">
        Upload an image and the background will be removed upon submission.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-8 mt-10">
        <div className="flex flex-col gap-4 pl-4">
          <div className="w-96 h-70 bg-gray-100 border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200">
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.14-3.225 4.5 4.5 0 01-3.225-1.14M19.5 19.5a4.5 4.5 0 01-1.14-3.225 4.5 4.5 0 01-3.225-1.14M12 2.25c-5.23 0-9.75 4.525-9.75 9.75s4.525 9.75 9.75 9.75 9.75-4.525 9.75-9.75S17.23 2.25 12 2.25z"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Click to upload an image
              </span>
            </label>
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload and Remove Background"}
          </button>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {uploadedImage ? (
            <div className="flex gap-6">
              <div className="relative border border-gray-300 rounded-md p-2 bg-white shadow-sm">
                <h2 className="text-sm text-center text-purple-600 mb-2">
                  Original Image
                </h2>
                <CldImage
                  width="250"
                  height="250"
                  src={uploadedImage}
                  crop="fill"
                  alt="Original image"
                />
              </div>

              <div className="relative border border-gray-300 rounded-md p-2 bg-white shadow-sm">
                <h2 className="text-sm text-center text-purple-600 mb-2">
                  Transformed Image
                </h2>

                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10 rounded-md">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                )}

                <CldImage
                  width="250"
                  height="250"
                  src={uploadedImage}
                  crop="fill"
                  removeBackground
                  alt="Transformed image"
                  onLoad={(e) => {
                    setIsTransforming(false);
                    setDownloadUrl((e.target as HTMLImageElement).src);
                  }}
                />

                <button
                  className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-md py-1 px-2 text-xs font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                  onClick={handleDownload}
                >
                  Download
                </button>
              </div>
            </div>
          ) : (
            <span className="text-gray-500 ">Image Preview</span>
          )}
        </div>
      </form>
    </div>
  );
}
