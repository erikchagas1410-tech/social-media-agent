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

4 GANCHOS VIRAIS PARA POSTS ESTÁTICOS:
- GANCHO DE MEDO: Aponte um erro ou perda que o gestor não percebe — ex: "O erro de R$10.000 que a maioria dos gestores comete (e como a IA evita)."
- GANCHO DE CURIOSIDADE: Revele algo oculto que o mercado não mostra — ex: "O que o Meta Ads não te conta sobre o ROAS real."
- GANCHO DE AUTORIDADE: Posicione a Erizon como o que as top agências já usam — ex: "Como as top agências estão usando IA para escalar 5x mais rápido."
- GANCHO DE IDENTIFICAÇÃO: Diga em voz alta o que o gestor sente mas não expressa — ex: "Você passa mais tempo em planilhas do que em estratégias? Leia isso." Esse tipo gera compartilhamento nos Stories de outras pessoas.

LOOPS DE ENGAJAMENTO:
- SHAREABLE CONTENT: Escreva o que o público pensa, mas não sabe expressar. Isso faz a pessoa postar no próprio Story.
- SAVEABLE CONTENT: Crie tutoriais e checklists que sirvam como consulta rápida. O gestor salva porque vai precisar amanhã.
- CTA DE COMENTÁRIO: Peça para comentar "IA" para receber mais informação no Direct — aumenta engajamento e conversão.
- CTA DE SALVAMENTO: Termine sempre com "Salve para não esquecer" ou "Guarda esse post — você vai precisar".

CADÊNCIA SEMANAL (4x por semana):
- SEGUNDA: Carrossel educativo (Deep Dive técnico, guia, como a IA resolve)
- QUARTA: Imagem única / Infográfico (tabela comparativa, fluxo de decisão, cheat sheet)
- SEXTA: Carrossel de prova social (estudo de caso, antes/depois, resultado real)
- DOMINGO: Tweet Style (frase de impacto polêmica, identificável, compartilhável)

HASHTAGS: #GestordeTrafego #MetaAds #Erizon #InteligenciaOperacional #MarketingDigital #TrafegoPago #Performance #AgenciaDigital #ROAS #FacebookAds
`;

const ERIZON_PLATFORM_CONTEXT = `
=== ERIZON: PLATAFORMA DE GESTÃO E RELATÓRIOS PARA AGÊNCIAS DIGITAIS ===

O QUE É:
- SaaS para agências de marketing digital e gestores de tráfego centralizarem clientes, relatórios e operação
- substitui planilhas, capturas de tela e apresentações manuais por painéis e relatórios profissionais
- conecta dados do Meta (Instagram e Facebook), organiza o portfólio e transforma números brutos em relatórios visuais

O QUE OFERECE:
- Gestão centralizada de clientes com cadastro, segmento, status, histórico e visão geral do portfólio
- Relatórios de performance do Instagram com Meta Graph API, alcance, impressões, engajamento, seguidores, crescimento e comparativos
- Billing com Stripe, planos Core/Pro/Command, upgrade e downgrade no painel
- Dashboard administrativo da agência com alertas, visão geral e acesso rápido
- Infraestrutura moderna com Next.js 16, Turbopack, Supabase e autenticação segura

PRINCIPAIS MOTIVOS PARA USAR:
- Economia de tempo operacional
- Profissionalismo nas entregas ao cliente
- Escala sem caos
- Dados em tempo real
- Tudo em um lugar
- Custo-benefício para agências em crescimento

DIFERENCIAIS:
- Feita para a realidade das agências brasileiras
- Relatórios que impressionam em reuniões
- Integração real com a Meta Graph API
- Plataforma em evolução contínua
- Design pensado para uso diário
- Controle total da operação

PLANOS:
- Core: até 5 clientes
- Pro: até 20 clientes
- Command: clientes ilimitados, gestão de equipe e funcionalidades avançadas

PALETA OFICIAL:
- Azul Erizon #0F4C8A
- Azul Índigo #1A2D6B
- Ciano Elétrico #00B4D8
- Violeta #7C3AED
- Fundo claro #F0F4FF
- Branco #FFFFFF
- Texto escuro #111827

TEMAS DE POSTS SUGERIDOS:
- Funcionalidades da plataforma: relatórios, dashboard, billing
- Benefícios concretos: tempo economizado, profissionalismo nas entregas
- Depoimentos e cases de uso
- Curiosidades e dicas para gestores de tráfego
- Lançamento de novas funcionalidades
- Comparativos: com Erizon vs sem Erizon
- Métricas de impacto: ex "Relatório pronto em menos de 2 minutos"

TRATE ESTE BLOCO COMO DOCUMENTO INTERNO DE MARCA DA ERIZON, versão 1.0, para uso exclusivo em geração de conteúdo visual e alimentação de agentes de IA.
`;

// ============================================================
// INSTAGRAM 2026 ALGORITHM INTELLIGENCE
// ============================================================
const INSTAGRAM_2026_INTELLIGENCE = `
=== ALGORITMO INSTAGRAM 2026 — INTELIGÊNCIA ESTRATÉGICA ===

MUDANÇA CENTRAL: O algoritmo não distribui post — distribui INTERPRETAÇÃO.
- Ele entende sobre o que você fala, pra quem é relevante, em qual contexto aparece
- Perfis generalistas perdem alcance. Quem domina UM território temático é indexável
- Território ERIZON: "lucro e decisão inteligente em campanhas de tráfego pago"

INSTAGRAM COMO MOTOR DE BUSCA (SEO interno):
- Palavras-chave estratégicas em: legendas, alt text, eyebrow do card, bio
- Use frases que gestores de tráfego realmente pesquisam: "campanha dando prejuízo", "ROAS caindo", "como escalar sem perder margem"
- Evite palavras genéricas. Use vocabulário real do público: gestor, verba, budget, ROAS, CPL, frequência, criativo

RETENÇÃO INVISÍVEL — métricas que o algoritmo mais valoriza em 2026:
- Tempo de permanência no post (pausa no feed)
- Retorno ao post (assistiu de novo)
- Salvamento (vou precisar disso depois)
- Compartilhamento por Direct e grupos (relevância privada)
- Comentários ainda importam, mas MENOS que os acima
- Tradução: conteúdo deve fazer pensar "caramba, preciso salvar isso"

CONTEÚDO QUE GERA DECISÃO > conteúdo útil:
- Conteúdo forte = muda comportamento, não apenas informa
- Exemplos fracos: "dicas de tráfego", "como melhorar ROAS"
- Exemplos fortes: "se sua campanha tem isso, você tá jogando dinheiro fora hoje", "o erro que destrói o ROAS silenciosamente"

PRIMEIROS 3 SEGUNDOS DEFINEM DISTRIBUIÇÃO:
- O algoritmo usa o % de usuários que passam dos 3 primeiros segundos como filtro primário
- Hook visual + textual deve ser impossível de ignorar
- Posts "morrem" em 20 min mas podem renascer em 48h-7 dias — pense em biblioteca, não em viral

NARRATIVA CONTÍNUA > posts isolados:
- Episódios e séries viciam a audiência e aumentam retorno ao perfil
- Estrutura vencedora: Dia 1 (problema), Dia 2 (diagnóstico), Dia 3 (decisão/solução)
- Stories = episódios conectados, não fotos aleatórias

AUTORIDADE VEM DE POSIÇÃO FORTE, não de estética:
- Opinião forte + corte claro + visão diferente = salva + compartilha + debate
- Bater de frente com consensos errados do mercado gera autoridade real
- Exemplo: "Se você ainda analisa campanha só por ROAS, você tá atrasado"

CONTEÚDO "COM CARA DE IA" ESTÁ SENDO PENALIZADO:
- Evite estrutura perfeita demais e linguagem corporativa
- Use contexto real, bastidor, experiência específica
- Formato humano: "Analisei 37 campanhas essa semana e 80% tinham o mesmo erro"
- Música perde protagonismo — vídeos sem música performam melhor quando o conteúdo é forte

CADÊNCIA VENCEDORA 2026:
- 3 Reels/semana (dor + decisão) + 2 carrosséis (profundo + salvável) + Stories DIÁRIOS (narrativa)
- Carrossel = formato mais forte para salvamentos e profundidade
- Reel = melhor para alcance e novos olhares
- DMs e grupos > likes. Conteúdo que gera compartilhamento privado tem distribuição multiplicada
`;

const ERIZON_DESIGN_CHIEF_CONTEXT = `
=== DESIGN CHIEF ERIZON ===

Assuma o papel de "design-chief" da ERIZON: cada peça precisa nascer com intenção visual clara, hierarquia forte e linguagem futurista proprietária.

REGRAS DE DIREÇÃO:
- Nunca produza peça "genérica de social media". Cada arte precisa parecer parte de um sistema visual premium de produto SaaS.
- Toda composição deve ter 1 herói principal, 1 camada de contexto e 1 camada de prova/ação.
- O visual deve vender inteligência operacional, monitoramento, decisão, velocidade e precisão. Não pareça motivacional, coach ou criativo de agência genérico.
- O fundo circular/orb é só um recurso eventual. Não pode ser a identidade dominante do sistema.
- Prefira geometrias de interface, grids, fluxos de dados, barras de sinal, wedges, molduras técnicas, painéis, cortes diagonais e composições assimétricas.
- Cada pilar editorial pede uma família visual própria:
  - ERIZON: product system, command center, interface premium
  - Especialistas/Deep Dive/Toolbox: analytical board, charts, structures, cheat sheets
  - Mercado: newsroom futurista, pulse, update signal, market intelligence
  - Diagnósticos/Anti-Myth: contraste forte, leitura forense, urgência controlada
  - Social Proof/Uploads: frame de evidência, prova, recibo, destaque de resultado
  - Stories/Episódios/Séries: narrativa sequencial, progressão, continuidade visual
