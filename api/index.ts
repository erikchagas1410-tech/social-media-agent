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
  transports.push(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'combined.log' }));
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
if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
  logger.error('GROQ_API_KEY não foi encontrada! O arquivo .env pode estar vazio, com nome errado ou salvo com a codificação incorreta (precisa ser UTF-8).');
  process.exit(1);
}

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

  async generatePost(): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em mídias sociais. Crie um post curto e engajador sobre inteligência artificial e tecnologia. O post DEVE ter menos de 280 caracteres. NÃO use aspas. NÃO use frases de introdução como "Aqui está o post". Inclua 2 hashtags. O TEXTO DEVE SER ESCRITO 100% EM PORTUGUÊS DO BRASIL.',
          },
          {
            role: 'user',
            content: 'Gere um novo post engajador para hoje.',
          },
        ],
        model: 'llama-3.1-8b-instant', // Modelo atualizado e ativo do Groq
      });

      return completion.choices[0]?.message?.content || 'Default post content';
    } catch (error) {
      logger.error('Error generating post:', error);
      return 'Fallback post content';
    }
  }

  async generateImage(content: string): Promise<string> {
    try {
      // Pedimos ao Groq para criar um prompt curto de imagem baseado no texto do post
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an image prompt generator. Create a short, highly descriptive prompt in English for an AI image generator based on the following post. Maximum 15 words. Return ONLY the English prompt. NO quotes, NO introductory text like "Here is the prompt".' },
          { role: 'user', content }
        ],
        model: 'llama-3.1-8b-instant',
      });
      
      let prompt = completion.choices[0]?.message?.content?.trim() || 'AI technology futuristic concept';
      // Limpeza extrema: Remove introduções, caracteres especiais e limita o tamanho
      prompt = prompt.replace(/^(Here is the prompt|Prompt|Here is your prompt):\s*/i, '');
      const safePrompt = prompt.replace(/[^a-zA-Z0-9\s,]/g, '').replace(/\s+/g, ' ').substring(0, 200).trim();
      
      const seed = Math.floor(Math.random() * 100000); // Garante que a imagem seja nova
      // Tenta gerar a imagem com o safePrompt
      return `https://pollinations.ai/p/${encodeURIComponent(safePrompt)}?width=1080&height=1080&nologo=true&seed=${seed}`;
    } catch (error) {
      // Se houver um erro na geração da imagem, retorna a imagem padrão
      logger.error('Error generating image prompt:', error);
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

    // Instagram posting via Meta Graph API
    // Note: This requires a Facebook Business account and Instagram Business account
    // Posting media content requires additional setup
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Imagem agora é dinâmica e gerada por IA
        image_url: imageUrl,
        caption: content,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Instagram API (Media Create) returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.id) {
      // Publish the media
      const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: data.id,
          access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        }),
      });

      if (!publishResponse.ok) {
        const errorText = await publishResponse.text();
        throw new Error(`Instagram API (Media Publish) returned ${publishResponse.status}: ${errorText}`);
      }

      logger.info(`Posted to Instagram: ${data.id}`);
    } else {
      throw new Error(`Failed to create Instagram media: ${JSON.stringify(data)}`);
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
</head>
<body class="bg-gray-100 p-4 md:p-8 font-sans">
  <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-800 text-center">🤖 Estúdio de Publicação</h1>

    <button id="btn-generate" class="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition shadow-md mb-6 flex justify-center items-center">
      1. Gerar Ideia e Imagem com IA
    </button>

    <div id="loading" class="hidden text-center text-indigo-500 font-bold mb-4 animate-pulse">
      Criando post e desenhando imagem (isso pode levar uns 10 segundos)...
    </div>

    <div id="preview-section" class="hidden space-y-5">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Texto do Post (Sinta-se livre para editar)</label>
        <textarea id="post-content" rows="4" class="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Imagem para o Instagram</label>
        <img id="post-image" src="" alt="Imagem gerada" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1080&auto=format&fit=crop';" class="w-full h-auto rounded-lg shadow-sm border mb-2 object-cover max-h-96" />
        <input type="text" id="post-image-url" class="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-500 bg-gray-50" placeholder="URL da imagem (você pode colar outro link aqui se não gostar)">
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
    const postImage = document.getElementById('post-image');
    const postImageUrl = document.getElementById('post-image-url');
    const statusMessage = document.getElementById('status-message');

    btnGenerate.addEventListener('click', async () => {
      loading.classList.remove('hidden');
      previewSection.classList.add('hidden');
      statusMessage.classList.add('hidden');
      btnGenerate.disabled = true;

      try {
        const res = await fetch('/api/generate');
        const data = await res.json();
        postContent.value = data.content;
        postImage.src = data.imageUrl;
        postImageUrl.value = data.imageUrl;
        previewSection.classList.remove('hidden');
      } catch (e) {
        alert('Erro ao gerar post: ' + e.message);
      } finally {
        loading.classList.add('hidden');
        btnGenerate.disabled = false;
      }
    });

    postImageUrl.addEventListener('input', (e) => { postImage.src = e.target.value; });

    btnPublish.addEventListener('click', async () => {
      btnPublish.disabled = true;
      btnPublish.innerText = 'Publicando nas redes...';
      statusMessage.classList.add('hidden');

      try {
        const res = await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: postContent.value, imageUrl: postImageUrl.value })
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
    if (url === '/' && method === 'GET') {
      return res.status(200).setHeader('Content-Type', 'text/html').send(HTML_TEMPLATE);
    }

    if (url === '/api/generate' && method === 'GET') {
      const agent = new SocialMediaAgent();
      const content = await agent.generatePost();
      const imageUrl = await agent.generateImage(content);
      return res.status(200).json({ content, imageUrl });
    }

    if (url === '/api/publish' && method === 'POST') {
      const { content, imageUrl } = req.body || {};
      if (!content || !imageUrl) return res.status(400).json({ error: 'Texto ou imagem faltando.' });

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