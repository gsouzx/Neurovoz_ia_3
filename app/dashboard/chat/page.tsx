'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Brain,
  Sparkles,
  RefreshCw,
  Info,
  Smile,
  Image,
  Paperclip,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  PhoneOff,
} from 'lucide-react'
import { useAppStore, EmotionType } from '@/lib/store'
import { generateAIResponse } from '@/lib/ai'
import { formatTime } from '@/lib/utils'

const QUICK_REPLIES = [
  'Hoje estou feliz! 😊',
  'Quero aprender algo novo',
  'Me conta sobre dinossauros',
  'Estou com ansiedade 😰',
  'Quero fazer uma atividade',
  'Me conta uma história',
]

const EMOTION_INDICATORS: Record<EmotionType, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: 'Feliz', color: '#FBBF24' },
  neutral: { emoji: '😐', label: 'Neutro', color: '#9BBDD4' },
  sad: { emoji: '😢', label: 'Triste', color: '#60A5FA' },
  angry: { emoji: '😡', label: 'Com raiva', color: '#F87171' },
  anxious: { emoji: '😰', label: 'Ansioso', color: '#C084FC' },
  excited: { emoji: '🤩', label: 'Animado', color: '#34D399' },
}

const VOICES = [
  { name: 'Breeze', subtitle: 'Ana', type: 'free' as const, emoji: '🌬️', description: 'Voz suave e calma', preview: '/audio/previews/breeze-preview.mp3' },
  { name: 'Cove', subtitle: 'Carlos', type: 'free' as const, emoji: '🌊', description: 'Voz tranquila e amigável', preview: '/audio/previews/cove-preview.mp3' },
  { name: 'Herói das Sombras', subtitle: 'Thor', type: 'premium' as const, emoji: '🦸', description: 'Voz épica e poderosa', preview: '/audio/previews/hero-preview.mp3' },
  { name: 'Guerreiro de Cabelo Azul', subtitle: 'Kai', type: 'premium' as const, emoji: '⚔️', description: 'Voz intensa e aventureira', preview: '/audio/previews/warrior-preview.mp3' },
]

const FREE_VOICES = VOICES.filter((v) => v.type === 'free')

// ─── Wave Visualizer ───────────────────────────────────────────────────────────

