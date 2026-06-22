'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Download,
  Calendar,
  Brain,
  Target,
  ArrowUp,
  Clock,
  MessageSquare,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAppStore } from '@/lib/store'

const WEEKLY_REPORT = {
  period: '9 a 16 de Junho de 2025',
  overallScore: 82,
  change: +8,
  observations: [
    { icon: '✅', text: 'Conseguiu se comunicar com 2 colegas novos na escola sem ajuda', type: 'positive' },
    { icon: '⭐', text: 'Usou a técnica de respiração 4-7-8 com sucesso em 3 situações', type: 'positive' },
    { icon: '📈', text: 'Score de autonomia aumentou 12% comparado à semana anterior', type: 'positive' },
    { icon: '⚠️', text: 'Teve 2 episódios de crise sensorial relacionados a barulho na escola', type: 'warning' },
    { icon: '💡', text: 'Apresentou maior interesse em Minecraft — pode ser explorado terapeuticamente', type: 'info' },
  ],
}

const crisisData = [
  { day: 'Seg', crises: 0 },
  { day: 'Ter', crises: 1 },
  { day: 'Qua', crises: 0 },
  { day: 'Qui', crises: 2 },
  { day: 'Sex', crises: 0 },
  { day: 'Sáb', crises: 1 },
  { day: 'Dom', crises: 0 },
]

const goalProgressData = [
  { goal: 'Higiene', atual: 85, meta: 100 },
  { goal: 'Social', atual: 72, meta: 100 },
  { goal: 'Escola', atual: 68, meta: 100 },
  { goal: 'Emocional', atual: 75, meta: 100 },
  { goal: 'Autonomia', atual: 80, meta: 100 },
]

const AI_SUGGESTIONS = [
  {
    icon: '🎮',
    title: 'Usar Minecraft terapeuticamente',
    description:
      'Pedro demonstrou maior engajamento com Minecraft esta semana. Sugerimos criar atividades de colaboração e resolução de problemas dentro do jogo para desenvolver habilidades sociais.',
    priority: 'Alta',
    category: 'Social',
  },
  {
    icon: '🎧',
    title: 'Fones de ouvido na escola',
    description:
      'Os episódios de crise ocorreram em ambientes barulhentos. Considere fones de ouvido com cancelamento de ruído para uso discreto em aula ou recreio.',
    priority: 'Alta',
    category: 'Sensorial',
  },
  {
    icon: '🌬️',
    title: 'Treino diário de respiração',
    description:
      'A técnica 4-7-8 está funcionando! Mantenha uma rotina de 5 minutos pela manhã para solidificar o hábito antes que surjam situações de estresse.',
    priority: 'Média',
    category: 'Emocional',
  },
  {
    icon: '📚',
    title: 'Livro sobre dinossauros',
    description:
      'Aproveitar o hiperfoco em dinossauros para introduzir leitura. Livros ilustrados sobre paleontologia podem aumentar o interesse pela leitura escolar.',
    priority: 'Média',
    category: 'Escolar',
  },
]

const PRIORITY_COLORS = { Alta: '#F87171', Média: '#FBBF24', Baixa: '#4ADE80' }

