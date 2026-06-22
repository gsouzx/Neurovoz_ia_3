'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  MessageCircle,
  Heart,
  Shield,
  Handshake,
  Clock,
  ChevronRight,
  Star,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  X,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

const SOCIAL_MODULES = [
  {
    id: 'cumprimentar',
    icon: '👋',
    title: 'Como cumprimentar',
    description: 'Aprenda formas de saudação em diferentes situações',
    category: 'Comunicação',
    color: '#3AB7D6',
    difficulty: 'Fácil',
    duration: '5 min',
    steps: [
      { emoji: '😊', text: 'Olhe para a pessoa com gentileza' },
      { emoji: '👋', text: 'Diga "Oi!" ou "Olá!" com voz clara' },
      { emoji: '🙂', text: 'Sorria brevemente se estiver confortável' },
      { emoji: '✅', text: 'Está ótimo! Você cumprimentou!' },
    ],
  },
  {
    id: 'espaco-pessoal',
    icon: '↔️',
    title: 'Espaço pessoal',
    description: 'Entenda o espaço pessoal de cada pessoa',
    category: 'Habilidades',
    color: '#8B6FE8',
    difficulty: 'Médio',
    duration: '7 min',
    steps: [
      { emoji: '🧍', text: 'Cada pessoa tem uma "bolha" ao redor' },
      { emoji: '↔️', text: 'Mantenha pelo menos um braço de distância' },
      { emoji: '🛑', text: 'Se a pessoa recuar, dê um passo para trás' },
      { emoji: '✅', text: 'Respeitando o espaço, todos se sentem bem!' },
    ],
  },
  {
    id: 'vez-de-falar',
    icon: '🗣️',
    title: 'Esperar a vez',
    description: 'Pratique conversas com revezamento natural',
    category: 'Comunicação',
    color: '#4ADE80',
    difficulty: 'Médio',
    duration: '6 min',
    steps: [
      { emoji: '👂', text: 'Ouça a pessoa terminar de falar' },
      { emoji: '⏸️', text: 'Espere um pequeno silêncio' },
      { emoji: '🗣️', text: 'Fale o que você pensa ou sente' },
      { emoji: '✅', text: 'Revezar é respeitar e ser respeitado!' },
    ],
  },
  {
    id: 'locais-publicos',
    icon: '🏪',
    title: 'Lugares públicos',
    description: 'Como agir em supermercados, ônibus e parques',
    category: 'Autonomia',
    color: '#FB923C',
    difficulty: 'Difícil',
    duration: '10 min',
    steps: [
      { emoji: '🤫', text: 'Fale em voz baixa em lugares fechados' },
      { emoji: '🚶', text: 'Caminhe sem correr ou empurrar' },
      { emoji: '🧍‍♂️', text: 'Aguarde na fila pacientemente' },
      { emoji: '✅', text: 'Você está pronto para o mundo!' },
    ],
  },
  {
    id: 'emocoes',
    icon: '😊',
    title: 'Identificar emoções',
    description: 'Reconheça sentimentos em rostos e situações',
    category: 'Emocional',
    color: '#F472B6',
    difficulty: 'Fácil',
    duration: '5 min',
    steps: [
      { emoji: '😊', text: 'Sorriso = Alegria ou satisfação' },
      { emoji: '😢', text: 'Olhos úmidos = Tristeza ou emoção' },
      { emoji: '😡', text: 'Sobrancelhas franzidas = Raiva ou frustração' },
      { emoji: '😰', text: 'Respiração rápida = Ansiedade ou medo' },
    ],
  },
  {
    id: 'amizades',
    icon: '🤝',
    title: 'Fazer amizades',
    description: 'Dicas práticas para iniciar novas amizades',
    category: 'Social',
    color: '#FBBF24',
    difficulty: 'Difícil',
    duration: '8 min',
    steps: [
      { emoji: '👋', text: 'Apresente-se: "Oi, meu nome é..."' },
      { emoji: '❓', text: 'Faça uma pergunta sobre algo em comum' },
      { emoji: '🎮', text: 'Convide para uma atividade que vocês gostam' },
      { emoji: '✅', text: 'Amizade começa com um simples olá!' },
    ],
  },
]

