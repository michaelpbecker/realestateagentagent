import puppeteer from 'puppeteer';
import { Property } from '@shared/types';

export async function searchProperties(location: string): Promise<Property[]> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Format the search URL
    const searchUrl = `https://www.zillow.com/homes/${encodeURIComponent(location)}_rb/`;
    await page.goto(searchUrl, { waitUntil: 'networkidle0' });

    // Wait for the property cards to load
    await page.waitForSelector('[data-test="property-card"]', { timeout: 10000 });

    // Extract property information
    const properties = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-test="property-card"]');
      return Array.from(cards).map((card) => {
        const priceElement = card.querySelector('[data-test="property-card-price"]');
        const addressElement = card.querySelector('[data-test="property-card-addr"]');
        const imageElement = card.querySelector('img');
        
        const price = priceElement ? 
          parseInt(priceElement.textContent?.replace(/[^0-9]/g, '') || '0') : 0;
        
        return {
          id: card.getAttribute('id') || Math.random().toString(),
          address: addressElement?.textContent?.trim() || '',
          price,
          imageUrl: imageElement?.getAttribute('src') || '',
          zpid: card.getAttribute('data-zpid') || '',
          beds: 0,
          baths: 0,
          sqft: 0,
          lotSize: 0,
          yearBuilt: 0,
          zestimate: 0
        };
      });
    });

    return properties.filter(p => p.price > 0 && p.address);
  } catch (error) {
    console.error('Zillow scraping error:', error);
    return [];
  } finally {
    await browser.close();
  }
}
