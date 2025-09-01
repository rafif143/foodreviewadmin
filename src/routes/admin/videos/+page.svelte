<script>
  import { onMount } from 'svelte';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore';
  import { supabase } from '$lib/supabase';
  import VideoForm from './VideoForm.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { detectVideoType } from '$lib/videos.js';

  let videos = [];
  let allVideos = [];
  let loading = true;
  let showForm = false;
  let editingVideo = null;
  let error = null;
  let success = null;
  let selectedFilter = 'all';
  let videoStats = { total: 0, youtube: 0, tiktok: 0 };
  
  // Pagination variables
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  let paginatedVideos = [];

  onMount(async () => {
    // Load website from storage if not already loaded
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        error = 'Website belum dipilih. Silakan pilih website terlebih dahulu.';
        return;
      }
    }
    
    await loadVideos();
    await loadStats();
  });

  async function loadVideos() {
    try {
      loading = true;
      error = null;

      if (!$selectedWebsite) {
        error = 'Website belum dipilih';
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('*')
        .eq('website_id', $selectedWebsite.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      allVideos = data || [];
      filterVideos();
    } catch (err) {
      console.error('Error loading videos:', err);
      error = 'Gagal memuat video: ' + err.message;
    } finally {
      loading = false;
    }
  }

  async function loadStats() {
    try {
      if (!$selectedWebsite) return;
      
      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('video_type')
        .eq('website_id', $selectedWebsite.id);

      if (fetchError) throw fetchError;

      const stats = { total: 0, youtube: 0, tiktok: 0 };
      data?.forEach(video => {
        stats.total++;
        const type = video.video_type || detectVideoType(video.url || '');
        if (type === 'youtube') stats.youtube++;
        else if (type === 'tiktok') stats.tiktok++;
      });

      videoStats = stats;
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

  function filterVideos() {
    if (selectedFilter === 'all') {
      videos = allVideos;
    } else {
      videos = allVideos.filter(video => {
        const type = video.video_type || detectVideoType(video.url);
        return type === selectedFilter;
      });
    }
    
    // Reset pagination when filtering
    currentPage = 1;
    updatePagination();
  }

  function updatePagination() {
    totalPages = Math.ceil(videos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    paginatedVideos = videos.slice(startIndex, endIndex);
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      updatePagination();
    }
  }

  function handleFilterChange(filter) {
    selectedFilter = filter;
    filterVideos();
  }

  function openForm(video = null) {
    editingVideo = video;
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    editingVideo = null;
  }

  async function handleVideoSaved() {
    await loadVideos();
    await loadStats();
    closeForm();
    success = editingVideo ? 'Video berhasil diperbarui!' : 'Video berhasil ditambahkan!';
    setTimeout(() => { success = null; }, 3000);
  }

  async function toggleVideoStatus(video) {
    try {
      const { error: updateError } = await supabase
        .from('videos')
        .update({ is_active: !video.is_active })
        .eq('id', video.id);

      if (updateError) throw updateError;

      await loadVideos();
      success = `Video ${video.is_active ? 'dinonaktifkan' : 'diaktifkan'}!`;
      setTimeout(() => { success = null; }, 3000);
    } catch (err) {
      console.error('Error toggling video status:', err);
      error = 'Gagal mengubah status video: ' + err.message;
    }
  }

  async function deleteVideo(video) {
    if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);

      if (deleteError) throw deleteError;

      await loadVideos();
      await loadStats();
      success = 'Video berhasil dihapus!';
      setTimeout(() => { success = null; }, 3000);
    } catch (err) {
      console.error('Error deleting video:', err);
      error = 'Gagal menghapus video: ' + err.message;
    }
  }

  function getVideoThumbnail(url, videoType) {
    if (videoType === 'tiktok') {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMDEwMTAxIi8+PHRleHQgeD0iMTYwIiB5PSI5MCIgZmlsbD0iI0ZGRkZGRiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VGlrVG9rPC90ZXh0Pjwvc3ZnPg==';
    }
    
    // Extract video ID from YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    
    // For other video platforms, return a placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNDAgNzBMMTgwIDEwMEwxNDAgMTMwVjcwWiIgZmlsbD0iIzlCOUJBQCIvPgo8L3N2Zz4K';
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

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function openVideoInNewTab(url) {
    window.open(url, '_blank');
  }

  // Update pagination when videos change
  $: if (videos.length > 0) {
    updatePagination();
  }
</script>

<svelte:head>
  <title>Kelola Video - Admin Panel</title>
</svelte:head>

<PageHeader 
  title="Kelola Video Section" 
  description="Atur video yang ditampilkan di website Anda"
/>

{#if showForm}
  <VideoForm 
    {editingVideo}
    on:close={closeForm}
    on:saved={handleVideoSaved}
  />
{/if}

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Alert Messages -->
  {#if error}
    <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{error}</p>
        </div>
      </div>
    </div>
  {/if}

  {#if success}
    <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-green-800">{success}</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Header with Add Button -->
  <div class="mb-6 flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Video Section</h1>
      <p class="text-gray-600">Kelola video yang ditampilkan di website Anda</p>
    </div>
    <button
      on:click={() => openForm()}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Tambah Video
    </button>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <div class="mt-6">
          <button
            on:click={() => openForm()}
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Video Pertama
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Video Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Pagination Info -->
      <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, videos.length)} dari {videos.length} video
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label for="itemsPerPage" class="text-sm text-gray-500">Tampilkan:</label>
            <select
              id="itemsPerPage"
              bind:value={itemsPerPage}
              on:change={() => {
                currentPage = 1;
                updatePagination();
              }}
              class="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div class="text-sm text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>
      </div>
      
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
          {#each paginatedVideos as video (video.id)}
            {@const badge = getPlatformBadge(video)}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-20 h-12 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={getVideoThumbnail(video.url, video.video_type)} 
                      alt={video.title}
                      class="w-full h-full object-cover"
                      on:error={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNDAgNzBMMTgwIDEwMEwxNDAgMTMwVjcwWiIgZmlsbD0iIzlCOUJBQCIvPgo8L3N2Zz4K';
                      }}
                    />
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
                <div class="flex space-x-2">
                  <button
                    on:click={() => openForm(video)}
                    class="text-blue-600 hover:text-blue-900"
                    title="Edit Video"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    on:click={() => toggleVideoStatus(video)}
                    class="text-orange-600 hover:text-orange-900"
                    title={video.is_active ? 'Nonaktifkan Video' : 'Aktifkan Video'}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    on:click={() => openVideoInNewTab(video.url)}
                    class="text-green-600 hover:text-green-900"
                    title="Lihat Video"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>

                  <button
                    on:click={() => deleteVideo(video)}
                    class="text-red-600 hover:text-red-900"
                    title="Hapus Video"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="mt-6 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <!-- Previous Button -->
          <button
            on:click={() => goToPage(currentPage - 1)}
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Page Numbers -->
          {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
            {#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
              <button
                on:click={() => goToPage(page)}
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium {currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}"
              >
                {page}
              </button>
            {:else if page === currentPage - 2 || page === currentPage + 2}
              <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            {/if}
          {/each}
          
          <!-- Next Button -->
          <button
            on:click={() => goToPage(currentPage + 1)}
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    {/if}
  {/if}
</div>

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
