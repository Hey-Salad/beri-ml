# 🍎 Apple Developer Account Setup

**Track 3 - Apple Developer Configuration**

**Assignee**: Human (You)
**Duration**: 1 hour
**Goal**: Provide credentials and certificates for iOS/macOS app signing and distribution

---

## 📋 **WHAT WE NEED FROM YOU**

### **1. Apple Developer Account Info**
- [ ] Apple ID email
- [ ] Team ID
- [ ] Team Name
- [ ] Account type (Individual / Organization)

### **2. App Information**
- [ ] App Name (e.g., "Sally Mobile")
- [ ] Bundle Identifier (e.g., `com.heysalad.sally`)
- [ ] Primary language
- [ ] Target platforms (iOS, macOS, both)

### **3. Certificates** (.p12 files + passwords)
- [ ] iOS Development Certificate
- [ ] iOS Distribution Certificate
- [ ] Mac Development Certificate (if building for macOS)
- [ ] Mac Distribution Certificate (if building for macOS)

### **4. Provisioning Profiles** (.mobileprovision files)
- [ ] Development profile
- [ ] Ad Hoc profile (for testing)
- [ ] App Store profile (for distribution)

### **5. App Store Connect API Key**
- [ ] Issuer ID
- [ ] Key ID
- [ ] Private Key (.p8 file)

---

## 🔐 **HOW TO GET CERTIFICATES**

### **Step 1: Log in to Apple Developer**

Visit: https://developer.apple.com/account/

### **Step 2: Generate Certificates**

1. Go to **Certificates, IDs & Profiles**
2. Click **Certificates** in sidebar
3. Click **+** button to create new certificate

#### **For iOS Development:**
- Select: **iOS App Development**
- Upload CSR (Certificate Signing Request)
- Download certificate (.cer file)

#### **For iOS Distribution:**
- Select: **iOS Distribution** (App Store and Ad Hoc)
- Upload CSR
- Download certificate (.cer file)

### **Step 3: Export as .p12**

1. Double-click downloaded .cer file (opens Keychain Access)
2. Find certificate in "My Certificates"
3. Right-click → Export
4. Format: **Personal Information Exchange (.p12)**
5. Set password (save this password!)
6. Save file

### **Step 4: Create Provisioning Profiles**

1. Go to **Profiles** in sidebar
2. Click **+** button

#### **Development Profile:**
- Type: **iOS App Development**
- Select your App ID
- Select development certificate
- Select test devices
- Name it: "Sally Development Profile"
- Download .mobileprovision file

#### **Distribution Profile:**
- Type: **App Store**
- Select your App ID
- Select distribution certificate
- Name it: "Sally App Store Profile"
- Download .mobileprovision file

---

## 🔑 **HOW TO GET APP STORE CONNECT API KEY**

### **Step 1: Generate API Key**

1. Go to https://appstoreconnect.apple.com
2. Select **Users and Access**
3. Click **Keys** tab (under "Integrations")
4. Click **+** button

### **Step 2: Configure Key**

- Name: "Beri ML CI/CD"
- Access: **Admin** (or **Developer** minimum)
- Click **Generate**

### **Step 3: Download Key**

- Download .p8 file (you can only download this ONCE!)
- Note the **Issuer ID** (e.g., `57246542-96fe-1a63-e053-0824d011072a`)
- Note the **Key ID** (e.g., `2X9R4HXF34`)

**⚠️ IMPORTANT**: Save the .p8 file securely. You cannot download it again!

---

## 📝 **INFORMATION TO PROVIDE**

Please fill out this form and share with the team:

```yaml
# Apple Developer Configuration
# Fill this out and save as apple-config.yml

apple_account:
  apple_id: "your-apple-id@example.com"
  team_id: "ABCD1234EF"
  team_name: "HeySalad Inc."
  account_type: "Organization"  # or "Individual"

app_info:
  name: "Sally Mobile"
  bundle_id: "com.heysalad.sally"
  primary_language: "en-US"
  platforms:
    - iOS
    - macOS  # Optional

certificates:
  ios_development:
    file: "ios_development.p12"
    password: "your-secure-password-here"

  ios_distribution:
    file: "ios_distribution.p12"
    password: "your-secure-password-here"

  mac_development:  # Optional
    file: "mac_development.p12"
    password: "your-secure-password-here"

  mac_distribution:  # Optional
    file: "mac_distribution.p12"
    password: "your-secure-password-here"

provisioning_profiles:
  development: "Sally_Development.mobileprovision"
  adhoc: "Sally_AdHoc.mobileprovision"
  appstore: "Sally_AppStore.mobileprovision"

appstore_connect:
  issuer_id: "57246542-96fe-1a63-e053-0824d011072a"
  key_id: "2X9R4HXF34"
  key_file: "AuthKey_2X9R4HXF34.p8"

# Optional: Push Notification Certificate (if using push)
push_certificate:
  file: "push_certificate.p12"
  password: "your-secure-password-here"
```

