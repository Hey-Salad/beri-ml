# 🤖 GPU Agent Prompt - Beri ML IDE Development

**Track 2 - IDE Core Development**

**Assignee**: GPU Agent (AI Developer on dedicated GPU)
**Duration**: 1 week
**Goal**: Build the core Beri ML IDE with multi-agent collaboration system

---

## 🎯 **YOUR MISSION**

You are an AI developer tasked with building **Beri ML**, a revolutionary IDE where AI agents work together as a team. You will:

1. Fork VS Code OSS and customize it
2. Build an agent orchestration system
3. Implement 3 senior AI engineers (Cheri, Beri, Sheri), each with 3 juniors
4. Create a 9-pane editor layout
5. Build Kanban board, team chat, and office hours features

---

## 📋 **SYSTEM PROMPT**

```
You are an expert TypeScript developer building an AI-powered IDE called Beri ML.

CONTEXT:
Beri ML is an IDE where 3 AI engineers collaborate autonomously:
- Cheri-ML (Backend): APIs, databases, ML models
- Beri-ML (Frontend): UI/UX, React, design systems
- Sheri-ML (Full Stack): Integration, deployment, DevOps

Each has 3 junior developers:
1. Researcher - Reads docs, analyzes patterns
2. Developer - Writes production code
3. Tester - Creates tests, reviews code

YOUR TASK:
Build the core IDE system with:
- Agent orchestrator (manages 9 AI agents)
- Multi-pane editor (9 Monaco editors)
- Real-time collaboration (Socket.IO)
- Kanban board (task management)
- Team chat (agent communication)
- Office hours (scheduled discussions)

CONSTRAINTS:
- Use TypeScript strict mode
- Follow VS Code extension patterns
- Keep code modular and testable
- Focus on 5,000 line context limit per agent
- Optimize for real-time updates

TECH STACK:
- Base: VS Code OSS (Electron)
- Language: TypeScript
- UI: React + TailwindCSS
- Editor: Monaco Editor
- State: Zustand
- Real-time: Socket.IO
- AI APIs: OpenAI, Google, Anthropic, Cheri-ML

OUTPUT:
Provide production-ready code with:
- Comprehensive TypeScript types
- JSDoc comments
- Error handling
- Unit tests (Jest)
- Integration tests
- Performance optimizations
```

---

## 🏗️ **ARCHITECTURE TO BUILD**

### **1. Agent Orchestrator** (`agent-orchestrator.ts`)

**Purpose**: Manages 9 AI agents (3 seniors × 3 juniors each)

**Key Features**:
- Task queue and assignment
- Agent state management
- Model routing (Vertex AI, Ollama, direct APIs)
- Cost tracking
- Context management (5,000 line limit)

**Interface**:
```typescript
interface Agent {
  id: string;
  name: 'Cheri-ML' | 'Beri-ML' | 'Sheri-ML';
  role: string;
  juniors: Junior[];
  currentTask: Task | null;
  linesWorking: number;
  maxLines: 5000;
}

interface Junior {
  id: string;
  parentAgent: string;
  role: 'Research' | 'Coding' | 'Testing';
  model: AIModel;
  currentFile: string | null;
  context: string[];
  activity: string;
  status: 'idle' | 'working' | 'waiting';
}

class AgentOrchestrator {
  private agents: Map<string, Agent>;
  private taskQueue: Task[];

  async assignTask(task: Task): Promise<void>;
  async distributeToJuniors(agent: Agent, task: Task): Promise<void>;
  async commitChanges(agent: Agent, files: File[]): Promise<void>;
  async conductOfficeHours(): Promise<void>;
}
```

---

### **2. VS Code Extension** (`extensions/beri-ml-team/`)

**Purpose**: Main extension that integrates into VS Code

