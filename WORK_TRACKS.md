# 🚀 Beri ML - Parallel Work Tracks

**Project Start**: February 21, 2026
**Repository**: https://github.com/Hey-Salad/beri-ml
**Goal**: Build AI Team Development IDE with macOS build infrastructure

---

## 📊 **WORK ALLOCATION**

### **Track 1: AWS EC2 Mac Setup** ☁️
**Owner**: Claude (AI Agent)
**Status**: 🟡 Ready to Start
**Duration**: 2-3 hours
**Priority**: HIGH (Blocks Track 4)

#### **Tasks**:
- [ ] Launch AWS EC2 Mac2-m2 instance
- [ ] Run initial setup script (`mac-setup/setup-mac-builder.sh`)
- [ ] Install Xcode and accept license
- [ ] Configure iOS simulators
- [ ] Install HADP build agent
- [ ] Test with sample build

#### **Deliverables**:
- ✅ Running EC2 Mac instance
- ✅ Xcode 15.x installed
- ✅ iOS simulators configured
- ✅ HADP agent running
- ✅ Public IP address for connection

#### **Documentation**: [docs/SETUP_AWS_MAC.md](docs/SETUP_AWS_MAC.md)

---

### **Track 2: Beri ML IDE Core** 💻
**Owner**: GPU Agent (AI Developer)
**Status**: 🟡 Ready to Start
**Duration**: 1 week
**Priority**: HIGH (Can work in parallel)

#### **Tasks**:
- [ ] Fork VS Code OSS
- [ ] Build agent orchestrator system
- [ ] Implement 3-agent architecture (Cheri, Beri, Sheri)
- [ ] Create 9-pane editor layout
- [ ] Build Kanban board webview
- [ ] Implement team chat interface
- [ ] Add AI model router (Vertex AI + Ollama)
- [ ] Write unit tests
- [ ] Write integration tests

#### **Deliverables**:
- ✅ Working IDE extension
- ✅ 9 AI agents functioning
- ✅ Real-time collaboration UI
- ✅ Cost tracking system
- ✅ 80%+ test coverage

#### **Prompt**: [docs/GPU_AGENT_PROMPT.md](docs/GPU_AGENT_PROMPT.md)

**To start GPU agent, use this command**:
```bash
git clone https://github.com/Hey-Salad/beri-ml.git
cd beri-ml
cat docs/GPU_AGENT_PROMPT.md
# Then paste the system prompt to your GPU agent
```

---

### **Track 3: Apple Developer Setup** 🍎
**Owner**: Human (You)
**Status**: 🟡 Waiting for Action
**Duration**: 1 hour
**Priority**: MEDIUM (Needed before Track 4)

#### **Tasks**:
- [ ] Fill out Apple Developer credentials
- [ ] Export iOS Development certificate (.p12)
- [ ] Export iOS Distribution certificate (.p12)
- [ ] Download provisioning profiles
- [ ] Generate App Store Connect API key
- [ ] Upload to AWS Secrets Manager
- [ ] Share credentials securely

#### **Deliverables**:
- ✅ Filled `apple-config.yml`
- ✅ All certificates exported
- ✅ Provisioning profiles ready
- ✅ App Store Connect API key
- ✅ Uploaded to secure location

#### **Guide**: [docs/SETUP_APPLE_DEVELOPER.md](docs/SETUP_APPLE_DEVELOPER.md)

---

### **Track 4: Integration & Testing** 🧪
**Owner**: All (Collaborative)
**Status**: ⚪ Blocked (Waiting for Tracks 1-3)
**Duration**: 2-3 days
**Priority**: Final Integration

#### **Tasks**:
- [ ] Connect IDE to EC2 Mac
- [ ] Import Apple certificates on Mac
- [ ] Test agent code generation
- [ ] Test build pipeline (code → Mac → simulator)
- [ ] Test TestFlight deployment
- [ ] Optimize performance
- [ ] Create demo video
- [ ] Write documentation

#### **Deliverables**:
- ✅ End-to-end workflow working
- ✅ Test app deployed to TestFlight
- ✅ Documentation complete
- ✅ Demo video
- ✅ Cost analysis report

---

## 📅 **TIMELINE**

