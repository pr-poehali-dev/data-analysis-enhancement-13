import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, clearSession, type User, type Project } from '@/lib/api'
import Icon from '@/components/ui/icon'

const FRAMEWORKS = ['nextjs', 'react', 'vue', 'nuxt', 'svelte', 'astro', 'other']
const STATUS_COLOR: Record<string, string> = {
  success: 'text-emerald-400',
  building: 'text-yellow-400',
  failed: 'text-red-400',
  queued: 'text-neutral-400',
}
const STATUS_LABEL: Record<string, string> = {
  success: 'Готов',
  building: 'Сборка...',
  failed: 'Ошибка',
  queued: 'В очереди',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRepo, setNewRepo] = useState('')
  const [newFramework, setNewFramework] = useState('react')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    async function load() {
      const meData = await api.me()
      if (!meData.user) { navigate('/login'); return }
      setUser(meData.user)
      const projData = await api.getProjects()
      setProjects(projData.projects || [])
      setLoading(false)
    }
    load()
  }, [navigate])

  const handleLogout = () => { clearSession(); navigate('/') }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const data = await api.createProject(newName, newRepo, newFramework)
    if (data.ok) {
      const projData = await api.getProjects()
      setProjects(projData.projects || [])
      setShowNew(false)
      setNewName(''); setNewRepo(''); setNewFramework('react')
    }
    setCreating(false)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Icon name="Loader" size={24} className="animate-spin text-[#00e5ff]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="font-mono font-bold text-lg">
          clo<span className="text-[#00e5ff]">dev</span><span className="text-[#00e5ff]">.</span><span className="text-neutral-400">ru</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-neutral-400 text-sm font-mono">{user?.name}</span>
          <button onClick={handleLogout} className="text-neutral-600 hover:text-neutral-300 transition-colors">
            <Icon name="LogOut" size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Проекты</h1>
            <p className="text-neutral-500 text-sm font-mono mt-1">{projects.length} проектов</p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 bg-[#00e5ff] text-black font-semibold font-mono text-sm px-4 py-2.5 rounded-lg hover:bg-[#00c8e0] transition-colors"
          >
            <Icon name="Plus" size={15} />
            Новый проект
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center">
            <Icon name="FolderOpen" size={40} className="mx-auto mb-4 text-neutral-700" />
            <p className="text-neutral-500 font-mono text-sm">Нет проектов. Создайте первый!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-pointer bg-white/2 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon name="Globe" size={14} className="text-[#00e5ff]" />
                    </div>
                    <span className="font-semibold text-sm">{p.name}</span>
                  </div>
                  <span className={`text-xs font-mono ${STATUS_COLOR[p.last_deploy_status || 'success']}`}>
                    {STATUS_LABEL[p.last_deploy_status || 'success']}
                  </span>
                </div>
                <div className="space-y-1.5 mt-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
                    <Icon name="Code2" size={11} />
                    {p.framework}
                  </div>
                  {p.last_deploy_at && (
                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono">
                      <Icon name="Clock" size={11} />
                      {formatDate(p.last_deploy_at)}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <button className="flex-1 text-xs font-mono py-1.5 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5">
                    <Icon name="Rocket" size={11} />
                    Деплой
                  </button>
                  <button className="flex-1 text-xs font-mono py-1.5 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5">
                    <Icon name="Settings" size={11} />
                    Настройки
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showNew && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Новый проект</h2>
              <button onClick={() => setShowNew(false)} className="text-neutral-600 hover:text-white transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-mono text-neutral-500 mb-1.5 block">Название *</label>
                <input
                  type="text"
                  placeholder="my-awesome-app"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 font-mono text-sm outline-none focus:border-[#00e5ff] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-neutral-500 mb-1.5 block">Git репозиторий</label>
                <input
                  type="text"
                  placeholder="https://github.com/user/repo"
                  value={newRepo}
                  onChange={e => setNewRepo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-neutral-600 font-mono text-sm outline-none focus:border-[#00e5ff] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-neutral-500 mb-1.5 block">Фреймворк</label>
                <select
                  value={newFramework}
                  onChange={e => setNewFramework(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-[#00e5ff] transition-colors"
                >
                  {FRAMEWORKS.map(f => <option key={f} value={f} className="bg-neutral-900">{f}</option>)}
                </select>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-[#00e5ff] text-black font-semibold font-mono py-2.5 rounded-lg hover:bg-[#00c8e0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {creating && <Icon name="Loader" size={14} className="animate-spin" />}
                Создать проект
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