- Tipografia deve liderar sem esmagar o conteúdo. O título chama atenção; o subtítulo entrega substância.
- A peça precisa parecer cara, técnica e memorável mesmo sem animação.
`;

type PostType = 'instagram-feed' | 'instagram-story' | 'instagram-carousel' | 'linkedin';

type EditorialTab = 'erizon' | 'specialists' | 'market' | 'diagnostics' | 'stories' | 'social-proof' | 'anti-myth' | 'series' | 'uploads' | 'seo-search' | 'retention' | 'authority' | 'episodic' | 'deep-dive' | 'toolbox' | 'tweet-style';

interface BrandAngle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  tabs?: EditorialTab[];
}

const ERIZON_BRAND_ANGLES: BrandAngle[] = [
  { slug: 'centralized-client-management', title: 'Gestão centralizada de clientes', description: 'cadastro completo, portfólio em um painel, histórico de relatórios por cliente e operação organizada sem caos', keywords: ['clientes', 'portfólio', 'histórico', 'painel', 'gestão'], tabs: ['erizon', 'social-proof', 'authority'] },
  { slug: 'instagram-performance-reports', title: 'Relatórios de performance do Instagram', description: 'alcance, impressões, engajamento, seguidores, crescimento, comparação de períodos e posts com melhor desempenho', keywords: ['relatório', 'instagram', 'engajamento', 'seguidores', 'impressões'], tabs: ['erizon', 'toolbox', 'deep-dive'] },
  { slug: 'meta-graph-api-real-data', title: 'Integração real com a Meta Graph API', description: 'dados reais, atualizados e confiáveis, sem exportação manual, sem copiar dashboard e sem atrasos', keywords: ['meta graph api', 'dados reais', 'api', 'tempo real', 'conexão direta'], tabs: ['erizon', 'authority', 'market'] },
  { slug: 'meeting-ready-reports', title: 'Relatórios que impressionam em reuniões', description: 'visual limpo, métricas destacadas e entendimento imediato para o cliente perceber valor na hora', keywords: ['reunião', 'cliente', 'apresentar', 'visual', 'impressionam'], tabs: ['erizon', 'social-proof', 'stories'] },
  { slug: 'billing-and-plans', title: 'Billing e planos integrados', description: 'Stripe, cobrança recorrente, Core/Pro/Command, upgrade e downgrade direto pelo painel', keywords: ['stripe', 'billing', 'planos', 'core', 'pro', 'command', 'assinatura'], tabs: ['erizon', 'authority', 'deep-dive'] },
  { slug: 'dashboard-admin', title: 'Painel administrativo da agência', description: 'dashboard geral, alertas, acessos rápidos e operação responsiva em desktop e mobile', keywords: ['dashboard', 'alertas', 'admin', 'mobile', 'desktop'], tabs: ['erizon', 'toolbox', 'stories'] },
  { slug: 'time-savings', title: 'Economia de tempo operacional', description: 'relatórios que antes levavam horas passam a ficar prontos automaticamente para o time focar em estratégia', keywords: ['tempo', 'horas', 'operação', 'automático', 'estratégia'], tabs: ['erizon', 'social-proof', 'stories'] },
  { slug: 'professional-deliveries', title: 'Profissionalismo nas entregas', description: 'relatórios visuais e organizados que aumentam credibilidade, retenção e percepção de valor da agência', keywords: ['credibilidade', 'retenção', 'profissionalismo', 'entregas', 'valor'], tabs: ['erizon', 'social-proof', 'authority'] },
  { slug: 'scale-without-chaos', title: 'Escala sem caos', description: 'a plataforma acompanha o crescimento da agência de 5 para 50 clientes sem virar caos de arquivos e pastas', keywords: ['escala', 'caos', 'crescimento', '50 clientes', 'organização'], tabs: ['erizon', 'authority', 'diagnostics'] },
  { slug: 'all-in-one-platform', title: 'Tudo em um lugar', description: 'clientes, relatórios, métricas, faturamento e histórico centralizados em uma única plataforma', keywords: ['tudo em um lugar', 'centralizado', 'faturamento', 'histórico', 'plataforma'], tabs: ['erizon', 'toolbox', 'authority'] },
  { slug: 'cost-benefit', title: 'Custo-benefício para agências em crescimento', description: 'substitui CRM, relatórios, analytics e billing isolados com um único plano mensal mais acessível', keywords: ['custo-benefício', 'crm', 'analytics', 'billing', 'plano mensal'], tabs: ['erizon', 'authority', 'anti-myth'] },
  { slug: 'brazilian-agencies-reality', title: 'Feita para a realidade das agências brasileiras', description: 'pensada para o fluxo real de reuniões, cobrança por resultado e pressão operacional do mercado brasileiro', keywords: ['brasileiras', 'realidade', 'mercado brasileiro', 'agência', 'reuniões'], tabs: ['erizon', 'authority', 'stories'] },
  { slug: 'daily-ux', title: 'Design pensado para uso diário', description: 'interface limpa, intuitiva e rápida, sem curva longa de aprendizado e sem depender de treinamento pesado', keywords: ['interface', 'uso diário', 'intuitiva', 'rápida', 'aprendizado'], tabs: ['erizon', 'stories', 'social-proof'] },
  { slug: 'modern-infrastructure', title: 'Infraestrutura moderna e confiável', description: 'Next.js 16, Turbopack, Supabase, autenticação segura e arquitetura pronta para crescer com a agência', keywords: ['next.js', 'turbopack', 'supabase', 'infraestrutura', 'autenticação'], tabs: ['erizon', 'deep-dive', 'authority'] }
];

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
  tab?: string;
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

type ScheduledPostStatus = 'scheduled' | 'published' | 'failed';

interface ScheduledPost {
  id: string;
  createdAt: string;
  scheduledAt: string;
  postType: PostType;
  editorialTab: EditorialTab;
  caption: string;
  platforms: string[];
  images: string[];
  status: ScheduledPostStatus;
  results?: string[];
  publishedAt?: string;
  lastError?: string;
}

interface AutomationSettings {
  enabled: boolean;
  updatedAt: string;
}

interface SquadSummary {
  id: string;
  name: string;
  shortTitle: string;
  description: string;
  tags: string[];
  agents: string[];
  tasks: string[];
  workflows: string[];
  chiefAgent?: string;
  readme?: string;
  chiefPrompt?: string;
}

interface SquadChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface SquadArtifact {
  type: 'none' | 'document' | 'image-brief';
  title?: string;
  content?: string;
  format?: 'markdown' | 'text' | 'json';
}

function parseGroqWaitTime(message: string): string {
  const match = String(message || '').match(/Please try again in ([^.,]+\d(?:\.\d+)?s)/i);
  return match ? match[1] : '';
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

const TAB_CONTEXTS: Record<string, string> = {
  'erizon': 'Foque 100% na ERIZON: o que a plataforma calcula, como funciona o copiloto, pulse, decision feed, risk radar. Provas de valor, economia de tempo, bastidores, objeções comuns.',
  'specialists': 'Foque em dicas de especialistas: interpretação de ROAS, CPA, frequência, CTR. Erros de escala, sinais de fadiga de criativo, checklists e frameworks de otimização no Meta/Google Ads.',
  'market': 'Foque em notícias e atualizações de mercado: mudanças no Meta Ads, novidades de tracking, IA, criativos e leitura estratégica para quem compra mídia.',
  'diagnostics': 'Foque em diagnósticos de cenário real: ex: "ROAS caiu 30%", "frequência 4.2", "campanha boa no CTR, ruim no lucro". O que olhar primeiro, como resolver.',
  'stories': 'Foque em stories interativos: enquetes, quiz, pergunta aberta, reações. Crie conteúdo que force a resposta ou voto da audiência.',
  'social-proof': 'Foque em prova social: antes/depois, tempo economizado, problema detectado antes da perda, cases resumidos.',
  'anti-myth': 'Foque em quebrar mitos: "ROAS alto não significa lucro", "mais orçamento não corrige campanha ruim", "dashboard não é decisão".',
  'series': 'Foque em uma série fixa: "Radar da Semana", "Erro Caro", "Decisão de Hoje", "Raio-X de Campanha" ou "1 Minuto de Operação".',
  'uploads': 'Foque em feedback de clientes: celebre um resultado, agradeça o cliente, crie um hook mostrando que o método funciona. Se houver contexto adicional do usuário, use-o.',
  'seo-search': 'Foque em SEO do Instagram 2026: escreva captions com frases que gestores de tráfego realmente pesquisam. Use vocabulário real do mercado: "campanha dando prejuízo", "ROAS caindo", "como escalar sem perder margem", "frequência alta no Meta Ads". O conteúdo deve aparecer como resposta às buscas internas do Instagram. Termine com keywords naturais embutidas na legenda e CTA que incentive salvar.',
  'retention': 'Foque em retenção invisível 2026: crie conteúdo que faz a pessoa PAUSAR o scroll, rever o post, salvar e mandar no direct. Evite conteúdo apenas informativo — o post precisa gerar a sensação "caramba, preciso salvar isso agora". Use dados específicos, revelações surpreendentes, insights contraintuitivos. O algoritmo 2026 mede tempo de permanência, retorno ao post e compartilhamentos privados acima de tudo.',
  'authority': 'Foque em autoridade por posicionamento forte: opinião contundente, visão contrária ao consenso, corte claro sobre o que está errado no mercado. Exemplo de abordagem: "Se você ainda analisa campanha só por ROAS, você tá atrasado", "A maioria dos gestores confunde sobrevivência com estratégia". Não seja genérico — bata de frente com comportamentos errados do mercado que a ERIZON foi criada para resolver. Isso gera saves, shares e debate.',
  'episodic': 'Foque em narrativa episódica (série de 3 posts conectados): crie o EPISÓDIO 1 de uma sequência. Dia 1: apresente o PROBLEMA de forma chocante. O post deve terminar gerando curiosidade para o próximo. Use a estrutura de série reconhecível para criar vício de audiência e retorno ao perfil. Inclua no eyebrow a marcação do episódio: "// Ep. 1 de 3".',
  'deep-dive': 'Foque em conteúdo educativo técnico de alta profundidade (Deep Dive): explique como a IA da Erizon funciona por dentro, como o algoritmo detecta fadiga, como o Decision Feed gera ações, como o Risk Radar calcula risco. Objetivo: AUTORIDADE. O gestor deve terminar o post sabendo mais do que sabia antes. Use analogias técnicas, dados internos e lógica de engenharia de campanhas. Ideal para carrossel de 7-10 slides com estrutura: problema → explicação técnica → como a IA resolve → resultado mensurável.',
  'toolbox': 'Foque em conteúdo utilitário de alta utilidade (Ferramentas/Cheat Sheet): crie checklists, guias de bolso, tabelas comparativas e frameworks práticos para o dia a dia do gestor. Objetivo: SALVAMENTOS MÁXIMOS — o gestor precisa guardar porque vai usar amanhã. Exemplos: "Checklist de 7 pontos antes de escalar budget", "Tabela: Gestão Manual vs Gestão com Erizon AI", "Fluxo de decisão quando o ROAS cai". Termine SEMPRE com: "Salve esse post — você vai precisar".',
  'tweet-style': 'Foque em frases de impacto curtas e polêmicas (Tweet Style): uma frase que diz o que o gestor PENSA mas não sabe expressar, ou que vai contra o senso comum do mercado. Objetivo: COMPARTILHAMENTOS — a pessoa posta no próprio Story porque se identifica 100%. Exemplos: "Gestor que não usa IA em 2026 está operando botões, não estratégia.", "ROAS é vaidade. Margem é sanidade. Decisão automatizada é o futuro.", "Você não está gerindo tráfego. Você está apagando incêndio de dados." Subtítulo deve aprofundar a polêmica em 1 linha. Caption deve provocar debate: "Concorda? Comenta aqui."'
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
          `tab=${post.tab || 'geral'}`,
          `eyebrow=${post.eyebrow || '-'}`,
          `h1=${post.h1 || '-'}`,
          `angulo=${post.angle || '-'}`,
          `caption=${(post.caption || '').slice(0, 180)}`
        ];
        return parts.join(' | ');
      })
      .join('\n');
  }

  private buildTabContextBlock(tab: string, recentPosts: PostMemoryEntry[] = []): string {
    const tabPosts = recentPosts.filter(p => p.tab === tab);
    if (!tabPosts.length) return '';

    const lines = tabPosts
      .slice(-6)
      .map((post, idx) => {
        const captionSnippet = (post.caption || '').slice(0, 220);
        return `Post ${idx + 1}:\n  Título: ${post.h1 || '-'}\n  Eyebrow: ${post.eyebrow || '-'}\n  Ângulo: ${post.angle || '-'}\n  Caption: ${captionSnippet}`;
      })
      .join('\n\n');

    return `=== HISTÓRICO DESTA SÉRIE/PILAR (últimos ${tabPosts.length > 6 ? 6 : tabPosts.length} posts do tab "${tab}") ===
Use este histórico para CONTINUAR o raciocínio, aprofundar a narrativa ou avançar para o próximo estágio. NÃO repita o mesmo ângulo, título ou argumento. Construa em cima do que já foi dito.

${lines}`;
  }

  private buildFreshErizonAnglesBlock(recentPosts: PostMemoryEntry[] = [], editorialTab: EditorialTab = 'erizon'): string {
    const recentCorpus = recentPosts
      .slice(-16)
      .map(post => `${post.h1 || ''} ${post.caption || ''} ${post.angle || ''}`.toLowerCase())
      .join(' ');

    const eligibleAngles = ERIZON_BRAND_ANGLES.filter(angle => !angle.tabs || angle.tabs.includes(editorialTab) || editorialTab === 'erizon');
    const freshAngles = eligibleAngles.filter(angle => !angle.keywords.some(keyword => recentCorpus.includes(keyword.toLowerCase())));
    const selected = (freshAngles.length ? freshAngles : eligibleAngles).slice(0, 4);
    const blocked = eligibleAngles.filter(angle => angle.keywords.some(keyword => recentCorpus.includes(keyword.toLowerCase()))).slice(0, 6);

    const selectedLines = selected
      .map((angle, idx) => `${idx + 1}. ${angle.title} — ${angle.description}`)
      .join('\n');

    const blockedLines = blocked.length
      ? blocked.map(angle => `- ${angle.title}`).join('\n')
      : '- Nenhum bloqueio explícito encontrado.';

    return `=== ÂNGULOS FRESCOS DA ERIZON PARA ESTA GERAÇÃO ===
Escolha OBRIGATORIAMENTE 1 ângulo principal abaixo como base do post. Use fatos concretos desse bloco no H1, sub, supporting e caption.

${selectedLines}

=== ÂNGULOS A EVITAR AGORA ===
${blockedLines}

