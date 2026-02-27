import { Stepper as SharedStepper } from '../../shared/components/Stepper'

const GTM_STEPS = ['Connect GTM', 'Select Container', 'View Report'] as const

export function Stepper({ currentStep }: { currentStep: number }) {
  return <SharedStepper steps={GTM_STEPS} currentStep={currentStep} />
}
