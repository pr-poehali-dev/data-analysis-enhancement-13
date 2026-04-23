import { useEffect, useState } from 'react'
import Icon from '@/components/ui/icon'

interface EmailEntry {
  id: number
  email: string
  created_at: string
}

export default function Admin() {
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('https://functions.poehali.dev/4f975c05-5a9e-499b-9df1-c1276b905d98')
      .then(r => r.json())
      .then(data => setEmails(data.emails || []))
      .finally(() => setLoading(false))
  }, [])

  const copyAll = () => {
    const text = emails.map(e => e.email).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="font-mono font-bold text-2xl">
              clo<span className="text-[#00e5ff]">dev</span><span className="text-[#00e5ff]">.</span><span className="text-neutral-400">ru</span>
            </span>
            <p className="text-neutral-500 text-sm mt-1 font-mono">Список ожидания</p>
          </div>
          <button
            onClick={copyAll}
            disabled={emails.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-neutral-300 hover:bg-white/10 transition-colors disabled:opacity-30 font-mono"
          >
            <Icon name={copied ? 'Check' : 'Copy'} size={14} className={copied ? 'text-[#00e5ff]' : ''} />
            {copied ? 'Скопировано' : 'Скопировать все'}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="px-4 py-2 rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff] text-sm font-mono">
            {loading ? '...' : `${emails.length} заявок`}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-neutral-500 font-mono text-sm mt-16">
            <Icon name="Loader" size={16} className="animate-spin" />
            Загрузка...
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center mt-24 text-neutral-600 font-mono">
            <Icon name="Inbox" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Пока нет заявок</p>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] text-xs font-mono text-neutral-500 px-5 py-3 border-b border-white/10 bg-white/3">
              <span>Email</span>
              <span>Дата</span>
            </div>
            {emails.map((entry, i) => (
              <div
                key={entry.id}
                className={`grid grid-cols-[1fr_auto] items-center px-5 py-4 font-mono text-sm ${i !== emails.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/3 transition-colors`}
              >
                <span className="text-white">{entry.email}</span>
                <span className="text-neutral-600 text-xs">{formatDate(entry.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
