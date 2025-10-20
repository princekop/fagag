# Aternos Dashboard

A modern, production-ready dashboard for managing Pterodactyl game servers with a beautiful UI and real-time features.

## 🚀 Features

- **User Authentication** - Secure login with NextAuth.js
- **Server Management** - Create, configure, and manage game servers
- **Real-time Monitoring** - Live server status and resource usage
- **Console Access** - Web-based server console
- **Beautiful UI** - Modern design with TailwindCSS and Radix UI
- **Responsive** - Works seamlessly on desktop and mobile
- **Production Ready** - Optimized for deployment with security best practices

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL or MySQL (production)
- Pterodactyl Panel with API access
- npm or yarn package manager

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd aternos-dashboard
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
PTERO_PANEL_URL="https://panel.example.com"
PTERO_API_KEY="your-api-key"
PTERO_CRED_KEY="your-32-char-encryption-key"
```

### 3. Setup Database

```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run validate` | Run type-check and lint |

## 🚢 Production Deployment

**See [PRODUCTION.md](./PRODUCTION.md) for comprehensive deployment guide.**

### Quick Deploy Options

#### Docker (Recommended)
```bash
docker-compose up -d
```

#### PM2
```bash
npm run build
pm2 start ecosystem.config.js
```

#### Vercel
```bash
vercel --prod
```

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **Animations**: Framer Motion, GSAP
- **Icons**: Tabler Icons, Lucide React

## 🔐 Security Features

- ✅ Environment validation at build time
- ✅ Secure session management
- ✅ Password encryption for stored credentials
- ✅ HTTPS enforcement in production
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Rate limiting ready
- ✅ SQL injection protection via Prisma

## 📊 Health Monitoring

Access the health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Response includes:
- Application status
- Database connectivity
- Environment validation
- Uptime metrics

## 🗂️ Project Structure

```
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── lib/          # Utility functions and configs
│   ├── hooks/        # Custom React hooks
│   └── types/        # TypeScript type definitions
├── prisma/           # Database schema and migrations
├── public/           # Static assets
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose setup
└── ecosystem.config.js # PM2 configuration
```

## 🔨 Development

### Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate:dev

# View database
npm run db:studio
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Validate everything
npm run validate
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Ensure database server is running
- Check migrations: `npm run db:migrate`

### Build Errors
- Run `npm run validate` to check for errors
- Clear build cache: `npm run clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set (min 32 characters)
- Check `NEXTAUTH_URL` matches your domain
- Ensure database adapter is configured

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Database connection string |
| `NEXTAUTH_URL` | ✅ | Application URL |
| `NEXTAUTH_SECRET` | ✅ | Session encryption key (32+ chars) |
| `PTERO_PANEL_URL` | ✅ | Pterodactyl panel URL |
| `PTERO_API_KEY` | ✅ | Pterodactyl application API key |
| `PTERO_CLIENT_API_KEY` | ✅ | Pterodactyl client API key |
| `PTERO_CRED_KEY` | ✅ | Encryption key (exactly 32 chars) |

See `.env.example` for complete list with descriptions.

## 📖 Documentation

- [Production Deployment Guide](./PRODUCTION.md) - Complete production setup
- [Console Features](./CONSOLE_FEATURES.md) - Server console documentation
- [Panel Features](./PANEL_FEATURES.md) - Panel functionality guide
- [WebSocket Troubleshooting](./WEBSOCKET_TROUBLESHOOTING.md) - Real-time feature issues

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Tabler Icons](https://tabler.io/icons) and [Lucide](https://lucide.dev/)

## 💬 Support

- 📧 Email: support@yourdomain.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourname/aternos-dashboard/issues)
- 📖 Docs: [Documentation](./PRODUCTION.md)

---

**Built with ❤️ using Next.js and TypeScript**
