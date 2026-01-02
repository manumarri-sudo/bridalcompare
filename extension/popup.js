const BASE_URL = 'https://www.vara.style';

async function checkAuth() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/session`, { credentials: 'include' });
    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

async function getCurrentUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0].url);
    });
  });
}

function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  status.classList.remove('hidden');
  if (type === 'success' || type === 'error') {
    setTimeout(() => status.classList.add('hidden'), 3000);
  }
}

async function init() {
  const authCheck = document.getElementById('auth-check');
  const notLoggedIn = document.getElementById('not-logged-in');
  const loggedIn = document.getElementById('logged-in');
  authCheck.classList.remove('hidden');
  const isAuthenticated = await checkAuth();
  authCheck.classList.add('hidden');
  if (isAuthenticated) {
    loggedIn.classList.remove('hidden');
  } else {
    notLoggedIn.classList.remove('hidden');
  }
}

document.getElementById('login-btn')?.addEventListener('click', async () => {
  chrome.tabs.create({ url: `${BASE_URL}/login` });
  window.close();
});

document.getElementById('signup-btn')?.addEventListener('click', async () => {
  chrome.tabs.create({ url: `${BASE_URL}/signup` });
  window.close();
});

document.getElementById('save-btn')?.addEventListener('click', async () => {
  showStatus('Saving...', 'loading');
  try {
    const currentUrl = await getCurrentUrl();
    const response = await chrome.runtime.sendMessage({ action: 'saveProduct', url: currentUrl });
    
    console.log('Response:', response);
    
    if (response.success) {
      if (response.alreadySaved) {
        showStatus('✓ Already in your collection!', 'success');
      } else {
        const product = response.product;
        showStatus(`✓ Saved: ${product.title}`, 'success');
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Saved to Vara!',
          message: `${product.designer} - ₹${product.price_number || 'Price N/A'}`
        });
      }
    } else if (response.error === 'LIMIT_REACHED') {
      showStatus('Limit reached! Upgrade', 'error');
      setTimeout(() => {
        chrome.tabs.create({ url: `${BASE_URL}/billing` });
      }, 1500);
    } else {
      showStatus(response.error || 'Failed to save', 'error');
    }
  } catch (error) {
    console.error('Save failed:', error);
    showStatus('Error: ' + error.message, 'error');
  }
});

document.getElementById('view-btn')?.addEventListener('click', () => {
  chrome.tabs.create({ url: `${BASE_URL}/collections/inbox` });
  window.close();
});

init();
