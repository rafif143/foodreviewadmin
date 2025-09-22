<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore';
  import ContentBlockEditor from '$lib/components/ContentBlockEditor.svelte';
  import ContentBlockPreview from '$lib/components/ContentBlockPreview.svelte';
  import ImageUploader from '$lib/components/ImageUploader.svelte';
  import { parseArticleContent, stringifyContentBlocks } from '$lib/utils/contentParser.js';
  import { cleanupUnusedImages, extractFormImageUrls, removeTempImage } from '$lib/utils/imageCleanup.js';

  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let article = null;
  let formData = {
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

  const categories = [
    { value: 'food', label: 'Makanan' },
    { value: 'recipe', label: 'Resep' },
    { value: 'cafe', label: 'Cafe & Restoran' },
    { value: 'events', label: 'Events' },
    { value: 'things-to-do', label: 'Things to Do' }
  ];

  let availableTags = [];
  let availableLabels = [];

  onMount(async () => {
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        goto('/admin');
        return;
      }
    }
    await loadArticle();
    await loadAvailableTagsAndLabels();
  });

  async function loadArticle() {
    try {
      const articleId = $page.params.id;
      const { data: articleData, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .eq('website_id', $selectedWebsite.id)
        .single();

      if (error) throw error;
      article = articleData;

      // Parse content menggunakan utility function
      const contentBlocks = parseArticleContent(article.content);

      formData = {
        title: article.title || '',
        slug: article.slug || '',
        author: article.author || '',
        minute_read: article.minute_read || 5,
        category: article.category || 'food',
        thumbnail_image: article.thumbnail_image || '',
        main_image: article.main_image || '',
        summary: article.summary || '',
        contentBlocks: contentBlocks,
        is_published: article.is_published || false,
        tags: article.tags || [],
        labels: article.labels || []
      };
    } catch (error) {
      errorMessage = 'Gagal memuat artikel: ' + error.message;
    }
  }

  async function loadAvailableTagsAndLabels() {
    try {
      if (!$selectedWebsite) return;
      
      const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .eq('is_active', true)
        .order('name');

      const { data: labels } = await supabase
        .from('labels')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .eq('is_active', true)
        .order('name');

      availableTags = tags || [];
      availableLabels = labels || [];
    } catch (error) {
      console.error('Error loading tags/labels:', error);
    }
  }

  $: if (formData.title) {
    formData.slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function handleContentBlocksChange(newContentBlocks) {
    formData.contentBlocks = newContentBlocks;
  }

  async function handleSubmit() {
    try {
      isLoading = true;
      errorMessage = '';

      if (!formData.title.trim()) throw new Error('Judul artikel harus diisi');
      if (!formData.slug.trim()) throw new Error('Slug artikel harus diisi');
      if (!formData.author.trim()) throw new Error('Penulis artikel harus diisi');
      if (!formData.contentBlocks || formData.contentBlocks.length === 0) throw new Error('Konten artikel harus diisi');

      // Cleanup unused images before updating
      try {
        await cleanupUnusedImages(article, formData);
      } catch (cleanupError) {
        console.warn('Error cleaning up unused images:', cleanupError);
        // Continue with update even if cleanup fails
      }

      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('website_id', $selectedWebsite.id)
        .eq('slug', formData.slug)
        .neq('id', $page.params.id)
        .single();

      if (existingArticle) {
        throw new Error('Slug artikel sudah ada, gunakan judul yang berbeda');
      }

      const articleData = {
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
        labels: formData.labels.length > 0 ? formData.labels : [],
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', $page.params.id);

      if (error) throw error;

      // Mark current images as permanent (remove from temp tracking)
      const currentImageUrls = extractFormImageUrls(formData);
      currentImageUrls.forEach(url => removeTempImage(url));

      successMessage = 'Artikel berhasil diperbarui!';
      // Tidak ada redirect otomatis - user bisa pilih mau edit lagi atau kembali ke list

    } catch (error) {
      errorMessage = 'Gagal memperbarui artikel: ' + error.message;
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
  <title>Edit Artikel - {$selectedWebsite?.name}</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Edit Artikel</h1>
        <p class="mt-2 text-gray-600">Website: <span class="font-semibold text-blue-600">{$selectedWebsite?.name}</span></p>
      </div>
      <a
        href="/admin/food/articles"
        class="px-4 py-2 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
      >
        Kembali ke Artikel
      </a>
    </div>
      </div>

  {#if !article}
        <div class="text-center py-12">
      <div class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-gray-600">Memuat artikel...</p>
        </div>
      {:else}
        {#if errorMessage}
      <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p class="text-sm text-red-800">{errorMessage}</p>
          </div>
        {/if}

        {#if successMessage}
      <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p class="text-sm text-green-800">{successMessage}</p>
          </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit} class="space-y-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Informasi Artikel</h2>
            
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Konten Artikel</h2>

        <div class="mb-6">
                <label for="summary" class="block text-sm font-medium text-gray-700 mb-2">
            Ringkasan Artikel
                </label>
                <textarea
                  id="summary"
                  bind:value={formData.summary}
                  rows="3"
            placeholder="Ringkasan singkat artikel..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
          </div>

        <div class="mb-6">
          <div class="block text-sm font-medium text-gray-700 mb-3">
            Konten Artikel <span class="text-red-500">*</span>
          </div>
          <ContentBlockEditor 
            contentBlocks={formData.contentBlocks}
            onChange={handleContentBlocksChange}
          />
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

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Tags & Labels</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div class="block text-sm font-medium text-gray-700 mb-3">Tags</div>
            {#if availableTags.length > 0}
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
            {:else}
              <p class="text-sm text-gray-500">Belum ada tags yang tersedia</p>
            {/if}
          </div>

          <div>
            <div class="block text-sm font-medium text-gray-700 mb-3">Labels</div>
            {#if availableLabels.length > 0}
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
            {:else}
              <p class="text-sm text-gray-500">Belum ada labels yang tersedia</p>
            {/if}
          </div>
              </div>
            </div>

      <div class="flex items-center justify-end space-x-4">
            <a
              href="/admin/food/articles"
          class="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              Batal
            </a>
            <button
              type="submit"
          disabled={isLoading}
          class="px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isLoading}
            Memperbarui Artikel...
              {:else}
            Perbarui Artikel
              {/if}
            </button>
          </div>

      <!-- Success Actions (shown after successful update) -->
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
                  // Reset success message untuk edit lagi
                  successMessage = '';
                }}
                class="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              >
                Edit Lagi
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
  {/if}
</div>