**Structure**:
```
extensions/beri-ml-team/
├── package.json              # Extension manifest
├── extension.ts              # Entry point
├── agent-orchestrator.ts     # Core orchestrator
├── agents/
│   ├── cheri-ml.ts          # Backend agent
│   ├── beri-ml.ts           # Frontend agent
│   └── sheri-ml.ts          # Full stack agent
├── models/
│   ├── model-router.ts      # AI model routing
│   ├── vertex-ai.ts         # Google Vertex AI
│   ├── ollama.ts            # Local Ollama
│   ├── openai-client.ts     # OpenAI API
│   ├── anthropic-client.ts  # Anthropic API
│   └── cheri-ml-client.ts   # Cheri-ML API
├── views/
│   ├── team-view.ts         # Agent status sidebar
│   ├── kanban-view.ts       # Task board
│   ├── chat-view.ts         # Team chat
│   └── editor-layout.ts     # 9-pane layout
├── utils/
│   ├── git-utils.ts         # Git operations
│   ├── file-utils.ts        # File operations
│   └── cost-tracker.ts      # Cost tracking
└── test/
    ├── orchestrator.test.ts
    ├── agents.test.ts
    └── views.test.ts
```

**Extension Manifest** (`package.json`):
```json
{
  "name": "beri-ml-team",
  "displayName": "Beri ML AI Team",
  "description": "AI agents that collaborate to build apps",
  "version": "0.1.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "activationEvents": [
    "onStartupFinished"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "beriml.startTeam",
        "title": "Beri ML: Start AI Team"
      },
      {
        "command": "beriml.assignTask",
        "title": "Beri ML: Assign Task to Team"
      },
      {
        "command": "beriml.officeHours",
        "title": "Beri ML: Conduct Office Hours"
      }
    ],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "beriml-sidebar",
          "title": "Beri ML Team",
          "icon": "resources/icon.svg"
        }
      ]
    },
    "views": {
      "beriml-sidebar": [
        {
          "id": "beriml-team-view",
          "name": "AI Team"
        },
        {
          "id": "beriml-kanban-view",
          "name": "Kanban Board",
          "type": "webview"
        },
        {
          "id": "beriml-chat-view",
          "name": "Team Chat",
          "type": "webview"
        }
      ]
    }
  }
}
```

---

### **3. Multi-Pane Editor Layout** (`views/editor-layout.ts`)

**Purpose**: Create 9-pane layout for agents

**Layout**:
```
┌─────────────┬─────────────┬─────────────┐
│  Cheri #1   │  Cheri #2   │  Cheri #3   │
│  Research   │  Coding     │  Testing    │
├─────────────┼─────────────┼─────────────┤
│  Beri #1    │  Beri #2    │  Beri #3    │
│  Research   │  Coding     │  Testing    │
├─────────────┼─────────────┼─────────────┤
│  Sheri #1   │  Sheri #2   │  Sheri #3   │
│  Research   │  Coding     │  Testing    │
└─────────────┴─────────────┴─────────────┘
```

**Implementation**:
```typescript
class EditorLayout {
  private editors: Map<string, vscode.TextEditor> = new Map();

  async create9PaneLayout(): Promise<void> {
    // Create 3 rows × 3 columns
    const agents = ['cheri', 'beri', 'sheri'];
    const roles = ['research', 'coding', 'testing'];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const editorId = `${agents[row]}-${roles[col]}`;
        const editor = await this.createEditor(editorId, row, col);
        this.editors.set(editorId, editor);
      }
    }
  }

  async updateEditor(editorId: string, content: string): Promise<void> {
    const editor = this.editors.get(editorId);
    if (editor) {
      await editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
          editor.document.positionAt(0),
          editor.document.positionAt(editor.document.getText().length)
        );
        editBuilder.replace(fullRange, content);
      });
    }
  }
}
```

---

### **4. Kanban Board** (`views/kanban-view.ts`)

**Purpose**: Visual task management

**Features**:
- 4 columns: Backlog, In Progress, Review, Done
- Drag & drop tasks
- Auto-assignment to agents
- Real-time updates

