# 🤖 AI Coding Models Reference Guide

**Last Updated**: February 2026
**Purpose**: Comprehensive reference for selecting AI coding models in Beri ML

---

## 📊 **Quick Summary**

| Category | Count | Best Pick |
|----------|-------|-----------|
| Open Source (Local) | 25+ | DeepSeek Coder V2 / Qwen3 Coder |
| Open Source (Small/On-device) | 10+ | Gemma 3n / Phi-4 Mini |
| Commercial APIs | 15+ | Claude 3.5 Sonnet / GPT-4o |
| Specialized (Code only) | 8+ | Codestral / StarCoder2 |

---

## 🔓 **OPEN SOURCE CODING MODELS**

### **Google Models**

| Model | Size | Context | Coding Score | VRAM | Access | Strengths | License |
|-------|------|---------|-------------|------|--------|-----------|---------|
| **Gemma 3n E2B** | 2B active (5B total) | 32K | Good | 4GB | Ollama, HF, Kaggle | On-device, multimodal (audio/image/video/text), mobile-first | Apache 2.0 |
| **Gemma 3n E4B** | 4B active (8B total) | 32K | Very Good | 6GB | Ollama, HF, Kaggle | Best-in-class on-device, multimodal, nested submodel for quality/speed tradeoff | Apache 2.0 |
| **Gemma 3 1B** | 1B | 32K | Basic | 2GB | Ollama, HF | Ultra-lightweight, edge/mobile | Apache 2.0 |
| **Gemma 3 4B** | 4B | 128K | Good | 6GB | Ollama, HF | Multimodal, long context | Apache 2.0 |
| **Gemma 3 12B** | 12B | 128K | Great | 12GB | Ollama, HF | Balanced size/performance | Apache 2.0 |
| **Gemma 3 27B** | 27B | 128K | Excellent | 20GB | Ollama, HF | Best open Google model | Apache 2.0 |
| **CodeGemma 2B** | 2B | 8K | Good | 4GB | Ollama, HF | Code completion, fill-in-middle | Apache 2.0 |
| **CodeGemma 7B** | 7B | 8K | Very Good | 8GB | Ollama, HF | Code generation and chat | Apache 2.0 |

> **Gemma 3n Special Note**: Uses "Per-Layer Embeddings" (PLE) technique for extreme efficiency. A 5B total parameter model runs with only 2B active at a time. First Google model supporting audio, image, video AND text natively. Designed for phones/edge devices.

---

### **DeepSeek Models** 🔥 (Top Performers)

| Model | Size | Context | HumanEval | VRAM | Access | Strengths | License |
|-------|------|---------|-----------|------|--------|-----------|---------|
| **DeepSeek-Coder 1.3B** | 1.3B | 16K | 65.2% | 3GB | Ollama, HF | Tiny, fast, surprisingly capable | MIT |
| **DeepSeek-Coder 6.7B** | 6.7B | 16K | 78.6% | 8GB | Ollama, HF | Best small coder | MIT |
| **DeepSeek-Coder 33B** | 33B | 16K | 79.3% | 24GB | Ollama, HF | Top open-source coder (old gen) | MIT |
| **DeepSeek-Coder-V2 Lite** | 16B (2.4B active) | 128K | 81.1% | 8GB | Ollama, HF | MoE efficiency, long context | DeepSeek |
| **DeepSeek-Coder-V2** | 236B (21B active) | 128K | 90.2% | 40GB | HF, API | State-of-art, MoE architecture | DeepSeek |
| **DeepSeek-R1 Distill Coder 7B** | 7B | 128K | 82.3% | 8GB | Ollama, HF | Reasoning + coding | MIT |
| **DeepSeek-R1 Distill Coder 14B** | 14B | 128K | 86.7% | 14GB | Ollama, HF | Best mid-size reasoning coder | MIT |
| **DeepSeek-R1** | 671B (37B active) | 128K | 92.1% | 80GB+ | API, HF | Best reasoning overall | MIT |

---

### **Qwen (Alibaba) Models** 🔥 (Trending)

