// Test file untuk websiteStore.js
import { selectedWebsite, setWebsite, loadWebsiteFromStorage, clearWebsite, hasWebsite } from './websiteStore.js';

// Test basic functionality
console.log('Testing websiteStore...');

// Test initial state
console.log('Initial selectedWebsite:', $selectedWebsite);

// Test setWebsite
const testWebsite = {
  id: 1,
  name: 'Test Website',
  slug: 'test-website',
  description: 'This is a test website'
};

setWebsite(testWebsite);
console.log('After setWebsite:', $selectedWebsite);

// Test loadWebsiteFromStorage
const loadedWebsite = loadWebsiteFromStorage();
console.log('Loaded website from storage:', loadedWebsite);

// Test hasWebsite
const hasWebsiteResult = hasWebsite();
console.log('Has website:', hasWebsiteResult);

// Test clearWebsite
clearWebsite();
console.log('After clearWebsite:', $selectedWebsite);

console.log('Website store test completed!');
