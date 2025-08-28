import { supabase } from './supabase.js';

// Get about us data for a specific website
export async function getAboutUsData(websiteId) {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .eq('website_id', websiteId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching about us data:', error);
    throw error;
  }
}

// Update about us data
export async function updateAboutUsData(websiteId, aboutData) {
  try {
    // Check if record exists
    const { data: existingData, error: checkError } = await supabase
      .from('about')
      .select('id')
      .eq('website_id', websiteId)
      .single();

    let result;
    
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('about')
        .update({
          tentang_kami: aboutData.tentang_kami || {},
          cerita_kami: aboutData.cerita_kami || {},
          image: aboutData.image || {},
          misi: aboutData.misi || {},
          visi: aboutData.visi || {},
          nilai_nilai: aboutData.nilai_nilai || {},
          tim: aboutData.tim || {},
          key_stats: aboutData.key_stats || {},
          last_updated: aboutData.last_updated || '',
          updated_at: new Date().toISOString()
        })
        .eq('website_id', websiteId)
        .select();

      if (error) throw error;
      result = data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('about')
        .insert({
          website_id: websiteId,
          tentang_kami: aboutData.tentang_kami || {},
          cerita_kami: aboutData.cerita_kami || {},
          image: aboutData.image || {},
          misi: aboutData.misi || {},
          visi: aboutData.visi || {},
          nilai_nilai: aboutData.nilai_nilai || {},
          tim: aboutData.tim || {},
          key_stats: aboutData.key_stats || {},
          last_updated: aboutData.last_updated || ''
        })
        .select();

      if (error) throw error;
      result = data;
    }

    return result[0];
  } catch (error) {
    console.error('Error updating about us data:', error);
    throw error;
  }
}

// Upload image to Supabase storage
export async function uploadAboutUsImage(file, fileName) {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `about_us/images/${fileName}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('about_us')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('about_us')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Delete image from Supabase storage
export async function deleteAboutUsImage(filePath) {
  try {
    // If filePath is already a full path, use it directly
    // If it's just a filename, construct the full path
    let fullPath = filePath;
    if (!filePath.includes('about_us/images/')) {
      fullPath = `about_us/images/${filePath}`;
    }

    const { error } = await supabase.storage
      .from('about_us')
      .remove([fullPath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// Get default about us data structure
export function getDefaultAboutUsData() {
  return {
    tentang_kami: {
      title: "",
      description: ""
    },
    cerita_kami: {
      title: "",
      content: ""
    },
    image: {
      url: "",
      title: "Tim Kelantan Food Review",
      subtitle: "Passionate Food Explorers"
    },
    misi: {
      title: "Misi Kami",
      content: "Menjadi platform terpercaya yang menghubungkan pecinta kuliner dengan pengalaman makan terbaik di Kelantan, sambil melestarikan dan mempromosikan kekayaan kuliner Malaysia.",
      icon_name: "check-circle"
    },
    visi: {
      title: "Visi Kami",
      content: "Menjadi komunitas kuliner terbesar di Malaysia yang menginspirasi dan memberdayakan setiap orang untuk mengeksplorasi, mencoba, dan mencintai kuliner lokal.",
      icon_name: "eye"
    },
    nilai_nilai: {
      title: "Nilai-Nilai Kami",
      description: "Prinsip-prinsip yang memandu setiap langkah kami dalam memberikan pengalaman kuliner terbaik",
      items: [
        {
          title: "Passion",
          icon_name: "heart",
          description: "Kecintaan mendalam terhadap kuliner yang mendorong kami untuk terus mengeksplorasi dan berbagi",
          order_index: 1
        },
        {
          title: "Integritas",
          icon_name: "shield-check",
          description: "Review yang jujur dan objektif berdasarkan pengalaman nyata tanpa bias",
          order_index: 2
        },
        {
          title: "Komunitas",
          icon_name: "users",
          description: "Membangun komunitas pecinta kuliner yang saling mendukung dan berbagi",
          order_index: 3
        }
      ]
    },
    tim: {
      title: "Tim Kami",
      description: "Tim kami terdiri dari food blogger berpengalaman, chef lokal, dan pecinta kuliner yang berdedikasi untuk memberikan konten berkualitas tinggi",
      members: [
        {
          name: "Sarah Chen",
          position: "Founder & Food Blogger",
          image_url: "",
          order_index: 1
        },
        {
          name: "Ahmad Rahman",
          position: "Chef & Culinary Expert",
          image_url: "",
          order_index: 2
        },
        {
          name: "Lisa Wong",
          position: "Content Creator",
          image_url: "",
          order_index: 3
        }
      ]
    },
    key_stats: {
      title: "Key Stats",
      description: "Pencapaian Kami dalam Angka",
      items: [
        {
          unit: "JUTAAN REACH",
          title: "Facebook Monthly Reach",
          value: "35M+",
          icon_name: "facebook",
          order_index: 1
        },
        {
          unit: "JUTAAN VIEWS",
          title: "Facebook Video Views",
          value: "20M+",
          icon_name: "youtube",
          order_index: 2
        },
        {
          unit: "FOLLOWERS",
          title: "Facebook Followers",
          value: "1M+",
          icon_name: "facebook",
          order_index: 3
        },
        {
          unit: "MONTHLY VISITORS",
          title: "Website Traffic",
          value: "2M+",
          icon_name: "globe",
          order_index: 4
        },
        {
          unit: "FOLLOWERS",
          title: "Instagram Followers",
          value: "319K+",
          icon_name: "instagram",
          order_index: 5
        }
      ]
    }
  };
}
