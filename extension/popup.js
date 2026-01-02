const BASE = 'https://www.vara.style';
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
    if (data.authenticated) {
      ui.save.classList.remove('hidden');
      return true;
    } else {
      ui.login.classList.remove('hidden');
      return false;
    }
  } catch (e) {
    ui.loading.classList.add('hidden');
    ui.login.classList.remove('hidden');
    return false;
  }
}

function setStatus(msg, type) {
  ui.status.innerText = msg;
  ui.status.className = 'status ' + type;
}

document.getElementById('btn-save').onclick = async () => {
  const isAuth = await checkAuth();
  if (!isAuth) {
    chrome.tabs.create({url: `${BASE}/login?return=${encodeURIComponent('/collections')}`});
    return;
  }
  setStatus('Scanning...', 'loading');
  chrome.tabs.query({active:true, currentWindow:true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'scrape_page'}, res => {
      const data = res || { url: tabs[0].url, title: tabs[0].title };
      setStatus('Saving...', 'loading');
      chrome.runtime.sendMessage({action: 'save', data}, apiRes => {
        if(apiRes?.success) { 
          setStatus('Saved! ✨', 'success'); 
          setTimeout(()=>window.close(), 1500); 
        } else { 
          setStatus('Error saving.', 'error'); 
        }
      });
    });
  });
};

document.getElementById('btn-login').onclick = () => chrome.tabs.create({url: `${BASE}/login`});
document.getElementById('btn-signup').onclick = () => chrome.tabs.create({url: `${BASE}/signup`});
document.getElementById('btn-dashboard').onclick = () => chrome.tabs.create({url: `${BASE}/collections`});

checkAuth();
