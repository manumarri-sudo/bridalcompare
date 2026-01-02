import os
import subprocess
import base64

# --- 1. SETUP EXTENSION FILES ---
print("🌸 Starting Vara Makeover...")

# Create extension directory
if not os.path.exists("extension"):
    os.makedirs("extension")

# --- 1b. CREATE PLACEHOLDER ICONS (Fixes the loading error) ---
print("🎨 Creating placeholder icons so Chrome loads...")
# This is a tiny transparent PNG to satisfy Chrome that the files exist.
# You can replace these files in the 'extension' folder with your actual icons later.
placeholder_icon = base64.b64decode(b'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')

with open("extension/icon16.png", "wb") as f: f.write(placeholder_icon)
with open("extension/icon48.png", "wb") as f: f.write(placeholder_icon)
with open("extension/icon128.png", "wb") as f: f.write(placeholder_icon)

# Manifest
manifest_content = """{
  "manifest_version": 3,
  "name": "Vara - Save Outfits",
  "version": "1.3",
  "description": "Save and organize outfits from 100+ South Asian designers",
  "permissions": ["activeTab", "scripting", "storage", "cookies", "notifications"],
  "host_permissions": ["<all_urls>"],
  "background": { "service_worker": "background.js" },
  "action": { "default_popup": "popup.html" },
  "icons": { "16": "icon16.png", "48": "icon48.png", "128": "icon128.png" },
  "content_scripts": [ { "matches": ["<all_urls>"], "js": ["content.js"] } ]
}"""

with open("extension/manifest.json", "w") as f:
    f.write(manifest_content)

# Content Script (Scraper)
content_js = """chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape_page") {
    const getMeta = (p) => document.querySelector(`meta[property="${p}"]`)?.content || document.querySelector(`meta[name="${p}"]`)?.content;
    const image = getMeta('og:image') || getMeta('twitter:image') || document.querySelector('img')?.src || "";
    const title = getMeta('og:title') || document.title || "Saved Outfit";
    let price = "";
    const pEl = document.querySelector('[itemprop="price"], .price, .product-price, .amount, .money');
    if (pEl) price = pEl.innerText.trim();
    
    sendResponse({ title, image_url: image, price, url: window.location.href });
  }
  return true;
});"""

with open("extension/content.js", "w") as f:
    f.write(content_js)

# Popup HTML
popup_html = """<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 300px; font-family: sans-serif; background: #FFF8F0; padding: 20px; text-align: center; color: #4a4a4a; }
    h1 { color: #FB7185; font-size: 28px; margin: 0 0 10px 0; letter-spacing: -1px; }
    button { width: 100%; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 8px; transition: 0.2s; }
    .btn-primary { background: #FB7185; color: white; }
    .btn-primary:hover { background: #F43F5E; }
    .btn-secondary { background: white; border: 1px solid #ddd; color: #666; }
    .btn-secondary:hover { border-color: #FB7185; color: #FB7185; }
    .hidden { display: none; }
    .status { font-size: 13px; margin-bottom: 15px; min-height: 18px; }
    .loading { color: #F59E0B; }
    .success { color: #10B981; }
    .error { color: #EF4444; }
  </style>
</head>
<body>
  <h1>vara</h1>
  <div id="status" class="status"></div>
  <div id="auth-loading">Checking login...</div>
  <div id="view-login" class="hidden">
    <p style="margin-bottom:15px; font-size:14px;">Please log in to save items.</p>
    <button id="btn-login" class="btn-primary">Log In</button>
    <button id="btn-signup" class="btn-secondary">Sign Up</button>
  </div>
  <div id="view-save" class="hidden">
    <button id="btn-save" class="btn-primary">♥ Save to Collection</button>
    <button id="btn-dashboard" class="btn-secondary">Go to Dashboard</button>
  </div>
  <script src="popup.js"></script>
</body>
</html>"""

with open("extension/popup.html", "w") as f:
    f.write(popup_html)

# Popup JS
popup_js = """const BASE = 'https://www.vara.style';
const ui = {
  loading: document.getElementById('auth-loading'),
  login: document.getElementById('view-login'),
  save: document.getElementById('view-save'),
  status: document.getElementById('status')
};

async function checkAuth() {
  try {
    const res = await fetch(`${BASE}/api/auth/session`, { credentials: 'include' });
    const data = await res.json();
    ui.loading.classList.add('hidden');
    if (data.authenticated) ui.save.classList.remove('hidden');
    else ui.login.classList.remove('hidden');
  } catch (e) {
    ui.loading.classList.add('hidden');
    ui.login.classList.remove('hidden');
  }
}

function setStatus(msg, type) {
  ui.status.innerText = msg;
  ui.status.className = 'status ' + type;
}

document.getElementById('btn-save').onclick = () => {
  setStatus('Scanning...', 'loading');
  chrome.tabs.query({active:true, currentWindow:true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'scrape_page'}, res => {
      const data = res || { url: tabs[0].url, title: tabs[0].title };
      setStatus('Saving...', 'loading');
      chrome.runtime.sendMessage({action: 'save', data}, apiRes => {
        if(apiRes?.success) { setStatus('Saved! ✨', 'success'); setTimeout(()=>window.close(), 1500); }
        else setStatus('Error saving.', 'error');
      });
    });
  });
};

document.getElementById('btn-login').onclick = () => chrome.tabs.create({url: `${BASE}/login`});
document.getElementById('btn-signup').onclick = () => chrome.tabs.create({url: `${BASE}/signup`});
document.getElementById('btn-dashboard').onclick = () => chrome.tabs.create({url: `${BASE}/collections`});

checkAuth();"""

with open("extension/popup.js", "w") as f:
    f.write(popup_js)

# Background JS
background_js = """chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === 'save') {
    fetch('https://www.vara.style/api/save-product', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(req.data)
    })
    .then(r => r.json())
    .then(sendResponse)
    .catch(e => sendResponse({success:false}));
    return true;
  }
});"""

with open("extension/background.js", "w") as f:
    f.write(background_js)

# --- 2. FIX LOGIN PAGE ---
print("💻 Fixing Login Page...")
if not os.path.exists("src/app/login"):
    os.makedirs("src/app/login")

login_page = """'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('return') || '/collections'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(returnUrl)
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${returnUrl}` },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8F0] p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#FB7185]">vara</h1>
          <h2 className="mt-2 text-xl font-medium text-gray-600">Welcome Back</h2>
        </div>
        <button onClick={handleGoogleLogin} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Continue with Google
        </button>
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or continue with email</span></div></div>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#FB7185] focus:outline-none" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#FB7185] focus:outline-none" />
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#FB7185] px-4 py-3 font-bold text-white hover:bg-[#F43F5E] disabled:opacity-50">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-center text-sm text-gray-500">Don't have an account? <a href="/signup" className="font-medium text-[#FB7185] hover:underline">Sign up</a></p>
      </div>
    </div>
  )
}
"""

with open("src/app/login/page.tsx", "w") as f:
    f.write(login_page)

# --- 3. GIT PUSH ---
print("🚀 Pushing to GitHub...")
try:
    # Add all files, including the new placeholder icons
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", "Vara Upgrade: Extension Icons & Login Fix"], check=True)
    subprocess.run(["git", "push", "origin", "main"], check=True)
    print("✅ SUCCESS! Website is updating.")
except subprocess.CalledProcessError as e:
    print(f"❌ Git Error: {e}")

print("\n⚠️ FINAL STEP:")
print("Go to chrome://extensions and Load Unpacked again. It should work now!")
