"use client";
import React, { useEffect, useState } from "react";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export default function Section({
  children,
  id,
  className = "",
}: SectionProps) {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    function updateHeight() {
      setHeight(window.innerHeight);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <section
      id={id}
      className={`flex items-center justify-center section relative z-20 text-white snap-start ${className}`}
      style={{ height }} // exact height of viewport
    >
      <div className="max-w-4xl text-center">{children}</div>
    </section>
  );
}
