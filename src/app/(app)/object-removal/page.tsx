"use client";

import React, { useState, useRef } from "react";
import { CldImage } from "next-cloudinary";

export default function SizeEdit() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedPublicId, setProcessedPublicId] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [removePrompt, setRemovePrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(null);
    setUploadedImage(null);
    setProcessedPublicId(null);
    setDownloadUrl(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setFile(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemovePromptChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRemovePrompt(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (file && removePrompt) {
      setIsTransforming(true);
      await processImage();
    } else {
      alert("Please upload an image and enter the object to remove.");
    }
  };

  const processImage = async () => {
    if (!file || !removePrompt) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", removePrompt);

    try {
      const response = await fetch("/api/remove-object", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process image");
      const data = await response.json();
      setProcessedPublicId(data.publicId);
      setDownloadUrl(data.processedImageUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Failed to process image: " + error.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setIsUploading(false);
      setIsTransforming(false);
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
        link.download = "removed_object_image.png"; // Changed the default download name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">
        Remove Object from Image
      </h1>
      <p className="text-gray-600 mb-6">
        Upload an image, type the object to remove, and submit.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-8 mt-4"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2 w-96">
            <label
              htmlFor="removePrompt"
              className="block text-gray-700 text-sm font-bold mb-1 text-center"
            >
              Object to Remove:
            </label>
            <input
              type="text"
              id="removePrompt"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={removePrompt}
              onChange={handleRemovePromptChange}
              placeholder="e.g., person, car, text"
            />
          </div>

          <div
            className="w-96 h-auto bg-gray-100 border-2 border-dashed border-gray-400 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
            onClick={handleUploadButtonClick}
          >
            {!uploadedImage && (
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
            )}
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isUploading || isTransforming || !file || !removePrompt}
          >
            {isUploading || isTransforming
              ? "Processing..."
              : "Upload and Remove Object"}
          </button>

          {(isUploading || isTransforming) && (
            <p className="text-sm text-gray-500 mt-2">Processing image...</p>
          )}
        </div>
      </form>

      {(uploadedImage || processedPublicId) && (
        <div className="mt-8 flex gap-8 max-w-4xl w-full justify-center">
          {uploadedImage && (
            <div className="flex flex-col items-center border border-gray-300 rounded-md p-4 bg-gray-50 w-80">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Uploaded Image Preview
              </h2>
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-auto object-contain rounded-md"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}

          {processedPublicId && (
            <div className="relative flex flex-col items-center border border-gray-300 rounded-md p-4 bg-gray-50 w-80">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Processed Image
              </h2>
              <CldImage
                src={processedPublicId}
                width={320}
                height={240}
                alt={`Image with ${removePrompt} removed`}
                className="rounded-md object-contain"
                crop="fit"
                onLoad={(e) => {
                  setDownloadUrl((e.target as HTMLImageElement).src);
                }}
              />
              <button
                className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-md py-1 px-2 text-xs font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                onClick={handleDownload}
                disabled={!downloadUrl}
              >
                Download
              </button>
            </div>
          )}
        </div>
      )}

      {!uploadedImage && !file && (
        <div className="mt-8 text-center text-gray-500">
          Please upload an image and enter the object to remove.
        </div>
      )}
      {uploadedImage && file && !processedPublicId && (
        <div className="mt-8 text-center text-gray-500">
          Enter the object to remove and submit the form.
        </div>
      )}
    </div>
  );
}
