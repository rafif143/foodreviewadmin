import { writable } from 'svelte/store';

// Create the website store
export const selectedWebsite = writable(null);

// Function to set website from localStorage
export function loadWebsiteFromStorage() {
  if (typeof window !== 'undefined') {
    const storedWebsite = localStorage.getItem('selectedWebsite');
    if (storedWebsite) {
      try {
        const website = JSON.parse(storedWebsite);
        selectedWebsite.set(website);
        return website;
      } catch (e) {
        console.error('Error parsing stored website:', e);
        localStorage.removeItem('selectedWebsite');
        selectedWebsite.set(null);
        return null;
      }
    }
  }
  return null;
}

// Function to set website and save to localStorage
export function setWebsite(website) {
  if (website) {
    localStorage.setItem('selectedWebsite', JSON.stringify(website));
  } else {
    localStorage.removeItem('selectedWebsite');
  }
  selectedWebsite.set(website);
}

// Function to clear website selection
export function clearWebsite() {
  localStorage.removeItem('selectedWebsite');
  selectedWebsite.set(null);
}

// Function to check if website is selected
export function hasWebsite() {
  let hasWebsite = false;
  selectedWebsite.subscribe(value => {
    hasWebsite = !!value;
  })();
  return hasWebsite;
}
