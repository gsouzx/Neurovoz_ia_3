import { Child, EmotionType, SupportLevel, useAppStore } from './store'

// ============================================
// Mock AI Engine for NeuroVoz I.A
// Simulates adaptive AI responses based on
// child's profile, support level and context
// ============================================

const EMOTION_RESPONSES: Record<EmotionType, string[]> = {
  happy: [
    'Que ótimo saber que você está feliz hoje! 😊 Isso me deixa feliz também!',
    'Eba! Felicidade é contagiante! ✨ Você quer me contar o que está te deixando tão feliz?',
  ],
  neutral: [
    'Entendo. Às vezes os dias são assim, nem bons nem ruins. Está tudo bem! 😊',
    'Ok! Quer fazer alguma atividade divertida para animar o dia?',
  ],
  sad: [
    'Percebi que você está um pouco triste hoje. Isso é completamente normal. Quer me contar o que aconteceu?',
    'Quando você fica triste, o que costuma te ajudar a se sentir melhor? Posso te ajudar com isso!',
  ],
  angry: [
    'Parece que você está com raiva agora. Isso é ok! Vamos respirar fundo juntos? Inspire... expire...',
    'Eu entendo que algo te deixou chateado. Você quer me contar o que aconteceu?',
  ],
  anxious: [
    'Percebi que você está ansioso. Vamos fazer um exercício de respiração para ajudar? 🌬️',
    'A ansiedade pode ser difícil. Você está em um lugar seguro. Vamos respirar juntos devagar.',
  ],
  excited: [
    'Uau! Você está super animado! 🎉 Me conta o que está te deixando tão empolgado!',
    'Essa energia boa é incrível! ⭐ O que está acontecendo de especial?',
  ],
}

const TOPIC_RESPONSES: Record<string, (child: Child) => string> = {
  dinossauros: (child) =>
    `Oh, ${child.name}! Dinossauros são INCRÍVEIS! 🦖 Você sabia que o T-Rex tinha dentes de até 30cm? Qual é o seu dinossauro favorito?`,
  trens: (child) =>
    `Trens são fascinantes, ${child.name}! 🚂 Você gosta mais de trens de vapor ou elétricos?`,
  minecraft: (child) =>
    `Minecraft é um dos jogos mais criativos que existem! ⛏️ Você gosta mais de construir ou de aventura, ${child.name}?`,
  sonic: (child) =>
    `Sonic é super rápido e corajoso! ⚡ Você gosta mais de qual fase do Sonic, ${child.name}?`,
  escola: (child) =>
    `Como foi a escola hoje, ${child.name}? Tem alguma matéria que você gosta mais?`,
  amigo: (child) =>
    `Amizades são muito importantes! 💙 Você quer praticar como cumprimentar as pessoas ou iniciar uma conversa?`,
  brincar: (child) =>
    `Brincar é ótimo! ⭐ Você quer uma história interativa ou um joguinho para fazer agora?`,
  ajuda: (child) =>
    `Claro que posso te ajudar! 😊 Me conta o que você precisa, ${child.name}.`,
}

