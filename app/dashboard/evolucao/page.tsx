'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Users,
  Zap,
  ChevronRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts'
import { useAppStore } from '@/lib/store'

// ---- Mock Data ----

const weeklyData = [
  { day: 'Seg', comunicacao: 70, social: 55, autonomia: 65, emocional: 60 },
  { day: 'Ter', comunicacao: 75, social: 62, autonomia: 70, emocional: 68 },
  { day: 'Qua', comunicacao: 80, social: 70, autonomia: 72, emocional: 65 },
  { day: 'Qui', comunicacao: 77, social: 75, autonomia: 75, emocional: 72 },
  { day: 'Sex', comunicacao: 85, social: 78, autonomia: 80, emocional: 75 },
  { day: 'Sáb', comunicacao: 82, social: 80, autonomia: 82, emocional: 78 },
  { day: 'Dom', comunicacao: 88, social: 83, autonomia: 85, emocional: 82 },
]

const monthlyData = [
  { month: 'Jan', score: 52 },
  { month: 'Fev', score: 58 },
  { month: 'Mar', score: 62 },
  { month: 'Abr', score: 68 },
  { month: 'Mai', score: 72 },
  { month: 'Jun', score: 80 },
]

const radarData = [
  { subject: 'Comunicação', A: 85 },
  { subject: 'Social', A: 78 },
  { subject: 'Autonomia', A: 82 },
  { subject: 'Emocional', A: 80 },
  { subject: 'Escolar', A: 70 },
  { subject: 'Higiene', A: 88 },
]

const skillsData = [
  { skill: 'Cumprimentar', progress: 90 },
  { skill: 'Pedir ajuda', progress: 75 },
  { skill: 'Esperar vez', progress: 60 },
  { skill: 'Higiene', progress: 85 },
  { skill: 'Organizar', progress: 70 },
]

const METRICS = [
  { label: 'Horas de sessão', value: '12h', icon: Calendar, color: '#3AB7D6', change: '+3h vs semana passada' },
  { label: 'Metas concluídas', value: '3/5', icon: Award, color: '#4ADE80', change: '+1 vs semana passada' },
  { label: 'Interações com IA', value: '48', icon: MessageSquare, color: '#8B6FE8', change: '+12 vs semana passada' },
  { label: 'Score de evolução', value: '80%', icon: TrendingUp, color: '#FB923C', change: '+8% vs semana passada' },
]

export default function EvolucaoPage() {
  const { child } = useAppStore()
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-black text-neurovoz-dark mb-1">
          Evolução de {child?.name?.split(' ')[0] || 'Pedro'}
        </h1>
        <p className="text-neurovoz-dark/50 text-sm">
          Acompanhe o desenvolvimento em todas as áreas
        </p>
      </motion.div>

      {/* Metrics Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${metric.color}15` }}>
                <metric.icon size={18} style={{ color: metric.color }} />
              </div>
              <span className="badge-neurovoz text-xs">{metric.change.startsWith('+') ? '↑' : '→'}</span>
            </div>
            <div className="font-display font-black text-2xl text-neurovoz-dark">{metric.value}</div>
            <div className="text-xs text-neurovoz-dark/50 mt-1">{metric.label}</div>
            <div className="text-xs font-medium mt-1" style={{ color: metric.color }}>{metric.change}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-lg text-neurovoz-dark">Evolução por área</h2>
              <p className="text-neurovoz-dark/50 text-sm">Esta semana</p>
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(245,247,248,0.8)' }}>
              {(['week', 'month'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: period === p ? 'white' : 'transparent',
                    color: period === p ? '#3AB7D6' : '#9BBDD4',
                    boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {p === 'week' ? 'Semana' : 'Mês'}
                </button>
              ))}
            </div>
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

          <ResponsiveContainer width="100%" height={220}>
            {period === 'week' ? (
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  {[
                    ['c', '#3AB7D6'],
                    ['s', '#8B6FE8'],
                    ['a', '#4ADE80'],
                    ['e', '#FB923C'],
                  ].map(([id, color]) => (
                    <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9BBDD4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9BBDD4' }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(v: number) => [`${v}%`]} />
                <Area type="monotone" dataKey="comunicacao" stroke="#3AB7D6" fill="url(#gc)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="social" stroke="#8B6FE8" fill="url(#gs)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="autonomia" stroke="#4ADE80" fill="url(#ga)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="emocional" stroke="#FB923C" fill="url(#ge)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            ) : (
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9BBDD4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9BBDD4' }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(v: number) => [`${v}%`]} />
                <Line type="monotone" dataKey="score" stroke="#3AB7D6" strokeWidth={3} dot={{ fill: '#3AB7D6', r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="font-display font-bold text-lg text-neurovoz-dark mb-1">Perfil de Habilidades</h2>
          <p className="text-neurovoz-dark/50 text-sm mb-4">Score atual</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(58,183,214,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9BBDD4' }} />
              <Radar dataKey="A" stroke="#3AB7D6" fill="#3AB7D6" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>

          {/* Top skills */}
          <div className="space-y-2 mt-4">
            {skillsData.map((skill) => (
              <div key={skill.skill} className="flex items-center gap-3">
                <span className="text-xs text-neurovoz-dark/60 w-24 flex-shrink-0">{skill.skill}</span>
                <div className="flex-1 progress-neurovoz">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                  />
                </div>
                <span className="text-xs font-bold text-neurovoz-turquoise w-8 text-right">{skill.progress}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-neurovoz-dark">Conquistas recentes</h2>
          <button className="text-neurovoz-turquoise text-sm font-semibold flex items-center gap-1">
            Ver todas <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🎯', title: 'Comunicação', desc: 'Conseguiu pedir ajuda 5x na escola', date: 'Hoje', color: '#3AB7D6' },
            { icon: '🤝', title: 'Social', desc: 'Cumprimentou 3 colegas sozinho', date: 'Ontem', color: '#8B6FE8' },
            { icon: '🪥', title: 'Higiene', desc: '7 dias escovando dentes sozinho', date: '3 dias atrás', color: '#4ADE80' },
            { icon: '🧘', title: 'Emocional', desc: 'Usou a respiração 4-7-8 com sucesso', date: '5 dias atrás', color: '#FB923C' },
          ].map((milestone) => (
            <div
              key={milestone.title}
              className="p-4 rounded-2xl"
              style={{ background: `${milestone.color}08`, border: `1px solid ${milestone.color}20` }}
            >
              <div className="text-3xl mb-2">{milestone.icon}</div>
              <div className="font-bold text-neurovoz-dark text-sm">{milestone.title}</div>
              <div className="text-neurovoz-dark/60 text-xs mt-1 leading-relaxed">{milestone.desc}</div>
              <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: milestone.color }}>
                <Zap size={11} />
                {milestone.date}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