| Model | Size | Context | HumanEval | VRAM | Access | Strengths | License |
|-------|------|---------|-----------|------|--------|-----------|---------|
| **Qwen2.5-Coder 0.5B** | 0.5B | 32K | 61.6% | 2GB | Ollama, HF | Ultra-tiny, mobile | Apache 2.0 |
| **Qwen2.5-Coder 1.5B** | 1.5B | 32K | 69.2% | 3GB | Ollama, HF | Small but capable | Apache 2.0 |
| **Qwen2.5-Coder 3B** | 3B | 32K | 74.1% | 4GB | Ollama, HF | Great for constrained hardware | Apache 2.0 |
| **Qwen2.5-Coder 7B** | 7B | 128K | 88.4% | 8GB | Ollama, HF | Best 7B coder overall | Apache 2.0 |
| **Qwen2.5-Coder 14B** | 14B | 128K | 89.9% | 14GB | Ollama, HF | Top 14B coding model | Apache 2.0 |
| **Qwen2.5-Coder 32B** | 32B | 128K | 92.7% | 24GB | Ollama, HF | Rivals GPT-4 on coding | Apache 2.0 |
| **Qwen3-Coder 30B A3B** | 30B (3B active) | 256K | ~93% | 8GB | Ollama, HF | MoE, massive context window | Apache 2.0 |
| **Qwen3-Coder-Next (80B)** | 80B | 256K | ~95% | 40GB | Ollama, HF | Cutting-edge, rivals GPT-4o | Apache 2.0 |

> **Qwen3 Coder Special Note**: Qwen3-Coder-Next is a ~80B MoE model currently trending as the top open-source coding model. The 30B variant uses only 3B active parameters (MoE), making it extremely efficient.

---

### **Meta (Llama) Models**

| Model | Size | Context | HumanEval | VRAM | Access | Strengths | License |
|-------|------|---------|-----------|------|--------|-----------|---------|
| **Code Llama 7B** | 7B | 16K | 36.0% | 8GB | Ollama, HF | Veteran, widely supported | Llama 2 |
| **Code Llama 13B** | 13B | 16K | 42.9% | 12GB | Ollama, HF | Good for code completion | Llama 2 |
| **Code Llama 34B** | 34B | 16K | 48.8% | 24GB | Ollama, HF | Solid mid-size | Llama 2 |
| **Code Llama 70B** | 70B | 100K | 53.0% | 40GB | Ollama, HF | Best legacy Llama code | Llama 2 |
| **Llama 3.1 8B** | 8B | 128K | ~68% | 8GB | Ollama, HF | General + code, long context | Llama 3 |
| **Llama 3.1 70B** | 70B | 128K | ~80% | 40GB | Ollama, HF | Very strong all-rounder | Llama 3 |
| **Llama 3.3 70B** | 70B | 128K | ~84% | 40GB | Ollama, HF | Latest Llama, strong coding | Llama 3 |

---

### **Mistral Models**

| Model | Size | Context | HumanEval | VRAM | Access | Strengths | License |
|-------|------|---------|-----------|------|--------|-----------|---------|
| **Codestral 22B** | 22B | 32K | 81.1% | 16GB | Ollama, HF, API | Mistral's dedicated code model | Custom |
| **Codestral Mamba 7B** | 7B | Unlimited* | 78.2% | 8GB | HF | Mamba architecture, infinite context | Apache 2.0 |
| **Devstral 24B** | 24B | 128K | ~85% | 18GB | Ollama, HF | Latest, agentic coding tasks | Apache 2.0 |
| **Mistral 7B** | 7B | 32K | ~65% | 8GB | Ollama, HF | Fast, versatile | Apache 2.0 |
| **Mixtral 8x7B** | 47B (13B active) | 32K | ~74% | 24GB | Ollama, HF | MoE, strong coding | Apache 2.0 |
| **Mixtral 8x22B** | 141B (39B active) | 65K | ~82% | 48GB | HF | Large MoE powerhouse | Apache 2.0 |

---

### **Microsoft Phi Models**