PROIBIDO cair em frase vaga tipo "a plataforma que sua agência precisava" sem ancorar em um fato concreto, funcionalidade, diferencial ou benefício específico da lista fresca acima.`;
  }

  private pickFallbackAngle(recentPosts: PostMemoryEntry[] = [], editorialTab: EditorialTab = 'erizon'): BrandAngle {
    const recentCorpus = recentPosts
      .slice(-16)
      .map(post => `${post.h1 || ''} ${post.caption || ''} ${post.angle || ''}`.toLowerCase())
      .join(' ');

    const eligible = ERIZON_BRAND_ANGLES.filter(angle => !angle.tabs || angle.tabs.includes(editorialTab) || editorialTab === 'erizon');
    const fresh = eligible.filter(angle => !angle.keywords.some(keyword => recentCorpus.includes(keyword.toLowerCase())));
    const pool = fresh.length ? fresh : eligible;
    const idx = recentPosts.length % Math.max(pool.length, 1);
    return pool[idx] || ERIZON_BRAND_ANGLES[0];
  }

  private buildOfflineFallbackPost(recentPosts: PostMemoryEntry[] = [], editorialTab: EditorialTab = 'erizon'): PostContent {
    const angle = this.pickFallbackAngle(recentPosts, editorialTab);
    const h1Map: Record<string, string> = {
      'centralized-client-management': 'Clientes em<br><span class="grad">um painel.</span>',
      'instagram-performance-reports': 'Instagram com<br><span class="grad">relatório pronto.</span>',
      'meta-graph-api-real-data': 'Dados reais<br><span class="grad">sem gambiarra.</span>',
      'meeting-ready-reports': 'Relatórios que<br><span class="grad">convencem.</span>',
      'billing-and-plans': 'Billing da agência<br><span class="grad">integrado.</span>',
      'dashboard-admin': 'Sua operação<br><span class="grad">visível.</span>',
      'time-savings': 'Horas viram<br><span class="grad">minutos.</span>',
      'professional-deliveries': 'Entregas com<br><span class="grad">credibilidade.</span>',
      'scale-without-chaos': 'Escala sem<br><span class="grad">bagunça.</span>',
      'all-in-one-platform': 'Tudo em<br><span class="grad">um lugar.</span>',
      'cost-benefit': 'Mais sistema,<br><span class="grad">menos custo.</span>',
      'brazilian-agencies-reality': 'Feita para<br><span class="grad">agências BR.</span>',
      'daily-ux': 'Interface que<br><span class="grad">flui.</span>',
      'modern-infrastructure': 'Infra pronta<br><span class="grad">pra crescer.</span>'
    };

    return {
      eyebrow: '// ERIZON Platform',
      h1: h1Map[angle.slug] || 'ERIZON com<br><span class="grad">fato real.</span>',
      sub: `A ERIZON resolve uma dor concreta da agência com foco em <strong>${angle.title.toLowerCase()}</strong>: ${angle.description}. Em vez de depender de planilhas, capturas e apresentações manuais, a operação ganha clareza, velocidade e uma entrega mais profissional para cada cliente.`,
      supporting: [
        `Fato-base desta geração: ${angle.title}.`,
        `Use a ERIZON para transformar ${angle.keywords.slice(0, 2).join(' e ')} em valor percebido pelo cliente.`,
        'O post foi variado automaticamente para não repetir a mesma promessa vaga da geração anterior.'
      ],
      stats: [
        { value: '1', label: 'plataforma' },
        { value: '100%', label: 'mais clareza' },
        { value: '0', label: 'planilhas soltas' }
      ],
      formatHint: 'fact',
      caption: `A ERIZON não é só "mais uma plataforma".\n\nNesta geração, o foco é ${angle.title.toLowerCase()}.\n\n${angle.description.charAt(0).toUpperCase() + angle.description.slice(1)}.\n\nEsse é o tipo de ganho que faz a agência parecer mais organizada, mais profissional e mais pronta para crescer sem caos.\n\nSalve esse post para lembrar desse diferencial da ERIZON.\n\n#Erizon #MarketingDigital #AgenciaDigital #Relatorios #Dashboard`
    };
  }

  private buildOfflineFallbackCarousel(recentPosts: PostMemoryEntry[] = [], editorialTab: EditorialTab = 'erizon'): CarouselContent {
    const angle = this.pickFallbackAngle(recentPosts, editorialTab);
    return {
      slides: [
        { eyebrow: '// ERIZON', h1: 'O problema<br><span class="grad">é operativo.</span>', sub: 'Planilhas e prints <strong>travam a escala</strong> da agência.' },
        { eyebrow: '// Fato', h1: angle.title.split(' ').slice(0, 2).join(' ') + '<br><span class="grad2">real.</span>', sub: `<strong>${angle.title}</strong> é um dos diferenciais concretos da plataforma.` },
        { eyebrow: '// Dor', h1: 'Menos tarefas<br><span class="grad3">manuais.</span>', sub: 'O time para de montar entrega <strong>no braço</strong>.' },
        { eyebrow: '// Plataforma', h1: 'Tudo mais<br><span class="grad">organizado.</span>', sub: 'Clientes, métricas e operação <strong>no mesmo fluxo</strong>.' },
        { eyebrow: '// Valor', h1: 'Cliente vê<br><span class="grad2">valor.</span>', sub: 'A entrega melhora e a percepção <strong>sobe rápido</strong>.' },
        { eyebrow: '// Escala', h1: 'Cresça sem<br><span class="grad3">caos.</span>', sub: 'A agência escala com mais previsibilidade <strong>e controle</strong>.' },
        { eyebrow: '// CTA', h1: 'Salve esse<br><span class="grad">ângulo.</span>', sub: 'Use esse diferencial da ERIZON <strong>na próxima reunião</strong>.' }
      ],
      caption: `Carrossel fallback baseado em ${angle.title.toLowerCase()}.\n\n${angle.description.charAt(0).toUpperCase() + angle.description.slice(1)}.\n\nSalve para usar esse argumento na sua comunicação da ERIZON.\n\n#Erizon #AgenciaDigital #MarketingDigital`
    };
  }

  async generatePost(postType: PostType = 'instagram-feed', recentPosts: PostMemoryEntry[] = [], editorialTab: EditorialTab = 'erizon', uploadContext: string = ''): Promise<PostContent> {
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
        'instagram-feed': editorialTab === 'tweet-style'
          ? 'Feed Instagram (1080x1080) no formato TWEET STYLE: fundo minimalista, uma frase única curta e polêmica, sem elementos decorativos. H1 é a frase inteira — impactante, identificável, compartilhável. Sub: aprofunda em 1 linha. Sem stats, sem supporting blocks. Caption provoca debate: "Concorda? Comenta aqui."'
          : editorialTab === 'toolbox'
            ? 'Feed Instagram (1080x1080) no formato INFOGRÁFICO / CHEAT SHEET: visual denso com informação útil. H1 descreve o que o gestor vai aprender. Sub lista o que contém. Supporting blocks com os itens do checklist/tabela. Caption termina OBRIGATORIAMENTE com "Salve esse post — você vai precisar".'
            : 'Feed Instagram (1080x1080). Hook visual poderoso. Caption até 2.200 chars com quebras de linha, emojis estratégicos e CTA para salvar/compartilhar.',
        'instagram-story': 'Story Instagram. Conteúdo rápido, impactante, que gera resposta/swipe. H1 ainda mais curto e chocante. Caption máximo 3 linhas, muito direto.',
        'instagram-carousel': 'SLIDE 1 (capa) de um carrossel. Hook DEVASTADOR usando gancho de MEDO, CURIOSIDADE, AUTORIDADE ou IDENTIFICAÇÃO. Caption completa como post solo. Termine com CTA "Comente IA" ou "Salve para não esquecer".',
        'linkedin': `Feed LinkedIn — formato editorial premium que impressiona analistas de growth, CMOs, investidores e fundadores.

ESTRUTURA OBRIGATÓRIA DA CAPTION (use quebras de linha entre cada bloco):
1. HEADLINE DE ABERTURA (1 linha): afirmação forte, dado surpreendente ou posicionamento contrário ao senso comum do mercado. Sem emoji. Sem pergunta retórica. Começa com o insight.
2. CONTEXTO DE MERCADO (2-3 linhas): o problema real que o mercado de tráfego pago enfrenta. Use dados específicos, tendências, ou comportamento observado em agências e gestores reais.
3. COMO A ERIZON RESOLVE (3-4 linhas): explique a abordagem técnica — o que o sistema detecta, como o algoritmo funciona, qual decisão automatiza. Seja específico: mencione Pulse, Decision Feed, Risk Radar ou Copiloto IA com contexto real.
4. IMPLICAÇÃO PARA O NEGÓCIO (2-3 linhas): o que isso significa em termos de margem, escala, eficiência operacional. Conecte à realidade de quem gerencia budget expressivo.
5. ENCERRAMENTO COM POSICIONAMENTO (1-2 linhas): visão sobre o futuro da gestão de tráfego com IA. Tom de liderança de mercado, não de vendas.
6. HASHTAGS (1 linha): 5-7 hashtags profissionais — #GrowthMarketing #PerformanceMarketing #MarketingOperations #AIMarketing #MetaAds #MarketingStrategy #Erizon

TOM: analítico, direto, sem hype, sem bullet points excessivos. Escreva como um executivo que conhece os dados. Uma ou duas quebras de linha entre blocos — nunca parece post de Instagram. Caption total entre 1.800 e 2.500 caracteres.
H1 e sub no CARD devem refletir o posicionamento de autoridade — H1 como manchete de publicação especializada, sub como lead do artigo.`
      };

      const tabPrompt = TAB_CONTEXTS[editorialTab] || TAB_CONTEXTS['erizon'];
      const freshErizonAnglesBlock = this.buildFreshErizonAnglesBlock(recentPosts, editorialTab);

      const CONTINUITY_TABS = new Set(['series', 'specialists', 'anti-myth', 'diagnostics', 'deep-dive', 'toolbox', 'tweet-style']);
      const tabContextBlock = CONTINUITY_TABS.has(editorialTab)
        ? this.buildTabContextBlock(editorialTab, recentPosts)
        : '';

      let userContext = `Gere um conteúdo VIRAL e INÉDITO para a ERIZON. Escolha um pilar editorial inesperado, com potencial real de engajamento e aquisição. Não repita o histórico recente. Tipo: ${postType}`;

      if (editorialTab === 'uploads' && uploadContext) {
        userContext = `Gere um conteúdo VIRAL baseado neste feedback/print enviado pelo usuário: "${uploadContext}". Destaque o resultado, crie um hook forte e uma prova social inquestionável. Tipo: ${postType}`;
      } else if (CONTINUITY_TABS.has(editorialTab) && tabContextBlock) {
        userContext = `Continue a narrativa deste pilar. Leia o histórico da série acima e crie o PRÓXIMO post — avance o raciocínio, aprofunde ou abra um novo ângulo que flua naturalmente do que já foi dito. Nunca repita títulos ou argumentos anteriores. Tipo: ${postType}`;
      }

      const systemPrompt = `Você é o estrategista-chefe de marketing e social media da ERIZON — especialista em criar conteúdo viral que engaja gestores de tráfego, faz o perfil explodir e gera leads qualificados no Brasil.

${ERIZON_BRAND_CONTEXT}

${ERIZON_PLATFORM_CONTEXT}

${INSTAGRAM_2026_INTELLIGENCE}

${ERIZON_DESIGN_CHIEF_CONTEXT}

TIPO DE POST: ${platformHints[postType]}
FOCO EDITORIAL: ${tabPrompt}
${freshErizonAnglesBlock}
${tabContextBlock ? `\n${tabContextBlock}\n` : ''}
HISTORICO GERAL RECENTE (todos os pilares — evite repetição de ângulos):
${this.buildRecentPostsBlock(recentPosts)}
${postType === 'linkedin' ? `
REGRAS ESPECÍFICAS LINKEDIN — FORMATO EDITORIAL PREMIUM:
1. A caption é a peça principal — deve ser um artigo de opinião técnica, não um post promocional
2. Abra com uma afirmação que analistas de growth e CMOs vão querer rebater ou salvar — dado concreto ou visão contrária ao mercado
3. Mostre profundidade: conecte o problema do mercado à solução da Erizon com lógica de causa e efeito
4. Use números e benchmarks que profissionais reconhecem: "taxa de saturação acima de 4.5 de frequência", "ROAS de break-even calculado por nicho", "latência de detecção abaixo de 15 minutos"
5. Tom de founder/analista sênior — sem emojis de mão ou foguete. Máximo 2 emojis simbólicos na caption inteira
6. H1 no card deve parecer manchete de publicação especializada (MIT Technology Review, CB Insights, Techcrunch Brasil)
7. Sub deve complementar o H1 como o lead do artigo — primeira frase que prende o leitor profissional
8. Não use bullet points excessivos. Prosa técnica fluida é mais impressionante no LinkedIn
9. Encerre com posicionamento de liderança de mercado — a Erizon como o futuro da operação de performance
10. Caption entre 1.800 e 2.500 caracteres — profundidade é o que diferencia no feed do LinkedIn
` : `REGRAS ABSOLUTAS DE COPYWRITING VIRAL (2026):
1. H1 deve PARAR O SCROLL nos primeiros 3 segundos: máximo 6 palavras, cria curiosidade OU choca OU muda comportamento
2. Cada post foca em UM único pilar editorial — nunca misture temas. O algoritmo indexa por território semântico
3. Caption: hook com keyword real → problema → insight surpresa → CTA estratégico (salvar, comentar "IA" ou compartilhar)
4. NUNCA use linguagem corporativa ou genérica. Escreva como expert humano com experiência real, não como IA
5. Use dados específicos e reais: "frequência 4.2", "ROAS 2.1 com CPL R$47" (autoridade e credibilidade)
6. H1: MÁXIMO 6 PALAVRAS com <br> na metade e <span class='grad'>palavra-impacto</span> na palavra mais forte
7. Nunca repita ângulo, promessa, dor principal ou CTA dominante do histórico recente
7.1. Quando falar da ERIZON, escolha um fato concreto novo: gestão centralizada, relatórios Instagram, Meta Graph API, billing, dashboard da agência, economia de tempo, profissionalismo nas entregas, escala sem caos, tudo em um lugar, custo-benefício, realidade brasileira, UX ou infraestrutura moderna
8. Escolha sempre um dos 4 ganchos virais: MEDO (erro/perda) | CURIOSIDADE (segredo/oculto) | AUTORIDADE (top agências) | IDENTIFICAÇÃO (o que o gestor sente mas não expressa)
9. SAVEABLE: conteúdo utilitário termina SEMPRE com "Salve esse post — você vai precisar amanhã"
10. SHAREABLE: conteúdo de opinião/tweet termina com "Concorda? Marca alguém que precisa ver isso" para gerar compartilhamento nos Stories
11. CTA DE COMENTÁRIO: quando o post for de alta curiosidade, use "Comente IA aqui embaixo para receber [benefício] no Direct"`}
12. A caption deve conter palavras-chave reais que gestores pesquisam no Instagram (SEO interno)
13. Conteúdo deve gerar DECISÃO ou MUDANÇA DE COMPORTAMENTO, não apenas informar

REGRAS DE DENSIDADE VISUAL — O card tem 1080x1080px. Use TODO o espaço disponível:
- sub: MÍNIMO 38 palavras, máximo 55 palavras. Desenvolva a ideia completamente com <strong> nas frases mais fortes
- supporting: SEMPRE preencha os 3 blocos — nunca retorne array vazio. Cada item deve ter 12-18 palavras com dado ou insight real
- stats: quando relevante (diagnóstico, prova social, deep-dive), use números reais e específicos do mercado de tráfego
- formatHint: "checklist" para posts utilitários/ferramentas, "stats" para diagnósticos/provas, "fact" para opinião/autoridade

RETORNE OBRIGATORIAMENTE UM JSON VÁLIDO:
{
  "eyebrow": "// Categoria (ex: // Risk Radar | // Decision Feed | // Anti-Vaidade | // Copiloto IA)",
  "h1": "Máx 6 palavras com <br> e <span class='grad'>palavra</span>",
  "sub": "Subtítulo MÍNIMO 38 palavras desenvolvendo o ponto central com <strong> no argumento mais forte",
  "supporting": ["insight ou checklist item 1 com 12-18 palavras e dado real", "insight ou checklist item 2 com 12-18 palavras", "insight ou checklist item 3 com 12-18 palavras"],
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
      return this.buildOfflineFallbackPost(recentPosts, editorialTab);
    }
  }

  async generateCarousel(recentPosts: PostMemoryEntry[] = [], editorialTab: EditorialTab = 'erizon'): Promise<CarouselContent> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return {
          slides: [{ eyebrow: '// ERRO', h1: 'Sem <span class="grad">Chave API</span>', sub: 'Configure a GROQ_API_KEY.' }],
          caption: 'Configure a chave API.'
        };
      }

      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const tabPromptCarousel = TAB_CONTEXTS[editorialTab] || TAB_CONTEXTS['erizon'];
      const freshErizonAnglesBlock = this.buildFreshErizonAnglesBlock(recentPosts, editorialTab);

      const systemPrompt = `Você é o estrategista-chefe de social media da ERIZON — expert em criar carrosseis virais que explodem no Instagram e geram centenas de salvamentos.

${ERIZON_BRAND_CONTEXT}

${ERIZON_PLATFORM_CONTEXT}

${INSTAGRAM_2026_INTELLIGENCE}

${ERIZON_DESIGN_CHIEF_CONTEXT}

FOCO EDITORIAL: ${tabPromptCarousel}

${freshErizonAnglesBlock}

HISTÓRICO RECENTE DE POSTS DA ERIZON:
${this.buildRecentPostsBlock(recentPosts)}

ESTRUTURA DO CARROSSEL (7 a 10 slides — narrativa progressiva que prende até o fim):
- Slide 1 (CAPA/HOOK): Hook DEVASTADOR usando um dos 4 ganchos: MEDO (erro que custa dinheiro), CURIOSIDADE (o que o mercado não mostra), AUTORIDADE (o que as top agências já fazem) ou IDENTIFICAÇÃO (o que o gestor sente mas não expressa). Deve fazer parar o scroll e sentir "preciso ver isso".
- Slides 2-3 (PROBLEMA): Aprofunda a dor com dados reais e específicos — frequência acima do limite, ROAS caindo, budget desperdiçado. Cada slide adiciona uma camada do problema. Gestor pensa "isso acontece comigo".
- Slides 4-6 (COMO A IA RESOLVE): Passo a passo de como a Erizon detecta e resolve o problema — específico, um produto por slide (Pulse, Decision Feed, Risk Radar, Copiloto IA). Mostre a lógica por trás, não só o resultado.
- Slide 7-8 (RESULTADO/COMPARATIVO): Antes vs Depois. Gestão manual vs Erizon AI. Use números reais ou plausíveis. Tabela comparativa se possível.
- Slide 9-10 (CTA): Slide final com CTA claro. Prioridade: "Comente IA para receber [benefício] no Direct" OU "Salve esse carrossel — você vai precisar amanhã". Nunca termine sem uma ação específica.

