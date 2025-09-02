"use client";
import React from "react";
import { PhaseProvider } from "../app/context/PhaseContext";
import MoonBackground from "./MoonBackground";

interface ProvidersProps {
  children: React.ReactNode;
}


export default function Providers({ children }: ProvidersProps) {
  return (
    <PhaseProvider>
      <MoonBackground />
      {children}
    </PhaseProvider>
  );
}
