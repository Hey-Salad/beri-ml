# 🍎 AWS EC2 Mac Setup Guide

**Track 1 - AWS EC2 Mac Instance Setup**

**Assignee**: Claude Agent
**Duration**: 2-3 hours
**Goal**: Launch and configure AWS EC2 Mac2-m2 instance for iOS/macOS builds

---

## 📋 **Prerequisites**

- AWS Account with EC2 permissions
- AWS CLI configured (`aws configure`)
- SSH key pair created in AWS Console
- Basic understanding of macOS and Xcode

---

## 🚀 **Step 1: Launch EC2 Mac Instance**

### **1.1 Choose Instance Type**

```bash
# Instance type: mac2-m2.metal
# Chip: Apple M2 (8-core CPU, 10-core GPU)
# RAM: 24 GB
# Storage: 500 GB SSD
# Cost: ~$1.10/hour (~$800/month with 24-hour minimum)
```

### **1.2 Launch via AWS CLI**

```bash
# Find latest macOS AMI
aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=amzn-ec2-macos-*" \
  --query 'Images | sort_by(@, &CreationDate) | [-1].[ImageId,Name,Description]' \
  --output table

# Launch instance (replace with your values)
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type mac2-m2.metal \
  --key-name your-ssh-key \
  --security-group-ids sg-your-security-group \
  --subnet-id subnet-your-subnet \
  --block-duration-minutes 1440 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=beri-ml-mac-builder}]'

# Note: 24-hour minimum (1440 minutes)
```

### **1.3 Launch via AWS Console** (Alternative)

1. Go to EC2 Console → Launch Instance
2. Name: `beri-ml-mac-builder`
3. AMI: Search "macOS Sonoma" → Select latest
4. Instance type: `mac2-m2.metal`
5. Key pair: Select or create
6. Network: Default VPC, enable auto-assign public IP
7. Storage: 500 GB (default)
8. Launch

---

## 🔐 **Step 2: Connect to Instance**

### **2.1 Wait for Instance to Boot**

```bash
# Check instance status
aws ec2 describe-instances \
  --instance-ids i-your-instance-id \
  --query 'Reservations[0].Instances[0].[State.Name,PublicIpAddress]' \
  --output table

# Wait until status is "running" (takes 10-15 minutes)
```

### **2.2 SSH Connection**

```bash
# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids i-your-instance-id \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

# SSH into instance
ssh -i ~/.ssh/your-key.pem ec2-user@$PUBLIC_IP

# You should see:
# Last login: ...
# ec2-user@ip-xxx-xxx-xxx-xxx ~ %
```

---

## 🛠️ **Step 3: Initial Setup**

### **3.1 Update System**

```bash
# Update macOS (if needed)
sudo softwareupdate -l
sudo softwareupdate -i -a

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### **3.2 Install Essential Tools**

```bash
# Install Node.js
brew install node

# Install Git (already installed, but ensure latest)
brew install git

# Install wget and curl
brew install wget curl

# Install jq for JSON parsing
brew install jq

# Verify installations
node --version  # Should show v20.x or higher
npm --version
git --version
```

---

## 📱 **Step 4: Install Xcode**

### **4.1 Download Xcode**

```bash
# Option 1: Via Mac App Store (requires Apple ID)
# Go to App Store → Search "Xcode" → Install

# Option 2: Via Command Line (faster, no Apple ID needed)
# Download from Apple Developer portal
# You'll need to provide Apple Developer credentials

# For automation, use this script:
cd /tmp
wget https://raw.githubusercontent.com/Hey-Salad/beri-ml/main/mac-setup/install-xcode.sh
chmod +x install-xcode.sh
./install-xcode.sh
```

### **4.2 Accept Xcode License**

```bash
# Accept license agreement
sudo xcodebuild -license accept

# Install Command Line Tools
xcode-select --install

# Verify installation
xcodebuild -version
# Should output: Xcode 15.x
```

### **4.3 Configure Xcode**

```bash
# Set Xcode path
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# Verify
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer
```

---

## 🎮 **Step 5: Install iOS Simulators**

### **5.1 List Available Simulators**

```bash
# List all available runtimes
xcrun simctl list runtimes

