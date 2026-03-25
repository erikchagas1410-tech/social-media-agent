import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import winston from 'winston';
import Groq from 'groq-sdk';

// Carrega .env e depois .env.local (local sobrescreve)
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });
console.log('[DEBUG] Env carregado. INSTAGRAM_ACCOUNT_ID:', process.env.INSTAGRAM_ACCOUNT_ID ? 'OK' : 'FALTANDO');

// Logo embutido como base64 (sem dependência de HTTP request no Vercel)
const LOGO_DATA_URL: string = (() => {
  try {
    const p = path.resolve(__dirname, '../public/logo-erizon.png');
    if (fs.existsSync(p)) return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
  } catch { /* fallback para HTTP */ }
  return '';
})();

const transports: winston.transport[] = [new winston.transports.Console()];
if (!process.env.VERCEL) {
  transports.push(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'combined.log', level: 'info' }));
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  transports,
});

// ============================================================
// ERIZON BRAND BIBLE — conhecimento completo do agente
// ============================================================
const ERIZON_BRAND_CONTEXT = `
=== ERIZON: BRAND BIBLE COMPLETO ===

TAGLINE: "Inteligência que antecipa. Performance que escala."
ESSÊNCIA: SaaS de inteligência operacional para gestores de tráfego e agências de performance. Transforma dados de anúncios em decisões automáticas e em tempo real.
PROPOSTA ÚNICA: Não é mais um dashboard de métricas. É o copiloto que nunca dorme — detecta problemas ANTES de custarem dinheiro e entrega AÇÕES, não relatórios.
ARQUÉTIPO: O Mago (transforma caos em clareza) + O Sábio (dados e decisão sem ruído)

PÚBLICO-ALVO:
- Gestores de tráfego que querem sair do operacional
- Agências que gerenciam múltiplos clientes com verba expressiva
- Times de marketing com budget significativo no Meta Ads

PRODUTOS:
1. PULSE: Health score diário das campanhas. Alertas Telegram em tempo real. Para quem quer o estado real das campanhas sem abrir o gerenciador.
2. DECISION FEED: Feed de ações práticas geradas por IA. O que pausar, escalar ou ajustar — com o porquê. Fim da adivinhação.
3. RISK RADAR: Diagnóstico de causa raiz. Detecta fadiga de criativo e saturação de público antes de destruírem o ROAS.
4. COPILOTO IA: Analista neural conversacional. Responde perguntas sobre campanhas em linguagem natural, 24h por dia.
5. ANALYTICS: Multi-plataforma — Meta, Google, TikTok e LinkedIn. Um único dashboard, sem planilha.
6. CRM: Pipeline de leads do clique ao fechamento. ROAS real, não o que o Meta inventa.

PLANOS:
- Core (R$97/mês): Até 3 clientes, Pulse, Alertas Telegram, Benchmarks por nicho, Histórico 30 dias
- Pro (R$297/mês): Até 15 clientes, Analytics, Decision Feed, Risk Radar, Copiloto IA, Histórico 90 dias
- Command (R$497/mês): Clientes ilimitados, Autopilot (pausa/escala automático), CRM completo, Creative Lab IA, Portal + Whitelabel

TOM DE VOZ:
✅ A ERIZON É: Visionária (antecipa antes de acontecer), Direta (fala de ROI, lucro e escala), Parceira (copiloto, não substituto), Técnica sem ser hermética, Confiante e fundamentada em dados.
❌ A ERIZON NÃO É: Alarmista (traz solução, não pânico), Complexa (simplifica o dado), Soberba (oferece inteligência, não ordens), Genérica (fala de performance real), Passiva (sempre propõe próximo passo).

MANIFESTO: "A era da gestão de tráfego reativa acabou. Por anos, o gestor foi treinado para ser um operário de cliques — abrir o gerenciador, cruzar os dedos e torcer para o ROI aparecer. Isso não é estratégia. Isso é sobrevivência. A fadiga de criativos devora o lucro silenciosamente. A saturação de público chega sem avisar. A Erizon nasceu para mudar isso. Enquanto outros olham para o que aconteceu, a Erizon mostra o que vai acontecer. Não somos um dashboard — somos o copiloto que nunca dorme."

PALETA: Deep Space #0B0112 | Electric Purple #BC13FE | Cyber Pink #FF00E5 | Data Teal #00F2FF | Pure White #FFFFFF
TIPOGRAFIA: Syne ExtraBold (títulos) | Plus Jakarta Sans (corpo/UI) | JetBrains Mono (dados/métricas)

=== ESTRATÉGIA VIRAL ===

PILARES EDITORIAIS (VARIE SEMPRE — nunca repita o mesmo consecutivo):
- RISK RADAR: Campanhas zumbi, saturação de frequência, fadiga de criativo, ROAS destruído silenciosamente
- DECISION FEED: Fim da adivinhação, ações concretas com dados, precisão nas decisões de budget
- COPILOTO 24/7: IA que monitora quando você dorme, alertas em tempo real, inteligência proativa
- ANTI-VAIDADE: ROAS de break-even vs ROAS de vaidade, CPL real, métricas que mentem vs que salvam
- ESCALA SEM DOR: Crescer budget sem crescer equipe, automação inteligente, alavancagem com IA
- AUTORIDADE DE MERCADO: O que as top agências já usam, dados de mercado, benchmarks de nicho

FÓRMULAS DE HOOK QUE VIRALIZAM:
1. CHOQUE DE VERDADE: "Seu ROAS alto pode estar te matando."
2. DADO SURPRESA: "87% das campanhas com CTR bom têm frequência acima do limite."
3. ERRO COMUM: "3 erros que queimam 40% do seu budget (e o Meta não vai te contar)."
4. FOMO DE ELITE: "O que as agências top 1% sabem que você ainda não descobriu."
5. ANTI-MITO: "ROAS 4x não é lucro. Aprenda a diferença."
6. ANTES/DEPOIS: "Antes: 4h em planilha. Depois: 2 minutos com Erizon."

HASHTAGS: #GestordeTrafego #MetaAds #Erizon #InteligenciaOperacional #MarketingDigital #TrafegoPago #Performance #AgenciaDigital #ROAS #FacebookAds
`;

type PostType = 'instagram-feed' | 'instagram-story' | 'instagram-carousel' | 'linkedin';

interface PostContent {
  eyebrow: string;
  h1: string;
  sub: string;
  caption: string;
  supporting?: string[];
  stats?: Array<{ value: string; label: string }>;
  formatHint?: 'fact' | 'checklist' | 'stats';
}

interface CarouselContent {
  slides: Array<{ eyebrow: string; h1: string; sub: string }>;
  caption: string;
}

interface PostMemoryEntry {
  platform: PostType | 'strategy';
  eyebrow: string;
  h1: string;
  caption: string;
  angle?: string;
  createdAt?: string;
}

interface StrategyPlan {
  positioning: string[];
  instagram: string[];
  linkedin: string[];
  growthLoops: string[];
  weeklyCadence: string[];
}

interface ImagePayload {
  base64: string;
  mimeType: string;
  extension: 'png' | 'jpg' | 'jpeg' | 'webp';
}

function parseImagePayload(imageInput: string): ImagePayload {
  const match = imageInput.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (match) {
    const mimeType = match[1].toLowerCase();
    const base64 = match[2];
    const extension = mimeType === 'image/png'
      ? 'png'
      : mimeType === 'image/webp'
        ? 'webp'
        : 'jpg';
    return { base64, mimeType, extension };
  }

  return { base64: imageInput, mimeType: 'image/jpeg', extension: 'jpg' };
}

type EditorialTab = 'erizon' | 'specialists' | 'market' | 'diagnostics' | 'stories' | 'social-proof' | 'anti-myth' | 'series' | 'uploads';

const TAB_CONTEXTS: Record<string, string> = {
  'erizon': 'Foque 100% na ERIZON: o que a plataforma calcula, como funciona o copiloto, pulse, decision feed, risk radar. Provas de valor, economia de tempo, bastidores, objeções comuns.',
  'specialists': 'Foque em dicas de especialistas: interpretação de ROAS, CPA, frequência, CTR. Erros de escala, sinais de fadiga de criativo, checklists e frameworks de otimização no Meta/Google Ads.',
  'market': 'Foque em notícias e atualizações de mercado: mudanças no Meta Ads, novidades de tracking, IA, criativos e leitura estratégica para quem compra mídia.',
  'diagnostics': 'Foque em diagnósticos de cenário real: ex: "ROAS caiu 30%", "frequência 4.2", "campanha boa no CTR, ruim no lucro". O que olhar primeiro, como resolver.',
  'stories': 'Foque em stories interativos: enquetes, quiz, pergunta aberta, reações. Crie conteúdo que force a resposta ou voto da audiência.',
  'social-proof': 'Foque em prova social: antes/depois, tempo economizado, problema detectado antes da perda, cases resumidos.',
  'anti-myth': 'Foque em quebrar mitos: "ROAS alto não significa lucro", "mais orçamento não corrige campanha ruim", "dashboard não é decisão".',
  'series': 'Foque em uma série fixa: "Radar da Semana", "Erro Caro", "Decisão de Hoje", "Raio-X de Campanha" ou "1 Minuto de Operação".',
  'uploads': 'Foque em feedback de clientes: celebre um resultado, agradeça o cliente, crie um hook mostrando que o método funciona. Se houver contexto adicional do usuário, use-o.'
};

// ============================================================
// AGENT CLASS
// ============================================================
class SocialMediaAgent {
  constructor() {
    logger.info('ERIZON Social Media Agent inicializado');
  }

  private buildRecentPostsBlock(recentPosts: PostMemoryEntry[] = []): string {
    if (!recentPosts.length) return 'SEM HISTORICO RECENTE.';

    return recentPosts
      .slice(-12)
      .map((post, idx) => {
        const parts = [
          `#${idx + 1}`,
          `plataforma=${post.platform}`,
          `eyebrow=${post.eyebrow || '-'}`,
          `h1=${post.h1 || '-'}`,
          `angulo=${post.angle || '-'}`,
          `caption=${(post.caption || '').slice(0, 180)}`
        ];
        return parts.join(' | ');
      })
      .join('\n');
  }

