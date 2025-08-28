import { supabase } from './supabase';

/**
 * Mendapatkan data contact untuk website tertentu
 * @param {number} websiteId - ID website
 * @returns {Promise<Object|null>} - Data contact atau null jika tidak ditemukan
 */
export async function getContactData(websiteId) {
  try {
    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .eq('website_id', websiteId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching contact data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return null;
  }
}

/**
 * Update atau insert data contact
 * @param {number} websiteId - ID website
 * @param {Object} contactData - Data contact yang akan disimpan
 * @returns {Promise<boolean>} - true jika berhasil, false jika gagal
 */
export async function updateContactData(websiteId, contactData) {
  try {
    // Check if record exists
    const { data: existingData, error: checkError } = await supabase
      .from('contact')
      .select('id')
      .eq('website_id', websiteId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing contact data:', checkError);
      return false;
    }

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('contact')
        .update({
          page_title: contactData.page_title,
          page_description: contactData.page_description,
          form: contactData.form,
          contact_info: contactData.contact_info,
          social_media: contactData.social_media,
          faq: contactData.faq,
          map: contactData.map,
          email: contactData.email,
          last_updated: "Terakhir diperbarui: " + new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          updated_at: new Date().toISOString()
        })
        .eq('website_id', websiteId);

      if (error) {
        console.error('Error updating contact data:', error);
        return false;
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('contact')
        .insert({
          website_id: websiteId,
          page_title: contactData.page_title,
          page_description: contactData.page_description,
          form: contactData.form,
          contact_info: contactData.contact_info,
          social_media: contactData.social_media,
          faq: contactData.faq,
          map: contactData.map,
          email: contactData.email,
          last_updated: "Terakhir diperbarui: " + new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });

      if (error) {
        console.error('Error creating contact data:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating contact data:', error);
    return false;
  }
}

/**
 * Mendapatkan data default untuk contact
 * @returns {Object} - Data default contact
 */
export function getDefaultContactData() {
  return {
    page_title: "Hubungi Kami",
    page_description: "Kami siap membantu Anda. Hubungi kami untuk pertanyaan, saran, atau kolaborasi.",
    email: "info@kelantanfood.com",
    form: {
      subject_options: [
        { label: "Pilih subjek", value: "" },
        { label: "Pertanyaan Umum", value: "general" },
        { label: "Saran Review", value: "review" },
        { label: "Kolaborasi", value: "collaboration" },
        { label: "Iklan", value: "advertising" },
        { label: "Masalah Teknis", value: "technical" },
        { label: "Lainnya", value: "other" }
      ]
    },
    contact_info: {
      title: "Informasi Kontak",
      items: [
        {
          type: "Alamat",
          value: ["Jalan Kelantan, Georgetown", "Kelantan, Malaysia 10000"],
          icon_name: "location"
        },
        {
          type: "Telepon",
          value: ["+60 4-123 4567", "+60 12-345 6789"],
          icon_name: "phone"
        },
        {
          type: "Email",
          value: ["info@kelantanfood.com", "hello@kelantanfood.com"],
          icon_name: "email"
        },
        {
          type: "Jam Kerja",
          value: ["Senin - Jumat: 9:00 AM - 6:00 PM", "Sabtu: 10:00 AM - 4:00 PM", "Minggu: Tutup"],
          icon_name: "clock"
        }
      ]
    },
    social_media: {
      title: "Ikuti Kami",
      description: "Ikuti kami di media sosial untuk mendapatkan update terbaru tentang review makanan, resep, dan acara kuliner.",
                                             platforms: [
                   {
                     url: "#",
                     icon_name: "facebook",
                     is_active: true
                   },
                   {
                     url: "#",
                     icon_name: "x",
                     is_active: true
                   },
                   {
                     url: "#",
                     icon_name: "instagram",
                     is_active: true
                   },
                   {
                     url: "#",
                     icon_name: "youtube",
                     is_active: true
                   },
                   {
                     url: "#",
                     icon_name: "whatsapp",
                     is_active: false
                   },
                   {
                     url: "#",
                     icon_name: "pinterest",
                     is_active: false
                   },
                   {
                     url: "#",
                     icon_name: "tiktok",
                     is_active: false
                   }
                 ]
    },
    faq: {
      title: "Pertanyaan Umum",
      description: "Jawaban untuk pertanyaan yang sering diajukan oleh pengunjung kami",
      items: [
        {
          question: "Bagaimana cara submit review restoran?",
          answer: "Anda dapat mengirimkan review melalui form kontak di atas atau email kami langsung. Tim kami akan menghubungi Anda untuk langkah selanjutnya.",
          gradient: { from: "red-600", to: "red-700" },
          icon_name: "question"
        },
        {
          question: "Apakah Anda menerima kolaborasi?",
          answer: "Ya, kami terbuka untuk berbagai jenis kolaborasi. Silakan hubungi kami untuk membicarakan detail lebih lanjut.",
          gradient: { from: "orange-600", to: "red-600" },
          icon_name: "collaboration"
        },
        {
          question: "Berapa lama waktu respons email?",
          answer: "Kami biasanya merespons dalam 24-48 jam kerja. Untuk pertanyaan mendesak, silakan hubungi kami via telepon.",
          gradient: { from: "red-600", to: "orange-600" },
          icon_name: "clock"
        }
      ]
    },
    map: {
      title: "Lokasi Kami",
      description: "Kunjungi kantor kami di Georgetown, Kelantan untuk bertemu langsung dengan tim kami",
      iframe_src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8199999999997!2d100.3354!3d5.4164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac3c49ce76e31%3A0xfccd80681e2ab7d0!2sGeorgetown%2C%20Kelantan%2C%20Malaysia!5e0!3m2!1sen!2sid!4v1234567890"
    }
  };
}
