import dotenv from 'dotenv';
import path from 'path';
import winston from 'winston';
import Groq from 'groq-sdk';

// Carrega .env e depois .env.local (local sobrescreve)
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });
console.log('[DEBUG] Env carregado. INSTAGRAM_ACCOUNT_ID:', process.env.INSTAGRAM_ACCOUNT_ID ? 'OK' : 'FALTANDO');

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
}

interface CarouselContent {
  slides: Array<{ eyebrow: string; h1: string; sub: string }>;
  caption: string;
}

// ============================================================
// AGENT CLASS
// ============================================================
class SocialMediaAgent {
  constructor() {
    logger.info('ERIZON Social Media Agent inicializado');
  }

  async generatePost(postType: PostType = 'instagram-feed'): Promise<PostContent> {
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

      const systemPrompt = `Você é o estrategista-chefe de marketing e social media da ERIZON — especialista em criar conteúdo viral que engaja gestores de tráfego, faz o perfil explodir e gera leads qualificados no Brasil.

${ERIZON_BRAND_CONTEXT}

TIPO DE POST: ${platformHints[postType]}

REGRAS ABSOLUTAS DE COPYWRITING VIRAL:
1. H1 deve PARAR O SCROLL: máximo 5 palavras, cria curiosidade OU choca OU faz o leitor concordar instantaneamente
2. Cada post foca em UM único pilar editorial — nunca misture temas
3. Caption: hook → desenvolvimento → dado/prova → CTA (salva / comenta / compartilha)
4. Nunca use linguagem corporativa genérica. Fale como expert que domina tráfego pago
5. Use dados e números específicos quando relevante (aumentam autoridade e credibilidade)
6. H1: MÁXIMO 5 PALAVRAS com <br> na metade e <span class='grad'>palavra-impacto</span> na palavra mais forte

RETORNE OBRIGATORIAMENTE UM JSON VÁLIDO:
{
  "eyebrow": "// Categoria (ex: // Risk Radar | // Decision Feed | // Anti-Vaidade | // Copiloto IA)",
  "h1": "Máx 5 palavras com <br> e <span class='grad'>palavra</span>",
  "sub": "Subtítulo até 15 palavras com <strong> na parte que mais convence",
  "caption": "Caption viral completa com emojis, dados, CTA e hashtags estratégicas."
}`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Gere um conteúdo VIRAL e INÉDITO para a ERIZON. Escolha um pilar editorial inesperado e use uma fórmula de hook surpreendente. Tipo: ${postType}` }
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
        sub: 'ROAS de vaidade destrói margem. <strong>Aprenda a diferença.</strong>',
        caption: '🚨 Seu ROAS está alto, mas sua margem está caindo?\n\nIsso não é coincidência. É a armadilha das métricas de vaidade.\n\nA Erizon calcula o ROAS de break-even real das suas campanhas — e te diz exatamente quando o "sucesso" está te custando dinheiro.\n\nSalve esse post. Você vai precisar. 📌\n\n#GestordeTrafego #MetaAds #Erizon #ROAS #Performance'
      };
    }
  }

  async generateCarousel(): Promise<CarouselContent> {
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
          { role: 'user', content: 'Crie um carrossel VIRAL e inédito para a ERIZON. Escolha um ângulo que ninguém viu. Narrativa progressiva que vicia quem desliza.' }
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

  async postCarouselToInstagram(imageUrls: string[], caption: string): Promise<string> {
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

  private async postToLinkedIn(content: string, imageBase64: string): Promise<void> {
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

    const buffer = Buffer.from(imageBase64, 'base64');
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT', body: buffer,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/octet-stream' }
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

    const pub = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: data.id, access_token: process.env.INSTAGRAM_ACCESS_TOKEN })
    });
    if (!pub.ok) throw new Error(`Instagram Feed Publish ${pub.status}: ${await pub.text()}`);
    logger.info(`Postado no Instagram Feed: ${data.id}`);
  }

  private async postToInstagramStory(imageUrl: string): Promise<void> {
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
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
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
    .logo { position:absolute; bottom:48px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:10px; white-space:nowrap; }
    .logo-dot { width:8px; height:8px; border-radius:50%; background:#BC13FE; box-shadow:0 0 10px rgba(188,19,254,.9); }
    .logo-txt { font-family:'Syne',sans-serif; font-weight:700; font-size:16px; letter-spacing:4px; text-transform:uppercase; }
    .grad  { background:linear-gradient(135deg,#BC13FE,#FF00E5); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .grad2 { background:linear-gradient(135deg,#00F2FF,#BC13FE); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .grad3 { background:linear-gradient(135deg,#FF00E5,#FF4488); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .orb { position:absolute; border-radius:50%; }
    .orb-center { width:580px; height:580px; top:50%; left:50%; transform:translate(-50%,-53%); background:radial-gradient(circle at 40% 40%,rgba(188,19,254,.28) 0%,rgba(255,0,229,.12) 45%,transparent 70%); filter:blur(18px); }
    .orb-glow   { width:280px; height:280px; top:50%; left:50%; transform:translate(-50%,-53%); background:radial-gradient(circle,rgba(188,19,254,.45) 0%,transparent 70%); filter:blur(35px); }
    .ring { position:absolute; border-radius:50%; border:1px solid; top:50%; left:50%; }
    .r1 { width:460px; height:460px; transform:translate(-50%,-53%); border-color:rgba(188,19,254,.3); }
    .r2 { width:640px; height:640px; transform:translate(-50%,-53%); border-color:rgba(188,19,254,.15); }
    .r3 { width:820px; height:820px; transform:translate(-50%,-53%); border-color:rgba(188,19,254,.07); }
    .light-t { position:absolute; top:-100px; left:50%; transform:translateX(-50%); width:500px; height:400px; background:radial-gradient(ellipse,rgba(188,19,254,.35) 0%,transparent 70%); filter:blur(50px); }
    .light-b { position:absolute; bottom:-120px; left:50%; transform:translateX(-50%); width:600px; height:300px; background:radial-gradient(ellipse,rgba(255,0,229,.2) 0%,transparent 70%); filter:blur(50px); }
    .div-line { width:60px; height:2px; background:linear-gradient(90deg,transparent,#BC13FE,transparent); margin:28px auto; box-shadow:0 0 12px rgba(188,19,254,.8); }
    .eyebrow { font-family:'JetBrains Mono',monospace; font-size:13px; color:#00F2FF; letter-spacing:4px; text-transform:uppercase; text-shadow:0 0 14px rgba(0,242,255,.7); margin-bottom:24px; }
    .cc { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; z-index:10; width:90%; max-width:900px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 20px; box-sizing:border-box; }
    .h1 { font-family:'Syne',sans-serif; font-weight:800; line-height:1.1; color:#fff; text-shadow:0 0 40px rgba(188,19,254,.3); font-size:72px; word-wrap:break-word; max-width:100%; }
    .sub { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; color:rgba(255,255,255,.6); line-height:1.6; max-width:760px; }
    .sub strong { color:#fff; font-weight:600; }
    .lc { position:absolute; top:50%; left:80px; transform:translateY(-50%); z-index:10; width:800px; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; padding:0; box-sizing:border-box; text-align:left; }
    .lc .h1, .lc .sub { text-align:left; }
    .accent-bar { position:absolute; left:0; top:0; bottom:0; width:6px; background:linear-gradient(to bottom,transparent,#BC13FE 30%,#FF00E5 70%,transparent); display:none; }
    .accent-bar-top { position:absolute; top:0; left:0; right:0; height:6px; background:linear-gradient(90deg,#FF00E5,#BC13FE,#00F2FF); display:none; }
    .slide-badge { position:absolute; top:48px; right:56px; font-family:'JetBrains Mono',monospace; font-size:11px; color:rgba(188,19,254,.7); letter-spacing:2px; z-index:20; }
    #card-wrapper { width:100%; max-width:500px; aspect-ratio:1/1; position:relative; overflow:hidden; margin:0 auto; border-radius:12px; }
    #capture-area { transform-origin:top left; }

    /* UI Styles */
    body { background:#080010; min-height:100vh; font-family:'Plus Jakarta Sans',sans-serif; }
    .panel { background:rgba(255,255,255,.03); border:0.5px solid rgba(188,19,254,.2); border-radius:16px; padding:24px; }
    .mono { font-family:'JetBrains Mono',monospace; }
    .field-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.15em; color:rgba(255,255,255,.4); text-transform:uppercase; margin-bottom:6px; display:block; }
    .field { width:100%; background:rgba(255,255,255,.04); border:0.5px solid rgba(188,19,254,.25); border-radius:8px; padding:10px 12px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; outline:none; transition:border-color .2s; resize:vertical; }
    .field:focus { border-color:rgba(188,19,254,.6); }
    .type-btn { display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(255,255,255,.03); border:0.5px solid rgba(255,255,255,.1); color:rgba(255,255,255,.45); padding:10px 16px; border-radius:10px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:500; transition:all .2s; width:100%; }
    .type-btn:hover { border-color:rgba(188,19,254,.4); color:rgba(255,255,255,.8); }
    .type-btn.active { background:rgba(188,19,254,.1); border-color:rgba(188,19,254,.5); color:#BC13FE; }
    .btn-primary { width:100%; background:linear-gradient(135deg,#BC13FE,#FF00E5); color:#fff; font-family:'Syne',sans-serif; font-weight:700; padding:14px; border-radius:10px; border:none; cursor:pointer; font-size:15px; letter-spacing:1px; transition:opacity .2s; }
    .btn-primary:disabled { opacity:.5; cursor:not-allowed; }
    .btn-publish { width:100%; background:rgba(16,185,129,.08); border:0.5px solid rgba(16,185,129,.35); color:#10b981; font-family:'Syne',sans-serif; font-weight:700; padding:14px; border-radius:10px; cursor:pointer; font-size:15px; letter-spacing:1px; transition:all .2s; }
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
      <h1 style="font-family:'Syne',sans-serif;font-weight:800;font-size:2.2rem;color:#fff;letter-spacing:3px;">ERI<span style="color:#BC13FE;">ZON</span></h1>
      <p style="color:rgba(255,255,255,.3);font-size:12px;margin-top:6px;letter-spacing:.05em;">Inteligência que antecipa. Performance que escala.</p>
    </div>

    <div class="panel">

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
          <textarea id="h1-input" rows="2" class="field" style="font-family:'Syne',sans-serif;font-weight:700;margin-bottom:12px;"></textarea>
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
              <div id="content-container" class="cc">
                <div id="card-eyebrow" class="eyebrow">// AI Marketing OS</div>
                <h1 id="card-h1" class="h1">Pare de<br><span class="grad">adivinhar.</span></h1>
                <div id="card-div-line" class="div-line"></div>
                <p id="card-sub" class="sub">Deixe a IA <strong>decidir por você.</strong></p>
              </div>
              <div class="logo"><div class="logo-dot"></div><span class="logo-txt">Erizon</span><div class="logo-dot"></div></div>
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
              <input type="checkbox" id="pub-linkedin" checked> 💼 LinkedIn
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
    let carouselSlides = [];
    let currentSlideIdx = 0;

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
      } else {
        pubIgWrap.style.display = 'flex';
        pubStory.style.display = 'flex';
        pubLi.style.display = 'flex';
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
    function randomizeVisuals(h1Text) {
      const schemes = [
        { t:'rgba(188,19,254,', b:'rgba(255,0,229,', o:'rgba(188,19,254,' },
        { t:'rgba(0,242,255,',  b:'rgba(188,19,254,', o:'rgba(0,242,255,' },
        { t:'rgba(255,0,100,',  b:'rgba(255,68,136,', o:'rgba(255,0,100,' },
        { t:'rgba(255,255,255,', b:'rgba(0,242,255,', o:'rgba(188,19,254,' }
      ];
      const p = schemes[Math.floor(Math.random() * schemes.length)];
      const rx = (Math.floor(Math.random()*80)+10) + '% ';
      const ry = (Math.floor(Math.random()*80)+10) + '%';
      document.querySelector('.light-t').style.background = 'radial-gradient(ellipse,' + p.t + '.35) 0%,transparent 70%)';
      document.querySelector('.light-b').style.background = 'radial-gradient(ellipse,' + p.b + '.2) 0%,transparent 70%)';
      document.querySelector('.orb-center').style.background = 'radial-gradient(circle at ' + rx + ry + ',' + p.o + '.28) 0%,' + p.b + '.12) 45%,transparent 70%)';

      const layouts = ['center', 'left-v', 'left-h'];
      const layout  = layouts[Math.floor(Math.random() * layouts.length)];
      const cont    = document.getElementById('content-container');
      const av      = document.getElementById('card-accent-v');
      const ah      = document.getElementById('card-accent-h');
      const dl      = document.getElementById('card-div-line');
      av.style.display = 'none'; ah.style.display = 'none';
      dl.style.margin = '28px auto';
      if (layout === 'center') { cont.className = 'cc'; }
      else if (layout === 'left-v') { cont.className = 'lc'; av.style.display = 'block'; dl.style.margin = '28px 0'; }
      else { cont.className = 'lc'; ah.style.display = 'block'; dl.style.margin = '28px 0'; }

      const grads = ['grad','grad2','grad3'];
      const g = grads[Math.floor(Math.random() * grads.length)];
      let txt = (h1Text || '').replace(/class=["']grad\\d*["']/g, 'class="' + g + '"');
      if (!txt.includes('class=')) txt = txt.replace(/<span/g, '<span class="' + g + '"');
      document.getElementById('card-h1').innerHTML = txt;
    }

    // ============================================================
    // CAROUSEL NAVIGATION
    // ============================================================
    function showSlide(idx) {
      if (!carouselSlides.length) return;
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
        const url = isCarousel ? '/api/generate-carousel' : '/api/generate?type=' + currentPostType;
        const res  = await fetch(url);
        const data = await res.json();

        if (isCarousel) {
          carouselSlides = data.slides || [];
          postContent.value = data.caption || '';
          carouselNav.classList.remove('hidden');
          slideBadge.classList.remove('hidden');
          showSlide(0);
        } else {
          carouselSlides = [];
          carouselNav.classList.add('hidden');
          slideBadge.classList.add('hidden');
          postContent.value    = data.caption || '';
          eyebrowInput.value   = data.eyebrow || '';
          h1Input.value        = data.h1      || '';
          subInput.value       = data.sub     || '';
          document.getElementById('card-eyebrow').innerHTML = data.eyebrow || '';
          document.getElementById('card-sub').innerHTML     = data.sub     || '';
          randomizeVisuals(data.h1 || '');
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
    async function renderCard() {
      const orig  = document.getElementById('capture-area');
      const clone = orig.cloneNode(true);
      // Reseta transformações e garante tamanho/fundo explícitos
      clone.style.transform     = 'none';
      clone.style.width         = '1080px';
      clone.style.height        = '1080px';
      clone.style.background    = '#0B0112';
      clone.style.backgroundColor = '#0B0112';
      // Posiciona fora da tela mas visível ao renderer (fixed, não absolute)
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;left:-1200px;top:0;width:1080px;height:1080px;overflow:hidden;z-index:-1;';
      wrap.appendChild(clone);
      document.body.appendChild(wrap);
      const canvas = await html2canvas(clone, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0B0112',
        logging: false,
        width: 1080,
        height: 1080
      });
      document.body.removeChild(wrap);
      return canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
    }

    // ============================================================
    // PUBLISH
    // ============================================================
    btnPublish.addEventListener('click', async () => {
      btnPublish.disabled = true;
      const origTxt = btnPublish.innerText;
      statusMsg.classList.add('hidden');

      const platforms = [];
      if (document.getElementById('pub-instagram').checked) platforms.push('instagram');
      if (document.getElementById('pub-story').checked) platforms.push('instagram-story');
      if (document.getElementById('pub-linkedin').checked) platforms.push('linkedin');

      try {
        const isCarousel = currentPostType === 'instagram-carousel' && carouselSlides.length > 0;

        if (isCarousel) {
          const base64s = [];
          for (let i = 0; i < carouselSlides.length; i++) {
            btnPublish.innerText = 'Renderizando slide ' + (i+1) + '/' + carouselSlides.length + '...';
            showSlide(i);
            await new Promise(r => setTimeout(r, 350));
            base64s.push(await renderCard());
          }
          showSlide(0);
          btnPublish.innerText = 'Publicando carrossel...';
          const res  = await fetch('/api/publish-carousel', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ caption: postContent.value, imageBase64s: base64s, platforms })
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error || 'Erro desconhecido');
          showStatus('success', data.results);
        } else {
          btnPublish.innerText = 'Renderizando imagem...';
          const b64 = await renderCard();
          btnPublish.innerText = 'Publicando...';
          const res  = await fetch('/api/publish', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ content: postContent.value, imageBase64: b64, platforms })
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error || 'Erro desconhecido');
          showStatus('success', data.results);
        }
      } catch(e) {
        showStatus('error', ['❌ ' + e.message]);
      } finally {
        btnPublish.disabled  = false;
        btnPublish.innerText = origTxt;
      }
    });

    function showStatus(type, lines) {
      statusMsg.innerHTML = (type === 'success' ? '🚀 <strong>Relatório de Publicação:</strong><br><br>' : '') + lines.join('<br>');
      statusMsg.style.cssText = type === 'success'
        ? 'background:rgba(16,185,129,.08);border:0.5px solid rgba(16,185,129,.3);color:#10b981;border-radius:10px;padding:16px;font-size:13px;line-height:1.9;'
        : 'background:rgba(239,68,68,.08);border:0.5px solid rgba(239,68,68,.3);color:#ef4444;border-radius:10px;padding:16px;font-size:13px;';
      statusMsg.classList.remove('hidden');
    }
  </script>
</body>
</html>`;

// ============================================================
// HANDLER
// ============================================================
export default async function handler(req: any, res: any) {
  const url    = req.url?.split('?')[0] || '/';
  const query  = new URLSearchParams(req.url?.split('?')[1] || '');
  const method = req.method || 'GET';

  try {
    // Dashboard
    if (url === '/' && method === 'GET') {
      return res.status(200).setHeader('Content-Type', 'text/html').send(HTML_TEMPLATE);
    }

    // Generate single post
    if (url === '/api/generate' && method === 'GET') {
      const type = (query.get('type') || 'instagram-feed') as PostType;
      const agent = new SocialMediaAgent();
      return res.status(200).json(await agent.generatePost(type));
    }

    // Generate carousel
    if (url === '/api/generate-carousel' && method === 'GET') {
      const agent = new SocialMediaAgent();
      return res.status(200).json(await agent.generateCarousel());
    }

    // Publish single post
    if (url === '/api/publish' && method === 'POST') {
      const { content, imageBase64, platforms } = req.body || {};
      if (!content || !imageBase64) return res.status(400).json({ error: 'Texto ou imagem faltando.' });

      if (!process.env.IMGBB_API_KEY) {
        return res.status(500).json({ success: false, error: 'IMGBB_API_KEY não configurada.' });
      }

      const form = new URLSearchParams();
      form.append('key', process.env.IMGBB_API_KEY);
      form.append('image', imageBase64);
      const imgbbRes  = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
      const imgbbData = await imgbbRes.json() as any;
      if (!imgbbData.success) return res.status(500).json({ success: false, error: 'Erro ImgBB: ' + imgbbData.error?.message });

      const imageUrl = imgbbData.data.url;
      const agent    = new SocialMediaAgent();
      const results  = await agent.postToSocialMedia(content, imageUrl, imageBase64, platforms || ['instagram', 'linkedin']);
      return res.status(200).json({ success: true, results });
    }

    // Publish carousel
    if (url === '/api/publish-carousel' && method === 'POST') {
      const { caption, imageBase64s, platforms } = req.body || {};
      if (!caption || !imageBase64s?.length) return res.status(400).json({ error: 'Caption ou imagens faltando.' });

      if (!process.env.IMGBB_API_KEY) {
        return res.status(500).json({ success: false, error: 'IMGBB_API_KEY não configurada.' });
      }

      // Upload todos os slides pro ImgBB
      const imageUrls: string[] = [];
      for (const b64 of imageBase64s) {
        const form = new URLSearchParams();
        form.append('key', process.env.IMGBB_API_KEY);
        form.append('image', b64);
        const r    = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
        const d    = await r.json() as any;
        if (!d.success) return res.status(500).json({ success: false, error: 'Erro ImgBB slide: ' + d.error?.message });
        imageUrls.push(d.data.url);
      }

      const agent   = new SocialMediaAgent();
      const results: string[] = [];

      if ((platforms || []).includes('instagram')) {
        try {
          await agent.postCarouselToInstagram(imageUrls, caption);
          results.push('🎠 Instagram Carrossel: Sucesso');
        } catch (e: any) {
          results.push('🎠 Instagram Carrossel: Erro (' + e.message + ')');
        }
      }

      // LinkedIn recebe primeiro slide como post normal
      if ((platforms || []).includes('linkedin')) {
        try {
          const agent2 = new SocialMediaAgent();
          // @ts-ignore — acessa método privado via cast
          await (agent2 as any).postToLinkedIn(caption, imageBase64s[0]);
          results.push('💼 LinkedIn: Sucesso');
        } catch (e: any) {
          results.push('💼 LinkedIn: Erro (' + e.message + ')');
        }
      }

      return res.status(200).json({ success: true, results });
    }

    return res.status(404).json({ error: 'Rota não encontrada' });
  } catch (error: any) {
    logger.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