# Install iOS 17.x runtime (if not already installed)
xcodebuild -downloadPlatform iOS
```

### **5.2 Create Simulator Devices**

```bash
# Run the simulator setup script
cd /tmp
wget https://raw.githubusercontent.com/Hey-Salad/beri-ml/main/mac-setup/configure-simulators.sh
chmod +x configure-simulators.sh
./configure-simulators.sh

# This creates:
# - iPhone 15 Pro
# - iPhone 15 Pro Max
# - iPhone 14
# - iPhone SE (3rd generation)
# - iPad Air (5th generation)
# - iPad Pro (12.9-inch) (6th generation)
```

### **5.3 Test Simulator**

```bash
# Boot iPhone 15 Pro
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator app
open -a Simulator

# You should see the iPhone 15 Pro simulator window
```

---

## 🤖 **Step 6: Install Build Agent (HADP Agent)**

### **6.1 Clone Repository**

```bash
# Clone beri-ml repository
cd /Users/ec2-user
git clone https://github.com/Hey-Salad/beri-ml.git
cd beri-ml/mac-setup/hadp-agent
```

### **6.2 Install Dependencies**

```bash
# Install agent dependencies
npm install

# Install global tools
npm install -g fastlane
brew install cocoapods
```

### **6.3 Configure Agent**

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env

# Set:
# MAC_ID=mac-builder-1
# HADP_API_URL=https://your-api-url.workers.dev
# HADP_API_KEY=your-api-key
```

### **6.4 Start Agent as Service**

```bash
# Test agent manually
npm start

# If working, install as service
sudo npm run install-service

# Check service status
sudo launchctl list | grep hadp-agent

# View logs
tail -f /var/log/hadp-agent.log
```

---

## 🔐 **Step 7: Configure Code Signing**

### **7.1 Import Certificates**

You'll need the following from Apple Developer Account:
- Developer ID Application certificate (.p12)
- iOS Distribution certificate (.p12)
- Provisioning profiles

```bash
# Import certificates
security import ~/Downloads/developer-id.p12 -P <password> -A
security import ~/Downloads/ios-distribution.p12 -P <password> -A

# Verify certificates
security find-identity -v -p codesigning

# You should see:
# 1) XXXXXX "Apple Development: Your Name (TEAM_ID)"
# 2) YYYYYY "Apple Distribution: Your Company (TEAM_ID)"
```

### **7.2 Install Provisioning Profiles**

```bash
# Copy provisioning profiles
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles/
cp ~/Downloads/*.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/

# Verify
ls -la ~/Library/MobileDevice/Provisioning\ Profiles/
```

### **7.3 Configure Fastlane**

```bash
# Initialize fastlane
cd /Users/ec2-user/beri-ml/mac-setup
fastlane init

# Follow prompts:
# 1. What would you like to use fastlane for?
#    → Select option 2 (Automate beta distribution)
# 2. Apple ID: your-apple-id@example.com
# 3. App Identifier: com.heysalad.yourapp
```

---

## 🧪 **Step 8: Test Build Pipeline**

### **8.1 Clone Test Project**

```bash
# Clone sally-mobile for testing
cd /Users/ec2-user
git clone https://github.com/Hey-Salad/heysalad-payme.git
cd heysalad-payme/sally-mobile
```

### **8.2 Install Dependencies**

```bash
# Install npm dependencies
npm install

# Install CocoaPods (if React Native)
cd ios
pod install
cd ..
```

### **8.3 Build for Simulator**

```bash
# Build for iOS Simulator
npx expo run:ios --device "iPhone 15 Pro"

# Or with Xcode directly
xcodebuild -workspace ios/SallyMobile.xcworkspace \
  -scheme SallyMobile \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
  build
```

### **8.4 Build for Device (Archive)**

```bash
# Build IPA for TestFlight
fastlane ios beta

# Or manually
xcodebuild -workspace ios/SallyMobile.xcworkspace \
  -scheme SallyMobile \
  -configuration Release \
  -archivePath ./build/SallyMobile.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath ./build/SallyMobile.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist exportOptions.plist
```

---

## 📊 **Step 9: Monitoring & Optimization**

