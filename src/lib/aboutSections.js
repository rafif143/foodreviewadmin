import { supabase } from './supabase';

/**
 * Mendapatkan konten about section berdasarkan kategori
 * @param {number} websiteId - ID website
 * @param {string} category - Kategori (food, cafe, events, recipe, things-to-do)
 * @param {boolean} includeInactive - Apakah termasuk data yang nonaktif
 * @returns {Promise<Object|null>} - Konten about section atau null jika tidak ditemukan
 */
export async function getAboutSection(websiteId, category, includeInactive = false) {
  let query = supabase
    .from('about_sections')
    .select('content, is_active')
    .eq('website_id', websiteId)
    .eq('category', category);

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    console.error('Error fetching about section:', error);
    return null;
  }

  return data?.content || null;
}

/**
 * Mendapatkan status aktif about section
 * @param {number} websiteId - ID website
 * @param {string} category - Kategori
 * @returns {Promise<boolean>} - Status aktif
 */
export async function getAboutSectionStatus(websiteId, category) {
  const { data, error } = await supabase
    .from('about_sections')
    .select('is_active')
    .eq('website_id', websiteId)
    .eq('category', category)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return false;
    }
    console.error('Error fetching about section status:', error);
    return false;
  }

  return data?.is_active || false;
}

/**
 * Mendapatkan semua about sections untuk website tertentu
 * @param {number} websiteId - ID website
 * @returns {Promise<Array>} - Array berisi semua about sections
 */
export async function getAllAboutSections(websiteId) {
  const { data, error } = await supabase
    .from('about_sections')
    .select('category, content, is_active')
    .eq('website_id', websiteId)
    .eq('is_active', true)
    .order('category');

  if (error) {
    console.error('Error fetching all about sections:', error);
    return [];
  }

  return data || [];
}

/**
 * Update konten about section
 * @param {number} websiteId - ID website
 * @param {string} category - Kategori
 * @param {Object} content - Konten baru (title, description, tips_title, tips_description)
 * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
 */
export async function updateAboutSection(websiteId, category, content) {
  // First check if the record exists
  const { data: existingData, error: checkError } = await supabase
    .from('about_sections')
    .select('id')
    .eq('website_id', websiteId)
    .eq('category', category)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking existing about section:', checkError);
    return false;
  }

  if (existingData) {
    // Update existing record
    const { error } = await supabase
      .from('about_sections')
      .update({ 
        content: content,
        updated_at: new Date().toISOString()
      })
      .eq('website_id', websiteId)
      .eq('category', category);

    if (error) {
      console.error('Error updating about section:', error);
      return false;
    }
  } else {
    // Create new record
    const { error } = await supabase
      .from('about_sections')
      .insert({
        website_id: websiteId,
        category: category,
        content: content,
        is_active: true
      });

    if (error) {
      console.error('Error creating about section:', error);
      return false;
    }
  }

  return true;
}

/**
 * Toggle status aktif/nonaktif about section
 * @param {number} websiteId - ID website
 * @param {string} category - Kategori
 * @param {boolean} isActive - Status aktif yang diinginkan
 * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
 */
export async function toggleAboutSection(websiteId, category, isActive) {
  // First check if the record exists
  const { data: existingData, error: checkError } = await supabase
    .from('about_sections')
    .select('id')
    .eq('website_id', websiteId)
    .eq('category', category)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking existing about section:', checkError);
    return false;
  }

  if (existingData) {
    // Update existing record
    const { error } = await supabase
      .from('about_sections')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('website_id', websiteId)
      .eq('category', category);

    if (error) {
      console.error('Error toggling about section:', error);
      return false;
    }
  } else {
    // Create new record with default content
    const defaultContent = getDefaultAboutContent(category);
    const { error } = await supabase
      .from('about_sections')
      .insert({
        website_id: websiteId,
        category: category,
        content: defaultContent,
        is_active: isActive
      });

    if (error) {
      console.error('Error creating about section:', error);
      return false;
    }
  }

  return true;
}

/**
 * Mendapatkan konten default jika tidak ada data di database
 * @param {string} category - Kategori
 * @returns {Object} - Konten default
 */
export function getDefaultAboutContent(category) {
  const defaults = {
    food: {
      title: "Tentang Kuliner Kelantan",
      description: "Kelantan dikenal sebagai Pearl of the Orient dan merupakan surga kuliner Malaysia. Makanan di sini adalah perpaduan sempurna dari budaya Melayu, Cina, India, dan Peranakan.\n\nDari street food legendaris hingga restoran fine dining, setiap hidangan memiliki cerita dan cita rasa yang unik yang mencerminkan keragaman budaya Kelantan.",
      tips_title: "🍽️ Tips Makan",
      tips_description: "Coba makanan di pagi hari untuk mendapatkan rasa terbaik. Street food di Kelantan biasanya lebih segar dan lezat di pagi hari."
    },
    cafe: {
      title: "Tentang Cafe Kelantan",
      description: "Kelantan tidak hanya terkenal dengan makanan tradisional, tetapi juga memiliki scene cafe yang berkembang pesat. Cafe-cafe di sini menawarkan perpaduan unik antara kopi modern dan suasana tradisional Melayu.",
      tips_title: "☕ Tips Cafe",
      tips_description: "Kunjungi cafe di pagi hari untuk mendapatkan suasana yang lebih tenang dan kopi yang baru diseduh. Jangan lupa coba kopi lokal Kelantan!"
    },
    events: {
      title: "Tentang Event Kuliner Kelantan",
      description: "Kelantan adalah pusat berbagai event kuliner yang menarik sepanjang tahun. Dari festival makanan tradisional hingga kompetisi memasak, setiap event menampilkan kekayaan kuliner dan budaya Kelantan.",
      tips_title: "🎉 Tips Event",
      tips_description: "Pantau kalender event kuliner Kelantan dan daftar lebih awal untuk mendapatkan harga terbaik. Bawa kamera untuk mengabadikan momen spesial!"
    },
    recipe: {
      title: "Tentang Resep Kelantan",
      description: "Resep-resep Kelantan adalah warisan berharga yang diturunkan dari generasi ke generasi. Setiap resep memiliki cerita dan teknik memasak yang unik yang mencerminkan keahlian dan kreativitas koki Kelantan.",
      tips_title: "👨‍🍳 Tips Memasak",
      tips_description: "Gunakan bahan-bahan segar dan rempah-rempah asli Kelantan untuk mendapatkan rasa autentik. Jangan ragu untuk menyesuaikan bumbu sesuai selera!"
    },
    'things-to-do': {
      title: "Tentang Aktivitas Kuliner Kelantan",
      description: "Kelantan menawarkan berbagai aktivitas kuliner yang menarik untuk semua usia. Dari cooking class tradisional hingga food tour, setiap aktivitas memberikan pengalaman unik untuk memahami dan menikmati kuliner Kelantan.",
      tips_title: "🎯 Tips Aktivitas",
      tips_description: "Pilih aktivitas yang sesuai dengan minat dan waktu Anda. Booking lebih awal untuk aktivitas populer dan siapkan pakaian yang nyaman!"
    }
  };

  return defaults[category] || defaults.food;
}
