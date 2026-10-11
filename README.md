# My Agent

Pequeno projeto de estudo do Google Agent Development Kit (ADK) em TypeScript. Ele contém dois exemplos independentes: um agente com Gemini e uma ferramenta de horário simulada, e um agente local com Ollama.

## Requisitos

- Node.js 24.13 ou superior e npm 11.8 ou superior
- Para o agente local: Ollama em execução com o modelo `qwen2.5-coder:7b` instalado
- Para o exemplo com Gemini: uma chave da API Gemini em `GEMINI_API_KEY`

## Instalação

```bash
npm install
```

Crie um arquivo `.env` na raiz somente se for testar o agente Gemini:

```dotenv
GEMINI_API_KEY=sua_chave_aqui
```

O `.env` é ignorado pelo Git. O agente local usa a API do Ollama em `http://localhost:11434` e não precisa de chave de API.

## Executar o agente local

Em outro terminal, confirme que o Ollama está acessível e que o modelo existe:

```bash
curl http://localhost:11434/api/version
ollama list
```

Então execute, na raiz do projeto:

```bash
npx @google/adk-devtools run agents/hero-agent/spiderman-agent.ts
```

Para abrir a interface de desenvolvimento:

```bash
npx @google/adk-devtools web agents/hero-agent/spiderman-agent.ts
```

O agente está definido em `agents/hero-agent/spiderman-agent.ts`. A classe `OllamaModel`, em `agents/models/ollama/ollama.model.ts`, adapta mensagens de texto do ADK para `POST /api/chat` do Ollama. Ela usa `stream: false` e ainda não implementa chamadas de ferramentas, acesso à internet, áudio/vídeo em tempo real ou streaming. O Ollama precisa estar ativo para que o agente responda.

## Executar o exemplo com Gemini

```bash
npx @google/adk-devtools run agents/time-agent/agent.ts
```

Esse exemplo usa `gemini-flash-latest` e uma ferramenta `get_current_time` de demonstração. A ferramenta retorna sempre o texto fixo `10:30 AM`; ela não consulta a hora real.

## Estrutura

```text
agents/
  hero-agent/spiderman-agent.ts  # agente com Ollama local
  models/ollama/ollama.model.ts   # adaptador ADK → Ollama
  time-agent/agent.ts             # exemplo Gemini com ferramenta simulada
```

## Referências

- [ADK para TypeScript](https://adk.dev/get-started/typescript/)
- [Modelos Ollama no ADK](https://adk.dev/agents/models/ollama/) — os exemplos com `LiteLlm` dessa página são para Python
- [API de chat do Ollama](https://docs.ollama.com/api)