**Implementation**:
```typescript
class KanbanViewProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.html = this.getHtmlContent();

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async message => {
      switch (message.type) {
        case 'moveTask':
          await this.moveTask(message.taskId, message.column);
          break;
        case 'assignTask':
          await this.assignTask(message.taskId, message.agent);
          break;
      }
    });
  }

  private getHtmlContent(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .kanban-board {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
            }
            .column {
              background: #1e1e1e;
              padding: 16px;
              border-radius: 8px;
            }
            .task-card {
              background: #2d2d2d;
              padding: 12px;
              margin-bottom: 8px;
              border-radius: 4px;
              cursor: move;
            }
          </style>
        </head>
        <body>
          <div class="kanban-board">
            <div class="column" id="backlog">
              <h3>Backlog</h3>
              <div id="backlog-tasks"></div>
            </div>
            <div class="column" id="in-progress">
              <h3>In Progress</h3>
              <div id="in-progress-tasks"></div>
            </div>
            <div class="column" id="review">
              <h3>Review</h3>
              <div id="review-tasks"></div>
            </div>
            <div class="column" id="done">
              <h3>Done</h3>
              <div id="done-tasks"></div>
            </div>
          </div>
          <script>
            // Implement drag & drop
            // Send messages to extension via vscode.postMessage()
          </script>
        </body>
      </html>
    `;
  }
}
```

---

### **5. Team Chat** (`views/chat-view.ts`)

**Purpose**: Real-time agent communication

**Features**:
- Agent messages with avatars
- Typing indicators
- Office hours notifications
- Message history

**Implementation**:
```typescript
class ChatViewProvider implements vscode.WebviewViewProvider {
  private messages: ChatMessage[] = [];

  async sendMessage(agent: string, message: string): Promise<void> {
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      agent,
      message,
      timestamp: new Date()
    };

    this.messages.push(chatMessage);

    // Update webview
    if (this.webviewView) {
      this.webviewView.webview.postMessage({
        type: 'newMessage',
        message: chatMessage
      });
    }
  }

  async simulateOfficeHours(topic: string): Promise<void> {
    // Generate discussion using AI
    const discussion = await this.generateDiscussion(topic);

    for (const message of discussion) {
      await this.wait(2000); // 2 second delay
      await this.sendMessage(message.agent, message.text);
    }
  }
}
```

---

### **6. Model Router** (`models/model-router.ts`)

**Purpose**: Route requests to optimal AI provider

**Strategy**:
1. Try local Ollama first (if available and suitable)
2. Route through Google Vertex AI (cheaper)
3. Fallback to direct provider APIs

**Implementation**:
```typescript
class ModelRouter {
  async generate(request: ModelRequest): Promise<string> {
    // 1. Check if Ollama can handle locally
    if (await this.ollama.canHandle(request)) {
      return await this.ollama.generate(request);
    }

    // 2. Try Vertex AI (cheaper)
    try {
      return await this.vertexAI.generate(request);
    } catch (error) {
      // 3. Fallback to direct provider
      return await this.directProvider.generate(request);
    }
  }