| Model | Size | Context | HumanEval | VRAM | Access | Strengths | License |
|-------|------|---------|-----------|------|--------|-----------|---------|
| **Phi-3 Mini 3.8B** | 3.8B | 128K | 70.9% | 4GB | Ollama, HF | Tiny but mighty, long context | MIT |
| **Phi-3 Small 7B** | 7B | 128K | 78.0% | 8GB | Ollama, HF | Strong for size | MIT |
| **Phi-3 Medium 14B** | 14B | 128K | 84.0% | 14GB | Ollama, HF | Best Phi for coding | MIT |
| **Phi-3.5 Mini** | 3.8B | 128K | 78.6% | 4GB | Ollama, HF | Improved Phi-3 Mini | MIT |
| **Phi-4 14B** | 14B | 16K | 82.6% | 14GB | Ollama, HF | Strong at reasoning & code | MIT |
| **Phi-4 Mini 3.8B** | 3.8B | 128K | 75.3% | 4GB | Ollama, HF | Latest tiny Phi | MIT |

---

### **StarCoder / BigCode Models**

| Model | Size | Context | HumanEval | VRAM | Access | Strengths | License |
|-------|------|---------|-----------|------|--------|-----------|---------|
| **StarCoder2 3B** | 3B | 16K | 31.7% | 4GB | Ollama, HF | Small, transparent training | Apache 2.0 |
| **StarCoder2 7B** | 7B | 16K | 35.5% | 8GB | Ollama, HF | Mid-size, 600+ languages | Apache 2.0 |
| **StarCoder2 15B** | 15B | 16K | 46.3% | 12GB | Ollama, HF | Best StarCoder, 600+ langs | Apache 2.0 |

---

### **IBM Granite Models**

| Model | Size | Context | HumanEval | VRAM | Access | Strengths | License |
|-------|------|---------|-----------|------|--------|-----------|---------|
| **Granite Code 3B** | 3B | 128K | 38.4% | 4GB | Ollama, HF | Enterprise, Apache licensed | Apache 2.0 |
| **Granite Code 8B** | 8B | 128K | 57.7% | 8GB | Ollama, HF | Enterprise + code agents | Apache 2.0 |
| **Granite Code 20B** | 20B | 8K | 60.8% | 16GB | Ollama, HF | IBM enterprise grade | Apache 2.0 |
| **Granite Code 34B** | 34B | 8K | 76.4% | 24GB | Ollama, HF | Best IBM model | Apache 2.0 |

---

### **Other Notable Open Source Models**

| Model | Creator | Size | Context | HumanEval | VRAM | Access | License |
|-------|---------|------|---------|-----------|------|--------|---------|
| **WizardCoder 33B** | WizardLM | 33B | 16K | 79.9% | 24GB | HF | Llama 2 |
| **MagicCoder 7B** | AISE | 7B | 16K | 70.7% | 8GB | HF | Apache 2.0 |
| **CodeGeeX4 9B** | Zhipu AI | 9B | 128K | ~72% | 10GB | Ollama, HF | MIT |
| **Yi-Coder 1.5B** | 01.AI | 1.5B | 128K | 65.9% | 3GB | HF | Apache 2.0 |
| **Yi-Coder 9B** | 01.AI | 9B | 128K | 85.4% | 10GB | HF | Apache 2.0 |
| **OpenCoder 8B** | INFLY | 8B | 128K | 83.5% | 8GB | HF | Apache 2.0 |
| **Artigenz-Coder 33B** | Artigenz | 33B | 16K | 79.1% | 24GB | HF | Llama 2 |
| **Nxcode-CQ 7B** | NTQAI | 7B | 16K | 83.7% | 8GB | HF | Apache 2.0 |

---

## 💼 **COMMERCIAL / PROPRIETARY MODELS**

### **OpenAI Models**

