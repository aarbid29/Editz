import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

const Header: React.FC = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push("/"); // optional: redirect to home after sign out
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold hover:text-indigo-600">
          <h3 className="text-3xl font-semibold text-purple-400 mb-4">Editz</h3>
        </Link>
      </div>

      <nav className="hidden md:block">
        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="text-gray-750 hover:text-purple-400">
              Tools
            </Link>
          </li>
          <li>
            <Link href="/" className="text-gray-750 hover:text-purple-400">
              Gallery
            </Link>
          </li>
          <li>
            <Link href="/" className="text-gray-750 hover:text-purple-400">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/" className="text-gray-750 hover:text-purple-600">
              About
            </Link>
          </li>
        </ul>
      </nav>

      <div className="hidden md:flex items-center space-x-4">
        {!user ? (
          <Link
            href="/sign-up"
            className="bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
        ) : (
          <>
            <div className="avatar">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={user.imageUrl}
                  alt={
                    user.username ||
                    user.emailAddresses[0]?.emailAddress ||
                    "User"
                  }
                />
              </div>
            </div>
            <span className="text-sm truncate max-w-xs lg:max-w-md">
              {user.username || user.emailAddresses[0]?.emailAddress}
            </span>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost btn-circle"
            >
              <LogOutIcon className="h-6 w-6 text-purple-400 hover:text-purple-500" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
