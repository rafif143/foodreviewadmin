import { supabase } from './supabase';

/**
 * Mengambil komentar yang disetujui untuk sebuah artikel
 * @param {string} articleId - UUID artikel
 * @returns {Promise<Array<{id: string, author_name: string, content: string, created_at: string}>>}
 */
export async function getCommentsByArticle(articleId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, author_name, content, created_at')
    .eq('article_id', articleId)
    .eq('is_approved', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

/**
 * Menambahkan komentar baru ke sebuah artikel
 * @param {string} articleId - UUID artikel
 * @param {string} authorName - Nama penulis komentar
 * @param {string} content - Isi komentar
 * @returns {Promise<boolean>} - True jika sukses
 */
export async function addComment(articleId, authorName, content) {
  const payload = {
    article_id: articleId,
    author_name: authorName?.trim(),
    content: content?.trim()
  };

  const { error } = await supabase
    .from('comments')
    .insert(payload);

  if (error) {
    console.error('Error adding comment:', error);
    return false;
  }

  return true;
}


