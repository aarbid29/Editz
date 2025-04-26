"use client";
import React from "react";
import Hero from "@/components/hero";
import Last from "@/components/Last";

import ToolsSection from "@/components/ToolsSection";
import Gallery from "@/components/Gallery";

export default function page() {
  return (
    <div>
      <Hero />
      <ToolsSection />
      <Gallery />
      <Last />
    </div>
  );
}
