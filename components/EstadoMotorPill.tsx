"use client";

import type { EstadoMotor } from "@/lib/api";

interface Props {
  estado: EstadoMotor;
}

const META: Record<EstadoMotor, { label: string; color: string; pulse: boolean }> = {
  comprobando: { label: "comprobando",  color: "bg-muted",  pulse: true  },
  operativo:   { label: "motor activo", color: "bg-gold",   pulse: false },
  despertando: { label: "despertando",  color: "bg-rubric", pulse: true  },
  offline:     { label: "sin conexión", color: "bg-muted",  pulse: false },
};

export default function EstadoMotorPill({ estado }: Props) {
  const { label, color, pulse } = META[estado];
  return (
    <div
      className="inline-flex items-center gap-2 text-sm smallcaps text-muted"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-60 animate-ping`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
      </span>
      <span>{label}</span>
    </div>
  );
}
