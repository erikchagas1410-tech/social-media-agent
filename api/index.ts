import dotenv from 'dotenv';
import path from 'path';
import winston from 'winston';
import Groq from 'groq-sdk';
import { TwitterApi } from 'twitter-api-v2';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
console.log(`\n[DEBUG] Buscando arquivo .env exatamente no caminho: ${envPath}`);
const envConfig = dotenv.config({ path: envPath, override: true });

if (envConfig.error) {
  console.error('[DEBUG] Erro ao carregar o arquivo .env:', envConfig.error);
} else {
  console.log('[DEBUG] Arquivo .env lido com sucesso! Chaves encontradas:', Object.keys(envConfig.parsed || {}));
}

const transports: winston.transport[] = [new winston.transports.Console()];
// O Vercel tem um sistema de arquivos read-only. Só salvamos em arquivo se rodar localmente.
if (!process.env.VERCEL) {
  transports.push(new winston.transports.File({ 
    filename: 'error.log', 
    level: 'error' 
  }));
  transports.push(new winston.transports.File({ 
    filename: 'combined.log' ,
    level: 'info'
  }));
}

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  transports,
});

// Verifica se a variável de ambiente foi carregada
//if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
//  logger.error('GROQ_API_KEY não foi encontrada! O arquivo .env pode estar vazio, com nome errado ou salvo com a codificação incorreta (precisa ser UTF-8).');
//  process.exit(1);
//}

// Initialize Google Vertex AI client
/*const vertexAI = new VertexAI({
    project: process.env.GOOGLE_PROJECT_ID || '',
    location: process.env.GOOGLE_LOCATION || 'us-central1',
  });

// Define the model
const model = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro-002',
  generation_config: { maxOutputTokens: 2048 },
});*/

// Social Media Agent class
class SocialMediaAgent {
  private twitterClient?: TwitterApi;

