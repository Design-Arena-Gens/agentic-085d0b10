"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/components/settings-context";
import { ModOptionsMenu } from "@/components/mod-options-menu";
import { Battlefield } from "@/components/battlefield";
import {
  createInitialState,
  getSnapshot,
  issueCommand,
  stepSimulation
} from "@/lib/ai/simulation";
import type { InternalSimulationState, SimulationConfig } from "@/lib/ai/simulation";
import type { PlayerCommand } from "@/lib/ai/types";

const TICK_INTERVAL = 1200;

export default function HomePage() {
  const { damageMultiplier, movementSpeed } = useSettings();
  const [running, setRunning] = useState(true);
  const [state, setState] = useState<InternalSimulationState>(() => createInitialState());
  const configRef = useRef<SimulationConfig>({
    damageMultiplier,
    movementSpeed
  });

  useEffect(() => {
    configRef.current = {
      damageMultiplier,
      movementSpeed
    };
  }, [damageMultiplier, movementSpeed]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setState((current) => stepSimulation(current, configRef.current));
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [running]);

  const snapshot = useMemo(() => getSnapshot(state), [state]);

  const handleCommand = (command: PlayerCommand) => {
    setState((current) => issueCommand(current, command));
  };

  const handleStep = () => {
    setState((current) => stepSimulation(current, configRef.current));
  };

  const handleReset = () => {
    setState(createInitialState());
  };

  const aliveEnemies = snapshot.enemies.filter((enemy) => enemy.health > 0).length;

  return (
    <main className="relative overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(24,147,241,0.12),transparent_55%)]" />
      <ModOptionsMenu />

      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20">
        <motion.div
          className="rounded-full border border-skyline-500/40 bg-slate-900/70 px-4 py-1 text-xs uppercase tracking-[0.35em] text-skyline-200 shadow-[0_10px_35px_-20px_rgba(24,147,241,0.6)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Skyline Systems Tactical Mod
        </motion.div>
        <motion.h1
          className="mt-6 text-center text-5xl font-semibold text-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SmartTeammates Combat Intelligence
        </motion.h1>
        <motion.p
          className="mt-4 max-w-3xl text-center text-base text-slate-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Deploy Skyline&apos;s autonomous fireteam with adaptive navigation, target
          prioritisation, synchronized cover mechanics, and dynamic ability usage. Tune
          combat parameters instantly from the Mod Options menu mid-mission.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            className="rounded-xl border border-skyline-500 bg-skyline-500/20 px-4 py-2 text-sm font-semibold text-skyline-100 transition hover:bg-skyline-500/30"
          >
            {running ? "Pause Simulation" : "Resume Simulation"}
          </button>
          <button
            type="button"
            onClick={handleStep}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Step Tactical AI
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-rose-500/70 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            Reset Encounter
          </button>
        </motion.div>

        <Battlefield snapshot={snapshot} onCommand={handleCommand} />

        <motion.div
          className="mt-16 w-full rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-slate-100">AI Behaviour Loadout</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <h3 className="font-semibold text-skyline-200">Navigation &amp; Positioning</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400">
                <li>Adaptive A* routing through dynamic cover and obstacle fields.</li>
                <li>Cover-seeking heuristics trigger under suppression or low health.</li>
                <li>Player-issued directives override baseline autonomous behaviour.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <h3 className="font-semibold text-skyline-200">Target Prioritisation</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400">
                <li>Threat weighting blends aggression, proximity, and player focus.</li>
                <li>Coordinated fire adjusts to bot suppression and enemy clustering.</li>
                <li>Ability timing considers grenade splash potential and support needs.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <h3 className="font-semibold text-skyline-200">Combat Telemetry</h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Remaining hostiles:{" "}
                <span className="font-semibold text-rose-300">{aliveEnemies}</span>
                {" | "}Damage Amplifier:{" "}
                <span className="font-semibold text-skyline-200">
                  {damageMultiplier.toFixed(1)}x
                </span>
                {" | "}Traversal:{" "}
                <span className="font-semibold text-slate-200">{movementSpeed}</span>.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <h3 className="font-semibold text-skyline-200">Command Uplink</h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Use on-field command buttons to re-task the fireteam. Focus Targets lock
                aggressive suppression on a specific hostile. Hold Line toggles defensive
                formation. Advance Mid pushes assault along the central lane.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
