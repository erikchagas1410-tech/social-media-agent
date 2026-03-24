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

  async generatePost(): Promise<{ imageText: string, caption: string }> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return {
          imageText: 'Configure a GROQ_API_KEY no Vercel.',
          caption: 'Sem a chave da API do Groq, a IA não pode gerar novos textos.'
        };
      }
      
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      const systemPrompt = `Você é o estrategista de IA e marketing da ERIZON (Inteligência Operacional B2B - lema: detect > act > scale).
      Sua tarefa é gerar conteúdo para redes sociais (Instagram e LinkedIn).
      Para NUNCA repetir o mesmo assunto, a CADA VEZ que for chamado, ESCOLHA ALEATORIAMENTE apenas UM dos seguintes pilares de conteúdo:
      1. Explicação: O que é a ERIZON e o conceito de Inteligência Operacional.
      2. Benefícios: Por que escolher a ERIZON (otimização, automação de dados).
      3. Timing: Quando escolher a ERIZON (dores do cliente, gargalos de escala).
      4. Diferenciação: Por que a ERIZON é única (foco em ação e resultado, não apenas relatórios passivos).
      5. Interativo: Post estilo 'Stories' com perguntas e reflexões profundas sobre o mercado de tecnologia e inovação.

      RETORNE OBRIGATORIAMENTE UM JSON VÁLIDO NO SEGUINTE FORMATO EXATO:
      {
        "imageText": "Frase curta, de impacto e poética (MÁXIMO de 15 a 20 palavras) para o centro da imagem. Sem aspas.",
        "caption": "A legenda completa, detalhada e persuasiva para o post no LinkedIn e Feed do Instagram. Aprofunde a explicação do pilar escolhido, inclua as hashtags #Erizon #InteligenciaOperacional e use emojis apropriados."
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
        imageText: 'A inteligência operacional é o motor invisível das empresas que escalam.',
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
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet">
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
        <label class="block text-sm font-bold text-gray-700 mb-2">Texto da Imagem (Para o Card / Story)</label>
        <textarea id="image-text" rows="2" class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Legenda do Post (Feed LinkedIn / Instagram)</label>
        <textarea id="post-content" rows="6" class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Imagem para o Instagram</label>
        
        <!-- Template ERIZON para Captura (Design Premium & html2canvas friendly) -->
        <div id="capture-area" class="relative flex flex-col justify-center items-center bg-[#0A0510] p-6 md:p-10 mx-auto overflow-hidden shadow-2xl" style="width: 100%; aspect-ratio: 1/1; max-width: 600px;">
          
          <!-- Efeitos de Fundo (Compatíveis com html2canvas) -->
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0); background-size: 24px 24px;"></div>
          
          <!-- Orbes Suaves -->
          <div id="orb-1" class="absolute -top-32 -right-32 w-96 h-96 bg-[#BC13FE] rounded-full filter blur-[100px] opacity-30 transition-colors duration-500"></div>
          <div id="orb-2" class="absolute -bottom-32 -left-32 w-96 h-96 bg-[#00F2FF] rounded-full filter blur-[100px] opacity-20 transition-colors duration-500"></div>

          <!-- Container do Conteúdo (Design de Carta Premium) -->
          <div class="relative z-10 flex flex-col justify-between w-full h-full bg-[#1A1025]/80 border border-[#BC13FE]/20 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(188,19,254,0.1)]">
            
            <!-- Topo / Marca -->
            <div class="flex justify-between items-start w-full">
              <div class="flex items-center gap-3 md:gap-4">
                <div class="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#BC13FE] to-[#FF00E5] flex items-center justify-center text-white font-extrabold text-xl md:text-3xl shadow-lg" style="font-family: 'Syne', sans-serif;">E</div>
                <div class="flex flex-col">
                  <div class="font-extrabold text-xl md:text-3xl text-white tracking-widest" style="font-family: 'Syne', sans-serif;">ERIZON</div>
                  <div class="text-[#00F2FF] text-[8px] md:text-[10px] font-mono tracking-widest uppercase mt-0.5">Inteligência Operacional</div>
                </div>
              </div>
              <div class="px-3 py-1.5 rounded-full border border-[#BC13FE]/30 bg-[#BC13FE]/10 text-white/90 text-[8px] md:text-[10px] font-mono tracking-widest uppercase flex items-center gap-2">
                <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00F2FF]"></span> IA Insight
              </div>
            </div>

            <!-- Centro / Mensagem Principal -->
            <div class="flex flex-col justify-center flex-grow py-6 md:py-10 w-full">
              <!-- Aspas duplas estilosas -->
              <svg class="w-8 h-8 md:w-12 md:h-12 text-[#BC13FE] mb-4 md:mb-6 opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <p id="card-text-display" class="text-xl md:text-3xl font-medium leading-relaxed text-white" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                Sua mensagem gerada pela IA aparecerá aqui.
              </p>
            </div>

            <!-- Rodapé / Assinatura -->
            <div class="flex justify-between items-end w-full pt-5 md:pt-6 border-t border-[#BC13FE]/20">
              <div class="flex flex-col gap-1.5">
                <div class="text-[8px] md:text-[11px] text-[#00F2FF]/70 uppercase tracking-[0.2em]" style="font-family: 'JetBrains Mono', monospace;">detect > act > scale</div>
                <div class="text-white text-xs md:text-base font-bold tracking-wider" style="font-family: 'Syne', sans-serif;">ERIZON.COM.BR</div>
              </div>
              <div class="flex gap-1.5 md:gap-2 mb-1">
                <div class="h-1.5 md:h-2 w-6 md:w-8 bg-[#BC13FE] rounded-full"></div>
                <div class="h-1.5 md:h-2 w-3 md:w-4 bg-[#00F2FF] rounded-full"></div>
                <div class="h-1.5 md:h-2 w-1.5 md:w-2 bg-[#FF00E5] rounded-full"></div>
              </div>
            </div>
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
    const imageText = document.getElementById('image-text');
    const cardTextDisplay = document.getElementById('card-text-display');
    const statusMessage = document.getElementById('status-message');

    // Espelha o texto da IMAGEM direto pro Card
    imageText.addEventListener('input', (e) => {
      cardTextDisplay.innerText = e.target.value || 'Sua mensagem gerada pela IA aparecerá aqui.';
    });

    btnGenerate.addEventListener('click', async () => {
      loading.classList.remove('hidden');
      previewSection.classList.add('hidden');
      statusMessage.classList.add('hidden');
      btnGenerate.disabled = true;

      try {
        const res = await fetch('/api/generate');
        const data = await res.json();
        postContent.value = data.caption || '';
        imageText.value = data.imageText || '';
        cardTextDisplay.innerText = data.imageText || '';

        // Randomiza o visual do post
        const colors = ['#BC13FE', '#00F2FF', '#FF00E5', '#6B21A8', '#0284C7', '#E879F9', '#38BDF8'];
        document.getElementById('orb-1').style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('orb-2').style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        previewSection.classList.remove('hidden');
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
        // Tira o print com o scale 3 para aumentar bastante a qualidade da imagem, pronto para as redes!
        const canvas = await html2canvas(document.getElementById('capture-area'), { scale: 3, useCORS: true, backgroundColor: '#0A0510' });
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];

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