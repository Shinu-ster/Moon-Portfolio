"use client";

import React, { useRef, useEffect } from "react";
import { ABeeZee } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const aBeeZee = ABeeZee({ subsets: ["latin"], weight: "400" });

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: leftRef.current.parentElement,
        start: "top 70%",
        toggleActions: "play none none none", // play once on scroll in
      },
    });

    tl.fromTo(
      leftRef.current,
      { x: -200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    ).fromTo(
      rightRef.current,
      { x: 200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
      "<" // start at the same time as left
    );
  }, []);

  return (
    <section
      id="play"
      className="relative w-full section h-screen flex flex-col items-center justify-center"
    >
      {/* Top Line */}
      <div className="w-1/3 h-[1px] bg-white/20 mb-12"></div>

      {/* Text with subtle tab */}
      <div className="flex justify-between w-full max-w-4xl px-6">
        {/* Left */}
        <span
          ref={leftRef}
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${aBeeZee.className}`}
        >
          LESS <br />
          <span className="inline-block ml-8">DOUBT</span>
        </span>

        {/* Right */}
        <span
          ref={rightRef}
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-right ${aBeeZee.className}`}
        >
          <span className="inline-block translate-x-[-20px] sm:translate-x-[-16px] md:translate-x-[-20px] lg:translate-x-[-20px]">
            MORE
          </span>{" "}
          <br />
          <span className="inline-block translate-x-[8px] sm:translate-x-[12px] md:translate-x-16 lg:translate-x-16">
            OUTPUT
          </span>
        </span>
      </div>

      {/* Bottom Line */}
      <div className="w-1/3 h-[1px] bg-white/20 mt-12"></div>
    </section>
  );
}
