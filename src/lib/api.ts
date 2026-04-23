const AUTH_URL = 'https://functions.poehali.dev/d57b37fd-f6e7-4796-8a5b-13892b78cfc4'
const PROJECTS_URL = 'https://functions.poehali.dev/8359dca6-0ab1-4bb9-9e56-6dd27e670301'

const SESSION_KEY = 'clodev_session'

export const getSession = () => localStorage.getItem(SESSION_KEY) || ''
export const setSession = (s: string) => localStorage.setItem(SESSION_KEY, s)
export const clearSession = () => localStorage.removeItem(SESSION_KEY)

export interface User {
  id: number
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Project {
  id: number
  name: string
  repo_url?: string
  framework: string
  domain?: string
  status: string
  created_at: string
  last_deploy_status?: string
  last_deploy_at?: string
}

export const api = {
  async register(email: string, password: string, name: string) {
    const r = await fetch(`${AUTH_URL}?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    return r.json()
  },

  async login(email: string, password: string) {
    const r = await fetch(`${AUTH_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return r.json()
  },

  async me(): Promise<{ user?: User; error?: string }> {
    const session = getSession()
    if (!session) return { error: 'Нет сессии' }
    const r = await fetch(`${AUTH_URL}?action=me`, {
      headers: { 'X-Session-Id': session }
    })
    return r.json()
  },

  async getProjects(): Promise<{ projects?: Project[]; error?: string }> {
    const r = await fetch(PROJECTS_URL, {
      headers: { 'X-Session-Id': getSession() }
    })
    return r.json()
  },

  async createProject(name: string, repo_url: string, framework: string) {
    const r = await fetch(PROJECTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': getSession() },
      body: JSON.stringify({ name, repo_url, framework })
    })
    return r.json()
  }
}
