# LSR Termo

Jogo de palavras estilo Termo/Wordle feito com React + TypeScript.

## 🎮 Como jogar

- Adivinhe a palavra de 5 letras em 6 tentativas
- Verde = letra certa no lugar certo
- Amarelo = letra certa no lugar errado
- Cinza = letra errada

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 💻 Rodar localmente

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
```

## 🎯 Funcionalidades

- Palavras aleatórias
- Salva progresso no navegador
- Teclado virtual e físico
- Botão Novo Jogo

## 📁 Estrutura

```
src/
├── components/     # Componentes React
├── utils/         # Funções auxiliares
├── config/        # Dicionário de palavras
└── constants.ts   # Configurações do jogo
```

## 🔧 Personalização

Edite `src/constants.ts`:
```ts
export const GAME_WORLD_LEN = 5;  // Tamanho da palavra
export const GAME_ROUNDS = 6;     // Número de tentativas
```

Adicione palavras em `src/config/allowed_words.json`
