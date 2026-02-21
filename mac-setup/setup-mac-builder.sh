#!/bin/bash
# Beri ML - Mac Builder Setup Script
# This script sets up an AWS EC2 Mac instance for iOS/macOS builds

set -e  # Exit on error

echo "🍎 Beri ML Mac Builder Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    error "This script must be run on macOS"
fi

info "Starting setup on $(sw_vers -productName) $(sw_vers -productVersion)"
echo ""

# Step 1: Install Homebrew
info "Step 1/10: Installing Homebrew..."
if command -v brew &> /dev/null; then
    info "Homebrew already installed"
else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Step 2: Install essential tools
info "Step 2/10: Installing essential tools..."
brew install node git wget curl jq ffmpeg

# Step 3: Check for Xcode
info "Step 3/10: Checking for Xcode..."
if xcode-select -p &> /dev/null; then
    info "Xcode already installed at $(xcode-select -p)"
else
    warn "Xcode not found. Please install from App Store or run install-xcode.sh"
    warn "Press Enter to continue or Ctrl+C to exit"
    read
fi

# Step 4: Accept Xcode license
info "Step 4/10: Accepting Xcode license..."
if [ -d "/Applications/Xcode.app" ]; then
    sudo xcodebuild -license accept || warn "Could not accept Xcode license automatically"
    xcode-select --install || warn "Command line tools already installed"
else
    warn "Xcode not installed, skipping license acceptance"
fi

# Step 5: Install iOS Simulators
info "Step 5/10: Setting up iOS Simulators..."
if [ -d "/Applications/Xcode.app" ]; then
    ./configure-simulators.sh || warn "Simulator setup failed"
else
    warn "Skipping simulator setup (Xcode not installed)"
fi

# Step 6: Install build tools
info "Step 6/10: Installing build tools..."
gem install fastlane cocoapods || sudo gem install fastlane cocoapods
npm install -g yarn expo-cli eas-cli

# Step 7: Configure performance
info "Step 7/10: Configuring performance settings..."
# Increase file descriptor limit
sudo launchctl limit maxfiles 65536 200000 || warn "Could not set file descriptor limit"

# Increase Xcode build parallelism
if [ -d "/Applications/Xcode.app" ]; then
    defaults write com.apple.dt.Xcode IDEBuildOperationMaxNumberOfConcurrentCompileTasks 8
fi

# Step 8: Set up directories
info "Step 8/10: Creating directories..."
mkdir -p ~/builds
mkdir -p ~/artifacts
mkdir -p ~/logs
mkdir -p ~/.beri-ml

# Step 9: Clone Beri ML repository
info "Step 9/10: Cloning Beri ML repository..."
if [ ! -d "~/beri-ml" ]; then
    git clone https://github.com/Hey-Salad/beri-ml.git ~/beri-ml
else
    info "Beri ML already cloned"
fi

# Step 10: Install HADP Agent
info "Step 10/10: Installing HADP Agent..."
cd ~/beri-ml/mac-setup/hadp-agent
npm install

# Create environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    info "Created .env file - please configure it"
fi

echo ""
info "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure ~/beri-ml/mac-setup/hadp-agent/.env"
echo "2. Import Apple Developer certificates"
echo "3. Start HADP Agent: cd ~/beri-ml/mac-setup/hadp-agent && npm start"
echo ""
echo "For manual Xcode installation, run: ./install-xcode.sh"
echo ""
