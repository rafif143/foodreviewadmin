<script>
  import { onMount } from 'svelte';
  import { getVideos, getVideoThumbnail, getVideoEmbedUrl, getVideoPlatform } from '$lib/videos.js';
  import VideoSkeleton from './VideoSkeleton.svelte';

  export let websiteId;
  export let title = "Video Section";
  export let description = "Tonton video menarik dari kami";
  export let maxVideos = 6;

  let videos = [];
  let loading = true;
  let error = null;
  let selectedVideo = null;

  onMount(async () => {
    await loadVideos();
  });

  async function loadVideos() {
    try {
      loading = true;
      error = null;
      videos = await getVideos(websiteId);
      videos = videos.slice(0, maxVideos); // Limit videos
    } catch (err) {
      console.error('Error loading videos:', err);
      error = 'Gagal memuat video';
    } finally {
      loading = false;
    }
  }

  function openVideo(video) {
    selectedVideo = video;
  }

  function closeVideo() {
    selectedVideo = null;
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeVideo();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if videos.length > 0}
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        {#if description}
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        {/if}
      </div>

      <!-- Loading State -->
      {#if loading}
        <VideoSkeleton count={maxVideos} />
      {:else if error}
        <!-- Error State -->
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Gagal memuat video</h3>
          <p class="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      {:else}
        <!-- Video Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each videos as video (video.id)}
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer" on:click={() => openVideo(video)}>
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
                <!-- Play Button Overlay -->
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-200">
                  <div class="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <!-- Platform Badge -->
                <div class="absolute top-2 right-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-75 text-white">
                    {getVideoPlatform(video.url)}
                  </span>
                </div>
              </div>

              <!-- Video Info -->
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                {#if video.description}
                  <p class="text-sm text-gray-600 line-clamp-3">{video.description}</p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>
{/if}

<!-- Video Modal -->
{#if selectedVideo}
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" on:click={closeVideo}>
    <div class="relative w-full max-w-4xl" on:click|stopPropagation>
      <!-- Close Button -->
      <button
        on:click={closeVideo}
        class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Video Player -->
      <div class="bg-black rounded-lg overflow-hidden">
        <div class="aspect-video">
          <iframe
            src={getVideoEmbedUrl(selectedVideo.url)}
            title={selectedVideo.title}
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Video Info -->
      <div class="mt-4 text-white">
        <h3 class="text-xl font-semibold mb-2">{selectedVideo.title}</h3>
        {#if selectedVideo.description}
          <p class="text-gray-300">{selectedVideo.description}</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

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