  async trackCost(request: ModelRequest, tokens: number): Promise<void> {
    const cost = this.calculateCost(request.model, tokens);
    await this.costTracker.log({
      agent: request.agent,
      model: request.model,
      tokens,
      cost,
      timestamp: Date.now()
    });
  }
}
```

---

## 📝 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Setup (Day 1)**
- [ ] Fork VS Code OSS repository
- [ ] Set up TypeScript build system
- [ ] Create extension structure
- [ ] Add dependencies (Socket.IO, AI SDKs)
- [ ] Configure VS Code debugging

### **Phase 2: Core System (Days 2-3)**
- [ ] Implement Agent and Junior interfaces
- [ ] Build AgentOrchestrator class
- [ ] Create task queue system
- [ ] Add git integration utilities
- [ ] Implement 5,000 line context limit

### **Phase 3: UI Components (Days 4-5)**
- [ ] Create 9-pane editor layout
- [ ] Build Kanban board webview
- [ ] Implement team chat webview
- [ ] Add agent status sidebar
- [ ] Create office hours scheduler

### **Phase 4: AI Integration (Days 6-7)**
- [ ] Implement model router
- [ ] Add Vertex AI client
- [ ] Add Ollama integration
- [ ] Connect to Cheri-ML API
- [ ] Add cost tracking

### **Phase 5: Testing & Polish (Days 8-10)**
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Performance optimization
- [ ] Error handling
- [ ] Documentation

---

## 🧪 **TESTING REQUIREMENTS**

### **Unit Tests** (Jest)
```typescript
describe('AgentOrchestrator', () => {
  it('should assign backend tasks to Cheri-ML', () => {
    const orchestrator = new AgentOrchestrator();
    const task = { tags: ['backend', 'api'], title: 'Build auth API' };
    const agent = orchestrator.selectBestAgent(task);
    expect(agent.name).toBe('Cheri-ML');
  });

  it('should respect 5000 line limit', async () => {
    const agent = orchestrator.getAgent('cheri');
    agent.linesWorking = 4900;
    const canAcceptTask = orchestrator.canAcceptTask(agent, 200);
    expect(canAcceptTask).toBe(false);
  });
});
```

### **Integration Tests**
```typescript
describe('End-to-End Workflow', () => {
  it('should complete full task lifecycle', async () => {
    const orchestrator = new AgentOrchestrator();
    const task = { title: 'Build login form', tags: ['frontend', 'ui'] };

    await orchestrator.assignTask(task);

    // Wait for completion
    await waitFor(() => task.status === 'done', { timeout: 60000 });

    // Verify commit was created
    const commits = await git.log();
    expect(commits[0].message).toContain('Build login form');
  });
});
```

---

## 📊 **SUCCESS CRITERIA**

Your implementation will be considered successful when:

1. ✅ **All 9 agents run simultaneously**
2. ✅ **Tasks are automatically assigned**
3. ✅ **Code is generated and committed**
4. ✅ **UI updates in real-time**
5. ✅ **Cost tracking works**
6. ✅ **Tests pass (80%+ coverage)**
7. ✅ **Performance: <100ms UI updates**
8. ✅ **Memory: <500MB for orchestrator**

---

## 📚 **RESOURCES**

- **VS Code API**: https://code.visualstudio.com/api
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Google Vertex AI**: https://cloud.google.com/vertex-ai/docs
- **Ollama API**: https://github.com/ollama/ollama/blob/main/docs/api.md
- **Cheri-ML API**: See `/home/admin/Cheri-IDE/src/agent/cheriml-tools.ts`

---

## 🚀 **GETTING STARTED**

```bash
# 1. Clone VS Code OSS
git clone https://github.com/microsoft/vscode.git beri-ml-ide
cd beri-ml-ide

# 2. Install dependencies
yarn install

# 3. Create extension
mkdir -p extensions/beri-ml-team
cd extensions/beri-ml-team
npm init -y
npm install --save-dev @types/vscode @types/node typescript

# 4. Start coding!
code .

# 5. Test extension
# Press F5 in VS Code to launch Extension Development Host
```

---

## 💬 **COMMUNICATION PROTOCOL**

Report progress every 24 hours:

**Format**:
```
## Progress Update - Day X

### Completed:
- [x] Task 1
- [x] Task 2

### In Progress:
- [ ] Task 3 (60% done)

### Blockers:
- Issue with X (need Y to proceed)

### Next 24h:
- Plan to complete tasks 3-5

### Questions:
- How should we handle Z?
```

---

## 🎯 **FINAL DELIVERABLE**

Submit a pull request to the `beri-ml` repository with:

1. ✅ All source code in `ide/extensions/beri-ml-team/`
2. ✅ Tests in `ide/extensions/beri-ml-team/test/`
3. ✅ Documentation in `docs/`
4. ✅ Demo video (optional but recommended)
5. ✅ Cost analysis report

---

## 🏆 **BONUS FEATURES** (Optional)

If you complete early, consider adding:

- [ ] **Voice mode** - Agents speak via text-to-speech
- [ ] **Agent avatars** - Animated avatars in chat
- [ ] **Performance dashboard** - Real-time metrics
- [ ] **Custom agents** - Allow users to add their own agents
- [ ] **Google Workspace integration** - Export to Docs/Sheets/Slides

---

## ✅ **READY TO START?**

Clone the repository and begin building!

```bash
git clone https://github.com/Hey-Salad/beri-ml.git
cd beri-ml
# Start coding! 🚀
```

**Estimated Time**: 7-10 days
**Difficulty**: Advanced
**Impact**: Revolutionary

Good luck, GPU Agent! Build something amazing! 🎨✨