export default function TutorPage() {
  const { child, guardian } = useAppStore()
  const [activeTab, setActiveTab] = useState<'relatorio' | 'sugestoes' | 'crises'>('relatorio')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={22} className="text-neurovoz-turquoise" />
              <h1 className="font-display text-2xl font-black text-neurovoz-dark">Modo Tutor</h1>
            </div>
            <p className="text-neurovoz-dark/50 text-sm">
              Relatórios e sugestões para {guardian?.name?.split(' ')[0] || 'você'} acompanhar o desenvolvimento de{' '}
              <strong>{child?.name}</strong>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
              <Download size={16} />
              Exportar PDF
            </button>
            <button className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
              <Brain size={16} />
              Gerar relatório IA
            </button>
          </div>
        </div>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div
          className="sm:col-span-1 rounded-3xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1A2332 0%, #2E3D52 100%)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
            style={{ background: 'radial-gradient(circle, #3AB7D6, transparent)', transform: 'translate(20%, -20%)' }} />
          <div className="relative z-10">
            <div className="text-white/60 text-sm mb-3 flex items-center gap-2">
              <Calendar size={14} />
              {WEEKLY_REPORT.period}
            </div>
            <div className="font-display text-5xl font-black mb-1">{WEEKLY_REPORT.overallScore}%</div>
            <div className="text-white/70 font-medium mb-3">Score de evolução semanal</div>
            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
              <ArrowUp size={16} />
              +{WEEKLY_REPORT.change}% vs semana anterior
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          {[
            { icon: MessageSquare, label: 'Interações com IA', value: '48', color: '#8B6FE8' },
            { icon: Target, label: 'Metas concluídas', value: '3 de 5', color: '#4ADE80' },
            { icon: AlertTriangle, label: 'Episódios SOS', value: '4', color: '#F87171' },
            { icon: Clock, label: 'Horas de sessão', value: '12h', color: '#3AB7D6' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="font-display font-black text-xl text-neurovoz-dark">{stat.value}</div>
                <div className="text-xs text-neurovoz-dark/50">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neurovoz-gray">
        {([
          { id: 'relatorio', label: 'Relatório', icon: BookOpen },
          { id: 'sugestoes', label: 'Sugestões IA', icon: Lightbulb },
          { id: 'crises', label: 'Crises & Padrões', icon: AlertTriangle },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px"
            style={{
              color: activeTab === tab.id ? '#3AB7D6' : '#9BBDD4',
              borderColor: activeTab === tab.id ? '#3AB7D6' : 'transparent',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- TAB CONTENT ---- */}

      {/* Relatório Tab */}
      {activeTab === 'relatorio' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Observations */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg text-neurovoz-dark mb-4">
              Comportamentos observados na semana
            </h2>
            <div className="space-y-3">
              {WEEKLY_REPORT.observations.map((obs, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{
                    background:
                      obs.type === 'positive' ? 'rgba(74,222,128,0.06)' :
                      obs.type === 'warning' ? 'rgba(248,113,113,0.06)' :
                      'rgba(58,183,214,0.06)',
                    border: `1px solid ${
                      obs.type === 'positive' ? 'rgba(74,222,128,0.2)' :
                      obs.type === 'warning' ? 'rgba(248,113,113,0.2)' :
                      'rgba(58,183,214,0.2)'
                    }`,
                  }}
                >
                  <span className="text-2xl">{obs.icon}</span>
                  <p className="text-neurovoz-dark/80 text-sm leading-relaxed">{obs.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Goal Progress */}
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg text-neurovoz-dark mb-5">
              Progresso nas metas de desenvolvimento
            </h2>
            <div className="space-y-4">
              {goalProgressData.map((goal) => (
                <div key={goal.goal} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-neurovoz-dark/70 w-24 flex-shrink-0">{goal.goal}</span>
                  <div className="flex-1 progress-neurovoz">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.atual}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-sm font-bold text-neurovoz-turquoise w-10 text-right">{goal.atual}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Sugestões Tab */}
      {activeTab === 'sugestoes' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div
            className="flex items-center gap-3 p-4 rounded-2xl mb-2"
            style={{ background: 'rgba(58,183,214,0.08)', border: '1px solid rgba(58,183,214,0.2)' }}
          >
            <Brain size={20} className="text-neurovoz-turquoise" />
            <p className="text-sm text-neurovoz-dark/70">
              Sugestões geradas pela IA com base nos comportamentos e progresso de{' '}
              <strong className="text-neurovoz-turquoise">{child?.name}</strong> nesta semana.
            </p>
          </div>

          {AI_SUGGESTIONS.map((suggestion, i) => (
            <motion.div
              key={suggestion.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-start gap-4 hover:shadow-card-hover transition-all cursor-pointer group"
            >
              <div className="text-4xl">{suggestion.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display font-bold text-neurovoz-dark">{suggestion.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${PRIORITY_COLORS[suggestion.priority as keyof typeof PRIORITY_COLORS]}15`,
                        color: PRIORITY_COLORS[suggestion.priority as keyof typeof PRIORITY_COLORS],
                      }}
                    >
                      {suggestion.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-neurovoz-gray text-neurovoz-dark/60">
                      {suggestion.category}
                    </span>
                  </div>
                </div>
                <p className="text-neurovoz-dark/60 text-sm leading-relaxed">{suggestion.description}</p>
              </div>
              <ChevronRight size={18} className="text-neurovoz-dark/30 group-hover:text-neurovoz-turquoise transition-colors flex-shrink-0 mt-1" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Crises Tab */}
      {activeTab === 'crises' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg text-neurovoz-dark mb-5">
              Episódios de crise — esta semana
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={crisisData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9BBDD4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9BBDD4' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  formatter={(v: number) => [v, 'Crises']}
                />
                <Bar dataKey="crises" radius={[6, 6, 0, 0]} fill="#F87171" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg text-neurovoz-dark mb-4">
              Gatilhos identificados
            </h2>
            <div className="space-y-3">
              {[
                { trigger: 'Ambiente muito barulhoso', frequency: 4, color: '#F87171' },
                { trigger: 'Mudança inesperada na rotina', frequency: 3, color: '#FB923C' },
                { trigger: 'Esperar por muito tempo', frequency: 2, color: '#FBBF24' },
                { trigger: 'Sobrecarga de estímulos visuais', frequency: 1, color: '#84D7C8' },
              ].map((item) => (
                <div key={item.trigger} className="flex items-center gap-4">
                  <span className="text-sm text-neurovoz-dark/70 flex-1">{item.trigger}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 progress-neurovoz h-2">
                      <div className="h-full rounded-full" style={{ width: `${(item.frequency / 4) * 100}%`, background: item.color }} />
                    </div>
                    <span className="text-xs font-bold text-neurovoz-dark/50 w-8">{item.frequency}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
