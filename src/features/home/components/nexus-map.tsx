"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type FocusEvent } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { AxisExample } from "../lib/axis-examples";
import { axes, type AxisId } from "../nexus-axes";

const RADIUS = 36; // porcentaje del lado del mapa
const CENTER = 50;
/** Tiempo que permanece cada eje antes de pasar al siguiente en la rotación automática. */
const INTERVAL_MS = 5000;

/** Posición de cada nodo sobre una circunferencia, empezando arriba y avanzando en sentido horario. */
const positions = axes.map((_, i) => {
  const angle = ((-90 + i * 60) * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
});

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Mapa de nodos del inicio: el logo al centro y los seis ejes alrededor.
 * - Activar un nodo (hover, foco o toque) anima su conexión y muestra datos reales de la demostración.
 * - Los ejes rotan solos cada 5 s; se pausa al pasar el cursor o enfocar, tiene botón de pausa y no arranca
 *   si el usuario prefiere menos movimiento. Las actualizaciones solo se anuncian a lectores de pantalla cuando no rota solo.
 */
export function NexusMap({ examples }: { examples: Partial<Record<AxisId, AxisExample>> }) {
  const [activeId, setActiveId] = useState<AxisId>("vende");
  const [playing, setPlaying] = useState(true);
  const [inside, setInside] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const running = playing && !inside && !reducedMotion;
  const activeIndex = axes.findIndex((a) => a.id === activeId);
  const active = axes[activeIndex];
  const pos = positions[activeIndex];

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setActiveId(axes[(activeIndex + 1) % axes.length].id), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [running, activeIndex]);

  function onBlurCapture(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInside(false);
  }

  return (
    <div
      className="mx-auto flex w-full max-w-[26rem] flex-col items-center lg:justify-self-center"
      onPointerEnter={() => setInside(true)}
      onPointerLeave={() => setInside(false)}
      onFocusCapture={() => setInside(true)}
      onBlurCapture={onBlurCapture}
    >
      <div role="group" aria-label="Seis formas de avanzar con NEXORA" className="relative aspect-square w-full">
        {/* Foco de luz del color del eje activo; sigue al nodo. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,top] duration-700 ease-out"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            background: `radial-gradient(circle, color-mix(in srgb, ${active.stroke} 30%, transparent), transparent 68%)`,
          }}
        />

        <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="0.35" strokeDasharray="1 1.6" />
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 11} fill="none" stroke="var(--color-line)" strokeWidth="0.25" />
          {/* Satélites que orbitan lentamente en el anillo exterior. */}
          <g className="animate-orbit">
            <circle cx={CENTER + RADIUS + 11} cy={CENTER} r="1.1" className="fill-blue-600" />
            <circle cx={CENTER - 23.5} cy={CENTER + 40.7} r="0.9" className="fill-leaf-400" />
            <circle cx={CENTER - 23.5} cy={CENTER - 40.7} r="0.9" className="fill-sun-500" />
          </g>
          {axes.map((axis, i) => {
            const isActive = axis.id === activeId;
            return (
              <line
                key={axis.id}
                x1={CENTER}
                y1={CENTER}
                x2={positions[i].x}
                y2={positions[i].y}
                stroke={isActive ? axis.stroke : "var(--color-line)"}
                strokeWidth={isActive ? 0.9 : 0.4}
                strokeLinecap="round"
                strokeDasharray={isActive ? "2 2" : undefined}
                className={isActive ? "animate-flow" : undefined}
                style={{ transition: "stroke 200ms" }}
              />
            );
          })}
        </svg>

        <div className="animate-pop absolute left-1/2 top-1/2 flex size-[5.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:size-28">
          <span aria-hidden="true" className="animate-pulse-ring absolute inset-0 rounded-full bg-blue-600/20" />
          <svg viewBox="0 0 40 40" aria-hidden="true" className="relative size-full drop-shadow-md">
            <rect width="40" height="40" rx="12" className="fill-blue-600" />
            <path d="M11 29V11l18 18V11" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="11" cy="11" r="2.6" className="fill-leaf-400" />
            <circle cx="29" cy="29" r="2.6" className="fill-sun-400" />
          </svg>
        </div>

        {reducedMotion ? null : (
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-pressed={!playing}
            aria-label={playing ? "Pausar la rotación automática de los ejes" : "Reanudar la rotación automática de los ejes"}
            className="absolute bottom-0 right-0 z-10 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 text-xs font-semibold text-muted shadow-raised hover:border-blue-600 hover:text-blue-700"
          >
            {playing ? <Pause aria-hidden="true" className="size-3.5" /> : <Play aria-hidden="true" className="size-3.5" />}
            {playing ? "Pausar" : "Reanudar"}
          </button>
        )}

        {axes.map((axis, i) => {
          const isActive = axis.id === activeId;
          const Icon = axis.icon;
          return (
            <div
              key={axis.id}
              className="animate-pop absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%`, animationDelay: `${180 + i * 90}ms` }}
            >
              <button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setActiveId(axis.id)}
                onFocus={() => setActiveId(axis.id)}
                onClick={() => {
                  // Elegir un eje a mano detiene la rotación automática.
                  setActiveId(axis.id);
                  setPlaying(false);
                }}
                className={cn(
                  "animate-float flex size-[4.75rem] flex-col items-center justify-center gap-0.5 rounded-full border-2 shadow-raised transition-[transform,scale,background-color] duration-200 sm:size-24",
                  axis.ring,
                  isActive ? cn(axis.active, "scale-110") : "bg-surface text-ink hover:scale-105",
                )}
                style={{ animationDelay: `${i * -0.9}s` }}
              >
                <Icon aria-hidden="true" className={cn("size-6 sm:size-7", isActive ? "text-current" : axis.iconIdle)} />
                <span className="text-[0.8rem] font-bold leading-none sm:text-sm">{axis.title}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/*
        Los seis contenidos se apilan en la misma celda y solo el activo es visible: la tarjeta siempre mide lo que el
        más alto, así el diseño no salta al cambiar de nodo.
      */}
      <div
        aria-live={running ? "off" : "polite"}
        className="relative mt-3 grid w-full overflow-hidden rounded-lg border border-line bg-surface shadow-raised"
      >
        {axes.map((axis) => {
          const isActive = axis.id === activeId;
          const example = examples[axis.id];
          const Icon = axis.icon;
          return (
            <div
              key={axis.id}
              aria-hidden={!isActive}
              className={cn("relative col-start-1 row-start-1 p-4 pb-5 pl-6 sm:p-5 sm:pb-6 sm:pl-7", !isActive && "invisible")}
            >
              <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1.5", axis.accent)} />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border", axis.active)}
                  >
                    <Icon className="size-5" />
                  </span>
                  <h2 className="text-xl font-bold">{axis.title}</h2>
                </div>
                {example ? <DemoBadge /> : null}
              </div>
              <p className="mt-2 text-sm text-muted">{axis.text}</p>
              {example?.stat ? (
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden="true" className={cn("size-2 rounded-full", axis.accent)} />
                  {example.stat}
                </p>
              ) : null}
              {example ? (
                <p className="mt-1 text-sm">
                  <span className="font-semibold">{example.headline}</span>
                  {example.detail ? <span className="text-muted"> — {example.detail}</span> : null}
                </p>
              ) : null}
              <Link href={axis.href} className={buttonClasses("primary", "sm", "mt-3 w-full sm:w-auto")}>
                {axis.cta}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          );
        })}

        {/* Progreso hacia el siguiente eje (solo mientras la rotación está activada). */}
        {playing && !reducedMotion ? (
          <span
            key={activeId}
            aria-hidden="true"
            className={cn("animate-progress absolute bottom-0 left-0 h-1 w-full", active.accent)}
            style={{ animationDuration: `${INTERVAL_MS}ms`, animationPlayState: running ? "running" : "paused" }}
          />
        ) : null}
      </div>
    </div>
  );
}
