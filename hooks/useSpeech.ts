'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

export type WaveMode = 'idle' | 'listening' | 'speaking'

interface UseSpeechOptions {
  lang?: string
  silenceTimeout?: number
  onTranscriptReady?: (text: string) => void
}

export interface UseSpeechReturn {
  startListening: () => Promise<void>
  stopListening: () => void
  speak: (text: string) => void
  cancelSpeech: () => void
  waveMode: WaveMode
  transcript: string
  isListening: boolean
  isSpeaking: boolean
  amplitude: number
  isSupported: boolean
}

export function useSpeech({
  lang = 'pt-BR',
  silenceTimeout = 1500,
  onTranscriptReady,
}: UseSpeechOptions = {}): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [waveMode, setWaveMode] = useState<WaveMode>('idle')
  const [transcript, setTranscript] = useState('')
  const [amplitude, setAmplitude] = useState(0)

  // Stable refs — used inside event callbacks to avoid stale closures
  const isListeningRef = useRef(false)
  const onTranscriptReadyRef = useRef(onTranscriptReady)
  onTranscriptReadyRef.current = onTranscriptReady

  // Speech recognition
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const accumulatedRef = useRef('')

  // AudioContext for real mic amplitude
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  // Pre-cached voices list
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  const isSupported =
    typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

  // Pre-load voices on mount so speak() always has them ready
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices() }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  // ── Audio amplitude analysis ──────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    analyserRef.current = null
    setAmplitude(0)
  }, [])

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioCtxRef.current = ctx

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser
      ctx.createMediaStreamSource(stream).connect(analyser)

      const data = new Uint8Array(analyser.frequencyBinCount)
      let lastUpdate = 0

      const tick = () => {
        const now = performance.now()
        if (now - lastUpdate >= 66) { // ~15 fps — avoids re-render storm
          analyser.getByteFrequencyData(data)
          const avg = data.reduce((s, v) => s + v, 0) / data.length
          setAmplitude(Math.min(1, avg / 70)) // ~70 = average speaking level
          lastUpdate = now
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      // Mic permission denied — amplitude stays 0, voice still works
    }
  }, [])

  // ── SpeechRecognition ─────────────────────────────────────────────────────

  const createRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return null

    const rec = new SR()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onresult = (e: any) => {
      // Interrupt AI speech as soon as user starts talking
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        setWaveMode('listening')
      }

      let finalText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' '
      }

      if (finalText.trim()) {
        accumulatedRef.current += finalText
        setTranscript(accumulatedRef.current.trim())
      }

      // Reset silence timer on every result
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        const text = accumulatedRef.current.trim()
        if (text) {
          onTranscriptReadyRef.current?.(text)
          accumulatedRef.current = ''
          setTranscript('')
        }
      }, silenceTimeout)
    }

    // Auto-restart to keep recognition alive (Chrome stops after ~60s or silence)
    rec.onend = () => {
      if (isListeningRef.current) {
        try { rec.start() } catch (_) {}
      }
    }

    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'audio-capture') {
        isListeningRef.current = false
        setIsListening(false)
        setWaveMode('idle')
        stopAudio()
      }
      // 'no-speech' and 'network' are recoverable via onend restart
    }

    return rec
  }, [lang, silenceTimeout, stopAudio])

  // ── Public API ────────────────────────────────────────────────────────────

  const startListening = useCallback(async () => {
    if (!isSupported) {
      console.warn('[useSpeech] SpeechRecognition not supported. Use Chrome or Edge.')
      return
    }

    // Cancel any ongoing synthesis
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    accumulatedRef.current = ''
    setTranscript('')
    isListeningRef.current = true
    setIsListening(true)
    setWaveMode('listening')

    startAudio() // non-blocking — amplitude is optional

    const rec = createRecognition()
    if (!rec) return
    recognitionRef.current = rec
    try { rec.start() } catch (_) {}
  }, [isSupported, startAudio, createRecognition])

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null }

    isListeningRef.current = false

    if (recognitionRef.current) {
      recognitionRef.current.onend = null // prevent auto-restart
      try { recognitionRef.current.stop() } catch (_) {}
      recognitionRef.current = null
    }

    stopAudio()
    setIsListening(false)
    setWaveMode('idle')
    setTranscript('')
    accumulatedRef.current = ''
  }, [stopAudio])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 1.0
    utterance.pitch = 1.0

    const ptVoices = voicesRef.current.filter((v) => v.lang === lang || v.lang.startsWith('pt'))
    const preferred =
      ptVoices.find((v) => v.name.toLowerCase().includes('google')) ||
      ptVoices.find((v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('feminina')) ||
      ptVoices[0] ||
      null
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => { setIsSpeaking(true); setWaveMode('speaking') }
    utterance.onend = () => { setIsSpeaking(false); setWaveMode(isListeningRef.current ? 'listening' : 'idle') }
    utterance.onerror = () => { setIsSpeaking(false); setWaveMode(isListeningRef.current ? 'listening' : 'idle') }

    window.speechSynthesis.speak(utterance)
  }, [lang])

  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setWaveMode(isListeningRef.current ? 'listening' : 'idle')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening()
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    }
  }, [stopListening])

  return { startListening, stopListening, speak, cancelSpeech, waveMode, transcript, isListening, isSpeaking, amplitude, isSupported }
}
