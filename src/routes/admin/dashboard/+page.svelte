<script>
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore';

  // Data
  let stats = {
    articles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    tags: 0,
    labels: 0
  };
  let recentArticles = [];
  let isLoading = true;
  let errorMessage = '';

  onMount(async () => {
    // Load website from store or localStorage
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        goto('/admin');
        return;
      }
    }
    
    await loadDashboardData();
  });

  async function loadDashboardData() {
    try {
      // Load stats
      const [articlesResult, tagsResult, labelsResult] = await Promise.all([
        supabase
          .from('articles')
          .select('id, is_published')
          .eq('website_id', $selectedWebsite.id),
        supabase
          .from('tags')
          .select('id')
          .eq('website_id', $selectedWebsite.id)
          .eq('is_active', true),
        supabase
          .from('labels')
          .select('id')
          .eq('website_id', $selectedWebsite.id)
          .eq('is_active', true)
      ]);

      if (articlesResult.error) throw articlesResult.error;
      if (tagsResult.error) throw tagsResult.error;
      if (labelsResult.error) throw labelsResult.error;

      const articles = articlesResult.data || [];
      stats.articles = articles.length;
      stats.publishedArticles = articles.filter(a => a.is_published).length;
      stats.draftArticles = articles.filter(a => !a.is_published).length;
      stats.tags = tagsResult.data?.length || 0;
      stats.labels = labelsResult.data?.length || 0;

      // Load recent articles
      const { data: recentArticlesData, error: recentError } = await supabase
        .from('articles')
        .select('id, title, author, category, is_published, created_at, thumbnail_image')
        .eq('website_id', $selectedWebsite.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;
      recentArticles = recentArticlesData || [];

    } catch (error) {
      errorMessage = 'Gagal memuat data dashboard: ' + error.message;
    } finally {
      isLoading = false;
    }
  }

  function getCategoryDisplayName(category) {
    const categories = {
      'food': 'Makanan',
      'recipe': 'Resep',
      'cafe': 'Cafe & Restoran',
      'events': 'Events',
      'things-to-do': 'Things to Do'
    };
    return categories[category] || category;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Dashboard - {$selectedWebsite?.name}</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Selamat datang di admin panel website <span class="font-semibold text-blue-600">{$selectedWebsite?.name}</span></p>
        <p class="mt-1 text-sm text-gray-500">Kelola semua konten website dari sini</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          on:click={() => goto('/admin')}
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ganti Website
        </button>
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

  {#if isLoading}
    <div class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-lg font-medium text-gray-900">Memuat dashboard...</p>
      <p class="mt-2 text-gray-500">Mohon tunggu sebentar</p>
    </div>
  {:else}
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Articles -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Artikel</p>
            <p class="text-2xl font-bold text-gray-900">{stats.articles}</p>
          </div>
        </div>
      </div>

      <!-- Published Articles -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Artikel Published</p>
            <p class="text-2xl font-bold text-gray-900">{stats.publishedArticles}</p>
          </div>
        </div>
      </div>

      <!-- Draft Articles -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Artikel Draft</p>
            <p class="text-2xl font-bold text-gray-900">{stats.draftArticles}</p>
          </div>
        </div>
      </div>

      <!-- Tags & Labels -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Tags & Labels</p>
            <p class="text-2xl font-bold text-gray-900">{stats.tags + stats.labels}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/admin/food/create-article"
            class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Buat Artikel</p>
                <p class="text-xs text-gray-500">Artikel baru</p>
              </div>
            </div>
          </a>

          <a
            href="/admin/food/articles"
            class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">Kelola Artikel</p>
                <p class="text-xs text-gray-500">Lihat semua artikel</p>
              </div>
            </div>
          </a>

          <a
            href="/admin/food/manage-tags-labels"
            class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200">Tags & Labels</p>
                <p class="text-xs text-gray-500">Kelola kategori</p>
              </div>
            </div>
          </a>

          <a
            href="/admin/food"
            class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Makanan</p>
                <p class="text-xs text-gray-500">Kelola konten makanan</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Recent Articles -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900">Artikel Terbaru</h2>
          <a
            href="/admin/food/articles"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Lihat Semua →
          </a>
        </div>
        
        {#if recentArticles.length === 0}
          <div class="text-center py-8">
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
          <div class="space-y-3">
            {#each recentArticles as article}
              <div class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                {#if article.thumbnail_image}
                  <img 
                    src={article.thumbnail_image} 
                    alt={article.title}
                    class="w-12 h-12 rounded-lg object-cover"
                  />
                {:else}
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                {/if}
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                  <div class="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{getCategoryDisplayName(article.category)}</span>
                    <span>•</span>
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {article.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                  <a
                    href="/admin/food/edit-article/{article.id}"
                    class="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- All Website Sections -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Kelola Semua Bagian Website</h2>
              <p class="text-sm text-gray-600 mb-6">Semua konten akan otomatis terhubung ke website <span class="font-semibold text-blue-600">{$selectedWebsite?.name}</span></p>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/admin/food"
          class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Makanan</p>
              <p class="text-xs text-gray-500">Kelola konten makanan</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/recipe"
          class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-200">Resep</p>
              <p class="text-xs text-gray-500">Kelola resep masakan</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/cafe"
          class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors duration-200">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-yellow-600 transition-colors duration-200">Cafe & Restoran</p>
              <p class="text-xs text-gray-500">Kelola info tempat makan</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/events"
          class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200">Events</p>
              <p class="text-xs text-gray-500">Kelola acara & event</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/things-to-do"
          class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">Things to Do</p>
              <p class="text-xs text-gray-500">Kelola aktivitas</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/about-us"
          class="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors duration-200">
              <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors duration-200">About Us</p>
              <p class="text-xs text-gray-500">Kelola informasi tentang</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  {/if}
</div>
