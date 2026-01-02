const BASE = 'https://www.vara.style';
const ui = {
  loading: document.getElementById('view-loading'),
  login: document.getElementById('view-login'),
  save: document.getElementById('view-save'),
  msg: document.getElementById('status-msg'),
  saveBtn: document.getElementById('btn-save')
};

function show(view) {
  [ui.loading, ui.login, ui.save].forEach(el => el.classList.add('hidden'));
  view.classList.remove('hidden');
}

function feedback(text, type='neutral') {
  ui.msg.classList.remove('hidden');
  ui.msg.innerHTML = `<div class="status-box" style="color:${type==='error'?'#EF4444':'#10B981'}">${text}</div>`;
}

async function checkAuth() {
  try {
    const res = await fetch(`${BASE}/api/auth/session`);
    const data = await res.json();
    if (data.authenticated) {
      show(ui.save);
      return true;
    } else {
      show(ui.login);
      return false;
    }
  } catch (e) {
    show(ui.login);
    return false;
  }
}

document.getElementById('btn-save').onclick = async () => {
  ui.saveBtn.innerText = "Saving...";
  ui.saveBtn.disabled = true;
  
  chrome.tabs.query({active:true, currentWindow:true}, tabs => {
    const tab = tabs[0];
    const payload = {
      url: tab.url,
      title: tab.title
    };

    chrome.runtime.sendMessage({action: 'save', data: payload}, res => {
      ui.saveBtn.innerText = "♡ Save to Collection";
      ui.saveBtn.disabled = false;

      if(res && res.success) {
        feedback("Lovely! We've saved this for you. ✨", 'success');
        setTimeout(() => window.close(), 2000);
      } else {
        feedback("Oh no, we had trouble saving that. Please try again.", 'error');
      }
    });
  });
};

document.getElementById('btn-login').onclick = () => chrome.tabs.create({url: `${BASE}/login`});
document.getElementById('btn-signup').onclick = () => chrome.tabs.create({url: `${BASE}/signup`});
document.getElementById('btn-dashboard').onclick = () => chrome.tabs.create({url: `${BASE}/collections`});

checkAuth();
