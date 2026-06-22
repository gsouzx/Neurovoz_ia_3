'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Phone,
  X,
  CheckCircle2,
  Wind,
  Eye,
  Hand,
  Home,
  Music,
  Heart,
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { SOS_STRATEGIES } from '@/lib/ai'

type SOSPhase = 'idle' | 'active' | 'breathing' | 'strategy' | 'resolved'

const BREATHING_STEPS = [
  { label: 'Inspire', duration: 4, color: '#3AB7D6', scale: 1.4 },
  { label: 'Segure', duration: 4, color: '#84D7C8', scale: 1.4 },
  { label: 'Expire', duration: 6, color: '#BEE8FF', scale: 1.0 },
  { label: 'Pause', duration: 2, color: '#F5F7F8', scale: 1.0 },
]

const STRATEGY_ICONS: Record<string, React.ElementType> = {
  '1': Wind,
  '2': Eye,
  '3': Hand,
  '4': Home,
  '5': Music,
}

export default function SOSPage() {
  const { child } = useAppStore()
  const [phase, setPhase] = useState<SOSPhase>('idle')
  const [breathStep, setBreathStep] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [breathProgress, setBreathProgress] = useState(0)
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [elapsed, setElapsed] = useState(0)

  // Breathing cycle
  useEffect(() => {
    if (phase !== 'breathing') return
    const step = BREATHING_STEPS[breathStep]
    const totalMs = step.duration * 1000
    let startTime = Date.now()

    const interval = setInterval(() => {
      const progress = Math.min((Date.now() - startTime) / totalMs, 1)
      setBreathProgress(progress)

      if (progress >= 1) {
        const nextStep = (breathStep + 1) % BREATHING_STEPS.length
        if (nextStep === 0) setBreathCount((c) => c + 1)
        setBreathStep(nextStep)
        startTime = Date.now()
        setBreathProgress(0)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [phase, breathStep])

  // Elapsed timer when SOS is active
  useEffect(() => {
    if (phase === 'idle' || phase === 'resolved') return
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(interval)
  }, [phase])

  const activateSOS = useCallback(() => {
    setPhase('active')
    setElapsed(0)
    setBreathStep(0)
    setBreathCount(0)
    setBreathProgress(0)
  }, [])

  const startBreathing = useCallback(() => {
    setPhase('breathing')
  }, [])

  const goToStrategy = useCallback(() => {
    setPhase('strategy')
  }, [])

  const resolve = useCallback(() => {
    setPhase('resolved')
  }, [])

  const reset = useCallback(() => {
    setPhase('idle')
    setSelectedStrategy(null)
    setElapsed(0)
  }, [])

  const formatElapsed = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const currentBreathStep = BREATHING_STEPS[breathStep]

  return (
    <div className="max-w-3xl mx-auto">
      {/* ---- IDLE STATE ---- */}
      {phase === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex w-20 h-20 rounded-3xl items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #F87171, #FB923C)', boxShadow: '0 8px 32px rgba(248,113,113,0.4)' }}
            >
              <AlertTriangle size={36} color="white" />
            </motion.div>
            <h1 className="font-display text-3xl font-black text-neurovoz-dark mb-2">
              SOS Sensorial
            </h1>
            <p className="text-neurovoz-dark/60 max-w-md mx-auto">
              Em momentos de crise ou sobrecarga sensorial, pressione o botão SOS.
              A NeuroVoZ vai te ajudar a se acalmar com técnicas comprovadas.
            </p>
          </div>

          {/* Big SOS Button */}
          <div className="flex justify-center">
            <motion.button
              id="sos-activate-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={activateSOS}
              className="relative flex flex-col items-center justify-center w-48 h-48 rounded-full text-white font-black text-2xl cursor-pointer select-none"
              style={{
                background: 'linear-gradient(135deg, #F87171, #FB923C)',
                boxShadow: '0 0 0 0 rgba(248,113,113,0.4)',
              }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(248,113,113,0.4)',
                  '0 0 0 20px rgba(248,113,113,0)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle size={48} className="mb-2" />
              <span className="font-display text-3xl font-black">SOS</span>
              <span className="text-sm font-normal opacity-80 mt-1">Preciso de ajuda</span>
            </motion.button>
          </div>

          {/* Strategies preview */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg text-neurovoz-dark mb-4">
              Estratégias disponíveis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOS_STRATEGIES.map((strategy) => {
                const Icon = STRATEGY_ICONS[strategy.id] || Wind
                return (
                  <div
                    key={strategy.id}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(58,183,214,0.06)', border: '1px solid rgba(58,183,214,0.1)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(58,183,214,0.2), rgba(132,215,200,0.2))' }}
                    >
                      <Icon size={18} className="text-neurovoz-turquoise" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-neurovoz-dark">{strategy.title}</div>
                      <div className="text-xs text-neurovoz-dark/50 mt-0.5">{strategy.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Link href="/dashboard" className="btn-secondary flex items-center gap-2 w-fit">
            <ArrowLeft size={18} />
            Voltar ao dashboard
          </Link>
        </motion.div>
      )}

      {/* ---- ACTIVE SOS ---- */}
      <AnimatePresence>
        {(phase === 'active' || phase === 'breathing' || phase === 'strategy') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(10, 15, 25, 0.97)' }}
          >
            {/* Close button */}
            <button
              onClick={reset}
              className="absolute top-6 right-6 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={24} />
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="absolute top-6 left-6 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Timer */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-mono">
              {formatElapsed(elapsed)}
            </div>

            <div className="w-full max-w-md text-center">
              {/* ---- ACTIVE PHASE ---- */}
              {phase === 'active' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <motion.div
                      className="text-7xl mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🤗
                    </motion.div>
                    <h2 className="font-display text-3xl font-black text-white mb-3">
                      Você está seguro, {child?.name?.split(' ')[0] || 'amigo'}
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed">
                      Estou aqui com você. Vamos respirar juntos e tudo vai ficar bem.
                      Você é corajoso por pedir ajuda. 💙
                    </p>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startBreathing}
                      className="w-full py-5 rounded-2xl font-bold text-lg text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)', boxShadow: '0 8px 32px rgba(58,183,214,0.4)' }}
                    >
                      <Wind size={22} className="inline mr-2" />
                      Respiração guiada
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goToStrategy}
                      className="w-full py-4 rounded-2xl font-semibold text-white/70 border border-white/10 hover:border-white/20 transition-all"
                    >
                      Ver estratégias de calma
                    </motion.button>
                    <a
                      href="tel:+5511999999999"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-medium text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all"
                    >
                      <Phone size={18} />
                      Chamar responsável
                    </a>
                  </div>
                </motion.div>
              )}

              {/* ---- BREATHING PHASE ---- */}
              {phase === 'breathing' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-display text-2xl font-black text-white mb-2">
                      Respiração 4-7-8
                    </h2>
                    <p className="text-white/50 text-sm">Ciclo {breathCount + 1} • Siga o círculo</p>
                  </div>

                  {/* Breathing circle */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      {/* Outer rings */}
                      {[1, 2, 3].map((ring) => (
                        <motion.div
                          key={ring}
                          className="absolute inset-0 rounded-full border"
                          style={{ borderColor: `${currentBreathStep.color}${ring === 1 ? '30' : ring === 2 ? '15' : '08'}` }}
                          animate={{ scale: 1 + ring * 0.15 }}
                          transition={{ duration: currentBreathStep.duration, ease: 'linear' }}
                        />
                      ))}

                      {/* Main circle */}
                      <motion.div
                        className="w-48 h-48 rounded-full flex flex-col items-center justify-center cursor-pointer"
                        style={{
                          background: `radial-gradient(circle, ${currentBreathStep.color}60 0%, ${currentBreathStep.color}20 60%, transparent 100%)`,
                          boxShadow: `0 0 60px ${currentBreathStep.color}40`,
                        }}
                        animate={{ scale: currentBreathStep.scale }}
                        transition={{ duration: currentBreathStep.duration, ease: breathStep === 2 || breathStep === 3 ? 'easeIn' : 'easeOut' }}
                      >
                        <span className="font-display text-2xl font-black text-white">{currentBreathStep.label}</span>
                        <span className="text-white/60 text-sm mt-1">
                          {Math.ceil(currentBreathStep.duration * (1 - breathProgress))}s
                        </span>
                      </motion.div>

                      {/* Progress ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                        <circle cx="96" cy="96" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                        <motion.circle
                          cx="96" cy="96" r="90"
                          fill="none"
                          stroke={currentBreathStep.color}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 90}`}
                          strokeDashoffset={`${2 * Math.PI * 90 * (1 - breathProgress)}`}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Step indicators */}
                  <div className="flex justify-center gap-3">
                    {BREATHING_STEPS.map((step, i) => (
                      <div
                        key={step.label}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                          style={{
                            background: i === breathStep ? step.color : 'rgba(255,255,255,0.1)',
                            color: i === breathStep ? 'white' : 'rgba(255,255,255,0.3)',
                          }}
                        >
                          {step.duration}s
                        </div>
                        <span className="text-xs" style={{ color: i === breathStep ? step.color : 'rgba(255,255,255,0.2)' }}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPhase('active')}
                      className="flex-1 py-3 rounded-xl text-white/50 border border-white/10 hover:border-white/20 transition-all text-sm"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={resolve}
                      className="flex-1 py-3 rounded-xl font-semibold text-white transition-all text-sm"
                      style={{ background: 'linear-gradient(135deg, #4ADE80, #3AB7D6)' }}
                    >
                      <CheckCircle2 size={16} className="inline mr-1.5" />
                      Estou melhor!
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ---- STRATEGY PHASE ---- */}
              {phase === 'strategy' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 text-left"
                >
                  <div className="text-center">
                    <h2 className="font-display text-2xl font-black text-white mb-2">
                      Escolha uma estratégia
                    </h2>
                    <p className="text-white/50 text-sm">Qual parece melhor para você agora?</p>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
                    {SOS_STRATEGIES.map((strategy) => {
                      const Icon = STRATEGY_ICONS[strategy.id] || Wind
                      const isSelected = selectedStrategy === strategy.id
                      return (
                        <motion.button
                          key={strategy.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedStrategy(strategy.id)}
                          className="w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all"
                          style={{
                            background: isSelected ? 'rgba(58,183,214,0.2)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isSelected ? 'rgba(58,183,214,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          }}
                        >
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: isSelected ? '#3AB7D6' : 'rgba(255,255,255,0.1)' }}
                          >
                            <Icon size={20} color={isSelected ? 'white' : 'rgba(255,255,255,0.5)'} />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{strategy.title}</div>
                            <div className="text-white/50 text-xs mt-0.5">{strategy.description}</div>
                            <div className="text-white/30 text-xs mt-1">⏱ ~{strategy.duration}s</div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setPhase('active')}
                      className="flex-1 py-3 rounded-xl text-white/50 border border-white/10 text-sm"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={resolve}
                      className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
                      style={{ background: 'linear-gradient(135deg, #4ADE80, #3AB7D6)' }}
                    >
                      <CheckCircle2 size={16} className="inline mr-1.5" />
                      Estou melhor!
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- RESOLVED ---- */}
      {phase === 'resolved' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="text-7xl mb-4"
          >
            🎉
          </motion.div>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg, #4ADE80, #3AB7D6)' }}
          >
            <Heart size={36} color="white" />
          </div>
          <h2 className="font-display text-3xl font-black text-neurovoz-dark">
            Muito bem, {child?.name?.split(' ')[0] || 'você'}! 🌟
          </h2>
          <p className="text-neurovoz-dark/60 text-lg max-w-md mx-auto leading-relaxed">
            Você foi muito corajoso! Conseguiu se acalmar e isso é incrível.
            Estou muito orgulhoso de você. 💙
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ADE80' }}
          >
            <CheckCircle2 size={16} />
            Duração da crise: {formatElapsed(elapsed)} • Evento registrado
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <button onClick={reset} className="btn-secondary">
              Fechar
            </button>
            <Link href="/dashboard/chat" className="btn-primary">
              <span>Conversar com a IA</span>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