| Model | Size | Context | Coding Notes | Cost (Input) | Cost (Output) | Access |
|-------|------|---------|-------------|-------------|--------------|--------|
| **GPT-4o** | Unknown | 128K | Excellent all-around coding | $2.50/1M | $10/1M | API, ChatGPT |
| **GPT-4o mini** | Unknown | 128K | Fast, cheap, surprisingly good | $0.15/1M | $0.60/1M | API, ChatGPT |
| **o1** | Unknown | 200K | Deep reasoning, complex algorithms | $15/1M | $60/1M | API, ChatGPT |
| **o1-mini** | Unknown | 128K | Coding-focused reasoning | $3/1M | $12/1M | API |
| **o3** | Unknown | 200K | Top-tier reasoning & code | $10/1M | $40/1M | API |
| **o3-mini** | Unknown | 200K | Fast reasoning, SWE-bench leader | $1.10/1M | $4.40/1M | API |
| **o4-mini** | Unknown | 200K | Latest, strong coding + vision | $1.10/1M | $4.40/1M | API |
| **GPT-4 Turbo** | Unknown | 128K | Solid, widely used | $10/1M | $30/1M | API |
| **GPT-OSS 120B** | ~120B | TBC | Newly announced open weights | TBC | TBC | Coming soon |

> **GPT-OSS Special Note**: OpenAI's first open-weight model (~120B parameters). Recently announced. Will be available for self-hosting. Ideal candidate for Sheri-ML on your GCP GPU.

---

### **Anthropic (Claude) Models**

| Model | Context | Coding Notes | Cost (Input) | Cost (Output) | Access |
|-------|---------|-------------|-------------|--------------|--------|
| **Claude 3.5 Haiku** | 200K | Fast, good for routine code | $0.80/1M | $4/1M | API |
| **Claude 3.5 Sonnet** | 200K | Best balance, top SWE-bench | $3/1M | $15/1M | API |
| **Claude 3.7 Sonnet** | 200K | Extended thinking, complex code | $3/1M | $15/1M | API |
| **Claude 3 Opus** | 200K | Deep analysis, architecture | $15/1M | $75/1M | API |

> **Claude Special Note**: Claude 3.5 Sonnet holds the **#1 SWE-bench score** (real-world software engineering tasks). Best for code review and complex debugging.

---

### **Google Models**

| Model | Context | Coding Notes | Cost (Input) | Cost (Output) | Access |
|-------|---------|-------------|-------------|--------------|--------|
| **Gemini 1.5 Flash** | 1M | Fast, cheap, solid coding | $0.075/1M | $0.30/1M | API, Vertex AI |
| **Gemini 1.5 Pro** | 2M | Long context, multimodal | $1.25/1M | $5/1M | API, Vertex AI |
| **Gemini 2.0 Flash** | 1M | Latest fast model, strong code | $0.10/1M | $0.40/1M | API, Vertex AI |
| **Gemini 2.0 Flash Thinking** | 32K | Reasoning mode, complex code | $0.10/1M | $0.40/1M | API, Vertex AI |
| **Gemini 2.5 Pro** | 1M | Top Google model, coding beast | $1.25/1M | $10/1M | API, Vertex AI |
| **Gemini 2.5 Flash** | 1M | Fast + strong, great value | $0.15/1M | $0.60/1M | API, Vertex AI |

> **Vertex AI Note**: All Google models available cheaper through Vertex AI with your GCP credits!

---

### **Other Commercial Models**

| Model | Company | Context | Coding Notes | Cost | Access |
|-------|---------|---------|-------------|------|--------|
| **Grok 3** | xAI | 131K | Strong coding, real-time data | ~$3/1M | API |
| **Grok 3 Mini** | xAI | 131K | Reasoning mode, efficient | ~$0.30/1M | API |
| **Command R+** | Cohere | 128K | RAG-optimized, good at code | $2.50/1M | API |
| **Mistral Large** | Mistral | 128K | Strong European model | $2/1M | API |
| **Mistral Medium** | Mistral | 128K | Balanced, good for coding | $0.40/1M | API |
| **Amazon Nova Pro** | AWS | 300K | AWS-native, solid code | $0.80/1M | AWS Bedrock |
| **Amazon Q Developer** | AWS | - | IDE-integrated coding assistant | $19/user/mo | AWS |

---

## 🏆 **BENCHMARK COMPARISON**

### **HumanEval Scores** (Higher = Better, max 100%)

