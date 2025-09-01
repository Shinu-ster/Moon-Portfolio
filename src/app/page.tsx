"use client"
import Section from "@/components/Section";
import { ABeeZee, Quicksand } from 'next/font/google'
import { useEffect } from "react";
import gsap from "gsap";

const aBeeZee = ABeeZee({
  subsets: ['latin'],
  weight: '400',
})

const quickSand = Quicksand({
  subsets: ['latin'],
  weight: '400'
})

export default function Home() {

  useEffect(()=>{
    const tl = gsap.timeline();

    tl.from("#left-text",{
      x:-200,
      opacity:0,
      duration:2,
      ease:"power3.out",
    })
    .from("#right-text",{
      x: 200,
      opacity: 0,
      duration: 1,
      ease:"power3.out"
    }, "-=0.8")
  },[])
  return (
    <main className="bg-black text-white">
      {/* Hero */}
      <Section id="hero">
        <div className="text-center">
          <h1 className={`text-5xl md:text-6xl font-extrabold mb-4 text-white ${aBeeZee.className}`}>
            <span className="block" id="left-text">From darkness to the dawn,</span>
            <span className="block" id="right-text">ideas take flight.</span>
          </h1>
          <p className={`text-lg opacity-90 ${quickSand.className}`}>
            Hi, I am <b>John Doe</b>, Welcome to my portfolio
          </p>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="text-center">
          <h2 className={`text-3xl font-semibold mb-4 ${aBeeZee.className}`}>Contact</h2>
          <p className={`opacity-90 ${quickSand.className}` }>Drop a message — I reply fast ✉️</p>
        </div>
      </Section>

      {/* Extra Section */}
      <Section id="extra">
        <div className="text-center">
          <h2 className={`text-3xl font-semibold mb-4 ${aBeeZee.className}`}>Less Doubt More Output</h2>
          <p className={`opacity-90 ${quickSand.className}`}>
            Scroll to see the moon phases continue 🌙
          </p>
        </div>
      </Section>
    </main>
  );
}