### **9.1 Install Monitoring Tools**

```bash
# Install htop for resource monitoring
brew install htop

# Install iostat for disk I/O
brew install sysstat

# Monitor in real-time
htop
```

### **9.2 Performance Tuning**

```bash
# Increase file descriptor limit
sudo launchctl limit maxfiles 65536 200000

# Increase build parallelism
defaults write com.apple.dt.Xcode IDEBuildOperationMaxNumberOfConcurrentCompileTasks 8

# Clear Derived Data periodically
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

### **9.3 Set Up CloudWatch Monitoring**

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/darwin/amd64/latest/amazon-cloudwatch-agent.pkg
sudo installer -pkg amazon-cloudwatch-agent.pkg -target /

# Configure agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json \
  -s
```

---

## 🔄 **Step 10: Automation & CI/CD**

### **10.1 GitHub Actions Self-Hosted Runner**

```bash
# Create runner directory
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download runner
curl -o actions-runner-osx-arm64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-osx-arm64-2.311.0.tar.gz

# Extract
tar xzf ./actions-runner-osx-arm64-2.311.0.tar.gz

# Configure runner
./config.sh --url https://github.com/Hey-Salad/beri-ml \
  --token YOUR_RUNNER_TOKEN \
  --name aws-mac-builder-1 \
  --labels macOS,ARM64,self-hosted,ios-builder

# Install as service
./svc.sh install
./svc.sh start

# Verify
./svc.sh status
```

### **10.2 Create GitHub Workflow**

The workflow is already in `.github/workflows/ios-build.yml` in the repo.

---

## ✅ **Verification Checklist**

After setup, verify everything works:

- [ ] SSH connection to EC2 Mac instance
- [ ] Homebrew installed and working
- [ ] Node.js and npm installed
- [ ] Xcode installed and license accepted
- [ ] iOS Simulators installed and bootable
- [ ] HADP Agent running as service
- [ ] Code signing certificates imported
- [ ] Provisioning profiles installed
- [ ] Test build completes successfully
- [ ] Simulator streams video correctly
- [ ] GitHub Actions runner connected

---

## 🐛 **Troubleshooting**

### **Problem: Xcode license not accepted**
```bash
sudo xcodebuild -license accept
```

### **Problem: Simulator not booting**
```bash
# Kill all simulators
killall Simulator
xcrun simctl shutdown all

# Erase all simulators
xcrun simctl erase all

# Restart
xcrun simctl boot "iPhone 15 Pro"
```

### **Problem: Code signing fails**
```bash
# List keychains
security list-keychains

# Unlock keychain
security unlock-keychain ~/Library/Keychains/login.keychain-db

# Re-import certificate
security import certificate.p12 -P password -A
```

### **Problem: Build timeout**
```bash
# Increase Xcode build timeout
defaults write com.apple.dt.Xcode IDEBuildOperationMaxNumberOfConcurrentCompileTasks 4
```

---

## 💰 **Cost Management**

### **Stop Instance When Not Needed**

```bash
# Stop instance (still charged for 24-hour minimum)
aws ec2 stop-instances --instance-ids i-your-instance-id

# Start instance
aws ec2 start-instances --instance-ids i-your-instance-id
```

### **Release Dedicated Host** (After 24 hours)

```bash
# Terminate instance
aws ec2 terminate-instances --instance-ids i-your-instance-id

# Release dedicated host (stops billing)
aws ec2 release-hosts --host-ids h-your-host-id
```

---

## 📚 **Additional Resources**

- [AWS EC2 Mac Documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-mac-instances.html)
- [Xcode Command Line Reference](https://developer.apple.com/library/archive/technotes/tn2339/)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [iOS Simulator Guide](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device)

---

## ✅ **Next Steps**

Once your Mac instance is set up:

1. ✅ **Report back** with instance IP and status
2. 🔗 **Connect to Beri ML IDE** (Track 2)
3. 🍎 **Add Apple Developer credentials** (Track 3)
4. 🧪 **Test first build** (Track 4)

---

**Setup Time**: 2-3 hours
**Status**: Ready for Track 2 integration
**Contact**: Your AWS Mac instance is now a powerful iOS build server! 🚀