  constructor() {
    logger.info('Social Media Agent initialized');

    // Initialize Twitter client if credentials are provided
    if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET &&
        process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      this.twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      });
    }
  }

  async generatePost(): Promise<{ eyebrow: string, h1: string, sub: string, caption: string }> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return {
          eyebrow: '// ERRO',
          h1: 'Sem <span class="grad">Chave API</span>',
          sub: 'Configure a GROQ_API_KEY no Vercel para gerar conteúdo.',
          caption: 'Sem a chave da API do Groq, a IA não pode gerar novos textos.'
        };
      }
      
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const systemPrompt = `Você é o estrategista de IA e marketing da ERIZON (Inteligência Operacional B2B - lema: detect > act > scale).
      A ERIZON ajuda empresas a otimizarem operações de ponta a ponta através de dados, automação e IA.
      Sua tarefa é gerar conteúdo para redes sociais. O usuário pediu para focar em EXPLICAR a ERIZON e seus benefícios, evitando ser apenas "frases de efeito".
      
      Escolha UM destes pilares para focar:
      1. O que é a ERIZON e como funciona a Inteligência Operacional na prática.
      2. Por que escolher a ERIZON (ganho de eficiência, otimização, fim dos gargalos).
      3. Quando escolher a ERIZON (sintomas de que a empresa do cliente precisa escalar e transformar dados em ação).
      4. Nosso diferencial competitivo (o método 'detect > act > scale', agindo no problema ao invés de só mostrar dashboards).

      RETORNE OBRIGATORIAMENTE UM JSON VÁLIDO NO SEGUINTE FORMATO EXATO:
      {
        "eyebrow": "// Categoria (Ex: // Meta Ads · Frequência ou // Inteligência de Dados)",
        "h1": "Frase de impacto principal MÁXIMO de 8 palavras. USE OBRIGATORIAMENTE a tag <span class='grad'>palavra</span> para destacar 1 ou 2 palavras cruciais.",
        "sub": "Subtítulo explicativo curto (MÁXIMO de 15 palavras). Use a tag <strong> para colocar em negrito a parte mais forte.",
        "caption": "A legenda completa e detalhada para o post. Desenvolva o raciocínio, convença o leitor, mostre autoridade no assunto de automação/dados. Inclua as hashtags #Erizon #InteligenciaOperacional e emojis."
      }`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Gere um conteúdo criativo, inédito e engajador para a ERIZON. Escolha um pilar diferente do habitual.' }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.9,
        response_format: { type: 'json_object' }
      });

      const jsonContent = response.choices[0]?.message?.content || '{}';
      return JSON.parse(jsonContent);
    } catch (error) {
      logger.error('Error generating post:', error);
      return {
        eyebrow: '// Inteligência Operacional',
        h1: 'Pare de<br><span class="grad">adivinhar.</span>',
        sub: 'Deixe a IA <strong>decidir por você.</strong><br>Com dados reais. Em português.',
        caption: 'O futuro não é apenas previsto, ele é operado. A ERIZON transforma seus dados em ações concretas que escalam o seu negócio. #Erizon #IA'
      };
    }
  }

  async generateImage(content: string): Promise<string> {
    try {
      // A imagem agora é gerada localmente no Front-End usando HTML2Canvas!
      return '';
    } catch (error) {
      logger.error('Erro completo ao gerar imagem:', error);
      return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1080&auto=format&fit=crop';
    }
  }

  async postToSocialMedia(content: string, imageUrl: string): Promise<void> {
    const platforms = ['twitter', 'linkedin', 'instagram'];

    for (const platform of platforms) {
      try {
        switch (platform) {
          case 'twitter':
            await this.postToTwitter(content);
            break;
          case 'linkedin':
            await this.postToLinkedIn(content);
            break;
          case 'instagram':
            await this.postToInstagram(content, imageUrl);
            break;
        }
      } catch (error) {
        logger.error(`Error posting to ${platform}:`, error);
      }
    }
  }

  private async postToTwitter(content: string): Promise<void> {
    if (!this.twitterClient) {
      logger.warn('Twitter client not initialized. Skipping Twitter post.');
      return;
    }

    const tweet = await this.twitterClient.v2.tweet(content);
    logger.info(`Posted to Twitter: ${tweet.data.id}`);
  }

  private async postToLinkedIn(content: string): Promise<void> {
    if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_PERSON_URN) {
      logger.warn('LinkedIn credentials not provided. Skipping LinkedIn post.');
      return;
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: `urn:li:person:${process.env.LINKEDIN_PERSON_URN}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API returned ${response.status}: ${errorText}`);
    }

    const post = await response.json();
    logger.info(`Posted to LinkedIn: ${post.id}`);
  }

  private async postToInstagram(content: string, imageUrl: string): Promise<void> {
    if (!process.env.INSTAGRAM_ACCESS_TOKEN || !process.env.INSTAGRAM_ACCOUNT_ID) {
      logger.warn('Instagram credentials not provided. Skipping Instagram post.');
      return;
    }

    const postMedia = async (isStory: boolean) => {
      const body: any = {
        image_url: imageUrl,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      };

      if (isStory) {
        body.media_type = 'STORIES';
      } else {
        body.caption = content;
      }

      logger.info(`Creating Instagram ${isStory ? 'Story' : 'Feed'} Media...`);
      const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Instagram API (Media Create ${isStory ? 'Story' : 'Feed'}) returned ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      if (data.id) {
        logger.info(`Publishing Instagram ${isStory ? 'Story' : 'Feed'} Media...`);
        const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: data.id,
            access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
          }),
        });

        if (!publishResponse.ok) {
          throw new Error(`Instagram API (Media Publish ${isStory ? 'Story' : 'Feed'}) returned ${publishResponse.status}: ${await publishResponse.text()}`);
        }
        logger.info(`Successfully posted to Instagram ${isStory ? 'Story' : 'Feed'}: ${data.id}`);
      } else {
        throw new Error(`Failed to create Instagram media: ${JSON.stringify(data)}`);
      }
    };

    try {
      await postMedia(false); // 1. Posta no Feed
      await postMedia(true);  // 2. Posta nos Stories
    } catch (error) {
      logger.error('Error in Instagram multi-post flow:', error);
      throw error; // Repassa o erro para exibir no painel
    }
  }
}

