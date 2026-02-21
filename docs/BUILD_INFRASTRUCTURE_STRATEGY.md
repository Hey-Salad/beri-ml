# 🏗️ Beri ML - iOS/macOS Build Infrastructure Strategy

**Last Updated**: February 21, 2026
**Status**: Decision Pending
**Purpose**: Save architecture decisions for future reference

---

## 🎯 **Executive Summary**

We evaluated multiple approaches for building iOS/macOS apps within the Beri ML platform. The core question was: **Where do we run macOS builds?**

**Conclusion**: Use **Xcode Cloud** for iOS builds + **GitHub Actions** for CI/CD + **GCP** for AI inference.

---

## 🔍 **Options Evaluated**

### **1. AWS EC2 Mac Instances** ☁️

**What it is**: Real Apple Mac hardware (M2 chip) hosted in AWS data centers.

| Attribute | Detail |
|-----------|--------|
| Instance Type | `mac2-m2.metal` (Apple M2) |
| RAM | 24 GB |
| Storage | Up to 2TB SSD |
| Cost | ~$1.10/hour |
| Minimum | 24-hour billing block |
| Monthly (24/7) | ~$800-1,800/month |

**Pros:**
- ✅ Full control over environment
- ✅ Can install anything
- ✅ Great for heavy 24/7 CI/CD
- ✅ Multiple simulators simultaneously
- ✅ Self-hosted GitHub Actions runner

**Cons:**
- ❌ Expensive ($800-1,800/month)
- ❌ Requires account quota increase (1-2 business days)
- ❌ Infrastructure management overhead
- ❌ 24-hour minimum billing

**Verdict**: Best for high-volume, production CI/CD once scaled up.

---

### **2. GitHub Actions (Free macOS Runners)** ✅ CURRENT CHOICE

**What it is**: GitHub-hosted macOS M1 virtual machines, free for public repos.

| Attribute | Detail |
|-----------|--------|
| Runner | `macos-14` (M1 chip) |
| RAM | 7 GB |
| Cost (public) | **FREE** |
| Cost (private) | $0.16/minute |
| Xcode | Pre-installed (15.4) |
| Simulators | All iOS devices |

**Pros:**
- ✅ **100% FREE** for public repos
- ✅ Zero infrastructure management
- ✅ Triggers automatically on push
- ✅ Pre-installed Xcode and simulators
- ✅ Artifacts and TestFlight deployment
- ✅ Works right now (no approvals needed)

**Cons:**
- ❌ 7GB RAM (limited for heavy builds)
- ❌ Queue time during peak hours
- ❌ Job timeout limits (6 hours max)
- ❌ No persistent simulator sessions

**Verdict**: **Perfect starting point.** Use until build volume requires dedicated Mac.

**Workflow created**: `.github/workflows/ios-build.yml`

---

### **3. Xcode Cloud** ⭐ RECOMMENDED FOR iOS

**What it is**: Apple's own native CI/CD service built into Xcode and App Store Connect.

| Attribute | Detail |
|-----------|--------|
| Infrastructure | Apple-managed Mac hardware |
| Free Tier | **25 compute hours/month** |
| Tier 1 | 100 hours → $14.99/month |
| Tier 2 | 250 hours → $24.99/month |
| Tier 3 | 1,000 hours → $49.99/month |
| Integration | Direct TestFlight + App Store |

**Pros:**
- ✅ **25 free hours/month** (Apple Developer account required)
- ✅ Fastest iOS builds (native Apple hardware)
- ✅ Zero infrastructure to manage
- ✅ Native TestFlight integration (no extra config)
- ✅ Direct App Store submission
- ✅ Minimal configuration needed
- ✅ Works with React Native, Expo, Swift, Flutter

**Cons:**
- ❌ Requires Apple Developer account ($99/year)
- ❌ Apple platform only (no Android/Linux)
- ❌ Less flexible than custom runners
- ❌ Limited to Apple's build environment

**Verdict**: **Best choice for iOS-specific builds.** Let Apple manage the Macs.

**Setup**: Just add `.xcode-cloud/ci_scripts/ci_post_clone.sh` to repo.

---

### **4. macOS on Windows / Google Cloud (Hackintosh)** ❌ NOT RECOMMENDED

**What it is**: Installing macOS on non-Apple hardware (Dell laptops, cloud VMs).

**Reality Check:**

| Aspect | Reality |
|--------|---------|
| Legality | ❌ Violates Apple EULA |
| GCP Compatibility | ❌ Cannot run on GCP VMs |
| AWS Compatibility | ❌ Cannot run on standard VMs |
| Dell/HP Laptops | ⚠️ Possible but unreliable |
| Commercial Use | ❌ Not permitted |
| Support | ❌ No official support |