const QUIZ_EMOTIONS = [
  { emoji: '😊', label: 'Feliz', scenario: 'Recebeu um presente favorito', correct: true },
  { emoji: '😢', label: 'Triste', scenario: 'Perdeu o brinquedo favorito', correct: false },
  { emoji: '😡', label: 'Com raiva', scenario: 'Alguém pegou a vez dele', correct: false },
  { emoji: '😰', label: 'Ansioso', scenario: 'Primeiro dia de escola', correct: false },
]

type View = 'modules' | 'lesson' | 'quiz'

export default function SocialPage() {
  const { child } = useAppStore()
  const [view, setView] = useState<View>('modules')
  const [activeLesson, setActiveLesson] = useState<typeof SOCIAL_MODULES[0] | null>(null)
  const [lessonStep, setLessonStep] = useState(0)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  const openLesson = (module: typeof SOCIAL_MODULES[0]) => {
    setActiveLesson(module)
    setLessonStep(0)
    setView('lesson')
  }

  const nextStep = () => {
    if (!activeLesson) return
    if (lessonStep < activeLesson.steps.length - 1) {
      setLessonStep((s) => s + 1)
    } else {
      // Complete
      setCompletedModules((c) => [...c, activeLesson.id])
      setView('modules')
      setActiveLesson(null)
      setLessonStep(0)
    }
  }

  const categories = [...new Set(SOCIAL_MODULES.map((m) => m.category))]
  const filteredModules = filter ? SOCIAL_MODULES.filter((m) => m.category === filter) : SOCIAL_MODULES

  const DIFFICULTY_COLORS = { Fácil: '#4ADE80', Médio: '#FBBF24', Difícil: '#F87171' }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ---- MODULES VIEW ---- */}
      {view === 'modules' && (
        <>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display text-2xl font-black text-neurovoz-dark">Módulo Social</h1>
                <p className="text-neurovoz-dark/50 text-sm mt-1">
                  Aprenda habilidades sociais com histórias e exemplos interativos
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl float-animation"
                style={{ background: 'linear-gradient(135deg, rgba(58,183,214,0.15), rgba(132,215,200,0.15))' }}
              >
                🤝
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(58,183,214,0.1)', color: '#3AB7D6' }}
              >
                <Star size={14} />
                {completedModules.length}/{SOCIAL_MODULES.length} módulos completos
              </div>
              <div className="flex-1 progress-neurovoz h-2">
                <motion.div
                  className="progress-fill h-full"
                  animate={{ width: `${(completedModules.length / SOCIAL_MODULES.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Categories filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter(null)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: filter === null ? 'linear-gradient(135deg, #3AB7D6, #84D7C8)' : 'rgba(245,247,248,0.8)',
                color: filter === null ? 'white' : '#9BBDD4',
              }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(filter === cat ? null : cat)}
                className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: filter === cat ? 'rgba(58,183,214,0.15)' : 'rgba(245,247,248,0.8)',
                  color: filter === cat ? '#3AB7D6' : '#9BBDD4',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Module Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredModules.map((module, i) => {
                const isCompleted = completedModules.includes(module.id)
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -4 }}
                    className="glass-card p-5 cursor-pointer relative overflow-hidden"
                    onClick={() => openLesson(module)}
                  >
                    {isCompleted && (
                      <div
                        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #4ADE80, #3AB7D6)' }}
                      >
                        <CheckCircle2 size={14} color="white" />
                      </div>
                    )}
                    <div className="text-4xl mb-3">{module.icon}</div>
                    <h3 className="font-display font-bold text-neurovoz-dark text-base mb-1">{module.title}</h3>
                    <p className="text-neurovoz-dark/50 text-xs leading-relaxed mb-3">{module.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${module.color}12`, color: module.color }}
                      >
                        {module.category}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${DIFFICULTY_COLORS[module.difficulty as keyof typeof DIFFICULTY_COLORS]}12`,
                          color: DIFFICULTY_COLORS[module.difficulty as keyof typeof DIFFICULTY_COLORS],
                        }}
                      >
                        {module.difficulty}
                      </span>
                      <span className="text-xs text-neurovoz-dark/40 flex items-center gap-1 ml-auto">
                        <Clock size={11} />
                        {module.duration}
                      </span>
                    </div>
                    <button
                      className="mt-4 w-full py-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}99)` }}
                    >
                      <PlayCircle size={16} />
                      {isCompleted ? 'Revisar' : 'Iniciar'}
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {/* Quiz CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 flex items-center justify-between cursor-pointer hover:shadow-card-hover transition-all"
            onClick={() => setView('quiz')}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(244,114,182,0.15))' }}
              >
                🧩
              </div>
              <div>
                <h3 className="font-display font-bold text-neurovoz-dark">Quiz de Emoções</h3>
                <p className="text-neurovoz-dark/50 text-sm">Identifique emoções em situações do dia a dia</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-neurovoz-dark/30" />
          </motion.div>
        </>
      )}

      {/* ---- LESSON VIEW ---- */}
      {view === 'lesson' && activeLesson && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          {/* Lesson Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setView('modules')}
              className="p-2 rounded-xl hover:bg-white/80 transition-colors"
            >
              <X size={20} className="text-neurovoz-dark/60" />
            </button>
            <div className="flex gap-1">
              {activeLesson.steps.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === lessonStep ? 24 : 8,
                    background: i <= lessonStep ? activeLesson.color : 'rgba(200,210,220,0.5)',
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-neurovoz-dark/40">{lessonStep + 1}/{activeLesson.steps.length}</span>
          </div>

          <div className="glass-card p-8 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={lessonStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div
                  className="text-8xl float-animation"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {activeLesson.steps[lessonStep].emoji}
                </motion.div>
                <h2 className="font-display text-2xl font-black text-neurovoz-dark">
                  {activeLesson.steps[lessonStep].text}
                </h2>
                {lessonStep === activeLesson.steps.length - 1 && (
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: `${activeLesson.color}15`, color: activeLesson.color }}
                  >
                    <CheckCircle2 size={16} />
                    Você aprendeu!
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => lessonStep > 0 ? setLessonStep(s => s - 1) : setView('modules')}
              className="btn-secondary flex-1"
            >
              Voltar
            </button>
            <button
              onClick={nextStep}
              className="btn-primary flex-1"
              style={{ background: `linear-gradient(135deg, ${activeLesson.color}, ${activeLesson.color}bb)` }}
            >
              {lessonStep === activeLesson.steps.length - 1 ? (
                <><CheckCircle2 size={18} /> Concluir</>
              ) : (
                <>Próximo <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* ---- QUIZ VIEW ---- */}
      {view === 'quiz' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setView('modules')} className="p-2 rounded-xl hover:bg-white/80">
              <X size={20} className="text-neurovoz-dark/60" />
            </button>
            <h2 className="font-display font-bold text-xl text-neurovoz-dark">Quiz de Emoções</h2>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="text-6xl mb-4">🎭</div>
            <p className="font-semibold text-neurovoz-dark mb-2">
              João ganhou um presente que sempre quis de aniversário.
            </p>
            <p className="text-neurovoz-dark/50 text-sm mb-8">Como ele está se sentindo?</p>

            <div className="grid grid-cols-2 gap-3">
              {QUIZ_EMOTIONS.map((emotion) => (
                <motion.button
                  key={emotion.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuizAnswer(emotion.label)}
                  className={`p-5 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${
                    quizAnswer === emotion.label
                      ? emotion.correct
                        ? 'border-green-400 bg-green-50'
                        : 'border-red-400 bg-red-50'
                      : 'border-transparent'
                  }`}
                  style={{ background: quizAnswer === emotion.label ? undefined : 'rgba(245,247,248,0.8)' }}
                >
                  <span className="text-4xl">{emotion.emoji}</span>
                  <span className="text-sm font-semibold text-neurovoz-dark">{emotion.label}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {quizAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl text-center"
                  style={{
                    background: QUIZ_EMOTIONS.find((e) => e.label === quizAnswer)?.correct ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                    border: `1px solid ${QUIZ_EMOTIONS.find((e) => e.label === quizAnswer)?.correct ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  }}
                >
                  {QUIZ_EMOTIONS.find((e) => e.label === quizAnswer)?.correct ? (
                    <p className="text-green-600 font-semibold">🎉 Correto! João está Feliz!</p>
                  ) : (
                    <p className="text-red-500 font-semibold">Quase! A resposta é Feliz 😊</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {quizAnswer && (
            <button
              onClick={() => { setQuizAnswer(null); setView('modules') }}
              className="btn-primary w-full mt-4"
            >
              Voltar aos módulos
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
