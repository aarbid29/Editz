import React from "react";
import GalleryItem from "./GalleryItem";

const GallerySection: React.FC = () => {
  const galleryItems = [
    {
      imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      title: "Object Removed",
      type: "Object Removal",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      title: "Background Removed",
      type: "Background Removal",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      title: "Color Changed",
      type: "Object Recoloring",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      title: "Resized ",
      type: "Aspect Ratio Change",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1548736614-128923fa2a11?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fHw%3D",

      title: "Video Compression ",
      type: "Compress For Transfer",
    },
  ];

  return (
    <section id="gallery" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Edits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what others have created with our tools. Get inspired and start
            editing your own media.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <GalleryItem {...item} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          {/* <button>View More</button> */}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
