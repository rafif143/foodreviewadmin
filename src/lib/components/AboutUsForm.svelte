<script>
  import { createEventDispatcher } from 'svelte';
  import { uploadAboutUsImage, deleteAboutUsImage, getDefaultAboutUsData } from '$lib/aboutUs.js';

  const dispatch = createEventDispatcher();

  export let aboutData = null;
  export let websiteId = null;
  export let loading = false;

  // Initialize data if null
  $: if (!aboutData) {
    aboutData = getDefaultAboutUsData();
  }

  // Ensure all sections exist
  $: aboutData.tentang_kami = aboutData.tentang_kami || { title: '', description: '' };
  $: aboutData.cerita_kami = aboutData.cerita_kami || { title: '', content: '' };
  $: aboutData.image = aboutData.image || { url: '', title: '', subtitle: '' };
  $: aboutData.misi = aboutData.misi || { title: '', content: '', icon_name: '' };
  $: aboutData.visi = aboutData.visi || { title: '', content: '', icon_name: '' };
  $: aboutData.nilai_nilai = aboutData.nilai_nilai || { title: '', description: '', items: [] };
  $: aboutData.tim = aboutData.tim || { title: '', description: '', members: [] };
  $: aboutData.key_stats = aboutData.key_stats || { title: '', description: '', items: [] };

  // Icon options
  const iconOptions = [
    { value: 'heart', label: '❤️ Heart' },
    { value: 'shield-check', label: '🛡️ Shield Check' },
    { value: 'users', label: '👥 Users' },
    { value: 'check-circle', label: '✅ Check Circle' },
    { value: 'eye', label: '👁️ Eye' },
    { value: 'star', label: '⭐ Star' },
    { value: 'trophy', label: '🏆 Trophy' },
    { value: 'lightning-bolt', label: '⚡ Lightning' },
    { value: 'fire', label: '🔥 Fire' },
    { value: 'gem', label: '💎 Gem' }
  ];

  const socialIcons = [
    { value: 'facebook', label: '📘 Facebook' },
    { value: 'instagram', label: '📷 Instagram' },
    { value: 'youtube', label: '📺 YouTube' },
    { value: 'twitter', label: '🐦 Twitter' },
    { value: 'tiktok', label: '🎵 TikTok' },
    { value: 'globe', label: '🌐 Globe' }
  ];

  // File upload handling
  let uploadingImage = false;
  let uploadingTeamImage = false;
  let uploadingTeamMemberIndex = null;
  let deletingImage = false;
  let deletingTeamImage = false;

  async function handleImageUpload(event, type, index = null) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (type === 'main') {
        uploadingImage = true;
      } else if (type === 'team') {
        uploadingTeamImage = true;
        uploadingTeamMemberIndex = index;
      }
      
      let fileName;
      if (type === 'main') {
        fileName = `main-image-${Date.now()}`;
      } else if (type === 'team') {
        fileName = `team-member-${index}-${Date.now()}`;
      }

      const imageUrl = await uploadAboutUsImage(file, fileName);
      
      if (type === 'main') {
        // Delete old image if exists
        if (aboutData.image.url) {
          try {
            const urlParts = aboutData.image.url.split('/');
            const oldFileName = urlParts[urlParts.length - 1];
            await deleteAboutUsImage(oldFileName);
          } catch (error) {
            console.warn('Failed to delete old image:', error);
          }
        }
        aboutData.image.url = imageUrl;
      } else if (type === 'team') {
        // Delete old image if exists
        const member = aboutData.tim.members[index];
        if (member.image_url) {
          try {
            const urlParts = member.image_url.split('/');
            const oldFileName = urlParts[urlParts.length - 1];
            await deleteAboutUsImage(oldFileName);
          } catch (error) {
            console.warn('Failed to delete old team image:', error);
          }
        }
        member.image_url = imageUrl;
      }
      
      // Trigger reactivity
      aboutData = { ...aboutData };
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar: ' + error.message);
    } finally {
      if (type === 'main') {
        uploadingImage = false;
      } else if (type === 'team') {
        uploadingTeamImage = false;
        uploadingTeamMemberIndex = null;
      }
    }
  }

  // Add/Remove functions
  function addNilaiNilai() {
    if (!aboutData.nilai_nilai.items) aboutData.nilai_nilai.items = [];
    aboutData.nilai_nilai.items.push({
      title: '',
      icon_name: '',
      description: '',
      order_index: aboutData.nilai_nilai.items.length + 1
    });
    aboutData = { ...aboutData };
  }

  function removeNilaiNilai(index) {
    aboutData.nilai_nilai.items.splice(index, 1);
    // Reorder
    aboutData.nilai_nilai.items.forEach((item, i) => {
      item.order_index = i + 1;
    });
    aboutData = { ...aboutData };
  }

  function addTeamMember() {
    if (!aboutData.tim.members) aboutData.tim.members = [];
    aboutData.tim.members.push({
      name: '',
      position: '',
      image_url: '',
      order_index: aboutData.tim.members.length + 1
    });
    aboutData = { ...aboutData };
  }

  async function removeTeamMember(index) {
    const member = aboutData.tim.members[index];
    
    // Delete image if exists
    if (member.image_url) {
      try {
        const urlParts = member.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await deleteAboutUsImage(fileName);
      } catch (error) {
        console.warn('Failed to delete team member image:', error);
      }
    }
    
    aboutData.tim.members.splice(index, 1);
    // Reorder
    aboutData.tim.members.forEach((member, i) => {
      member.order_index = i + 1;
    });
    aboutData = { ...aboutData };
  }

  function addKeyStat() {
    if (!aboutData.key_stats.items) aboutData.key_stats.items = [];
    aboutData.key_stats.items.push({
      unit: '',
      title: '',
      value: '',
      icon_name: '',
      order_index: aboutData.key_stats.items.length + 1
    });
    aboutData = { ...aboutData };
  }

  function removeKeyStat(index) {
    aboutData.key_stats.items.splice(index, 1);
    // Reorder
    aboutData.key_stats.items.forEach((stat, i) => {
      stat.order_index = i + 1;
    });
    aboutData = { ...aboutData };
  }

  function handleSubmit() {
    // Create a deep copy of the data to ensure reactivity
    const dataToSubmit = JSON.parse(JSON.stringify(aboutData));
    
    // Update last_updated
    dataToSubmit.last_updated = "Terakhir diperbarui: " + new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log('Form submitting data:', dataToSubmit);
    dispatch('submit', dataToSubmit);
  }

  // Delete image functions
  async function deleteMainImage() {
    if (!aboutData.image.url) return;
    
    try {
      deletingImage = true;
      
      // Extract file path from URL
      const urlParts = aboutData.image.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await deleteAboutUsImage(fileName);
      
      // Clear the image URL
      aboutData.image.url = '';
      aboutData = { ...aboutData };
      
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Gagal menghapus gambar: ' + error.message);
    } finally {
      deletingImage = false;
    }
  }

  async function deleteTeamImage(index) {
    const member = aboutData.tim.members[index];
    if (!member.image_url) return;
    
    try {
      deletingTeamImage = true;
      
      // Extract file path from URL
      const urlParts = member.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await deleteAboutUsImage(fileName);
      
      // Clear the image URL
      member.image_url = '';
      aboutData = { ...aboutData };
      
    } catch (error) {
      console.error('Error deleting team image:', error);
      alert('Gagal menghapus gambar: ' + error.message);
    } finally {
      deletingTeamImage = false;
    }
  }

  async function handleReset() {
    // Delete all existing images before reset
    try {
      // Delete main image
      if (aboutData.image.url) {
        const urlParts = aboutData.image.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await deleteAboutUsImage(fileName);
      }
      
      // Delete team member images
      for (const member of aboutData.tim.members || []) {
        if (member.image_url) {
          const urlParts = member.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          await deleteAboutUsImage(fileName);
        }
      }
    } catch (error) {
      console.warn('Failed to delete images during reset:', error);
    }
    
    aboutData = getDefaultAboutUsData();
  }
