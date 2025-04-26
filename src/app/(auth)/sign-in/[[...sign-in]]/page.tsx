"use client";
import { SignIn } from "@clerk/nextjs";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <SignIn />
      </div>
      <Footer />
    </>
  );
}