**Why it doesn't work on GCP/cloud:**
1. macOS requires Apple Boot ROM hardware signatures
2. Apple doesn't allow macOS virtualization on non-Apple hardware
3. GCP uses AMD/Intel server chips without Apple firmware
4. Violates Apple EULA for any commercial use

**When it "works" (Hackintosh):**
- Specific Dell XPS, HP, Gigabyte hardware
- Personal/hobby use only
- Unreliable and breaks on macOS updates
- Not suitable for CI/CD production

**Verdict**: **Do not pursue.** Legal and technical risks outweigh any benefits.

---

### **5. Alternative macOS Hosting Services**

| Service | Type | macOS | Cost | Best For |
|---------|------|-------|------|---------|
| **MacStadium** | Dedicated | ✅ M1/M2/M3 | $79-199/mo | Long-term dedicated |
| **MacinCloud** | Managed | ✅ M1/M2 | $1/hour | Pay-as-you-go |
| **Scaleway** | Cloud | ✅ M1 | €0.10/hour | Europe-based builds |
| **Flow by MacStadium** | On-demand | ✅ | Per-hour | Flexible usage |
| **Codemagic** | CI/CD | ✅ Managed | $0.095/min | Mobile CI/CD |
| **Bitrise** | CI/CD | ✅ Managed | $0.04/min | Mobile CI/CD |

---

## 🏆 **Recommended Architecture**

### **Final Decision: Hybrid Approach**

```
iOS Builds (Primary)    →  Xcode Cloud (free 25hr/mo, Apple-managed)
iOS Builds (Overflow)   →  GitHub Actions (free, M1 runners)
Android Builds          →  GitHub Actions (Linux, free)
macOS Desktop App       →  AWS EC2 Mac (when quota approved)
AI Inference (Cheri-ML) →  Existing GPU (HeySalad)
AI Inference (Sheri-ML) →  GCP GPU (700 GBP credits!)
AI Inference (Beri-ML)  →  Google Vertex AI (GCP credits)
```

### **Cost Breakdown (Monthly)**

| Service | Purpose | Monthly Cost |
|---------|---------|--------------|
| Xcode Cloud Free Tier | iOS builds | **$0** |
| GitHub Actions | CI/CD, Android | **$0** (public) |
| GCP GPU (L4) | Sheri-ML + GPT-OSS | ~£170 (from credits) |
| Google Vertex AI | Beri-ML inference | ~£200 (from credits) |
| AWS EC2 Mac (future) | Production builds | $1,800 |
| **Near-term Total** | | **~£370/month** |
| **With AWS Mac** | | **~$2,600/month** |

**Using GCP credits (700 GBP)**: Nearly 2 months of AI inference FREE! 🎉

---

## 🗺️ **Implementation Roadmap**

### **Phase 1: Now (This Week)**
- ✅ GitHub Actions workflow created
- ⏳ Set up Xcode Cloud (need Apple Developer account)
- ⏳ Launch GCP GPU for Sheri-ML (use credits!)
- ⏳ Gather Apple Developer credentials

### **Phase 2: Short Term (1 Month)**
- AWS limit increase approved
- Migrate to self-hosted Mac runners
- Full Beri ML IDE deployed
- Sally Mobile building automatically

### **Phase 3: Scale (3 Months)**
- Multiple Mac instances
- Parallel build pipelines
- Full AI team operational
- Other HeySalad apps onboarded

---

## 📝 **Open Questions**

1. **Xcode Cloud setup**: Do you have Apple Developer account ready?
2. **GPT-OSS 120B**: What are the final specs? (OpenAI page was blocked)
3. **AWS Mac quota**: Should we submit limit increase request now?
4. **Sally Mobile**: Is the app ready for CI/CD integration?
5. **GCP Project**: Which GCP project to use for the 700 GBP credits?

---

## 🔗 **Resources**

- **Xcode Cloud**: https://developer.apple.com/xcode-cloud/
- **GitHub Actions macOS**: https://docs.github.com/en/actions/using-github-hosted-runners
- **AWS EC2 Mac**: https://aws.amazon.com/ec2/instance-types/mac/
- **MacStadium**: https://www.macstadium.com
- **Codemagic**: https://codemagic.io
- **AWS Limit Increase**: See `docs/AWS_LIMIT_INCREASE_REQUEST.md`
- **GitHub Actions Setup**: See `docs/GITHUB_ACTIONS_SETUP.md`

---

**Decision Status**: Using GitHub Actions now, evaluating Xcode Cloud
**Next Review**: After Apple Developer credentials are ready
**Owner**: HeySalad Team
