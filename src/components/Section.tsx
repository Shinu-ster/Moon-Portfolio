import React from 'react';

interface SectionProps {
    children: React.ReactNode;
    id?: string;
    className?: string;

}

export default function Section({ children, id, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`flex items-center section justify-center min-h-screen px-6 relative z-20 text-white snap-start ${className}`}
    >
      <div className="max-w-4xl text-center">{children}</div>
    </section>
  );
}
