<script>
  import { supabase } from '$lib/supabase';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore';
  import ContentBlockEditor from '$lib/components/ContentBlockEditor.svelte';
  import ContentBlockPreview from '$lib/components/ContentBlockPreview.svelte';
  import ImageUploader from '$lib/components/ImageUploader.svelte';
  import { stringifyContentBlocks } from '$lib/utils/contentParser.js';
  import { cleanupTempImages, extractFormImageUrls, removeTempImage } from '$lib/utils/imageCleanup.js';

  // Data
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let isLoadingTagsLabels = false;

  // Form data
  let formData = {
    title: '',
    slug: '',
    author: '',
    minute_read: 5,
    category: 'food',
    thumbnail_image: '',
    main_image: '',
    summary: '',
    contentBlocks: [], // Changed to contentBlocks array
    is_published: false,
    tags: [],
    labels: []
  };

  // Available categories
  const categories = [
    { value: 'food', label: 'Makanan' },
    { value: 'recipe', label: 'Resep' },
    { value: 'cafe', label: 'Cafe & Restoran' },
    { value: 'events', label: 'Events' },
    { value: 'things-to-do', label: 'Things to Do' }
  ];

  // Available tags and labels - will be loaded from database
  let availableTags = [];
  let availableLabels = [];

  onMount(async () => {
    // Load website from store or localStorage
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        goto('/admin');
        return;
      }
    }
    
    // Load available tags and labels from database
    await loadAvailableTagsAndLabels();
  });

  onDestroy(() => {
    // Cleanup temporary images when leaving page
    handlePageLeave();
  });

  // Handle page leave (cleanup temp images)
  async function handlePageLeave() {
    try {
      const currentImageUrls = extractFormImageUrls(formData);
      await cleanupTempImages(currentImageUrls);
    } catch (error) {
      console.warn('Error cleaning up temp images on page leave:', error);
    }
  }

  // Handle beforeunload for browser close/refresh
  function handleBeforeUnload(event) {
    // Cleanup temp images (fire and forget)
    handlePageLeave();
  }

  // Add beforeunload listener
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  // Load available tags and labels from database
  async function loadAvailableTagsAndLabels() {
    try {
      if (!$selectedWebsite) return;
      
      isLoadingTagsLabels = true;
      
      // Load tags
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .eq('is_active', true)
        .order('name');

      if (tagsError) {
        console.error('Error loading tags:', tagsError);
      } else {
        availableTags = tags || [];
      }

      // Load labels
      const { data: labels, error: labelsError } = await supabase
        .from('labels')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .eq('is_active', true)
        .order('name');

      if (labelsError) {
        console.error('Error loading labels:', labelsError);
      } else {
        availableLabels = labels || [];
      }
    } catch (error) {
      console.error('Error loading tags/labels:', error);
    } finally {
      isLoadingTagsLabels = false;
    }
  }

  // Auto-generate slug from title
  $: if (formData.title) {
    formData.slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Handle content blocks change
  function handleContentBlocksChange(newContentBlocks) {
    formData.contentBlocks = newContentBlocks;
  }

  async function handleSubmit() {
    try {
      isLoading = true;
      errorMessage = '';

      // Validation
      if (!formData.title.trim()) {
        throw new Error('Judul artikel harus diisi');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug artikel harus diisi');
      }
      if (!formData.author.trim()) {
        throw new Error('Penulis artikel harus diisi');
      }
      if (!formData.contentBlocks || formData.contentBlocks.length === 0) {
        throw new Error('Konten artikel harus diisi');
      }

      // Check if slug already exists for this website
      const { data: existingArticle, error: checkError } = await supabase
        .from('articles')
        .select('id')
        .eq('website_id', $selectedWebsite.id)
        .eq('slug', formData.slug)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingArticle) {
        throw new Error('Slug artikel sudah ada, gunakan judul yang berbeda');
      }

      // Prepare data for insertion
      const articleData = {
        website_id: $selectedWebsite.id,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        author: formData.author.trim(),
        minute_read: parseInt(formData.minute_read) || 5,
        category: formData.category,
        thumbnail_image: formData.thumbnail_image.trim() || null,
        main_image: formData.main_image.trim() || null,
        summary: formData.summary.trim() || null,
        content: stringifyContentBlocks(formData.contentBlocks),
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        tags: formData.tags.length > 0 ? formData.tags : [],
        labels: formData.labels.length > 0 ? formData.labels : []
      };

      // Insert article
      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) throw error;

      successMessage = 'Artikel berhasil dibuat!';
      
      // Mark saved images as permanent (remove from temp tracking)
      const savedImageUrls = extractFormImageUrls(formData);
      savedImageUrls.forEach(url => removeTempImage(url));
      
      // Reset form
      formData = {
        title: '',
        slug: '',
        author: '',
        minute_read: 5,
        category: 'food',
        thumbnail_image: '',
        main_image: '',
        summary: '',
        contentBlocks: [],
        is_published: false,
        tags: [],
        labels: []
      };

      // Tidak ada redirect otomatis - user bisa pilih mau buat artikel baru atau kembali ke list

    } catch (error) {
      errorMessage = 'Gagal membuat artikel: ' + error.message;
    } finally {
      isLoading = false;
    }
  }

  function toggleTag(tag) {
    if (formData.tags.includes(tag)) {
      formData.tags = formData.tags.filter(t => t !== tag);
    } else {
      formData.tags = [...formData.tags, tag];
    }
  }

  function toggleLabel(label) {
    if (formData.labels.includes(label)) {
      formData.labels = formData.labels.filter(l => l !== label);
    } else {
      formData.labels = [...formData.labels, label];
    }
  }
