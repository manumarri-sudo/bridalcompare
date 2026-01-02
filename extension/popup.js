
const BASE = 'https://www.vara.style';

// UI Elements
const ui = {
  loading: document.getElementById('view-loading'),
  login: document.getElementById('view-login'),
  save: document.getElementById('view-save'),
  msg: document.getElementById('status-msg'),
  saveBtn: document.getElementById('btn-save')
};

function show(view) {
  if (ui.loading) ui.loading.classList.add('hidden');
  if (ui.login) ui.login.classList.add('hidden');
  if (ui.save) ui.save.classList.add('hidden');
  if (view) view.classList.remove('hidden');
}

function feedback(text, type='neutral') {
  if (!ui.msg) return;
  ui.msg.classList.remove('hidden');
  // Dynamic color for success/error
  const color = type === 'error' ? '#EF4444' : '#10B981';
  ui.msg.innerHTML = `<div class="status-box" style="color:${color}; font-weight:600;">${text}</div>`;
}

async function checkAuth() {
  try {
    const res = await fetch(`${BASE}/api/auth/session`);
    if (res.status === 404) {
      show(ui.login);
      return;
    }
    const data = await res.json();
    if (data.authenticated) {
      show(ui.save);
    } else {
      show(ui.login);
    }
  } catch (e) {
    show(ui.login);
  }
}

// Helper for safe listeners
function addListener(id, url) {
  const el = document.getElementById(id);
  if (el) el.onclick = () => chrome.tabs.create({ url: url });
}

addListener('btn-login', `${BASE}/login`);
addListener('btn-signup', `${BASE}/signup`);
addListener('btn-dashboard', `${BASE}/collections`);

if (ui.saveBtn) {
  ui.saveBtn.onclick = async () => {
    ui.saveBtn.innerText = "Saving...";
    ui.saveBtn.disabled = true;
    
    chrome.tabs.query({active:true, currentWindow:true}, tabs => {
      const tab = tabs[0];
      const payload = { url: tab.url };

      chrome.runtime.sendMessage({action: 'save', data: payload}, res => {
        ui.saveBtn.innerText = "♡ Save to My Collection";
        ui.saveBtn.disabled = false;

        if(res && res.success) {
          feedback("Safely stored in your wardrobe! 💖", 'success');
          setTimeout(() => window.close(), 2000);
        } else {
          feedback("Oops! We couldn't save that. Try again?", 'error');
        }
      });
    });
  };
}

// Start
checkAuth();
