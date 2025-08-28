import { selectedWebsite } from '$lib/stores/websiteStore.js';
import { browser } from '$app/environment';

export async function load({ url }) {
  // Jika di browser dan mengakses halaman admin tanpa website yang dipilih
  if (browser && url.pathname.startsWith('/admin') && url.pathname !== '/admin/select-website') {
    // Check if website is selected in store
    let hasSelectedWebsite = false;
    selectedWebsite.subscribe(value => {
      hasSelectedWebsite = !!value;
    })();
    
    if (!hasSelectedWebsite) {
      return {
        redirect: '/admin/select-website'
      };
    }
  }

  return {};
}