```
Week 1 (Feb 21-27):
├─ Day 1-2: Track 1 (AWS Mac) + Track 3 (Apple Dev)
├─ Day 2-7: Track 2 (IDE Core) - Parallel
└─ Day 7: All tracks ready for integration

Week 2 (Feb 28 - Mar 6):
├─ Day 1-2: Track 4 (Integration)
├─ Day 3-4: Testing & bug fixes
└─ Day 5-7: Polish, documentation, demo

Week 3 (Mar 7-13):
└─ Beta testing & launch 🚀
```

---

## 🎯 **MILESTONES**

### **Milestone 1: Infrastructure Ready** (Feb 23)
- ✅ EC2 Mac instance running
- ✅ Apple Developer credentials uploaded
- ✅ Build agent installed

### **Milestone 2: IDE Core Complete** (Feb 28)
- ✅ VS Code extension functional
- ✅ 9 AI agents working
- ✅ UI complete

### **Milestone 3: First Build** (Mar 2)
- ✅ AI generates code
- ✅ Code builds on Mac
- ✅ App runs in simulator

### **Milestone 4: TestFlight Deployment** (Mar 4)
- ✅ App deployed to TestFlight
- ✅ Can install on physical device

### **Milestone 5: Public Launch** (Mar 13)
- ✅ Documentation complete
- ✅ Demo video published
- ✅ GitHub repo public
- ✅ Blog post written

---

## 📞 **COMMUNICATION**

### **Daily Standup** (Async)
Post updates in this format:

```
## Update - [Date] - [Your Track]

### Completed Today:
- [x] Task 1
- [x] Task 2

### In Progress:
- [ ] Task 3 (50% done)

### Blockers:
- Need X from Track Y

### Tomorrow:
- Will complete task 3
- Start task 4
```

### **Contact Points**
- **Claude (Track 1)**: Via this conversation
- **GPU Agent (Track 2)**: Via API/prompt interface
- **Human (Track 3)**: You!
- **Coordination**: GitHub Issues

---

## 🚨 **BLOCKERS & DEPENDENCIES**

### **Current Blockers**:
- Track 4 blocked by Tracks 1, 2, 3
- None others currently

### **Dependencies**:
```
Track 1 (AWS Mac)
  ↓
Track 3 (Apple Dev)
  ↓
Track 4 (Integration)

Track 2 (IDE Core)
  ↓
Track 4 (Integration)
```

---

## 💰 **COST TRACKING**

| Item | Monthly Cost | Notes |
|------|--------------|-------|
| AWS EC2 Mac2-m2 | $1,800 | 24/7 availability |
| Google Vertex AI | $1,500-2,000 | AI model inference |
| Cloudflare | $50 | Workers + D1 + R2 |
| Redis (Upstash) | $50 | Job queue |
| **Total** | **$3,400-3,900** | With Ollama: $2,000-2,500 |

---

## 📚 **RESOURCES**

- **Main Repo**: https://github.com/Hey-Salad/beri-ml
- **AWS Mac Guide**: [docs/SETUP_AWS_MAC.md](docs/SETUP_AWS_MAC.md)
- **GPU Agent Prompt**: [docs/GPU_AGENT_PROMPT.md](docs/GPU_AGENT_PROMPT.md)
- **Apple Developer Guide**: [docs/SETUP_APPLE_DEVELOPER.md](docs/SETUP_APPLE_DEVELOPER.md)
- **VS Code API**: https://code.visualstudio.com/api
- **Vertex AI Docs**: https://cloud.google.com/vertex-ai/docs

---

## ✅ **CURRENT STATUS**

**Overall Progress**: 10% (Project setup complete)

**Track Status**:
- ✅ Track 0: Project Setup (100%)
- 🟡 Track 1: AWS Mac (0% - Ready)
- 🟡 Track 2: IDE Core (0% - Ready)
- 🟡 Track 3: Apple Dev (0% - Waiting)
- ⚪ Track 4: Integration (0% - Blocked)

**Next Actions**:
1. 🚀 **Claude**: Start Track 1 (AWS Mac setup)
2. 🤖 **GPU Agent**: Start Track 2 (IDE development)
3. 👤 **Human**: Complete Track 3 (Apple credentials)

---

**Last Updated**: February 21, 2026
**Project Phase**: Initialization Complete ✅
**Ready to Execute**: Yes! 🚀
