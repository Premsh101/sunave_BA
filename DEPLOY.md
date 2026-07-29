# Sunave — Coolify Deployment Guide (KVM + sunave.tech)

This guide covers deploying the Sunave Next.js application on a KVM virtual machine using [Coolify](https://coolify.io), with the domain **sunave.tech** (registered on Hostinger).

---

## Prerequisites

### KVM Virtual Machine
- Ubuntu 22.04 LTS or Debian 12
- Minimum: **2 vCPUs, 4 GB RAM, 40 GB disk**
- A public IPv4 address assigned to the VM
- Firewall ports open: **22** (SSH), **80** (HTTP), **443** (HTTPS), **8000** (Coolify UI, restrict after setup)
- Docker will be installed automatically by Coolify

### External Services
You must have the following set up before deploying:

| Service | Purpose |
|---|---|
| Firebase project | Firestore database + Authentication |
| Google Cloud project | Speech-to-Text API |
| Google Generative AI | Gemini API key |
| Razorpay account | Payment processing |

---

## Step 1 — Create the KVM Virtual Machine

On your KVM hypervisor host, provision the VM:

```bash
virt-install \
  --name sunave \
  --ram 4096 \
  --vcpus 2 \
  --disk path=/var/lib/libvirt/images/sunave.qcow2,size=40 \
  --os-variant ubuntu22.04 \
  --network bridge=virbr0 \
  --graphics none \
  --console pty,target_type=serial \
  --location 'http://archive.ubuntu.com/ubuntu/dists/jammy/main/installer-amd64/' \
  --extra-args 'console=ttyS0,115200n8 serial'
```

Note the VM's **public IPv4 address** — you will need it in the DNS step.

---

## Step 2 — Point sunave.tech DNS to the KVM VM (Hostinger)

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com).
2. Navigate to **Domains → sunave.tech → DNS / Nameservers**.
3. Add or update these DNS records:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `<YOUR_KVM_VM_PUBLIC_IP>` | 300 |
| A | `www` | `<YOUR_KVM_VM_PUBLIC_IP>` | 300 |

4. Save. DNS propagation typically takes **5–30 minutes** (up to 48 hours in rare cases).
5. Verify propagation:
   ```bash
   dig sunave.tech +short
   # Should return your VM IP
   ```

---

## Step 3 — Install Coolify on the KVM VM

SSH into the VM and run the official Coolify installer:

```bash
ssh ubuntu@<YOUR_KVM_VM_PUBLIC_IP>

curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Installation takes ~5 minutes. After completion, access the Coolify UI at:

```
http://<YOUR_KVM_VM_PUBLIC_IP>:8000
```

Complete the initial setup wizard:
1. Create an admin account.
2. Confirm the server is `localhost` (Coolify manages the same machine).
3. Finish the wizard.

> **Security tip:** After setup, restrict port 8000 in your firewall to trusted IPs only (your own IP), since it is the admin panel.

---

## Step 4 — Create a New Project & Application in Coolify

1. In the Coolify UI, click **Projects → + New Project**.
2. Name it `sunave` and click **Create**.
3. Inside the project, click **+ New Resource → Application**.
4. Under **Source**, select **GitHub** (or your Git provider).
5. Authorize Coolify if prompted, then select the repository **`Premsh101/sunave_BA`**.
6. Choose branch: `main`.
7. Under **Build Pack**, select **Dockerfile** — Coolify detects the `Dockerfile` in the repo root automatically.
8. Click **Save**.

---

## Step 5 — Configure the Application Port

The application runs on port **3010** (offset by +10 from the default 3000 to avoid conflicts with other apps on the same host).

In the Coolify application settings:

- **Container Port**: `3010`
- **Exposed Port**: leave blank (Coolify's Traefik reverse proxy handles external routing — no direct port exposure needed)

---

## Step 6 — Set Environment Variables

In the Coolify application settings, open **Environment Variables** and add each variable below. Click the **Secret** toggle for all sensitive values so they are encrypted at rest.

### Firebase Client SDK (Public)
These are safe to expose to the browser (prefixed `NEXT_PUBLIC_`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-web-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sunave-<project-id>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-project-id>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
```

### Firebase Admin SDK & Google Cloud (Secret)

These are two distinct sets of credentials for two different services:

