'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Heart,
  Star,
  Target,
  Smile,
  ShieldAlert,
  Plus,
  X,
} from 'lucide-react'
import { useAppStore, type SupportLevel } from '@/lib/store'
import { getSupportLevelDescription } from '@/lib/utils'

// ---- Step Configuration ----

const STEPS = [
  { id: 1, title: 'Informações Básicas', subtitle: 'Dados da criança', icon: User },
  { id: 2, title: 'Nível de Suporte', subtitle: 'Diagnóstico TEA', icon: ShieldAlert },
  { id: 3, title: 'Perfil Sensorial', subtitle: 'Gostos e hiperfocos', icon: Star },
  { id: 4, title: 'Preferências', subtitle: 'O que mais gosta', icon: Heart },
  { id: 5, title: 'Emoções & Crises', subtitle: 'Regulação emocional', icon: Smile },
  { id: 6, title: 'Objetivos', subtitle: 'Metas de desenvolvimento', icon: Target },
]

// ---- Tag Input Component ----

function TagInput({
  label,
  placeholder,
  tags,
  onAdd,
  onRemove,
  color = '#3AB7D6',
}: {
  label: string
  placeholder: string
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
  color?: string
}) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed)
      setInput('')
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-neurovoz-dark/70">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder={placeholder}
          className="input-neurovoz flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${color}, #84D7C8)` }}
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: `${color}18`,
                border: `1px solid ${color}40`,
                color,
              }}
            >
              {tag}
              <button onClick={() => onRemove(tag)} className="hover:opacity-70">
                <X size={13} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---- Main Onboarding Component ----