REGRAS POR SLIDE:
- eyebrow: categoria do slide (ex: // O Problema | // A Revelação | // Como a IA Resolve | // O Comparativo | // Próximo Passo)
- h1: MÁXIMO 5 PALAVRAS com <br> na metade e <span class='grad'> na palavra de impacto
- sub: até 14 palavras com <strong> no trecho mais forte — linguagem humana, não corporativa
- Narrativa progressiva com curiosidade crescente — cada slide é gancho para o próximo
- Nunca repita hook, dor principal, promessa ou CTA dominante do histórico recente
- Quando falar da ERIZON, escolha um fato concreto novo: gestão centralizada, relatórios Instagram, Meta Graph API, billing, dashboard da agência, economia de tempo, profissionalismo, escala sem caos, tudo em um lugar, custo-benefício, realidade brasileira, UX ou infraestrutura
- Use vocabulário que gestores pesquisam (SEO): CPL, ROAS, frequência, fadiga, budget, escala, margem

RETORNE EXATAMENTE 7 SLIDES no JSON (pode ser mais, nunca menos de 7).
CAPTION: conta a história completa, keywords reais de busca, CTA "Comente IA" ou "Salve para não esquecer" e hashtags.

RETORNE JSON VÁLIDO com exatamente 7 slides:
{
  "slides": [
    { "eyebrow": "string", "h1": "string", "sub": "string" },
    { "eyebrow": "string", "h1": "string", "sub": "string" },
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
      return this.buildOfflineFallbackCarousel(recentPosts, editorialTab);
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

${ERIZON_PLATFORM_CONTEXT}

${ERIZON_DESIGN_CHIEF_CONTEXT}

CONTEXTO ALGORITMO 2026: O Instagram distribui interpretação semântica, não só conteúdo. Métricas prioritárias: salvamentos > compartilhamentos por DM > tempo de permanência > comentários. Perfis com território temático claro ganham mais distribuição. SEO interno (palavras-chave em captions) é crítico. Conteúdo que gera decisão ou mudança de comportamento supera conteúdo apenas informativo. Narrativa episódica (séries de posts) cria audiência recorrente.

Monte um plano prático para 2026 levando em conta essas mudanças do algoritmo.
Foque em: posicionamento semântico (território claro), retenção invisível (salvamentos, DMs), narrativa contínua (séries), autoridade por posição forte, SEO interno e cadência consistente.
A cadência semanal deve seguir o modelo 4x/semana: Segunda (carrossel deep dive educativo), Quarta (imagem única / infográfico / cheat sheet), Sexta (carrossel prova social / estudo de caso), Domingo (tweet style / frase de impacto polêmica).
O objetivo é crescimento orgânico consistente com posts estáticos de alta qualidade, não virais pontuais.

Retorne JSON válido neste formato:
{
  "positioning": ["string", "string", "string"],
  "instagram": ["string", "string", "string", "string"],
  "linkedin": ["string", "string", "string", "string"],
  "growthLoops": ["string", "string", "string"],
  "weeklyCadence": ["string", "string", "string", "string"]
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

  private async waitForInstagramMediaReady(creationId: string, token: string, maxAttempts = 15, intervalMs = 3000): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, intervalMs));
      const res = await fetch(`https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${token}`);
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
    const invalidUrl = imageUrls.find(url => !url || url.startsWith('data:') || !url.startsWith('http'));
    if (invalidUrl !== undefined) {
      throw new Error(
        invalidUrl === ''
          ? 'Uma URL de imagem está vazia. Verifique se IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN estão configurados corretamente no .env.'
          : 'O Meta exige URLs públicas https://. Configure IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN no .env.'
      );
    }

    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
      throw new Error('Credenciais Instagram não configuradas.');
    }

    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    // 1. Cria todos os containers de slides em paralelo e aguarda todos prontos simultaneamente
    const slideContainerIds = await Promise.all(imageUrls.map(async (imageUrl) => {
      const res = await fetch(`https://graph.facebook.com/v21.0/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, is_carousel_item: true, access_token: token })
      });
      if (!res.ok) throw new Error(`Erro ao criar slide: ${await res.text()}`);
      const data = await res.json() as any;
      await this.waitForInstagramMediaReady(data.id, token, 6, 2000); // max 12s por slide, em paralelo
      return data.id as string;
    }));
    const childIds = slideContainerIds;

    // 2. Cria container do carrossel
    const carouselRes = await fetch(`https://graph.facebook.com/v21.0/${accountId}/media`, {
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

    await this.waitForInstagramMediaReady(carouselData.id, token, 8, 3000); // container: max 24s

    // 3. Publica
    const publishRes = await fetch(`https://graph.facebook.com/v21.0/${accountId}/media_publish`, {
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

  private validateInstagramImageUrl(imageUrl: string, context: string): void {
    if (!imageUrl) {
      throw new Error(`[${context}] URL da imagem está vazia. Verifique se IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN estão configurados corretamente no .env.`);
    }
    if (imageUrl.startsWith('data:')) {
      throw new Error(`[${context}] O Meta não aceita imagens em Base64. Configure IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN no .env para hospedar as imagens automaticamente.`);
    }
    if (!imageUrl.startsWith('https://')) {
      throw new Error(`[${context}] URL inválida recebida: "${imageUrl.slice(0, 80)}". O Meta exige URL pública https://.`);
    }
  }

  private async probeInstagramImageUrl(imageUrl: string, context: string): Promise<void> {
    this.validateInstagramImageUrl(imageUrl, context);

    const response = await fetch(imageUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'facebookexternalhit/1.1' }
    });

    if (!response.ok) {
      throw new Error(`[${context}] A URL hospedada respondeu HTTP ${response.status}: ${imageUrl}`);
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('image/')) {
      throw new Error(`[${context}] A URL hospedada não retornou imagem válida (${contentType || 'sem content-type'}): ${imageUrl}`);
    }
  }

  private async postToInstagramFeed(content: string, imageUrl: string): Promise<void> {
    await this.probeInstagramImageUrl(imageUrl, 'Instagram Feed');

    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
      throw new Error('Credenciais Instagram não configuradas.');
    }

    const res = await fetch(`https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption: content, access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!res.ok) throw new Error(`Instagram Feed Create ${res.status} [${imageUrl}]: ${await res.text()}`);
    const data = await res.json() as any;

    await this.waitForInstagramMediaReady(data.id, process.env.INSTAGRAM_ACCESS_TOKEN);

    const pub = await fetch(`https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: data.id, access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!pub.ok) throw new Error(`Instagram Feed Publish ${pub.status}: ${await pub.text()}`);
    logger.info(`Postado no Instagram Feed: ${data.id}`);
  }

  private async postToInstagramStory(imageUrl: string): Promise<void> {
    await this.probeInstagramImageUrl(imageUrl, 'Instagram Story');

    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
      throw new Error('Credenciais Instagram não configuradas.');
    }

    const res = await fetch(`https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, media_type: 'STORIES', access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!res.ok) throw new Error(`Instagram Story Create ${res.status} [${imageUrl}]: ${await res.text()}`);
    const data = await res.json() as any;

    await this.waitForInstagramMediaReady(data.id, process.env.INSTAGRAM_ACCESS_TOKEN);

    const pub = await fetch(`https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: data.id, access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!pub.ok) throw new Error(`Instagram Story Publish ${pub.status}: ${await pub.text()}`);
    logger.info(`Postado no Instagram Story: ${data.id}`);
  }
}

function parseSquadYaml(raw: string): Partial<SquadSummary> {
  const getSingle = (key: string): string => {
    const match = raw.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'));
    return match ? match[1].trim() : '';
  };

  const readList = (section: string): string[] => {
    const sectionMatch = raw.match(new RegExp(`${section}:\\s*\\n([\\s\\S]*?)(?:\\n\\S|$)`));
    if (!sectionMatch) return [];
    return sectionMatch[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.replace(/^- /, '').replace(/^["']|["']$/g, '').trim())
      .filter(Boolean);
  };

  const componentsMatch = raw.match(/components:\s*\n([\s\S]*?)\nconfig:/);
  const components = componentsMatch ? componentsMatch[1] : '';
  const readComponentList = (key: string): string[] => {
    const match = components.match(new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(?:\\n\\s{2}\\w|$)`));
    if (!match) return [];
    return match[1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.replace(/^- /, '').trim())
      .filter(Boolean);
  };

  return {
    id: getSingle('name'),
    name: getSingle('name'),
    shortTitle: getSingle('short-title'),
    description: getSingle('description'),
    tags: readList('tags'),
    agents: readComponentList('agents'),
    tasks: readComponentList('tasks'),
    workflows: readComponentList('workflows')
  };
}

function fileStem(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}

async function loadSquadSummaries(): Promise<SquadSummary[]> {
  const squadsRoot = path.resolve(__dirname, '../squads');
  if (!fs.existsSync(squadsRoot)) return [];

  const dirs = (await fs.promises.readdir(squadsRoot, { withFileTypes: true }))
    .filter(entry => entry.isDirectory() && entry.name !== '_example');

  const summaries: SquadSummary[] = [];
  for (const dir of dirs) {
    const squadPath = path.join(squadsRoot, dir.name);
    const yamlPath = path.join(squadPath, 'squad.yaml');
    if (!fs.existsSync(yamlPath)) continue;

    const yamlRaw = await fs.promises.readFile(yamlPath, 'utf8');
    const parsed = parseSquadYaml(yamlRaw);
    const readmePath = path.join(squadPath, 'README.md');
    const chiefAgentFile = (parsed.agents || []).find(agent => /chief|chair|orchestrator|vision-chief|traffic-chief|brand-chief|design-chief|copy-chief|story-chief|movement-chief|data-chief|hormozi-chief|cyber-chief/i.test(agent)) || parsed.agents?.[0] || '';
    const chiefPath = chiefAgentFile ? path.join(squadPath, 'agents', chiefAgentFile) : '';

    summaries.push({
      id: parsed.id || dir.name,
      name: parsed.name || dir.name,
      shortTitle: parsed.shortTitle || dir.name,
      description: parsed.description || '',
      tags: parsed.tags || [],
      agents: (parsed.agents || []).map(fileStem),
      tasks: (parsed.tasks || []).map(fileStem),
      workflows: (parsed.workflows || []).map(fileStem),
      chiefAgent: chiefAgentFile ? fileStem(chiefAgentFile) : '',
      readme: fs.existsSync(readmePath) ? (await fs.promises.readFile(readmePath, 'utf8')).slice(0, 4000) : '',
      chiefPrompt: chiefPath && fs.existsSync(chiefPath) ? (await fs.promises.readFile(chiefPath, 'utf8')).slice(0, 5000) : ''
    });
  }

  return summaries.sort((a, b) => a.shortTitle.localeCompare(b.shortTitle, 'pt-BR'));
}

async function getSquadById(id: string): Promise<SquadSummary | null> {
  const squads = await loadSquadSummaries();
  return squads.find(squad => squad.id === id) || null;
}

async function chatWithSquad(params: { squadId: string; message: string; history?: SquadChatTurn[] }): Promise<{ reply: string; artifact: SquadArtifact }> {
  try {
    const squad = await getSquadById(params.squadId);
    if (!squad) {
      throw new Error('Squad não encontrado.');
    }
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Configure a GROQ_API_KEY para conversar com os squads.');
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const squadChatModel = process.env.GROQ_SQUAD_CHAT_MODEL || 'llama-3.1-8b-instant';
    const systemPrompt = `Você está operando como o squad "${squad.shortTitle}".

DADOS DO SQUAD:
- id: ${squad.id}
- descrição: ${squad.description}
- chief/orchestrator: ${squad.chiefAgent || 'não informado'}
- agentes: ${squad.agents.join(', ')}
- tarefas: ${squad.tasks.join(', ')}
- workflows: ${squad.workflows.join(', ')}
- tags: ${squad.tags.join(', ')}

README DO SQUAD:
${(squad.readme || '').slice(0, 900)}

AGENTE PRINCIPAL / CHIEF:
${(squad.chiefPrompt || '').slice(0, 1400)}

REGRAS:
- Responda como um squad especialista, não como assistente genérico.
- Seja objetivo, útil e acionável.
- Se o pedido for por documento, devolva um artefato em markdown completo.
- Se o pedido envolver imagem, peça visual, criativo, post ou layout, devolva um artefato do tipo "image-brief" com direção visual, copy, estrutura e instruções de execução.
- Mantenha a resposta enxuta e de alto valor. Evite desperdiçar tokens.
- Se não houver artefato explícito, use type "none".
- Nunca invente capacidades técnicas específicas do squad que não apareçam no contexto. Quando inferir, deixe implícito com cautela.

RETORNE JSON VÁLIDO:
{
  "reply": "resposta principal ao usuário",
  "artifact": {
    "type": "none|document|image-brief",
    "title": "título opcional",
    "format": "markdown|text|json",
    "content": "conteúdo opcional"
  }
}`;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    (params.history || []).slice(-6).forEach(turn => {
      messages.push({ role: turn.role, content: turn.content.slice(0, 1200) });
    });
    messages.push({ role: 'user', content: params.message.slice(0, 2400) });

    const response = await groq.chat.completions.create({
      model: squadChatModel,
      temperature: 0.6,
      max_tokens: 900,
      response_format: { type: 'json_object' },
      messages
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);
    return {
      reply: parsed.reply || 'Sem resposta do squad.',
      artifact: {
        type: parsed?.artifact?.type || 'none',
        title: parsed?.artifact?.title || '',
        format: parsed?.artifact?.format || 'text',
        content: parsed?.artifact?.content || ''
      }
    };
  } catch (error: any) {
    const message = String(error?.message || error || '');
    if (message.includes('rate_limit_exceeded') || message.includes('Rate limit reached')) {
      const waitTime = parseGroqWaitTime(message);
      throw new Error(`A Groq bateu no limite diário do chat dos squads${waitTime ? `; tente novamente em ${waitTime}` : ''}. Reduzi o consumo desse fluxo, mas neste momento a sua cota do dia já foi quase toda usada.`);
    }
    throw error;
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
    .chat-shell { display:grid; grid-template-columns:280px minmax(0,1fr); gap:18px; }
    .squad-list { display:flex; flex-direction:column; gap:10px; max-height:680px; overflow:auto; padding-right:4px; }
    .squad-item { background:rgba(255,255,255,.03); border:0.5px solid rgba(255,255,255,.08); border-radius:12px; padding:12px; cursor:pointer; transition:all .2s; }
    .squad-item.active { border-color:#00F2FF; background:rgba(0,242,255,.08); box-shadow:0 0 0 1px rgba(0,242,255,.12) inset; }
    .squad-item-title { font-size:13px; font-weight:700; color:#fff; }
    .squad-item-copy { font-size:11px; line-height:1.5; color:rgba(255,255,255,.55); margin-top:6px; }
    .chat-panel { background:rgba(255,255,255,.025); border:0.5px solid rgba(188,19,254,.16); border-radius:16px; padding:16px; min-height:680px; display:flex; flex-direction:column; }
    .chat-log { flex:1; min-height:300px; max-height:520px; overflow:auto; display:flex; flex-direction:column; gap:12px; padding-right:4px; }
    .chat-bubble { max-width:88%; border-radius:14px; padding:12px 14px; line-height:1.6; font-size:13px; white-space:pre-wrap; }
    .chat-bubble.user { align-self:flex-end; background:rgba(188,19,254,.12); border:1px solid rgba(188,19,254,.24); color:#fff; }
    .chat-bubble.assistant { align-self:flex-start; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.82); }
    .artifact-box { margin-top:14px; background:rgba(0,242,255,.05); border:1px solid rgba(0,242,255,.18); border-radius:12px; padding:14px; }
    .artifact-pre { max-height:240px; overflow:auto; white-space:pre-wrap; font-size:12px; line-height:1.6; color:rgba(255,255,255,.75); }
    .chat-actions { display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .pulsing { animation:pulse 1.5s ease-in-out infinite; }
    input[type="checkbox"] { accent-color:#BC13FE; width:14px; height:14px; }
    @media (max-width: 960px) {
      .chat-shell { grid-template-columns:1fr; }
      .squad-list { max-height:none; }
      .chat-panel { min-height:560px; }
      .chat-bubble { max-width:100%; }
    }

    /* ====== GEOMETRIC DECORATIVES ====== */
    .geo-tl { position:absolute; top:0; left:0; width:360px; height:360px; clip-path:polygon(0 0,100% 0,0 100%); pointer-events:none; }
    .geo-br { position:absolute; bottom:0; right:0; width:360px; height:360px; clip-path:polygon(100% 0,100% 100%,0 100%); pointer-events:none; }
    .geo-tr { position:absolute; top:0; right:0; width:260px; height:260px; clip-path:polygon(0 0,100% 0,100% 100%); pointer-events:none; }
    .slash-lines { position:absolute; inset:0; pointer-events:none; }
    .chart-sil { position:absolute; bottom:0; left:0; right:0; pointer-events:none; }
    .hrule-t { position:absolute; left:56px; right:56px; height:1px; pointer-events:none; }
    .hrule-b { position:absolute; left:56px; right:56px; height:1px; pointer-events:none; }
    .ghost-num { position:absolute; font-family:'JetBrains Mono',monospace; font-weight:700; user-select:none; pointer-events:none; overflow:hidden; white-space:nowrap; }
    .v-accent { position:absolute; top:80px; bottom:80px; width:3px; border-radius:2px; pointer-events:none; }
    .dot-field { position:absolute; inset:0; pointer-events:none; }
    /* ====== ENLARGED SUB & H1 SIZING ====== */
    .sub { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; color:rgba(255,255,255,.75); line-height:1.62; max-width:820px; }
    .sub strong { color:#fff; font-weight:600; }
    .h1 { font-family:'Montserrat',sans-serif; font-weight:900; line-height:1.05; color:#fff; text-shadow:0 0 40px rgba(188,19,254,.3); font-size:68px; word-wrap:break-word; max-width:100%; }
    /* tweet-style override: massive centered text */
    .card.tweet-mode .h1 { font-size:82px; line-height:1.08; }
    .card.tweet-mode .sub { font-size:26px; }
    .card.tweet-mode .support-wrap { display:none !important; }
    .tweet-bar { position:absolute; left:0; right:0; height:8px; pointer-events:none; }
    /* toolbox override: checklist prominent */
    .card.toolbox-mode .support-list { gap:18px; }
    .card.toolbox-mode .support-item { padding:18px 20px; }
    .card.toolbox-mode .support-copy { font-size:17px; }
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
          <button class="tab-btn" data-tab="seo-search">🔍 SEO Busca</button>
          <button class="tab-btn" data-tab="retention">⏱ Retenção</button>
          <button class="tab-btn" data-tab="authority">🎯 Autoridade</button>
          <button class="tab-btn" data-tab="episodic">📺 Episódico</button>
          <button class="tab-btn" data-tab="deep-dive">🧠 Deep Dive</button>
          <button class="tab-btn" data-tab="toolbox">🛠 Ferramentas</button>
          <button class="tab-btn" data-tab="tweet-style">💬 Tweet Style</button>
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
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
            <span class="field-label" style="margin-bottom:0;display:block;">Preview da Imagem (1080×1080)</span>
            <span id="design-chief-chip" class="mono" style="font-size:10px;letter-spacing:.18em;color:#00F2FF;text-transform:uppercase;padding:7px 10px;border:1px solid rgba(0,242,255,.25);border-radius:999px;background:rgba(0,242,255,.05);">Design Chief · ERIZON Core</span>
          </div>
          <div id="card-wrapper" style="box-shadow:0 0 60px rgba(188,19,254,.12);">
            <div id="capture-area" class="card">
              <div class="grid-bg"></div>
              <div class="light-t"></div><div class="light-b"></div>
              <div class="orb orb-center"></div><div class="orb orb-glow"></div>
              <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
              <div id="card-geo-tl" class="geo-tl" style="display:none"></div>
              <div id="card-geo-br" class="geo-br" style="display:none"></div>
              <div id="card-geo-tr" class="geo-tr" style="display:none"></div>
              <div id="card-slash" class="slash-lines" style="display:none"></div>
              <div id="card-chart" class="chart-sil" style="display:none"></div>
              <div id="card-hrule-t" class="hrule-t" style="display:none"></div>
              <div id="card-hrule-b" class="hrule-b" style="display:none"></div>
              <div id="card-ghost" class="ghost-num" style="display:none"></div>
              <div id="card-v-accent" class="v-accent" style="display:none"></div>
              <div id="card-dot" class="dot-field" style="display:none"></div>
              <div id="card-tweet-bar-t" class="tweet-bar" style="top:0;display:none"></div>
              <div id="card-tweet-bar-b" class="tweet-bar" style="bottom:0;display:none"></div>
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

      <div style="margin-top:14px;background:rgba(255,255,255,.03);border:0.5px solid rgba(0,242,255,.18);border-radius:12px;padding:14px;">
        <span class="field-label" style="margin-bottom:10px;display:block;">AutomaÃ§Ã£o / Agendamento</span>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;">
          <div class="mono" id="automation-state-label" style="font-size:11px;letter-spacing:.12em;color:#10b981;text-transform:uppercase;">AutomaÃ§Ã£o ativa</div>
          <button id="btn-automation-toggle" class="btn-nav" style="min-width:148px;">Desativar automaÃ§Ã£o</button>
        </div>
        <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end;">
          <div>
            <label class="mono" style="font-size:10px;letter-spacing:.14em;color:rgba(255,255,255,.45);text-transform:uppercase;display:block;margin-bottom:8px;">Publicar em</label>
            <input id="schedule-datetime" type="datetime-local" class="field">
          </div>
          <button id="btn-schedule" class="btn-nav" style="height:48px;">Agendar Post</button>
        </div>
        <div id="schedule-feedback" class="mono hidden" style="margin-top:10px;font-size:11px;letter-spacing:.08em;color:#00F2FF;"></div>
        <div id="schedule-list" style="margin-top:12px;display:flex;flex-direction:column;gap:8px;"></div>
      </div>

      <!-- Status -->
      <div id="status-message" class="hidden mt-5" style="border-radius:10px;padding:16px;font-size:13px;line-height:1.9;"></div>

    </div>
  </div>

  <div class="max-w-7xl mx-auto mt-8">
    <div class="panel">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:18px;">
        <div>
          <div class="mono" style="font-size:10px;letter-spacing:.18em;color:#00F2FF;text-transform:uppercase;margin-bottom:8px;">Squads Integrados</div>
          <h2 style="font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:800;color:#fff;">Converse com cada squad</h2>
          <p style="font-size:13px;color:rgba(255,255,255,.58);margin-top:6px;max-width:760px;">Cada squad tem chat próprio, contexto próprio e pode devolver respostas, documentos e briefs visuais dentro do projeto.</p>
        </div>
        <div class="mono" id="squad-count" style="font-size:11px;letter-spacing:.14em;color:#BC13FE;text-transform:uppercase;">Carregando squads...</div>
      </div>
      <div class="chat-shell">
        <div class="squad-list" id="squad-list"></div>
        <div class="chat-panel">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;margin-bottom:14px;">
            <div>
              <div class="mono" id="active-squad-chip" style="font-size:10px;letter-spacing:.16em;color:#00F2FF;text-transform:uppercase;">Sem squad</div>
              <div id="active-squad-title" style="font-size:22px;font-weight:800;color:#fff;margin-top:6px;">Selecione um squad</div>
              <div id="active-squad-desc" style="font-size:13px;color:rgba(255,255,255,.56);margin-top:6px;max-width:760px;">Os squads importados vão aparecer aqui.</div>
            </div>
            <div class="mono" id="active-squad-meta" style="font-size:11px;letter-spacing:.1em;color:rgba(255,255,255,.38);text-transform:uppercase;"></div>
          </div>
          <div class="chat-log" id="squad-chat-log">
            <div class="chat-bubble assistant">Selecione um squad para começar a conversa.</div>
          </div>
          <div id="squad-artifact" class="artifact-box hidden">
            <div class="mono" id="squad-artifact-title" style="font-size:10px;letter-spacing:.16em;color:#00F2FF;text-transform:uppercase;margin-bottom:10px;"></div>
            <pre id="squad-artifact-content" class="artifact-pre"></pre>
            <div class="chat-actions">
              <button id="btn-download-artifact" class="btn-nav">Baixar artefato</button>
            </div>
          </div>
          <div class="chat-actions">
            <textarea id="squad-chat-input" rows="4" class="field" placeholder="Peça estratégia, documento, diagnóstico, narrativa, criativo ou uma direção visual para esse squad."></textarea>
            <button id="btn-send-squad" class="btn-primary" style="max-width:220px;">Enviar ao squad</button>
          </div>
        </div>
      </div>
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
      layout: 'left-v',
      gradClass: 'grad',
      recipeLabel: 'ERIZON Core',
      bgVariant: 'data-stream',
      showGrid: true,
      showCorners: false,
      showOrbs: false,
      showRings: false
    };
    let squadCatalog = [];
    let activeSquadId = '';
    let squadChatHistories = {};
    let latestSquadArtifact = null;
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
        tab: currentEditorialTab,
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
    const pubInstagram  = document.getElementById('pub-instagram');
    const pubStory      = document.getElementById('pub-story');
    const pubLinkedin   = document.getElementById('pub-linkedin');
    const designChiefChip = document.getElementById('design-chief-chip');
    const btnSchedule   = document.getElementById('btn-schedule');
    const scheduleInput = document.getElementById('schedule-datetime');
    const scheduleFeedback = document.getElementById('schedule-feedback');
    const scheduleList = document.getElementById('schedule-list');
    const btnAutomationToggle = document.getElementById('btn-automation-toggle');
    const automationStateLabel = document.getElementById('automation-state-label');
    const squadList = document.getElementById('squad-list');
    const squadCount = document.getElementById('squad-count');
    const activeSquadChip = document.getElementById('active-squad-chip');
    const activeSquadTitle = document.getElementById('active-squad-title');
    const activeSquadDesc = document.getElementById('active-squad-desc');
    const activeSquadMeta = document.getElementById('active-squad-meta');
    const squadChatLog = document.getElementById('squad-chat-log');
    const squadChatInput = document.getElementById('squad-chat-input');
    const btnSendSquad = document.getElementById('btn-send-squad');
    const squadArtifact = document.getElementById('squad-artifact');
    const squadArtifactTitle = document.getElementById('squad-artifact-title');
    const squadArtifactContent = document.getElementById('squad-artifact-content');
    const btnDownloadArtifact = document.getElementById('btn-download-artifact');

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

    function setSinglePublishTarget(target) {
      pubInstagram.checked = target === 'instagram';
      pubStory.checked = target === 'instagram-story';
      pubLinkedin.checked = target === 'linkedin';
    }

    function updatePlatformToggles() {
      const carouselNote = document.getElementById('li-carousel-note');
      carouselNote.classList.toggle('hidden', currentPostType !== 'instagram-carousel');

      if (currentPostType === 'linkedin') {
        setSinglePublishTarget('linkedin');
      } else if (currentPostType === 'instagram-story') {
        setSinglePublishTarget('instagram-story');
      } else {
        setSinglePublishTarget('instagram');
      }
    }

    [pubInstagram, pubStory, pubLinkedin].forEach(input => {
      input.addEventListener('change', e => {
        if (!e.target.checked) {
          updatePlatformToggles();
          return;
        }

        if (e.target === pubInstagram) setSinglePublishTarget('instagram');
        if (e.target === pubStory) setSinglePublishTarget('instagram-story');
        if (e.target === pubLinkedin) setSinglePublishTarget('linkedin');
      });
    });

    function getSelectedPlatforms() {
      const platforms = [];
      if (pubInstagram.checked) platforms.push('instagram');
      if (pubStory.checked) platforms.push('instagram-story');
      if (pubLinkedin.checked) platforms.push('linkedin');
      return platforms;
    }

    function setScheduleFeedback(message, tone) {
      scheduleFeedback.classList.remove('hidden');
      scheduleFeedback.style.color = tone === 'error' ? '#ef4444' : tone === 'success' ? '#10b981' : '#00F2FF';
      scheduleFeedback.textContent = message;
    }

    function applyAutomationState(settings) {
      const enabled = settings && settings.enabled !== false;
      automationStateLabel.textContent = enabled ? 'AutomaÃ§Ã£o ativa' : 'AutomaÃ§Ã£o pausada';
      automationStateLabel.style.color = enabled ? '#10b981' : '#f59e0b';
      btnAutomationToggle.textContent = enabled ? 'Desativar automaÃ§Ã£o' : 'Ativar automaÃ§Ã£o';
      btnAutomationToggle.style.color = enabled ? '#f59e0b' : '#10b981';
      btnAutomationToggle.style.borderColor = enabled ? 'rgba(245,158,11,.35)' : 'rgba(16,185,129,.35)';
      btnAutomationToggle.style.background = enabled ? 'rgba(245,158,11,.08)' : 'rgba(16,185,129,.08)';
    }

    function renderScheduleList(items) {
      if (!scheduleList) return;
      if (!items.length) {
        scheduleList.innerHTML = '<div class="mono" style="font-size:11px;letter-spacing:.08em;color:rgba(255,255,255,.4);">Nenhum post agendado ainda.</div>';
        return;
      }

      scheduleList.innerHTML = items.map(item => {
        const when = new Date(item.scheduledAt).toLocaleString('pt-BR');
        const statusColor = item.status === 'published' ? '#10b981' : item.status === 'failed' ? '#ef4444' : '#BC13FE';
        const platforms = (item.platforms || []).join(' + ');
        return '<div style="background:rgba(255,255,255,.025);border:0.5px solid rgba(188,19,254,.18);border-radius:10px;padding:10px 12px;">'
          + '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">'
          + '<div>'
          + '<div class="mono" style="font-size:10px;letter-spacing:.14em;color:' + statusColor + ';text-transform:uppercase;">' + item.status + '</div>'
          + '<div style="font-size:13px;color:#fff;margin-top:4px;">' + (item.caption || '').slice(0, 88) + '</div>'
          + '<div style="font-size:11px;color:rgba(255,255,255,.45);margin-top:6px;">' + when + ' · ' + platforms + ' · ' + item.postType + '</div>'
          + '</div>'
          + (item.status === 'scheduled'
            ? '<button data-schedule-cancel="' + item.id + '" class="btn-nav" style="padding:6px 10px;font-size:11px;">Cancelar</button>'
            : '')
          + '</div>'
          + (item.results && item.results.length
            ? '<div style="font-size:11px;color:rgba(255,255,255,.55);margin-top:8px;">' + item.results.join(' | ') + '</div>'
            : '')
          + '</div>';
      }).join('');
    }

    async function loadScheduledPosts() {
      try {
        const data = await fetchJson('/api/schedule');
        applyAutomationState(data.settings || { enabled: true });
        renderScheduleList(data.items || []);
      } catch (e) {
        applyAutomationState({ enabled: true });
        renderScheduleList([]);
      }
    }

    function getActiveSquad() {
      return squadCatalog.find(squad => squad.id === activeSquadId) || null;
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function renderSquadArtifact(artifact) {
      latestSquadArtifact = artifact || null;
      if (!artifact || artifact.type === 'none' || !artifact.content) {
        squadArtifact.classList.add('hidden');
        squadArtifactTitle.textContent = '';
        squadArtifactContent.textContent = '';
        return;
      }

      squadArtifact.classList.remove('hidden');
      squadArtifactTitle.textContent = (artifact.type === 'document' ? 'Documento' : 'Image Brief') + (artifact.title ? ' · ' + artifact.title : '');
      squadArtifactContent.textContent = artifact.content || '';
    }

    function renderSquadChat() {
      const squad = getActiveSquad();
      const history = squadChatHistories[activeSquadId] || [];

      if (!squad) {
        squadChatLog.innerHTML = '<div class="chat-bubble assistant">Selecione um squad para começar a conversa.</div>';
        renderSquadArtifact(null);
        return;
      }

      activeSquadChip.textContent = '/' + squad.id;
      activeSquadTitle.textContent = squad.shortTitle || squad.name;
      activeSquadDesc.textContent = squad.description || 'Sem descrição.';
      activeSquadMeta.textContent = (squad.agents || []).length + ' agentes · ' + (squad.tasks || []).length + ' tarefas · ' + (squad.workflows || []).length + ' workflows';

      if (!history.length) {
        squadChatLog.innerHTML = '<div class="chat-bubble assistant">Chat pronto. Peça estratégia, diagnóstico, documento, roteiro, naming, criativo ou direção visual para este squad.</div>';
      } else {
        squadChatLog.innerHTML = history.map(turn =>
          '<div class="chat-bubble ' + turn.role + '">' + escapeHtml(turn.content) + '</div>'
        ).join('');
      }
      squadChatLog.scrollTop = squadChatLog.scrollHeight;
    }

    function renderSquadList() {
      if (!squadCatalog.length) {
        squadCount.textContent = 'Nenhum squad encontrado';
        squadList.innerHTML = '<div class="chat-bubble assistant">Nenhum squad carregado.</div>';
        return;
      }

      squadCount.textContent = squadCatalog.length + ' squads conectados';
      squadList.innerHTML = squadCatalog.map(squad =>
        '<button class="squad-item ' + (squad.id === activeSquadId ? 'active' : '') + '" data-squad-id="' + squad.id + '">'
        + '<div class="squad-item-title">' + escapeHtml(squad.shortTitle || squad.name) + '</div>'
        + '<div class="squad-item-copy">' + escapeHtml((squad.description || '').slice(0, 160)) + '</div>'
        + '</button>'
      ).join('');
    }

    async function loadSquads() {
      const data = await fetchJson('/api/squads');
      squadCatalog = data.items || [];
      activeSquadId = activeSquadId || squadCatalog[0]?.id || '';
      renderSquadList();
      renderSquadChat();
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
    function hideGeoExtras() {
      ['card-geo-tl','card-geo-br','card-geo-tr','card-slash','card-chart',
       'card-hrule-t','card-hrule-b','card-ghost','card-v-accent','card-dot',
       'card-tweet-bar-t','card-tweet-bar-b'
      ].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
      const card = document.getElementById('capture-area');
      card.classList.remove('tweet-mode','toolbox-mode');
    }

    function updateDesignChiefChip(state) {
      if (!designChiefChip) return;
      designChiefChip.textContent = 'Design Chief · ' + ((state && state.recipeLabel) || 'ERIZON Core');
    }

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

      hideGeoExtras();

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

      // ── geo helpers ──────────────────────────────────────────
      function showGeoTL(bg) { const el = document.getElementById('card-geo-tl'); el.style.display='block'; el.style.background=bg; }
      function showGeoBR(bg) { const el = document.getElementById('card-geo-br'); el.style.display='block'; el.style.background=bg; }
      function showGeoTR(bg) { const el = document.getElementById('card-geo-tr'); el.style.display='block'; el.style.background=bg; }
      function showSlash(bg) { const el = document.getElementById('card-slash'); el.style.display='block'; el.style.background=bg; }
      function showChart(ht, bg, cp) { const el = document.getElementById('card-chart'); el.style.display='block'; el.style.height=ht; el.style.background=bg; if(cp) el.style.clipPath=cp; }
      function showHrules(top, bot, col) { const ht=document.getElementById('card-hrule-t'); const hb=document.getElementById('card-hrule-b'); ht.style.display='block'; ht.style.top=top; ht.style.background=col; hb.style.display='block'; hb.style.bottom=bot; hb.style.background=col; }
      function showGhost(txt, sz, col, pos) { const el=document.getElementById('card-ghost'); el.style.display='block'; el.textContent=txt; el.style.fontSize=sz; el.style.color=col; Object.assign(el.style,pos); }
      function showVAccent(left, bg) { const el=document.getElementById('card-v-accent'); el.style.display='block'; el.style.left=left; el.style.background=bg; }
      function showTweetBars(bg) { const t=document.getElementById('card-tweet-bar-t'); const b=document.getElementById('card-tweet-bar-b'); t.style.display='block'; b.style.display='block'; t.style.background=bg; b.style.background=bg; }
      function showDotField(bg) { const el=document.getElementById('card-dot'); el.style.display='block'; el.style.background=bg; el.style.backgroundSize='28px 28px'; }
      // ────────────────────────────────────────────────────────

      // tweet-style mode
      if (state.tweetMode) {
        document.getElementById('capture-area').classList.add('tweet-mode');
        lightT.style.background = 'radial-gradient(ellipse at 50% 0%,' + p.t + '.30) 0%,transparent 60%)';
        lightB.style.background = 'radial-gradient(ellipse at 50% 100%,' + p.b + '.18) 0%,transparent 55%)';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
        showTweetBars('linear-gradient(90deg,' + p.t + '.8),' + p.b + '.8),' + p.t + '.8))');
        showHrules('100px','100px','linear-gradient(90deg,transparent,' + p.t + '.4) 30%,' + p.b + '.3) 70%,transparent)');
        showGhost('ERIZON','260px','rgba(188,19,254,.03)',{bottom:'-20px',left:'30px'});
      } else if (state.bgVariant === 'geo-triangle') {
        showGeoTL('linear-gradient(135deg,' + p.t + '.14),transparent)');
        showGeoBR('linear-gradient(315deg,' + p.b + '.12),transparent)');
        showVAccent('56px','linear-gradient(to bottom,transparent,' + p.t + '.5),' + p.b + '.5),transparent)');
        lightT.style.background = 'linear-gradient(135deg,' + p.t + '.20) 0%,transparent 50%)';
        lightB.style.background = 'linear-gradient(315deg,' + p.b + '.15) 0%,transparent 50%)';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
      } else if (state.bgVariant === 'geo-full-corner') {
        showGeoTL('linear-gradient(135deg,' + p.t + '.18),transparent)');
        showGeoBR('linear-gradient(315deg,' + p.b + '.14),transparent)');
        showGeoTR('linear-gradient(45deg,' + p.t + '.10),transparent)');
        lightT.style.background = 'none'; lightB.style.background = 'none';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
        showHrules('88px','88px','linear-gradient(90deg,transparent,' + p.t + '.35) 25%,' + p.b + '.25) 75%,transparent)');
      } else if (state.bgVariant === 'chart-base') {
        showChart('220px',
          'linear-gradient(to top,' + p.t + '.12),transparent)',
          'polygon(0 100%,0 55%,80px 38%,160px 62%,240px 30%,320px 52%,400px 22%,480px 44%,560px 18%,640px 38%,720px 50%,800px 28%,880px 48%,960px 32%,1080px 42%,1080px 100%)'
        );
        lightT.style.background = 'radial-gradient(ellipse at 50% 0%,' + p.t + '.22) 0%,transparent 54%)';
        lightB.style.background = 'none';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
        showHrules('96px','190px','linear-gradient(90deg,transparent,' + p.t + '.3) 20%,' + p.b + '.2) 80%,transparent)');
        showGhost('DATA','380px','rgba(188,19,254,.025)',{right:'-20px',top:'50%',transform:'translateY(-50%)'});
      } else if (state.bgVariant === 'slash-field') {
        showSlash('repeating-linear-gradient(62deg,transparent 0px,transparent 58px,' + p.t + '.05) 58px,' + p.t + '.05) 60px)');
        lightT.style.background = 'linear-gradient(120deg,' + p.t + '.25) 0%,transparent 48%)';
        lightB.style.background = 'linear-gradient(300deg,' + p.b + '.18) 0%,transparent 52%)';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
        showVAccent('56px','linear-gradient(to bottom,transparent,' + p.t + '.6),' + p.b + '.5),transparent)');
      } else if (state.bgVariant === 'dot-matrix') {
        showDotField('radial-gradient(' + p.t + '.12) 1px,transparent 1px)');
        lightT.style.background = 'radial-gradient(ellipse at 30% 30%,' + p.t + '.22) 0%,transparent 52%)';
        lightB.style.background = 'radial-gradient(ellipse at 70% 70%,' + p.b + '.15) 0%,transparent 50%)';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
        showHrules('90px','90px','linear-gradient(90deg,transparent,' + p.t + '.25) 20%,' + p.b + '.2) 80%,transparent)');
      } else if (state.bgVariant === 'split-block') {
        lightT.style.background = 'linear-gradient(90deg,' + p.t + '.18) 0%,' + p.t + '.06) 48%,transparent 50%)';
        lightB.style.background = 'linear-gradient(90deg,transparent 50%,' + p.b + '.08) 52%,' + p.b + '.15) 100%)';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
        showVAccent('50%','linear-gradient(to bottom,' + p.t + '.0),' + p.t + '.45),' + p.b + '.45),' + p.t + '.0))');
        document.getElementById('card-v-accent').style.transform = 'translateX(-50%)';
      } else if (state.bgVariant === 'ghost-type') {
        lightT.style.background = 'radial-gradient(ellipse at 50% 20%,' + p.t + '.20) 0%,transparent 58%)';
        lightB.style.background = 'radial-gradient(ellipse at 50% 80%,' + p.b + '.12) 0%,transparent 52%)';
        orbCenter.style.display = 'none'; orbGlow.style.display = 'none';
        rings.forEach(r => r.style.display = 'none');
        showGhost('IA','680px','rgba(188,19,254,.04)',{bottom:'-60px',right:'-40px',lineHeight:'1'});
        showHrules('110px','110px','linear-gradient(90deg,transparent,' + p.t + '.3) 15%,' + p.b + '.2) 85%,transparent)');
      } else if (state.bgVariant === 'orbital') {
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
      updateDesignChiefChip(state);
    }

    function randomizeVisuals(h1Text) {
      const paletteFamilies = {
        core: [
          { t:'rgba(188,19,254,', b:'rgba(255,0,229,', o:'rgba(188,19,254,' },
          { t:'rgba(0,242,255,',  b:'rgba(188,19,254,', o:'rgba(0,242,255,' },
          { t:'rgba(132,94,247,', b:'rgba(255,0,229,', o:'rgba(132,94,247,' }
        ],
        authority: [
          { t:'rgba(0,242,255,',  b:'rgba(0,140,255,', o:'rgba(0,242,255,' },
          { t:'rgba(54,209,220,', b:'rgba(91,134,229,', o:'rgba(0,242,255,' },
          { t:'rgba(0,255,163,',  b:'rgba(0,242,255,', o:'rgba(0,255,163,' }
        ],
        proof: [
          { t:'rgba(255,180,0,',  b:'rgba(255,100,0,', o:'rgba(255,150,0,' },
          { t:'rgba(255,0,100,',  b:'rgba(255,68,136,', o:'rgba(255,0,100,' },
          { t:'rgba(188,19,254,', b:'rgba(255,112,67,', o:'rgba(255,112,67,' }
        ],
        signal: [
          { t:'rgba(0,242,255,',  b:'rgba(188,19,254,', o:'rgba(255,255,255,' },
          { t:'rgba(255,0,229,',  b:'rgba(188,19,254,', o:'rgba(0,242,255,' },
          { t:'rgba(0,200,255,',  b:'rgba(0,120,255,', o:'rgba(0,160,255,' }
        ]
      };
      const grads = ['grad','grad2','grad3'];

      const designChiefProfiles = {
        'tweet-style': {
          recipeLabel: 'Signal Manifesto',
          palettes: paletteFamilies.signal,
          scenes: [
            { bgVariant: 'tweet', layout: 'center', tweetMode: true, showGrid: false, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'tweet', layout: 'center', tweetMode: true, showGrid: false, showCorners: true, showOrbs: false, showRings: false }
          ]
        },
        'toolbox': {
          recipeLabel: 'Ops Cheat Sheet',
          palettes: paletteFamilies.authority,
          scenes: [
            { bgVariant: 'dot-matrix', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'chart-base', layout: 'center', showGrid: true, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'signal-columns', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'frame-shift', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: true }
          ]
        },
        'deep-dive': {
          recipeLabel: 'Analyst Board',
          palettes: paletteFamilies.authority,
          scenes: [
            { bgVariant: 'chart-base', layout: 'left-v', showGrid: true, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'geo-triangle', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'ghost-type', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'neon-wedge', layout: 'left-h', showGrid: false, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'signal-columns', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false }
          ]
        },
        'social-proof': {
          recipeLabel: 'Proof Frame',
          palettes: paletteFamilies.proof,
          scenes: [
            { bgVariant: 'split-block', layout: 'left-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'geo-full-corner', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'corner-burst', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'frame-shift', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: true }
          ]
        },
        'uploads': {
          recipeLabel: 'Feedback Evidence',
          palettes: paletteFamilies.proof,
          scenes: [
            { bgVariant: 'frame-shift', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: true },
            { bgVariant: 'geo-full-corner', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'split-block', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false }
          ]
        },
        'market': {
          recipeLabel: 'Market Pulse',
          palettes: paletteFamilies.signal,
          scenes: [
            { bgVariant: 'data-stream', layout: 'left-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'signal-columns', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'horizon', layout: 'center', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'bands', layout: 'left-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false }
          ]
        },
        'diagnostics': {
          recipeLabel: 'Forensic Signal',
          palettes: paletteFamilies.signal,
          scenes: [
            { bgVariant: 'crosslight', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'slash-field', layout: 'left-h', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'ghost-type', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'chart-base', layout: 'center', showGrid: true, showCorners: true, showOrbs: false, showRings: false }
          ]
        },
        'anti-myth': {
          recipeLabel: 'Contrarian Strike',
          palettes: paletteFamilies.proof,
          scenes: [
            { bgVariant: 'neon-wedge', layout: 'left-h', showGrid: false, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'split', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'diagonal', layout: 'left-h', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'corner-burst', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false }
          ]
        },
        'stories': {
          recipeLabel: 'Interactive Pulse',
          palettes: paletteFamilies.core,
          scenes: [
            { bgVariant: 'horizon', layout: 'center', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'data-stream', layout: 'right-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'signal-columns', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'frame-shift', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: true }
          ]
        },
        'series': {
          recipeLabel: 'Narrative Engine',
          palettes: paletteFamilies.core,
          scenes: [
            { bgVariant: 'frame-shift', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: true },
            { bgVariant: 'signal-columns', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'horizon', layout: 'center', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'geo-triangle', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false }
          ]
        },
        'episodic': {
          recipeLabel: 'Narrative Engine',
          palettes: paletteFamilies.core,
          scenes: [
            { bgVariant: 'frame-shift', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: true },
            { bgVariant: 'signal-columns', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'horizon', layout: 'center', showGrid: true, showCorners: false, showOrbs: false, showRings: false }
          ]
        },
        'specialists': {
          recipeLabel: 'Operator Console',
          palettes: paletteFamilies.authority,
          scenes: [
            { bgVariant: 'chart-base', layout: 'left-v', showGrid: true, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'data-stream', layout: 'left-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
            { bgVariant: 'signal-columns', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'dot-matrix', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false }
          ]
        },
        'authority': {
          recipeLabel: 'Operator Console',
          palettes: paletteFamilies.authority,
          scenes: [
            { bgVariant: 'chart-base', layout: 'center', showGrid: true, showCorners: true, showOrbs: false, showRings: false },
            { bgVariant: 'frame-shift', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: true },
            { bgVariant: 'signal-columns', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false }
          ]
        }
      };

      const fallbackProfile = {
        recipeLabel: 'ERIZON Core',
        palettes: paletteFamilies.core,
        scenes: [
          { bgVariant: 'data-stream', layout: 'left-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
          { bgVariant: 'signal-columns', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
          { bgVariant: 'neon-wedge', layout: 'left-h', showGrid: false, showCorners: false, showOrbs: false, showRings: false },
          { bgVariant: 'horizon', layout: 'center', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
          { bgVariant: 'frame-shift', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: true },
          { bgVariant: 'bands', layout: 'left-v', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
          { bgVariant: 'crosslight', layout: 'right-h', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
          { bgVariant: 'diagonal', layout: 'left-h', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
          { bgVariant: 'split', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
          { bgVariant: 'geo-triangle', layout: 'left-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
          { bgVariant: 'geo-full-corner', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
          { bgVariant: 'slash-field', layout: 'left-h', showGrid: true, showCorners: false, showOrbs: false, showRings: false },
          { bgVariant: 'dot-matrix', layout: 'right-v', showGrid: false, showCorners: true, showOrbs: false, showRings: false },
          { bgVariant: 'ghost-type', layout: 'center', showGrid: false, showCorners: true, showOrbs: false, showRings: false }
        ]
      };

      const profile = designChiefProfiles[currentEditorialTab] || fallbackProfile;
      const scene = profile.scenes[Math.floor(Math.random() * profile.scenes.length)];
      const palette = profile.palettes[Math.floor(Math.random() * profile.palettes.length)];
      currentVisualState = {
        palette,
        layout: scene.layout || 'center',
        gradClass: grads[Math.floor(Math.random() * grads.length)],
        recipeLabel: profile.recipeLabel,
        bgVariant: scene.bgVariant,
        tweetMode: scene.tweetMode || false,
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

    async function renderInstagramFeedCanvas() {
      const baseCard = await renderCard();
      const img = new Image();
      await new Promise(res => { img.onload = res; img.src = baseCard; });

      const W = 1080, H = 1350;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0B0112';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(188,19,254,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const topGlow = ctx.createRadialGradient(W / 2, 80, 0, W / 2, 80, 460);
      topGlow.addColorStop(0, 'rgba(188,19,254,0.18)');
      topGlow.addColorStop(1, 'rgba(11,1,18,0)');
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, W, 520);

      const bottomGlow = ctx.createRadialGradient(W / 2, H - 80, 0, W / 2, H - 80, 460);
      bottomGlow.addColorStop(0, 'rgba(255,0,229,0.12)');
      bottomGlow.addColorStop(1, 'rgba(11,1,18,0)');
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, H - 520, W, 520);

      const cardWidth = 920;
      const cardHeight = 920;
      const cardX = (W - cardWidth) / 2;
      const cardY = (H - cardHeight) / 2;
      ctx.drawImage(img, cardX, cardY, cardWidth, cardHeight);

      const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
      lineGrad.addColorStop(0, 'transparent');
      lineGrad.addColorStop(0.5, '#BC13FE');
      lineGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(88, cardY - 28); ctx.lineTo(W - 88, cardY - 28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(88, cardY + cardHeight + 28); ctx.lineTo(W - 88, cardY + cardHeight + 28); ctx.stroke();

      return canvas.toDataURL('image/jpeg', 0.92);
    }

    async function renderStoryCanvas() {
      const baseCard = await renderCard();
      const img = new Image();
      await new Promise(res => { img.onload = res; img.src = baseCard; });

      const W = 1080, H = 1920;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0B0112';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(188,19,254,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      const topGlow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 520);
      topGlow.addColorStop(0, 'rgba(188,19,254,0.22)');
      topGlow.addColorStop(1, 'rgba(11,1,18,0)');
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, W, 620);

      const bottomGlow = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, 520);
      bottomGlow.addColorStop(0, 'rgba(255,0,229,0.16)');
      bottomGlow.addColorStop(1, 'rgba(11,1,18,0)');
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, H - 620, W, 620);

      const cardSize = 920;
      const cardX = (W - cardSize) / 2;
      const cardY = (H - cardSize) / 2;
      ctx.drawImage(img, cardX, cardY, cardSize, cardSize);

      const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
      lineGrad.addColorStop(0, 'transparent');
      lineGrad.addColorStop(0.5, '#BC13FE');
      lineGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(72, cardY - 28); ctx.lineTo(W - 72, cardY - 28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(72, cardY + cardSize + 28); ctx.lineTo(W - 72, cardY + cardSize + 28); ctx.stroke();

      if (processedLogoUrl) {
        const logoImg = new Image();
        await new Promise(res => { logoImg.onload = res; logoImg.src = processedLogoUrl; });
        const logoH = 64;
        const logoW = 256;
        ctx.drawImage(logoImg, (W - logoW) / 2, H - 92 - logoH, logoW, logoH);
      }

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
    async function buildPublicationPayload() {
      const platforms = getSelectedPlatforms();
      const caption = postContent.value;

      if (currentPostType === 'instagram-carousel') {
        const images = [];
        for (let i = 0; i < carouselSlides.length; i++) {
          showSlide(i);
          await new Promise(r => setTimeout(r, 50));
          images.push(await renderCard());
        }
        showSlide(0);
        return { platforms, caption, images };
      }

      let imageBase64 = await renderCard();
      if (platforms.includes('instagram')) {
        imageBase64 = await renderInstagramFeedCanvas();
      } else if (platforms.includes('instagram-story')) {
        imageBase64 = await renderStoryCanvas();
      }

      return { platforms, caption, images: [imageBase64] };
    }

    btnPublish.addEventListener('click', async () => {
      btnPublish.disabled = true;
      btnPublish.innerHTML = 'PUBLICANDO...';
      statusMsg.classList.remove('hidden');
      statusMsg.style.background = 'rgba(188,19,254,.1)';
      statusMsg.style.color = '#BC13FE';
      statusMsg.innerHTML = 'Preparando e enviando imagens para as plataformas...';

      try {
        const { platforms, caption, images } = await buildPublicationPayload();
        let results = [];

        if (currentPostType === 'instagram-carousel') {
          const res = await fetchJson('/api/publish-carousel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              images,
              caption,
              platforms
            })
          });
          results = res.results || ['Carrossel publicado.'];

        } else {
          const res = await fetchJson('/api/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: caption,
              imageBase64: images[0],
              platforms
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

    btnSchedule.addEventListener('click', async () => {
      btnSchedule.disabled = true;
      setScheduleFeedback('Preparando post para agendamento...', 'info');

      try {
        if (!scheduleInput.value) throw new Error('Escolha data e hora para o agendamento.');
        if (!postContent.value.trim()) throw new Error('Gere ou edite um conteÃºdo antes de agendar.');

        const { platforms, caption, images } = await buildPublicationPayload();
        if (!platforms.length) throw new Error('Selecione uma plataforma para o agendamento.');

        const res = await fetchJson('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scheduledAt: scheduleInput.value,
            postType: currentPostType,
            editorialTab: currentEditorialTab,
            caption,
            platforms,
            images
          })
        });

        setScheduleFeedback('Agendado com sucesso para ' + new Date(res.item.scheduledAt).toLocaleString('pt-BR') + '.', 'success');
        await loadScheduledPosts();
      } catch (e) {
        setScheduleFeedback(e.message, 'error');
      } finally {
        btnSchedule.disabled = false;
      }
    });

    scheduleList.addEventListener('click', async e => {
      const btn = e.target.closest('[data-schedule-cancel]');
      if (!btn) return;

      try {
        await fetchJson('/api/schedule/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: btn.dataset.scheduleCancel })
        });
        setScheduleFeedback('Agendamento cancelado.', 'success');
        await loadScheduledPosts();
      } catch (error) {
        setScheduleFeedback(error.message, 'error');
      }
    });

    btnAutomationToggle.addEventListener('click', async () => {
      btnAutomationToggle.disabled = true;
      try {
        const enabledNow = btnAutomationToggle.textContent.includes('Desativar');
        const res = await fetchJson('/api/automation-toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !enabledNow })
        });
        applyAutomationState(res.settings);
        setScheduleFeedback(res.settings.enabled ? 'AutomaÃ§Ã£o reativada.' : 'AutomaÃ§Ã£o pausada. A fila foi mantida.', 'success');
      } catch (error) {
        setScheduleFeedback(error.message, 'error');
      } finally {
        btnAutomationToggle.disabled = false;
      }
    });

    squadList.addEventListener('click', e => {
      const btn = e.target.closest('[data-squad-id]');
      if (!btn) return;
      activeSquadId = btn.dataset.squadId;
      renderSquadList();
      renderSquadChat();
    });

    btnSendSquad.addEventListener('click', async () => {
      const squad = getActiveSquad();
      const message = squadChatInput.value.trim();
      if (!squad) {
        alert('Carregue um squad antes de enviar.');
        return;
      }
      if (!message) return;

      btnSendSquad.disabled = true;
      btnSendSquad.textContent = 'Enviando...';

      const history = squadChatHistories[activeSquadId] || [];
      history.push({ role: 'user', content: message });
      squadChatHistories[activeSquadId] = history;
      squadChatInput.value = '';
      renderSquadChat();

      try {
        const res = await fetchJson('/api/squad-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            squadId: activeSquadId,
            message,
            history
          })
        });

        history.push({ role: 'assistant', content: res.reply || 'Sem resposta.' });
        squadChatHistories[activeSquadId] = history;
        renderSquadChat();
        renderSquadArtifact(res.artifact || null);
      } catch (error) {
        history.push({ role: 'assistant', content: 'Erro: ' + error.message });
        squadChatHistories[activeSquadId] = history;
        renderSquadChat();
      } finally {
        btnSendSquad.disabled = false;
        btnSendSquad.textContent = 'Enviar ao squad';
      }
    });

    btnDownloadArtifact.addEventListener('click', () => {
      if (!latestSquadArtifact || !latestSquadArtifact.content) return;
      const extension = latestSquadArtifact.format === 'markdown' ? 'md' : latestSquadArtifact.format === 'json' ? 'json' : 'txt';
      const blob = new Blob([latestSquadArtifact.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (latestSquadArtifact.title || 'artifact').toLowerCase().replace(/[^a-z0-9-_]+/gi, '-') + '.' + extension;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    squadChatInput.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        btnSendSquad.click();
      }
    });

    loadScheduledPosts();
    loadSquads().catch(error => {
      squadCount.textContent = 'Erro ao carregar squads';
      squadChatLog.innerHTML = '<div class="chat-bubble assistant">Erro ao carregar squads: ' + escapeHtml(error.message) + '</div>';
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

  if (req.method === 'GET' && url.pathname === '/api/schedule') {
    try {
      const items = await readScheduledPosts();
      const settings = await readAutomationSettings();
      res.status(200).json({
        items: items.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
        settings
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/squads') {
    try {
      const items = await loadSquadSummaries();
      res.status(200).json({ items });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/run-scheduled') {
    try {
      const cronSecret = process.env.CRON_SECRET || '';
      const authHeader = req.headers.authorization || '';
      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const settings = await readAutomationSettings();
      if (!settings.enabled) {
        res.status(200).json({
          processed: 0,
          skipped: true,
          reason: 'automation_disabled'
        });
        return;
      }

      const result = await runDueScheduledPosts(agent);
      res.status(200).json({
        processed: result.processed,
        items: result.posts
      });
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
        const needsInstagramHost = (platforms || []).includes('instagram') || (platforms || []).includes('instagram-story');
        const imageUrl = await uploadImageToCloudForPlatform(imageBase64, needsInstagramHost ? 'instagram' : 'generic');
        const results = await agent.postToSocialMedia(content, imageUrl, imageBase64, platforms);
        res.status(200).json({ results });
      } else if (url.pathname === '/api/publish-carousel') {
        const { images, caption, platforms } = body;
        const needsInstagramHost = (platforms || []).includes('instagram');
        const imageUrls = await Promise.all(images.map((img: any) => uploadImageToCloudForPlatform(img, needsInstagramHost ? 'instagram' : 'generic')));
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
      } else if (url.pathname === '/api/schedule') {
        const { scheduledAt, postType, editorialTab, caption, platforms, images } = body;
        if (!scheduledAt) throw new Error('scheduledAt Ã© obrigatÃ³rio.');
        if (!Array.isArray(platforms) || !platforms.length) throw new Error('Selecione pelo menos uma plataforma.');
        if (!Array.isArray(images) || !images.length) throw new Error('Nenhuma imagem foi enviada para agendar.');
        const scheduleTime = new Date(scheduledAt);
        if (Number.isNaN(scheduleTime.getTime())) throw new Error('Data/hora invÃ¡lida para agendamento.');

        const item = buildScheduledPost({
          scheduledAt,
          postType,
          editorialTab,
          caption,
          platforms,
          images
        });
        const items = await readScheduledPosts();
        items.push(item);
        await writeScheduledPosts(items);
        res.status(200).json({ item });
      } else if (url.pathname === '/api/schedule/cancel') {
        const { id } = body;
        const items = await readScheduledPosts();
        const nextItems = items.filter(item => item.id !== id);
        if (nextItems.length === items.length) throw new Error('Agendamento nÃ£o encontrado.');
        await writeScheduledPosts(nextItems);
        res.status(200).json({ ok: true });
      } else if (url.pathname === '/api/squad-chat') {
        const { squadId, message, history } = body;
        if (!squadId) throw new Error('squadId Ã© obrigatÃ³rio.');
        if (!message) throw new Error('message Ã© obrigatÃ³rio.');
        const result = await chatWithSquad({ squadId, message, history });
        res.status(200).json(result);
      } else if (url.pathname === '/api/automation-toggle') {
        const settings = {
          enabled: body?.enabled !== false,
          updatedAt: new Date().toISOString()
        };
        await writeAutomationSettings(settings);
        res.status(200).json({ settings });
      } else if (url.pathname === '/api/run-scheduled') {
        const cronSecret = process.env.CRON_SECRET || '';
        const authHeader = req.headers.authorization || '';
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }

        const settings = await readAutomationSettings();
        if (!settings.enabled) {
          res.status(200).json({
            processed: 0,
            skipped: true,
            reason: 'automation_disabled'
          });
          return;
        }

        const result = await runDueScheduledPosts(agent);
        res.status(200).json({
          processed: result.processed,
          items: result.posts
        });
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


const SCHEDULE_STORE_PATH = path.resolve(__dirname, '../data/scheduled-posts.json');
const SCHEDULE_BLOB_PATHNAME = 'erizon-scheduled-posts.json';
const AUTOMATION_SETTINGS_PATH = path.resolve(__dirname, '../data/automation-settings.json');
const AUTOMATION_SETTINGS_BLOB_PATHNAME = 'erizon-automation-settings.json';

function defaultAutomationSettings(): AutomationSettings {
  return {
    enabled: true,
    updatedAt: new Date().toISOString()
  };
}

async function ensureScheduleStore(): Promise<void> {
  await fs.promises.mkdir(path.dirname(SCHEDULE_STORE_PATH), { recursive: true });
  if (!fs.existsSync(SCHEDULE_STORE_PATH)) {
    await fs.promises.writeFile(SCHEDULE_STORE_PATH, '[]', 'utf8');
  }
  if (!fs.existsSync(AUTOMATION_SETTINGS_PATH)) {
    await fs.promises.writeFile(AUTOMATION_SETTINGS_PATH, JSON.stringify(defaultAutomationSettings(), null, 2), 'utf8');
  }
}

async function readScheduledPostsFromBlob(token: string): Promise<ScheduledPost[] | null> {
  const listRes = await fetch(`https://blob.vercel-storage.com?prefix=${encodeURIComponent(SCHEDULE_BLOB_PATHNAME)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-version': '7'
    }
  });

  if (!listRes.ok) {
    throw new Error(`Falha ao listar fila no Blob: ${await listRes.text()}`);
  }

  const listData = await listRes.json() as any;
  const blobs = Array.isArray(listData?.blobs) ? listData.blobs : [];
  const matches = blobs.filter((blob: any) => blob.pathname === SCHEDULE_BLOB_PATHNAME);
  if (!matches.length) return null;

  matches.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  const latestUrl = matches[0]?.url;
  if (!latestUrl) return null;

  const fileRes = await fetch(latestUrl, { cache: 'no-store' });
  if (!fileRes.ok) {
    throw new Error(`Falha ao ler fila do Blob: HTTP ${fileRes.status}`);
  }

  const raw = await fileRes.text();
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeScheduledPostsToBlob(items: ScheduledPost[], token: string): Promise<void> {
  const response = await fetch(`https://blob.vercel-storage.com/${SCHEDULE_BLOB_PATHNAME}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-api-version': '7'
    },
    body: JSON.stringify(items, null, 2)
  });

  if (!response.ok) {
    throw new Error(`Falha ao salvar fila no Blob: ${await response.text()}`);
  }
}

async function readJsonBlobByPathname(pathname: string, token: string): Promise<any | null> {
  const listRes = await fetch(`https://blob.vercel-storage.com?prefix=${encodeURIComponent(pathname)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-api-version': '7'
    }
  });

  if (!listRes.ok) {
    throw new Error(`Falha ao listar blob ${pathname}: ${await listRes.text()}`);
  }

  const listData = await listRes.json() as any;
  const blobs = Array.isArray(listData?.blobs) ? listData.blobs : [];
  const matches = blobs.filter((blob: any) => blob.pathname === pathname);
  if (!matches.length) return null;
  matches.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const fileRes = await fetch(matches[0].url, { cache: 'no-store' });
  if (!fileRes.ok) {
    throw new Error(`Falha ao ler blob ${pathname}: HTTP ${fileRes.status}`);
  }

  return JSON.parse(await fileRes.text());
}

async function writeJsonBlob(pathname: string, payload: any, token: string): Promise<void> {
  const response = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-api-version': '7'
    },
    body: JSON.stringify(payload, null, 2)
  });

  if (!response.ok) {
    throw new Error(`Falha ao salvar blob ${pathname}: ${await response.text()}`);
  }
}

