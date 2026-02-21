# 🚀 GitHub Actions iOS Build Setup

**Using GitHub-hosted macOS runners for FREE iOS builds!**

---

## ✨ **What You Get**

✅ **Free macOS M1 runners** (for public repos)
✅ **Xcode pre-installed** (latest version)
✅ **iOS Simulators** (all devices)
✅ **Automatic builds** on every push
✅ **TestFlight deployment** (with credentials)
✅ **No infrastructure management**

**Cost**: **FREE** for public repositories! 🎉

For private repos: 10x multiplier on minutes (but still very affordable)

---

## 📊 **GitHub Actions macOS Runners**

| Runner | CPU | RAM | Xcode | Cost (Public) | Cost (Private) |
|--------|-----|-----|-------|---------------|----------------|
| macos-14 | M1, 3-core | 7 GB | 15.4 | FREE | $0.16/min |
| macos-13 | Intel, 3-core | 14 GB | 15.2 | FREE | $0.08/min |
| macos-12 | Intel, 3-core | 14 GB | 14.2 | FREE | $0.08/min |

**Recommendation**: Use `macos-14` (M1, fastest, free!)

---

## 🛠️ **What's Already Set Up**

I've created `.github/workflows/ios-build.yml` with:

### **On Every Push:**
- ✅ Checkout code
- ✅ Install Node.js dependencies
- ✅ Install CocoaPods
- ✅ Build for iOS Simulator
- ✅ Run tests
- ✅ Upload build artifacts

### **On Main Branch (Release):**
- ✅ Import code signing certificates
- ✅ Build IPA for distribution
- ✅ Upload to TestFlight automatically

---

## 🔐 **Required GitHub Secrets**

To enable code signing and TestFlight deployment, add these secrets:

### **Go to Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `IOS_DIST_CERT_BASE64` | iOS Distribution certificate (base64 encoded) | See below |
| `IOS_DIST_CERT_PASSWORD` | Certificate password | Your certificate password |
| `APP_STORE_CONNECT_KEY_ID` | App Store Connect API Key ID | From App Store Connect |
| `APP_STORE_CONNECT_ISSUER_ID` | App Store Connect Issuer ID | From App Store Connect |
| `APP_STORE_CONNECT_KEY` | App Store Connect API Key (.p8 content) | From App Store Connect |

---

## 📝 **How to Add Secrets**

### **1. Encode Distribution Certificate**

```bash
# On your Mac (where you have the .p12 certificate)
base64 -i ios_distribution.p12 | pbcopy
# Now paste into GitHub Secret: IOS_DIST_CERT_BASE64
```

### **2. Add Certificate Password**

Just paste your certificate password into: `IOS_DIST_CERT_PASSWORD`

### **3. Get App Store Connect API Key**

1. Go to https://appstoreconnect.apple.com
2. Users and Access → Keys
3. Create new key (or use existing)
4. Copy **Issuer ID** → paste into `APP_STORE_CONNECT_ISSUER_ID`
5. Copy **Key ID** → paste into `APP_STORE_CONNECT_KEY_ID`
6. Download .p8 file → copy entire content → paste into `APP_STORE_CONNECT_KEY`

---

## 🚀 **How to Use**

### **Automatic Builds (No action needed!)**

Every time you push code:
```bash
git add .
git commit -m "Update app"
git push
```

GitHub Actions will automatically:
1. Build your app
2. Run tests
3. Create artifacts

**View progress**: https://github.com/Hey-Salad/beri-ml/actions

---

## 📱 **Deploy to TestFlight**

Push to `main` branch to trigger TestFlight deployment:

```bash
git checkout main
git merge develop
git push origin main
```

GitHub Actions will:
1. Build release IPA
2. Sign with your certificate
3. Upload to TestFlight
4. Notify you when ready

**TestFlight processing**: Takes 5-10 minutes after upload.

---

## 🧪 **Test the Workflow**

### **Quick Test:**

```bash
# Create a simple test commit
cd /home/admin/beri-ml
echo "# Test" >> README.md
git add README.md
git commit -m "Test GitHub Actions workflow"
git push
```

Then watch: https://github.com/Hey-Salad/beri-ml/actions

You'll see the build start within seconds!

---

## 📊 **Build Status Badge**

Add to your README.md:

```markdown
![iOS Build](https://github.com/Hey-Salad/beri-ml/workflows/iOS%20Build/badge.svg)
```

Shows: ![iOS Build](https://github.com/Hey-Salad/beri-ml/workflows/iOS%20Build/badge.svg)

---

## 🔧 **Customization**

### **Change Build Settings**

Edit `.github/workflows/ios-build.yml`:

```yaml
# Build for different simulator
-destination 'platform=iOS Simulator,name=iPhone 15 Pro Max'

# Build for multiple simulators
-destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
-destination 'platform=iOS Simulator,name=iPad Pro (12.9-inch)'

# Change Xcode version
runs-on: macos-13  # Use Xcode 15.2
```

### **Add More Steps**

```yaml
- name: Run UI Tests
  run: |
    xcodebuild test \
      -workspace ios/App.xcworkspace \
      -scheme App \
      -destination 'platform=iOS Simulator,name=iPhone 15 Pro'

- name: Upload to Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "iOS build completed!"
      }
```

---

## 💰 **Cost Comparison**

| Solution | Setup Time | Monthly Cost | Maintenance |
|----------|------------|--------------|-------------|
| **GitHub Actions** | 5 mins | **$0** (public) | None |
| AWS EC2 Mac | 2-3 hours | $1,800 | Medium |
| MacStadium | 1 hour | $199 | Low |
| Physical Mac | 4+ hours | $0* | High |

*Physical Mac: $1,599 upfront + electricity

---

## 🎯 **Current Status**

✅ **Workflow created**: `.github/workflows/ios-build.yml`
✅ **Repository configured**: https://github.com/Hey-Salad/beri-ml
✅ **Free macOS runners**: Available immediately
⏳ **Waiting for**: GitHub Secrets (optional for TestFlight)

---

## 🚨 **Troubleshooting**

### **Build Fails: "No such file or directory"**

Your project structure might be different. Update paths in workflow:

```yaml
# If your app is in a subdirectory
- name: Build
  run: |
    cd your-app-directory
    xcodebuild ...
```

### **Code Signing Fails**

Make sure:
1. Certificate is correctly base64 encoded
2. Password is correct
3. Provisioning profile matches Bundle ID

### **TestFlight Upload Fails**

Check:
1. App Store Connect API key is valid
2. App exists in App Store Connect
3. Bundle ID matches

---

## 📚 **Additional Resources**

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **macOS Runners**: https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners
- **Xcode on GitHub Actions**: https://github.com/actions/runner-images/blob/main/images/macos/macos-14-Readme.md
- **Fastlane**: https://docs.fastlane.tools/ (alternative approach)

---

## ✅ **Next Steps**

1. ✅ **Add iOS project** to repository (Sally Mobile or test app)
2. ✅ **Configure GitHub Secrets** (for TestFlight)
3. ✅ **Push code** to trigger first build
4. ✅ **Watch it build!** 🎉

---

**Status**: Ready to build iOS apps for FREE! 🚀
**Estimated Setup Time**: 10-15 minutes (with credentials)
**First Build**: ~5-10 minutes
