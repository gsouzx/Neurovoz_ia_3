import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mensagemUsuario, historicoAnterior, child, apiKey } = body

    // 1. Identificar a API Key
    const finalApiKey = apiKey || process.env.GEMINI_API_KEY
    if (!finalApiKey) {
      console.warn('\n=== [NeuroVoz] AVISO: Sem chave de API ===')
      console.warn('Nenhuma chave encontrada no .env.local ou enviada pelo cliente.')
      console.warn('=========================================\n')
      return NextResponse.json(
        { error: 'Chave de API do Gemini não fornecida. Configure no arquivo .env.local ou nas Configurações do painel.' },
        { status: 400 }
      )
    }

    if (!mensagemUsuario) {
      return NextResponse.json(
        { error: 'A mensagem do usuário é obrigatória.' },
        { status: 400 }
      )
    }

    // Mascarar a chave para exibir de forma segura no terminal
    const keySource = apiKey ? 'Painel de Configurações (Cliente)' : 'Arquivo .env.local (Servidor)'
    const maskedKey = finalApiKey.length > 10 
      ? `${finalApiKey.substring(0, 6)}...${finalApiKey.substring(finalApiKey.length - 4)}`
      : 'Chave inválida/curta'

    console.log(`\n=== [NeuroVoz] Requisição de Chat Recebida ===`)
    console.log(`- Origem da Chave: ${keySource}`)
    console.log(`- Chave Utilizada: ${maskedKey}`)
    console.log(`- Usuário: ${child?.name || 'Criança'} (Nível de Suporte: ${child?.supportLevel || 2})`)
    console.log(`- Mensagem do Usuário: "${mensagemUsuario}"`)

    // 2. Inicializar o cliente oficial da Google GenAI
    const ai = new GoogleGenAI({ apiKey: finalApiKey })

    // 3. Prompt do Sistema (Instrução Jarvis / Neurovoz)
    const BASE_SYSTEM_INSTRUCTION = `Você é o Neurovoz, um agente de IA especializado, paciente e acolhedor, projetado para interagir com pessoas autistas e ajudá-las a desenvolver habilidades sociais e de comunicação. Sua interface é estilo Jarvis: inteligente, focada e direta.

Siga rigorosamente estas diretrizes de comportamento:
1. LINGUAGEM LITERAL E CLARA: Nunca use ironias, sarcasmo, metáforas complexas, figuras de linguagem ou expressões de duplo sentido. Pessoas autistas podem interpretar tudo de forma literal.
2. COMUNICAÇÃO EM ETAPAS: Faça apenas UMA pergunta ou proponha UMA ação por vez. Não sobrecarregue o usuário com parágrafos longos ou listas extensas.
3. VALIDAÇÃO EMOCIONAL: Sempre reconheça e valide explicitamente o estado emocional do usuário (Ex: "Entendo que você está se sentindo frustrado com esse barulho, e está tudo bem se sentir assim. Quer conversar sobre outra coisa?").
4. ESTRUTURAÇÃO VISUAL: Quando apropriado, use frases curtas e pule linhas para facilitar a leitura e o processamento visual da informação.
5. TOM DE VOZ: Mantenha um tom de voz calmo, encorajador, previsível e seguro. Evite respostas ambíguas.`

    // Personalização baseada nos dados da criança, se fornecidos
    let systemInstruction = BASE_SYSTEM_INSTRUCTION
    if (child) {
      systemInstruction += `\n\nVocê está conversando com a criança:
- Nome: ${child.name} (${child.age} anos)
- Nível de suporte TEA: Nível ${child.supportLevel}
- Hiperfocos: ${child.hyperfocuses?.join(', ') || 'Nenhum'}
- Personagens favoritos: ${child.favoriteCharacters?.join(', ') || 'Nenhum'}
- Objetivos de desenvolvimento: ${child.developmentGoals?.join(', ') || 'Nenhum'}

Regras específicas por nível de suporte:
- Nível 1: Linguagem natural, pode usar conceitos abstratos simples de forma clara.
- Nível 2: Linguagem simples, direta, estruturada e com exemplos concretos.
- Nível 3: Frases muito curtas, simples, focadas e com o apoio de emojis visuais.`
    }

    // 4. Formatar o histórico para a API do Gemini
    const formattedHistory = (historicoAnterior || []).map((msg: any) => {
      const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user'
      const text = msg.content || (msg.parts?.[0]?.text) || ''
      return {
        role,
        parts: [{ text }]
      }
    })

    // 5. Enviar a mensagem com fallback de modelo caso ocorra erro 404
    let respostaTexto = ''
    try {
      console.log(`- Iniciando chat com o modelo: gemini-1.5-flash...`)
      const chat = ai.chats.create({
        model: 'gemini-1.5-flash',
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.6,
        },
        history: formattedHistory
      })
      const resultado = await chat.sendMessage({
        message: mensagemUsuario
      })
      respostaTexto = resultado.text || ''
    } catch (err: any) {
      const errMsg = err.message || ''
      if (err.status === 404 || errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('not supported')) {
        console.warn(`[NeuroVoz] Modelo gemini-1.5-flash indisponível (404/Não suportado). Tentando fallback com gemini-2.5-flash...`)
        const fallbackChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.6,
          },
          history: formattedHistory
        })
        const resultado = await fallbackChat.sendMessage({
          message: mensagemUsuario
        })
        respostaTexto = resultado.text || ''
      } else {
        throw err
      }
    }

    console.log(`[NeuroVoz] Conexão com I.A: OK. Resposta gerada com sucesso!`)
    console.log(`=== [NeuroVoz] Fim da Requisição ===\n`)

    // 7. Retornar resposta
    return NextResponse.json({
      respostaNeurovoz: respostaTexto
    })

  } catch (error: any) {
    console.error('\n=== [NeuroVoz] ERRO NA CONEXÃO COM A I.A ===')
    console.error('Mensagem de erro:', error.message || error)
    if (error.status) {
      console.error('Código HTTP:', error.status)
    }
    console.error('===========================================\n')
    return NextResponse.json(
      { error: 'Erro ao processar o diálogo.', details: error.message || error },
      { status: 500 }
    )
  }
}
