// components/ClientLayout.tsx (Client Component)
"use client";

import { usePathname } from "next/navigation";
import Providers from "./Providers";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBackground = pathname === "/";

  return showBackground ? (
    <Providers>{children}</Providers>
  ) : (
    <>{children}</>
  );
}
