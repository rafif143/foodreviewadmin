<script>
  import { createEventDispatcher } from 'svelte';
  import { getDefaultAboutContent } from '$lib/aboutSections.js';

  export let category = '';
  export let content = null;
  export let loading = false;

  const dispatch = createEventDispatcher();

  // Initialize content with default values if not provided
  $: if (!content) {
    content = getDefaultAboutContent(category);
  }

  // Update formData when content changes
  $: formData = {
    title: content?.title || '',
    description: content?.description || '',
    tips_title: content?.tips_title || '',
    tips_description: content?.tips_description || ''
  };

  function handleSubmit() {
    dispatch('submit', {
      content: formData
    });
  }

  function handleReset() {
    const defaultContent = getDefaultAboutContent(category);
    formData = {
      title: defaultContent.title,
      description: defaultContent.description,
      tips_title: defaultContent.tips_title,
      tips_description: defaultContent.tips_description
    };
  }

  function getCategoryInfo() {
    const info = {
      food: { name: 'Food', icon: '🍽️', color: 'bg-red-100 text-red-800' },
      cafe: { name: 'Cafe', icon: '☕', color: 'bg-yellow-100 text-yellow-800' },
      'things-to-do': { name: 'Things to Do', icon: '🎯', color: 'bg-green-100 text-green-800' },
      events: { name: 'Events', icon: '🎉', color: 'bg-purple-100 text-purple-800' },
      recipe: { name: 'Recipe', icon: '👨‍🍳', color: 'bg-blue-100 text-blue-800' }
    };
    return info[category] || info.food;
  }

  $: categoryInfo = getCategoryInfo();
</script>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center">
      <span class="text-3xl mr-3">{categoryInfo.icon}</span>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Edit {categoryInfo.name}</h1>
        <p class="mt-2 text-gray-600">Kelola konten about section untuk kategori {categoryInfo.name.toLowerCase()}</p>
      </div>
    </div>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-8">
    <!-- Main Content -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Konten Utama</h3>
        
        <!-- Title -->
        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Judul
          </label>
          <input
            type="text"
            id="title"
            bind:value={formData.title}
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Masukkan judul konten..."
            required
          />
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            id="description"
            bind:value={formData.description}
            rows="6"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Masukkan deskripsi konten..."
            required
          ></textarea>
          <p class="mt-2 text-sm text-gray-500">
            Gunakan baris baru untuk memisahkan paragraf
          </p>
        </div>
      </div>
    </div>

    <!-- Tips Section -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Bagian Tips</h3>
        
        <!-- Tips Title -->
        <div class="mb-6">
          <label for="tips_title" class="block text-sm font-medium text-gray-700 mb-2">
            Judul Tips
          </label>
          <input
            type="text"
            id="tips_title"
            bind:value={formData.tips_title}
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Contoh: 🍽️ Tips Makan"
            required
          />
        </div>

        <!-- Tips Description -->
        <div class="mb-6">
          <label for="tips_description" class="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Tips
          </label>
          <textarea
            id="tips_description"
            bind:value={formData.tips_description}
            rows="4"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Masukkan tips yang berguna..."
            required
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Preview</h3>
        
        <div class="bg-gray-50 rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{formData.title || 'Judul akan muncul di sini'}</h2>
          
          <div class="prose max-w-none mb-6">
            <p class="text-gray-700 whitespace-pre-line">
              {formData.description || 'Deskripsi akan muncul di sini'}
            </p>
          </div>

          {#if formData.tips_title || formData.tips_description}
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">
                {formData.tips_title || 'Tips Title'}
              </h3>
              <p class="text-blue-800">
                {formData.tips_description || 'Tips description'}
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4">
      <button
        type="button"
        on:click={handleReset}
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset ke Default
      </button>
      
      <button
        type="submit"
        disabled={loading}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Menyimpan...
        {:else}
          Simpan Perubahan
        {/if}
      </button>
    </div>
  </form>
</div>
