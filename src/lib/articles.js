import { supabase } from './supabase';

/**
 * Mendapatkan semua artikel berdasarkan website_id dan kategori
 * @param {number} websiteId - ID website
 * @param {string} category - Kategori artikel (food, cafe, events, recipe, things-to-do)
 * @param {number} limit - Jumlah artikel yang akan diambil
 * @param {number} offset - Offset untuk pagination
 * @param {boolean} sortByVisit - Jika true, urutkan berdasarkan visit_count
 * @returns {Promise<Array>} - Array berisi artikel
 */
export async function getArticlesByCategory(websiteId, category, limit = 10, offset = 0, sortByVisit = false) {
  let query = supabase
    .from('articles')
    .select('id, title, slug, author, minute_read, category, thumbnail_image, summary, published_at, visit_count, tags, labels')
    .eq('website_id', websiteId)
    .eq('is_published', true);
    
  // Filter berdasarkan kategori jika ada
  if (category) {
    query = query.eq('category', category);
  }
  
  // Urutkan berdasarkan visit_count atau published_at
  if (sortByVisit) {
    query = query.order('visit_count', { ascending: false });
  } else {
    query = query.order('published_at', { ascending: false });
  }
  
  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }

  return data;
}

/**
 * Mendapatkan artikel berdasarkan slug
 * @param {number} websiteId - ID website
 * @param {string} slug - Slug artikel
 * @returns {Promise<Object|null>} - Artikel atau null jika tidak ditemukan
 */
export async function getArticleBySlug(websiteId, slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('website_id', websiteId)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }

  return data;
}

/**
 * Mendapatkan artikel berdasarkan ID
 * @param {number} websiteId - ID website
 * @param {string} id - ID artikel
 * @returns {Promise<Object|null>} - Artikel atau null jika tidak ditemukan
 */
export async function getArticleById(websiteId, id) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('website_id', websiteId)
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching article by id:', error);
    return null;
  }

  return data;
}

/**
 * Menambah jumlah kunjungan (visit_count) untuk artikel
 * @param {string} id - ID artikel
 * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
 */
export async function incrementArticleVisit(id) {
  // Ambil visit_count saat ini
  const { data: article, error: fetchError } = await supabase
    .from('articles')
    .select('visit_count')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching article visit count:', fetchError);
    return false;
  }

  // Tambah visit_count dengan 1
  const newVisitCount = (article.visit_count || 0) + 1;
  
  // Update visit_count
  const { error: updateError } = await supabase
    .from('articles')
    .update({ visit_count: newVisitCount })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating article visit count:', updateError);
    return false;
  }

  return true;
}

/**
 * Mendapatkan artikel terkait berdasarkan kategori
 * @param {number} websiteId - ID website
 * @param {string} category - Kategori artikel
 * @param {string} currentArticleId - ID artikel saat ini (untuk dikecualikan)
 * @param {number} limit - Jumlah artikel yang akan diambil
 * @returns {Promise<Array>} - Array berisi artikel terkait
 */
export async function getRelatedArticles(websiteId, category, currentArticleId, limit = 4) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, author, minute_read, category, thumbnail_image, summary, published_at, tags, labels')
    .eq('website_id', websiteId)
    .eq('category', category)
    .eq('is_published', true)
    .neq('id', currentArticleId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }

  return data;
}

/**
 * Mendapatkan artikel terbaru dari semua kategori
 * @param {number} websiteId - ID website
 * @param {number} limit - Jumlah artikel yang akan diambil
 * @returns {Promise<Array>} - Array berisi artikel terbaru
 */
export async function getLatestArticles(websiteId, limit = 6) {
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, author, minute_read, category, thumbnail_image, summary, published_at, tags, labels')
    .eq('website_id', websiteId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }

  return data;
}

/**
 * Mendapatkan jumlah total artikel berdasarkan kategori
 * @param {number} websiteId - ID website
 * @param {string} category - Kategori artikel
 * @returns {Promise<number>} - Jumlah total artikel
 */
export async function getArticleCount(websiteId, category) {
  const { count, error } = await supabase
    .from('articles')
    .select('id', { count: 'exact' })
    .eq('website_id', websiteId)
    .eq('category', category)
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching article count:', error);
    return 0;
  }

  return count;
}

/**
 * Mencari artikel berdasarkan kata kunci
 * @param {number} websiteId - ID website
 * @param {string} query - Kata kunci pencarian
 * @param {number} limit - Jumlah artikel yang akan diambil
 * @returns {Promise<Array>} - Array berisi hasil pencarian
 */
export async function searchArticles(websiteId, query, limit = 10) {
  // Supabase tidak mendukung full-text search secara native
  // Ini adalah implementasi sederhana dengan ILIKE
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, author, minute_read, category, thumbnail_image, summary, published_at, tags, labels')
    .eq('website_id', websiteId)
    .eq('is_published', true)
    .or(`title.ilike.%${query}%, summary.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error searching articles:', error);
    return [];
  }

  return data;
}