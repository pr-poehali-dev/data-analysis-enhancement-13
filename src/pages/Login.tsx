import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, setSession } from '@/lib/api'
import Icon from '@/components/ui/icon'

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = tab === 'login'
        ? await api.login(email, password)
        : await api.register(email, password, name)
      if (data.ok && data.session) {
        setSession(data.session)
        navigate('/dashboard')
      } else {
        setError(data.error || 'Что-то пошло не так')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center mb-10">
          <span className="font-mono font-bold text-2xl text-white">
            clo<span className="text-[#00e5ff]">dev</span><span className="text-[#00e5ff]">.</span><span className="text-neutral-400">ru</span>
          </span>
        </Link>

        <div className="flex rounded-xl border border-white/10 overflow-hidden mb-6">
          {(['login', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2.5 text-sm font-mono transition-colors ${tab === t ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              {t === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {tab === 'register' && (
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 font-mono text-sm outline-none focus:border-[#00e5ff] transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 font-mono text-sm outline-none focus:border-[#00e5ff] transition-colors"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 font-mono text-sm outline-none focus:border-[#00e5ff] transition-colors"
          />
          {error && (
            <p className="text-red-400 text-xs font-mono flex items-center gap-1.5">
              <Icon name="AlertCircle" size={12} />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00e5ff] text-black font-semibold font-mono py-3 rounded-lg hover:bg-[#00c8e0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading && <Icon name="Loader" size={14} className="animate-spin" />}
            {tab === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-neutral-600 text-xs font-mono">или войти через</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="flex gap-2">
            {['GitHub', 'Google', 'Яндекс'].map(provider => (
              <button
                key={provider}
                disabled
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-neutral-500 text-xs font-mono hover:border-white/20 hover:text-neutral-400 transition-colors disabled:cursor-not-allowed"
                title="Скоро"
              >
                {provider}
              </button>
            ))}
          </div>
          <p className="text-center text-neutral-700 text-xs font-mono mt-2">Скоро</p>
        </div>
      </div>
    </div>
  )
}
