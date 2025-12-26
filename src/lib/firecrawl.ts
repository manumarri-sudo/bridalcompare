import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().optional(),
  image: z.string().optional(),
  brand: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  description: z.string().optional(),
});

export async function extractProductData(url: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v1/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      urls: [url],
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Product name or title' },
          price: { type: 'string', description: 'Product price with currency symbol' },
          currency: { type: 'string', description: 'Currency code (USD, INR, etc.)' },
          image: { type: 'string', description: 'Main product image URL' },
          brand: { type: 'string', description: 'Designer or brand name' },
          color: { type: 'string', description: 'Primary color of the outfit' },
          material: { type: 'string', description: 'Fabric or material type' },
          description: { type: 'string', description: 'Product description' },
        },
      },
      timeout: 30000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success || !data.data || data.data.length === 0) {
    throw new Error('No data extracted from URL');
  }

  return data.data[0];
}

export function parsePrice(priceString: string | undefined): { number: number | null; currency: string } {
  if (!priceString) return { number: null, currency: 'USD' };

  // Remove common currency symbols and formatting
  const cleaned = priceString.replace(/[₹$,\s]/g, '');
  const number = parseFloat(cleaned);
  
  // Detect currency from original string
  const currency = priceString.includes('₹') ? 'INR' : 
                   priceString.includes('$') ? 'USD' : 
                   'USD';

  return {
    number: isNaN(number) ? null : number,
    currency,
  };
}
