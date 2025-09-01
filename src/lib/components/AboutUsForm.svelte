<script>
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { getDefaultAboutUsData } from '$lib/aboutUs.js';

  const dispatch = createEventDispatcher();

  export let aboutData = null;
  export let websiteId = null;
  export let loading = false;

  // Initialize data if null
  $: if (!aboutData) {
    aboutData = getDefaultAboutUsData();
  }

  // Ensure aboutData is always defined
  $: aboutData = aboutData || getDefaultAboutUsData();
  
  // Check if website is selected
  $: if (!websiteId) {
    aboutData = null;
  }

  // File upload handling
  let uploadingImage = false;

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      uploadingImage = true;
      
      // Upload to Supabase Storage
      const fileName = `profile-image-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('about-us-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('about-us-images')
        .getPublicUrl(fileName);

      // Delete old image if exists
      if (aboutData.profile_image && !aboutData.profile_image.includes('unsplash.com')) {
        try {
          const oldFileName = aboutData.profile_image.split('/').pop();
          await supabase.storage
            .from('about-us-images')
            .remove([oldFileName]);
        } catch (error) {
          console.warn('Failed to delete old image:', error);
        }
      }

      aboutData.profile_image = publicUrl;
      aboutData = { ...aboutData };
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar: ' + error.message);
    } finally {
      uploadingImage = false;
    }
  }

  async function deleteImage() {
    if (!aboutData.profile_image || aboutData.profile_image.includes('unsplash.com')) return;
    
    try {
      const fileName = aboutData.profile_image.split('/').pop();
      await supabase.storage
        .from('about-us-images')
        .remove([fileName]);
      
      aboutData.profile_image = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face';
      aboutData = { ...aboutData };
      
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Gagal menghapus gambar: ' + error.message);
    }
  }

  function handleSubmit() {
    dispatch('submit', aboutData);
  }

  function handleReset() {
    aboutData = {
      name: 'Dean Mel',
      description: 'Passionate food blogger and culinary enthusiast. Exploring the world one dish at a time.',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
      twitter_url: 'https://x.com/kelantanfoodreview',
      pinterest_url: 'https://pinterest.com/kelantanfoodreview',
      telegram_url: 'https://telegram.me/kelantanfoodreview',
      instagram_url: 'https://instagram.com/kelantanfoodreview'
    };
  }
</script>

<svelte:head>
  <title>Kelola About Us</title>
</svelte:head>

{#if !websiteId}
  <div class="max-w-4xl mx-auto">
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <div class="text-yellow-600 text-4xl mb-4">⚠️</div>
      <h3 class="text-lg font-medium text-yellow-800 mb-2">Website Belum Dipilih</h3>
      <p class="text-yellow-700">Silakan pilih website terlebih dahulu untuk mengelola data About Us.</p>
    </div>
  </div>
{:else}
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow-lg rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Kelola Profil About Us</h2>
      <p class="text-sm text-gray-600">Atur informasi profil dan social media</p>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-6">
      
      <!-- Profile Image Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Foto Profil</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload Foto</label>
            <input
              type="file"
              accept="image/*"
              on:change={handleImageUpload}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {#if uploadingImage}
              <p class="text-sm text-blue-600 mt-2">Mengupload gambar...</p>
            {/if}
            <p class="text-xs text-gray-500 mt-2">Format: JPG, PNG. Ukuran maksimal: 2MB</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div class="relative">
              <img 
                src={aboutData.profile_image} 
                alt="Profile Preview" 
                class="w-48 h-64 object-cover rounded-lg border shadow-md"
              />
              {#if aboutData.profile_image && !aboutData.profile_image.includes('unsplash.com')}
                <button
                  type="button"
                  on:click={deleteImage}
                  class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                  title="Hapus Gambar"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Basic Info Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <input
              type="text"
              bind:value={aboutData.name}
              placeholder="Masukkan nama"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              bind:value={aboutData.description}
              rows="4"
              placeholder="Masukkan deskripsi singkat tentang diri"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Social Media Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X (Twitter) URL
              </span>
            </label>
            <input
              type="url"
              bind:value={aboutData.twitter_url}
              placeholder="https://x.com/username"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
                Pinterest URL
              </span>
            </label>
            <input
              type="url"
              bind:value={aboutData.pinterest_url}
              placeholder="https://pinterest.com/username"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c-.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c-.538-.196 1.006.128.832.941z"/>
                </svg>
                Telegram URL
              </span>
            </label>
            <input
              type="url"
              bind:value={aboutData.telegram_url}
              placeholder="https://telegram.me/username"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram URL
              </span>
            </label>
            <input
              type="url"
              bind:value={aboutData.instagram_url}
              placeholder="https://instagram.com/username"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          on:click={handleReset}
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reset ke Default
        </button>
        <button
          type="submit"
          disabled={loading}
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  </div>
</div>
{/if}