</script>

<svelte:head>
  <title>Buat Artikel Baru - {$selectedWebsite?.name}</title>
  <style>
    [contenteditable][data-placeholder]:empty:before {
      content: attr(data-placeholder);
      color: #9ca3af;
      pointer-events: none;
    }
    
    .text-highlight {
      background-color: #fef3c7;
      color: #92400e;
      padding: 0;
      margin: 0;
      display: inline;
    }
  </style>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Buat Artikel Baru</h1>
        <p class="mt-2 text-gray-600">Website: <span class="font-semibold text-blue-600">{$selectedWebsite?.name}</span></p>
        <p class="mt-1 text-sm text-gray-500">Artikel akan otomatis terhubung ke website ini</p>
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

  <!-- Form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-8">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Informasi Artikel</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Title -->
        <div class="lg:col-span-2">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Judul Artikel <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            bind:value={formData.title}
            required
            placeholder="Masukkan judul artikel..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Slug -->
        <div class="lg:col-span-2">
          <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
            Slug URL <span class="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            bind:value={formData.slug}
            required
            placeholder="slug-artikel-otomatis"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          />
          <p class="mt-1 text-xs text-gray-500">Slug akan otomatis dibuat dari judul artikel</p>
        </div>

        <!-- Author -->
        <div>
          <label for="author" class="block text-sm font-medium text-gray-700 mb-2">
            Penulis <span class="text-red-500">*</span>
          </label>
          <input
            id="author"
            type="text"
            bind:value={formData.author}
            required
            placeholder="Nama penulis..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Kategori <span class="text-red-500">*</span>
          </label>
          <select
            id="category"
            bind:value={formData.category}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {#each categories as category}
              <option value={category.value}>{category.label}</option>
            {/each}
          </select>
        </div>

        <!-- Read Time -->
        <div>
          <label for="minute_read" class="block text-sm font-medium text-gray-700 mb-2">
            Waktu Baca (menit)
          </label>
          <input
            id="minute_read"
            type="number"
            bind:value={formData.minute_read}
            min="1"
            max="60"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Published Status -->
        <div class="flex items-center">
          <input
            id="is_published"
            type="checkbox"
            bind:checked={formData.is_published}
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="is_published" class="ml-2 block text-sm text-gray-700">
            Publish artikel sekarang
          </label>
        </div>
      </div>
    </div>

    <!-- Images Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Gambar Artikel</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Thumbnail Image -->
        <div>
          <div class="block text-sm font-medium text-gray-700 mb-3">
            Thumbnail Image <span class="text-red-500">*</span>
          </div>
          <ImageUploader
            bind:imageUrl={formData.thumbnail_image}
            bucketName="article-images"
            placeholder="Upload thumbnail artikel"
            on:change={(e) => formData.thumbnail_image = e.detail.url}
          />
          <p class="mt-2 text-xs text-gray-500">
            Gambar thumbnail yang akan ditampilkan di preview artikel. 
            <br>Maksimal 10MB, format: JPG, PNG, WebP
          </p>
        </div>

        <!-- Main Image -->
        <div>
          <div class="block text-sm font-medium text-gray-700 mb-3">
            Main Image
          </div>
          <ImageUploader
            bind:imageUrl={formData.main_image}
            bucketName="article-images"
            placeholder="Upload gambar utama artikel"
            on:change={(e) => formData.main_image = e.detail.url}
          />
          <p class="mt-2 text-xs text-gray-500">
            Gambar utama artikel (opsional). Akan ditampilkan di bagian atas artikel.
            <br>Maksimal 10MB, format: JPG, PNG, WebP
          </p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div class="mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Konten Artikel</h2>
        <p class="text-sm text-gray-600 mb-4">Gunakan editor di bawah untuk menulis konten artikel dengan formatting yang lengkap.</p>
      </div>
      
      <!-- Summary -->
      <div class="mb-6">
        <label for="summary" class="block text-sm font-medium text-gray-700 mb-2">
          Ringkasan Artikel
        </label>
        <textarea
          id="summary"
          bind:value={formData.summary}
          rows="3"
          placeholder="Ringkasan singkat artikel (akan ditampilkan di preview)..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500">Ringkasan singkat yang akan ditampilkan di preview artikel</p>
      </div>

      <!-- Content Block Editor -->
      <div class="mb-6">
        <div class="block text-sm font-medium text-gray-700 mb-3">
          Konten Artikel <span class="text-red-500">*</span>
        </div>
        <ContentBlockEditor 
          contentBlocks={formData.contentBlocks}
          onChange={handleContentBlocksChange}
        />
                 <p class="mt-2 text-xs text-gray-500">
           💡 <strong>Tips:</strong> Gunakan dropdown untuk memilih tipe konten (Rich Text, Image). Setiap block bisa diurutkan dan diatur sesuai kebutuhan.
         </p>
      </div>

      <!-- Content Preview -->
      {#if formData.contentBlocks && formData.contentBlocks.length > 0}
        <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 class="text-sm font-medium text-gray-700 mb-4">Preview Konten:</h4>
          <ContentBlockPreview 
            contentBlocks={formData.contentBlocks}
            showLabels={false}
          />
        </div>
      {/if}
    </div>

    <!-- Tags & Labels Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Tags & Labels</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tags -->
        <div>
          <div class="block text-sm font-medium text-gray-700 mb-3">Tags</div>
          
          {#if isLoadingTagsLabels}
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat tags...
            </div>
          {:else if availableTags.length === 0}
            <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
              Belum ada tags yang tersedia untuk website ini.
            </div>
          {:else}
            <div class="flex flex-wrap gap-2">
              {#each availableTags as tag}
                <button
                  type="button"
                  on:click={() => toggleTag(tag.name)}
                  class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 border {formData.tags.includes(tag.name) ? 'text-white' : 'text-gray-700 hover:bg-gray-200'}"
                  style="background-color: {formData.tags.includes(tag.name) ? tag.color : '#f3f4f6'}; border-color: {tag.color};"
                >
                  {tag.name}
                </button>
              {/each}
            </div>
            <p class="mt-2 text-xs text-gray-500">Klik untuk memilih/membatalkan tag</p>
          {/if}
        </div>

        <!-- Labels -->
        <div>
          <div class="block text-sm font-medium text-gray-700 mb-3">Labels</div>
          
          {#if isLoadingTagsLabels}
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memuat labels...
            </div>
          {:else if availableLabels.length === 0}
            <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
              Belum ada labels yang tersedia untuk website ini.
            </div>
          {:else}
            <div class="flex flex-wrap gap-2">
              {#each availableLabels as label}
                <button
                  type="button"
                  on:click={() => toggleLabel(label.name)}
                  class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 border {formData.labels.includes(label.name) ? 'text-white' : 'text-gray-700 hover:bg-gray-200'}"
                  style="background-color: {formData.labels.includes(label.name) ? label.color : '#f3f4f6'}; border-color: {label.color};"
                >
                  {label.name}
                </button>
              {/each}
            </div>
            <p class="mt-2 text-xs text-gray-500">Klik untuk memilih/membatalkan label</p>
          {/if}
        </div>
      </div>

      <!-- Selected Tags & Labels Display -->
      {#if formData.tags.length > 0 || formData.labels.length > 0}
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Yang Dipilih:</h4>
          <div class="flex flex-wrap gap-2">
            {#each formData.tags as tagName}
              {@const tag = availableTags.find(t => t.name === tagName)}
              {#if tag}
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" style="background-color: {tag.color};">
                  {tag.name}
                  <button
                    type="button"
                    on:click={() => toggleTag(tag.name)}
                    class="ml-1 text-white hover:bg-black hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              {/if}
            {/each}
            {#each formData.labels as labelName}
              {@const label = availableLabels.find(l => l.name === labelName)}
              {#if label}
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white" style="background-color: {label.color};">
                  {label.name}
                  <button
                    type="button"
                    on:click={() => toggleLabel(label.name)}
                    class="ml-1 text-white hover:bg-black hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </span>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Submit Button -->
    <div class="flex items-center justify-end space-x-4">
      <a
        href="/admin/food/articles"
        class="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Batal
      </a>
      <button
        type="submit"
        disabled={isLoading}
        class="px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {#if isLoading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Membuat Artikel...
        {:else}
          Buat Artikel
        {/if}
      </button>
    </div>

    <!-- Success Actions (shown after successful creation) -->
    {#if successMessage}
      <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-green-800 font-medium">{successMessage}</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              on:click={() => {
                // Reset form untuk buat artikel baru
                formData = {
                  title: '',
                  slug: '',
                  author: '',
                  minute_read: 5,
                  category: 'food',
                  thumbnail_image: '',
                  main_image: '',
                  summary: '',
                          contentBlocks: [],
        is_published: false,
        tags: [],
        labels: []
      };
      successMessage = '';
              }}
              class="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            >
              Buat Artikel Baru
            </button>
            <a
              href="/admin/food/articles"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Lihat Semua Artikel
            </a>
          </div>
        </div>
      </div>
    {/if}
  </form>
</div>
