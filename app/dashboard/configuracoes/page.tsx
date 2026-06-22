'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Brain,
  Key,
  ShieldAlert,
  Check,
  AlertCircle,
  HelpCircle,
  Volume2,
  Moon,
  Sun,
  Activity,
  Trash2,
  Info,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function SettingsPage() {
  const {
    guardian,
    child,
    geminiApiKey,
    setGuardian,
    setChild,
    setGeminiApiKey,
    clearMessages,
  } = useAppStore()

  // Form states
  const [guardianName, setGuardianName] = useState(guardian?.name || '')
  const [guardianEmail, setGuardianEmail] = useState(guardian?.email || '')
  const [guardianPhone, setGuardianPhone] = useState(guardian?.phone || '')

  const [childName, setChildName] = useState(child?.name || '')
  const [childAge, setChildAge] = useState(child?.age || 8)
  const [childGender, setChildGender] = useState(child?.gender || 'masculino')
  const [childSupportLevel, setChildSupportLevel] = useState(child?.supportLevel || 2)
  const [childDiagnosis, setChildDiagnosis] = useState(child?.diagnosis || '')
  const [childAvatar, setChildAvatar] = useState(child?.avatarEmoji || '🦖')

  const [hyperfocuses, setHyperfocuses] = useState(child?.hyperfocuses.join(', ') || '')
  const [sensitivities, setSensitivities] = useState(child?.sensorySensitivities.join(', ') || '')
  const [favoriteCharacters, setFavoriteCharacters] = useState(child?.favoriteCharacters.join(', ') || '')

  const [apiKey, setApiKey] = useState(geminiApiKey || '')

  // UI state
  const [activeTab, setActiveTab] = useState<'perfil' | 'ia' | 'geral'>('perfil')
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [showClearToast, setShowClearToast] = useState(false)

  // Sync state if store updates
  useEffect(() => {
    if (guardian) {
      setGuardianName(guardian.name)
      setGuardianEmail(guardian.email)
      setGuardianPhone(guardian.phone)
    }
  }, [guardian])

  useEffect(() => {
    if (child) {
      setChildName(child.name)
      setChildAge(child.age)
      setChildGender(child.gender)
      setChildSupportLevel(child.supportLevel)
      setChildDiagnosis(child.diagnosis)
      setChildAvatar(child.avatarEmoji)
      setHyperfocuses(child.hyperfocuses.join(', '))
      setSensitivities(child.sensorySensitivities.join(', '))
      setFavoriteCharacters(child.favoriteCharacters.join(', '))
    }
  }, [child])

  useEffect(() => {
    setApiKey(geminiApiKey || '')
  }, [geminiApiKey])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse comma-separated strings to arrays
    const parsedHyperfocuses = hyperfocuses
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const parsedSensitivities = sensitivities
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const parsedCharacters = favoriteCharacters
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    // Save Guardian
    setGuardian({
      id: guardian?.id || 'guardian-1',
      name: guardianName,
      email: guardianEmail,
      phone: guardianPhone,
    })

    // Save Child Profile
    setChild({
      name: childName,
      age: Number(childAge),
      gender: childGender as 'masculino' | 'feminino' | 'outro',
      supportLevel: Number(childSupportLevel) as 1 | 2 | 3,
      diagnosis: childDiagnosis,
      avatarEmoji: childAvatar,
      hyperfocuses: parsedHyperfocuses,
      sensorySensitivities: parsedSensitivities,
      favoriteCharacters: parsedCharacters,
    })

    // Save Gemini Key
    setGeminiApiKey(apiKey)

    // Show visual confirmation
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 3000)
  }

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza de que deseja limpar todo o histórico de conversas do chat? Esta ação não pode ser desfeita.')) {
      clearMessages()
      setShowClearToast(true)
      setTimeout(() => setShowClearToast(false), 3000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-black text-neurovoz-dark">Configurações</h1>
        <p className="text-neurovoz-dark/50 text-sm">Personalize a experiência do NeuroVoZ para sua família</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neurovoz-turquoise/15 pb-2">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'perfil'
              ? 'bg-neurovoz-dark text-white shadow-md'
              : 'text-neurovoz-dark/60 hover:bg-neurovoz-turquoise/5 hover:text-neurovoz-dark'
          }`}
        >
          <User size={16} />
          Perfis & Personalização
        </button>
        <button
          onClick={() => setActiveTab('ia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'ia'
              ? 'bg-neurovoz-dark text-white shadow-md'
              : 'text-neurovoz-dark/60 hover:bg-neurovoz-turquoise/5 hover:text-neurovoz-dark'
          }`}
        >
          <Key size={16} />
          Conexão IA
        </button>
        <button
          onClick={() => setActiveTab('geral')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'geral'
              ? 'bg-neurovoz-dark text-white shadow-md'
              : 'text-neurovoz-dark/60 hover:bg-neurovoz-turquoise/5 hover:text-neurovoz-dark'
          }`}
        >
          <Activity size={16} />
          Geral & Sistema
        </button>
      </div>

      {/* Forms Container */}
      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            {/* Child Profile Section */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-neurovoz-turquoise font-display font-bold">
                <Brain size={20} />
                <h2>Perfil da Criança (Pedro)</h2>
              </div>
              <p className="text-xs text-neurovoz-dark/40 -mt-2">
                Estas informações alimentam o sistema do assistente inteligente para adaptar os diálogos e rotinas.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Nome da Criança</label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="input-neurovoz"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Idade (Anos)</label>
                  <input
                    type="number"
                    min="1"
                    max="21"
                    required
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="input-neurovoz"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Avatar Emoji</label>
                  <select
                    value={childAvatar}
                    onChange={(e) => setChildAvatar(e.target.value)}
                    className="input-neurovoz"
                  >
                    <option value="🦖">🦖 Dinossauro</option>
                    <option value="🚀">🚀 Foguete</option>
                    <option value="🦁">🦁 Leão</option>
                    <option value="🦄">🦄 Unicórnio</option>
                    <option value="🤖">🤖 Robô</option>
                    <option value="🎨">🎨 Paleta</option>
                    <option value="⭐">⭐ Estrela</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Gênero</label>
                  <div className="flex gap-2">
                    {['masculino', 'feminino', 'outro'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setChildGender(gender as any)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          childGender === gender
                            ? 'bg-neurovoz-turquoise/15 border-neurovoz-turquoise text-neurovoz-turquoise'
                            : 'border-neurovoz-dark/10 text-neurovoz-dark/60 hover:bg-neurovoz-gray'
                        }`}
                      >
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70 flex items-center gap-1">
                    Nível de Suporte (TEA)
                    <span
                      title="Nível de suporte define o quão simples e estruturada será a linguagem utilizada pela IA."
                      className="cursor-help text-neurovoz-dark/30 hover:text-neurovoz-turquoise"
                    >
                      <HelpCircle size={12} />
                    </span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setChildSupportLevel(level as any)}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          childSupportLevel === level
                            ? 'bg-neurovoz-turquoise/15 border-neurovoz-turquoise text-neurovoz-turquoise'
                            : 'border-neurovoz-dark/10 text-neurovoz-dark/60 hover:bg-neurovoz-gray'
                        }`}
                      >
                        Nível {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neurovoz-dark/70">Diagnóstico Principal</label>
                <input
                  type="text"
                  value={childDiagnosis}
                  onChange={(e) => setChildDiagnosis(e.target.value)}
                  placeholder="Ex: Transtorno do Espectro Autista (TEA)"
                  className="input-neurovoz"
                />
              </div>
            </div>

            {/* Customization & Preferences Section */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-neurovoz-turquoise font-display font-bold">
                <Brain size={20} className="text-[#8B6FE8]" />
                <h2>Personalização da Inteligência Artificial</h2>
              </div>
              <p className="text-xs text-neurovoz-dark/40 -mt-2">
                Separe os itens com vírgulas. A IA utilizará esses dados para criar histórias, propor atividades interessantes e evitar gatilhos.
              </p>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Hiperfocos / Interesses</label>
                  <input
                    type="text"
                    value={hyperfocuses}
                    onChange={(e) => setHyperfocuses(e.target.value)}
                    placeholder="Dinossauros, Sonic, Trens, Minecraft..."
                    className="input-neurovoz"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Sensibilidades Sensoriais (Gatilhos)</label>
                  <input
                    type="text"
                    value={sensitivities}
                    onChange={(e) => setSensitivities(e.target.value)}
                    placeholder="Sons altos, Texturas ásperas, Luzes fortes, Mudanças de rotina..."
                    className="input-neurovoz"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Personagens Favoritos</label>
                  <input
                    type="text"
                    value={favoriteCharacters}
                    onChange={(e) => setFavoriteCharacters(e.target.value)}
                    placeholder="Sonic, Mario, Buzz Lightyear..."
                    className="input-neurovoz"
                  />
                </div>
              </div>
            </div>

            {/* Guardian Profile Section */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-neurovoz-turquoise font-display font-bold">
                <User size={20} />
                <h2>Perfil do Responsável</h2>
              </div>
              <p className="text-xs text-neurovoz-dark/40 -mt-2">
                Informações para contato e identificação no relatório do tutor.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="input-neurovoz"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">E-mail</label>
                  <input
                    type="email"
                    required
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="input-neurovoz"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neurovoz-dark/70">Celular / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="input-neurovoz"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ia' && (
          <div className="space-y-6">
            {/* Gemini Connection Card */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-neurovoz-turquoise font-display font-bold">
                <Key size={20} />
                <h2>Integração com a IA do Google Gemini (Gratuito)</h2>
              </div>
              <p className="text-sm leading-relaxed text-neurovoz-dark/70">
                Por padrão, o NeuroVoZ utiliza um motor de simulação inteligente local. Para conversar de forma totalmente livre e dinâmica com uma IA real, você pode utilizar a sua própria chave do **Google Gemini API**. É totalmente **gratuita** no plano de desenvolvedor.
              </p>

              <div
                className="p-4 rounded-2xl space-y-2 text-xs"
                style={{ background: 'rgba(58,183,214,0.06)', border: '1px solid rgba(58,183,214,0.15)' }}
              >
                <div className="font-bold text-neurovoz-turquoise flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  Como obter sua chave de API gratuita:
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-neurovoz-dark/60">
                  <li>Acesse o <strong>Google AI Studio</strong> clicando no link: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-bold text-neurovoz-turquoise">Obter API Key</a>.</li>
                  <li>Faça login com sua conta do Google (Gmail).</li>
                  <li>Clique em <strong>"Create API Key"</strong>.</li>
                  <li>Copie a chave gerada (um código comprido) e cole no campo abaixo.</li>
                </ol>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neurovoz-dark/70">Chave de API do Gemini</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Cole aqui sua API Key (Ex: AIzaSy...)"
                  className="input-neurovoz"
                />
                <p className="text-xs text-neurovoz-dark/30">
                  Sua chave de API é armazenada de forma segura apenas localmente no seu próprio navegador e nunca é enviada a servidores de terceiros (exceto diretamente à API oficial do Google Gemini).
                </p>
              </div>

              {apiKey.trim() ? (
                <div className="flex items-center gap-2 text-xs text-green-500 font-bold bg-green-50 p-3 rounded-xl border border-green-200">
                  <Check size={14} />
                  Chave configurada. O NeuroVoZ está utilizando a Inteligência Artificial do Google Gemini!
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-600 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <Info size={14} />
                  Usando simulação inteligente integrada local (Sem conexão com a API externa).
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'geral' && (
          <div className="space-y-6">
            {/* General Preferences */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-neurovoz-turquoise font-display font-bold">
                <Volume2 size={20} />
                <h2>Acessibilidade & Interface</h2>
              </div>
              <p className="text-xs text-neurovoz-dark/40 -mt-2">
                Personalize aspectos visuais e auditivos do sistema para melhorar a experiência sensorial da criança.
              </p>

              <div className="divide-y divide-neurovoz-dark/5">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-bold text-neurovoz-dark">Síntese de Voz (Text-to-Speech)</div>
                    <div className="text-xs text-neurovoz-dark/50">Fazer a IA ler as respostas em voz alta ao receber mensagens.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neurovoz-turquoise"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-bold text-neurovoz-dark">Modo Escuro (Dark Mode)</div>
                    <div className="text-xs text-neurovoz-dark/50">Reduz a luminosidade da tela para crianças com alta sensibilidade à luz.</div>
                  </div>
                  <div className="flex bg-neurovoz-gray p-1 rounded-xl gap-1">
                    <button type="button" className="p-1.5 rounded-lg bg-white shadow-sm text-neurovoz-turquoise">
                      <Sun size={16} />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg text-neurovoz-dark/40 hover:text-neurovoz-dark">
                      <Moon size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-bold text-neurovoz-dark">Feedback Vibratório</div>
                    <div className="text-xs text-neurovoz-dark/50">Microvibração em celulares no envio de mensagens e botões.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neurovoz-turquoise"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 border-red-500/20 bg-red-50/5 space-y-4">
              <div className="flex items-center gap-2 text-red-500 font-display font-bold">
                <ShieldAlert size={20} />
                <h2>Zona de Segurança</h2>
              </div>
              <p className="text-xs text-neurovoz-dark/40 -mt-2">
                Ações irreversíveis de gerenciamento de dados locais da aplicação.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/10 bg-red-500/5">
                <div>
                  <div className="text-sm font-bold text-neurovoz-dark">Limpar conversas do chat</div>
                  <div className="text-xs text-neurovoz-dark/50">Apaga permanentemente o histórico do chat com a inteligência artificial.</div>
                </div>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500 hover:bg-red-600 transition-colors text-white font-bold rounded-xl text-xs flex-shrink-0"
                >
                  <Trash2 size={14} />
                  Limpar Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="btn-primary text-sm font-bold px-6 py-3"
          >
            Salvar Alterações
          </button>
        </div>
      </form>

      {/* Saved Toast */}
      {showSavedToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white font-bold text-sm px-4 py-3 rounded-2xl shadow-xl"
        >
          <Check size={18} />
          Configurações salvas com sucesso!
        </motion.div>
      )}

      {/* Clear Chat Toast */}
      {showClearToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-amber-500 text-white font-bold text-sm px-4 py-3 rounded-2xl shadow-xl"
        >
          <Trash2 size={18} />
          Histórico do chat limpo com sucesso!
        </motion.div>
      )}
    </div>
  )
}
