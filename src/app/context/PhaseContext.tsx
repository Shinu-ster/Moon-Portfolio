"use client";

import React, { createContext, useContext, useState } from "react";

interface PhaseProps {
  children: React.ReactNode;
}

interface PhaseContextType {
  phase: string;
  setPhase: React.Dispatch<React.SetStateAction<string>>;
}

const PhaseContext = createContext<PhaseContextType | null>(null);
export function PhaseProvider({ children }: PhaseProps) {
  const [phase, setPhase] = useState("waxing");
  return (
    <PhaseContext.Provider value={{ phase, setPhase}}>
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error("usePhase must be used inside PhaseProvider");
  return ctx;
}
