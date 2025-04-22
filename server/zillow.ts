import puppeteer from 'puppeteer';
import { Property } from '@shared/types';

export async function searchProperties(location: string): Promise<Property[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Format the search URL
    const searchUrl = `https://www.zillow.com/homes/${encodeURIComponent(location)}_rb/`;
    console.log('Searching Zillow URL:', searchUrl);

    await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('Page loaded successfully');

    // Wait for the property cards to load
    await page.waitForSelector('[data-test="property-card"]', { timeout: 10000 });
    console.log('Found property cards');

    // Extract property information
    const properties = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-test="property-card"]');
      console.log('Number of cards found:', cards.length);

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

    console.log('Extracted properties:', properties.length);
    return properties.filter(p => p.price > 0 && p.address);
  } catch (error) {
    console.error('Zillow scraping error:', error);
    return [];
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