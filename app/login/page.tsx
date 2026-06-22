'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppStore()
  const [email, setEmail] = useState('demo@neurovoz.ia')
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate auth
    await new Promise((r) => setTimeout(r, 1200))

    if (email && password) {
      login()
      router.push('/dashboard')
    } else {
      setError('Por favor, preencha todos os campos.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f0faff 0%, #e8f8f5 100%)' }}>
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #1A2332 0%, #2E3D52 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #3AB7D6, transparent)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #84D7C8, transparent)' }} />
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center float-animation"
              style={{
                background: 'linear-gradient(135deg, #3AB7D6 0%, #84D7C8 100%)',
                boxShadow: '0 16px 48px rgba(58,183,214,0.4)',
              }}
            >
              <Brain size={48} color="white" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl font-black text-white mb-4"
          >
            Bem-vindo ao{' '}
            <span className="gradient-text">NeuroVoZ I.A</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 text-lg leading-relaxed mb-8"
          >
            "Compreender, apoiar e desenvolver,<br />
            respeitando cada forma única de ser."
          </motion.p>

          {/* Feature bullets */}
          {[
            '🧠 IA adaptativa e personalizada',
            '🎙️ Assistente por voz inteligente',
            '📊 Relatórios para pais e terapeutas',
            '🆘 Suporte em momentos de crise',
          ].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-3 text-left mb-3"
              style={{ background: 'rgba(58,183,214,0.1)', borderRadius: '12px', padding: '10px 16px' }}
            >
              <span className="text-sm text-white/80 font-medium">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
            >
              <Brain size={32} color="white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-black text-neurovoz-dark mb-2">
              Entrar na conta
            </h1>
            <p className="text-neurovoz-dark/50">
              Não tem conta?{' '}
              <Link href="/register" className="text-neurovoz-turquoise font-semibold hover:underline">
                Criar conta gratuita
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171' }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neurovoz-dark/70">E-mail</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="input-neurovoz pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neurovoz-dark/70">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-neurovoz pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30 hover:text-neurovoz-dark/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-neurovoz-turquoise hover:underline font-medium">
                Esqueci minha senha
              </a>
            </div>

            {/* Submit */}
            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                <>
                  <Sparkles size={18} />
                  Entrar
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div
            className="mt-6 p-4 rounded-xl text-center text-sm"
            style={{ background: 'rgba(58,183,214,0.08)', border: '1px solid rgba(58,183,214,0.2)' }}
          >
            <span className="text-neurovoz-turquoise font-semibold">💡 Demo:</span>
            <span className="text-neurovoz-dark/60 ml-2">
              Use <strong>demo@neurovoz.ia</strong> / <strong>demo123</strong>
            </span>
          </div>

          <p className="text-center text-xs text-neurovoz-dark/30 mt-6">
            Ao entrar, você concorda com os{' '}
            <a href="#" className="underline">Termos de Uso</a> e{' '}
            <a href="#" className="underline">Política de Privacidade</a>.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
