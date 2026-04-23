import { Badge } from "@/components/ui/badge"

export const sections = [
  {
    id: 'hero',
    subtitle: <Badge variant="outline" className="text-[#00e5ff] border-[#00e5ff]/50 bg-[#00e5ff]/10 text-sm font-mono">Beta · Бесплатно для старта</Badge>,
    title: "Деплой без боли.",
    content: "Публикуйте проекты за секунды. Автоматический CI/CD, превью-деплои и глобальная edge-сеть — всё включено.",
    showButton: true,
    buttonText: 'Начать бесплатно'
  },
  {
    id: 'about',
    title: 'Скорость — это функция.',
    content: 'Каждый деплой занимает меньше минуты. Ваш код от коммита до продакшна проходит автоматически: сборка, тесты, публикация.',
    features: [
      { icon: 'Zap', label: 'Деплой за 30 сек' },
      { icon: 'GitBranch', label: 'Git-интеграция' },
      { icon: 'Globe', label: 'Edge-сеть из 40+ регионов' },
    ]
  },
  {
    id: 'features',
    title: 'Всё что нужно — уже внутри.',
    content: 'Никаких сторонних сервисов. HTTPS, CDN, превью для каждой ветки, аналитика и логи — в одной платформе.',
    features: [
      { icon: 'Lock', label: 'HTTPS автоматически' },
      { icon: 'Eye', label: 'Preview-деплои для PR' },
      { icon: 'BarChart2', label: 'Встроенная аналитика' },
      { icon: 'Terminal', label: 'Realtime логи' },
    ]
  },
  {
    id: 'testimonials',
    title: 'Уже доверяют тысячи команд.',
    content: '"Перешли с AWS за час. Деплоим 20 раз в день — ни одного сбоя." — команда из 5 разработчиков, SaaS-стартап.',
    features: [
      { icon: 'Users', label: '12 000+ команд' },
      { icon: 'TrendingUp', label: '99.99% uptime' },
      { icon: 'HeartHandshake', label: 'Поддержка 24/7' },
    ]
  },
  {
    id: 'join',
    title: 'Запустите первый проект сейчас.',
    content: 'Бесплатный план навсегда. Никаких кредитных карт. Оставьте email — пришлём доступ в числе первых.',
    showEmailForm: true,
  },
]