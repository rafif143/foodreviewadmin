import { supabase } from './supabase';

// Default website untuk Kelantan Food Review - hardcode saja
export const DEFAULT_WEBSITE = {
  id: 1,
  name: 'Kelantan Food Review',
  slug: 'kelantan-food-review',
  description: 'Platform review makanan terbaik di Kelantan'
};

// Tenant object untuk kompatibilitas dengan admin panel
export const tenant = {
  getWebsiteId: () => DEFAULT_WEBSITE.id,
  getWebsite: () => DEFAULT_WEBSITE,
  getWebsiteBySlug: (slug) => DEFAULT_WEBSITE,
  getWebsiteById: (id) => DEFAULT_WEBSITE
};

/**
 * Mendapatkan informasi website berdasarkan ID
 * @param {number} id - ID website
 * @returns {Object} - Informasi website (hardcode)
 */
export function getWebsiteById(id = DEFAULT_WEBSITE.id) {
  // Hardcode saja, tidak perlu query database
  return DEFAULT_WEBSITE;
}

/**
 * Mendapatkan informasi website berdasarkan slug
 * @param {string} slug - Slug website dari URL
 * @returns {Object} - Informasi website (hardcode)
 */
export function getWebsiteBySlug(slug) {
  // Hardcode saja, tidak perlu query database
  return DEFAULT_WEBSITE;
}

/**
 * Mendapatkan semua website yang terdaftar
 * @returns {Array} - Array berisi website default saja
 */
export function getAllWebsites() {
  // Hardcode saja, tidak perlu query database
  return [DEFAULT_WEBSITE];
}

/**
 * Mendapatkan context website dari path URL
 * @param {string} path - Full path URL (e.g., "/kelantan-food-review/about")
 * @returns {Object} - Website context dan clean path
 */
export function getWebsiteContext(path) {
  // Hapus leading slash jika ada
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Split path untuk mendapatkan slug website
  const pathParts = cleanPath.split('/');
  const websiteSlug = pathParts[0];

  // Gunakan website default saja
  const website = DEFAULT_WEBSITE;

  // Path bersih tanpa slug website
  const cleanRoutePath = pathParts.slice(1).join('/');

  return {
    website,
    path: cleanRoutePath
  };
}

/**
 * Helper untuk membuat URL dengan slug website
 * @param {Object} website - Informasi website
 * @param {string} path - Path yang akan ditambahkan
 * @returns {string} - URL lengkap dengan slug website
 */
export function createWebsiteUrl(website = DEFAULT_WEBSITE, path = '') {
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `/${website.slug}/${cleanPath}`;
}

/**
 * Validasi apakah sebuah path valid untuk website tertentu
 * @param {string} path - Path yang akan divalidasi
 * @param {Object} website - Informasi website
 * @returns {boolean} - True jika path valid untuk website tersebut
 */
export function isValidWebsitePath(path, website = DEFAULT_WEBSITE) {
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const pathParts = cleanPath.split('/');
  return pathParts[0] === website.slug;
}