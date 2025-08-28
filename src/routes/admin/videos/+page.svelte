<script>
  import { onMount } from 'svelte';
  import { selectedWebsite } from '$lib/stores/websiteStore';
  import { supabase } from '$lib/supabase';
  import VideoForm from './VideoForm.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';

  let videos = [];
  let loading = true;
  let showForm = false;
  let editingVideo = null;
  let error = null;
  let success = null;

  onMount(async () => {
    await loadVideos();
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

      videos = data || [];
    } catch (err) {
      console.error('Error loading videos:', err);
      error = 'Gagal memuat video: ' + err.message;
    } finally {
      loading = false;
    }
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
      success = 'Video berhasil dihapus!';
      setTimeout(() => { success = null; }, 3000);
    } catch (err) {
      console.error('Error deleting video:', err);
      error = 'Gagal menghapus video: ' + err.message;
    }
  }

  function getVideoThumbnail(url) {
    // Extract video ID from YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    
    // For other video platforms, return a placeholder
    return '/placeholder-video.jpg';
  }

  function getVideoPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'YouTube';
    } else if (url.includes('vimeo.com')) {
      return 'Vimeo';
    } else {
      return 'Video';
    }
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

  <!-- Loading State -->
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  {:else if videos.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada video</h3>
      <p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan video pertama Anda.</p>
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
  {:else}
    <!-- Video Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each videos as video (video.id)}
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
          <!-- Video Thumbnail -->
          <div class="relative aspect-video bg-gray-100">
            <img 
              src={getVideoThumbnail(video.url)} 
              alt={video.title}
              class="w-full h-full object-cover"
              on:error={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xNDAgNzBMMTgwIDEwMEwxNDAgMTMwVjcwWiIgZmlsbD0iIzlCOUJBQCIvPgo8L3N2Zz4K';
              }}
            />
            <div class="absolute top-2 right-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-75 text-white">
                {getVideoPlatform(video.url)}
              </span>
            </div>
            <div class="absolute top-2 left-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {video.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                {video.is_active ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          <!-- Video Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
            {#if video.description}
              <p class="text-sm text-gray-600 mb-3 line-clamp-3">{video.description}</p>
            {/if}
            
            <div class="text-xs text-gray-500 mb-4">
              Dibuat: {new Date(video.created_at).toLocaleDateString('id-ID')}
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <button
                on:click={() => openForm(video)}
                class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              <button
                on:click={() => toggleVideoStatus(video)}
                class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md {video.is_active ? 'text-orange-700 bg-orange-50 hover:bg-orange-100' : 'text-green-700 bg-green-50 hover:bg-green-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {video.is_active ? 'Nonaktifkan' : 'Aktifkan'}
              </button>

              <button
                on:click={() => deleteVideo(video)}
                class="inline-flex items-center justify-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
