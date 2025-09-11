// Simple Ads Configuration untuk User-Side Only
import { supabase } from './supabase';

// Cache untuk ads config
let adsConfigCache = new Map();

/**
 * Mendapatkan konfigurasi ads untuk website tertentu
 * @param {number} websiteId - ID website
 * @returns {Promise<Object>} - Konfigurasi ads
 */
export async function getAdsConfig(websiteId) {
  // Cek cache dulu
  if (adsConfigCache.has(websiteId)) {
    return adsConfigCache.get(websiteId);
  }

  try {
    const { data, error } = await supabase
      .from('website_ads_config')
      .select('*')
      .eq('website_id', websiteId)
      .single();

    if (error || !data) {
      // Fallback ke default config (ads disabled)
      const defaultConfig = {
        website_id: websiteId,
        ads_enabled: false,
        google_adsense_client_id: null,
        google_adsense_slot_id: null,
        ad_placements: {
          header: { enabled: false, type: 'banner' },
          sidebar: { enabled: false, type: 'banner' },
          content: { enabled: false, type: 'banner' },
          footer: { enabled: false, type: 'banner' }
        },
        ad_frequency: 1
      };
      
      adsConfigCache.set(websiteId, defaultConfig);
      return defaultConfig;
    }

    // Simpan ke cache
    adsConfigCache.set(websiteId, data);
    return data;
  } catch (error) {
    console.warn(`Error fetching ads config for website ${websiteId}:`, error.message);
    return {
      website_id: websiteId,
      ads_enabled: false,
      google_adsense_client_id: null,
      google_adsense_slot_id: null,
      ad_placements: {},
      ad_frequency: 1
    };
  }
}

/**
 * Mendapatkan ads content untuk website tertentu
 * @param {number} websiteId - ID website
 * @param {string} adType - Jenis ads ('banner', 'sidebar', 'in-article', 'popup')
 * @param {string} position - Posisi ads ('header', 'footer', 'sidebar', 'content')
 * @returns {Promise<Array>} - Array ads content
 */
export async function getAdsContent(websiteId, adType = null, position = null) {
  try {
    let query = supabase
      .from('ads_content')
      .select('*')
      .eq('website_id', websiteId)
      .eq('is_active', true);

    if (adType) {
      query = query.eq('ad_type', adType);
    }

    if (position) {
      query = query.eq('position', position);
    }

    const { data, error } = await query;

    if (error) {
      console.warn(`Error fetching ads content for website ${websiteId}:`, error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn(`Error fetching ads content for website ${websiteId}:`, error.message);
    return [];
  }
}

/**
 * Generate Google AdSense script
 * @param {string} clientId - Google AdSense Client ID
 * @returns {string} - AdSense script HTML
 */
export function generateAdSenseScript(clientId) {
  if (!clientId) return '';
  
  return `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}"
            crossorigin="anonymous"></script>
  `;
}

/**
 * Generate AdSense ad unit
 * @param {string} clientId - Google AdSense Client ID
 * @param {string} slotId - AdSense Slot ID
 * @param {string} adFormat - Ad format ('auto', 'rectangle', 'vertical', 'horizontal')
 * @param {string} adStyle - CSS styling
 * @returns {string} - AdSense ad unit HTML
 */
export function generateAdSenseAd(clientId, slotId, adFormat = 'auto', adStyle = 'display:block') {
  if (!clientId || !slotId) return '';
  
  return `
    <ins class="adsbygoogle"
         style="${adStyle}"
         data-ad-client="${clientId}"
         data-ad-slot="${slotId}"
         data-ad-format="${adFormat}"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  `;
}

/**
 * Check if ads should be displayed based on conditions
 * @param {Object} adContent - Ads content object
 * @param {Object} pageData - Current page data
 * @returns {boolean} - Whether ads should be displayed
 */
export function shouldDisplayAd(adContent, pageData = {}) {
  if (!adContent.display_conditions) return true;
  
  const conditions = adContent.display_conditions;
  
  // Check page type conditions
  if (conditions.page_types && conditions.page_types.length > 0) {
    if (!conditions.page_types.includes(pageData.pageType)) {
      return false;
    }
  }
  
  // Check category conditions
  if (conditions.categories && conditions.categories.length > 0) {
    if (!conditions.categories.includes(pageData.category)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Clear ads config cache
 * @param {number} websiteId - Website ID (optional)
 */
export function clearAdsCache(websiteId = null) {
  if (websiteId) {
    adsConfigCache.delete(websiteId);
  } else {
    adsConfigCache.clear();
  }
}
