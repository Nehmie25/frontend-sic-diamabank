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
  pending: "border-slate-200 bg-white text-slate-400",
  active: "border-blue-600 bg-white text-blue-600 shadow-lg ring-4 ring-blue-100",
  complete: "border-emerald-500 bg-white text-emerald-600",
}

const circleSize = 44 // h-11 / w-11

export default function StepTimeline({ steps }: { steps: Step[] }) {
  const lastActiveIndex = steps.reduce((acc, step, idx) => {
    if (step.state === "active" || step.state === "complete") return idx
    return acc
  }, 0)

  const progressPercent =
    steps.length > 1 ? Math.min(100, Math.max(0, (lastActiveIndex / (steps.length - 1)) * 100)) : 0
  const linePaddingPercent = steps.length > 1 ? 50 / steps.length : 0
  const trackWidthPercent = steps.length > 1 ? 100 - linePaddingPercent * 2 : 100

  return (
    <div className="relative w-full">
      {steps.length > 1 ? (
        <div className="absolute left-0 right-0 z-0" style={{ top: circleSize / 2 }}>
          <div className="relative mx-auto h-1.5" style={{ width: `${trackWidthPercent}%` }}>
            <div className="absolute inset-0 rounded-full bg-slate-200" />
            <div
              className="absolute left-0 h-1.5 rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      <div
        className="relative z-10 grid items-start gap-6 sm:gap-8"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, idx) => {
          const isActive = step.state === "active"
          const isComplete = step.state === "complete"
          const showSuccess = !step.hasError && step.hasSuccess

          return (
            <div key={step.label} className="flex flex-col items-center text-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200 ${circleStyles[step.state]}`}
              >
                {isComplete ? <IoCheckmarkCircle className="text-lg" /> : idx + 1}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                <span>{step.label}</span>
                {step.hasError ? <IoCloseCircle className="text-red-500 text-sm" /> : null}
                {showSuccess ? <IoCheckmarkCircle className="text-emerald-500 text-sm" /> : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
