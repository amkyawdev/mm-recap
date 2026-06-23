# AmkyawDev Recap

**Edit, Recap, and Publish - All in One.**

A powerful video editing suite with AI-powered features for content creators. Built with Next.js, Appwrite, and modern cloud technologies.

## 🚀 Features

- **🎬 Video Editor** - Full-featured timeline with multi-track support
- **✨ AI Auto-Edit** - Smart editing powered by GPT-4 and Gemini
- **💬 Auto Subtitles** - Whisper-powered transcription with SRT/VTT export
- **🚀 One-Click Publish** - Direct upload to YouTube and TikTok
- **🌙 Dark/Light Mode** - Modern design with theme support
- **📱 PWA** - Installable as desktop and mobile app

## 📁 Project Structure

```
amkyawdev-recap-webapp/
├── apps/
│   ├── web/              # Next.js frontend
│   └── backend/          # Appwrite functions
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── tooling/              # Dev tools & scripts
├── .github/
│   └── workflows/        # CI/CD pipelines
└── docker-compose.yml    # Local dev services
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Radix UI |
| Backend | Appwrite Functions, Node.js |
| AI/ML | OpenAI GPT-4, Gemini, Whisper, ElevenLabs |
| Database | Appwrite Database |
| Storage | Appwrite Storage, S3/MinIO |
| Deployment | Vercel (Frontend), Appwrite Cloud (Backend) |
| CI/CD | GitHub Actions |
| Package Manager | pnpm |
| Build Tool | Turborepo |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker (for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amkyawdev/mm-recap.git
cd mm-recap
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
```

4. Start local services:
```bash
docker-compose up -d
```

5. Start development:
```bash
pnpm dev
```

### Environment Variables

See `.env.example` for required variables.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |
| `pnpm typecheck` | Run TypeScript checks |

## 🌐 Deployment

### Frontend (Vercel)

The frontend is deployed to Vercel via GitHub Actions on push to `main`.

Required secrets:
- `VERCEL_TOKEN`

### Backend (Appwrite)

Appwrite functions are deployed via GitHub Actions on changes to `apps/backend/`.

Required secrets:
- `APPWRITE_API_KEY`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ by [AmkyawDev](https://github.com/amkyawdev)
