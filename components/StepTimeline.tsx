'use client'

import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5"

type StepState = "pending" | "active" | "complete"

type Step = {
  label: string
  state: StepState
  hasError?: boolean
  hasSuccess?: boolean
}

const circleStyles: Record<StepState, string> = {
  pending: "border-slate-300 bg-slate-100 text-slate-500",
  active: "border-blue-500 bg-blue-50 text-blue-600",
  complete: "border-emerald-500 bg-emerald-50 text-emerald-600",
}

const circleSize = 36 // h-9 / w-9
const lineOffset = circleSize // démarre après le premier cercle et s’arrête avant le dernier

export default function StepTimeline({ steps }: { steps: Step[] }) {
  const lastActiveIndex = steps.reduce((acc, step, idx) => {
    if (step.state === "active" || step.state === "complete") return idx
    return acc
  }, 0)

  const progressPercent =
    steps.length > 1 ? Math.min(100, Math.max(0, (lastActiveIndex / (steps.length - 1)) * 100)) : 0

  return (
    <div className="relative w-full">
      <div className="absolute left-0 right-0 top-[18px] z-0">
        <div className="relative h-1" style={{ marginLeft: lineOffset, marginRight: lineOffset }}>
          <div className="absolute inset-0 rounded-full bg-slate-200" />
          <div
            className="absolute left-0 h-1 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="relative z-10 flex w-full items-center justify-between">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col items-center gap-1 min-w-[120px]">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold ${circleStyles[step.state]}`}>
              {idx + 1}
            </div>
            <div className="flex items-center justify-center gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              <span>{step.label}</span>
              {step.hasError ? <IoCloseCircle className="text-red-500 text-sm" /> : null}
              {!step.hasError && step.hasSuccess ? <IoCheckmarkCircle className="text-emerald-500 text-sm" /> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
