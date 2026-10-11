import { BaseLlm, type LlmRequest, type LlmResponse } from '@google/adk';

function getText(value: unknown): string {
  if (typeof value === 'string') return value;

  if (value && typeof value === 'object' && 'parts' in value) {
    const parts = value.parts;
    if (Array.isArray(parts)) {
      return parts.map((part) => part.text ?? '').join('\n');
    }
  }

  return '';
}

export class OllamaModel extends BaseLlm {
  constructor(
    model: string,
    private readonly baseUrl = 'http://localhost:11434',
  ) {
    super({ model });
  }

  async *generateContentAsync(
    request: LlmRequest,
    _stream = false,
    abortSignal?: AbortSignal,
  ): AsyncGenerator<LlmResponse> {
    if (Object.keys(request.toolsDict).length > 0) {
      throw new Error('Esta primeira versão ainda não traduz chamadas de ferramentas.');
    }

    const messages = [
      ...(request.config?.systemInstruction
        ? [{ role: 'system', content: getText(request.config.systemInstruction) }]
        : []),
      ...request.contents.map((content) => ({
        role: content.role === 'model' ? 'assistant' : 'user',
        content: getText(content),
      })),
    ];

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortSignal,
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama respondeu com HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      message?: { content?: string };
    };

    yield {
      content: {
        role: 'model',
        parts: [{ text: data.message?.content ?? '' }],
      },
    };
  }

  async connect(): Promise<never> {
    throw new Error('Conexão de áudio/vídeo em tempo real não configurada.');
  }
}