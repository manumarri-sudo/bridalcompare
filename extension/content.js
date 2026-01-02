chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
});