</script>

<svelte:head>
  <title>Kelola About Us</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <div class="bg-white shadow-lg rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Kelola Halaman About Us</h2>
      <p class="text-sm text-gray-600">Atur konten halaman tentang kami</p>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="p-6 space-y-8">
      
      <!-- Tentang Kami Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tentang Kami</h3>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                         <input
               type="text"
               bind:value={aboutData.tentang_kami.title}
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                         <textarea
               bind:value={aboutData.tentang_kami.description}
               rows="6"
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             ></textarea>
          </div>
        </div>
      </div>

      <!-- Cerita Kami Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cerita Kami</h3>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                         <input
               type="text"
               bind:value={aboutData.cerita_kami.title}
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Konten</label>
                         <textarea
               bind:value={aboutData.cerita_kami.content}
               rows="8"
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             ></textarea>
          </div>
        </div>
      </div>

      <!-- Image Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Gambar Utama</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload Gambar</label>
            <input
              type="file"
              accept="image/*"
              on:change={(e) => handleImageUpload(e, 'main')}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {#if uploadingImage}
              <p class="text-sm text-blue-600 mt-2">Mengupload gambar...</p>
            {/if}
          </div>
                     <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">Judul Gambar</label>
             <input
               type="text"
               bind:value={aboutData.image.title}
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle Gambar</label>
             <input
               type="text"
               bind:value={aboutData.image.subtitle}
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
                       {#if aboutData.image.url}
              <div class="md:col-span-2">
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-sm font-medium text-gray-700">Preview</label>
                  <button
                    type="button"
                    on:click={deleteMainImage}
                    disabled={deletingImage}
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingImage ? 'Menghapus...' : 'Hapus Gambar'}
                  </button>
                </div>
                <img src={aboutData.image.url} alt="Preview" class="w-48 h-32 object-cover rounded-lg border">
              </div>
            {/if}
        </div>
      </div>

      <!-- Misi & Visi Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Misi -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Misi</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                             <input
                 type="text"
                 bind:value={aboutData.misi.title}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Konten</label>
                             <textarea
                 bind:value={aboutData.misi.content}
                 rows="4"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <select
                bind:value={aboutData.misi.icon_name}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Icon</option>
                {#each iconOptions as icon}
                  <option value={icon.value}>{icon.label}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <!-- Visi -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Visi</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                             <input
                 type="text"
                 bind:value={aboutData.visi.title}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Konten</label>
                             <textarea
                 bind:value={aboutData.visi.content}
                 rows="4"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <select
                bind:value={aboutData.visi.icon_name}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Icon</option>
                {#each iconOptions as icon}
                  <option value={icon.value}>{icon.label}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Nilai-Nilai Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Nilai-Nilai</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                             <input
                 type="text"
                 bind:value={aboutData.nilai_nilai.title}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                             <input
                 type="text"
                 bind:value={aboutData.nilai_nilai.description}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-4">
              <label class="block text-sm font-medium text-gray-700">Item Nilai-Nilai</label>
              <button
                type="button"
                on:click={addNilaiNilai}
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                + Tambah Item
              </button>
            </div>
            
            {#each aboutData.nilai_nilai.items || [] as item, index}
              <div class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-start mb-4">
                  <h4 class="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                  <button
                    type="button"
                    on:click={() => removeNilaiNilai(index)}
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                                         <input
                       type="text"
                       bind:value={item.title}
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <select
                      bind:value={item.icon_name}
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Icon</option>
                      {#each iconOptions as icon}
                        <option value={icon.value}>{icon.label}</option>
                      {/each}
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                                         <textarea
                       bind:value={item.description}
                       rows="3"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     ></textarea>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Tim Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tim</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                             <input
                 type="text"
                 bind:value={aboutData.tim.title}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                             <input
                 type="text"
                 bind:value={aboutData.tim.description}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-4">
              <label class="block text-sm font-medium text-gray-700">Anggota Tim</label>
              <button
                type="button"
                on:click={addTeamMember}
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                + Tambah Anggota
              </button>
            </div>
            
            {#each aboutData.tim.members || [] as member, index}
              <div class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-start mb-4">
                  <h4 class="text-sm font-medium text-gray-900">Anggota {index + 1}</h4>
                  <button
                    type="button"
                    on:click={() => removeTeamMember(index)}
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                                         <input
                       type="text"
                       bind:value={member.name}
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
                                         <input
                       type="text"
                       bind:value={member.position}
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                    <input
                      type="file"
                      accept="image/*"
                      on:change={(e) => handleImageUpload(e, 'team', index)}
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                                         {#if uploadingTeamImage && index === uploadingTeamMemberIndex}
                       <p class="text-sm text-blue-600 mt-2">Mengupload gambar...</p>
                     {/if}
                                         {#if member.image_url}
                       <div class="mt-2">
                         <div class="flex justify-between items-center mb-2">
                           <span class="text-sm text-gray-600">Preview:</span>
                           <button
                             type="button"
                             on:click={() => deleteTeamImage(index)}
                             disabled={deletingTeamImage}
                             class="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             {deletingTeamImage ? 'Menghapus...' : 'Hapus'}
                           </button>
                         </div>
                         <img src={member.image_url} alt="Preview" class="w-24 h-24 object-cover rounded-lg border">
                       </div>
                     {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Key Stats Section -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Key Stats</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                             <input
                 type="text"
                 bind:value={aboutData.key_stats.title}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                             <input
                 type="text"
                 bind:value={aboutData.key_stats.description}
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
          </div>
          
          <div>
            <div class="flex justify-between items-center mb-4">
              <label class="block text-sm font-medium text-gray-700">Statistik</label>
              <button
                type="button"
                on:click={addKeyStat}
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                + Tambah Statistik
              </button>
            </div>
            
            {#each aboutData.key_stats.items || [] as stat, index}
              <div class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-start mb-4">
                  <h4 class="text-sm font-medium text-gray-900">Statistik {index + 1}</h4>
                  <button
                    type="button"
                    on:click={() => removeKeyStat(index)}
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                                         <input
                       type="text"
                       bind:value={stat.unit}
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                                         <input
                       type="text"
                       bind:value={stat.title}
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nilai</label>
                                         <input
                       type="text"
                       bind:value={stat.value}
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <select
                      bind:value={stat.icon_name}
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Icon</option>
                      {#each socialIcons as icon}
                        <option value={icon.value}>{icon.label}</option>
                      {/each}
                    </select>
                  </div>
                </div>
              </div>
            {/each}
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
          Reset
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
