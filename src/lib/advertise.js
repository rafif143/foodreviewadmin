import { supabase } from './supabase';

/**
 * Mendapatkan data advertise untuk website tertentu
 * @param {number} websiteId - ID website
 * @returns {Promise<Object|null>} - Data advertise atau null jika tidak ditemukan
 */
export async function getAdvertiseData(websiteId) {
  const { data, error } = await supabase
    .from('advertise')
    .select('*')
    .eq('website_id', websiteId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows returned
      return null;
    }
    console.error('Error fetching advertise data:', error);
    return null;
  }

  return data;
}

/**
 * Update atau create data advertise
 * @param {number} websiteId - ID website
 * @param {Object} advertiseData - Data advertise yang akan disimpan
 * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
 */
export async function updateAdvertiseData(websiteId, advertiseData) {
  // First check if the record exists
  const { data: existingData, error: checkError } = await supabase
    .from('advertise')
    .select('id')
    .eq('website_id', websiteId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking existing advertise data:', checkError);
    return false;
  }

  if (existingData) {
    // Update existing record
    const { error } = await supabase
      .from('advertise')
      .update({
        ...advertiseData,
        updated_at: new Date().toISOString()
      })
      .eq('website_id', websiteId);

    if (error) {
      console.error('Error updating advertise data:', error);
      return false;
    }
  } else {
    // Create new record
    const { error } = await supabase
      .from('advertise')
      .insert({
        website_id: websiteId,
        ...advertiseData
      });

    if (error) {
      console.error('Error creating advertise data:', error);
      return false;
    }
  }

  return true;
}

/**
 * Mendapatkan data default untuk advertise
 * @returns {Object} - Data default advertise
 */
export function getDefaultAdvertiseData() {
  return {
    page_title: "Iklan & Promosi",
    page_description: "Promosikan bisnis kuliner Anda dengan jangkauan luas di Kelantan",
    introduction: {
      title: "Mengapa Memilih Kami?",
      content: "Dengan jutaan reach di Facebook dan ratusan ribu followers di Instagram, kami adalah partner terpercaya untuk mempromosikan bisnis kuliner Anda ke audiens yang tepat di Kelantan dan seluruh Malaysia."
    },
    packages: [
      {
        name: "Pakej 1",
        label: null,
        price: "RM90",
        platforms: [
          { name: "TikTok", icon_name: "tiktok" },
          { name: "Facebook", icon_name: "facebook" },
          { name: "Instagram", icon_name: "instagram" }
        ],
        order_index: 1
      },
      {
        name: "Pakej 2",
        label: "POPULAR",
        price: "RM150",
        platforms: [
          { name: "TikTok", icon_name: "tiktok" },
          { name: "Facebook", icon_name: "facebook" },
          { name: "Instagram", icon_name: "instagram" }
        ],
        order_index: 2
      },
      {
        name: "Pakej 3",
        label: "PREMIUM",
        price: "RM200",
        platforms: [
          { name: "TikTok", icon_name: "tiktok" },
          { name: "Facebook", icon_name: "facebook" },
          { name: "Instagram", icon_name: "instagram" },
          { name: "X (Twitter)", icon_name: "twitter" },
          { name: "Threads", icon_name: "threads" }
        ],
        order_index: 3
      }
    ],
    contact_info: {
      title: "Hubungi Kami",
      description: "Siap untuk mempromosikan bisnis kuliner Anda? Hubungi kami sekarang untuk konsultasi gratis dan mulai kampanye promosi Anda!",
      form: {
        title: "Kirim Pesan"
      },
      items: [
        {
          type: "Telepon",
          value: "+60 12-345 6789",
          icon_name: "phone"
        },
        {
          type: "Email",
          value: "advertise@kelantanfoodie.com",
          icon_name: "email"
        },
        {
          type: "Lokasi",
          value: "Kota Bharu, Kelantan, Malaysia",
          icon_name: "location"
        }
      ]
    },
    last_updated: "Terakhir diperbarui: " + new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
}


