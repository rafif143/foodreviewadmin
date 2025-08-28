import { json } from '@sveltejs/kit';
import { getArticlesByCategory } from '$lib/articles';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const websiteId = url.searchParams.get('websiteId');
  const category = url.searchParams.get('category');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  if (!websiteId) {
    return json({ error: 'websiteId is required' }, { status: 400 });
  }
  
  if (!category) {
    return json({ error: 'category is required' }, { status: 400 });
  }
  
  try {
    const articles = await getArticlesByCategory(websiteId, category, offset, limit);
    return json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}