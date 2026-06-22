'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  GripVertical,
  Calendar,
  Sun,
  Moon,
  Coffee,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

const CATEGORY_COLORS = {
  escola: '#3AB7D6',
  terapia: '#8B6FE8',
  higiene: '#4ADE80',
  alimentacao: '#FB923C',
  lazer: '#F472B6',
  sono: '#6366F1',
}

const CATEGORY_LABELS = {
  escola: 'Escola',
  terapia: 'Terapia',
  higiene: 'Higiene',
  alimentacao: 'Alimentação',
  lazer: 'Lazer',
  sono: 'Sono',
}

const TIME_SECTIONS = [
  { label: 'Manhã', icon: Sun, start: '06:00', end: '12:00', color: '#FBBF24' },
  { label: 'Tarde', icon: Coffee, start: '12:00', end: '18:00', color: '#FB923C' },
  { label: 'Noite', icon: Moon, start: '18:00', end: '23:59', color: '#6366F1' },
]

export default function RotinaPage() {
  const { routine, toggleRoutineItem, child } = useAppStore()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const completedCount = routine.filter((r) => r.completed).length
  const progress = Math.round((completedCount / routine.length) * 100)

  const getItemsBySection = (start: string, end: string) => {
    return routine.filter((item) => {
      const t = item.time
      return t >= start && t < end
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-black text-neurovoz-dark">
              Rotina de {child?.name?.split(' ')[0] || 'hoje'}
            </h1>
            <div className="flex items-center gap-2 text-neurovoz-dark/50 text-sm mt-1">
              <Calendar size={14} />
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neurovoz-dark/60 font-medium">Progresso do dia</span>
              <span className="font-bold text-neurovoz-turquoise">{progress}%</span>
            </div>
            <div className="progress-neurovoz">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
          >
            <span className="font-black text-xl leading-none">{completedCount}</span>
            <span className="text-xs opacity-80">/{routine.length}</span>
          </div>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium cursor-pointer transition-all"
              style={{
                background: `${CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS]}15`,
                color: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS],
                border: `1px solid ${CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS]}25`,
                opacity: activeSection === null || activeSection === key ? 1 : 0.4,
              }}
              onClick={() => setActiveSection(activeSection === key ? null : key)}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] }} />
              {label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Timeline Sections */}
      {TIME_SECTIONS.map((section, sIdx) => {
        const sectionItems = getItemsBySection(section.start, section.end).filter(
          (item) => activeSection === null || item.category === activeSection
        )
        if (sectionItems.length === 0) return null

        return (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sIdx * 0.1 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${section.color}15` }}
              >
                <section.icon size={18} style={{ color: section.color }} />
              </div>
              <h2 className="font-display font-bold text-neurovoz-dark">{section.label}</h2>
              <div className="h-px flex-1" style={{ background: `${section.color}20` }} />
              <span className="text-sm text-neurovoz-dark/40">
                {sectionItems.filter((i) => i.completed).length}/{sectionItems.length}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3 pl-12">
              {sectionItems.map((item, i) => {
                const categoryColor = CATEGORY_COLORS[item.category]
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative"
                  >
                    {/* Timeline connector */}
                    {i < sectionItems.length - 1 && (
                      <div
                        className="absolute left-[22px] top-full w-0.5 h-3"
                        style={{ background: item.completed ? categoryColor + '40' : 'rgba(200,210,220,0.3)' }}
                      />
                    )}

                    <div
                      className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group cursor-pointer"
                      style={{
                        background: item.completed
                          ? `${categoryColor}08`
                          : 'rgba(255,255,255,0.9)',
                        border: `1px solid ${item.completed ? categoryColor + '25' : 'rgba(220,230,240,0.5)'}`,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      }}
                      onClick={() => toggleRoutineItem(item.id)}
                    >
                      {/* Drag handle (visual only) */}
                      <GripVertical size={16} className="text-neurovoz-dark/20 flex-shrink-0" />

                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{
                          background: item.completed ? `${categoryColor}15` : 'rgba(245,247,248,0.8)',
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold text-sm transition-all ${
                            item.completed ? 'line-through text-neurovoz-dark/40' : 'text-neurovoz-dark'
                          }`}
                        >
                          {item.activity}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-neurovoz-dark/40">
                            <Clock size={11} />
                            {item.time}
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${categoryColor}12`, color: categoryColor }}
                          >
                            {CATEGORY_LABELS[item.category]}
                          </span>
                        </div>
                      </div>

                      {/* Checkbox */}
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        className="flex-shrink-0"
                        style={{ color: categoryColor }}
                      >
                        {item.completed ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <Circle size={24} className="text-neurovoz-dark/20" />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}

      {/* Empty state */}
      {activeSection && routine.filter((r) => r.category === activeSection).length === 0 && (
        <div className="text-center py-12 text-neurovoz-dark/40">
          <div className="text-4xl mb-3">📋</div>
          <p>Nenhuma atividade nesta categoria</p>
        </div>
      )}

      {/* Completion card */}
      <AnimatePresence>
        {completedCount === routine.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center"
            style={{ border: '2px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.05)' }}
          >
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-display font-bold text-lg text-neurovoz-dark mb-1">
              Rotina completa!
            </h3>
            <p className="text-neurovoz-dark/60 text-sm">
              {child?.name?.split(' ')[0]} completou todas as atividades do dia! Incrível! 🌟
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
