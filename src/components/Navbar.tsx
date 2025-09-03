"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ABeeZee, Quicksand } from "next/font/google";

const aBeeZee = ABeeZee({
  subsets: ["latin"],
  weight: "400",
});

const quickSand = Quicksand({
  subsets: ["latin"],
  weight: "400",
});

type SectionId = "hero" | "project" | "about" | "play";

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Home" },
  { id: "project", label: "Projects" },
  { id: "play", label: "Play" },
  { id: "about", label: "About" },
];

export default function Navbar() {
  const linksRef = useRef<HTMLDivElement | null>(null);
  const linkEls = useRef<Record<SectionId, HTMLAnchorElement | null>>({
    hero: null,
    project: null,
    about: null,
    play: null,
  });

  const [active, setActive] = useState<SectionId>("hero");
  const [arrowLeft, setArrowLeft] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(id);
    setMenuOpen(false); // close mobile menu if open
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateArrow = useMemo(
    () => () => {
      const linksWrap = linksRef.current;
      const target = linkEls.current[active];
      if (!linksWrap || !target) return;
      const wrapBox = linksWrap.getBoundingClientRect();
      const linkBox = target.getBoundingClientRect();
      const center = linkBox.left - wrapBox.left + linkBox.width / 2;
      setArrowLeft(center);
    },
    [active]
  );

  useEffect(() => {
    updateArrow();
    const onResize = () => updateArrow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateArrow]);

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) =>
      document.getElementById(id)
    ).filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            setActive(id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    updateArrow();
  }, [active, updateArrow]);

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 flex justify-center">
      {/* Desktop: original navbar */}
      <div className="hidden md:flex relative flex h-12 w-[90%] items-center overflow-hidden rounded-full border border-white bg-white shadow-md px-4">

        <div className={`text-black font-bold mr-4 ${aBeeZee.className}`}>
          <Link href={`/#hero`} onClick={handleClick("hero")}>
            Sajat Bajracharya
          </Link>
        </div>

        {/* Links */}
        <div
          ref={linksRef}
          className="relative flex flex-1 items-center justify-end gap-10 text-sm font-medium text-black pr-6"
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <Link
              key={id}
              href={`/#${id}`}
              onClick={handleClick(id)}
              ref={(el) => {
                if (el instanceof HTMLElement) linkEls.current[id] = el;
              }}
              className={`px-1 py-1 transition-colors ${quickSand.className} ${
                active === id
                  ? "text-black"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Arrow indicator */}
          <span
            aria-hidden
            className="pointer-events-none absolute text-xs leading-none"
            style={{
              left: `${arrowLeft}px`,
              transform: "translateX(-50%)",
              transition: "left 250ms ease",
              color: "#000",
              bottom: "-4px",
            }}
          >
            ▲
          </span>
        </div>

        {/* Right dark segment */}

        <Link
          href="https://x.com/bajj_lightyear"
          target="_blank"
          className="flex h-full items-center justify-center bg-[#222222] px-4 md:px-6 ml-8 text-white rounded-r-full"
        >
          Follow me
        </Link>
      </div>

      {/* Mobile: simplified navbar */}
      <div className="md:hidden flex w-[90%] justify-between items-center px-4">
        <div className="text-white font-bold">Sajat Bajracharya</div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 mt-1 w-40 rounded-lg bg-white shadow-md flex flex-col z-50 overflow-hidden">
          {NAV_ITEMS.map(({ id, label }) => (
            <Link
              key={id}
              href={`/#${id}`}
              onClick={handleClick(id)}
              className="px-3 py-2 text-sm text-black hover:bg-gray-200 transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="https://x.com/bajj_lightyear"
            target="_blank"
            className="px-3 py-2 text-sm text-white bg-[#222222] hover:bg-gray-800 text-center transition-colors"
          >
            Follow me
          </Link>
        </div>
      )}
    </nav>
  );
}
