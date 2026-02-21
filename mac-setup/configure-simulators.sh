#!/bin/bash
# Configure iOS Simulators for Beri ML

set -e

echo "📱 Configuring iOS Simulators"
echo "=============================="

# Check if Xcode is installed
if ! xcode-select -p &> /dev/null; then
    echo "❌ Xcode not found. Please install Xcode first."
    exit 1
fi

# Get iOS runtime
IOS_RUNTIME=$(xcrun simctl list runtimes | grep "iOS" | tail -1 | sed 's/.*(\(.*\))/\1/')
echo "Using iOS Runtime: $IOS_RUNTIME"

# Create iPhone simulators
echo ""
echo "Creating iPhone simulators..."

xcrun simctl create "iPhone 15 Pro" "com.apple.CoreSimulator.SimDeviceType.iPhone-15-Pro" "$IOS_RUNTIME" || echo "iPhone 15 Pro already exists"
xcrun simctl create "iPhone 15 Pro Max" "com.apple.CoreSimulator.SimDeviceType.iPhone-15-Pro-Max" "$IOS_RUNTIME" || echo "iPhone 15 Pro Max already exists"
xcrun simctl create "iPhone 14" "com.apple.CoreSimulator.SimDeviceType.iPhone-14" "$IOS_RUNTIME" || echo "iPhone 14 already exists"
xcrun simctl create "iPhone SE (3rd generation)" "com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation" "$IOS_RUNTIME" || echo "iPhone SE already exists"

# Create iPad simulators
echo ""
echo "Creating iPad simulators..."

xcrun simctl create "iPad Air (5th generation)" "com.apple.CoreSimulator.SimDeviceType.iPad-Air-5th-generation" "$IOS_RUNTIME" || echo "iPad Air already exists"
xcrun simctl create "iPad Pro (12.9-inch) (6th generation)" "com.apple.CoreSimulator.SimDeviceType.iPad-Pro-12-9-inch-6th-generation" "$IOS_RUNTIME" || echo "iPad Pro already exists"

# List all simulators
echo ""
echo "Available simulators:"
xcrun simctl list devices available

echo ""
echo "✅ Simulator configuration complete!"
