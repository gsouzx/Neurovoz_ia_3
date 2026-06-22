import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function getSupportLevelLabel(level: 1 | 2 | 3): string {
  const labels = {
    1: 'Nível 1 — Suporte Leve',
    2: 'Nível 2 — Suporte Moderado',
    3: 'Nível 3 — Suporte Intenso',
  }
  return labels[level]
}

export function getSupportLevelDescription(level: 1 | 2 | 3): string {
  const descriptions = {
    1: 'A pessoa tem boa comunicação verbal e precisa de suporte em situações sociais e flexibilidade.',
    2: 'A pessoa apresenta déficits mais notáveis na comunicação e requer suporte substancial.',
    3: 'A pessoa apresenta déficits severos e requer suporte muito intenso em todas as áreas.',
  }
  return descriptions[level]
}

export const EMOTION_COLORS: Record<string, string> = {
  happy: '#FBBF24',
  neutral: '#9BBDD4',
  sad: '#60A5FA',
  angry: '#F87171',
  anxious: '#C084FC',
  excited: '#34D399',
}

export const WEEKDAYS = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb',
]

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