function generateContextualResponse(input: string, child: Child): string {
  const lower = input.toLowerCase()

  // Check for emotion keywords
  if (lower.includes('triste') || lower.includes('chorand') || lower.includes('chorando')) {
    const responses = EMOTION_RESPONSES.sad
    const base = responses[Math.floor(Math.random() * responses.length)]
    if (child.favoriteCharacters.length > 0) {
      return `${base} Quando você fica triste, às vezes ajuda pensar em coisas que você gosta, como ${child.favoriteCharacters[0]}. O que acha?`
    }
    return base
  }

  if (lower.includes('feliz') || lower.includes('alegre') || lower.includes('ótimo') || lower.includes('bom')) {
    const responses = EMOTION_RESPONSES.happy
    return responses[Math.floor(Math.random() * responses.length)]
  }

  if (lower.includes('raiva') || lower.includes('bravo') || lower.includes('nervoso') || lower.includes('irritado')) {
    return EMOTION_RESPONSES.angry[Math.floor(Math.random() * EMOTION_RESPONSES.angry.length)]
  }

  if (lower.includes('ansioso') || lower.includes('preocupado') || lower.includes('medo')) {
    return EMOTION_RESPONSES.anxious[Math.floor(Math.random() * EMOTION_RESPONSES.anxious.length)]
  }

  // Check for topic matches
  for (const [topic, responseFunc] of Object.entries(TOPIC_RESPONSES)) {
    if (lower.includes(topic)) {
      return responseFunc(child)
    }
  }

  // Check for hyperfocuses
  for (const hyperfocus of child.hyperfocuses) {
    if (lower.includes(hyperfocus.toLowerCase())) {
      return `Ah, ${hyperfocus}! Eu sei que você ADORA isso, ${child.name}! 🌟 Me conta mais — o que você está pensando sobre ${hyperfocus} agora?`
    }
  }

  // Check for favorite characters
  for (const character of child.favoriteCharacters) {
    if (lower.includes(character.toLowerCase())) {
      return `${character} é incrível! ⭐ Você gostaria de ouvir uma história sobre ${character} ou tem algo especial que quer me contar?`
    }
  }

  // Support-level adapted fallback responses
  const fallbacks = getSupportLevelFallbacks(child.supportLevel, child.name)
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

function getSupportLevelFallbacks(level: SupportLevel, name: string): string[] {
  if (level === 1) {
    return [
      `Entendi! Conte-me mais sobre isso, ${name}. Estou aqui para ouvir e conversar 😊`,
      `Interessante! O que você pensa sobre isso? Adoro suas perspectivas!`,
      `Que tema fascinante! Como você se sente em relação a isso?`,
      `Vamos explorar esse assunto juntos! Você tem mais detalhes para me contar?`,
    ]
  } else if (level === 2) {
    return [
      `Legal! Me conta mais, ${name}! 😊`,
      `Entendi! Você quer fazer algo legal agora?`,
      `Boa ideia! O que você acha de explorarmos isso juntos?`,
      `Ok, ${name}! Quer uma atividade sobre esse assunto?`,
    ]
  } else {
    return [
      `Ok, ${name}! 😊 Mais! Me conta!`,
      `Boa, ${name}! Você quer brincar?`,
      `Entendi! Quer ver uma imagem bonita?`,
      `Legal! Quer ouvir uma história curta?`,
    ]
  }
}

export async function generateAIResponse(
  userMessage: string,
  child: Child,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{ content: string; emotionDetected?: EmotionType }> {
  // Simple emotion detection
  let emotionDetected: EmotionType | undefined
  const lower = userMessage.toLowerCase()
  if (lower.includes('feliz') || lower.includes('alegre') || lower.includes('bem')) emotionDetected = 'happy'
  else if (lower.includes('triste') || lower.includes('chorand') || lower.includes('choro') || lower.includes('mal')) emotionDetected = 'sad'
  else if (lower.includes('raiva') || lower.includes('bravo') || lower.includes('irritado') || lower.includes('nervoso')) emotionDetected = 'angry'
  else if (lower.includes('ansios') || lower.includes('medo') || lower.includes('preocupado')) emotionDetected = 'anxious'
  else if (lower.includes('animad') || lower.includes('empolgad') || lower.includes('eba')) emotionDetected = 'excited'

  // Get API key from store
  const apiKey = useAppStore.getState().geminiApiKey

  try {
    const response = await fetch('/api/dashboard/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mensagemUsuario: userMessage,
        historicoAnterior: conversationHistory.slice(-10), // Limitar histórico para as últimas 10 mensagens
        child,
        apiKey: apiKey?.trim() || undefined,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.respostaNeurovoz) {
        return { content: data.respostaNeurovoz.trim(), emotionDetected }
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.warn('Erro/Aviso da API Neurovoz:', errorData.error || response.statusText)
    }
  } catch (err) {
    console.error('Erro ao chamar a API local do Neurovoz:', err)
  }

  // Fallback to Mock AI if no API key or API call fails
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))
  const content = generateContextualResponse(userMessage, child)
  return { content, emotionDetected }
}

export function getSystemPrompt(child: Child): string {
  return `Você é NeuroVoZ, uma assistente de IA empática especializada em autismo.
Você está conversando com ${child.name}, ${child.age} anos.
Nível de suporte: ${child.supportLevel}.
Hiperfocos: ${child.hyperfocuses.join(', ')}.
Personagens favoritos: ${child.favoriteCharacters.join(', ')}.
Objetivos: ${child.developmentGoals.join(', ')}.

REGRAS IMPORTANTES:
- Adapte SEMPRE sua linguagem ao nível de suporte ${child.supportLevel}
  - Nível 1: linguagem natural, pode usar conceitos abstratos
  - Nível 2: linguagem simples, direta, com exemplos concretos
  - Nível 3: frases muito curtas, simples, com emojis visuais
- Seja SEMPRE acolhedora, paciente e positiva
- Use os hiperfocos para criar conexões e engajamento
- Reforce comportamentos positivos
- Em momentos de crise emocional, ofereça regulação antes de qualquer outra coisa
- Nunca corrija de forma negativa, sempre reformule de forma positiva`
}

// ---- SOS Strategies ----

export const SOS_STRATEGIES = [
  {
    id: '1',
    title: 'Respiração 4-7-8',
    description: 'Inspire por 4 segundos, segure por 7, expire por 8.',
    icon: '🌬️',
    duration: 60,
  },
  {
    id: '2',
    title: 'Técnica 5-4-3-2-1',
    description: 'Encontre 5 coisas que você vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia.',
    icon: '👁️',
    duration: 120,
  },
  {
    id: '3',
    title: 'Apertar e soltar',
    description: 'Aperte as mãos com força por 5 segundos, depois solte devagar.',
    icon: '✊',
    duration: 30,
  },
  {
    id: '4',
    title: 'Lugar seguro',
    description: 'Imagine seu lugar favorito e seguro. Como você se sente lá?',
    icon: '🏡',
    duration: 90,
  },
  {
    id: '5',
    title: 'Música relaxante',
    description: 'Coloque sua música favorita e fique quieto por um momento.',
    icon: '🎵',
    duration: 180,
  },
]