// --- PAINEL HTML ---
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Aprovação de Posts - Agente IA</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* ERIZON DESIGN SYSTEM */
    .card { width: 1080px; height: 1080px; position: relative; overflow: hidden; background: #0B0112; font-family: 'Inter', sans-serif; color: #fff; }
    .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(188,19,254,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(188,19,254,.05) 1px, transparent 1px); background-size: 60px 60px; }
    .corner { position: absolute; width: 40px; height: 40px; }
    .tl { top: 32px; left: 32px; border-top: 2px solid rgba(188,19,254,.5); border-left: 2px solid rgba(188,19,254,.5); }
    .tr { top: 32px; right: 32px; border-top: 2px solid rgba(188,19,254,.5); border-right: 2px solid rgba(188,19,254,.5); }
    .bl { bottom: 32px; left: 32px; border-bottom: 2px solid rgba(188,19,254,.5); border-left: 2px solid rgba(188,19,254,.5); }
    .br { bottom: 32px; right: 32px; border-bottom: 2px solid rgba(188,19,254,.5); border-right: 2px solid rgba(188,19,254,.5); }
    
    .logo { position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; white-space: nowrap; }
    .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: #BC13FE; box-shadow: 0 0 10px rgba(188,19,254,.9); }
    .logo-txt { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: 4px; text-transform: uppercase; }
    
    .grad { background: linear-gradient(135deg, #BC13FE, #FF00E5); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .grad2 { background: linear-gradient(135deg, #00F2FF, #BC13FE); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .grad3 { background: linear-gradient(135deg, #FF00E5, #FF4488); -webkit-background-clip: text; background-clip: text; color: transparent; }
    
    .orb { position: absolute; border-radius: 50%; }
    .orb-center { width: 580px; height: 580px; top: 50%; left: 50%; transform: translate(-50%,-53%); background: radial-gradient(circle at 40% 40%, rgba(188,19,254,.28) 0%, rgba(255,0,229,.12) 45%, transparent 70%); filter: blur(18px); }
    .orb-glow { width: 280px; height: 280px; top: 50%; left: 50%; transform: translate(-50%,-53%); background: radial-gradient(circle, rgba(188,19,254,.45) 0%, transparent 70%); filter: blur(35px); }
    .ring { position: absolute; border-radius: 50%; border: 1px solid; top: 50%; left: 50%; }
    .r1 { width: 460px; height: 460px; transform: translate(-50%,-53%); border-color: rgba(188,19,254,.3); }
    .r2 { width: 640px; height: 640px; transform: translate(-50%,-53%); border-color: rgba(188,19,254,.15); }
    .r3 { width: 820px; height: 820px; transform: translate(-50%,-53%); border-color: rgba(188,19,254,.07); }
    
    .div-line { width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #BC13FE, transparent); margin: 28px auto; box-shadow: 0 0 12px rgba(188,19,254,.8); }
    
    .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #00F2FF; letter-spacing: 4px; text-transform: uppercase; text-shadow: 0 0 14px rgba(0,242,255,.7); margin-bottom: 24px; }
    
    .cc { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; z-index: 10; width: 860px; }
    .h1 { font-family: 'Montserrat', sans-serif; font-weight: 900; line-height: 1.06; color: #fff; text-shadow: 0 0 40px rgba(188,19,254,.3); }
    .sub { font-family: 'Inter', sans-serif; font-size: 20px; color: rgba(255,255,255,.6); line-height: 1.65; }
    .sub strong { color: #fff; font-weight: 600; }
    
    .light-t { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 500px; height: 400px; background: radial-gradient(ellipse, rgba(188,19,254,.35) 0%, transparent 70%); filter: blur(50px); }
    .light-b { position: absolute; bottom: -120px; left: 50%; transform: translateX(-50%); width: 600px; height: 300px; background: radial-gradient(ellipse, rgba(255,0,229,.2) 0%, transparent 70%); filter: blur(50px); }

    /* Wrapper responsivo para o preview não vazar da tela */
    #card-wrapper { width: 100%; max-width: 500px; aspect-ratio: 1/1; position: relative; overflow: hidden; margin: 0 auto; border-radius: 12px; }
    #capture-area { transform-origin: top left; }
  </style>
</head>
<body class="bg-gray-100 p-4 md:p-8 font-sans">
  <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-800 text-center">🤖 Estúdio de Publicação</h1>

    <button id="btn-generate" class="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition shadow-md mb-6 flex justify-center items-center">
      1. Gerar Ideia e Imagem com IA
    </button>

    <div id="loading" class="hidden text-center text-indigo-500 font-bold mb-4 animate-pulse">
      Pensando na estratégia de hoje...
    </div>

    <div id="preview-section" class="hidden space-y-5">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Eyebrow (Topo)</label>
        <input id="eyebrow-input" type="text" class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none mb-3">
        
        <label class="block text-sm font-bold text-gray-700 mb-2">Título Principal (H1)</label>
        <textarea id="h1-input" rows="2" class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none mb-3"></textarea>
        
        <label class="block text-sm font-bold text-gray-700 mb-2">Subtítulo</label>
        <textarea id="sub-input" rows="2" class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Legenda do Post (Feed LinkedIn / Instagram)</label>
        <textarea id="post-content" rows="6" class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Imagem para o Instagram</label>
        
        <div id="card-wrapper" class="shadow-2xl">
          <div id="capture-area" class="card">
            <div class="grid-bg"></div><div class="light-t"></div><div class="light-b"></div>
            <div class="orb orb-center"></div><div class="orb orb-glow"></div>
            <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
            <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
            <div class="cc">
              <div id="card-eyebrow" class="eyebrow">// AI Marketing OS</div>
              <h1 id="card-h1" class="h1" style="font-size:78px">Pare de<br><span class="grad">adivinhar.</span></h1>
              <div class="div-line"></div>
              <p id="card-sub" class="sub">Deixe a IA <strong>decidir por você.</strong><br>Com dados reais. Em português.</p>
            </div>
            <div class="logo"><div class="logo-dot"></div><span class="logo-txt">Erizon</span><div class="logo-dot"></div></div>
          </div>
        </div>
      </div>

      <button id="btn-publish" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition shadow-md mt-4">
        2. Aprovar e Disparar nas Redes!
      </button>
    </div>

    <div id="status-message" class="mt-6 text-center font-bold hidden p-4 rounded-lg"></div>
  </div>

  <script>
    const btnGenerate = document.getElementById('btn-generate');
    const btnPublish = document.getElementById('btn-publish');
    const loading = document.getElementById('loading');
    const previewSection = document.getElementById('preview-section');
    const postContent = document.getElementById('post-content');
    const eyebrowInput = document.getElementById('eyebrow-input');
    const h1Input = document.getElementById('h1-input');
    const subInput = document.getElementById('sub-input');
    const statusMessage = document.getElementById('status-message');

    // Ajusta o card 1080x1080 no layout responsivo
    function scaleCard() {
      const wrapper = document.getElementById('card-wrapper');
      const card = document.getElementById('capture-area');
      const scale = wrapper.clientWidth / 1080;
      card.style.transform = 'scale(' + scale + ')';
    }
    window.addEventListener('resize', scaleCard);
    scaleCard();

    // Espelha os textos digitados direto pro Card
    eyebrowInput.addEventListener('input', e => document.getElementById('card-eyebrow').innerHTML = e.target.value);
    h1Input.addEventListener('input', e => document.getElementById('card-h1').innerHTML = e.target.value);
    subInput.addEventListener('input', e => document.getElementById('card-sub').innerHTML = e.target.value);

    btnGenerate.addEventListener('click', async () => {
      loading.classList.remove('hidden');
      previewSection.classList.add('hidden');
      statusMessage.classList.add('hidden');
      btnGenerate.disabled = true;

      try {
        const res = await fetch('/api/generate');
        const data = await res.json();
        postContent.value = data.caption || '';
        eyebrowInput.value = data.eyebrow || '';
        h1Input.value = data.h1 || '';
        subInput.value = data.sub || '';
        
        document.getElementById('card-eyebrow').innerHTML = data.eyebrow || '';
        document.getElementById('card-h1').innerHTML = data.h1 || '';
        document.getElementById('card-sub').innerHTML = data.sub || '';

        previewSection.classList.remove('hidden');
        setTimeout(scaleCard, 100);
      } catch (e) {
        alert('Erro ao gerar post: ' + e.message);
      } finally {
        loading.classList.add('hidden');
        btnGenerate.disabled = false;
      }
    });

    btnPublish.addEventListener('click', async () => {
      btnPublish.disabled = true;
      btnPublish.innerText = 'Renderizando Imagem e Publicando...';
      statusMessage.classList.add('hidden');

      try {
        // Clona a div base para renderizar escondida em resolução original (sem as quebras do CSS Transform)
        const originalCard = document.getElementById('capture-area');
        const clone = originalCard.cloneNode(true);
        clone.style.transform = 'none'; // Reseta o zoom para ficar 1080x1080 real!
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.appendChild(clone);
        document.body.appendChild(hiddenContainer);

        const canvas = await html2canvas(clone, { scale: 1, useCORS: true, backgroundColor: '#0B0112' });
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        document.body.removeChild(hiddenContainer);

        const res = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: postContent.value, imageBase64 })
        });
        const data = await res.json();

        if (data.success) {
          statusMessage.innerHTML = '🚀 <b>Sucesso!</b> Post enviado para Twitter, LinkedIn e Instagram!';
          statusMessage.className = 'mt-6 text-center text-green-800 bg-green-100 p-4 rounded-lg block';
        } else {
          throw new Error(data.error || 'Erro desconhecido');
        }
      } catch (e) {
        statusMessage.innerText = '❌ Erro: ' + e.message;
        statusMessage.className = 'mt-6 text-center text-red-800 bg-red-100 p-4 rounded-lg block';
      } finally {
        btnPublish.disabled = false;
        btnPublish.innerText = '2. Aprovar e Disparar nas Redes!';
      }
    });
  </script>
</body>
</html>
`;

// --- VERCEL ROUTER HANDLER ---
export default async function handler(req: any, res: any) {
  const url = req.url?.split('?')[0] || '/';
  const method = req.method || 'GET';

  try {
    console.log('oi')
    if (url === '/' && method === 'GET') {
      return res.status(200).setHeader('Content-Type', 'text/html').send(HTML_TEMPLATE);
    }

    if (url === '/api/generate' && method === 'GET') {
      const agent = new SocialMediaAgent();
      const generatedData = await agent.generatePost();
      return res.status(200).json(generatedData);
    }

    if (url === '/api/publish' && method === 'POST') {
      const { content, imageBase64 } = req.body || {};
      if (!content || !imageBase64) return res.status(400).json({ error: 'Texto ou imagem faltando.' });

      let imageUrl = '';
      try {
        if (!process.env.IMGBB_API_KEY) {
          throw new Error('Chave do ImgBB (IMGBB_API_KEY) não encontrada no Vercel!');
        }
        const form = new URLSearchParams();
        form.append('key', process.env.IMGBB_API_KEY);
        form.append('image', imageBase64);

        // Upload pro ImgBB para pegar URL pública compatível com Instagram!
        const imgbbRes = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
        const imgbbData = await imgbbRes.json() as any;
        
        if (!imgbbData.success) throw new Error(imgbbData.error?.message || 'Falha ao upar imagem');
        imageUrl = imgbbData.data.url;
      } catch (err: any) {
        logger.error('Erro no ImgBB:', err);
        return res.status(500).json({ success: false, error: 'Erro ImgBB: ' + err.message });
      }

      const agent = new SocialMediaAgent();
      await agent.postToSocialMedia(content, imageUrl);
      return res.status(200).json({ success: true });
    }

    res.status(404).json({ error: 'Rota não encontrada' });
  } catch (error: any) {
    logger.error('API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}