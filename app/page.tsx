'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain,
  Heart,
  Mic,
  Shield,
  Star,
  MessageCircle,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react'

// ---- Animation Variants ----

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ---- Feature Cards Data ----

const features = [
  {
    icon: Brain,
    color: 'from-[#3AB7D6] to-[#84D7C8]',
    bg: 'rgba(58,183,214,0.08)',
    title: 'IA Adaptativa',
    description:
      'Aprende o perfil único de cada pessoa e adapta comunicação, linguagem e tom conforme o nível de suporte.',
  },
  {
    icon: Mic,
    color: 'from-[#8B6FE8] to-[#F472B6]',
    bg: 'rgba(139,111,232,0.08)',
    title: 'Assistente por Voz',
    description:
      'Modo Jarvis com voz humanizada, reconhecimento contínuo de fala e memória persistente entre sessões.',
  },
  {
    icon: Heart,
    color: 'from-[#FB923C] to-[#FBBF24]',
    bg: 'rgba(251,146,60,0.08)',
    title: 'Apoio Emocional',
    description:
      'Identifica emoções, sugere estratégias de regulação e ativa o Modo SOS em momentos de crise sensorial.',
  },
  {
    icon: BarChart3,
    color: 'from-[#4ADE80] to-[#3AB7D6]',
    bg: 'rgba(74,222,128,0.08)',
    title: 'Relatórios para Pais',
    description:
      'Dashboard completo com evolução semanal, comportamentos, progresso em habilidades e sugestões personalizadas.',
  },
  {
    icon: Users,
    color: 'from-[#F472B6] to-[#8B6FE8]',
    bg: 'rgba(244,114,182,0.08)',
    title: 'Módulo Social',
    description:
      'Ensina habilidades sociais com histórias interativas, simulações e exercícios gamificados e envolventes.',
  },
  {
    icon: Shield,
    color: 'from-[#F87171] to-[#FB923C]',
    bg: 'rgba(248,113,113,0.08)',
    title: 'SOS Sensorial',
    description:
      'Botão de emergência que acalma, guia a respiração, toca sons relaxantes e notifica responsáveis.',
  },
]

const benefits = [
  'IA personalizada para cada perfil único',
  'Assistente por voz estilo Jarvis',
  'Aprendizado contínuo com a rotina',
  'Relatórios semanais para pais e terapeutas',
  'Módulo de desenvolvimento de autonomia',
  'Ensino de habilidades sociais gamificado',
  'Identificação de padrões emocionais',
  'Memória inteligente contextual',
]

const stats = [
  { value: '98%', label: 'Satisfação das famílias' },
  { value: '5K+', label: 'Crianças apoiadas' },
  { value: '3x', label: 'Mais engajamento' },
  { value: '24/7', label: 'Disponível sempre' },
]

// ---- Floating Blob ----

