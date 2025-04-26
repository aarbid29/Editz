import React from "react";
import ToolCard from "./ToolCard";
import { Scissors, Image, Crop, Upload, Play } from "lucide-react";

const ToolsSection: React.FC = () => {
  const tools = [
    {
      title: "Object Removal",
      description:
        "Remove unwanted objects from your images with precision and ease.",
      icon: <Scissors className="w-8 h-8" />,
      accentColor: "bg-purple-400",
    },
    {
      title: "Object Recoloring",
      description: "Change the color of specific objects in your images.",
      icon: <Image className="w-8 h-8" />,
      accentColor: "bg-indigo-600",
    },
    {
      title: "Background Removal",
      description: "Extract subjects from backgrounds with a single click.",
      icon: <Scissors className="w-8 h-8" />,
      accentColor: "bg-purple-400",
    },
    {
      title: "Aspect Ratio Change",
      description:
        "Resize your images to fit different platforms and requirements.",
      icon: <Crop className="w-8 h-8" />,
      accentColor: "bg-indigo-600",
    },
    {
      title: "Video Compression",
      description: "Reduce video file size without losing quality.",
      icon: <Play className="w-8 h-8" />,
      accentColor: "bg-purple-400",
    },
  ];

  return (
    <section id="tools" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Editing Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your media with our powerful AI-driven editing tools.
            Fast, efficient, and easy to use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ToolCard {...tool} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
