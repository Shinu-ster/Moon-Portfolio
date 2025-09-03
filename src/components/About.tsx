"use client";

import React, { useEffect, useRef } from "react";
import Section from "./Section";
import { ABeeZee, Quicksand } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const aBeeZee = ABeeZee({
  subsets: ["latin"],
  weight: "400",
});

const quickSand = Quicksand({
  subsets: ["latin"],
  weight: "400",
});

const About = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return; // ensure ref exists
    const elements = containerRef.current.children;

    gsap.fromTo(
      elements,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2, // animate one after another
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true, // smooth scroll-linked animation
        },
      }
    );
  }, []);

  return (
    <Section id="about">
      <div ref={containerRef} className="text-center px-4 max-w-2xl mx-auto">
        <h2
          className={`text-2xl sm:text-3xl font-semibold mb-3 ${aBeeZee.className}`}
        >
          Namaste 🙏
        </h2>
        <h2
          className={`text-2xl sm:text-3xl font-semibold mb-4 ${aBeeZee.className}`}
        >
          I&apos;m Sajat Bajracharya
        </h2>
        <p
          className={`text-base sm:text-lg opacity-90 text-shadow-dark leading-relaxed ${quickSand.className}`}
        >
          A creative developer passionate about blending design and technology
          to craft smooth, meaningful digital experiences. I enjoy turning ideas
          into interactive projects that inspire and connect people.
        </p>
        <p
          className={`mt-3 text-base sm:text-lg opacity-90 text-shadow-dark leading-relaxed ${quickSand.className}`}
        >
          The night I was born, the moon was a Waning Crescent 🌘.
        </p>
      </div>
    </Section>
  );
};

export default About;
