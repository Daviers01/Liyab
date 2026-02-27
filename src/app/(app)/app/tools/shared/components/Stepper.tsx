interface StepperProps {
  currentStep: number
  steps: readonly string[]
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isComplete = stepNum < currentStep

        return (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && <div className={`w-8 h-px ${isComplete ? 'bg-orange-500' : 'bg-border'}`} />}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  isComplete
                    ? 'bg-orange-500 text-white'
                    : isActive
                      ? 'bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400'
                      : 'bg-muted/50 border border-border text-muted-foreground'
                }`}
              >
                {isComplete ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive
                    ? 'text-foreground'
                    : isComplete
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/60'
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
