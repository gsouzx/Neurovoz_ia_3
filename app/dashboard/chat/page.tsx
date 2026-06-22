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

export default function ChatPage() {
  const { child, messages, addMessage, clearMessages } = useAppStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionType | null>(null)
  const [showScrollDown, setShowScrollDown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
  }

  useEffect(() => {
    scrollToBottom(false)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100)
  }

  const handleSend = async (text?: string) => {
    const message = (text || input).trim()
    if (!message || isLoading) return

    setInput('')
    addMessage({ role: 'user', content: message })
    setIsLoading(true)
    setDetectedEmotion(null)

    try {
      const { content, emotionDetected } = await generateAIResponse(
        message,
        child!,
        messages.map((m) => ({ role: m.role, content: m.content }))
      )
      addMessage({ role: 'assistant', content, emotionDetected })
      if (emotionDetected) setDetectedEmotion(emotionDetected)
    } catch {
      addMessage({
        role: 'assistant',
        content: 'Desculpe, tive um probleminha para responder. Pode tentar novamente? 😊',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // In production: use Web Speech API / Whisper
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        setInput('Hoje estou me sentindo um pouco ansioso')
      }, 2500)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
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
          {/* Detected emotion badge */}
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

          <button
            className="p-2 rounded-xl hover:bg-neurovoz-gray transition-colors"
            title="Informações da IA"
          >
            <Info size={18} className="text-neurovoz-dark/40" />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Deseja mesmo limpar todo o histórico de conversa?")) {
                clearMessages()
              }
            }}
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

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 space-y-1"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-end gap-2 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
                  >
                    <Brain size={14} color="white" />
                  </div>
                )}
                {msg.role === 'user' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: 'rgba(58,183,214,0.15)', border: '2px solid rgba(58,183,214,0.3)' }}
                  >
                    {child?.avatarEmoji || '👤'}
                  </div>
                )}

                <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {msg.role === 'assistant' ? (
                    <div className="bubble-ai">{msg.content}</div>
                  ) : (
                    <div className="bubble-user">{msg.content}</div>
                  )}
                  <span className="text-xs text-neurovoz-dark/30 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
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
                style={{
                  background: 'rgba(58,183,214,0.08)',
                  border: '1px solid rgba(58,183,214,0.2)',
                  color: '#3AB7D6',
                }}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(58,183,214,0.1)' }}>
          <div
            className="flex items-end gap-3 p-3 rounded-2xl transition-all"
            style={{
              background: 'rgba(245,247,248,0.8)',
              border: '1.5px solid rgba(58,183,214,0.2)',
            }}
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
              <button className="p-1.5 rounded-xl hover:bg-white/80 transition-colors">
                <Paperclip size={18} className="text-neurovoz-dark/40" />
              </button>
              <button className="p-1.5 rounded-xl hover:bg-white/80 transition-colors">
                <Image size={18} className="text-neurovoz-dark/40" />
              </button>

              {/* Voice button */}
              <motion.button
                id="voice-btn"
                whileTap={{ scale: 0.9 }}
                onClick={toggleVoice}
                className={`p-2 rounded-xl transition-all ${isListening ? 'text-white' : 'hover:bg-white/80'}`}
                style={{
                  background: isListening
                    ? 'linear-gradient(135deg, #F87171, #FB923C)'
                    : 'transparent',
                }}
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={isListening ? { duration: 1, repeat: Infinity } : {}}
              >
                {isListening ? (
                  <MicOff size={18} className="text-white" />
                ) : (
                  <Mic size={18} className="text-neurovoz-dark/40" />
                )}
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
                  background: input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #3AB7D6, #84D7C8)'
                    : 'rgba(155,189,212,0.3)',
                  boxShadow: input.trim() && !isLoading ? '0 4px 12px rgba(58,183,214,0.3)' : 'none',
                }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
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
