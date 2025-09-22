import { supabase } from '$lib/supabase';
import { parseArticleContent } from './contentParser.js';

/**
 * Extract all image URLs from article data
 * @param {Object} article - Article data from database
 * @returns {Array} Array of image URLs
 */
export function extractImageUrls(article) {
  const imageUrls = [];
  
  // Add thumbnail and main image
  if (article.thumbnail_image && isSupabaseStorageUrl(article.thumbnail_image)) {
    imageUrls.push(article.thumbnail_image);
  }
  
  if (article.main_image && isSupabaseStorageUrl(article.main_image)) {
    imageUrls.push(article.main_image);
  }
  
  // Parse content blocks and extract image URLs
  if (article.content) {
    try {
      const contentBlocks = parseArticleContent(article.content);
      contentBlocks.forEach(block => {
        if (block.type === 'image' && block.content && isSupabaseStorageUrl(block.content)) {
          imageUrls.push(block.content);
        }
      });
    } catch (error) {
      console.warn('Error parsing article content for image extraction:', error);
    }
  }
  
  return imageUrls;
}

/**
 * Extract image URLs from form data
 * @param {Object} formData - Form data object
 * @returns {Array} Array of image URLs
 */
export function extractFormImageUrls(formData) {
  const imageUrls = [];
  
  // Add thumbnail and main image
  if (formData.thumbnail_image && isSupabaseStorageUrl(formData.thumbnail_image)) {
    imageUrls.push(formData.thumbnail_image);
  }
  
  if (formData.main_image && isSupabaseStorageUrl(formData.main_image)) {
    imageUrls.push(formData.main_image);
  }
  
  // Extract from content blocks
  if (formData.contentBlocks && Array.isArray(formData.contentBlocks)) {
    formData.contentBlocks.forEach(block => {
      if (block.type === 'image' && block.content && isSupabaseStorageUrl(block.content)) {
        imageUrls.push(block.content);
      }
    });
  }
  
  return imageUrls;
}

/**
 * Check if URL is from Supabase Storage
 * @param {string} url - Image URL to check
 * @returns {boolean} True if URL is from Supabase Storage
 */
export function isSupabaseStorageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  // Check if URL contains Supabase storage pattern
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return false;
  
  return url.includes(supabaseUrl) && url.includes('/storage/v1/object/public/article-images/');
}

/**
 * Extract filename from Supabase Storage URL
 * @param {string} url - Supabase Storage URL
 * @returns {string|null} Filename or null if invalid
 */
export function extractFilenameFromUrl(url) {
  if (!isSupabaseStorageUrl(url)) return null;
  
  try {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  } catch (error) {
    console.warn('Error extracting filename from URL:', url, error);
    return null;
  }
}

/**
 * Delete images from Supabase Storage
 * @param {Array} imageUrls - Array of image URLs to delete
 * @param {string} bucketName - Storage bucket name (default: 'article-images')
 * @returns {Promise<Object>} Result object with success/error counts
 */
export async function deleteImagesFromStorage(imageUrls, bucketName = 'article-images') {
  const result = {
    deleted: 0,
    failed: 0,
    errors: []
  };
  
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return result;
  }
  
  // Extract filenames from URLs
  const filenames = imageUrls
    .map(url => extractFilenameFromUrl(url))
    .filter(filename => filename !== null);
  
  if (filenames.length === 0) {
    return result;
  }
  
  try {
    // Delete files from storage
    const { error } = await supabase.storage
      .from(bucketName)
      .remove(filenames);
    
    if (error) {
      console.warn('Error deleting images from storage:', error);
      result.failed = filenames.length;
      result.errors.push(error.message);
    } else {
      result.deleted = filenames.length;
      console.log(`Successfully deleted ${filenames.length} images from storage`);
    }
    
  } catch (error) {
    console.error('Unexpected error deleting images:', error);
    result.failed = filenames.length;
    result.errors.push(error.message);
  }
  
  return result;
}

/**
 * Delete all images associated with an article
 * @param {Object} article - Article data from database
 * @param {string} bucketName - Storage bucket name (default: 'article-images')
 * @returns {Promise<Object>} Result object with success/error counts
 */
export async function deleteArticleImages(article, bucketName = 'article-images') {
  const imageUrls = extractImageUrls(article);
  return await deleteImagesFromStorage(imageUrls, bucketName);
}