```
# Option A — recommended: supply the entire service-account JSON as one variable
FIREBASE_SERVICE_ACCOUNT_JSON=<compact single-line JSON — see note below>

# Option B — individual fields (use only if Option A is not available)
FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_CLIENT_EMAIL=<your-firebase-service-account-client-email>
FIREBASE_PRIVATE_KEY=<your-firebase-service-account-private-key>

```

> **Firebase Admin SDK** — used by the Next.js API routes to verify session cookies and access Firestore server-side. Obtain the service account JSON from Firebase Console → Project Settings → Service Accounts → Generate new private key.
>
> **Option A (recommended) — `FIREBASE_SERVICE_ACCOUNT_JSON`**
> Pass the *entire* downloaded JSON as a compact (single-line) string.  This avoids all newline-escaping issues that can corrupt the private key in some deployment environments.
> ```bash
> # Produce the compact single-line value:
> cat your-service-account.json | python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin)))"
> # or using jq:
> cat your-service-account.json | jq -c .
> ```
> Paste the entire single-line output as the `FIREBASE_SERVICE_ACCOUNT_JSON` value.
>
> **Option B — individual fields** (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
> - `FIREBASE_PROJECT_ID` — the `project_id` field in the downloaded JSON
> - `FIREBASE_CLIENT_EMAIL` — the `client_email` field in the downloaded JSON
> - `FIREBASE_PRIVATE_KEY` — the `private_key` field in the downloaded JSON.  You may paste the raw value including the surrounding `"` quotes; the app will strip them automatically.  If you copy the value from a JSON file, the `\n` escape sequences will be converted to real newlines automatically.
>
> **Speech-to-text / text-to-speech** — both run entirely in the browser via the Web Speech API (`SpeechRecognition` / `speechSynthesis`). No Google Cloud Speech service account, `GOOGLE_APPLICATION_CREDENTIALS`, or Socket.IO configuration is needed.

### AI Providers (Secrets)

Document generation tries providers in this order, skipping any that are not
configured, and falls through to the next on any error:
**OpenRouter → Local LLM → OpenAI → Gemini → Claude.**
Configure at least one.

```
# 1. OpenRouter
OPENROUTER_API_KEY=<your-openrouter-api-key>
OPENROUTER_MODEL=openrouter/auto            # optional

# 2. Local LLM (any OpenAI-compatible endpoint, e.g. Ollama or LM Studio)
LOCAL_LLM_BASE_URL=http://localhost:11434/v1
LOCAL_LLM_MODEL=llama3.1                    # optional
LOCAL_LLM_API_KEY=<optional-key>            # optional

# 3. OpenAI
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o-mini                    # optional

# 4. Google Gemini
GEMINI_API_KEY=<your-google-generative-ai-api-key>
GEMINI_MODEL=gemini-2.0-flash               # optional

# 5. Anthropic Claude
ANTHROPIC_API_KEY=<your-anthropic-api-key>
ANTHROPIC_MODEL=claude-opus-5               # optional
```

### Razorpay (Secret)
```
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

### App Config
```
NODE_ENV=production
PORT=3010
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
```

---

## Step 7 — Configure the Domain in Coolify

1. In the application settings, go to the **Domains** section.
2. Add the domain: `https://sunave.tech`
3. Also add: `https://www.sunave.tech`
4. Enable **Force HTTPS Redirect**.
5. Coolify's built-in Traefik proxy will automatically issue a **Let's Encrypt TLS certificate** for `sunave.tech` and `www.sunave.tech`.

> **Prerequisite:** DNS must already be pointing to your VM IP (Step 2) for Let's Encrypt to issue the certificate successfully.

---

## Step 8 — Configure Health Check

In the application settings under **Health Check**:

| Setting | Value |
|---|---|
| Path | `/` |
| Port | `3010` |
| Interval | `30s` |
| Timeout | `10s` |
| Start Period | `60s` |

The `60s` start period gives Next.js enough time to compile and start before health checks begin.

---

## Step 9 — Deploy

1. Click **Deploy** in the Coolify UI.
2. Watch the build logs in real time. The build process:
   - Installs dependencies (`npm ci`)
   - Builds Next.js (`next build`)
   - Creates the production Docker image
   - Starts the container with environment variables injected
   - Registers the domain with Traefik and issues TLS cert

Expected first build time: **3–8 minutes**.

3. Once status shows **Running**, visit [https://sunave.tech](https://sunave.tech).

---

## Step 10 — Authorize sunave.tech in Firebase

After deployment, allow your production domain in Firebase:

1. **Firebase Console → Authentication → Settings → Authorized domains**
   - Add `sunave.tech`
   - Add `www.sunave.tech`

2. **Google Cloud Console → APIs & Services → Credentials**
   - Edit your OAuth 2.0 client
   - Add `https://sunave.tech` to **Authorized JavaScript origins**
   - Add `https://sunave.tech/api/auth/callback` to **Authorized redirect URIs** (if using OAuth callbacks)

---

## Step 11 — Automatic Deployments via Webhook (Optional)

1. In Coolify, go to your application → **Webhooks** tab.
2. Copy the generated webhook URL.
3. In GitHub → **Settings → Webhooks → Add webhook**:
   - **Payload URL**: paste Coolify's webhook URL
   - **Content type**: `application/json`
   - **Events**: `Just the push event`
   - **Branch filter**: `main`
4. Now every `git push` to `main` triggers an automatic redeploy.

---

## Port Reference

| Service | Internal Container Port | External Access |
|---|---|---|
| Sunave app | `3010` | Via Traefik on 443 (HTTPS) |
| Coolify UI | `8000` | Direct (restrict to trusted IPs) |
| Traefik HTTP | `80` | Automatic redirect to HTTPS |
| Traefik HTTPS | `443` | Production traffic |

Using port `3010` avoids conflict with any other apps deployed on the same Coolify instance that use the default port `3000`.

---

## Full Environment Variables Checklist

| Variable | Required | Secret | Description |
|---|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | No | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | No | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | No | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | No | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | No | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | No | Firebase app ID |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅* | **Yes** | Full service-account JSON as compact string (recommended; replaces the three fields below) |
| `FIREBASE_PROJECT_ID` | ✅* | **Yes** | Firebase project ID — only needed when NOT using `FIREBASE_SERVICE_ACCOUNT_JSON` |
| `FIREBASE_CLIENT_EMAIL` | ✅* | **Yes** | Firebase service account client email — only needed when NOT using `FIREBASE_SERVICE_ACCOUNT_JSON` |
| `FIREBASE_PRIVATE_KEY` | ✅* | **Yes** | Firebase service account private key — only needed when NOT using `FIREBASE_SERVICE_ACCOUNT_JSON` |
| `OPENROUTER_API_KEY` | ✅* | **Yes** | OpenRouter key (AI provider #1) |
| `LOCAL_LLM_BASE_URL` | ✅* | No | OpenAI-compatible local LLM endpoint (AI provider #2) |
| `OPENAI_API_KEY` | ✅* | **Yes** | OpenAI key (AI provider #3) |
| `GEMINI_API_KEY` | ✅* | **Yes** | Google Generative AI key (AI provider #4) |
| `ANTHROPIC_API_KEY` | ✅* | **Yes** | Anthropic Claude key (AI provider #5) |
| `RAZORPAY_KEY_ID` | ✅ | **Yes** | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | **Yes** | Razorpay secret key |
| `PORT` | ✅ | No | `3010` |
| `HOSTNAME` | ✅ | No | `0.0.0.0` |
| `NODE_ENV` | ✅ | No | `production` |
| `NEXT_TELEMETRY_DISABLED` | optional | No | `1` |

---

## Troubleshooting

### Container not reachable after deploy
- Check that `PORT=3010` and `HOSTNAME=0.0.0.0` are set in environment variables.
- Confirm the Container Port in Coolify settings is `3010`.

### TLS certificate not issued
- Confirm DNS A records for `sunave.tech` and `www.sunave.tech` resolve to your VM IP: `dig sunave.tech +short`
- Ensure ports 80 and 443 are open on the VM firewall.
- Check Traefik logs in Coolify: **Server → Proxy Logs**.

### Firebase Auth errors on sunave.tech
- Add `sunave.tech` and `www.sunave.tech` to Firebase Console → Authentication → Authorized domains.

### Speech transcription not working
- Transcription and read-aloud run in the browser via the Web Speech API — nothing to configure server-side.
- Use Chrome, Edge, or Safari; Firefox does not ship `SpeechRecognition`.
- The site must be served over HTTPS (or `localhost`) for microphone access.
- Make sure microphone permission is granted for the site.
- For tab/system audio, tick "Share tab audio" when prompted and keep the meeting playing through speakers (not headphones), since recognition listens via the microphone.
