chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
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
});