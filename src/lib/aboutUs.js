import { supabase } from './supabase';

/**
 * Get about us data for a specific website
 * @param {number} websiteId - The website ID
 * @returns {Promise<Object|null>} The about us data or null if not found
 */
export async function getAboutUsData(websiteId) {
  try {
    const { data, error } = await supabase
      .from('about_us')
      .select('*')
      .eq('website_id', websiteId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, return null
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching about us data:', error);
    throw new Error('Gagal mengambil data about us: ' + error.message);
  }
}

/**
 * Update or create about us data for a specific website
 * @param {number} websiteId - The website ID
 * @param {Object} data - The about us data to save
 * @returns {Promise<Object>} The updated/created data
 */
export async function updateAboutUsData(websiteId, data) {
  try {
    // Check if data already exists
    const existingData = await getAboutUsData(websiteId);
    
    if (existingData) {
      // Update existing data
      const { data: updatedData, error } = await supabase
        .from('about_us')
        .update({
          name: data.name,
          description: data.description,
          profile_image: data.profile_image,
          twitter_url: data.twitter_url,
          pinterest_url: data.pinterest_url,
          telegram_url: data.telegram_url,
          instagram_url: data.instagram_url,
          updated_at: new Date().toISOString()
        })
        .eq('website_id', websiteId)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    } else {
      // Create new data
      const { data: newData, error } = await supabase
        .from('about_us')
        .insert({
          website_id: websiteId,
          name: data.name,
          description: data.description,
          profile_image: data.profile_image,
          twitter_url: data.twitter_url,
          pinterest_url: data.pinterest_url,
          telegram_url: data.telegram_url,
          instagram_url: data.instagram_url
        })
        .select()
        .single();

      if (error) throw error;
      return newData;
    }
  } catch (error) {
    console.error('Error updating about us data:', error);
    throw new Error('Gagal menyimpan data about us: ' + error.message);
  }
}

/**
 * Get default about us data
 * @returns {Object} Default about us data
 */
export function getDefaultAboutUsData() {
  return {
    name: 'Dean Mel',
    description: 'Passionate food blogger and culinary enthusiast. Exploring the world one dish at a time.',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
    twitter_url: 'https://x.com/kelantanfoodreview',
    pinterest_url: 'https://pinterest.com/kelantanfoodreview',
    telegram_url: 'https://telegram.me/kelantanfoodreview',
    instagram_url: 'https://instagram.com/kelantanfoodreview'
  };
}
