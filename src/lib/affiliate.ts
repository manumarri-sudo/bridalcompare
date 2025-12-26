/**
 * Wrap outbound product URLs with affiliate parameters
 * Configure per-domain affiliate programs here
 */

const AFFILIATE_CONFIGS: Record<string, (url: string) => string> = {
  'aza.com': (url) => {
    // Example: add affiliate ID when ready
    // return `${url}?ref=bridalcompare`;
    return url;
  },
  'kynah.com': (url) => {
    return url;
  },
  'lashkaraa.com': (url) => {
    return url;
  },
  'perniaspopupshop.com': (url) => {
    return url;
  },
  // Add more domains as needed
};

export function wrapOutboundUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    const handler = AFFILIATE_CONFIGS[domain];
    return handler ? handler(url) : url;
  } catch {
    return url;
  }
}
