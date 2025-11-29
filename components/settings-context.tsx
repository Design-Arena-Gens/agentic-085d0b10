"use client";

import { createContext, useContext, useMemo } from "react";

export type MovementSpeed = "standard" | "fast" | "very-fast";

export interface SettingsContextValue {
  damageMultiplier: number;
  movementSpeed: MovementSpeed;
  setDamageMultiplier: (value: number) => void;
  setMovementSpeed: (value: MovementSpeed) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
  children,
  damageMultiplier,
  movementSpeed,
  setDamageMultiplier,
  setMovementSpeed
}: {
  children: React.ReactNode;
  damageMultiplier: number;
  movementSpeed: MovementSpeed;
  setDamageMultiplier: (value: number) => void;
  setMovementSpeed: (value: MovementSpeed) => void;
}) {
  const value = useMemo(
    () => ({
      damageMultiplier,
      movementSpeed,
      setDamageMultiplier,
      setMovementSpeed
    }),
    [damageMultiplier, movementSpeed, setDamageMultiplier, setMovementSpeed]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
