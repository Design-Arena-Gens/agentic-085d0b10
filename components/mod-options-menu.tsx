"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import { useSettings } from "./settings-context";

const movementOptions: { label: string; value: "standard" | "fast" | "very-fast" }[] = [
  { label: "Standard", value: "standard" },
  { label: "Fast", value: "fast" },
  { label: "Very Fast", value: "very-fast" }
];

export function ModOptionsMenu() {
  const { damageMultiplier, movementSpeed, setDamageMultiplier, setMovementSpeed } =
    useSettings();
  const sliderId = useId();
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      animate={{ x: open ? 0 : "-82%" }}
      className="fixed left-4 top-4 z-20 w-[320px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-md"
    >
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-skyline-300">
            SmartTeammates
          </p>
          <h2 className="text-lg font-semibold text-slate-100">Mod Options</h2>
          <p className="text-xs text-slate-400">by Skyline</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-md border border-slate-700 px-2 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
        >
          {open ? "Hide" : "Show"}
        </button>
      </header>
      <div className="space-y-6 px-4 py-5 text-sm text-slate-200">
        <section className="space-y-2">
          <label htmlFor={sliderId} className="flex items-center justify-between">
            <span className="font-semibold text-slate-100">Damage Multiplier</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-skyline-200">
              {damageMultiplier.toFixed(1)}x
            </span>
          </label>
          <input
            id={sliderId}
            aria-label="Damage Multiplier"
            type="range"
            min={1}
            max={5}
            step={0.1}
            value={damageMultiplier}
            onChange={(event) => setDamageMultiplier(Number(event.target.value))}
            className="w-full accent-skyline-400"
          />
          <p className="text-xs text-slate-400">
            Amplifies bot weapon damage and ability potency. Tune to match mission
            difficulty.
          </p>
        </section>
        <section className="space-y-3">
          <p className="font-semibold text-slate-100">Movement Speed</p>
          <div className="grid grid-cols-3 gap-2">
            {movementOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMovementSpeed(option.value)}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                  movementSpeed === option.value
                    ? "border-skyline-400 bg-skyline-500/20 text-skyline-200"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Governs tactical traversal speed, flanking efficiency, and target acquisition
            cadence.
          </p>
        </section>
      </div>
    </motion.aside>
  );
}
