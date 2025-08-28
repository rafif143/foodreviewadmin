<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore';

  // Data
  let isLoading = true;
  let errorMessage = '';
  let successMessage = '';

  // Tags & Labels data
  let tags = [];
  let labels = [];

  // Form data
  let newTag = '';
  let newLabel = '';
  let editingTag = null;
  let editingLabel = null;
  let editTagName = '';
  let editLabelName = '';

  onMount(async () => {
    // Load website from store or localStorage
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        goto('/admin');
        return;
      }
    }
    
    await loadTagsAndLabels();
  });

  async function loadTagsAndLabels() {
    try {
      isLoading = true;
      
      // Load tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .order('name');

      if (tagsError) throw tagsError;
      tags = tagsData || [];

      // Load labels
      const { data: labelsData, error: labelsError } = await supabase
        .from('labels')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .order('name');

      if (labelsError) throw labelsError;
      labels = labelsData || [];

    } catch (error) {
      errorMessage = 'Gagal memuat tags dan labels: ' + error.message;
    } finally {
      isLoading = false;
    }
  }

  async function addTag() {
    if (!newTag.trim()) return;

    try {
      const { error } = await supabase
        .from('tags')
        .insert({
          website_id: $selectedWebsite.id,
          name: newTag.trim(),
          is_active: true
        });

      if (error) throw error;

      // Reload tags
      await loadTagsAndLabels();
      newTag = '';
      successMessage = 'Tag berhasil ditambahkan!';
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal menambahkan tag: ' + error.message;
    }
  }

  async function addLabel() {
    if (!newLabel.trim()) return;

    try {
      const { error } = await supabase
        .from('labels')
        .insert({
          website_id: $selectedWebsite.id,
          name: newLabel.trim(),
          is_active: true
        });

      if (error) throw error;

      // Reload labels
      await loadTagsAndLabels();
      newLabel = '';
      successMessage = 'Label berhasil ditambahkan!';
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal menambahkan label: ' + error.message;
    }
  }

  function startEditTag(tag) {
    editingTag = tag.id;
    editTagName = tag.name;
  }

  function startEditLabel(label) {
    editingLabel = label.id;
    editLabelName = label.name;
  }

  function cancelEdit() {
    editingTag = null;
    editingLabel = null;
    editTagName = '';
    editLabelName = '';
  }

  async function updateTag(tagId) {
    if (!editTagName.trim()) return;

    try {
      const { error } = await supabase
        .from('tags')
        .update({ name: editTagName.trim() })
        .eq('id', tagId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Reload tags
      await loadTagsAndLabels();
      cancelEdit();
      successMessage = 'Tag berhasil diupdate!';
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal mengupdate tag: ' + error.message;
    }
  }

  async function updateLabel(labelId) {
    if (!editLabelName.trim()) return;

    try {
      const { error } = await supabase
        .from('labels')
        .update({ name: editLabelName.trim() })
        .eq('id', labelId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Reload labels
      await loadTagsAndLabels();
      cancelEdit();
      successMessage = 'Label berhasil diupdate!';
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal mengupdate label: ' + error.message;
    }
  }

  async function toggleTagStatus(tagId, currentStatus) {
    try {
      const { error } = await supabase
        .from('tags')
        .update({ is_active: !currentStatus })
        .eq('id', tagId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Reload tags
      await loadTagsAndLabels();
      successMessage = `Tag berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}!`;
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal mengubah status tag: ' + error.message;
    }
  }

  async function toggleLabelStatus(labelId, currentStatus) {
    try {
      const { error } = await supabase
        .from('labels')
        .update({ is_active: !currentStatus })
        .eq('id', labelId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Reload labels
      await loadTagsAndLabels();
      successMessage = `Label berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}!`;
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal mengubah status label: ' + error.message;
    }
  }

  async function deleteTag(tagId) {
    if (!confirm('Apakah Anda yakin ingin menghapus tag ini?')) return;

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Reload tags
      await loadTagsAndLabels();
      successMessage = 'Tag berhasil dihapus!';
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal menghapus tag: ' + error.message;
    }
  }

  async function deleteLabel(labelId) {
    if (!confirm('Apakah Anda yakin ingin menghapus label ini?')) return;

    try {
      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', labelId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Reload labels
      await loadTagsAndLabels();
      successMessage = 'Label berhasil dihapus!';
      
      setTimeout(() => {
        successMessage = '';
      }, 3000);

    } catch (error) {
      errorMessage = 'Gagal menghapus label: ' + error.message;
    }
  }
</script>

<svelte:head>
  <title>Kelola Tags & Labels - {$selectedWebsite?.name}</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Kelola Tags & Labels</h1>
        <p class="mt-2 text-gray-600">Website: <span class="font-semibold text-blue-600">{$selectedWebsite?.name}</span></p>
        <p class="mt-1 text-sm text-gray-500">Kelola kategori dan label untuk website ini</p>
      </div>
      <div class="flex items-center gap-3">
        <a
          href="/admin/food/articles"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Artikel
        </a>
      </div>
    </div>
  </div>

  <!-- Error/Success Messages -->
  {#if errorMessage}
    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{errorMessage}</p>
        </div>
      </div>
    </div>
  {/if}

  {#if successMessage}
    <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-green-800">{successMessage}</p>
        </div>
      </div>
    </div>
  {/if}

  {#if isLoading}
    <div class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-lg font-medium text-gray-900">Memuat tags dan labels...</p>
      <p class="mt-2 text-gray-500">Mohon tunggu sebentar</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Tags Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900">Tags</h2>
          <span class="text-sm text-gray-500">{tags.length} tag</span>
        </div>

        <!-- Add New Tag -->
        <div class="mb-6">
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={newTag}
              placeholder="Nama tag baru..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              on:keydown={(e) => e.key === 'Enter' && addTag()}
            />
            <button
              on:click={addTag}
              disabled={!newTag.trim()}
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Tambah
            </button>
          </div>
        </div>

        <!-- Tags List -->
        {#if tags.length === 0}
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada tag</h3>
            <p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan tag pertama</p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each tags as tag}
              <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                {#if editingTag === tag.id}
                  <!-- Edit Mode -->
                  <div class="flex-1 flex gap-2">
                    <input
                      type="text"
                      bind:value={editTagName}
                      class="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      on:click={() => updateTag(tag.id)}
                      class="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200"
                    >
                      Simpan
                    </button>
                    <button
                      on:click={cancelEdit}
                      class="px-2 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200"
                    >
                      Batal
                    </button>
                  </div>
                {:else}
                  <!-- View Mode -->
                  <div class="flex items-center gap-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {tag.is_active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                      {tag.name}
                    </span>
                    <span class="text-xs text-gray-500">
                      {tag.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <button
                      on:click={() => toggleTagStatus(tag.id, tag.is_active)}
                      class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title={tag.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {#if tag.is_active}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      {:else}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      {/if}
                    </button>
                    
                    <button
                      on:click={() => startEditTag(tag)}
                      class="p-1 text-blue-400 hover:text-blue-600 transition-colors duration-200"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      on:click={() => deleteTag(tag.id)}
                      class="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                      title="Hapus"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Labels Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900">Labels</h2>
          <span class="text-sm text-gray-500">{labels.length} label</span>
        </div>

        <!-- Add New Label -->
        <div class="mb-6">
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={newLabel}
              placeholder="Nama label baru..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              on:keydown={(e) => e.key === 'Enter' && addLabel()}
            />
            <button
              on:click={addLabel}
              disabled={!newLabel.trim()}
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Tambah
            </button>
          </div>
        </div>

        <!-- Labels List -->
        {#if labels.length === 0}
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada label</h3>
            <p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan label pertama</p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each labels as label}
              <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                {#if editingLabel === label.id}
                  <!-- Edit Mode -->
                  <div class="flex-1 flex gap-2">
                    <input
                      type="text"
                      bind:value={editLabelName}
                      class="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      on:click={() => updateLabel(label.id)}
                      class="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200"
                    >
                      Simpan
                    </button>
                    <button
                      on:click={cancelEdit}
                      class="px-2 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200"
                    >
                      Batal
                    </button>
                  </div>
                {:else}
                  <!-- View Mode -->
                  <div class="flex items-center gap-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {label.is_active ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">
                      {label.name}
                    </span>
                    <span class="text-xs text-gray-500">
                      {label.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <button
                      on:click={() => toggleLabelStatus(label.id, label.is_active)}
                      class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title={label.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {#if label.is_active}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      {:else}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      {/if}
                    </button>
                    
                    <button
                      on:click={() => startEditLabel(label)}
                      class="p-1 text-blue-400 hover:text-blue-600 transition-colors duration-200"
                      title="Edit"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      on:click={() => deleteLabel(label.id)}
                      class="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                      title="Hapus"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-8 bg-blue-50 rounded-2xl p-6">
      <h3 class="text-lg font-medium text-blue-900 mb-3">Informasi Tags & Labels</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
        <div>
          <h4 class="font-medium mb-2">Tags</h4>
          <ul class="space-y-1">
            <li>• Digunakan untuk mengkategorikan artikel</li>
            <li>• Contoh: Makanan Tradisional, Seafood, Dessert</li>
            <li>• Bisa diaktifkan/nonaktifkan sesuai kebutuhan</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium mb-2">Labels</h4>
          <ul class="space-y-1">
            <li>• Digunakan untuk memberikan atribut khusus</li>
            <li>• Contoh: Halal, Vegetarian, Spicy</li>
            <li>• Bisa diaktifkan/nonaktifkan sesuai kebutuhan</li>
          </ul>
        </div>
      </div>
    </div>
  {/if}
</div>
