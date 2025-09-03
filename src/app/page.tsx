"use client";

import Navbar from "@/components/Navbar";
import ProjectSection from "@/components/ProjectSection";
import CallToAction from "@/components/CallToAction";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />

      {/* {Hero Section (Section 1)} */}
      <Hero />

      {/* {Project Section (Section 2)} */}
      <ProjectSection />

      {/* {Less Doubt Section (Section 3)} */}
      <CallToAction />

      {/* {About Section (Section 4)} */}
      <About />

      {/* {Contact Section (Section 5)} */}
      <Contact />
    </main>
  );
}
