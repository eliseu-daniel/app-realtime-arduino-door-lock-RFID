# Controle de Acesso - Arduino App

Aplicativo mobile para controle de acesso com Arduino, RFID e WebSocket. Permite monitorar leituras de tags, controlar portão remotamente e visualizar logs de acesso.

## Funcionalidades

- **Autenticação** — Login e cadastro de usuários via API REST
- **Painel em tempo real** — Eventos do portão via WebSocket (tag lida, acesso permitido/negado, portão aberto/fechado)
- **Controle remoto** — Abrir e fechar portão diretamente pelo app
- **Dispositivos** — Gerenciamento dos dispositivos Arduino cadastrados (admin)
- **Logs de acesso** — Histórico paginado de todos os eventos

## Stack

- **React Native 0.81** com **Expo SDK 54**
- **TypeScript**
- **WebSocket** para eventos em tempo real
- **REST API** para autenticação, dispositivos e logs

## Requisitos

- Node.js 18+
- Expo CLI
- Dispositivo físico ou emulador

## Configuração

1. Clone o repositório:

```bash
git clone <repo-url>
cd arduino-app-saulo
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as URLs do seu servidor:

```env
API_URL=http://SEU_IP:3000/api
WS_URL=ws://SEU_IP:3000
```

4. Inicie o app:

```bash
npx expo start
```

## API

O app consome uma API REST e WebSocket. Endpoints disponíveis:

### Autenticação
- `POST /auth/register` — Cadastro de usuário
- `POST /auth/login` — Login
- `GET /auth/me` — Dados do usuário autenticado

### Dispositivos
- `GET /devices` — Listar dispositivos
- `POST /devices` — Criar dispositivo (admin)
- `PUT /devices/:id` — Atualizar dispositivo (admin)
- `DELETE /devices/:id` — Remover dispositivo (admin)

### Logs
- `GET /logs` — Listar logs (paginado)
- `GET /logs/:id` — Log específico
- `GET /logs/device/:deviceId` — Logs por dispositivo
- `GET /logs/user/:userId` — Logs por usuário

### WebSocket
- Conectar em `ws://localhost:3000`
- Autenticar com `{ "event": "AUTHENTICATE", "token": "<jwt>" }`
- Eventos: `TAG_LIDA`, `ACESSO_PERMITIDO`, `ACESSO_NEGADO`, `PORTAO_ABERTO`, `PORTAO_FECHADO`

## Estrutura

```
├── .env                     # Variáveis de ambiente
├── app.config.ts            # Configuração do Expo
├── index.ts                 # Entry point
├── src/
│   ├── App.tsx              # Navegação e auth
│   ├── config/env.ts        # Leitura de env vars
│   ├── contexts/            # Contextos React
│   ├── hooks/               # Hooks customizados
│   ├── screens/             # Telas do app
│   ├── services/            # API e WebSocket
│   └── styles/              # Estilos
└── package.json
```
