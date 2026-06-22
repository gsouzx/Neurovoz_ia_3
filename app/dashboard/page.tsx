'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
  ChevronRight,
  Sparkles,
  Clock,
  Award,
  BarChart3,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts'
import { useAppStore, EmotionType } from '@/lib/store'

// ---- Mock evolution data ----
const evolutionData = [
  { week: 'S1', comunicacao: 55, social: 40, autonomia: 60, emocional: 45 },
  { week: 'S2', comunicacao: 62, social: 50, autonomia: 65, emocional: 52 },
  { week: 'S3', comunicacao: 68, social: 58, autonomia: 70, emocional: 60 },
  { week: 'S4', comunicacao: 75, social: 65, autonomia: 74, emocional: 68 },
  { week: 'S5', comunicacao: 80, social: 72, autonomia: 78, emocional: 75 },
  { week: 'S6', comunicacao: 85, social: 78, autonomia: 82, emocional: 80 },
]

const radarData = [
  { subject: 'Comunicação', value: 85 },
  { subject: 'Social', subject2: 'Social', value: 78 },
  { subject: 'Autonomia', value: 82 },
  { subject: 'Emocional', value: 80 },
  { subject: 'Escolar', value: 70 },
]

// ---- Mood Options ----
const MOODS: { emotion: EmotionType; emoji: string; label: string; color: string }[] = [
  { emotion: 'happy', emoji: '😊', label: 'Feliz', color: '#FBBF24' },
  { emotion: 'neutral', emoji: '😐', label: 'Neutro', color: '#9BBDD4' },
  { emotion: 'sad', emoji: '😢', label: 'Triste', color: '#60A5FA' },
  { emotion: 'angry', emoji: '😡', label: 'Irritado', color: '#F87171' },
  { emotion: 'anxious', emoji: '😰', label: 'Ansioso', color: '#C084FC' },
  { emotion: 'excited', emoji: '🤩', label: 'Animado', color: '#34D399' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function DashboardPage() {
  const { child, todayMood, setTodayMood, goals, toggleGoal, routine } = useAppStore()
  const [showMoodSuccess, setShowMoodSuccess] = useState(false)

  const handleMoodSelect = (emotion: EmotionType) => {
    setTodayMood(emotion)
    setShowMoodSuccess(true)
    setTimeout(() => setShowMoodSuccess(false), 2000)
  }

  const completedGoals = goals.filter((g) => g.completed).length
  const completedRoutine = routine.filter((r) => r.completed).length
  const routineProgress = Math.round((completedRoutine / routine.length) * 100)

  const selectedMood = MOODS.find((m) => m.emotion === todayMood)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ---- Welcome Banner ---- */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #1A2332 0%, #2E3D52 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #3AB7D6, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #84D7C8, transparent)' }} />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl float-animation"
                style={{ background: 'rgba(58,183,214,0.2)', border: '2px solid rgba(58,183,214,0.3)' }}
              >
                {child?.avatarEmoji || '🌟'}
              </div>
              <div>
                <h1 className="font-display text-2xl font-black">{child?.name || 'Olá'}</h1>
                <div className="badge-neurovoz mt-1" style={{ background: 'rgba(58,183,214,0.2)', borderColor: 'rgba(58,183,214,0.4)', color: '#BEE8FF' }}>
                  <Sparkles size={10} />
                  Nível {child?.supportLevel} de suporte
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-md">
              Você está indo muito bem! Hoje é um novo dia para aprender e crescer juntos. 🚀
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard/chat" className="btn-primary text-sm py-2.5 px-5">
              <MessageCircle size={16} />
              Conversar com a IA
            </Link>
            <Link
              href="/dashboard/sos"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #F87171, #FB923C)' }}
            >
              <AlertTriangle size={16} />
              SOS
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ---- Quick Stats ---- */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: Flame, label: 'Sequência', value: '7 dias', color: '#FB923C', bg: 'rgba(251,146,60,0.1)' },
          { icon: Target, label: 'Metas', value: `${completedGoals}/${goals.length}`, color: '#3AB7D6', bg: 'rgba(58,183,214,0.1)' },
          { icon: Calendar, label: 'Rotina', value: `${routineProgress}%`, color: '#4ADE80', bg: 'rgba(74,222,128,0.1)' },
          { icon: Award, label: 'Estrelas', value: '24 ⭐', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            custom={1 + i * 0.1}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: stat.bg }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div>
              <div className="font-display font-black text-xl text-neurovoz-dark leading-none">{stat.value}</div>
              <div className="text-neurovoz-dark/40 text-xs mt-0.5">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ---- Main Grid ---- */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-lg text-neurovoz-dark">
                  Como {child?.name?.split(' ')[0] || 'você'} está hoje?
                </h2>
                <p className="text-neurovoz-dark/50 text-sm">Selecione o humor do dia</p>
              </div>
              {selectedMood && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: `${selectedMood.color}20`, color: selectedMood.color }}
                >
                  {selectedMood.emoji} {selectedMood.label}
                </motion.div>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.emotion}
                  id={`mood-${mood.emotion}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood.emotion)}
                  className={`emotion-card py-3 ${todayMood === mood.emotion ? 'selected' : ''}`}
                  style={todayMood === mood.emotion ? { borderColor: mood.color } : {}}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium text-neurovoz-dark/60">{mood.label}</span>
                </motion.button>
              ))}
            </div>
            {showMoodSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-center gap-2 text-sm text-neurovoz-turquoise font-medium"
              >
                <CheckCircle2 size={16} />
                Humor registrado! A IA personalizará as respostas de hoje.
              </motion.div>
            )}
          </motion.div>

          {/* Evolution Chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-lg text-neurovoz-dark">Evolução nas últimas 6 semanas</h2>
                <p className="text-neurovoz-dark/50 text-sm">Progresso em todas as áreas</p>
              </div>
              <Link href="/dashboard/evolucao" className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                Ver detalhes
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="flex gap-4 mb-4 flex-wrap">
              {[
                { label: 'Comunicação', color: '#3AB7D6' },
                { label: 'Social', color: '#8B6FE8' },
                { label: 'Autonomia', color: '#4ADE80' },
                { label: 'Emocional', color: '#FB923C' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-neurovoz-dark/60">{item.label}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={evolutionData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3AB7D6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3AB7D6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B6FE8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B6FE8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEmo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9BBDD4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9BBDD4' }} axisLine={false} tickLine={false} domain={[30, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  formatter={(value: number) => [`${value}%`]}
                />
                <Area type="monotone" dataKey="comunicacao" stroke="#3AB7D6" fill="url(#colorCom)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="social" stroke="#8B6FE8" fill="url(#colorSoc)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="autonomia" stroke="#4ADE80" fill="url(#colorAut)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="emocional" stroke="#FB923C" fill="url(#colorEmo)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Routine Preview */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-lg text-neurovoz-dark">Rotina de hoje</h2>
                <p className="text-neurovoz-dark/50 text-sm">
                  {completedRoutine} de {routine.length} atividades concluídas
                </p>
              </div>
              <Link href="/dashboard/rotina" className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                Ver tudo
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Progress bar */}
            <div className="progress-neurovoz mb-4">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${routineProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            <div className="space-y-2">
              {routine.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: item.completed ? 'rgba(74,222,128,0.06)' : 'rgba(245,247,248,0.8)',
                    opacity: item.completed ? 0.7 : 1,
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${item.completed ? 'line-through text-neurovoz-dark/40' : 'text-neurovoz-dark'}`}>
                      {item.activity}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neurovoz-dark/40 mt-0.5">
                      <Clock size={10} />
                      {item.time}
                    </div>
                  </div>
                  {item.completed
                    ? <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                    : <Circle size={18} className="text-neurovoz-dark/20 flex-shrink-0" />
                  }
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Weekly Goals */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2.5} className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-neurovoz-dark">Metas da semana</h2>
              <span className="badge-neurovoz">{completedGoals}/{goals.length}</span>
            </div>
            <div className="space-y-3">
              {goals.map((goal) => (
                <motion.button
                  key={goal.id}
                  id={`goal-${goal.id}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleGoal(goal.id)}
                  className="w-full flex items-start gap-3 text-left p-3 rounded-xl transition-all hover:bg-white/80"
                  style={{ background: goal.completed ? 'rgba(74,222,128,0.06)' : 'transparent' }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                    style={{
                      background: goal.completed ? 'linear-gradient(135deg, #4ADE80, #3AB7D6)' : 'transparent',
                      border: goal.completed ? 'none' : '2px solid rgba(155,189,212,0.5)',
                    }}
                  >
                    {goal.completed && <CheckCircle2 size={12} color="white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${goal.completed ? 'line-through text-neurovoz-dark/40' : 'text-neurovoz-dark'}`}>
                      {goal.title}
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded-full inline-block mt-1"
                      style={{ background: 'rgba(58,183,214,0.1)', color: '#3AB7D6' }}>
                      {goal.category}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3.5} className="glass-card p-6">
            <h2 className="font-display font-bold text-lg text-neurovoz-dark mb-1">Habilidades</h2>
            <p className="text-neurovoz-dark/50 text-sm mb-4">Visão geral do desenvolvimento</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(58,183,214,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9BBDD4' }} />
                <Radar name="Nível" dataKey="value" stroke="#3AB7D6" fill="#3AB7D6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4.5} className="glass-card p-6">
            <h2 className="font-display font-bold text-base text-neurovoz-dark mb-4">Ações rápidas</h2>
            <div className="space-y-2">
              {[
                { href: '/dashboard/chat', icon: MessageCircle, label: 'Conversar com NeuroVoZ', color: '#8B6FE8' },
                { href: '/dashboard/social', icon: BarChart3, label: 'Módulo Social', color: '#F472B6' },
                { href: '/dashboard/tutor', icon: TrendingUp, label: 'Relatório do tutor', color: '#FBBF24' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/80 group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${action.color}15` }}
                  >
                    <action.icon size={16} style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium text-neurovoz-dark group-hover:text-neurovoz-turquoise transition-colors">
                    {action.label}
                  </span>
                  <ChevronRight size={14} className="ml-auto text-neurovoz-dark/30 group-hover:text-neurovoz-turquoise transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