```
GPT-4o             ████████████████████ 90.2%
o3-mini            ███████████████████  89.9%
Claude 3.5 Sonnet  ███████████████████  92.0%
Gemini 2.5 Pro     ███████████████████  91.0%
DeepSeek-V2        ██████████████████   90.2%
Qwen2.5-Coder 32B  ██████████████████   92.7%
Qwen3-Coder 80B    ███████████████████  ~95%
GPT-OSS 120B       ████████████████████ TBC
Codestral 22B      ████████████████     81.1%
DeepSeek-R1 14B    █████████████████    86.7%
Qwen2.5-Coder 7B   ████████████████     88.4%
Phi-3 Medium 14B   ████████████████     84.0%
Code Llama 70B     ██████████           53.0%
StarCoder2 15B     ████████             46.3%
Gemma 3 27B        ██████████████       ~72%
Gemma 3n E4B       ████████             ~45%
```

### **SWE-Bench Verified** (Real-world engineering tasks)

```
Claude 3.7 Sonnet   49.0%  ← #1 Overall
Claude 3.5 Sonnet   49.0%
GPT-4o              38.8%
o3                  71.7%  (with scaffolding)
DeepSeek-R1         49.2%
```

---

## 🎯 **RECOMMENDATIONS FOR BERI ML**

### **Updated Agent Model Selection**

| Agent | Junior | Role | Recommended Model | Reason |
|-------|--------|------|------------------|--------|
| Cheri-ML | Junior 1 | Research | Gemini 2.0 Flash (Vertex) | Cheap, fast, 1M context |
| Cheri-ML | Junior 2 | Backend Code | **Cheri-ML 1.3B** (your GPU) | Custom trained, $0 cost |
| Cheri-ML | Junior 3 | Testing | Claude 3.5 Sonnet | #1 SWE-bench, great at tests |
| Beri-ML | Junior 1 | Design Research | Gemini 2.5 Pro (Vertex) | Multimodal, sees designs |
| Beri-ML | Junior 2 | Frontend Code | Qwen2.5-Coder 32B | Best open-source, rivals GPT-4 |
| Beri-ML | Junior 3 | UI Testing | Claude 3.5 Haiku | Fast, cheap, good quality |
| Sheri-ML | Junior 1 | Integration Research | Gemini 2.0 Flash (Vertex) | Fast research queries |
| Sheri-ML | Junior 2 | Full Stack Code | **GPT-OSS 120B** (GCP GPU) | Self-hosted, use GCP credits! |
| Sheri-ML | Junior 3 | DevOps/QA | Claude 3.7 Sonnet | Extended thinking for complex systems |

---

### **Model Selection by Task**

| Task | Best Open Source | Best Commercial | Budget Option |
|------|-----------------|-----------------|---------------|
| Backend API code | Qwen2.5-Coder 32B | Claude 3.5 Sonnet | DeepSeek-Coder 6.7B |
| React/Frontend | Qwen3-Coder 80B | GPT-4o | Qwen2.5-Coder 7B |
| Mobile (React Native) | DeepSeek-Coder-V2 | Claude 3.5 Sonnet | Phi-3 Medium |
| Architecture design | DeepSeek-R1 | o3 | Qwen2.5-Coder 14B |
| Code review | Qwen2.5-Coder 32B | Claude 3.7 Sonnet | Phi-4 |
| Test generation | DeepSeek-Coder-V2 | Claude 3.5 Sonnet | StarCoder2 15B |
| DevOps/Shell | Codestral 22B | GPT-4o | Gemma 3 27B |
| On-device/Mobile | Gemma 3n E4B | - | Phi-4 Mini |
| Documentation | Llama 3.3 70B | Gemini 2.5 Pro | Qwen2.5-Coder 7B |
| Bug debugging | DeepSeek-R1 14B | o3-mini | DeepSeek-R1 Distill 7B |

---

### **Model Selection by VRAM**

