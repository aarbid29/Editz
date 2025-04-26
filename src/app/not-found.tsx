"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
        <p className="text-lg text-gray-500">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
      <Footer />
    </>
  );
}
