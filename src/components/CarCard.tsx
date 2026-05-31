import { useState } from 'react'
import type { ScoredCar } from '../api'
import { formatINR, fuelLabel } from '../lib/format'
import { ScoreRing } from './ScoreRing'

interface Props {
  scored: ScoredCar
  rank: number
  selected: boolean
  onToggleCompare: (id: string) => void
}

const BREAKDOWN_LABELS: Record<string, string> = {
  budget: 'Budget',
  use_case: 'Use case',
  seats: 'Seats',
  fuel: 'Fuel',
  transmission: 'Gearbox',
  priorities: 'Priorities',
}

const FUEL_ICONS: Record<string, string> = {
  petrol: '⛽',
  diesel: '🛢',
  electric: '⚡',
  hybrid: '🔋',
  cng: '💨',
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
      {children}
    </span>
  )
}

export function CarCard({ scored, rank, selected, onToggleCompare }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { car, breakdown } = scored
  const efficiency =
    car.fuel === 'electric'
      ? `${car.range_km ?? '—'} km`
      : car.mileage_kmpl
        ? `${car.mileage_kmpl} kmpl`
        : '—'
  const safetyText = car.safety_ncap_stars > 0 ? `${car.safety_ncap_stars}★` : 'Not rated'

  return (
    <div className={`car-card rounded-2xl border bg-white ${selected ? 'border-emerald-500 ring-1 ring-emerald-200' : 'border-zinc-200'}`}>
      {/* Main row */}
      <div className="flex items-start gap-4 p-5">
        {/* Rank badge */}
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
          {rank}
        </div>

        {/* Core info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-lg font-bold text-zinc-900">
              {car.make} {car.model}
            </h3>
            <span className="text-sm text-zinc-400">{car.variant}</span>
          </div>

          {/* Price + pills row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-zinc-900">
              {formatINR(car.price_ex_showroom_inr)}
            </span>
            <span className="text-xs text-zinc-400">ex-showroom</span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Pill>{FUEL_ICONS[car.fuel] ?? '🚗'} {fuelLabel(car.fuel)}</Pill>
            <Pill>💺 {car.seating} seats</Pill>
            <Pill>🛡 {safetyText} NCAP</Pill>
            <Pill>📏 {efficiency}</Pill>
          </div>
        </div>

        {/* Score ring */}
        <ScoreRing score={scored.match_score} size={72} />
      </div>

      {/* Rationale strip */}
      {scored.rationale && (
        <div className="border-t border-zinc-100 px-5 py-3.5">
          <p className="text-sm leading-relaxed text-zinc-600">
            <span className="font-semibold text-zinc-900">Why it fits — </span>
            {scored.rationale}
          </p>
          {scored.watch_outs && (
            <p className="mt-1.5 text-sm text-amber-700">
              <span className="font-semibold">⚠ Note — </span>
              {scored.watch_outs}
            </p>
          )}
        </div>
      )}

      {/* Expandable score breakdown */}
      <div className="border-t border-zinc-100">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-600"
        >
          Score breakdown
          <svg
            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 10.94L2.53 5.47l1.06-1.06L8 8.82l4.41-4.41 1.06 1.06z" />
          </svg>
        </button>
        {expanded && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 px-5 pb-4 sm:grid-cols-3">
            {Object.entries(breakdown).map(([key, val]) => (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">{BREAKDOWN_LABELS[key]}</span>
                  <span className="text-[11px] font-semibold text-zinc-700">{val}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="breakdown-bar h-full rounded-full bg-zinc-800"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare toggle */}
      <div className="border-t border-zinc-100 px-5 py-3">
        <button
          onClick={() => onToggleCompare(car.id)}
          className={`w-full rounded-xl py-2 text-sm font-semibold transition ${
            selected
              ? 'bg-emerald-700 text-white'
              : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          {selected ? '✓ Added to compare' : '+ Compare'}
        </button>
      </div>
    </div>
  )
}
