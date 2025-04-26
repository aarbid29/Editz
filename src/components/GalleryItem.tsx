import React from "react";
import { Download, Redo } from "lucide-react";
import Image from "next/image";

interface GalleryItemProps {
  imageUrl: string;
  title: string;
  type: string;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ imageUrl, title, type }) => {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-md group">
      <div className="relative overflow-hidden h-48 sm:h-64">
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-50">
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 bg-white text-black rounded hover:bg-gray-100 transition"
              aria-label="Redo"
            >
              <Redo size={16} />
            </button>
            <button
              type="button"
              className="p-2 bg-white text-black rounded hover:bg-gray-100 transition"
              aria-label="Download"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{type}</p>
      </div>
    </div>
  );
};

export default GalleryItem;