| Available VRAM | Best Model | Runner-up |
|----------------|-----------|-----------|
| 4GB | Gemma 3n E4B / Phi-4 Mini | Qwen2.5-Coder 3B |
| 8GB | Qwen2.5-Coder 7B | DeepSeek-Coder 6.7B |
| 12GB | Qwen2.5-Coder 7B (full) | Phi-3 Medium |
| 16GB | Qwen2.5-Coder 14B | Codestral 22B (4-bit) |
| 24GB | Qwen2.5-Coder 32B (4-bit) | DeepSeek-Coder 33B |
| 40GB | DeepSeek-Coder-V2 Lite | Qwen3-Coder 30B A3B |
| 80GB+ | Qwen3-Coder 80B | DeepSeek-R1 671B |

---

## 💰 **COST COMPARISON (API)**

### **Cost per 1 Million Tokens (Input)**

```
Gemini 2.0 Flash    $0.075  ██
GPT-4o mini         $0.150  ████
Gemini 2.5 Flash    $0.150  ████
Claude 3.5 Haiku    $0.800  ████████████████
Amazon Nova Pro     $0.800  ████████████████
GPT-4o              $2.500  ████████████████████████████████████████
Gemini 2.5 Pro      $1.250  ████████████████████
Claude 3.5 Sonnet   $3.000  ████████████████████████████████████████████████
GPT-4 Turbo         $10.00  ██████████████████████████████████████████████████
Claude 3 Opus       $15.00  ████████████████████████████████████████████████████████
o1                  $15.00  ████████████████████████████████████████████████████████
```

### **Self-Hosted (Ollama) Cost**

```
Electricity (GPU running 24/7):
RTX 4090 (450W) → ~$0.10/hour electricity
A100 (400W)     → ~$0.09/hour electricity
L4 (72W)        → ~$0.02/hour electricity

Effective cost per 1M tokens: ~$0.00-0.05
```

---

## 🔗 **HOW TO ACCESS**

### **Ollama (Self-Hosted, Free)**

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull qwen2.5-coder:32b      # Best open-source coder
ollama pull deepseek-coder-v2:16b  # Great for backend
ollama pull codestral:22b           # Mistral's code model
ollama pull devstral:24b            # Latest agentic coder
ollama pull codellama:70b           # Classic option
ollama pull gemma3:27b              # Google's open model
ollama pull phi4:14b                # Microsoft's model

# Run
ollama run qwen2.5-coder:32b
```

### **Google Vertex AI (Use Your GCP Credits!)**

```python
import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="your-gcp-project", location="us-central1")

# Gemini 2.5 Pro (best for coding)
model = GenerativeModel("gemini-2.5-pro")
response = model.generate_content("Write a React component for a login form")
print(response.text)
```

### **Hugging Face (Self-Hosted)**

```bash
# Download and run locally
pip install transformers accelerate

# Python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-Coder-32B-Instruct")
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-Coder-32B-Instruct")
```

---

## 🌐 **USEFUL RESOURCES**

| Resource | URL | Purpose |
|----------|-----|---------|
| **Ollama Models** | https://ollama.com/search?c=code | Browse and pull models |
| **HuggingFace** | https://huggingface.co/models | All open-source models |
| **BigCode Leaderboard** | https://huggingface.co/spaces/bigcode/bigcode-models-leaderboard | Coding benchmarks |
| **Open LLM Leaderboard** | https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard | General benchmarks |
| **SWE-Bench** | https://www.swebench.com | Real-world coding tasks |
| **LiveCodeBench** | https://livecodebench.github.io | Live coding competition |
| **EvalPlus** | https://evalplus.github.io/leaderboard.html | HumanEval+ benchmarks |

---

## 📝 **NOTES**

- **HumanEval**: Benchmark of 164 Python coding problems (pass@1 rate)
- **MBPP**: 374 Python programming problems
- **SWE-bench**: Real GitHub issues from open source projects
- **LiveCodeBench**: Competition programming (harder than HumanEval)
- All prices are approximate and subject to change
- VRAM requirements are for 4-bit quantized models unless otherwise noted
- Full precision models require ~2x the listed VRAM

---

**Last Updated**: February 2026
**Source**: HuggingFace, Ollama, Official documentation, benchmarks
**Next Review**: When new major models are released
