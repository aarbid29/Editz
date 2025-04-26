import React from "react";
import { Upload } from "lucide-react";

const Last: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-br from-purple-700/10 to-indigo-500/10 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Media?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            <span>
              Upload your photos or videos and start editing with our powerful
              AI tools.{" "}
            </span>
            <br />
            <span>Log in to start mixing your audio.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-purple-400 transition-colors shadow-md flex items-center justify-center gap-2 text-base py-3 px-8 flex items-center justify-center gap-2"
              onClick={() =>
                document.getElementById("file-upload-section")?.click()
              }
            >
              <Upload size={20} />
              Upload Media
            </button>
            <input
              type="file"
              id="file-upload-section"
              className="hidden"
              accept="image/*, video/*"
            />
            <button className="btn-secondary text-base py-3 px-8">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Last;