---

## 📤 **HOW TO SECURELY SHARE**

### **Option 1: AWS Secrets Manager** (Recommended)

```bash
# Upload certificates to AWS Secrets Manager
aws secretsmanager create-secret \
  --name beri-ml/apple/ios-development-cert \
  --secret-binary fileb://ios_development.p12

aws secretsmanager create-secret \
  --name beri-ml/apple/ios-development-password \
  --secret-string "your-password-here"

# Repeat for other certificates
```

### **Option 2: Encrypted Archive**

```bash
# Create encrypted zip
zip -er apple-developer-secrets.zip \
  ios_development.p12 \
  ios_distribution.p12 \
  *.mobileprovision \
  AuthKey_*.p8

# Share the password separately (via Signal, WhatsApp, etc.)
```

### **Option 3: 1Password / LastPass**

- Upload all certificates and passwords to your team vault
- Share vault access with "Beri ML Team"

---

## 🧪 **TESTING YOUR CERTIFICATES**

Once uploaded to AWS Mac, test with:

```bash
# Test certificate import
security import ios_development.p12 -P "password" -A

# List certificates
security find-identity -v -p codesigning

# You should see:
# 1) XXXXXX "Apple Development: Your Name (TEAM_ID)"
# 2) YYYYYY "Apple Distribution: Your Company (TEAM_ID)"
```

---

## ❓ **COMMON QUESTIONS**

### **Q: I don't have an Apple Developer account yet**

**A**: Sign up at https://developer.apple.com/programs/
- Individual: $99/year
- Organization: $99/year (requires D-U-N-S number)

### **Q: I already have certificates from Xcode**

**A**: Export them from Keychain Access:
1. Open Keychain Access
2. Select "My Certificates"
3. Find your certificates
4. Right-click → Export

### **Q: Can I use the same certificate for multiple apps?**

**A**: Yes! One certificate can sign multiple apps.

### **Q: My certificates expired**

**A**: Renew them in Apple Developer portal:
1. Go to Certificates
2. Click on expired certificate
3. Click "Renew"

### **Q: What about TestFlight?**

**A**: TestFlight uses the same App Store distribution certificate.

---

## 🔒 **SECURITY BEST PRACTICES**

1. ✅ **Never commit certificates to Git**
2. ✅ **Use strong passwords (16+ characters)**
3. ✅ **Store passwords in password manager**
4. ✅ **Rotate certificates annually**
5. ✅ **Limit access to certificates**
6. ✅ **Use App Store Connect API keys (not passwords)**

---

## 📋 **CHECKLIST**

Before submitting, verify you have:

- [ ] Filled out `apple-config.yml`
- [ ] Exported all certificates as .p12 files
- [ ] Noted all passwords
- [ ] Downloaded provisioning profiles
- [ ] Generated App Store Connect API key
- [ ] Saved .p8 key file
- [ ] Uploaded to secure location (AWS Secrets Manager / 1Password)
- [ ] Shared access with team

---

## 📞 **NEED HELP?**

If you encounter issues:

1. **Apple Developer Support**: https://developer.apple.com/support/
2. **Beri ML Team**: support@heysalad.com
3. **Documentation**: https://developer.apple.com/documentation/

---

## ✅ **NEXT STEPS**

Once you provide the credentials:

1. ✅ **We'll import them** into AWS EC2 Mac instance
2. ✅ **Test code signing** with a simple app
3. ✅ **Configure Fastlane** for automation
4. ✅ **Deploy first build** to TestFlight

---

**Estimated Time**: 1 hour
**Status**: Waiting for credentials
**Impact**: Enables automated iOS builds and TestFlight deployment 🚀
