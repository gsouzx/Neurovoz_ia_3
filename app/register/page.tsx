'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()
  const { setGuardian } = useAppStore()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))

    setGuardian({
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
    })

    router.push('/onboarding')
    setLoading(false)
  }

  const passwordStrength = () => {
    if (!form.password) return 0
    let score = 0
    if (form.password.length >= 6) score++
    if (form.password.length >= 10) score++
    if (/[A-Z]/.test(form.password)) score++
    if (/[0-9]/.test(form.password)) score++
    if (/[^A-Za-z0-9]/.test(form.password)) score++
    return score
  }

  const strengthColors = ['', '#F87171', '#FB923C', '#FBBF24', '#4ADE80', '#3AB7D6']
  const strengthLabels = ['', 'Muito fraca', 'Fraca', 'Moderada', 'Boa', 'Forte']
  const strength = passwordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #f0faff 0%, #e8f8f5 100%)' }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
            >
              <Brain size={24} color="white" />
            </div>
            <span className="font-display font-black text-xl gradient-text">NeuroVoZ I.A</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-neurovoz-dark mb-2">
            Criar conta gratuita
          </h1>
          <p className="text-neurovoz-dark/50">
            Já tem conta?{' '}
            <Link href="/login" className="text-neurovoz-turquoise font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171' }}
              >
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neurovoz-dark/70">
                Nome completo <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30" />
                <input
                  id="full-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Seu nome completo"
                  className="input-neurovoz pl-11"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neurovoz-dark/70">
                E-mail <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30" />
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="seu@email.com"
                  className="input-neurovoz pl-11"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neurovoz-dark/70">Telefone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30" />
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="input-neurovoz pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neurovoz-dark/70">
                Senha <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="input-neurovoz pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30 hover:text-neurovoz-dark/60"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strength ? strengthColors[strength] : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neurovoz-dark/70">
                Confirmar senha <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neurovoz-dark/30" />
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Repita a senha"
                  className="input-neurovoz pl-11 pr-11"
                  required
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-register"
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-4 mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </div>
              ) : (
                <>
                  Criar conta e continuar
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neurovoz-dark/30 mt-4">
          Ao criar sua conta, você concorda com os{' '}
          <a href="#" className="underline">Termos de Uso</a> e{' '}
          <a href="#" className="underline">Política de Privacidade</a>.
        </p>
      </motion.div>
    </div>
  )
}
