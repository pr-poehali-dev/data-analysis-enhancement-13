import type { ReactNode } from "react"

export interface FeatureItem {
  icon: string
  label: string
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
}

export interface SectionProps extends Section {
  isActive: boolean
}