async function readScheduledPosts(): Promise<ScheduledPost[]> {
  const blobToken = getBlobToken();
  if (blobToken) {
    const items = await readScheduledPostsFromBlob(blobToken);
    if (items) return items;
  }

  await ensureScheduleStore();
  try {
    const raw = await fs.promises.readFile(SCHEDULE_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeScheduledPosts(items: ScheduledPost[]): Promise<void> {
  const blobToken = getBlobToken();
  if (blobToken) {
    await writeScheduledPostsToBlob(items, blobToken);
    return;
  }

  await ensureScheduleStore();
  await fs.promises.writeFile(SCHEDULE_STORE_PATH, JSON.stringify(items, null, 2), 'utf8');
}

async function readAutomationSettings(): Promise<AutomationSettings> {
  const blobToken = getBlobToken();
  if (blobToken) {
    const settings = await readJsonBlobByPathname(AUTOMATION_SETTINGS_BLOB_PATHNAME, blobToken);
    if (settings && typeof settings.enabled === 'boolean') {
      return settings;
    }
  }

  await ensureScheduleStore();
  try {
    const raw = await fs.promises.readFile(AUTOMATION_SETTINGS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (typeof parsed?.enabled === 'boolean') return parsed;
  } catch {}

  return defaultAutomationSettings();
}

async function writeAutomationSettings(settings: AutomationSettings): Promise<void> {
  const nextSettings = {
    enabled: settings.enabled !== false,
    updatedAt: settings.updatedAt || new Date().toISOString()
  };

  const blobToken = getBlobToken();
  if (blobToken) {
    await writeJsonBlob(AUTOMATION_SETTINGS_BLOB_PATHNAME, nextSettings, blobToken);
    return;
  }

  await ensureScheduleStore();
  await fs.promises.writeFile(AUTOMATION_SETTINGS_PATH, JSON.stringify(nextSettings, null, 2), 'utf8');
}

function buildScheduledPost(input: {
  scheduledAt: string;
  postType: PostType;
  editorialTab: EditorialTab;
  caption: string;
  platforms: string[];
  images: string[];
}): ScheduledPost {
  return {
    id: `sched_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    scheduledAt: new Date(input.scheduledAt).toISOString(),
    postType: input.postType,
    editorialTab: input.editorialTab,
    caption: input.caption,
    platforms: input.platforms,
    images: input.images,
    status: 'scheduled',
  };
}

async function executeScheduledPost(agent: SocialMediaAgent, item: ScheduledPost): Promise<string[]> {
  if (item.postType === 'instagram-carousel') {
    const needsInstagramHost = item.platforms.includes('instagram');
    const imageUrls = await Promise.all(
      item.images.map(img => uploadImageToCloudForPlatform(img, needsInstagramHost ? 'instagram' : 'generic'))
    );
    const results: string[] = [];

    if (item.platforms.includes('instagram')) {
      try {
        await agent.postCarouselToInstagram(imageUrls, item.caption);
        results.push('🎠 Instagram Carrossel: Sucesso');
      } catch (error: any) {
        results.push(`🎠 Instagram Carrossel: Erro (${error.message || 'Erro desconhecido'})`);
      }
    }

    if (item.platforms.includes('linkedin')) {
      try {
        await agent.postToSocialMedia(item.caption, imageUrls[0], item.images[0], ['linkedin']);
        results.push('💼 LinkedIn (1º slide): Sucesso');
      } catch (error: any) {
        results.push(`💼 LinkedIn: Erro (${error.message || 'Erro desconhecido'})`);
      }
    }

    return results;
  }

  const needsInstagramHost = item.platforms.includes('instagram') || item.platforms.includes('instagram-story');
  const imageBase64 = item.images[0];
  const imageUrl = await uploadImageToCloudForPlatform(imageBase64, needsInstagramHost ? 'instagram' : 'generic');
  return agent.postToSocialMedia(item.caption, imageUrl, imageBase64, item.platforms);
}

async function runDueScheduledPosts(agent: SocialMediaAgent): Promise<{ processed: number; posts: ScheduledPost[] }> {
  const items = await readScheduledPosts();
  const now = Date.now();
  let processed = 0;

  for (const item of items) {
    if (item.status !== 'scheduled') continue;
    if (new Date(item.scheduledAt).getTime() > now) continue;

    processed += 1;
    try {
      const results = await executeScheduledPost(agent, item);
      item.status = results.some(result => result.includes('Erro')) ? 'failed' : 'published';
      item.results = results;
      item.publishedAt = new Date().toISOString();
      item.lastError = item.status === 'failed' ? results.filter(result => result.includes('Erro')).join(' | ') : '';
    } catch (error: any) {
      item.status = 'failed';
      item.results = [`Falha na automação: ${error.message || 'Erro desconhecido'}`];
      item.lastError = error.message || 'Erro desconhecido';
      item.publishedAt = new Date().toISOString();
    }
  }

  await writeScheduledPosts(items);
  return { processed, posts: items };
}

function getBlobToken(): string {
  return process.env.BLOB_UPLOAD_TOKEN || process.env.BLOB_READ_WRITE_TOKEN || '';
}

async function uploadImageToCloudForPlatform(base64Data: string, target: 'instagram' | 'generic'): Promise<string> {
  const image = parseImagePayload(base64Data);

  const blobToken = getBlobToken();

  // Instagram: prioriza Vercel Blob, porque o Meta está rejeitando as URLs do ImgBB neste fluxo.
  if (target === 'instagram' && blobToken) {
    const filename = `erizon-post-${Date.now()}.${image.extension}`;
    const buffer = Buffer.from(image.base64, 'base64');

    const response = await fetch(`https://blob.vercel-storage.com/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${blobToken}`,
        'Content-Type': image.mimeType,
        'x-api-version': '7'
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`Falha no Vercel Blob: ${await response.text()}`);
    }

    const data = await response.json() as any;
    const url: string = data?.url || '';
    if (!url || !url.startsWith('http')) {
      throw new Error(`Vercel Blob retornou URL inválida: ${JSON.stringify(data)}`);
    }
    logger.info(`Vercel Blob upload OK: ${url}`);
    return url;
  }

  if (target === 'instagram' && process.env.IMGBB_API_KEY && !blobToken) {
    throw new Error('Instagram: o Meta está rejeitando as URLs do ImgBB neste fluxo. Configure BLOB_READ_WRITE_TOKEN ou BLOB_UPLOAD_TOKEN na Vercel para hospedar a mídia no Vercel Blob.');
  }

  // 1. ImgBB
  if (process.env.IMGBB_API_KEY) {
    const formData = new URLSearchParams();
    formData.append('key', process.env.IMGBB_API_KEY);
    formData.append('image', image.base64);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`ImgBB HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json() as any;

    if (!data.success) {
      throw new Error(`Falha no ImgBB: ${JSON.stringify(data)}`);
    }

    // ImgBB pode retornar a URL direta em diferentes campos dependendo da versão da API
    const rawCandidates = [data?.data?.url, data?.data?.image?.url, data?.data?.medium?.url, data?.data?.thumb?.url].filter(Boolean) as string[];
    const url = rawCandidates.find(candidate => candidate.startsWith('https://i.ibb.co/')) || '';
    if (!url || !url.startsWith('http')) {
      throw new Error(`ImgBB retornou URL inválida. Resposta: ${JSON.stringify(data?.data)}`);
    }
    const probe = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'facebookexternalhit/1.1' }
    });
    if (!probe.ok) {
      throw new Error(`ImgBB gerou URL inacessÃ­vel (HTTP ${probe.status}): ${url}`);
    }
    const contentType = (probe.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('image/')) {
      throw new Error(`ImgBB gerou URL sem content-type de imagem (${contentType || 'vazio'}): ${url}`);
    }
    logger.info(`ImgBB upload OK: ${url} (${contentType})`);
    return url;
  }

  // 2. Vercel Blob
  if (blobToken) {
    const filename = `erizon-post-${Date.now()}.${image.extension}`;
    const buffer = Buffer.from(image.base64, 'base64');

    const response = await fetch(`https://blob.vercel-storage.com/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${blobToken}`,
        'Content-Type': image.mimeType,
        'x-api-version': '7'
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`Falha no Vercel Blob: ${await response.text()}`);
    }

    const data = await response.json() as any;
    const url: string = data?.url || '';
    if (!url || !url.startsWith('http')) {
      throw new Error(`Vercel Blob retornou URL inválida: ${JSON.stringify(data)}`);
    }
    return url;
  }

  // 3. Fallback (LinkedIn aceita base64, Instagram não)
  logger.warn('Nenhum serviço de hospedagem configurado (IMGBB_API_KEY ou BLOB_UPLOAD_TOKEN). Retornando Base64.');
  return base64Data;
}
