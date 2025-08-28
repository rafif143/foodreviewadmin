<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore';

  // Data
  let articles = [];
  let isLoading = true;
  let errorMessage = '';
  let searchTerm = '';
  let selectedCategory = '';
  let selectedStatus = '';

  // Categories
  const categories = [
    { value: 'food', label: 'Makanan' },
    { value: 'recipe', label: 'Resep' },
    { value: 'cafe', label: 'Cafe & Restoran' },
    { value: 'events', label: 'Events' },
    { value: 'things-to-do', label: 'Things to Do' }
  ];

  // Status options
  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'true', label: 'Published' },
    { value: 'false', label: 'Draft' }
  ];

  onMount(async () => {
    // Load website from store or localStorage
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        goto('/admin');
        return;
      }
    }
    
    await loadArticles();
  });

  async function loadArticles() {
    try {
      isLoading = true;
      
      let query = supabase
        .from('articles')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedStatus !== '') {
        query = query.eq('is_published', selectedStatus === 'true');
      }

      const { data, error } = await query;

      if (error) throw error;
      articles = data || [];

    } catch (error) {
      errorMessage = 'Gagal memuat artikel: ' + error.message;
    } finally {
      isLoading = false;
    }
  }

  async function togglePublishStatus(articleId, currentStatus) {
    try {
      const newStatus = !currentStatus;
      const updateData = {
        is_published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', articleId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Update local state
      articles = articles.map(article => 
        article.id === articleId 
          ? { ...article, is_published: newStatus, published_at: updateData.published_at }
          : article
      );

    } catch (error) {
      errorMessage = 'Gagal mengubah status artikel: ' + error.message;
    }
  }

  async function deleteArticle(articleId) {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)
        .eq('website_id', $selectedWebsite.id);

      if (error) throw error;

      // Remove from local state
      articles = articles.filter(article => article.id !== articleId);

    } catch (error) {
      errorMessage = 'Gagal menghapus artikel: ' + error.message;
    }
  }

  function getCategoryDisplayName(category) {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj ? categoryObj.label : category;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getReadTime(minutes) {
    return `${minutes} menit`;
  }

  // Watch for filter changes
  $: if (searchTerm || selectedCategory || selectedStatus) {
    loadArticles();
  }
</script>

<svelte:head>
  <title>Kelola Artikel - {$selectedWebsite?.name}</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Kelola Artikel</h1>
        <p class="mt-2 text-gray-600">Website: <span class="font-semibold text-blue-600">{$selectedWebsite?.name}</span></p>
        <p class="mt-1 text-sm text-gray-500">Semua artikel akan otomatis terhubung ke website ini</p>
      </div>
      <div class="flex items-center gap-3">
        <a
          href="/admin/food/create-article"
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Buat Artikel Baru
        </a>
      </div>
    </div>
  </div>

  <!-- Error Message -->
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

  <!-- Filters -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Filter Artikel</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Cari Artikel</label>
        <input
          id="search"
          type="text"
          bind:value={searchTerm}
          placeholder="Cari judul, penulis, atau ringkasan..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Category Filter -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
        <select
          id="category"
          bind:value={selectedCategory}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Semua Kategori</option>
          {#each categories as category}
            <option value={category.value}>{category.label}</option>
          {/each}
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          id="status"
          bind:value={selectedStatus}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {#each statusOptions as status}
            <option value={status.value}>{status.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-lg font-medium text-gray-900">Memuat artikel...</p>
      <p class="mt-2 text-gray-500">Mohon tunggu sebentar</p>
    </div>
  {:else if articles.length === 0}
    <div class="text-center py-20">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada artikel</h3>
      <p class="mt-1 text-sm text-gray-500">Mulai dengan membuat artikel pertama</p>
      <div class="mt-4">
        <a
          href="/admin/food/create-article"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
        >
          Buat Artikel
        </a>
      </div>
    </div>
  {:else}
    <!-- Articles List -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Artikel ({articles.length})</h3>
          <p class="text-sm text-gray-500">Website: {$selectedWebsite?.name}</p>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200">
        {#each articles as article}
          <div class="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div class="flex items-start space-x-4">
              <!-- Thumbnail -->
              <div class="flex-shrink-0">
                {#if article.thumbnail_image}
                  <img 
                    src={article.thumbnail_image} 
                    alt={article.title}
                    class="w-20 h-20 rounded-lg object-cover"
                  />
                {:else}
                  <div class="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                {/if}
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-2">
                  <h4 class="text-lg font-medium text-gray-900 truncate">{article.title}</h4>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {article.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary || 'Tidak ada ringkasan'}</p>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {article.author}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {getCategoryDisplayName(article.category)}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getReadTime(article.minute_read)}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(article.created_at)}
                  </span>
                </div>

                <!-- Tags & Labels -->
                {#if article.tags && article.tags.length > 0 || article.labels && article.labels.length > 0}
                  <div class="flex items-center space-x-2 mt-3">
                    {#if article.tags && article.tags.length > 0}
                      <div class="flex items-center space-x-1">
                        <span class="text-xs text-gray-500">Tags:</span>
                        {#each article.tags.slice(0, 3) as tag}
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        {/each}
                        {#if article.tags.length > 3}
                          <span class="text-xs text-gray-500">+{article.tags.length - 3}</span>
                        {/if}
                      </div>
                    {/if}
                    
                    {#if article.labels && article.labels.length > 0}
                      <div class="flex items-center space-x-1">
                        <span class="text-xs text-gray-500">Labels:</span>
                        {#each article.labels.slice(0, 3) as label}
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {label}
                          </span>
                        {/each}
                        {#if article.labels.length > 3}
                          <span class="text-xs text-gray-500">+{article.labels.length - 3}</span>
                        {/if}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button
                  on:click={() => togglePublishStatus(article.id, article.is_published)}
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  title={article.is_published ? 'Unpublish' : 'Publish'}
                >
                  {#if article.is_published}
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  {:else}
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  {/if}
                </button>

                <a
                  href="/admin/food/edit-article/{article.id}"
                  class="p-2 text-blue-400 hover:text-blue-600 transition-colors duration-200"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </a>

                <button
                  on:click={() => deleteArticle(article.id)}
                  class="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
