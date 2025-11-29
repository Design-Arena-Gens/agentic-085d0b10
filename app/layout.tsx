"use client";

import "./globals.css";
import { clsx } from "clsx";
import { Inter } from "next/font/google";
import { useCallback, useState } from "react";
import { SettingsProvider } from "@/components/settings-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [damageMultiplier, setDamageMultiplier] = useState(1);
  const [movementSpeed, setMovementSpeed] = useState<"standard" | "fast" | "very-fast">(
    "standard"
  );

  const handleDamageMultiplier = useCallback((value: number) => {
    setDamageMultiplier(Math.min(5, Math.max(1, Number.isFinite(value) ? value : 1)));
  }, []);

  const handleMovementSpeed = useCallback(
    (value: "standard" | "fast" | "very-fast") => {
      setMovementSpeed(value);
    },
    []
  );

  return (
    <html lang="en" className="h-full">
      <body className={clsx(inter.className, "h-full")}>
        <SettingsProvider
          damageMultiplier={damageMultiplier}
          movementSpeed={movementSpeed}
          setDamageMultiplier={handleDamageMultiplier}
          setMovementSpeed={handleMovementSpeed}
        >
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
