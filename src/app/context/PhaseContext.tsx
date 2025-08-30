"use client";

import { createContext, useContext, useState } from "react";

const PhaseContext = createContext(null);
export function PhaseProvider({ children }) {
  const [phase, setPhase] = useState("waxing");
  return (
    <PhaseContext.Provider value={{ phase, setPhase }}>
      {children}
    </PhaseContext.Provider>
  );

}


export function usePhase(){
    const ctx = useContext(PhaseContext)
    if (!ctx) throw new Error('usePhase must be used inside PhaseProvider')
    return ctx
}
