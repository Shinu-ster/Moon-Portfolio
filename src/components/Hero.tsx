import React, { useEffect } from "react";
import Section from "./Section";
import { ABeeZee, Quicksand } from "next/font/google";
import gsap from "gsap";

const aBeeZee = ABeeZee({
  subsets: ["latin"],
  weight: "400",
});

const quickSand = Quicksand({
  subsets: ["latin"],
  weight: "400",
});


const Hero = () => {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from("#left-text", {
      x: -200,
      opacity: 0,
      duration: 2,
      ease: "power3.out",
    }).from(
      "#right-text",
      {
        x: 200,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8"
    );
  }, []);
  return (
    <Section id="hero">
      <div className="text-center">
        <h1
          className={`text-5xl md:text-6xl font-extrabold mb-4 text-white ${aBeeZee.className}`}
        >
          <span className="block" id="left-text">
            From darkness to the dawn,
          </span>
          <span className="block" id="right-text">
            ideas take flight.
          </span>
        </h1>
        <p className={`text-lg opacity-90 ${quickSand.className} mb-6`}>
          Hi, I am <b>Sajat Bajracharya</b>, Welcome to my portfolio
        </p>

        {/* Download Resume Button */}
        <a
          href="/SajatBajracharyaCV.pdf" 
          download
          className="inline-block border border-white text-white bg-transparent rounded-full px-6 py-3 text-sm sm:text-base hover:bg-white/10 transition"
        >
          Download Resume
        </a>
      </div>
    </Section>
  );
};

export default Hero;
