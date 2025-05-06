import puppeteer from 'puppeteer';
import { Property } from '@app/shared/types';

export async function searchProperties(location: string): Promise<Property[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(`https://www.zillow.com/homes/${encodeURIComponent(location)}`);
    await page.waitForSelector('[data-test="property-card"]', { timeout: 5000 });
    
    const properties = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-test="property-card"]');
      return Array.from(cards).map((card) => {
        const priceEl = card.querySelector('[data-test="property-card-price"]');
        const addressEl = card.querySelector('[data-test="property-card-addr"]');
        const detailsEl = card.querySelector('[data-test="property-card-details"]');
        const imgEl = card.querySelector('img');
        
        const price = priceEl ? parseInt(priceEl.textContent?.replace(/[^0-9]/g, '') || '0') : 0;
        const address = addressEl?.textContent?.trim() || '';
        const details = detailsEl?.textContent?.trim() || '';
        const imageUrl = imgEl?.getAttribute('src') || '';
        
        // Parse details string for bedrooms, bathrooms, and square feet
        const bedsMatch = details.match(/(\d+)\s*bed/i);
        const bathsMatch = details.match(/(\d+(?:\.\d+)?)\s*bath/i);
        const sqftMatch = details.match(/(\d+(?:,\d+)?)\s*sqft/i);
        
        return {
          id: Math.random().toString(36).substring(2),
          address,
          price,
          bedrooms: bedsMatch ? parseInt(bedsMatch[1]) : 0,
          bathrooms: bathsMatch ? parseFloat(bathsMatch[1]) : 0,
          squareFeet: sqftMatch ? parseInt(sqftMatch[1].replace(',', '')) : 0,
          yearBuilt: new Date().getFullYear(), // Default to current year since Zillow doesn't show this on cards
          description: details,
          imageUrl,
          createdAt: new Date()
        };
      });
    });
    
    return properties.filter(p => p.price > 0 && p.address);
  } finally {
    await browser.close();
  }
}

export async function getZillowData(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    
    // Add your Zillow scraping logic here
    
    await browser.close();
  } catch (error) {
    await browser.close();
    throw error;
  }
}