  async generatePost(postType: PostType = 'instagram-feed', recentPosts: PostMemoryEntry[] = [], editorialTab: string = 'erizon', uploadContext: string = ''): Promise<PostContent> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return {
          eyebrow: '// ERRO',
          h1: 'Sem <span class="grad">Chave API</span>',
          sub: 'Configure a GROQ_API_KEY no Vercel.',
          caption: 'Sem a chave da API do Groq, a IA não pode gerar novos textos.'
        };
      }

      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const platformHints: Record<PostType, string> = {
        'instagram-feed': 'Feed Instagram (1080x1080). Hook visual poderoso. Caption até 2.200 chars com quebras de linha, emojis estratégicos e CTA para salvar/compartilhar.',
        'instagram-story': 'Story Instagram. Conteúdo rápido, impactante, que gera resposta/swipe. H1 ainda mais curto e chocante. Caption máximo 3 linhas, muito direto.',
        'instagram-carousel': 'SLIDE 1 (capa) de um carrossel. Hook DEVASTADOR que obrigue a deslizar. Use padrão de curiosidade irresistível ou choque. Caption completa como post solo.',
        'linkedin': 'Feed LinkedIn para profissionais de marketing. Tom analítico e de autoridade. Caption mais longa com insights e dados. Menos emojis, mais substância. 3-5 hashtags profissionais.'
      };

      const tabPrompt = TAB_CONTEXTS[editorialTab] || TAB_CONTEXTS['erizon'];
      let userContext = `Gere um conteúdo VIRAL e INÉDITO para a ERIZON. Escolha um pilar editorial inesperado, com potencial real de engajamento e aquisição. Não repita o histórico recente. Tipo: ${postType}`;
      
      if (editorialTab === 'uploads' && uploadContext) {
        userContext = `Gere um conteúdo VIRAL baseado neste feedback/print enviado pelo usuário: "${uploadContext}". Destaque o resultado, crie um hook forte e uma prova social inquestionável. Tipo: ${postType}`;
      }

      const systemPrompt = `Você é o estrategista-chefe de marketing e social media da ERIZON — especialista em criar conteúdo viral que engaja gestores de tráfego, faz o perfil explodir e gera leads qualificados no Brasil.

${ERIZON_BRAND_CONTEXT}

TIPO DE POST: ${platformHints[postType]}
FOCO EDITORIAL: ${tabPrompt}

HISTORICO RECENTE DE POSTS DA ERIZON:
${this.buildRecentPostsBlock(recentPosts)}

REGRAS ABSOLUTAS DE COPYWRITING VIRAL:
1. H1 deve PARAR O SCROLL: máximo 6 palavras, cria curiosidade OU choca OU faz o leitor concordar instantaneamente
2. Cada post foca em UM único pilar editorial — nunca misture temas
3. Caption: hook → desenvolvimento → dado/prova → CTA (salva / comenta / compartilha)
4. Nunca use linguagem corporativa genérica. Fale como expert que domina tráfego pago
5. Use dados e números específicos quando relevante (aumentam autoridade e credibilidade)
6. H1: MÁXIMO 6 PALAVRAS com <br> na metade e <span class='grad'>palavra-impacto</span> na palavra mais forte
7. Nunca repita ângulo, promessa, dor principal ou CTA dominante do histórico recente
8. Instagram deve maximizar salvamento, compartilhamento e resposta no direct
9. LinkedIn deve maximizar autoridade, clareza estratégica e percepção premium da ERIZON
10. O card precisa ter densidade visual e intelectual: headline forte + subtítulo mais desenvolvido + blocos auxiliares de conteúdo
11. Sempre que possível, inclua checklist, mini-provas, comparativos curtos ou métricas rápidas inspiradas em posts premium de performance marketing

RETORNE OBRIGATORIAMENTE UM JSON VÁLIDO:
{
  "eyebrow": "// Categoria (ex: // Risk Radar | // Decision Feed | // Anti-Vaidade | // Copiloto IA)",
  "h1": "Máx 6 palavras com <br> e <span class='grad'>palavra</span>",
  "sub": "Subtítulo até 26 palavras com <strong> na parte que mais convence",
  "supporting": ["bloco curto 1", "bloco curto 2", "bloco curto 3"],
  "stats": [{"value":"3x","label":"mais rápido"},{"value":"24h","label":"monitoramento"},{"value":"-28%","label":"desperdício"}],
  "formatHint": "fact ou checklist ou stats",
  "caption": "Caption viral completa com emojis, dados, CTA e hashtags estratégicas."
}`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContext }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.92,
        response_format: { type: 'json_object' }
      });

      const jsonContent = response.choices[0]?.message?.content || '{}';
      return JSON.parse(jsonContent);
    } catch (error) {
      logger.error('Erro ao gerar post:', error);
      return {
        eyebrow: '// Risk Radar',
        h1: 'Seu ROAS<br><span class="grad">mente.</span>',
        sub: 'ROAS de vaidade destrói margem sem fazer barulho. <strong>Aprenda a separar número bonito de operação saudável.</strong>',
        supporting: [
          'ROAS alto não garante lucro.',
          'Frequência subindo pode mascarar queda de eficiência.',
          'Break-even real decide se escalar faz sentido.'
        ],
        stats: [
          { value: '24h', label: 'alerta crítico' },
          { value: '3x', label: 'mais clareza' },
          { value: '-28%', label: 'gasto evitado' }
        ],
        formatHint: 'stats',
        caption: '🚨 Seu ROAS está alto, mas sua margem está caindo?\n\nIsso não é coincidência. É a armadilha das métricas de vaidade.\n\nA Erizon calcula o ROAS de break-even real das suas campanhas — e te diz exatamente quando o "sucesso" está te custando dinheiro.\n\nSalve esse post. Você vai precisar. 📌\n\n#GestordeTrafego #MetaAds #Erizon #ROAS #Performance'
      };
    }
  }

  async generateCarousel(recentPosts: PostMemoryEntry[] = [], editorialTab: string = 'erizon'): Promise<CarouselContent> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return {
          slides: [{ eyebrow: '// ERRO', h1: 'Sem <span class="grad">Chave API</span>', sub: 'Configure a GROQ_API_KEY.' }],
          caption: 'Configure a chave API.'
        };
      }

      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const systemPrompt = `Você é o estrategista-chefe de social media da ERIZON — expert em criar carrosseis virais que explodem no Instagram e geram centenas de salvamentos.

${ERIZON_BRAND_CONTEXT}

HISTÓRICO RECENTE DE POSTS DA ERIZON:
${this.buildRecentPostsBlock(recentPosts)}

ESTRUTURA DO CARROSSEL (5 slides obrigatórios):
- Slide 1 (CAPA/HOOK): Hook DEVASTADOR que force a pessoa a deslizar. Padrão de choque ou curiosidade irresistível. É o mais importante.
- Slide 2 (PROBLEMA): Aprofunda a dor — gestores perdendo dinheiro sem perceber
- Slide 3 (REVELAÇÃO): O insight que muda tudo — dado, descoberta, erro que cometem
- Slide 4 (SOLUÇÃO): Como a Erizon resolve — específico, um produto, um benefício concreto
- Slide 5 (CTA): Call-to-action poderoso — salva, compartilha, comenta "quero saber mais", ou testa

REGRAS POR SLIDE:
- eyebrow: categoria do slide (ex: // O Problema | // A Revelação | // A Solução)
- h1: MÁXIMO 5 PALAVRAS com <br> na metade e <span class='grad'> na palavra de impacto
- sub: até 12 palavras com <strong> no trecho mais forte
- A narrativa deve fluir — quem desliza deve sentir progressão e curiosidade crescente
- Nunca repita hook, dor principal, promessa ou CTA dominante do histórico recente
- A solução precisa aumentar o desejo de conhecer a plataforma ERIZON

CAPTION: conta a história toda, inclui todos os insights dos slides, termina com CTA forte e hashtags.

RETORNE JSON VÁLIDO:
{
  "slides": [
    { "eyebrow": "string", "h1": "string", "sub": "string" },
    { "eyebrow": "string", "h1": "string", "sub": "string" },
    { "eyebrow": "string", "h1": "string", "sub": "string" },
    { "eyebrow": "string", "h1": "string", "sub": "string" },
    { "eyebrow": "string", "h1": "string", "sub": "string" }
  ],
  "caption": "string"
}`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Crie um carrossel VIRAL e inédito para a ERIZON. Escolha um ângulo que ninguém viu. Narrativa progressiva que vicia quem desliza e aumenta a percepção de valor da plataforma.' }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.9,
        response_format: { type: 'json_object' }
      });

      const jsonContent = response.choices[0]?.message?.content || '{}';
      return JSON.parse(jsonContent);
    } catch (error) {
      logger.error('Erro ao gerar carrossel:', error);
      return {
        slides: [
          { eyebrow: '// Risk Radar', h1: 'Você está<br><span class="grad">perdendo dinheiro.</span>', sub: 'E provavelmente <strong>não sabe disso.</strong>' },
          { eyebrow: '// O Problema', h1: 'Frequência<br><span class="grad2">acima do limite.</span>', sub: 'Quando seu público já viu o anúncio <strong>vezes demais.</strong>' },
          { eyebrow: '// A Revelação', h1: 'ROAS cai.<br><span class="grad3">Budget sobe.</span>', sub: 'A combinação que <strong>destrói a margem silenciosamente.</strong>' },
          { eyebrow: '// A Solução', h1: 'Risk Radar<br><span class="grad">detecta antes.</span>', sub: 'Alertas em tempo real antes <strong>de você perder R$1.</strong>' },
          { eyebrow: '// Próximo Passo', h1: 'Comece<br><span class="grad">agora.</span>', sub: 'Teste a Erizon e veja suas campanhas <strong>em outro nível.</strong>' }
        ],
        caption: '🎯 Você sabe quando uma campanha começa a saturar?\n\nA maioria dos gestores descobre DEPOIS — quando o ROAS já caiu e o budget já foi embora.\n\nO Risk Radar da Erizon detecta fadiga de criativo e saturação de público ANTES de custarem dinheiro.\n\nDeslize para entender como. 👉\n\n#GestordeTrafego #MetaAds #Erizon #RiskRadar #TrafegoPago #Performance'
      };
    }
  }

  async generateStrategy(): Promise<StrategyPlan> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return {
          positioning: [
            'Posicione a ERIZON como sistema de inteligência operacional, não como dashboard.',
            'Mostre antecipação de risco, automação e ganho de margem como diferencial central.',
            'Comunique a plataforma como copiloto premium para agências e gestores de tráfego.'
          ],
          instagram: [
            'Alternar posts de choque, prova, bastidor e tutorial curto.',
            'Transformar cada feed em stories derivados com enquete, caixa de pergunta e CTA.',
            'Usar carrosséis com promessa clara de ganho ou prevenção de perda.',
            'Fechar a semana com CTA de salvar, compartilhar ou responder no direct.'
          ],
          linkedin: [
            'Publicar opinião forte sobre performance, diagnóstico e operação de agências.',
            'Transformar aprendizados do produto em frameworks e pontos de vista.',
            'Usar narrativas de eficiência operacional e decisão com dados.',
            'Fechar posts com tese prática e próximo passo claro.'
          ],
          growthLoops: [
            'Recortar cada post forte em story, comentário, carrossel e vídeo curto.',
            'Usar perguntas da audiência como backlog editorial.',
            'Criar séries reconhecíveis para estimular retorno ao perfil.'
          ],
          weeklyCadence: [
            '3 posts de Instagram feed por semana, 5 a 7 stories e 2 posts no LinkedIn.',
            '1 carrossel estratégico por semana para gerar salvamentos.',
            'Revisar comentários, compartilhamentos e salvamentos antes de definir a próxima pauta.'
          ]
        };
      }

      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Você é o estrategista de crescimento da ERIZON.

${ERIZON_BRAND_CONTEXT}

Monte um plano prático para acelerar reconhecimento, seguidores e aquisição no Instagram e no LinkedIn.
O foco é gerar autoridade rápida, clareza de posicionamento e conteúdo que converta curiosidade em interesse comercial.

