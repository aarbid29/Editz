import React from "react";
import { Upload } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-600 text-transparent bg-clip-text">
            <span>Transform Your Media</span>
            <br />
            <span>With AI</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Powerful AI-driven tools to edit your photos and videos in seconds.
            Remove objects, change backgrounds, compress videos, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="btn-upload text-base py-3 px-8 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-purple-300 text-white font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => document.getElementById("file-upload")?.click()}
              type="button"
            >
              <Upload size={20} />
              Upload Media
            </button>
            <button
              type="button"
              className="text-base py-3 px-8 rounded-full border border-gray-300 text-purple-400 font-semibold bg-white hover:bg-purple-300 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            >
              Explore Tools
            </button>
          </div>
        </div>

        <div className="mt-16 p-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl shadow-lg">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-center">
            {[
              "Object Removal",
              "Object Recoloring",
              "Background Removal",
              "Aspect Ratio Change",
              "Video Compression",
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 mb-3 rounded-full flex items-center justify-center shadow ${
                    index % 2 === 0
                      ? "bg-purple-400 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs sm:text-sm font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
