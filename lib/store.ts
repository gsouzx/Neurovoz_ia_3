import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ---- Types ----

export type SupportLevel = 1 | 2 | 3

export interface Guardian {
  id: string
  name: string
  email: string
  phone: string
}

export interface Child {
  id: string
  name: string
  age: number
  gender: 'masculino' | 'feminino' | 'outro'
  supportLevel: SupportLevel
  diagnosis: string
  hyperfocuses: string[]
  sensorySensitivities: string[]
  favoriteFoods: string[]
  rejectedFoods: string[]
  favoriteObjects: string[]
  favoriteCharacters: string[]
  frequentEmotions: string[]
  crisisTriggers: string[]
  developmentGoals: string[]
  avatarEmoji: string
}

export type EmotionType = 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious' | 'excited'

export interface DailyMood {
  date: string
  emotion: EmotionType
  note?: string
}

export interface Goal {
  id: string
  title: string
  category: string
  completed: boolean
  weekOf: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  emotionDetected?: EmotionType
}

export interface RoutineItem {
  id: string
  time: string
  activity: string
  icon: string
  completed: boolean
  category: 'escola' | 'terapia' | 'higiene' | 'alimentacao' | 'lazer' | 'sono'
}

// ---- App Store ----

interface AppState {
  // Auth
  isAuthenticated: boolean
  guardian: Guardian | null
  child: Child | null
  onboardingStep: number
  onboardingComplete: boolean

  // Dashboard
  todayMood: EmotionType | null
  goals: Goal[]
  routine: RoutineItem[]
  messages: Message[]
  geminiApiKey: string

  // Actions
  setGuardian: (guardian: Guardian) => void
  setChild: (child: Partial<Child>) => void
  setOnboardingStep: (step: number) => void
  completeOnboarding: () => void
  setTodayMood: (emotion: EmotionType) => void
  setGeminiApiKey: (key: string) => void
  clearMessages: () => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  toggleGoal: (goalId: string) => void
  toggleRoutineItem: (itemId: string) => void
  login: () => void
  logout: () => void
}

// ---- Default Data ----

const defaultRoutine: RoutineItem[] = [
  { id: '1', time: '07:00', activity: 'Acordar e higiene matinal', icon: '🌅', completed: false, category: 'higiene' },
  { id: '2', time: '07:30', activity: 'Café da manhã', icon: '🥞', completed: false, category: 'alimentacao' },
  { id: '3', time: '08:00', activity: 'Escola', icon: '🎒', completed: false, category: 'escola' },
  { id: '4', time: '12:00', activity: 'Almoço', icon: '🍽️', completed: false, category: 'alimentacao' },
  { id: '5', time: '13:00', activity: 'Descanso', icon: '😴', completed: false, category: 'lazer' },
  { id: '6', time: '15:00', activity: 'Terapia ABA', icon: '🧠', completed: false, category: 'terapia' },
  { id: '7', time: '17:00', activity: 'Atividade favorita', icon: '⭐', completed: false, category: 'lazer' },
  { id: '8', time: '19:00', activity: 'Jantar', icon: '🍜', completed: false, category: 'alimentacao' },
  { id: '9', time: '20:00', activity: 'Banho', icon: '🛁', completed: false, category: 'higiene' },
  { id: '10', time: '21:00', activity: 'Dormir', icon: '🌙', completed: false, category: 'sono' },
]

const defaultGoals: Goal[] = [
  { id: '1', title: 'Escovar os dentes sozinho', category: 'Higiene', completed: false, weekOf: new Date().toISOString() },
  { id: '2', title: 'Organizar brinquedos após brincar', category: 'Autonomia', completed: false, weekOf: new Date().toISOString() },
  { id: '3', title: 'Cumprimentar pessoas conhecidas', category: 'Social', completed: true, weekOf: new Date().toISOString() },
  { id: '4', title: 'Pedir ajuda quando precisar', category: 'Comunicação', completed: false, weekOf: new Date().toISOString() },
  { id: '5', title: 'Participar da aula de Educação Física', category: 'Escola', completed: true, weekOf: new Date().toISOString() },
]

const defaultChild: Child = {
  id: 'child-1',
  name: 'Pedro',
  age: 9,
  gender: 'masculino',
  supportLevel: 2,
  diagnosis: 'Transtorno do Espectro Autista (TEA)',
  hyperfocuses: ['Dinossauros', 'Trens', 'Minecraft'],
  sensorySensitivities: ['Sons altos', 'Texturas ásperas', 'Luzes fortes'],
  favoriteFoods: ['Pizza', 'Macarrão', 'Frango'],
  rejectedFoods: ['Salada', 'Peixe', 'Legumes'],
  favoriteObjects: ['Lego', 'Tablet', 'Boneco T-Rex'],
  favoriteCharacters: ['Sonic', 'Mario', 'Rex do Toy Story'],
  frequentEmotions: ['Ansiedade', 'Alegria', 'Frustração'],
  crisisTriggers: ['Mudanças de rotina', 'Ambientes barulhentos', 'Esperar muito tempo'],
  developmentGoals: ['Comunicação', 'Autonomia', 'Controle emocional'],
  avatarEmoji: '🦖',
}

// ---- Store ----

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      guardian: null,
      child: defaultChild,
      onboardingStep: 0,
      onboardingComplete: false,
      todayMood: null,
      goals: defaultGoals,
      routine: defaultRoutine,
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: `Olá, Pedro! 😊 Que bom te ver por aqui! Como você está se sentindo hoje? Lembre-se que estou aqui para conversar, brincar e te ajudar no que precisar. O que você gostaria de fazer?`,
          timestamp: new Date(),
        },
      ],
      geminiApiKey: '',

      setGuardian: (guardian) => set({ guardian }),
      setChild: (child) => set((state) => ({ child: state.child ? { ...state.child, ...child } as Child : null })),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingComplete: true, isAuthenticated: true }),
      setTodayMood: (emotion) => set({ todayMood: emotion }),
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      clearMessages: () => set((state) => ({
        messages: [
          {
            id: 'welcome-' + Date.now(),
            role: 'assistant',
            content: `Olá, ${state.child?.name || 'Pedro'}! 😊 Que bom te ver por aqui! Como você está se sentindo hoje? Lembre-se que estou aqui para conversar, brincar e te ajudar no que precisar. O que você gostaria de fazer?`,
            timestamp: new Date(),
          }
        ]
      })),

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
          ],
        })),

      toggleGoal: (goalId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, completed: !g.completed } : g
          ),
        })),

      toggleRoutineItem: (itemId) =>
        set((state) => ({
          routine: state.routine.map((r) =>
            r.id === itemId ? { ...r, completed: !r.completed } : r
          ),
        })),

      login: () => set({ isAuthenticated: true }),
      logout: () =>
        set({
          isAuthenticated: false,
          guardian: null,
          onboardingComplete: false,
          onboardingStep: 0,
        }),
    }),
    {
      name: 'neurovoz-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        guardian: state.guardian,
        child: state.child,
        onboardingComplete: state.onboardingComplete,
        todayMood: state.todayMood,
        goals: state.goals,
        routine: state.routine,
        messages: state.messages,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
)