export default function OnboardingPage() {
  const router = useRouter()
  const { setChild, completeOnboarding, child } = useAppStore()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const [form, setForm] = useState({
    name: child?.name || '',
    age: child?.age?.toString() || '',
    gender: child?.gender || 'masculino',
    supportLevel: (child?.supportLevel || 2) as SupportLevel,
    diagnosis: child?.diagnosis || 'Transtorno do Espectro Autista (TEA)',
    hyperfocuses: child?.hyperfocuses || [],
    sensorySensitivities: child?.sensorySensitivities || [],
    favoriteFoods: child?.favoriteFoods || [],
    rejectedFoods: child?.rejectedFoods || [],
    favoriteObjects: child?.favoriteObjects || [],
    favoriteCharacters: child?.favoriteCharacters || [],
    frequentEmotions: child?.frequentEmotions || [],
    crisisTriggers: child?.crisisTriggers || [],
    developmentGoals: child?.developmentGoals || [],
    avatarEmoji: child?.avatarEmoji || '🌟',
  })

  const updateForm = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const addTag = (field: string) => (tag: string) =>
    updateForm(field, [...(form[field as keyof typeof form] as string[]), tag])

  const removeTag = (field: string) => (tag: string) =>
    updateForm(field, (form[field as keyof typeof form] as string[]).filter((t) => t !== tag))

  const goNext = () => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const goPrev = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleFinish = () => {
    setChild({
      id: Date.now().toString(),
      name: form.name,
      age: parseInt(form.age) || 9,
      gender: form.gender as 'masculino' | 'feminino' | 'outro',
      supportLevel: form.supportLevel,
      diagnosis: form.diagnosis,
      hyperfocuses: form.hyperfocuses,
      sensorySensitivities: form.sensorySensitivities,
      favoriteFoods: form.favoriteFoods,
      rejectedFoods: form.rejectedFoods,
      favoriteObjects: form.favoriteObjects,
      favoriteCharacters: form.favoriteCharacters,
      frequentEmotions: form.frequentEmotions,
      crisisTriggers: form.crisisTriggers,
      developmentGoals: form.developmentGoals,
      avatarEmoji: form.avatarEmoji,
    })
    completeOnboarding()
    router.push('/dashboard')
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  const GOAL_OPTIONS = [
    'Comunicação verbal',
    'Comunicação alternativa',
    'Autonomia',
    'Higiene pessoal',
    'Socialização',
    'Escola e aprendizado',
    'Controle emocional',
    'Alimentação variada',
    'Sono regular',
    'Habilidades motoras',
  ]

  const EMOTION_OPTIONS = [
    '😊 Alegria', '😢 Tristeza', '😡 Raiva', '😰 Ansiedade',
    '😌 Calma', '😮 Surpresa', '🥰 Carinho', '😤 Frustração',
  ]

  const AVATAR_OPTIONS = ['🌟', '🦖', '🚀', '🎮', '🦁', '🌈', '⭐', '🦋', '🐬', '🎯']

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0faff 0%, #e8f8f5 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3AB7D6, #84D7C8)' }}
              >
                <Brain size={20} color="white" />
              </div>
              <span className="font-display font-black text-xl gradient-text">NeuroVoZ I.A</span>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-neurovoz-dark">
            Vamos criar o perfil juntos!
          </h1>
          <p className="text-neurovoz-dark/50 mt-1 text-sm">
            Essas informações nos ajudam a personalizar a experiência
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: i === step ? 1.15 : 1,
                  transition: { duration: 0.2 },
                }}
                className={`step-indicator ${i === step ? 'active' : i < step ? 'completed' : 'pending'}`}
                style={{ width: i === step ? 44 : 36, height: i === step ? 44 : 36 }}
              >
                {i < step ? <Check size={16} /> : <s.icon size={16} />}
              </motion.div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-0.5 w-8 rounded-full transition-all duration-500"
                  style={{ background: i < step ? 'linear-gradient(90deg, #3AB7D6, #84D7C8)' : '#E5E7EB' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step label */}
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6"
        >
          <h2 className="font-display font-bold text-xl text-neurovoz-dark">
            {STEPS[step].title}
          </h2>
          <p className="text-neurovoz-dark/50 text-sm">{STEPS[step].subtitle}</p>
        </motion.div>

        {/* Step Content */}
        <div className="glass-card p-8 min-h-[380px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              {/* ---- STEP 1: Basic Info ---- */}
              {step === 0 && (
                <>
                  <div className="text-center mb-6">
                    <p className="text-sm text-neurovoz-dark/60 mb-3">Escolha um avatar para a criança</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => updateForm('avatarEmoji', emoji)}
                          className={`w-12 h-12 rounded-xl text-2xl transition-all duration-200 ${
                            form.avatarEmoji === emoji ? 'scale-110 ring-2 ring-neurovoz-turquoise ring-offset-2' : 'hover:scale-105'
                          }`}
                          style={{ background: form.avatarEmoji === emoji ? 'rgba(58,183,214,0.15)' : 'rgba(245,247,248,0.8)' }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-neurovoz-dark/70">
                      Nome da criança <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="child-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="Nome da criança"
                      className="input-neurovoz"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-neurovoz-dark/70">Idade</label>
                      <input
                        id="child-age"
                        type="number"
                        min="1"
                        max="25"
                        value={form.age}
                        onChange={(e) => updateForm('age', e.target.value)}
                        placeholder="Ex: 9"
                        className="input-neurovoz"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-neurovoz-dark/70">Gênero</label>
                      <select
                        id="child-gender"
                        value={form.gender}
                        onChange={(e) => updateForm('gender', e.target.value)}
                        className="input-neurovoz"
                      >
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Prefiro não informar</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* ---- STEP 2: Support Level ---- */}
              {step === 1 && (
                <>
                  <div className="space-y-1.5 mb-4">
                    <label className="text-sm font-semibold text-neurovoz-dark/70">Diagnóstico</label>
                    <input
                      id="diagnosis"
                      type="text"
                      value={form.diagnosis}
                      onChange={(e) => updateForm('diagnosis', e.target.value)}
                      placeholder="Ex: Transtorno do Espectro Autista (TEA)"
                      className="input-neurovoz"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-neurovoz-dark/70">
                      Nível de suporte (DSM-5) <span className="text-red-400">*</span>
                    </label>
                    {([1, 2, 3] as SupportLevel[]).map((level) => (
                      <motion.button
                        key={level}
                        id={`support-level-${level}`}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateForm('supportLevel', level)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                          form.supportLevel === level ? 'border-neurovoz-turquoise' : 'border-transparent'
                        }`}
                        style={{
                          background: form.supportLevel === level
                            ? 'linear-gradient(135deg, rgba(58,183,214,0.1) 0%, rgba(132,215,200,0.1) 100%)'
                            : 'rgba(245,247,248,0.8)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 transition-all ${
                              form.supportLevel === level ? 'text-white' : 'text-neurovoz-dark/40'
                            }`}
                            style={{
                              background: form.supportLevel === level
                                ? 'linear-gradient(135deg, #3AB7D6, #84D7C8)'
                                : 'rgba(200,210,220,0.5)',
                            }}
                          >
                            {level}
                          </div>
                          <div>
                            <div className="font-semibold text-neurovoz-dark text-sm">
                              Nível {level} — {level === 1 ? 'Suporte Leve' : level === 2 ? 'Suporte Moderado' : 'Suporte Intenso'}
                            </div>
                            <div className="text-neurovoz-dark/50 text-xs mt-0.5">
                              {getSupportLevelDescription(level)}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {/* ---- STEP 3: Sensory Profile ---- */}
              {step === 2 && (
                <>
                  <TagInput
                    label="Hiperfocos (assuntos favoritos)"
                    placeholder="Ex: Dinossauros, Trens..."
                    tags={form.hyperfocuses}
                    onAdd={addTag('hyperfocuses')}
                    onRemove={removeTag('hyperfocuses')}
                    color="#3AB7D6"
                  />
                  <TagInput
                    label="Sensibilidades sensoriais"
                    placeholder="Ex: Sons altos, Texturas..."
                    tags={form.sensorySensitivities}
                    onAdd={addTag('sensorySensitivities')}
                    onRemove={removeTag('sensorySensitivities')}
                    color="#F87171"
                  />
                  <TagInput
                    label="Alimentos preferidos"
                    placeholder="Ex: Pizza, Macarrão..."
                    tags={form.favoriteFoods}
                    onAdd={addTag('favoriteFoods')}
                    onRemove={removeTag('favoriteFoods')}
                    color="#4ADE80"
                  />
                  <TagInput
                    label="Alimentos rejeitados"
                    placeholder="Ex: Salada, Peixe..."
                    tags={form.rejectedFoods}
                    onAdd={addTag('rejectedFoods')}
                    onRemove={removeTag('rejectedFoods')}
                    color="#FB923C"
                  />
                </>
              )}

              {/* ---- STEP 4: Preferences ---- */}
              {step === 3 && (
                <>
                  <TagInput
                    label="Objetos favoritos"
                    placeholder="Ex: Lego, Tablet..."
                    tags={form.favoriteObjects}
                    onAdd={addTag('favoriteObjects')}
                    onRemove={removeTag('favoriteObjects')}
                    color="#8B6FE8"
                  />
                  <TagInput
                    label="Personagens favoritos"
                    placeholder="Ex: Sonic, Mario..."
                    tags={form.favoriteCharacters}
                    onAdd={addTag('favoriteCharacters')}
                    onRemove={removeTag('favoriteCharacters')}
                    color="#F472B6"
                  />
                </>
              )}

              {/* ---- STEP 5: Emotions & Crises ---- */}
              {step === 4 && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neurovoz-dark/70">
                      Emoções mais frequentes
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {EMOTION_OPTIONS.map((emotion) => {
                        const label = emotion.split(' ').slice(1).join(' ')
                        const isSelected = form.frequentEmotions.includes(label)
                        return (
                          <button
                            key={emotion}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                updateForm('frequentEmotions', form.frequentEmotions.filter((e) => e !== label))
                              } else {
                                updateForm('frequentEmotions', [...form.frequentEmotions, label])
                              }
                            }}
                            className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                              isSelected ? 'ring-2 ring-neurovoz-turquoise' : ''
                            }`}
                            style={{
                              background: isSelected
                                ? 'linear-gradient(135deg, rgba(58,183,214,0.15) 0%, rgba(132,215,200,0.15) 100%)'
                                : 'rgba(245,247,248,0.8)',
                            }}
                          >
                            {emotion}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <TagInput
                    label="Situações que geram crises"
                    placeholder="Ex: Mudanças de rotina..."
                    tags={form.crisisTriggers}
                    onAdd={addTag('crisisTriggers')}
                    onRemove={removeTag('crisisTriggers')}
                    color="#F87171"
                  />
                </>
              )}

              {/* ---- STEP 6: Goals ---- */}
              {step === 5 && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-neurovoz-dark/70">
                    Objetivos de desenvolvimento (selecione os que se aplicam)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {GOAL_OPTIONS.map((goal) => {
                      const isSelected = form.developmentGoals.includes(goal)
                      return (
                        <motion.button
                          key={goal}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (isSelected) {
                              updateForm('developmentGoals', form.developmentGoals.filter((g) => g !== goal))
                            } else {
                              updateForm('developmentGoals', [...form.developmentGoals, goal])
                            }
                          }}
                          className="flex items-center gap-3 p-3.5 rounded-xl transition-all text-left"
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, rgba(58,183,214,0.12) 0%, rgba(132,215,200,0.12) 100%)'
                              : 'rgba(245,247,248,0.8)',
                            border: `1px solid ${isSelected ? 'rgba(58,183,214,0.4)' : 'transparent'}`,
                          }}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                              isSelected ? 'text-white' : ''
                            }`}
                            style={{
                              background: isSelected
                                ? 'linear-gradient(135deg, #3AB7D6, #84D7C8)'
                                : 'rgba(200,210,220,0.4)',
                            }}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                          <span className="text-sm font-medium text-neurovoz-dark">{goal}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <span className="text-sm text-neurovoz-dark/40 font-medium">
            {step + 1} de {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button onClick={goNext} className="btn-primary flex items-center gap-2">
              Próximo
              <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn-primary flex items-center gap-2">
              <Check size={18} />
              Concluir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