Retorne JSON válido neste formato:
{
  "positioning": ["string", "string", "string"],
  "instagram": ["string", "string", "string", "string"],
  "linkedin": ["string", "string", "string", "string"],
  "growthLoops": ["string", "string", "string"],
  "weeklyCadence": ["string", "string", "string"]
}`
          },
          {
            role: 'user',
            content: 'Crie uma estratégia exclusiva da ERIZON para crescer rápido com conteúdo premium, futurista e orientado à aquisição.'
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const jsonContent = response.choices[0]?.message?.content || '{}';
      return JSON.parse(jsonContent);
    } catch (error) {
      logger.error('Erro ao gerar estratégia:', error);
      return {
        positioning: [
          'Fale de previsão, margem e decisão automatizada em vez de vaidade e dashboards.',
          'Ancore a ERIZON como copiloto premium para agências e gestores de tráfego.',
          'Mostre futuros problemas evitados, não só resultados passados.'
        ],
        instagram: [
          'Priorize hooks de risco, erro caro, oportunidade perdida e antes/depois.',
          'Use carrosséis e capas com promessa forte e visual futurista variado.',
          'Transforme cada feed em stories derivados com enquete, caixa de pergunta e CTA.',
          'Reforce comentários e DMs como canal de qualificação.'
        ],
        linkedin: [
          'Publique diagnósticos de mercado, frameworks e opiniões fortes sobre operação de performance.',
          'Abra posts com fricção intelectual e feche com tese prática.',
          'Use prova, dados e narrativas de eficiência operacional.',
          'Conecte cada post ao valor de negócio da ERIZON.'
        ],
        growthLoops: [
          'Recicle posts que performaram em novos formatos sem repetir o mesmo hook.',
          'Use perguntas, comentários e objeções como backlog editorial.',
          'Crie séries reconhecíveis para gerar retorno recorrente ao perfil.'
        ],
        weeklyCadence: [
          'Segunda: hook de dor. Quarta: carrossel. Sexta: prova ou CTA comercial.',
          'Mantenha stories ativos nos dias de post e nos dias seguintes para capturar resposta.',
          'Revise posts salvos, compartilhados e comentados para decidir a próxima pauta.'
        ]
      };
    }
  }

  async postToSocialMedia(content: string, imageUrl: string, imageBase64: string, platforms: string[] = ['instagram', 'linkedin']): Promise<string[]> {
    const results: string[] = [];

    if (platforms.includes('linkedin')) {
      try {
        await this.postToLinkedIn(content, imageBase64);
        results.push('💼 LinkedIn: Sucesso');
      } catch (error: any) {
        results.push(`💼 LinkedIn: Erro (${error.message || 'Sem chave'})`);
      }
    }

    if (platforms.includes('instagram')) {
      try {
        await this.postToInstagramFeed(content, imageUrl);
        results.push('📸 Instagram Feed: Sucesso');
      } catch (error: any) {
        results.push(`📸 Instagram Feed: Erro (${error.message || 'Sem chave'})`);
      }
    }

    if (platforms.includes('instagram-story')) {
      try {
        await this.postToInstagramStory(imageUrl);
        results.push('📱 Instagram Story: Sucesso');
      } catch (error: any) {
        results.push(`📱 Instagram Story: Erro (${error.message || 'Sem chave'})`);
      }
    }

    return results;
  }

  private async waitForInstagramMediaReady(creationId: string, token: string): Promise<void> {
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 3000)); // Espera 3 segundos
      const res = await fetch(`https://graph.facebook.com/v18.0/${creationId}?fields=status_code&access_token=${token}`);
      if (res.ok) {
        const data = await res.json() as any;
        if (data.status_code === 'FINISHED' || data.status_code === 'PUBLISHED') return;
        if (data.status_code === 'ERROR') throw new Error(`O Instagram falhou ao processar a mídia ${creationId}.`);
        logger.info(`Aguardando mídia ${creationId} ficar pronta... Status: ${data.status_code}`);
      }
    }
    logger.warn(`Timeout ao aguardar mídia ${creationId}. O Instagram pode recusar a publicação.`);
  }

  async postCarouselToInstagram(imageUrls: string[], caption: string): Promise<string> {
    if (imageUrls.some(url => url.startsWith('data:'))) {
      throw new Error('O Meta exige uma URL pública para as imagens. Adicione a variável IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN no seu arquivo .env.');
    }

    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
      throw new Error('Credenciais Instagram não configuradas.');
    }

    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    // 1. Cria containers para cada slide
    const childIds: string[] = [];
    for (const imageUrl of imageUrls) {
      const res = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, is_carousel_item: true, access_token: token })
      });
      if (!res.ok) throw new Error(`Erro ao criar slide: ${await res.text()}`);
      const data = await res.json() as any;
      await this.waitForInstagramMediaReady(data.id, token);
      childIds.push(data.id);
    }

    // 2. Cria container do carrossel
    const carouselRes = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'CAROUSEL',
        children: childIds.join(','),
        caption,
        access_token: token
      })
    });
    if (!carouselRes.ok) throw new Error(`Erro ao criar carrossel: ${await carouselRes.text()}`);
    const carouselData = await carouselRes.json() as any;

    await this.waitForInstagramMediaReady(carouselData.id, token);

    // 3. Publica
    const publishRes = await fetch(`https://graph.facebook.com/v18.0/${accountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: carouselData.id, access_token: token })
    });
    if (!publishRes.ok) throw new Error(`Erro ao publicar carrossel: ${await publishRes.text()}`);
    const publishData = await publishRes.json() as any;

    logger.info(`Carrossel publicado no Instagram: ${publishData.id}`);
    return publishData.id;
  }

  private async postToLinkedIn(content: string, imageInput: string): Promise<void> {
    if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_PERSON_URN) {
      throw new Error('LINKEDIN_ACCESS_TOKEN não configurada.');
    }

    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    const personUrn = process.env.LINKEDIN_PERSON_URN;

    const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: `urn:li:person:${personUrn}`,
          serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }]
        }
      })
    });
    if (!registerRes.ok) throw new Error(`LinkedIn Upload Register failed: ${await registerRes.text()}`);

    const registerData = await registerRes.json() as any;
    const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const assetUrn = registerData.value.asset;

    const image = parseImagePayload(imageInput);
    const buffer = Buffer.from(image.base64, 'base64');
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT', body: buffer,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': image.mimeType }
    });
    if (!uploadRes.ok) throw new Error(`LinkedIn Image Upload failed: ${await uploadRes.text()}`);

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'X-Restli-Protocol-Version': '2.0.0', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: `urn:li:person:${personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: content },
            shareMediaCategory: 'IMAGE',
            media: [{ status: 'READY', media: assetUrn, title: { text: 'Publicação ERIZON' } }]
          }
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
      })
    });
    if (!response.ok) throw new Error(`LinkedIn API ${response.status}: ${await response.text()}`);
    const post = await response.json() as any;
    logger.info(`Postado no LinkedIn: ${post.id}`);
  }

  private async postToInstagramFeed(content: string, imageUrl: string): Promise<void> {
    if (imageUrl.startsWith('data:')) {
      throw new Error('O Meta exige uma URL pública da imagem. Adicione a variável IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN no seu arquivo .env para hospedar a imagem automaticamente.');
    }

    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
      throw new Error('Credenciais Instagram não configuradas.');
    }

    const res = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption: content, access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!res.ok) throw new Error(`Instagram Feed Create ${res.status}: ${await res.text()}`);
    const data = await res.json() as any;

    await this.waitForInstagramMediaReady(data.id, process.env.INSTAGRAM_ACCESS_TOKEN);

    const pub = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: data.id, access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!pub.ok) throw new Error(`Instagram Feed Publish ${pub.status}: ${await pub.text()}`);
    logger.info(`Postado no Instagram Feed: ${data.id}`);
  }

  private async postToInstagramStory(imageUrl: string): Promise<void> {
    if (imageUrl.startsWith('data:')) {
      throw new Error('O Meta exige uma URL pública da imagem. Adicione a variável IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN no seu arquivo .env para hospedar a imagem automaticamente.');
    }

    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
      throw new Error('Credenciais Instagram não configuradas.');
    }

    const res = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, media_type: 'STORIES', access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!res.ok) throw new Error(`Instagram Story Create ${res.status}: ${await res.text()}`);
    const data = await res.json() as any;

    await this.waitForInstagramMediaReady(data.id, process.env.INSTAGRAM_ACCESS_TOKEN);

    const pub = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: data.id, access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!pub.ok) throw new Error(`Instagram Story Publish ${pub.status}: ${await pub.text()}`);
    logger.info(`Postado no Instagram Story: ${data.id}`);
  }
}

