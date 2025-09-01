    "use client";
    import { PhaseProvider } from "../app/context/PhaseContext";
    import MoonBackground from "./MoonBackground";

    export default function Providers({ children }) {
      return (
        <PhaseProvider>
          <MoonBackground />
          {children}
        </PhaseProvider>
      );
    }