/**
 * Delete images from form data
 * @param {Object} formData - Form data object
 * @param {string} bucketName - Storage bucket name (default: 'article-images')
 * @returns {Promise<Object>} Result object with success/error counts
 */
export async function deleteFormImages(formData, bucketName = 'article-images') {
  const imageUrls = extractFormImageUrls(formData);
  return await deleteImagesFromStorage(imageUrls, bucketName);
}

/**
 * Compare two sets of image URLs and return URLs that need to be deleted
 * @param {Array} oldUrls - Previous image URLs
 * @param {Array} newUrls - Current image URLs
 * @returns {Array} URLs that are in oldUrls but not in newUrls
 */
export function getUrlsToDelete(oldUrls, newUrls) {
  const oldSet = new Set(oldUrls.filter(url => isSupabaseStorageUrl(url)));
  const newSet = new Set(newUrls.filter(url => isSupabaseStorageUrl(url)));
  
  return Array.from(oldSet).filter(url => !newSet.has(url));
}

/**
 * Cleanup unused images when updating article
 * @param {Object} oldArticle - Previous article data
 * @param {Object} newFormData - New form data
 * @param {string} bucketName - Storage bucket name (default: 'article-images')
 * @returns {Promise<Object>} Result object with success/error counts
 */
export async function cleanupUnusedImages(oldArticle, newFormData, bucketName = 'article-images') {
  const oldUrls = extractImageUrls(oldArticle);
  const newUrls = extractFormImageUrls(newFormData);
  const urlsToDelete = getUrlsToDelete(oldUrls, newUrls);
  
  if (urlsToDelete.length === 0) {
    return { deleted: 0, failed: 0, errors: [] };
  }
  
  console.log(`Cleaning up ${urlsToDelete.length} unused images`);
  return await deleteImagesFromStorage(urlsToDelete, bucketName);
}

// Session storage untuk tracking gambar sementara
const TEMP_IMAGES_KEY = 'temp_article_images';

/**
 * Add image URL to temporary tracking
 * @param {string} imageUrl - Image URL to track
 */
export function addTempImage(imageUrl) {
  if (!isSupabaseStorageUrl(imageUrl)) return;
  
  try {
    const tempImages = getTempImages();
    tempImages.add(imageUrl);
    sessionStorage.setItem(TEMP_IMAGES_KEY, JSON.stringify([...tempImages]));
  } catch (error) {
    console.warn('Error adding temp image:', error);
  }
}

/**
 * Remove image URL from temporary tracking
 * @param {string} imageUrl - Image URL to remove from tracking
 */
export function removeTempImage(imageUrl) {
  try {
    const tempImages = getTempImages();
    tempImages.delete(imageUrl);
    sessionStorage.setItem(TEMP_IMAGES_KEY, JSON.stringify([...tempImages]));
  } catch (error) {
    console.warn('Error removing temp image:', error);
  }
}

/**
 * Get all temporary images
 * @returns {Set} Set of temporary image URLs
 */
export function getTempImages() {
  try {
    const stored = sessionStorage.getItem(TEMP_IMAGES_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.warn('Error getting temp images:', error);
  }
  return new Set();
}

/**
 * Clear all temporary images tracking
 */
export function clearTempImages() {
  try {
    sessionStorage.removeItem(TEMP_IMAGES_KEY);
  } catch (error) {
    console.warn('Error clearing temp images:', error);
  }
}

/**
 * Cleanup temporary images that weren't saved
 * @param {Array} savedUrls - URLs that were actually saved
 * @param {string} bucketName - Storage bucket name (default: 'article-images')
 * @returns {Promise<Object>} Result object with success/error counts
 */
export async function cleanupTempImages(savedUrls = [], bucketName = 'article-images') {
  const tempImages = getTempImages();
  const savedSet = new Set(savedUrls.filter(url => isSupabaseStorageUrl(url)));
  
  // Find temp images that weren't saved
  const urlsToDelete = [...tempImages].filter(url => !savedSet.has(url));
  
  if (urlsToDelete.length > 0) {
    console.log(`Cleaning up ${urlsToDelete.length} temporary images`);
    const result = await deleteImagesFromStorage(urlsToDelete, bucketName);
    
    // Clear temp tracking after cleanup
    clearTempImages();
    
    return result;
  }
  
  // Clear temp tracking even if no cleanup needed
  clearTempImages();
  
  return { deleted: 0, failed: 0, errors: [] };
}
