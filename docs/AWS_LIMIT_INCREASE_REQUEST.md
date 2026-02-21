# AWS Mac Dedicated Host Limit Increase Request

## How to Request

### Method 1: AWS Service Quotas Console (Recommended)

1. Go to: https://console.aws.amazon.com/servicequotas/
2. Search for "EC2"
3. Find quota: **"Running Dedicated mac2-m2 Hosts"** (Quota Code: L-C93F66B3)
4. Click "Request quota increase"
5. Enter desired value: **2** (allows 2 Mac instances)
6. Provide business justification:

```
We are building Beri ML, an AI-powered development platform that requires
iOS/macOS build infrastructure for continuous integration and testing.

We need Mac2-m2 (M2) instances for:
- Building iOS apps (Xcode compilation)
- Running iOS simulators
- TestFlight deployments
- macOS app development

Expected usage: 24/7 availability for development and CI/CD pipelines.
Project: Beri ML (https://github.com/Hey-Salad/beri-ml)
```

7. Submit request

**Expected Timeline**: 1-2 business days

---

### Method 2: AWS CLI

```bash
aws service-quotas request-service-quota-increase \
  --service-code ec2 \
  --quota-code L-C93F66B3 \
  --desired-value 2 \
  --region us-east-1
```

---

### Method 3: AWS Support (Faster for urgent needs)

1. Go to: https://console.aws.amazon.com/support/home
2. Create case → Service limit increase
3. Limit type: EC2 Dedicated Hosts
4. Use case description: (same as above)
5. Contact method: Web or Phone (phone is faster)

---

## Alternative: Try mac1.metal (Intel-based)

If you have quota for mac1 instances (older Intel Macs):

```bash
# Check mac1 quota
aws service-quotas get-service-quota \
  --service-code ec2 \
  --quota-code L-A8448DC5 \
  --region us-east-1

# If quota > 0, allocate mac1 host instead
aws ec2 allocate-hosts \
  --instance-type mac1.metal \
  --availability-zone us-east-1a \
  --quantity 1 \
  --region us-east-1
```

**Note**: mac1.metal uses Intel chips, not M2. It will work but builds may be slower.

---

## While Waiting for Approval

You can:
1. Set up the rest of Beri ML (Track 2: IDE development)
2. Gather Apple Developer credentials (Track 3)
3. Use GitHub Actions macOS runners temporarily
4. Use MacStadium or similar services

---

## Status Check

Check your request status:

```bash
aws service-quotas list-requested-service-quota-change-history \
  --service-code ec2 \
  --region us-east-1
```
