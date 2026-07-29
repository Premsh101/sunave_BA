import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Multi-provider AI generation with automatic fallback.
 *
 * Providers are tried in this order, skipping any that are not configured:
 *
 *   1. OpenRouter        — OPENROUTER_API_KEY (+ optional OPENROUTER_MODEL)
 *   2. Local LLM         — LOCAL_LLM_BASE_URL, e.g. an Ollama or LM Studio
 *                          OpenAI-compatible endpoint (+ optional LOCAL_LLM_MODEL,
 *                          LOCAL_LLM_API_KEY)
 *   3. OpenAI            — OPENAI_API_KEY (+ optional OPENAI_MODEL)
 *   4. Google Gemini     — GEMINI_API_KEY (+ optional GEMINI_MODEL)
 *   5. Anthropic Claude  — ANTHROPIC_API_KEY (+ optional ANTHROPIC_MODEL)
 *
 * The first provider that succeeds wins; on any error the chain falls
 * through to the next one.
 */

export interface GenerationRequest {
  systemPrompt: string;
  userPrompt: string;
}

export interface GenerationResult {
  document: string;
  provider: string;
  model: string;
}

interface AIProvider {
  name: string;
  isConfigured(): boolean;
  generate(req: GenerationRequest): Promise<GenerationResult>;
}

const MAX_OUTPUT_TOKENS = 16000;

// ---------------------------------------------------------------------------
// OpenAI-compatible chat completions (OpenRouter, local LLMs, OpenAI)
// ---------------------------------------------------------------------------

async function openAICompatibleChat(opts: {
  provider: string;
  baseUrl: string;
  apiKey?: string;
  model: string;
  req: GenerationRequest;
  extraHeaders?: Record<string, string>;
}): Promise<GenerationResult> {
  const { provider, baseUrl, apiKey, model, req, extraHeaders } = opts;

  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        { role: 'system', content: req.systemPrompt },
        { role: 'user', content: req.userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${provider} HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: unknown = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error(`${provider} returned an empty response`);
  }

  return { document: content, provider, model: data?.model || model };
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

const openRouterProvider: AIProvider = {
  name: 'openrouter',
  isConfigured: () => Boolean(process.env.OPENROUTER_API_KEY),
  generate: (req) =>
    openAICompatibleChat({
      provider: 'openrouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.OPENROUTER_MODEL || 'openrouter/auto',
      req,
      extraHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://sunave.tech',
        'X-Title': 'Sunave',
      },
    }),
};

const localLLMProvider: AIProvider = {
  name: 'local',
  // e.g. LOCAL_LLM_BASE_URL=http://localhost:11434/v1 (Ollama)
  isConfigured: () => Boolean(process.env.LOCAL_LLM_BASE_URL),
  generate: (req) =>
    openAICompatibleChat({
      provider: 'local',
      baseUrl: process.env.LOCAL_LLM_BASE_URL!,
      apiKey: process.env.LOCAL_LLM_API_KEY,
      model: process.env.LOCAL_LLM_MODEL || 'llama3.1',
      req,
    }),
};

const openAIProvider: AIProvider = {
  name: 'openai',
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  generate: (req) =>
    openAICompatibleChat({
      provider: 'openai',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      req,
    }),
};

const geminiProvider: AIProvider = {
  name: 'gemini',
  isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
  async generate(req) {
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent([req.systemPrompt, req.userPrompt]);
    const text = result.response.text();
    if (!text.trim()) throw new Error('gemini returned an empty response');
    return { document: text, provider: 'gemini', model: modelName };
  },
};

const claudeProvider: AIProvider = {
  name: 'claude',
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async generate(req) {
    const modelName = process.env.ANTHROPIC_MODEL || 'claude-opus-5';
    const client = new Anthropic();

    // Stream to avoid HTTP timeouts on long documents. Server-side fallbacks
    // re-run the request on claude-opus-4-8 if safety classifiers decline it.
    const stream = client.beta.messages.stream({
      model: modelName,
      max_tokens: MAX_OUTPUT_TOKENS,
      betas: ['server-side-fallback-2026-06-01'],
      fallbacks: [{ model: 'claude-opus-4-8' }],
      system: req.systemPrompt,
      messages: [{ role: 'user', content: req.userPrompt }],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === 'refusal') {
      throw new Error('claude declined the request (safety refusal)');
    }

    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');
    if (!text.trim()) throw new Error('claude returned an empty response');

    return { document: text, provider: 'claude', model: message.model || modelName };
  },
};

const PROVIDERS: AIProvider[] = [
  openRouterProvider,
  localLLMProvider,
  openAIProvider,
  geminiProvider,
  claudeProvider,
];

// ---------------------------------------------------------------------------
// Fallback chain
// ---------------------------------------------------------------------------

export function configuredProviders(): string[] {
  return PROVIDERS.filter((p) => p.isConfigured()).map((p) => p.name);
}

export async function generateWithFallback(req: GenerationRequest): Promise<GenerationResult> {
  const configured = PROVIDERS.filter((p) => p.isConfigured());

  if (configured.length === 0) {
    throw new Error(
      'No AI provider is configured. Set at least one of OPENROUTER_API_KEY, ' +
        'LOCAL_LLM_BASE_URL, OPENAI_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY.',
    );
  }

  const failures: string[] = [];

  for (const provider of configured) {
    try {
      console.log('[AI] Trying provider: %s', provider.name);
      const result = await provider.generate(req);
      console.log(
        '[AI] Provider %s succeeded (model: %s, chars: %d)',
        result.provider,
        result.model,
        result.document.length,
      );
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[AI] Provider %s failed: %s', provider.name, message);
      failures.push(`${provider.name}: ${message}`);
    }
  }

  throw new Error(`All configured AI providers failed — ${failures.join(' | ')}`);
}
