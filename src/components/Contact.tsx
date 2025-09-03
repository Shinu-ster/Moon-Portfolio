"use client";

import React, { useEffect, useRef } from "react";
import Section from "./Section";
import { ABeeZee, Quicksand } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const aBeeZee = ABeeZee({ subsets: ["latin"], weight: "400" });
const quickSand = Quicksand({ subsets: ["latin"], weight: "400" });

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return; 

    const elements = containerRef.current.children;

    gsap.set(elements, { y: 60, opacity: 0, scale: 0.95 });

    gsap.to(elements, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        end: "bottom 20%",
        scrub: false,
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <Section id="contact">
      <div ref={containerRef} className="text-center px-4">
        <h2
          className={`text-2xl sm:text-3xl font-semibold mb-4 ${aBeeZee.className} text-shadow-dark`}
        >
          Want to Collaborate?
        </h2>
        <p
          className={`opacity-90 ${quickSand.className} text-shadow-dark text-base sm:text-lg`}
        >
          Let&apos;s Connect
        </p>
        <p
          className={`opacity-90 ${quickSand.className} text-shadow-dark text-base sm:text-lg mb-6`}
        >
          Feel free to reach out for collaborations or just a friendly hello. 👋
        </p>

        <a
          href="mailto:sajatbazz@gmail.com"
          className="inline-block border border-white text-white rounded-full px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base hover:bg-white/10 transition"
        >
          Send an Email
        </a>
      </div>
    </Section>
  );
};

export default Contact;
