import React from "react";
import { useRouter } from "next/navigation";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  accentColor,
}) => {
  const router = useRouter();

  const handleClick = () => {
    const route = `/${title.toLowerCase().replace(/\s+/g, "-")}`;
    router.push(route);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1 hover:scale-[1.02]">
      <div className={`h-2 ${accentColor}`}></div>
      <div className="p-6">
        <div className="mb-4 text-purple-400">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{description}</p>
        <button
          type="button"
          onClick={handleClick}
          className="w-full border border-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors"
        >
          Try Now
        </button>
      </div>
    </div>
  );
};

export default ToolCard;
