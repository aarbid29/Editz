// components/Footer.tsx

import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100 mt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            {/* <h3 className="text-xl font-semibold text-purple mb-4">Editz</h3> */}
            <h3 className="text-xl font-semibold text-purple-400 mb-4">
              Editz
            </h3>

            <p className="text-gray-600">AI Tools to Transform Your Media</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#tools"
                  className="text-gray-600 hover:text-editz-purple transition-colors"
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link
                  href="#gallery"
                  className="text-gray-600 hover:text-editz-purple transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-editz-purple transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">@editz.ai</li>
              <li className="text-gray-600">+1 (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Editz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
