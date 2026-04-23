import type { ReactNode } from "react"

export interface FeatureItem {
  icon: string
  label: string
}

export interface PricingPlan {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  highlighted?: boolean
  buttonText: string
}

export interface Section {
  id: string
  title: string
  subtitle?: ReactNode
  content?: string
  features?: FeatureItem[]
  showButton?: boolean
  buttonText?: string
  showEmailForm?: boolean
  pricing?: PricingPlan[]
}

export interface SectionProps extends Section {
  isActive: boolean
}