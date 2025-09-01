<script>
  import { onMount } from 'svelte';
  import { getVideos, getVideosByType, getVideoStats, detectVideoType } from '$lib/videos.js';

  export let websiteId;
  export let title = "Video Section";
  export let description = "Kelola video YouTube dan TikTok";
  export let maxVideos = 50; // Lebih banyak untuk table

  let videos = [];
  let allVideos = [];
  let loading = true;
  let error = null;
  let selectedFilter = 'all';
  let videoStats = { total: 0, youtube: 0, tiktok: 0 };

  onMount(async () => {
    await loadVideos();
    await loadStats();
  });

  async function loadVideos() {
    try {
      loading = true;
      error = null;
      allVideos = await getVideos(websiteId);
      filterVideos();
    } catch (err) {
      console.error('Error loading videos:', err);
      error = 'Gagal memuat video';
    } finally {
      loading = false;
    }
  }

  async function loadStats() {
    try {
      videoStats = await getVideoStats(websiteId);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

  function filterVideos() {
    if (selectedFilter === 'all') {
      videos = allVideos.slice(0, maxVideos);
    } else {
      videos = allVideos
        .filter(video => (video.video_type || detectVideoType(video.url)) === selectedFilter)
        .slice(0, maxVideos);
    }
  }

  function handleFilterChange(filter) {
    selectedFilter = filter;
    filterVideos();
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getPlatformBadge(video) {
    const type = video.video_type || detectVideoType(video.url);
    switch (type) {
      case 'youtube':
        return { name: 'YouTube', color: 'bg-red-100 text-red-800' };
      case 'tiktok':
        return { name: 'TikTok', color: 'bg-gray-100 text-gray-800' };
      default:
        return { name: 'Video', color: 'bg-blue-100 text-blue-800' };
    }
  }

  function openVideoInNewTab(url) {
    window.open(url, '_blank');
  }
</script>

<section class="py-8 bg-gray-50 min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      {#if description}
        <p class="text-lg text-gray-600">{description}</p>
      {/if}
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Videos</dt>
              <dd class="text-3xl font-bold text-gray-900">{videoStats.total}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">YouTube</dt>
              <dd class="text-3xl font-bold text-gray-900">{videoStats.youtube}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.302-2.003-1.302-3.338h-3.517v14.717c0 2.748-2.156 4.99-4.823 4.99a4.831 4.831 0 01-4.823-4.99c0-2.748 2.156-4.99 4.823-4.99.267 0 .53.023.787.067V7.257c-.254-.036-.513-.054-.787-.054C3.651 7.203 0 10.998 0 15.717S3.651 24.23 8.099 24.23s8.099-3.795 8.099-8.513V8.434a9.637 9.637 0 005.123 1.474v-3.517c-.711 0-1.377-.192-1.95-.532-.287-.17-.547-.375-.772-.616-.225-.24-.413-.515-.556-.821z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">TikTok</dt>
              <dd class="text-3xl font-bold text-gray-900">{videoStats.tiktok}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Aktif</dt>
              <dd class="text-3xl font-bold text-gray-900">{videos.filter(v => v.is_active).length}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            on:click={() => handleFilterChange('all')}
            class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200
              {selectedFilter === 'all' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            Semua ({videoStats.total})
          </button>
          
          <button
            on:click={() => handleFilterChange('youtube')}
            class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200
              {selectedFilter === 'youtube' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            YouTube ({videoStats.youtube})
          </button>
          
          <button
            on:click={() => handleFilterChange('tiktok')}
            class="border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200
              {selectedFilter === 'tiktok' 
                ? 'border-gray-500 text-gray-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            TikTok ({videoStats.tiktok})
          </button>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-sm text-gray-500">Memuat video...</p>
        </div>
      </div>
    {:else if error}
      <!-- Error State -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Gagal memuat video</h3>
          <p class="mt-1 text-sm text-gray-500">{error}</p>
          <button 
            on:click={loadVideos}
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    {:else if videos.length === 0}
      <!-- Empty State -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada video</h3>
          <p class="mt-1 text-sm text-gray-500">
            {selectedFilter === 'all' ? 'Belum ada video yang ditambahkan' : 
             selectedFilter === 'youtube' ? 'Belum ada video YouTube' : 
             'Belum ada video TikTok'}
          </p>
        </div>
      </div>
    {:else}
      <!-- Video Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each videos as video (video.id)}
              {@const badge = getPlatformBadge(video)}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-20 h-12 bg-gray-100 rounded overflow-hidden">
                      <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        {#if (video.video_type || detectVideoType(video.url)) === 'tiktok'}
                          <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.302-2.003-1.302-3.338h-3.517v14.717c0 2.748-2.156 4.99-4.823 4.99a4.831 4.831 0 01-4.823-4.99c0-2.748 2.156-4.99 4.823-4.99.267 0 .53.023.787.067V7.257c-.254-.036-.513-.054-.787-.054C3.651 7.203 0 10.998 0 15.717S3.651 24.23 8.099 24.23s8.099-3.795 8.099-8.513V8.434a9.637 9.637 0 005.123 1.474v-3.517c-.711 0-1.377-.192-1.95-.532-.287-.17-.547-.375-.772-.616-.225-.24-.413-.515-.556-.821z"/>
                          </svg>
                        {:else}
                          <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        {/if}
                      </div>
                    </div>
                    <div class="ml-4 flex-1">
                      <div class="text-sm font-medium text-gray-900 line-clamp-2">{video.title}</div>
                      {#if video.description}
                        <div class="text-sm text-gray-500 line-clamp-1 mt-1">{video.description}</div>
                      {/if}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {badge.color}">
                    {badge.name}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    {video.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    {video.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(video.created_at)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    on:click={() => openVideoInNewTab(video.url)}
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Lihat
                  </button>
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    URL
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</section>

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