function VoiceWave({ phase }: { phase: 'listening' | 'speaking' }) {
  const SIDE = 30

  const barProps = (distFromCenter: number) => {
    const maxH = Math.max(8, 108 - distFromCenter * 3.2)
    const speed = phase === 'speaking'
      ? 0.38 + (distFromCenter % 6) * 0.055
      : 1.9 + (distFromCenter % 5) * 0.22
    const delay = distFromCenter * 0.038
    const alpha = Math.max(0.12, 1 - (distFromCenter / SIDE) * 0.72)
    return { maxH, speed, delay, alpha }
  }

  return (
    <div className="flex items-center justify-center w-full px-6 select-none">
      {/* Left bars — flex-row-reverse puts i=0 (tallest) closest to orb */}
      <div className="flex items-center gap-[2.5px] flex-row-reverse">
        {Array.from({ length: SIDE }).map((_, i) => {
          const { maxH, speed, delay, alpha } = barProps(i)
          return (
            <motion.div
              key={`L${i}`}
              className="rounded-full flex-shrink-0"
              style={{ width: 3, background: `rgba(58,183,214,${alpha})` }}
              animate={{ height: [maxH * 0.1, maxH, maxH * 0.1], opacity: [alpha * 0.35, alpha, alpha * 0.35] }}
              transition={{ duration: speed, repeat: Infinity, delay, ease: 'easeInOut' }}
            />
          )
        })}
      </div>

      {/* Central orb */}
      <div className="relative mx-3 flex-shrink-0" style={{ width: 120, height: 120 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: '1px solid rgba(58,183,214,0.35)' }}
            animate={{ scale: [1, 2.4 + i * 0.55], opacity: [0.55, 0] }}
            transition={{
              duration: phase === 'speaking' ? 0.85 + i * 0.18 : 2.4 + i * 0.5,
              repeat: Infinity,
              delay: i * (phase === 'speaking' ? 0.26 : 0.72),
              ease: 'easeOut',
            }}
          />
        ))}
        {/* Sphere body */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 38% 32%, rgba(190,238,248,0.95), rgba(58,183,214,0.88) 38%, rgba(16,54,110,0.94) 74%)',
            boxShadow: '0 0 55px rgba(58,183,214,0.75), 0 0 110px rgba(58,183,214,0.32), inset 0 2px 24px rgba(255,255,255,0.18)',
          }}
        />
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{ top: '17%', left: '19%', width: '44%', height: '38%', background: 'radial-gradient(circle, rgba(255,255,255,0.48) 0%, transparent 68%)' }}
        />
      </div>

      {/* Right bars */}
      <div className="flex items-center gap-[2.5px]">
        {Array.from({ length: SIDE }).map((_, i) => {
          const { maxH, speed, delay, alpha } = barProps(i)
          return (
            <motion.div
              key={`R${i}`}
              className="rounded-full flex-shrink-0"
              style={{ width: 3, background: `rgba(132,215,200,${alpha})` }}
              animate={{ height: [maxH * 0.1, maxH, maxH * 0.1], opacity: [alpha * 0.35, alpha, alpha * 0.35] }}
              transition={{ duration: speed, repeat: Infinity, delay, ease: 'easeInOut' }}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
      >
        <Brain size={16} color="white" />
      </div>
      <div className="bubble-ai flex items-center gap-1 py-4 px-5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: '#3AB7D6' }}
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { child, messages, addMessage, clearMessages, isVoiceModeActive, setIsVoiceModeActive } = useAppStore()

  // Text chat state
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening] = useState(false)
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionType | null>(null)
  const [showScrollDown, setShowScrollDown] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [attachedPhoto, setAttachedPhoto] = useState<File | null>(null)

  // Voice carousel state (pre-session)
  const [isVoiceCarouselOpen, setIsVoiceCarouselOpen] = useState(false)
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0)

  // Voice session state
  const [voicePhase, setVoicePhase] = useState<'listening' | 'speaking'>('listening')
  const [sessionVoiceIndex, setSessionVoiceIndex] = useState(0)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevLoadingRef = useRef(false)

  const scrollToBottom = (smooth = true) =>
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })

  useEffect(() => { scrollToBottom(false) }, [])
  useEffect(() => { scrollToBottom() }, [messages, isLoading])

  useEffect(() => {
    if (prevLoadingRef.current && !isLoading) inputRef.current?.focus()
    prevLoadingRef.current = isLoading
  }, [isLoading])

  // Stop audio when voice mode ends
  useEffect(() => {
    if (!isVoiceModeActive && !isVoiceCarouselOpen) {
      audioRef.current?.pause()
    }
  }, [isVoiceModeActive, isVoiceCarouselOpen])

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100)
  }

  const handleSend = async (text?: string) => {
    const message = (text || input).trim()
    if (!message || isLoading) return
    setInput('')
    inputRef.current?.focus()
    addMessage({ role: 'user', content: message })
    setIsLoading(true)
    setDetectedEmotion(null)
    try {
      const { content, emotionDetected } = await generateAIResponse(
        message, child!,
        messages.map((m) => ({ role: m.role, content: m.content }))
      )
      addMessage({ role: 'assistant', content, emotionDetected })
      if (emotionDetected) setDetectedEmotion(emotionDetected)
    } catch {
      addMessage({ role: 'assistant', content: 'Desculpe, tive um probleminha para responder. Pode tentar novamente? 😊' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // ── Voice carousel helpers ──────────────────────────────────────────────────

  const playPreview = (index: number) => {
    audioRef.current?.pause()
    if (audioRef.current) { audioRef.current.currentTime = 0 }
    const voice = VOICES[index]
    if (voice.type === 'premium') return
    audioRef.current = new Audio(voice.preview)
    audioRef.current.play().catch(() => {})
  }

  const navigateCarousel = (dir: 'prev' | 'next') => {
    const next = dir === 'next'
      ? (selectedVoiceIndex + 1) % VOICES.length
      : (selectedVoiceIndex - 1 + VOICES.length) % VOICES.length
    setSelectedVoiceIndex(next)
    playPreview(next)
  }

  const openCarousel = () => {
    setSelectedVoiceIndex(0)
    setIsVoiceCarouselOpen(true)
    playPreview(0)
  }

  const closeCarousel = () => {
    audioRef.current?.pause()
    setIsVoiceCarouselOpen(false)
  }

  const handleStartVoiceChat = () => {
    const voice = VOICES[selectedVoiceIndex]
    if (voice.type === 'premium') return
    audioRef.current?.pause()
    setSessionVoiceIndex(FREE_VOICES.indexOf(voice))
    setIsVoiceCarouselOpen(false)
    setVoicePhase('listening')
    setIsVoiceModeActive(true)
  }

  const handleEndVoiceSession = () => {
    setIsVoiceModeActive(false)
    setVoicePhase('listening')
  }

  const switchSessionVoice = (idx: number) => setSessionVoiceIndex(idx)

  const selectedCarouselVoice = VOICES[selectedVoiceIndex]
  const isPremiumSelected = selectedCarouselVoice.type === 'premium'

  // ── Voice session full-screen UI ────────────────────────────────────────────

  if (isVoiceModeActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-30 flex flex-col items-center justify-between overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1628 55%, #0A1530 100%)' }}
      >
        {/* Top section */}
        <div className="flex flex-col items-center pt-16 pb-4 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white font-display font-black text-3xl md:text-4xl leading-tight mb-2"
          >
            Modo Conversação por Voz Real
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-white/40 text-sm"
          >
            NeuroVoZ e {FREE_VOICES[sessionVoiceIndex].subtitle}: Conversando em tempo real
          </motion.p>
        </div>

        {/* Wave visualization — fills available center space */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex items-center w-full"
        >
          <VoiceWave phase={voicePhase} />
        </motion.div>

        {/* Status text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/50 text-sm text-center px-6 mb-6"
        >
          Fale à vontade! Sua voz está sendo ouvida agora!{' '}
          <span className="text-red-400">Toque o SOS se precisar.</span>
        </motion.p>

        {/* Voice selector tabs (free voices only) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex rounded-2xl overflow-hidden mb-6 mx-auto"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {FREE_VOICES.map((voice, idx) => (
            <button
              key={voice.name}
              onClick={() => switchSessionVoice(idx)}
              className="flex flex-col items-center px-10 py-3 transition-all relative"
              style={{
                background: sessionVoiceIndex === idx ? 'rgba(58,183,214,0.15)' : 'transparent',
                color: sessionVoiceIndex === idx ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            >
              <span className="font-semibold text-sm">{voice.name}</span>
              <span className="text-xs mt-0.5 opacity-70">{voice.subtitle}</span>
              {sessionVoiceIndex === idx && (
                <motion.div
                  layoutId="voice-tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                  style={{ background: '#3AB7D6' }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Bottom controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4 mb-10"
        >
          {/* Mic / status pill */}
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-3"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Glowing mic button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setVoicePhase((p) => p === 'listening' ? 'speaking' : 'listening')}
              className="w-12 h-12 rounded-full flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)',
                boxShadow: '0 0 24px rgba(58,183,214,0.6)',
              }}
              animate={{ boxShadow: voicePhase === 'listening'
                ? ['0 0 16px rgba(58,183,214,0.5)', '0 0 32px rgba(58,183,214,0.9)', '0 0 16px rgba(58,183,214,0.5)']
                : '0 0 16px rgba(58,183,214,0.4)'
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Mic size={20} color="white" />
            </motion.button>

            <span className="text-white font-semibold text-sm">
              {voicePhase === 'listening' ? 'Escutando' : 'NeuroVoZ falando'}
            </span>

            <div className="w-px h-5 bg-white/20" />

            {/* Inline SOS */}
            <button
              className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(248,113,113,0.18)',
                color: '#F87171',
                border: '1px solid rgba(248,113,113,0.3)',
              }}
              onClick={() => window.location.href = '/dashboard/sos'}
            >
              SOS
            </button>
          </div>

          {/* End session button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEndVoiceSession}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{
              background: 'rgba(248,113,113,0.15)',
              border: '1px solid rgba(248,113,113,0.3)',
            }}
            title="Encerrar modo voz"
          >
            <PhoneOff size={18} className="text-red-400" />
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  // ── Normal chat UI ──────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.zip,.mp3,.mp4"
        onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
      />
      <input
        ref={photoInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => setAttachedPhoto(e.target.files?.[0] || null)}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)', boxShadow: '0 4px 16px rgba(58,183,214,0.3)' }}
          >
            <Brain size={22} color="white" strokeWidth={1.8} />
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-neurovoz-dark">NeuroVoZ I.A</h1>
            <div className="flex items-center gap-1.5 text-xs text-neurovoz-dark/50">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Online • Adaptado para {child?.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {detectedEmotion && EMOTION_INDICATORS[detectedEmotion] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: `${EMOTION_INDICATORS[detectedEmotion].color}15`,
                  color: EMOTION_INDICATORS[detectedEmotion].color,
                  border: `1px solid ${EMOTION_INDICATORS[detectedEmotion].color}30`,
                }}
              >
                {EMOTION_INDICATORS[detectedEmotion].emoji}
                {EMOTION_INDICATORS[detectedEmotion].label} detectado
              </motion.div>
            )}
          </AnimatePresence>

          <button className="p-2 rounded-xl hover:bg-neurovoz-gray transition-colors" title="Informações da IA">
            <Info size={18} className="text-neurovoz-dark/40" />
          </button>
          <button
            onClick={() => { if (window.confirm('Deseja mesmo limpar todo o histórico de conversa?')) clearMessages() }}
            className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
            title="Limpar conversa"
          >
            <RefreshCw size={18} />
          </button>
          <button className="p-2 rounded-xl hover:bg-neurovoz-gray transition-colors" title="Voz">
            <Volume2 size={18} className="text-neurovoz-dark/40" />
          </button>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="glass-card flex-1 flex flex-col overflow-hidden relative">
        {/* AI Context Bar */}
        <div
          className="px-4 py-2 border-b text-xs flex items-center gap-2 flex-wrap"
          style={{ borderColor: 'rgba(58,183,214,0.1)', background: 'rgba(190,232,255,0.15)' }}
        >
          <Sparkles size={12} className="text-neurovoz-turquoise" />
          <span className="text-neurovoz-dark/60">
            Personalizado para{' '}
            <strong className="text-neurovoz-turquoise">{child?.name}</strong>,{' '}
            Nível {child?.supportLevel} •
            Hiperfocos:{' '}
            <strong className="text-neurovoz-turquoise">
              {child?.hyperfocuses.slice(0, 2).join(', ')}
            </strong>
          </span>
        </div>

        {/* Voice Carousel Modal */}
        <AnimatePresence>
          {isVoiceCarouselOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center"
              style={{ background: 'rgba(10,15,30,0.97)', backdropFilter: 'blur(12px)' }}
            >
              <button
                onClick={closeCarousel}
                className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>

              <h2 className="text-white font-bold text-lg mb-1">Escolha uma Voz</h2>
              <p className="text-white/40 text-xs mb-8">Navegue e ouça o preview antes de iniciar</p>

              {/* Carousel */}
              <div className="flex items-center gap-6 mb-8">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigateCarousel('prev')}
                  className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all">
                  <ChevronLeft size={24} />
                </motion.button>

                <div className="relative w-56 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedVoiceIndex}
                      initial={{ opacity: 0, x: 40, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -40, scale: 0.9 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col items-center gap-3 text-center"
                    >
                      <div
                        className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl relative"
                        style={{
                          background: isPremiumSelected
                            ? 'linear-gradient(135deg, #7C3AED, #C084FC)'
                            : 'linear-gradient(135deg, #3AB7D6, #84D7C8)',
                          boxShadow: isPremiumSelected
                            ? '0 8px 32px rgba(124,58,237,0.4)'
                            : '0 8px 32px rgba(58,183,214,0.4)',
                        }}
                      >
                        {selectedCarouselVoice.emoji}
                        {isPremiumSelected && (
                          <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 rounded-full p-1">
                            <Lock size={10} className="text-yellow-900" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-base">{selectedCarouselVoice.name}</p>
                        <p className="text-white/50 text-xs mt-0.5">{selectedCarouselVoice.description}</p>
                        <span
                          className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: isPremiumSelected ? 'rgba(124,58,237,0.2)' : 'rgba(58,183,214,0.2)',
                            color: isPremiumSelected ? '#C084FC' : '#3AB7D6',
                          }}
                        >
                          {isPremiumSelected ? '⭐ Premium' : '✓ Grátis'}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigateCarousel('next')}
                  className="p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all">
                  <ChevronRight size={24} />
                </motion.button>
              </div>

              {/* Dots */}
              <div className="flex gap-2 mb-8">
                {VOICES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedVoiceIndex(i); playPreview(i) }}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: i === selectedVoiceIndex ? '#3AB7D6' : 'rgba(255,255,255,0.2)',
                      transform: i === selectedVoiceIndex ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>

              {/* Action button */}
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleStartVoiceChat}
                className="px-8 py-3.5 rounded-2xl font-bold text-white text-sm"
                style={{
                  background: isPremiumSelected
                    ? 'linear-gradient(135deg, #7C3AED, #C084FC)'
                    : 'linear-gradient(135deg, #3AB7D6, #84D7C8)',
                  boxShadow: isPremiumSelected
                    ? '0 8px 24px rgba(124,58,237,0.4)'
                    : '0 8px 24px rgba(58,183,214,0.35)',
                }}
              >
                {isPremiumSelected ? (
                  <span className="flex items-center gap-2"><Lock size={15} /> Desbloquear Voz por R$ 14,90/mês</span>
                ) : (
                  <span className="flex items-center gap-2"><Mic size={15} /> Iniciar Chat de Voz</span>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 space-y-1"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-end gap-2 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}>
                    <Brain size={14} color="white" />
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: 'rgba(58,183,214,0.15)', border: '2px solid rgba(58,183,214,0.3)' }}>
                    {child?.avatarEmoji || '👤'}
                  </div>
                )}
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {msg.role === 'assistant'
                    ? <div className="bubble-ai">{msg.content}</div>
                    : <div className="bubble-user">{msg.content}</div>
                  }
                  <span className="text-xs text-neurovoz-dark/30 px-1">{formatTime(msg.timestamp)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom */}
        <AnimatePresence>
          {showScrollDown && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollToBottom()}
              className="absolute bottom-24 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
            >
              <ChevronDown size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Quick Replies */}
        <div className="px-4 py-2 border-t overflow-x-auto no-scrollbar" style={{ borderColor: 'rgba(58,183,214,0.1)' }}>
          <div className="flex gap-2 min-w-max">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSend(reply)}
                disabled={isLoading}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: 'rgba(58,183,214,0.08)', border: '1px solid rgba(58,183,214,0.2)', color: '#3AB7D6' }}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Attached file/photo indicator */}
        <AnimatePresence>
          {(attachedFile || attachedPhoto) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="px-4 pt-2 flex gap-2 flex-wrap"
            >
              {attachedFile && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(58,183,214,0.1)', border: '1px solid rgba(58,183,214,0.2)', color: '#3AB7D6' }}>
                  <Paperclip size={12} />
                  {attachedFile.name}
                  <button onClick={() => setAttachedFile(null)} className="ml-1 opacity-60 hover:opacity-100"><X size={11} /></button>
                </div>
              )}
              {attachedPhoto && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(58,183,214,0.1)', border: '1px solid rgba(58,183,214,0.2)', color: '#3AB7D6' }}>
                  <Image size={12} />
                  {attachedPhoto.name}
                  <button onClick={() => setAttachedPhoto(null)} className="ml-1 opacity-60 hover:opacity-100"><X size={11} /></button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(58,183,214,0.1)' }}>
          <div
            className="flex items-end gap-3 p-3 rounded-2xl transition-all"
            style={{ background: 'rgba(245,247,248,0.8)', border: '1.5px solid rgba(58,183,214,0.2)' }}
          >
            <button className="p-1.5 rounded-xl hover:bg-white/80 transition-colors flex-shrink-0 mb-0.5">
              <Smile size={20} className="text-neurovoz-dark/40" />
            </button>

            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Escreva algo para o NeuroVoZ, ${child?.name?.split(' ')[0] || ''}...`}
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent outline-none text-sm text-neurovoz-dark placeholder:text-neurovoz-dark/30 max-h-32 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
              onInput={(e) => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = Math.min(el.scrollHeight, 128) + 'px'
              }}
            />

            <div className="flex items-center gap-1 flex-shrink-0 mb-0.5">
              <button onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-xl hover:bg-white/80 transition-colors" title="Anexar arquivo">
                <Paperclip size={18} className={attachedFile ? 'text-neurovoz-turquoise' : 'text-neurovoz-dark/40'} />
              </button>
              <button onClick={() => photoInputRef.current?.click()}
                className="p-1.5 rounded-xl hover:bg-white/80 transition-colors" title="Enviar foto">
                <Image size={18} className={attachedPhoto ? 'text-neurovoz-turquoise' : 'text-neurovoz-dark/40'} />
              </button>

              {/* Mic button — opens carousel */}
              <motion.button
                id="voice-btn"
                whileTap={{ scale: 0.9 }}
                onClick={openCarousel}
                className={`p-2 rounded-xl transition-all ${isListening ? 'text-white' : 'hover:bg-white/80'}`}
                style={{ background: isListening ? 'linear-gradient(135deg, #F87171, #FB923C)' : 'transparent' }}
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={isListening ? { duration: 1, repeat: Infinity } : {}}
              >
                {isListening
                  ? <MicOff size={18} className="text-white" />
                  : <Mic size={18} className="text-neurovoz-dark/40" />
                }
              </motion.button>

              {/* Send button */}
              <motion.button
                id="send-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40"
                style={{
                  background: input.trim() && !isLoading ? 'linear-gradient(135deg, #3AB7D6, #84D7C8)' : 'rgba(155,189,212,0.3)',
                  boxShadow: input.trim() && !isLoading ? '0 4px 12px rgba(58,183,214,0.3)' : 'none',
                }}
              >
                {isLoading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <Send size={16} />
                }
              </motion.button>
            </div>
          </div>

          <p className="text-center text-xs text-neurovoz-dark/25 mt-2">
            NeuroVoZ adapta respostas ao perfil de {child?.name} • Nível {child?.supportLevel}
          </p>
        </div>
      </div>
    </div>
  )
}
