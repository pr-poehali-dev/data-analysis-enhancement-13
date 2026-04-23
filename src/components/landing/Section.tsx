import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Icon from "@/components/ui/icon"
import type { SectionProps } from "@/types"

export default function Section({ id, title, subtitle, content, features, pricing, isActive, showButton, buttonText, showEmailForm }: SectionProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      await fetch('https://functions.poehali.dev/f7be8510-dfeb-481e-b3a8-0c512d8a38cc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
    } finally {
      setSubmitted(true)
    }
  }

  const isPricing = !!pricing

  return (
    <section id={id} className={`relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24 ${isPricing ? 'overflow-hidden' : ''}`}>
      {subtitle && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.div>
      )}
      <motion.h2
        className={`font-bold leading-[1.1] tracking-tight text-white ${isPricing ? 'text-3xl md:text-5xl lg:text-6xl max-w-2xl' : 'text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem] max-w-4xl'}`}
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {content && (
        <motion.p
          className={`mt-4 text-neutral-400 ${isPricing ? 'text-base md:text-lg max-w-xl' : 'text-lg md:text-xl lg:text-2xl max-w-2xl mt-6'}`}
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {content}
        </motion.p>
      )}

      {pricing && (
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {pricing.map((plan, i) => (
            <div
              key={i}
              className={`flex-1 rounded-2xl p-6 border flex flex-col gap-4 transition-all ${
                plan.highlighted
                  ? 'border-[#00e5ff]/60 bg-[#00e5ff]/5'
                  : 'border-white/10 bg-white/3'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm text-neutral-400">{plan.name}</span>
                  {plan.highlighted && (
                    <span className="text-[10px] font-mono text-[#00e5ff] border border-[#00e5ff]/40 px-2 py-0.5 rounded-full">Popular</span>
                  )}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-white font-bold text-3xl">{plan.price}</span>
                  {plan.period && <span className="text-neutral-500 text-sm mb-1 font-mono">{plan.period}</span>}
                </div>
                <p className="text-neutral-500 text-xs font-mono mt-1">{plan.description}</p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-neutral-300 font-mono">
                    <Icon name="Check" size={13} className="text-[#00e5ff] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-lg text-sm font-semibold font-mono transition-colors mt-2 ${
                plan.highlighted
                  ? 'bg-[#00e5ff] text-black hover:bg-[#00c8e0]'
                  : 'border border-white/15 text-white hover:bg-white/10'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {features && features.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-4 mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm font-mono"
            >
              <Icon name={f.icon} size={15} className="text-[#00e5ff]" />
              {f.label}
            </div>
          ))}
        </motion.div>
      )}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-12 md:mt-16"
        >
          <Button
            size="lg"
            className="bg-[#00e5ff] text-black hover:bg-[#00c8e0] font-semibold transition-colors text-base px-8"
          >
            {buttonText}
          </Button>
        </motion.div>
      )}
      {showEmailForm && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-neutral-500 focus:border-[#00e5ff] focus:ring-[#00e5ff] h-12 text-base"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-[#00e5ff] text-black hover:bg-[#00c8e0] font-semibold transition-colors whitespace-nowrap h-12"
              >
                Получить доступ
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-[#00e5ff] text-lg font-mono"
            >
              <Icon name="CheckCircle" size={22} />
              Отлично! Пришлём ссылку на <span className="text-white">{email}</span>
            </motion.div>
          )}
          <p className="mt-4 text-sm text-neutral-600 font-mono">Без спама. Только приглашение.</p>
        </motion.div>
      )}
    </section>
  )
}