// ============================================================
// HTML TEMPLATE — ERIZON Studio UI
// ============================================================
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERIZON · Estúdio de Conteúdo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    /* ============================================
       ERIZON DESIGN SYSTEM — Card 1080×1080
    ============================================ */
    .card { width:1080px; height:1080px; position:relative; overflow:hidden; background:#0B0112; font-family:'Plus Jakarta Sans',sans-serif; color:#fff; }
    .grid-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(188,19,254,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(188,19,254,.05) 1px,transparent 1px); background-size:60px 60px; }
    .corner { position:absolute; width:40px; height:40px; }
    .tl { top:32px; left:32px; border-top:2px solid rgba(188,19,254,.5); border-left:2px solid rgba(188,19,254,.5); }
    .tr { top:32px; right:32px; border-top:2px solid rgba(188,19,254,.5); border-right:2px solid rgba(188,19,254,.5); }
    .bl { bottom:32px; left:32px; border-bottom:2px solid rgba(188,19,254,.5); border-left:2px solid rgba(188,19,254,.5); }
    .br { bottom:32px; right:32px; border-bottom:2px solid rgba(188,19,254,.5); border-right:2px solid rgba(188,19,254,.5); }
    .logo { position:absolute; bottom:40px; left:0; right:0; margin:auto; display:flex; align-items:center; justify-content:center; }
    .logo img { height:52px; width:auto; object-fit:contain; }
    .grad  { background:linear-gradient(135deg,#BC13FE,#FF00E5); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .grad2 { background:linear-gradient(135deg,#00F2FF,#BC13FE); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .grad3 { background:linear-gradient(135deg,#FF00E5,#FF4488); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .orb { position:absolute; border-radius:50%; }
    .orb-center { width:580px; height:580px; top:0; bottom:0; left:0; right:0; margin:auto; background:radial-gradient(circle at 40% 40%,rgba(188,19,254,.28) 0%,rgba(255,0,229,.12) 45%,transparent 70%); filter:blur(18px); }
    .orb-glow   { width:280px; height:280px; top:0; bottom:0; left:0; right:0; margin:auto; background:radial-gradient(circle,rgba(188,19,254,.45) 0%,transparent 70%); filter:blur(35px); }
    .ring { position:absolute; border-radius:50%; border:1px solid; top:0; bottom:0; left:0; right:0; margin:auto; }
    .r1 { width:460px; height:460px; border-color:rgba(188,19,254,.3); }
    .r2 { width:640px; height:640px; border-color:rgba(188,19,254,.15); }
    .r3 { width:820px; height:820px; border-color:rgba(188,19,254,.07); }
    .light-t { position:absolute; top:-100px; left:0; right:0; margin:0 auto; width:500px; height:400px; background:radial-gradient(ellipse,rgba(188,19,254,.35) 0%,transparent 70%); filter:blur(50px); }
    .light-b { position:absolute; bottom:-120px; left:0; right:0; margin:0 auto; width:600px; height:300px; background:radial-gradient(ellipse,rgba(255,0,229,.2) 0%,transparent 70%); filter:blur(50px); }
    .div-line { width:60px; height:2px; background:linear-gradient(90deg,transparent,#BC13FE,transparent); margin:28px auto; box-shadow:0 0 12px rgba(188,19,254,.8); }
    .eyebrow { font-family:'JetBrains Mono',monospace; font-size:13px; color:#00F2FF; letter-spacing:4px; text-transform:uppercase; text-shadow:0 0 14px rgba(0,242,255,.7); margin-bottom:24px; }
    .cc { position:absolute; top:0; left:0; right:0; bottom:0; text-align:center; z-index:10; width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 90px; box-sizing:border-box; margin:auto; }
    .cc.layout-feedback { padding-top:520px; }
    .h1 { font-family:'Montserrat',sans-serif; font-weight:900; line-height:1.06; color:#fff; text-shadow:0 0 40px rgba(188,19,254,.3); font-size:62px; word-wrap:break-word; max-width:100%; }
    .sub { font-family:'Plus Jakarta Sans',sans-serif; font-size:20px; color:rgba(255,255,255,.72); line-height:1.55; max-width:760px; }
    .sub strong { color:#fff; font-weight:600; }
    .support-wrap { width:100%; max-width:780px; margin-top:26px; display:none; }
    .support-wrap.active { display:block; }
    .support-fact { background:rgba(188,19,254,.08); border:1px solid rgba(188,19,254,.22); border-radius:16px; padding:20px 22px; text-align:left; display:none; }
    .support-fact.active { display:block; }
    .support-kicker { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:2px; color:#BC13FE; text-transform:uppercase; margin-bottom:8px; }
    .support-fact p { font-size:15px; color:rgba(255,255,255,.72); line-height:1.6; }
    .support-list { display:none; flex-direction:column; gap:14px; }
    .support-list.active { display:flex; }
    .support-item { display:flex; gap:14px; align-items:flex-start; background:rgba(188,19,254,.06); border:1px solid rgba(188,19,254,.16); border-radius:12px; padding:14px 16px; text-align:left; }
    .support-num { font-family:'JetBrains Mono',monospace; color:#BC13FE; font-size:16px; min-width:28px; }
    .support-copy { font-size:15px; line-height:1.45; color:#fff; }
    .support-stats { display:none; grid-template-columns:repeat(3,1fr); gap:14px; }
    .support-stats.active { display:grid; }
    .support-stat { background:rgba(255,255,255,.04); border:1px solid rgba(188,19,254,.18); border-radius:12px; padding:16px 12px; text-align:center; }
    .support-stat-value { font-family:'JetBrains Mono',monospace; font-size:28px; font-weight:700; color:#fff; text-shadow:0 0 18px rgba(188,19,254,.35); }
    .support-stat-label { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.48); margin-top:6px; }
    .lc { position:absolute; top:0; left:80px; bottom:0; height:100%; z-index:10; width:800px; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; padding:0; box-sizing:border-box; text-align:left; }
    .lc .h1, .lc .sub { text-align:left; }
    .accent-bar { position:absolute; left:0; top:0; bottom:0; width:6px; background:linear-gradient(to bottom,transparent,#BC13FE 30%,#FF00E5 70%,transparent); display:none; }
    .accent-bar-top { position:absolute; top:0; left:0; right:0; height:6px; background:linear-gradient(90deg,#FF00E5,#BC13FE,#00F2FF); display:none; }
    .slide-badge { position:absolute; top:48px; right:56px; font-family:'JetBrains Mono',monospace; font-size:11px; color:rgba(188,19,254,.7); letter-spacing:2px; z-index:20; }
    #card-wrapper { width:100%; max-width:500px; aspect-ratio:1/1; position:relative; overflow:hidden; margin:0 auto; border-radius:12px; }
    #capture-area { transform-origin:top left; }
    .feedback-frame { position:absolute; top:120px; left:0; right:0; margin:auto; width:680px; height:500px; background:rgba(255,255,255,.05); border:1px solid rgba(0,242,255,.5); border-radius:20px; overflow:hidden; box-shadow:0 0 40px rgba(0,242,255,.2); display:none; z-index:15; }
    .feedback-frame img { width:100%; height:100%; object-fit:contain; backdrop-filter:blur(8px); }
    .feedback-frame.active { display:block; }

    /* UI Styles */
    body { background:#080010; min-height:100vh; font-family:'Plus Jakarta Sans',sans-serif; }
    .panel { background:rgba(255,255,255,.03); border:0.5px solid rgba(188,19,254,.2); border-radius:16px; padding:24px; }
    .mono { font-family:'JetBrains Mono',monospace; }
    .field-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; color:rgba(255,255,255,.4); text-transform:uppercase; margin-bottom:6px; display:block; }
    .field { width:100%; background:rgba(255,255,255,.04); border:0.5px solid rgba(188,19,254,.25); border-radius:8px; padding:10px 12px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; outline:none; transition:border-color .2s; resize:vertical; }
    .field:focus { border-color:rgba(188,19,254,.6); }
    .tab-btn { background:rgba(255,255,255,.03); border:0.5px solid rgba(255,255,255,.1); color:rgba(255,255,255,.6); padding:8px 14px; border-radius:8px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:600; transition:all .2s; white-space:nowrap; }
    .tab-btn:hover { border-color:rgba(188,19,254,.4); color:rgba(255,255,255,.9); }
    .tab-btn.active { background:rgba(188,19,254,.15); border-color:#BC13FE; color:#BC13FE; }
    .tab-btn.upload-tab { background:rgba(0,242,255,.08); border-color:rgba(0,242,255,.3); color:#00F2FF; }
    .tab-btn.upload-tab.active { background:rgba(0,242,255,.2); border-color:#00F2FF; }
    .type-btn { display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(255,255,255,.03); border:0.5px solid rgba(255,255,255,.1); color:rgba(255,255,255,.45); padding:10px 16px; border-radius:10px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:500; transition:all .2s; width:100%; }
    .type-btn:hover { border-color:rgba(188,19,254,.4); color:rgba(255,255,255,.8); }
    .type-btn.active { background:rgba(188,19,254,.1); border-color:rgba(188,19,254,.5); color:#BC13FE; }
    .btn-primary { width:100%; background:linear-gradient(135deg,#BC13FE,#FF00E5); color:#fff; font-family:'Montserrat',sans-serif; font-weight:800; padding:14px; border-radius:10px; border:none; cursor:pointer; font-size:15px; letter-spacing:1px; transition:opacity .2s; }
    .btn-primary:disabled { opacity:.5; cursor:not-allowed; }
    .btn-publish { width:100%; background:rgba(16,185,129,.08); border:0.5px solid rgba(16,185,129,.35); color:#10b981; font-family:'Montserrat',sans-serif; font-weight:800; padding:14px; border-radius:10px; cursor:pointer; font-size:15px; letter-spacing:1px; transition:all .2s; }
    .btn-publish:disabled { opacity:.5; cursor:not-allowed; }
    .btn-nav { background:rgba(188,19,254,.12); border:0.5px solid rgba(188,19,254,.3); color:#BC13FE; padding:8px 16px; border-radius:8px; cursor:pointer; font-family:'JetBrains Mono',monospace; font-size:12px; transition:all .2s; }
    .btn-nav:hover { background:rgba(188,19,254,.2); }
    .divider { height:0.5px; background:rgba(188,19,254,.15); margin:20px 0; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .pulsing { animation:pulse 1.5s ease-in-out infinite; }
    input[type="checkbox"] { accent-color:#BC13FE; width:14px; height:14px; }
  </style>
</head>
<body class="p-4 md:p-8">
  <div class="max-w-2xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-8">
      <div class="mono" style="font-size:10px;letter-spacing:.25em;color:#BC13FE;text-transform:uppercase;margin-bottom:10px;">Estúdio de Conteúdo · 2025</div>
      <h1 style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:2.2rem;color:#fff;letter-spacing:3px;">ERI<span style="color:#BC13FE;">ZON</span></h1>
      <p style="color:rgba(255,255,255,.3);font-size:12px;margin-top:6px;letter-spacing:.05em;">Inteligência que antecipa. Performance que escala.</p>
      <div style="margin-top:14px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
        <a href="/" class="btn-nav" style="text-decoration:none;">Estúdio</a>
        <a href="/strategy" class="btn-nav" style="text-decoration:none;">Estratégia</a>
      </div>
    </div>

    <div class="panel">

      <!-- Editorial Tabs -->
      <div class="mb-6">
        <span class="field-label">Pilar Editorial</span>
        <div class="flex flex-wrap gap-2" id="editorial-tabs">
          <button class="tab-btn active" data-tab="erizon">ERIZON</button>
          <button class="tab-btn" data-tab="specialists">Especialistas</button>
          <button class="tab-btn" data-tab="market">Mercado</button>
          <button class="tab-btn" data-tab="diagnostics">Diagnósticos</button>
          <button class="tab-btn" data-tab="stories">Stories Interativos</button>
          <button class="tab-btn" data-tab="social-proof">Prova Social</button>
          <button class="tab-btn" data-tab="anti-myth">Anti-Mitos</button>
          <button class="tab-btn" data-tab="series">Séries Fixas</button>
          <button class="tab-btn upload-tab" data-tab="uploads">⇧ Uploads / Feedbacks</button>
        </div>
      </div>

      <!-- Upload Section -->
      <div id="upload-section" class="mb-6 hidden" style="background:rgba(0,242,255,.05); border:1px dashed rgba(0,242,255,.3); border-radius:12px; padding:16px;">
        <span class="field-label" style="color:#00F2FF;">Upload de Print / Feedback</span>
        <input type="file" id="upload-input" accept="image/*" class="field mb-3" style="background:transparent; border:none; padding:0; cursor:pointer;" />
        <input type="text" id="upload-context" placeholder="Contexto do print (ex: ROAS 10x na black friday)" class="field" style="border-color:rgba(0,242,255,.3);" />
      </div>

      <!-- Post Type Selector -->
      <div class="mb-6">
        <span class="field-label">Tipo de Conteúdo</span>
        <div class="grid grid-cols-2 gap-2" id="type-selector">
          <button class="type-btn active" data-type="instagram-feed">📸 Instagram Feed</button>
          <button class="type-btn" data-type="instagram-story">📱 Instagram Story</button>
          <button class="type-btn" data-type="instagram-carousel">🎠 Carrossel</button>
          <button class="type-btn" data-type="linkedin">💼 LinkedIn Feed</button>
        </div>
      </div>

      <!-- Generate -->
      <button id="btn-generate" class="btn-primary mb-4">✦ &nbsp;Gerar Conteúdo Viral com IA</button>

      <div id="loading" class="hidden pulsing mono text-center mb-4" style="font-size:12px;letter-spacing:.2em;color:#BC13FE;padding:12px;">
        GERANDO CONTEÚDO VIRAL...
      </div>

      <!-- Preview Section -->
      <div id="preview-section" class="hidden">

        <div class="divider"></div>

        <!-- Editable fields -->
        <div class="mb-5" id="single-fields">
          <span class="field-label" style="margin-bottom:12px;display:block;">Editar Conteúdo</span>
          <label class="field-label">Eyebrow</label>
          <input id="eyebrow-input" type="text" class="field" style="margin-bottom:12px;">
          <label class="field-label">Título Principal (H1)</label>
          <textarea id="h1-input" rows="2" class="field" style="font-family:'Montserrat',sans-serif;font-weight:800;margin-bottom:12px;"></textarea>
          <label class="field-label">Subtítulo</label>
          <textarea id="sub-input" rows="2" class="field"></textarea>
        </div>

        <!-- Carousel Navigation -->
        <div id="carousel-nav" class="hidden mb-4 flex items-center justify-between">
          <button id="prev-slide" class="btn-nav">← Anterior</button>
          <span id="slide-counter" class="mono" style="font-size:12px;color:rgba(255,255,255,.4);">Slide 1 / 5</span>
          <button id="next-slide" class="btn-nav">Próximo →</button>
        </div>

        <!-- Card Preview -->
        <div class="mb-5">
          <span class="field-label" style="margin-bottom:10px;display:block;">Preview da Imagem (1080×1080)</span>
          <div id="card-wrapper" style="box-shadow:0 0 60px rgba(188,19,254,.12);">
            <div id="capture-area" class="card">
              <div class="grid-bg"></div>
              <div class="light-t"></div><div class="light-b"></div>
              <div class="orb orb-center"></div><div class="orb orb-glow"></div>
              <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
              <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
              <div id="card-accent-v" class="accent-bar"></div>
              <div id="card-accent-h" class="accent-bar-top"></div>
              <div id="slide-badge" class="slide-badge hidden"></div>
              <div id="feedback-frame" class="feedback-frame">
                <img id="feedback-img" src="" />
              </div>
              <div id="content-container" class="cc">
                <div id="card-eyebrow" class="eyebrow">// AI Marketing OS</div>
                <h1 id="card-h1" class="h1">Pare de<br><span class="grad">adivinhar.</span></h1>
                <div id="card-div-line" class="div-line"></div>
                <p id="card-sub" class="sub">Deixe a IA <strong>decidir por você.</strong></p>
                <div id="support-wrap" class="support-wrap">
                  <div id="support-fact" class="support-fact">
                    <div class="support-kicker">Insight</div>
                    <p id="support-fact-text"></p>
                  </div>
                  <div id="support-list" class="support-list">
                    <div class="support-item"><div class="support-num">01</div><div id="support-item-1" class="support-copy"></div></div>
                    <div class="support-item"><div class="support-num">02</div><div id="support-item-2" class="support-copy"></div></div>
                    <div class="support-item"><div class="support-num">03</div><div id="support-item-3" class="support-copy"></div></div>
                  </div>
                  <div id="support-stats" class="support-stats">
                    <div class="support-stat"><div id="support-stat-value-1" class="support-stat-value"></div><div id="support-stat-label-1" class="support-stat-label"></div></div>
                    <div class="support-stat"><div id="support-stat-value-2" class="support-stat-value"></div><div id="support-stat-label-2" class="support-stat-label"></div></div>
                    <div class="support-stat"><div id="support-stat-value-3" class="support-stat-value"></div><div id="support-stat-label-3" class="support-stat-label"></div></div>
                  </div>
                </div>
              </div>
              <div class="logo"><img id="logo-img" src="${LOGO_DATA_URL || '/logo-erizon.png'}" style="height:52px;width:auto;object-fit:contain;"></div>
            </div>
          </div>
        </div>

        <!-- Caption -->
        <div class="mb-5">
          <label class="field-label">Legenda do Post</label>
          <textarea id="post-content" rows="6" class="field" style="line-height:1.6;"></textarea>
        </div>

        <!-- Platform toggles -->
        <div class="mb-5" id="platform-toggles-wrap">
          <span class="field-label" style="margin-bottom:10px;display:block;">Publicar em</span>
          <div class="flex flex-wrap gap-4">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;color:rgba(255,255,255,.65);font-size:13px;">
              <input type="checkbox" id="pub-instagram" checked> 📸 Instagram Feed
            </label>
            <label id="pub-story-wrap" style="display:flex;align-items:center;gap:8px;cursor:pointer;color:rgba(255,255,255,.65);font-size:13px;">
              <input type="checkbox" id="pub-story"> 📱 Story
            </label>
            <label id="pub-linkedin-wrap" style="display:flex;align-items:center;gap:8px;cursor:pointer;color:rgba(255,255,255,.65);font-size:13px;">
              <input type="checkbox" id="pub-linkedin" checked> 💼 LinkedIn <span id="li-carousel-note" class="hidden" style="font-size:10px;color:rgba(188,19,254,.6);font-family:'JetBrains Mono',monospace;">(1º slide)</span>
            </label>
          </div>
        </div>

        <!-- Publish -->
        <button id="btn-publish" class="btn-publish">✦ &nbsp;Aprovar e Publicar nas Redes</button>
      </div>

      <!-- Status -->
      <div id="status-message" class="hidden mt-5" style="border-radius:10px;padding:16px;font-size:13px;line-height:1.9;"></div>

    </div>
  </div>

  <script>
    // ============================================================
    // STATE
    // ============================================================
    let currentPostType = 'instagram-feed';
    let currentEditorialTab = 'erizon';
    let uploadedImageBase64 = null;
    let processedLogoUrl = null; // dataURL do logo sem fundo branco
    let currentVisualState = {
      palette: { t:'rgba(188,19,254,', b:'rgba(255,0,229,', o:'rgba(188,19,254,' },
      layout: 'center',
      gradClass: 'grad',
      bgVariant: 'orbital',
      showGrid: true,
      showCorners: true,
      showOrbs: true,
      showRings: true
    };
    const HISTORY_KEY = 'erizon-post-history-v1';

    function getPostHistory() {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.warn('History read error:', e);
        return [];
      }
    }

    function savePostHistory(items) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(-24)));
      } catch (e) {
        console.warn('History write error:', e);
      }
    }

    function rememberPost(entry) {
      const history = getPostHistory();
      history.push({
        platform: entry.platform || currentPostType,
        eyebrow: entry.eyebrow || '',
        h1: entry.h1 || '',
        caption: entry.caption || '',
        angle: entry.angle || stripHtml(entry.h1 || '').slice(0, 80),
        createdAt: new Date().toISOString()
      });
      savePostHistory(history);
    }

    async function fetchJson(url, options) {
      const res = await fetch(url, options);
      const raw = await res.text();
      let data = null;

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (e) {
        const snippet = (raw || 'Resposta vazia do servidor.').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
        throw new Error(snippet || 'Resposta inválida do servidor.');
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || ('Erro HTTP ' + res.status));
      }

      return data;
    }

    // Carrega o logo, remove fundo branco via canvas e armazena como dataURL
    const logoReadyPromise = (async function loadLogo() {
      try {
        const img = new Image();
        const logoSrc = ${JSON.stringify(LOGO_DATA_URL || '/logo-erizon.png')};
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = logoSrc; });
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0);
        const id = cx.getImageData(0, 0, c.width, c.height);
        const d = id.data;
        for (let i = 0; i < d.length; i += 4) {
          // Remove pixels brancos e quase-brancos (fundo)
          if (d[i] > 230 && d[i+1] > 230 && d[i+2] > 230) d[i+3] = 0;
        }
        cx.putImageData(id, 0, 0);
        processedLogoUrl = c.toDataURL('image/png');
        // Atualiza a img do card com a versão sem fundo
        const el = document.getElementById('logo-img');
        if (el) el.src = processedLogoUrl;
      } catch(e) { console.warn('Logo load error:', e); }
    })();
    let carouselSlides = [];
    let currentSlideIdx = 0;
    let currentContentExtras = { supporting: [], stats: [], formatHint: 'fact' };

    function normalizeContentExtras(data) {
      const supporting = Array.isArray(data?.supporting) ? data.supporting.filter(Boolean).slice(0, 3) : [];
      const stats = Array.isArray(data?.stats) ? data.stats.filter(Boolean).slice(0, 3) : [];
      const formatHint = data?.formatHint || (stats.length ? 'stats' : supporting.length > 1 ? 'checklist' : 'fact');
      return { supporting, stats, formatHint };
    }

    function applySupportModules() {
      const wrap = document.getElementById('support-wrap');
      const fact = document.getElementById('support-fact');
      const factText = document.getElementById('support-fact-text');
      const list = document.getElementById('support-list');
      const stats = document.getElementById('support-stats');
      const extras = currentContentExtras || { supporting: [], stats: [], formatHint: 'fact' };

      wrap.classList.remove('active');
      fact.classList.remove('active');
      list.classList.remove('active');
      stats.classList.remove('active');

      if (extras.formatHint === 'stats' && extras.stats.length) {
        wrap.classList.add('active');
        stats.classList.add('active');
        extras.stats.slice(0, 3).forEach((item, idx) => {
          document.getElementById('support-stat-value-' + (idx + 1)).textContent = item.value || '';
          document.getElementById('support-stat-label-' + (idx + 1)).textContent = item.label || '';
        });
      } else if (extras.formatHint === 'checklist' && extras.supporting.length) {
        wrap.classList.add('active');
        list.classList.add('active');
        for (let i = 0; i < 3; i++) {
          document.getElementById('support-item-' + (i + 1)).textContent = extras.supporting[i] || '';
        }
      } else if (extras.supporting.length) {
        wrap.classList.add('active');
        fact.classList.add('active');
        factText.textContent = extras.supporting[0];
      }
    }

    async function waitForRenderAssets() {
      try {
        if (document.fonts && document.fonts.ready) {
          await Promise.all([
            document.fonts.load('900 72px "Montserrat"'),
            document.fonts.load('600 22px "Plus Jakarta Sans"'),
            document.fonts.load('500 13px "JetBrains Mono"'),
            document.fonts.ready
          ]);
        }
      } catch (e) {
        console.warn('Font readiness error:', e);
      }
      await logoReadyPromise.catch(() => null);
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    }

    // ============================================================
    // DOM REFS
    // ============================================================
    const btnGenerate   = document.getElementById('btn-generate');
    const btnPublish    = document.getElementById('btn-publish');
    const loading       = document.getElementById('loading');
    const previewSection = document.getElementById('preview-section');
    const postContent   = document.getElementById('post-content');
    const eyebrowInput  = document.getElementById('eyebrow-input');
    const h1Input       = document.getElementById('h1-input');
    const subInput      = document.getElementById('sub-input');
    const statusMsg     = document.getElementById('status-message');
    const carouselNav   = document.getElementById('carousel-nav');
    const slideCounter  = document.getElementById('slide-counter');
    const slideBadge    = document.getElementById('slide-badge');

    // ============================================================
    // EDITORIAL TABS & UPLOAD
    // ============================================================
    document.getElementById('editorial-tabs').addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentEditorialTab = btn.dataset.tab;
      document.getElementById('upload-section').classList.toggle('hidden', currentEditorialTab !== 'uploads');
    });

    document.getElementById('upload-input').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        uploadedImageBase64 = ev.target.result;
        document.getElementById('feedback-img').src = uploadedImageBase64;
      };
      reader.readAsDataURL(file);
    });

    // ============================================================
    // TYPE SELECTOR
    // ============================================================
    document.getElementById('type-selector').addEventListener('click', e => {
      const btn = e.target.closest('.type-btn');
      if (!btn) return;
      document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPostType = btn.dataset.type;
      updatePlatformToggles();
    });

    function updatePlatformToggles() {
      const pubIg   = document.getElementById('pub-instagram');
      const pubStory = document.getElementById('pub-story-wrap');
      const pubLi   = document.getElementById('pub-linkedin-wrap');
      const pubIgWrap = pubIg.closest('label');

      if (currentPostType === 'linkedin') {
        pubIgWrap.style.display = 'none';
        pubStory.style.display = 'none';
        document.getElementById('pub-linkedin').checked = true;
      } else if (currentPostType === 'instagram-story') {
        pubIgWrap.style.display = 'none';
        pubStory.style.display = 'flex';
        pubLi.style.display = 'none';
        document.getElementById('pub-story').checked = true;
      } else if (currentPostType === 'instagram-carousel') {
        pubIgWrap.style.display = 'flex';
        pubStory.style.display = 'none';
        pubLi.style.display = 'flex';
        pubIg.checked = true;
        document.getElementById('li-carousel-note').classList.remove('hidden');
      } else {
        pubIgWrap.style.display = 'flex';
        pubStory.style.display = 'flex';
        pubLi.style.display = 'flex';
        document.getElementById('li-carousel-note').classList.add('hidden');
      }
    }

    // ============================================================
    // CARD SCALING
    // ============================================================
    function scaleCard() {
      const wrapper = document.getElementById('card-wrapper');
      const card    = document.getElementById('capture-area');
      card.style.transform = 'scale(' + (wrapper.clientWidth / 1080) + ')';
    }
    window.addEventListener('resize', scaleCard);
    scaleCard();

    // ============================================================
    // TEXT MIRRORING
    // ============================================================
    eyebrowInput.addEventListener('input', e => {
      document.getElementById('card-eyebrow').innerHTML = e.target.value;
      if (carouselSlides[currentSlideIdx]) carouselSlides[currentSlideIdx].eyebrow = e.target.value;
    });
    h1Input.addEventListener('input', e => {
      document.getElementById('card-h1').innerHTML = e.target.value;
      if (carouselSlides[currentSlideIdx]) carouselSlides[currentSlideIdx].h1 = e.target.value;
    });
    subInput.addEventListener('input', e => {
      document.getElementById('card-sub').innerHTML = e.target.value;
      if (carouselSlides[currentSlideIdx]) carouselSlides[currentSlideIdx].sub = e.target.value;
    });

    // ============================================================
    // VISUAL RANDOMIZATION
    // ============================================================
    function applyDomVisualState(state, h1Text) {
      const lightT = document.querySelector('.light-t');
      const lightB = document.querySelector('.light-b');
      const orbCenter = document.querySelector('.orb-center');
      const orbGlow = document.querySelector('.orb-glow');
      const rings = document.querySelectorAll('.ring');
      const grid = document.querySelector('.grid-bg');
      const corners = document.querySelectorAll('.corner');
      const cont = document.getElementById('content-container');
      const av = document.getElementById('card-accent-v');
      const ah = document.getElementById('card-accent-h');
      const dl = document.getElementById('card-div-line');

      lightT.style.display = 'block';
      lightB.style.display = 'block';
      orbCenter.style.display = state.showOrbs === false ? 'none' : 'block';
      orbGlow.style.display = state.showOrbs === false ? 'none' : 'block';
      lightT.style.filter = 'blur(50px)';
      lightB.style.filter = 'blur(50px)';
      grid.style.display = state.showGrid === false ? 'none' : 'block';
      corners.forEach(c => c.style.display = state.showCorners === false ? 'none' : 'block');
      rings.forEach((r, idx) => {
        r.style.display = state.showRings === false ? 'none' : 'block';
        r.style.borderColor = idx === 0 ? 'rgba(188,19,254,.3)' : idx === 1 ? 'rgba(188,19,254,.15)' : 'rgba(188,19,254,.07)';
      });
      cont.className = 'cc';
      cont.style.left = '0';
      cont.style.right = '0';
      cont.style.width = '100%';
      cont.style.alignItems = 'center';
      cont.style.textAlign = 'center';
      av.style.display = 'none';
      ah.style.display = 'none';
      dl.style.margin = '28px auto';

      const p = state.palette;
      const rx = (Math.floor(Math.random()*80)+10) + '% ';
      const ry = (Math.floor(Math.random()*80)+10) + '%';

      if (state.bgVariant === 'orbital') {
        lightT.style.background = 'radial-gradient(ellipse,' + p.t + '.35) 0%,transparent 70%)';
        lightB.style.background = 'radial-gradient(ellipse,' + p.b + '.2) 0%,transparent 70%)';
        orbCenter.style.background = 'radial-gradient(circle at ' + rx + ry + ',' + p.o + '.28) 0%,' + p.b + '.12) 45%,transparent 70%)';
      } else if (state.bgVariant === 'diagonal') {
        lightT.style.background = 'linear-gradient(135deg,' + p.t + '.34) 0%,transparent 52%)';
        lightB.style.background = 'linear-gradient(315deg,' + p.b + '.22) 0%,transparent 58%)';
        orbCenter.style.background = 'linear-gradient(135deg,' + p.o + '.10) 0%,transparent 60%)';
        orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
      } else if (state.bgVariant === 'split') {
        lightT.style.background = 'radial-gradient(circle at 12% 50%,' + p.t + '.32) 0%,transparent 44%)';
        lightB.style.background = 'radial-gradient(circle at 88% 50%,' + p.b + '.22) 0%,transparent 42%)';
        orbCenter.style.background = 'radial-gradient(circle at 50% 50%,' + p.o + '.07) 0%, transparent 55%)';
        orbGlow.style.display = 'none';
      } else if (state.bgVariant === 'corner-burst') {
        lightT.style.background = 'radial-gradient(circle at 0% 0%,' + p.t + '.34) 0%,transparent 42%)';
        lightB.style.background = 'radial-gradient(circle at 100% 100%,' + p.b + '.24) 0%,transparent 44%)';
        orbCenter.style.background = 'radial-gradient(circle at 50% 50%,' + p.o + '.08) 0%, transparent 48%)';
        orbGlow.style.display = 'none';
      } else if (state.bgVariant === 'tunnel') {
        lightT.style.background = 'radial-gradient(circle at 50% 50%,' + p.t + '.18) 0%,transparent 58%)';
        lightB.style.background = 'radial-gradient(circle at 50% 50%,' + p.b + '.12) 0%,transparent 70%)';
        orbCenter.style.background = 'radial-gradient(circle at 50% 50%,' + p.o + '.08) 0%, transparent 52%)';
        rings.forEach((r, idx) => r.style.borderColor = idx === 0 ? 'rgba(0,242,255,.18)' : idx === 1 ? 'rgba(188,19,254,.14)' : 'rgba(255,0,229,.08)');
      } else if (state.bgVariant === 'bands') {
        lightT.style.background = 'linear-gradient(180deg,' + p.t + '.26) 0%,transparent 38%)';
        lightB.style.background = 'linear-gradient(0deg,' + p.b + '.20) 0%,transparent 34%)';
        orbCenter.style.background = 'linear-gradient(90deg,transparent,' + p.o + '.08,transparent)';
        orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
      } else if (state.bgVariant === 'crosslight') {
        lightT.style.background = 'linear-gradient(135deg,' + p.t + '.22) 0%,transparent 48%)';
        lightB.style.background = 'linear-gradient(225deg,' + p.b + '.18) 0%,transparent 48%)';
        orbCenter.style.background = 'radial-gradient(circle at 50% 50%,' + p.o + '.10) 0%, transparent 44%)';
        rings.forEach((r, idx) => r.style.borderColor = idx === 0 ? 'rgba(255,0,229,.14)' : idx === 1 ? 'rgba(0,242,255,.1)' : 'rgba(188,19,254,.06)');
      } else if (state.bgVariant === 'data-stream') {
        lightT.style.background = 'linear-gradient(90deg,' + p.t + '.20) 0%,transparent 28%,transparent 72%,' + p.b + '.16) 100%)';
        lightB.style.background = 'linear-gradient(180deg,transparent 0%,' + p.o + '.10) 48%,transparent 100%)';
        orbCenter.style.background = 'linear-gradient(135deg,transparent 0%,' + p.o + '.08) 50%,transparent 100%)';
        orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
      } else if (state.bgVariant === 'signal-columns') {
        lightT.style.background = 'linear-gradient(90deg,' + p.t + '.18) 0%,transparent 16%,' + p.o + '.08) 50%,transparent 84%,' + p.b + '.16) 100%)';
        lightB.style.background = 'radial-gradient(circle at 50% 0%,' + p.o + '.12) 0%,transparent 48%)';
        orbCenter.style.background = 'linear-gradient(90deg,transparent 0%,' + p.o + '.08) 48%,transparent 52%,' + p.o + '.08) 56%,transparent 100%)';
        orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
      } else if (state.bgVariant === 'neon-wedge') {
        lightT.style.background = 'linear-gradient(120deg,' + p.t + '.28) 0%,transparent 44%)';
        lightB.style.background = 'linear-gradient(300deg,' + p.b + '.20) 0%,transparent 52%)';
        orbCenter.style.background = 'linear-gradient(135deg,transparent 0%,transparent 38%,' + p.o + '.10) 39%,' + p.o + '.04) 56%,transparent 57%)';
        orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
      } else if (state.bgVariant === 'horizon') {
        lightT.style.background = 'linear-gradient(180deg,' + p.t + '.20) 0%,transparent 38%)';
        lightB.style.background = 'linear-gradient(0deg,' + p.b + '.22) 0%,transparent 42%)';
        orbCenter.style.background = 'linear-gradient(180deg,transparent 0%,' + p.o + '.10) 49%,transparent 51%,' + p.o + '.06) 76%,transparent 100%)';
        orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
      } else if (state.bgVariant === 'frame-shift') {
        lightT.style.background = 'linear-gradient(135deg,' + p.t + '.18) 0%,transparent 34%)';
        lightB.style.background = 'linear-gradient(315deg,' + p.b + '.18) 0%,transparent 34%)';
        orbCenter.style.background = 'linear-gradient(90deg,transparent 0%,' + p.o + '.06) 18%,transparent 19%,transparent 81%,' + p.o + '.06) 82%,transparent 100%)';
        orbGlow.style.display = 'none';
        rings.forEach((r, idx) => {
          r.style.display = 'block';
          r.style.borderRadius = '24px';
          r.style.borderColor = idx === 0 ? 'rgba(0,242,255,.18)' : idx === 1 ? 'rgba(188,19,254,.10)' : 'rgba(255,0,229,.08)';
        });
      } else {
        lightT.style.background = 'radial-gradient(ellipse at top,' + p.t + '.26) 0%,transparent 66%)';
        lightB.style.background = 'radial-gradient(ellipse at bottom,' + p.b + '.18) 0%,transparent 68%)';
        orbCenter.style.background = 'radial-gradient(circle at 50% 50%,' + p.o + '.14) 0%, transparent 52%)';
        rings.forEach((r, idx) => r.style.borderColor = idx === 0 ? 'rgba(0,242,255,.22)' : idx === 1 ? 'rgba(188,19,254,.12)' : 'rgba(255,0,229,.08)');
      }

      if (state.bgVariant !== 'frame-shift') {
        rings.forEach(r => r.style.borderRadius = '50%');
      }

      const feedbackFrame = document.getElementById('feedback-frame');
      if (currentEditorialTab === 'uploads' && uploadedImageBase64) {
        state.layout = 'center'; // Force center for feedback
        feedbackFrame.classList.add('active');
        cont.classList.add('layout-feedback');
      } else {
        feedbackFrame.classList.remove('active');
        cont.classList.remove('layout-feedback');
      }

      if (state.layout === 'center') {
        cont.className = 'cc';
      } else {
        cont.className = 'lc';
        cont.style.width = '760px';
        dl.style.margin = '28px 0';

        if (state.layout === 'left-v' || state.layout === 'left-h') {
          cont.style.left = '80px';
          cont.style.right = 'auto';
          cont.style.alignItems = 'flex-start';
          cont.style.textAlign = 'left';
        } else {
          cont.style.left = 'auto';
          cont.style.right = '80px';
          cont.style.alignItems = 'flex-end';
          cont.style.textAlign = 'right';
        }

        if (state.layout.endsWith('-v')) av.style.display = 'block';
        if (state.layout.endsWith('-h')) ah.style.display = 'block';
      }

      let txt = (h1Text || '').replace(/class=["']grad\\d*["']/g, 'class="' + state.gradClass + '"');
      if (!txt.includes('class=')) txt = txt.replace(/<span/g, '<span class="' + state.gradClass + '"');
      document.getElementById('card-h1').innerHTML = txt;
    }

    function randomizeVisuals(h1Text) {
      const schemes = [
        { t:'rgba(188,19,254,', b:'rgba(255,0,229,', o:'rgba(188,19,254,' },
        { t:'rgba(0,242,255,',  b:'rgba(188,19,254,', o:'rgba(0,242,255,' },
        { t:'rgba(255,0,100,',  b:'rgba(255,68,136,', o:'rgba(255,0,100,' },
        { t:'rgba(54,209,220,', b:'rgba(91,134,229,', o:'rgba(0,242,255,' },
        { t:'rgba(132,94,247,', b:'rgba(255,0,229,', o:'rgba(132,94,247,' },
        { t:'rgba(0,255,163,',  b:'rgba(0,242,255,', o:'rgba(0,255,163,' }
      ];
      const layouts = ['center', 'left-v', 'left-h', 'right-v', 'right-h'];
      const grads = ['grad','grad2','grad3'];
      const scenes = [
        { bgVariant: 'data-stream', layout: 'left-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
        { bgVariant: 'signal-columns', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
        { bgVariant: 'neon-wedge', layout: 'left-h', showGrid: false, showCorners: false, showOrbs: false, showRings: false },
        { bgVariant: 'horizon', layout: 'center', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
        { bgVariant: 'frame-shift', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: true },
        { bgVariant: 'bands', layout: 'left-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
        { bgVariant: 'crosslight', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
        { bgVariant: 'diagonal', layout: 'left-h', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
        { bgVariant: 'split', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
        { bgVariant: 'corner-burst', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
        { bgVariant: 'orbital', layout: 'center', showGrid: true, showCorners: true, showOrbs: true, showRings: true },
        { bgVariant: 'tunnel', layout: 'center', showGrid: false, showCorners: true, showOrbs: true, showRings: true },
        { bgVariant: 'halo', layout: 'center', showGrid: false, showCorners: true, showOrbs: true, showRings: true }
      ];
      const scene = scenes[Math.floor(Math.random() * scenes.length)];
      const palette = schemes[Math.floor(Math.random() * schemes.length)];
      const layout = scene.layout || layouts[Math.floor(Math.random() * layouts.length)];
      currentVisualState = {
        palette,
        layout,
        gradClass: grads[Math.floor(Math.random() * grads.length)],
        bgVariant: scene.bgVariant,
        showGrid: scene.showGrid,
        showCorners: scene.showCorners,
        showOrbs: scene.showOrbs,
        showRings: scene.showRings
      };
      applyDomVisualState(currentVisualState, h1Text);
    }

    // ============================================================
    // CAROUSEL NAVIGATION
    // ============================================================
    function showSlide(idx) {
      if (!carouselSlides.length) return;
      currentContentExtras = { supporting: [], stats: [], formatHint: 'fact' };
      applySupportModules();
      currentSlideIdx = Math.max(0, Math.min(idx, carouselSlides.length - 1));
      const s = carouselSlides[currentSlideIdx];
      eyebrowInput.value = s.eyebrow || '';
      h1Input.value      = s.h1      || '';
      subInput.value     = s.sub     || '';
      document.getElementById('card-eyebrow').innerHTML = s.eyebrow || '';
      document.getElementById('card-sub').innerHTML     = s.sub     || '';
      slideBadge.textContent = (currentSlideIdx + 1) + ' / ' + carouselSlides.length;
      slideCounter.textContent = 'Slide ' + (currentSlideIdx + 1) + ' / ' + carouselSlides.length;
      randomizeVisuals(s.h1 || '');
    }
    document.getElementById('prev-slide').addEventListener('click', () => showSlide(currentSlideIdx - 1));
    document.getElementById('next-slide').addEventListener('click', () => showSlide(currentSlideIdx + 1));

    // ============================================================
    // GENERATE
    // ============================================================
    btnGenerate.addEventListener('click', async () => {
      loading.classList.remove('hidden');
      previewSection.classList.add('hidden');
      statusMsg.classList.add('hidden');
      btnGenerate.disabled = true;

      try {
        const isCarousel = currentPostType === 'instagram-carousel';
        const url = isCarousel ? '/api/generate-carousel' : '/api/generate';
        const data = await fetchJson(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: currentPostType,
            recentPosts: getPostHistory(),
            editorialTab: currentEditorialTab,
            uploadContext: document.getElementById('upload-context') ? document.getElementById('upload-context').value : ''
          })
        });

        if (isCarousel) {
          carouselSlides = data.slides || [];
          currentContentExtras = { supporting: [], stats: [], formatHint: 'fact' };
          postContent.value = data.caption || '';
          carouselNav.classList.remove('hidden');
          slideBadge.classList.remove('hidden');
          showSlide(0);
          rememberPost({
            platform: currentPostType,
            eyebrow: carouselSlides[0]?.eyebrow || '',
            h1: carouselSlides[0]?.h1 || '',
            caption: data.caption || '',
            angle: stripHtml(carouselSlides[0]?.h1 || '')
          });
        } else {
          carouselSlides = [];
          carouselNav.classList.add('hidden');
          slideBadge.classList.add('hidden');
          currentContentExtras = normalizeContentExtras(data);
          postContent.value    = data.caption || '';
          eyebrowInput.value   = data.eyebrow || '';
          h1Input.value        = data.h1      || '';
          subInput.value       = data.sub     || '';
          document.getElementById('card-eyebrow').innerHTML = data.eyebrow || '';
          document.getElementById('card-sub').innerHTML     = data.sub     || '';
          randomizeVisuals(data.h1 || '');
          applySupportModules();
          rememberPost({
            platform: currentPostType,
            eyebrow: data.eyebrow || '',
            h1: data.h1 || '',
            caption: data.caption || '',
            angle: stripHtml(data.h1 || '')
          });
        }

        previewSection.classList.remove('hidden');
        updatePlatformToggles();
        setTimeout(scaleCard, 100);
      } catch(e) {
        alert('Erro ao gerar: ' + e.message);
      } finally {
        loading.classList.add('hidden');
        btnGenerate.disabled = false;
      }
    });

    // ============================================================
    // RENDER CARD → BASE64
    // ============================================================
    function stripHtml(html) {
      const el = document.createElement('div');
      el.innerHTML = html || '';
      return (el.textContent || el.innerText || '').replace(/\s+/g, ' ').trim();
    }

    function parseRichLines(html) {
      const root = document.createElement('div');
      root.innerHTML = html || '';
      const lines = [[]];
      function pushLine() { lines.push([]); }
      function walk(node, activeClass) {
        if (node.nodeType === Node.TEXT_NODE) {
          const value = node.textContent || '';
          if (value) lines[lines.length - 1].push({ text: value, className: activeClass || '' });
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const el = node;
        if (el.tagName === 'BR') {
          pushLine();
          return;
        }
        const nextClass = el.classList && (el.classList.contains('grad') || el.classList.contains('grad2') || el.classList.contains('grad3'))
          ? Array.from(el.classList).find(c => c === 'grad' || c === 'grad2' || c === 'grad3')
          : activeClass;
        Array.from(el.childNodes).forEach(child => walk(child, nextClass));
      }
      Array.from(root.childNodes).forEach(node => walk(node, ''));
      return lines.filter(line => line.some(seg => (seg.text || '').trim().length > 0));
    }

    function wrapText(ctx, text, maxWidth) {
      const words = (text || '').split(/\s+/).filter(Boolean);
      if (!words.length) return [];
      const lines = [];
      let current = words[0];
      for (let i = 1; i < words.length; i++) {
        const test = current + ' ' + words[i];
        if (ctx.measureText(test).width <= maxWidth) current = test;
        else { lines.push(current); current = words[i]; }
      }
      lines.push(current);
      return lines;
    }

    function fillCenteredText(ctx, segments, centerX, y) {
      const metrics = segments.map(seg => {
        const m = ctx.measureText(seg.text);
        return {
          width: m.width,
          left: m.actualBoundingBoxLeft || 0,
          right: m.actualBoundingBoxRight || m.width
        };
      });

      let cursor = 0;
      let minX = 0;
      let maxX = 0;
      metrics.forEach((m, idx) => {
        const glyphLeft = cursor - m.left;
        const glyphRight = cursor + m.right;
        if (idx === 0) {
          minX = glyphLeft;
          maxX = glyphRight;
        } else {
          minX = Math.min(minX, glyphLeft);
          maxX = Math.max(maxX, glyphRight);
        }
        cursor += m.width;
      });

      const totalWidth = maxX - minX;
      let x = centerX - totalWidth / 2 - minX;
      const prevAlign = ctx.textAlign;
      ctx.textAlign = 'left';
      segments.forEach((seg, idx) => {
        ctx.fillStyle = seg.className === 'grad2' ? '#00F2FF' : seg.className === 'grad3' ? '#FF4488' : seg.className === 'grad' ? '#BC13FE' : '#FFFFFF';
        ctx.fillText(seg.text, x, y);
        x += metrics[idx].width;
      });
      ctx.textAlign = prevAlign;
    }

    async function renderCard() {
      await waitForRenderAssets();
      const originalCard = document.getElementById('capture-area');
      
      // 1. Clonamos fisicamente o card para escapar do "scale" e do quadro pequeno da tela
      const clone = originalCard.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';
      
      // 2. Removemos gradientes do texto (html2canvas não suporta background-clip)
      const grads = clone.querySelectorAll('.grad, .grad2, .grad3');
      grads.forEach(g => {
        g.style.background = 'none';
        g.style.webkitBackgroundClip = 'initial';
        g.style.backgroundClip = 'initial';
        if (g.classList.contains('grad2')) g.style.color = '#00F2FF';
        else if (g.classList.contains('grad3')) g.style.color = '#FF4488';
        else g.style.color = '#BC13FE';
      });

      // 2b. html2canvas costuma distorcer blur/radial-gradient e desbotar texto.
      // Simplificamos apenas o clone exportado para evitar círculo branco e letras apagadas.
      const orbCenter = clone.querySelector('.orb-center');
      if (orbCenter) {
        orbCenter.style.display = 'none';
      }
      const orbGlow = clone.querySelector('.orb-glow');
      if (orbGlow) {
        orbGlow.style.display = 'none';
      }
      const lightTop = clone.querySelector('.light-t');
      if (lightTop) {
        lightTop.style.filter = 'none';
        lightTop.style.background = 'radial-gradient(ellipse, rgba(188,19,254,.22) 0%, transparent 72%)';
      }
      const lightBottom = clone.querySelector('.light-b');
      if (lightBottom) {
        lightBottom.style.filter = 'none';
        lightBottom.style.background = 'radial-gradient(ellipse, rgba(255,0,229,.14) 0%, transparent 72%)';
      }
      const h1Clone = clone.querySelector('.h1');
      if (h1Clone) {
        h1Clone.style.color = '#FFFFFF';
        h1Clone.style.textShadow = '0 0 10px rgba(188,19,254,.18)';
        h1Clone.style.opacity = '1';
      }
      const subClone = clone.querySelector('.sub');
      if (subClone) {
        subClone.style.color = 'rgba(255,255,255,.82)';
        subClone.style.opacity = '1';
      }
      const eyebrowClone = clone.querySelector('.eyebrow');
      if (eyebrowClone) {
        eyebrowClone.style.color = '#00F2FF';
        eyebrowClone.style.textShadow = '0 0 8px rgba(0,242,255,.35)';
        eyebrowClone.style.opacity = '1';
      }

      // 3. Estúdio Fantasma: Colamos o card gigante na coordenada Y atual da tela 
      // (para o navegador renderizar perfeitamente), mas com z-index negativo para ficar invisível pra você!
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = window.scrollY + 'px';
      container.style.left = '0';
      container.style.width = '1080px';
      container.style.height = '0'; // Altura zero para não criar barra de rolagem na sua tela
      container.style.overflow = 'visible';
      container.style.zIndex = '-9999';
      container.style.pointerEvents = 'none';
      
      container.appendChild(clone);
      document.body.appendChild(container);

      // 4. Aguardamos 150ms para garantir que os pixels foram desenhados na memória
      await new Promise(r => setTimeout(r, 150));

      const canvas = await html2canvas(clone, {
        scale: 1, // 1080x1080 exatos pro Instagram engolir feliz
        useCORS: true,
        backgroundColor: '#0B0112',
        logging: false,
        width: 1080,
        height: 1080
      });

      // Limpamos a bagunça
      document.body.removeChild(container);
      
      return canvas.toDataURL('image/jpeg', 0.92);
    }

    // Gera imagem 1080×1920 para Story: card centralizado + brand background nas faixas
    async function renderCardCanvas() {
      await waitForRenderAssets();

      const W = 1080, H = 1080;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      const contentContainer = document.getElementById('content-container');
      const layout = (currentVisualState && currentVisualState.layout) || 'center';
      const isCenterLayout = layout === 'center';
      const isRightLayout = layout === 'right-v' || layout === 'right-h';
      const showAccentV = document.getElementById('card-accent-v').style.display !== 'none';
      const showAccentH = document.getElementById('card-accent-h').style.display !== 'none';
      const showBadge = !slideBadge.classList.contains('hidden');
      const visual = currentVisualState || {};
      const palette = visual.palette || { t:'rgba(188,19,254,', b:'rgba(255,0,229,', o:'rgba(188,19,254,' };
      const showGrid = visual.showGrid !== false;
      const showCorners = visual.showCorners !== false;
      const showRings = visual.showRings !== false;
      const extras = currentContentExtras || { supporting: [], stats: [], formatHint: 'fact' };
      const eyebrow = stripHtml(document.getElementById('card-eyebrow').innerHTML);
      const h1Lines = parseRichLines(document.getElementById('card-h1').innerHTML);
      const subText = stripHtml(document.getElementById('card-sub').innerHTML);

      ctx.fillStyle = '#0B0112';
      ctx.fillRect(0, 0, W, H);

      if (showGrid) {
        ctx.strokeStyle = 'rgba(188,19,254,0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      }

      if (visual.bgVariant === 'diagonal') {
        let glow = ctx.createLinearGradient(0, 0, W, H);
        glow.addColorStop(0, palette.t + '.24)');
        glow.addColorStop(0.35, 'rgba(11,1,18,0)');
        glow.addColorStop(1, palette.b + '.14)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        glow = ctx.createLinearGradient(W, 0, 0, H);
        glow.addColorStop(0, palette.o + '.10)');
        glow.addColorStop(0.5, 'rgba(11,1,18,0)');
        glow.addColorStop(1, 'rgba(11,1,18,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      } else if (visual.bgVariant === 'split') {
        let glow = ctx.createRadialGradient(80, H / 2, 20, 80, H / 2, 340);
        glow.addColorStop(0, palette.t + '.28)');
        glow.addColorStop(1, 'rgba(11,1,18,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        glow = ctx.createRadialGradient(W - 80, H / 2, 20, W - 80, H / 2, 340);
        glow.addColorStop(0, palette.b + '.20)');
        glow.addColorStop(1, 'rgba(11,1,18,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      } else { // orbital, halo, etc.
        let glow = ctx.createRadialGradient(W / 2, 200, 100, W / 2, 200, 500);
        glow.addColorStop(0, palette.t + '.22)');
        glow.addColorStop(1, 'rgba(11,1,18,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        glow = ctx.createRadialGradient(W / 2, H - 220, 100, W / 2, H - 220, 600);
        glow.addColorStop(0, palette.b + '.16)');
        glow.addColorStop(1, 'rgba(11,1,18,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        glow = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 290);
        glow.addColorStop(0, palette.o + '.35)');
        glow.addColorStop(1, 'rgba(11,1,18,0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      if (showRings) {
        ctx.lineWidth = 1;
        const ringRadii = [230, 320, 410];
        const ringColors = [
          visual.bgVariant === 'tunnel' ? 'rgba(0,242,255,.18)' : 'rgba(188,19,254,.3)',
          visual.bgVariant === 'tunnel' ? 'rgba(188,19,254,.14)' : 'rgba(188,19,254,.15)',
          visual.bgVariant === 'tunnel' ? 'rgba(255,0,229,.08)' : 'rgba(188,19,254,.07)'
        ];
        ringRadii.forEach((radius, i) => {
          ctx.strokeStyle = ringColors[i];
          ctx.beginPath();
          if (visual.bgVariant === 'frame-shift') {
            ctx.roundRect(W/2 - radius, H/2 - radius, radius*2, radius*2, 24);
          } else {
            ctx.arc(W / 2, H / 2, radius, 0, 2 * Math.PI);
          }
          ctx.stroke();
        });
      }

      if (showCorners) {
        ctx.strokeStyle = 'rgba(188,19,254,.5)';
        ctx.lineWidth = 2;
        const s = 40, o = 32;
        ctx.beginPath();
        ctx.moveTo(o, o + s); ctx.lineTo(o, o); ctx.lineTo(o + s, o);
        ctx.moveTo(W - o, o + s); ctx.lineTo(W - o, o); ctx.lineTo(W - o - s, o);
        ctx.moveTo(o, H - o - s); ctx.lineTo(o, H - o); ctx.lineTo(o + s, H - o);
        ctx.moveTo(W - o, H - o - s); ctx.lineTo(W - o, H - o); ctx.lineTo(W - o - s, H - o);
        ctx.stroke();
      }

      if (showAccentV) {
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.3, '#BC13FE');
        grad.addColorStop(0.7, '#FF00E5');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(isRightLayout ? W - 80 - 6 : 80, 0, 6, H);
      }
      if (showAccentH) {
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, '#FF00E5');
        grad.addColorStop(0.5, '#BC13FE');
        grad.addColorStop(1, '#00F2FF');
        ctx.fillStyle = grad;
        ctx.fillRect(0, isRightLayout ? H - 80 - 6 : 80, W, 6);
      }

      if (processedLogoUrl) {
        const img = new Image();
        await new Promise(res => { img.onload = res; img.src = processedLogoUrl; });
        ctx.drawImage(img, (W - 208) / 2, H - 40 - 52, 208, 52);
      }

      // Text rendering
      const centerX = isCenterLayout ? W / 2 : isRightLayout ? W - 80 - 400 : 80 + 400;
      const startX = isCenterLayout ? 90 : isRightLayout ? W - 80 - 760 : 80;
      const textWidth = isCenterLayout ? W - 180 : 760;
      ctx.textAlign = isCenterLayout ? 'center' : isRightLayout ? 'right' : 'left';

      ctx.font = "500 13px 'JetBrains Mono'";
      ctx.fillStyle = '#00F2FF';
      ctx.shadowColor = 'rgba(0,242,255,.7)';
      ctx.shadowBlur = 14;
      ctx.fillText(eyebrow, centerX, 320);
      ctx.shadowBlur = 0;

      ctx.font = "900 62px 'Montserrat'";
      ctx.textBaseline = 'middle';
      let y = 420;
      h1Lines.forEach(line => {
        if (isCenterLayout) {
          fillCenteredText(ctx, line, centerX, y);
        } else {
          const xPos = isRightLayout ? startX + textWidth : startX;
          ctx.textAlign = isRightLayout ? 'right' : 'left';
          line.forEach(seg => {
            ctx.fillStyle = seg.className === 'grad2' ? '#00F2FF' : seg.className === 'grad3' ? '#FF4488' : seg.className === 'grad' ? '#BC13FE' : '#FFFFFF';
            ctx.fillText(seg.text, xPos, y);
          });
        }
        y += 62 * 1.06;
      });

      y -= 20;
      ctx.fillStyle = '#BC13FE';
      ctx.shadowColor = 'rgba(188,19,254,.8)';
      ctx.shadowBlur = 12;
      ctx.fillRect(isCenterLayout ? centerX - 30 : isRightLayout ? startX + textWidth - 60 : startX, y, 60, 2);
      ctx.shadowBlur = 0;
      y += 40;

      ctx.font = "400 20px 'Plus Jakarta Sans'";
      ctx.fillStyle = 'rgba(255,255,255,.72)';
      const subLines = wrapText(ctx, subText, textWidth);
      subLines.forEach(line => {
        ctx.fillText(line, isCenterLayout ? centerX : isRightLayout ? startX + textWidth : startX, y);
        y += 20 * 1.55;
      });

      if (showBadge) {
        ctx.font = "500 11px 'JetBrains Mono'";
        ctx.fillStyle = 'rgba(188,19,254,.7)';
        ctx.textAlign = 'right';
        ctx.fillText((currentSlideIdx + 1) + ' / ' + carouselSlides.length, W - 56, 48 + 11);
      }

      return canvas.toDataURL('image/jpeg', 0.92);
    }

    // ============================================================
    // PUBLISH
    // ============================================================
    btnPublish.addEventListener('click', async () => {
      btnPublish.disabled = true;
      btnPublish.innerHTML = 'PUBLICANDO...';
      statusMsg.classList.remove('hidden');
      statusMsg.style.background = 'rgba(188,19,254,.1)';
      statusMsg.style.color = '#BC13FE';
      statusMsg.innerHTML = 'Preparando e enviando imagens para as plataformas...';

      try {
        const platforms = [];
        if (document.getElementById('pub-instagram').checked) platforms.push('instagram');
        if (document.getElementById('pub-story').checked) platforms.push('instagram-story');
        if (document.getElementById('pub-linkedin').checked) platforms.push('linkedin');

        const caption = postContent.value;
        let results = [];

        if (currentPostType === 'instagram-carousel') {
          const imageUrls = [];
          for (let i = 0; i < carouselSlides.length; i++) {
            showSlide(i);
            await new Promise(r => setTimeout(r, 50)); // Pequeno delay para DOM atualizar
            const imgData = await renderCard();
            imageUrls.push(imgData);
          }
          showSlide(0); // Volta pro primeiro

          const res = await fetchJson('/api/publish-carousel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              images: imageUrls,
              caption: caption,
              platforms: platforms
            })
          });
          results = res.results || ['Carrossel publicado.'];

        } else {
          const imageBase64 = await renderCard();
          const res = await fetchJson('/api/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: caption,
              imageBase64: imageBase64,
              platforms: platforms
            })
          });
          results = res.results || ['Publicado.'];
        }

        statusMsg.style.background = 'rgba(16,185,129,.1)';
        statusMsg.style.color = '#10b981';
        statusMsg.innerHTML = '<strong>Sucesso!</strong><br>' + results.join('<br>');

      } catch (e) {
        statusMsg.style.background = 'rgba(239,68,68,.1)';
        statusMsg.style.color = '#ef4444';
        statusMsg.innerHTML = '<strong>Erro ao publicar:</strong><br>' + e.message;
      } finally {
        btnPublish.disabled = false;
        btnPublish.innerHTML = '✦ &nbsp;Aprovar e Publicar nas Redes';
      }
    });

  </script>
</body>
</html>`;

// ============================================================
// VERCEL HANDLER
// ============================================================
export default async function handler(req: any, res: any) {
  const agent = new SocialMediaAgent();
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/strategy') {
    try {
      const strategy = await agent.generateStrategy();
      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERIZON · Estratégia de Conteúdo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { background:#080010; font-family:'Plus Jakarta Sans',sans-serif; color:#fff; }
    .panel { background:rgba(255,255,255,.03); border:0.5px solid rgba(188,19,254,.2); border-radius:16px; padding:24px; }
    .mono { font-family:'JetBrains Mono',monospace; }
    .btn-nav { background:rgba(188,19,254,.12); border:0.5px solid rgba(188,19,254,.3); color:#BC13FE; padding:8px 16px; border-radius:8px; cursor:pointer; font-family:'JetBrains Mono',monospace; font-size:12px; transition:all .2s; }
    .btn-nav:hover { background:rgba(188,19,254,.2); }
    h2 { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; color:#00F2FF; text-transform:uppercase; margin-bottom:12px; margin-top:24px; }
    ul { list-style:none; padding-left:0; }
    li { background:rgba(255,255,255,.04); border-left:2px solid #BC13FE; padding:12px 16px; margin-bottom:8px; border-radius:0 8px 8px 0; font-size:14px; color:rgba(255,255,255,.75); line-height:1.6; }
  </style>
</head>
<body class="p-4 md:p-8">
  <div class="max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <div class="mono" style="font-size:10px;letter-spacing:.25em;color:#BC13FE;text-transform:uppercase;margin-bottom:10px;">Estratégia de Conteúdo · 2025</div>
      <h1 style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:2.2rem;color:#fff;letter-spacing:3px;">ERI<span style="color:#BC13FE;">ZON</span></h1>
      <p style="color:rgba(255,255,255,.3);font-size:12px;margin-top:6px;letter-spacing:.05em;">Inteligência que antecipa. Performance que escala.</p>
      <div style="margin-top:14px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
        <a href="/" class="btn-nav" style="text-decoration:none;">Estúdio</a>
        <a href="/strategy" class="btn-nav" style="text-decoration:none;">Estratégia</a>
      </div>
    </div>
    <div class="panel">
      <h2>// Posicionamento Central</h2>
      <ul>${strategy.positioning.map(s => `<li>${s}</li>`).join('')}</ul>
      <h2>// Instagram</h2>
      <ul>${strategy.instagram.map(s => `<li>${s}</li>`).join('')}</ul>
      <h2>// LinkedIn</h2>
      <ul>${strategy.linkedin.map(s => `<li>${s}</li>`).join('')}</ul>
      <h2>// Growth Loops</h2>
      <ul>${strategy.growthLoops.map(s => `<li>${s}</li>`).join('')}</ul>
      <h2>// Cadência Semanal</h2>
      <ul>${strategy.weeklyCadence.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
  </div>
</body>
</html>`;
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(HTML_TEMPLATE);
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (url.pathname === '/api/generate') {
        const { type, recentPosts, editorialTab, uploadContext } = body;
        const content = await agent.generatePost(type, recentPosts, editorialTab, uploadContext);
        res.status(200).json(content);
      } else if (url.pathname === '/api/generate-carousel') {
        const { recentPosts, editorialTab } = body;
        const content = await agent.generateCarousel(recentPosts, editorialTab);
        res.status(200).json(content);
      } else if (url.pathname === '/api/publish') {
        const { content, imageBase64, platforms } = body;
        const imageUrl = await uploadImageToCloud(imageBase64);
        const results = await agent.postToSocialMedia(content, imageUrl, imageBase64, platforms);
        res.status(200).json({ results });
      } else if (url.pathname === '/api/publish-carousel') {
        const { images, caption, platforms } = body;
        const imageUrls = await Promise.all(images.map((img: any) => uploadImageToCloud(img)));
        const results = [];
        if (platforms.includes('instagram')) {
          try {
            await agent.postCarouselToInstagram(imageUrls, caption);
            results.push('🎠 Instagram Carrossel: Sucesso');
          } catch (e: any) {
            results.push(`🎠 Instagram Carrossel: Erro (${e.message})`);
          }
        }
        if (platforms.includes('linkedin')) {
           try {
            await agent.postToSocialMedia(caption, imageUrls[0], images[0], ['linkedin']);
            results.push('💼 LinkedIn (1º slide): Sucesso');
          } catch (e: any) {
            results.push(`💼 LinkedIn: Erro (${e.message})`);
          }
        }
        res.status(200).json({ results });
      } else {
        res.status(404).json({ error: 'Not Found' });
      }
    } catch (error: any) {
      logger.error('API Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function uploadImageToCloud(base64Data: string): Promise<string> {
  const image = parseImagePayload(base64Data);

  // 1. ImgBB (Simples e gratuito, ideal para Instagram)
  if (process.env.IMGBB_API_KEY) {
    const formData = new URLSearchParams();
    formData.append('key', process.env.IMGBB_API_KEY);
    formData.append('image', image.base64);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json() as any;
    if (data.success) return data.data.url;
    throw new Error(`Falha no ImgBB: ${JSON.stringify(data)}`);
  }

  // 2. Vercel Blob
  if (process.env.BLOB_UPLOAD_TOKEN) {
    const filename = `erizon-post-${Date.now()}.${image.extension}`;
    const buffer = Buffer.from(image.base64, 'base64');

    const response = await fetch(`https://blob.vercel-storage.com/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_UPLOAD_TOKEN}`,
        'Content-Type': image.mimeType,
        'x-api-version': '7' // Vercel exige isso na API REST direta
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha no upload para o Vercel Blob: ${errorText}`);
    }

    const data = await response.json() as any;
    return data.url;
  }

  // 3. Fallback local (Funciona para o LinkedIn, mas o Instagram recusa Base64)
  logger.warn('Nenhum serviço de hospedagem de imagem configurado no .env (IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN). Retornando Base64 direto.');
  return base64Data;
}