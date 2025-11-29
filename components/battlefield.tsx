"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { SimulationSnapshot, Vector2 } from "@/lib/ai/types";
import type { PlayerCommand } from "@/lib/ai/types";

interface BattlefieldProps {
  snapshot: SimulationSnapshot;
  onCommand: (command: PlayerCommand) => void;
}

const CELL_SIZE = 42;

function toTransform(position: Vector2) {
  return {
    left: position.x * CELL_SIZE,
    top: position.y * CELL_SIZE
  };
}

export function Battlefield({ snapshot, onCommand }: BattlefieldProps) {
  const aliveBots = snapshot.bots.filter((bot) => bot.health > 0);
  const aliveEnemies = snapshot.enemies.filter((enemy) => enemy.health > 0);

  const coverTiles = useMemo(
    () =>
      snapshot.world.tiles
        .flat()
        .filter((tile) => tile.cover && !tile.obstacle)
        .map((tile) => tile.position),
    [snapshot.world.tiles]
  );
  const obstacleTiles = useMemo(
    () =>
      snapshot.world.tiles
        .flat()
        .filter((tile) => tile.obstacle)
        .map((tile) => tile.position),
    [snapshot.world.tiles]
  );

  return (
    <section className="relative mx-auto mt-8 w-fit rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.85)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <p>
          Tick <span className="text-skyline-200">{snapshot.tick}</span>
        </p>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() =>
              onCommand({
                type: "focusTarget",
                targetId: aliveEnemies[0]?.id ?? "",
                issuedAt: snapshot.tick
              })
            }
            className="rounded-md border border-slate-700 px-3 py-1 font-semibold text-slate-200 transition hover:bg-slate-800"
            disabled={aliveEnemies.length === 0}
          >
            Assign Focus
          </button>
          <button
            type="button"
            onClick={() =>
              onCommand({
                type: "holdPosition",
                issuedAt: snapshot.tick
              })
            }
            className="rounded-md border border-slate-700 px-3 py-1 font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Hold Line
          </button>
          <button
            type="button"
            onClick={() =>
              onCommand({
                type: "moveTo",
                position: { x: Math.floor(snapshot.world.width / 2), y: 4 },
                issuedAt: snapshot.tick
              })
            }
            className="rounded-md border border-skyline-500 px-3 py-1 font-semibold text-skyline-100 transition hover:bg-skyline-500/20"
          >
            Advance Mid
          </button>
        </div>
      </div>
      <div
        className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950"
        style={{
          width: snapshot.world.width * CELL_SIZE,
          height: snapshot.world.height * CELL_SIZE
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${snapshot.world.width}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${snapshot.world.height}, ${CELL_SIZE}px)`
          }}
        >
          {Array.from({ length: snapshot.world.height * snapshot.world.width }).map(
            (_, index) => {
              const x = index % snapshot.world.width;
              const y = Math.floor(index / snapshot.world.width);
              const obstacle = obstacleTiles.some(
                (tile) => tile.x === x && tile.y === y
              );
              const cover = coverTiles.some((tile) => tile.x === x && tile.y === y);
              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative border border-slate-900/60 ${
                    obstacle
                      ? "bg-slate-800/80"
                      : cover
                        ? "bg-skyline-500/10"
                        : "bg-slate-900/40"
                  }`}
                >
                  {cover && (
                    <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-skyline-400/70" />
                  )}
                </div>
              );
            }
          )}
        </div>

        {aliveBots.map((bot) => (
          <motion.div
            key={bot.id}
            layout
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="absolute flex h-[34px] w-[34px] items-center justify-center rounded-full border border-skyline-400 bg-skyline-500/30 text-[10px] font-semibold uppercase tracking-wide text-skyline-100 shadow-[0_0_15px_rgba(56,148,255,0.45)]"
            style={toTransform(bot.position)}
          >
            {bot.name.split(" ")[1]}
            <div className="absolute -top-2 left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-skyline-300" />
          </motion.div>
        ))}

        {aliveEnemies.map((enemy) => (
          <motion.div
            key={enemy.id}
            layout
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="absolute flex h-[32px] w-[32px] items-center justify-center rounded-full border border-rose-500 bg-rose-500/20 text-[10px] font-semibold uppercase tracking-wide text-rose-200 shadow-[0_0_15px_rgba(255,82,82,0.35)]"
            style={toTransform(enemy.position)}
          >
            H{enemy.name.split(" ")[1]}
          </motion.div>
        ))}

        <motion.div
          layout
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="absolute flex h-[36px] w-[36px] items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/20 text-[11px] font-semibold uppercase tracking-wide text-emerald-200 shadow-[0_0_18px_rgba(16,255,175,0.35)]"
          style={toTransform(snapshot.player.position)}
        >
          Cmd
        </motion.div>
      </div>

      <footer className="mt-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold text-slate-200">Combat Telemetry</h3>
          <ul className="mt-3 h-32 space-y-2 overflow-y-auto pr-1 text-xs text-slate-400">
            {snapshot.logs.length === 0 ? (
              <li>Awaiting contact...</li>
            ) : (
              snapshot.logs.map((entry, index) => (
                <li key={`${entry}-${index}`} className="text-slate-300">
                  {entry}
                </li>
              ))
            )}
          </ul>
          <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="font-semibold text-slate-300">Teammates</h4>
              <ul className="mt-2 space-y-1 text-[11px]">
                {snapshot.bots.map((bot) => (
                  <li key={bot.id} className="flex justify-between text-slate-400">
                    <span>{bot.name.replace("Skyline ", "")}</span>
                    <span className="text-skyline-200">
                      {Math.round((bot.health / bot.maxHealth) * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300">Opposition</h4>
              <ul className="mt-2 space-y-1 text-[11px]">
                {snapshot.enemies.map((enemy) => (
                  <li key={enemy.id} className="flex justify-between text-slate-400">
                    <span>{enemy.name}</span>
                    <span className="text-rose-300">
                      {Math.round((enemy.health / enemy.maxHealth) * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-300">Player</h4>
              <p className="mt-2 whitespace-nowrap text-slate-400">
                Health{" "}
                <span className="text-emerald-300">
                  {Math.round((snapshot.player.health / snapshot.player.maxHealth) * 100)}%
                </span>
              </p>
              <p className="mt-1 text-slate-400">
                Command{" "}
                <span className="text-skyline-200">
                  {snapshot.player.command?.type ?? "Autonomous"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
