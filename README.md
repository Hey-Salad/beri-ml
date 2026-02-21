# 🎨 Beri ML - AI Team Development IDE

**Beri ML** is a revolutionary IDE where AI developers work together as a team to build applications autonomously. Watch Cheri-ML (Backend), Beri-ML (Frontend), and Sheri-ML (Full Stack) collaborate in real-time with human oversight.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built by HeySalad](https://img.shields.io/badge/Built%20by-HeySalad-orange)](https://heysalad.com)

---

## 🌟 **Vision**

Imagine VS Code where 3 AI engineers work alongside you:
- **Cheri-ML** 🧠 - ML/Backend Engineer (APIs, databases, ML models)
- **Beri-ML** 🎨 - UX/Frontend Engineer (UI/UX, React, design systems)
- **Sheri-ML** ⚡ - Full Stack Developer (Integration, deployment, DevOps)

Each has 3 junior developers:
1. **Researcher** - Reads docs, analyzes patterns, suggests architectures
2. **Developer** - Writes production code
3. **Tester** - Creates tests, reviews code, ensures quality

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Beri ML IDE (VS Code Fork)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👨‍💻 Cheri-ML          🎨 Beri-ML           👩‍💻 Sheri-ML          │
│  Backend Engineer    Frontend Engineer   Full Stack Dev       │
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     │
│  │ Junior 1 📖 │     │ Junior 1 📖 │     │ Junior 1 📖 │     │
│  │ Research    │     │ Research    │     │ Research    │     │
│  ├─────────────┤     ├─────────────┤     ├─────────────┤     │
│  │ Junior 2 💻 │     │ Junior 2 💻 │     │ Junior 2 💻 │     │
│  │ Coding      │     │ Coding      │     │ Coding      │     │
│  ├─────────────┤     ├─────────────┤     ├─────────────┤     │
│  │ Junior 3 ✅ │     │ Junior 3 ✅ │     │ Junior 3 ✅ │     │
│  │ Testing     │     │ Testing     │     │ Testing     │     │
│  └─────────────┘     └─────────────┘     └─────────────┘     │
│                                                                 │
│  Status: Working on auth    Designing login    Integrating    │
│  Lines: 1,247/5,000         Lines: 892/5,000   Lines: 1,456   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ **Key Features**

### **1. Multi-Agent Collaboration**
- 3 senior AI engineers, each with 3 junior assistants
- Real-time collaboration with human oversight
- Autonomous task distribution via Kanban board

### **2. Live Team Chat**
- Agents discuss features, bugs, and architecture
- Scheduled "Office Hours" every 2 hours
- Natural conversation powered by Gemini 3.0

### **3. 9-Pane Editor**
- Each junior dev has their own editor pane
- Watch them research, code, and test simultaneously
- 5,000 line focus limit per agent for quality

### **4. Human Approval Workflow**
- All AI-generated code requires approval
- Side-by-side diff view
- Live simulator preview for mobile apps

### **5. Integrated Build Pipeline**
- AWS EC2 Mac fleet for iOS/macOS builds
- Live iPhone simulator streaming in browser
- One-click deployment to TestFlight

### **6. Cost-Optimized AI**
- Google Vertex AI for 60-80% cost reduction
- Ollama integration for local inference
- Smart model routing (local vs cloud)

---

## 🛠️ **Tech Stack**

### **IDE Core**
- **Base**: VS Code OSS (Electron + Monaco Editor)
- **Language**: TypeScript
- **UI**: React + TailwindCSS
- **State**: Zustand
- **Real-time**: Socket.IO

### **AI Models**
- **Cheri-ML**: Custom fine-tuned Deepseek 1.3B
- **Google Gemini**: 3.0 Flash & Pro (research, voice, multimodal)
- **OpenAI**: GPT-4 Turbo (frontend coding)
- **Anthropic**: Claude 3.5 Sonnet (code review)
- **Ollama**: Local models (Mixtral, Llama3, Phi3)

### **Infrastructure**
- **Build Servers**: AWS EC2 Mac2-m2 (M2 chip)
- **API Gateway**: Cloudflare Workers
- **Database**: Cloudflare D1 + Supabase
- **Storage**: Cloudflare R2
- **Queue**: BullMQ + Redis

---

## 📦 **Project Structure**

```
beri-ml/
├── ide/                          # VS Code fork
│   ├── extensions/
│   │   └── beri-ml-team/        # Main extension
│   │       ├── agent-orchestrator.ts
│   │       ├── agents/
│   │       │   ├── cheri-ml.ts
│   │       │   ├── beri-ml.ts
│   │       │   └── sheri-ml.ts
│   │       ├── views/
│   │       │   ├── team-view.ts
│   │       │   ├── kanban-view.ts
│   │       │   └── chat-view.ts
│   │       └── models/
│   │           ├── model-router.ts
│   │           ├── vertex-ai.ts
│   │           ├── ollama.ts
│   │           └── cheri-ml-client.ts
│   └── package.json
│
├── backend/                      # API & Orchestration
│   ├── src/
│   │   ├── api/                 # REST API
│   │   ├── agents/              # Agent logic
│   │   ├── build/               # Build pipeline
│   │   └── models/              # AI model integrations
│   └── wrangler.toml
│
├── mac-setup/                    # AWS EC2 Mac configuration
│   ├── setup-mac-builder.sh    # Initial setup script
│   ├── install-xcode.sh        # Xcode installation
│   ├── configure-simulators.sh # Simulator setup
│   ├── hadp-agent/             # Build agent daemon
│   └── README.md
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── AGENTS.md
│   ├── SETUP_AWS_MAC.md
│   ├── SETUP_APPLE_DEVELOPER.md
│   └── GPU_AGENT_PROMPT.md
│
├── scripts/                      # Utility scripts
│   ├── deploy.sh
│   ├── test.sh
│   └── cost-report.sh
│
└── README.md                     # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20+
- Git
- AWS Account (for EC2 Mac)
- Apple Developer Account
- Google Cloud Account (for Vertex AI)
- API Keys: OpenAI, Anthropic, Cheri-ML

### **1. Clone Repository**
```bash
git clone https://github.com/Hey-Salad/beri-ml.git
cd beri-ml
```

### **2. Install Dependencies**
```bash
# Install IDE dependencies
cd ide
npm install

# Install backend dependencies
cd ../backend
npm install
```

### **3. Configure Environment**
```bash
# Copy example env file
cp .env.example .env

# Add your API keys
nano .env
```

### **4. Start Development**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start IDE
cd ide
npm run watch

# Terminal 3: Launch Electron
cd ide
npm run electron
```

---

## 🏗️ **Setup Tracks (Parallel Execution)**

### **Track 1: AWS EC2 Mac Setup** ☁️
**Assignee**: Claude Agent
**Duration**: 2-3 hours
**Steps**:
1. Launch EC2 Mac2-m2 instance
2. Run `mac-setup/setup-mac-builder.sh`
3. Install Xcode and simulators
4. Configure build agent
5. Test with simple iOS build

**📖 Guide**: [docs/SETUP_AWS_MAC.md](docs/SETUP_AWS_MAC.md)

---

### **Track 2: Beri ML IDE Core** 💻
**Assignee**: GPU Agent (You or another AI)
**Duration**: 1 week
**Steps**:
1. Fork VS Code OSS
2. Build agent orchestrator system
3. Implement 3-agent architecture
4. Create 9-pane editor UI
5. Add Kanban board and chat interface

**📖 Prompt**: [docs/GPU_AGENT_PROMPT.md](docs/GPU_AGENT_PROMPT.md)

---

### **Track 3: Apple Developer Setup** 🍎
**Assignee**: Human (You)
**Duration**: 1 hour
**Required**:
- [ ] Apple Developer Account credentials
- [ ] Code signing certificates (.p12)
- [ ] Provisioning profiles
- [ ] App Store Connect API key
- [ ] Team ID and Bundle ID

**📖 Guide**: [docs/SETUP_APPLE_DEVELOPER.md](docs/SETUP_APPLE_DEVELOPER.md)

---

### **Track 4: Integration & Testing** 🧪
**Assignee**: All (Collaborative)
**Duration**: 2-3 days
**Steps**:
1. Connect IDE to EC2 Mac build servers
2. Test agent code generation → build → simulator
3. Deploy test app to TestFlight
4. Optimize and polish

---

## 💰 **Cost Estimate**

| Component | Monthly Cost |
|-----------|--------------|
| AWS EC2 Mac2-m2 (24/7) | $1,800 |
| Google Vertex AI | $1,500-2,000 |
| Cloudflare (Workers + D1 + R2) | $50 |
| Redis (Upstash) | $50 |
| **Total** | **~$3,400-3,900/month** |

**With Ollama optimization**: ~$2,000-2,500/month

**Compare to**:
- 3 developers × $100k/year = $25k/month
- **Savings**: 90%+ 🎉

---

## 📊 **Model Selection Strategy**

| Task | Agent | Model | Provider | Cost/1M | Reason |
|------|-------|-------|----------|---------|--------|
| Backend Research | Cheri Junior 1 | Gemini Flash | Vertex AI | $0.075 | Fast & cheap |
| Backend Coding | Cheri Junior 2 | Cheri-ML 1.3B | HeySalad | $0.10 | Custom trained |
| Backend Testing | Cheri Junior 3 | Claude 3.5 | Vertex AI | $3.00 | Thorough |
| Frontend Research | Beri Junior 1 | Gemini Pro | Vertex AI | $1.25 | Multimodal |
| Frontend Coding | Beri Junior 2 | GPT-4 Turbo | Vertex AI | $10.00 | Best at React |
| Frontend Testing | Beri Junior 3 | Claude 3.5 | Vertex AI | $3.00 | UI testing |
| Integration Research | Sheri Junior 1 | Gemini Flash | Vertex AI | $0.075 | Fast docs |
| Integration Coding | Sheri Junior 2 | GPT-4 Turbo | Vertex AI | $10.00 | Versatile |
| DevOps/Deploy | Sheri Junior 3 | Claude Opus | Direct | $15.00 | System-level |

---

## 🎯 **Roadmap**

### **Phase 1: Foundation** (Week 1-2) ✅
- [x] Project setup
- [x] GitHub repository created
- [ ] AWS EC2 Mac instance launched
- [ ] Basic agent orchestrator
- [ ] Simple 3-agent system

### **Phase 2: Core IDE** (Week 3-4)
- [ ] Fork VS Code OSS
- [ ] 9-pane editor layout
- [ ] Team chat interface
- [ ] Kanban board
- [ ] Office hours scheduler

### **Phase 3: AI Integration** (Week 5-6)
- [ ] Cheri-ML API integration
- [ ] Google Vertex AI routing
- [ ] Ollama local models
- [ ] Model cost tracking
- [ ] Smart routing logic

### **Phase 4: Build Pipeline** (Week 7-8)
- [ ] EC2 Mac build agent
- [ ] Simulator streaming
- [ ] TestFlight deployment
- [ ] Code signing automation
- [ ] CI/CD workflows

### **Phase 5: Polish & Launch** (Week 9-10)
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Documentation
- [ ] Beta testing
- [ ] Public release 🚀

---

## 🤝 **Contributing**

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **VS Code Team** - For the amazing open source IDE
- **OpenAI** - For GPT models
- **Google** - For Gemini and Vertex AI
- **Anthropic** - For Claude models
- **HeySalad Team** - For Cheri-ML and infrastructure

---

## 📞 **Support**

- **Website**: [heysalad.com](https://heysalad.com)
- **Email**: support@heysalad.com
- **Discord**: [Join our community](https://discord.gg/heysalad)
- **Issues**: [GitHub Issues](https://github.com/Hey-Salad/beri-ml/issues)

---

## 🌟 **Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=Hey-Salad/beri-ml&type=Date)](https://star-history.com/#Hey-Salad/beri-ml&Date)

---

**Built with ❤️ by HeySalad Inc. • San Francisco, CA**