function FloatingBlob({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{
        background: color,
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

// ---- NeuroVoz Logo ----

function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-2xl' },
    lg: { icon: 52, text: 'text-4xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative flex items-center justify-center rounded-2xl"
        style={{
          width: s.icon * 1.4,
          height: s.icon * 1.4,
          background: 'linear-gradient(135deg, #3AB7D6 0%, #84D7C8 100%)',
          boxShadow: '0 8px 24px rgba(58,183,214,0.4)',
        }}
      >
        <Brain color="white" size={s.icon * 0.6} strokeWidth={1.8} />
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neurovoz-green"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div>
        <span
          className={`font-display font-black ${s.text}`}
          style={{
            background: 'linear-gradient(135deg, #3AB7D6 0%, #84D7C8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          NeuroVoZ
        </span>
        <span className={`font-display font-black ${s.text} text-neurovoz-dark ml-1`}>
          I.A
        </span>
      </div>
    </div>
  )
}

// ---- Main Page ----

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ---- NAVBAR ---- */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/60 backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.85)' }}
      >
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neurovoz-dark/70">
          <a href="#features" className="hover:text-neurovoz-turquoise transition-colors">Funcionalidades</a>
          <a href="#como-funciona" className="hover:text-neurovoz-turquoise transition-colors">Como funciona</a>
          <a href="#beneficios" className="hover:text-neurovoz-turquoise transition-colors">Benefícios</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm px-4 py-2">
            Entrar
          </Link>
          <Link href="/register" className="btn-primary text-sm px-4 py-2">
            Começar grátis
          </Link>
        </div>
      </motion.nav>

      {/* ---- HERO ---- */}
      <section className="hero-bg min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
        {/* Floating blobs */}
        <FloatingBlob color="#3AB7D6" size={500} x="60%" y="-10%" delay={0} />
        <FloatingBlob color="#84D7C8" size={400} x="-5%" y="50%" delay={2} />
        <FloatingBlob color="#BEE8FF" size={300} x="40%" y="60%" delay={1} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="feature-tag">
              <Sparkles size={12} />
              Plataforma #1 em Neurodiversidade
            </span>
          </motion.div>

          {/* Logo central */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="flex justify-center mb-8"
          >
            <Logo size="lg" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="font-display text-5xl md:text-7xl font-black text-neurovoz-dark leading-tight mb-6"
          >
            Uma inteligência criada para{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #3AB7D6 0%, #84D7C8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              compreender
            </span>{' '}
            e{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #84D7C8 0%, #3AB7D6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              apoiar
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="text-xl md:text-2xl text-neurovoz-dark/60 max-w-3xl mx-auto mb-4 font-medium leading-relaxed"
          >
            Auxiliando pessoas autistas em seu desenvolvimento, comunicação,
            autonomia e integração social com IA empática e personalizada.
          </motion.p>

          {/* Slogan */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.45}
            className="text-base text-neurovoz-turquoise/80 font-semibold mb-10 italic"
          >
            "Compreender, apoiar e desenvolver, respeitando cada forma única de ser."
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              <Sparkles size={20} />
              Criar conta gratuita
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              Já tenho conta
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={0.6 + i * 0.1}
                className="glass-card p-5 text-center"
              >
                <div
                  className="text-3xl font-black font-display mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #3AB7D6 0%, #84D7C8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-neurovoz-dark/50 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section id="features" className="py-24 px-6 bg-neurovoz-gray">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="feature-tag mb-4 inline-block">
              <Zap size={12} />
              Tecnologia de ponta
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-neurovoz-dark mb-4">
              Tudo que você precisa,{' '}
              <span className="gradient-text">em um só lugar</span>
            </h2>
            <p className="text-neurovoz-dark/60 text-lg max-w-2xl mx-auto">
              Uma plataforma completa com IA adaptativa, assistente de voz, módulos terapêuticos
              e relatórios detalhados para toda a família.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i * 0.1}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card p-6 group cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                  style={{ background: feature.bg }}
                >
                  <div
                    className="p-2 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${feature.color.replace('from-[', '').replace('] to-[', ', ').replace(']', '')})`,
                      padding: '8px',
                    }}
                  >
                    <feature.icon size={20} color="white" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-neurovoz-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-neurovoz-dark/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section id="como-funciona" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-black text-neurovoz-dark mb-4">
              Como funciona?
            </h2>
            <p className="text-neurovoz-dark/60 text-lg">
              Em apenas 3 passos simples, você começa a transformar o desenvolvimento
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '👤',
                title: 'Crie o perfil',
                description:
                  'Cadastre os dados da criança: nome, idade, nível de suporte, hiperfocos, sensibilidades e objetivos de desenvolvimento.',
              },
              {
                step: '02',
                icon: '🧠',
                title: 'A IA aprende',
                description:
                  'O NeuroVoZ aprende o perfil único da criança e personaliza toda a comunicação, atividades e estratégias.',
              },
              {
                step: '03',
                icon: '🚀',
                title: 'Evolua juntos',
                description:
                  'Acompanhe o progresso em tempo real, receba relatórios semanais e veja o desenvolvimento acontecer.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative text-center p-8"
              >
                <div className="relative inline-block mb-6">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto float-animation"
                    style={{
                      background: 'linear-gradient(135deg, rgba(58,183,214,0.1) 0%, rgba(132,215,200,0.1) 100%)',
                      border: '2px solid rgba(58,183,214,0.2)',
                    }}
                    data-float-delay={i}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
                  >
                    {step.step}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-neurovoz-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-neurovoz-dark/60 leading-relaxed">
                  {step.description}
                </p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 right-0 transform translate-x-1/2">
                    <ArrowRight size={24} className="text-neurovoz-turquoise/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- BENEFITS ---- */}
      <section id="beneficios" className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #1A2332 0%, #243040 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="feature-tag mb-6 inline-block" style={{ borderColor: 'rgba(58,183,214,0.4)', color: '#84D7C8' }}>
                <Star size={12} />
                Diferenciais únicos
              </span>
              <h2 className="font-display text-4xl font-black text-white mb-6">
                Por que escolher o{' '}
                <span className="gradient-text">NeuroVoZ I.A?</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Desenvolvido com foco na experiência real de famílias e profissionais,
                o NeuroVoZ combina ciência, tecnologia e empatia para criar a melhor
                plataforma de apoio ao autismo do mundo.
              </p>
              <Link href="/register" className="btn-primary inline-flex">
                Começar agora
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-3"
            >
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(58,183,214,0.1)' }}
                >
                  <CheckCircle2 size={20} className="text-neurovoz-green flex-shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---- CTA FINAL ---- */}
      <section className="py-24 px-6 text-center hero-bg">
        <FloatingBlob color="#3AB7D6" size={400} x="30%" y="0%" delay={0} />
        <FloatingBlob color="#84D7C8" size={300} x="50%" y="40%" delay={1.5} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="text-6xl mb-6">🧠✨</div>
          <h2 className="font-display text-5xl font-black text-neurovoz-dark mb-6">
            Pronto para transformar{' '}
            <span className="gradient-text">vidas juntos?</span>
          </h2>
          <p className="text-neurovoz-dark/60 text-xl mb-10">
            Junte-se a milhares de famílias que já estão usando o NeuroVoZ I.A para
            apoiar o desenvolvimento de seus filhos.
          </p>
          <Link href="/register" className="btn-primary text-xl px-10 py-5 inline-flex mx-auto">
            <Sparkles size={22} />
            Criar conta gratuita agora
            <ArrowRight size={20} />
          </Link>
          <p className="text-neurovoz-dark/40 text-sm mt-4">
            Sem cartão de crédito • Acesso imediato • Suporte em Português
          </p>
        </motion.div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="bg-neurovoz-dark text-white/50 text-center py-8 px-6">
        <Logo size="sm" />
        <p className="mt-4 text-sm">
          © 2025 NeuroVoZ I.A. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-2 italic">
          "Compreender, apoiar e desenvolver, respeitando cada forma única de ser."
        </p>
      </footer>
    </div>
  )
}
