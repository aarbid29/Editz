"use client";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import VideoCard from "@/components/Video-Card";
import { Video } from "@/types";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size too large");
      return;
    }
    setLoading(true);

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      // const response = await axios.post("/api/video-upload", formData);
      // router.push("/");
      const response = await fetch("/api/video-uploadz", {
        method: "POST",
        body: formData,
      });

      console.log("Upload Response:", response);
      if (!response.ok) throw new Error("Failed to upload one video");

      const videosData = await response.json();

      if (Array.isArray(videosData)) {
        setVideos(videosData);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="container mx-auto p-4  justify-center items-center">
      <h1 className="text-2xl font-bold mb-4 text-purple-400 text-center">
        Upload Video
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="text-purple-400 text-l">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="text-purple-400 text-l">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="text-purple-400 text-l">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      {loading && (
        <div className="mt-4">
          <progress className="progress progress-primary w-full"></progress>
        </div>
      )}
      <div
        className="container"
        style={{
          maxWidth: "350px",
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          className="heading"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#9f7aea",
            textAlign: "center",
          }}
        >
          Compresssed Video
        </h1>
        {videos.length === 0 ? (
          <div
            className="empty-message"
            style={{
              textAlign: "center",
              fontSize: "1.125rem",
              color: "#6b7280",
            }}
          >
            No videos available
          </div>
        ) : (
          <div
            className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
              width: "100%",
            }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <VideoCard video={video} onDownload={handleDownload} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUpload;
