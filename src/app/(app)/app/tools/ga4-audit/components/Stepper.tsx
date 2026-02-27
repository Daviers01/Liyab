import { Stepper as SharedStepper } from '../../shared/components/Stepper'

const GA4_STEPS = ['Connect Google', 'Select Property', 'View Report'] as const

export function Stepper({ currentStep }: { currentStep: number }) {
  return <SharedStepper steps={GA4_STEPS} currentStep={currentStep} />
}
