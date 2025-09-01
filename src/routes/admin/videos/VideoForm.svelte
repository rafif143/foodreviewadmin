<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { selectedWebsite } from '$lib/stores/websiteStore';
  import { supabase } from '$lib/supabase';
  import { detectVideoType, isValidVideoUrl } from '$lib/videos.js';

  export let editingVideo = null;

  const dispatch = createEventDispatcher();

  let form = {
    title: '',
    url: '',
    description: '',
    video_type: 'youtube',
    is_active: true
  };

  let loading = false;
  let error = null;
  let videoPreview = null;

  onMount(() => {
    if (editingVideo) {
      form = { ...editingVideo };
      updateVideoPreview();
    }
  });

  function updateVideoPreview() {
    if (form.url) {
      const detectedType = detectVideoType(form.url);
      
      // Auto-update form video_type based on URL if it doesn't match
      if (form.video_type !== detectedType) {
        form.video_type = detectedType;
      }

      if (detectedType === 'youtube') {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = form.url.match(youtubeRegex);
        
        if (match) {
          videoPreview = {
            type: 'youtube',
            id: match[1],
            thumbnail: `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${match[1]}`
          };
        }
      } else if (detectedType === 'tiktok') {
        const tiktokRegex = /(?:tiktok\.com\/@[^\/]+\/video\/(\d+)|tiktok\.com\/v\/(\d+)|vm\.tiktok\.com\/([A-Za-z0-9]+))/;
        const match = form.url.match(tiktokRegex);
        
        if (match) {
          const videoId = match[1] || match[2] || match[3];
          videoPreview = {
            type: 'tiktok',
            id: videoId,
            embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
            originalUrl: form.url
          };
        }
      } else {
        videoPreview = {
          type: 'other',
          url: form.url
        };
      }
    } else {
      videoPreview = null;
    }
  }

  function validateForm() {
    if (!form.title.trim()) {
      error = 'Judul video harus diisi';
      return false;
    }
    
    if (!form.url.trim()) {
      error = 'URL video harus diisi';
      return false;
    }

    // Validate URL and video type
    if (!isValidVideoUrl(form.url, form.video_type)) {
      if (form.video_type === 'youtube') {
        error = 'URL YouTube tidak valid. Gunakan format: https://www.youtube.com/watch?v=... atau https://youtu.be/...';
      } else if (form.video_type === 'tiktok') {
        error = 'URL TikTok tidak valid. Gunakan format: https://www.tiktok.com/@username/video/... atau https://vm.tiktok.com/...';
      } else {
        error = 'URL video tidak valid';
      }
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    try {
      loading = true;
      error = null;

      if (!$selectedWebsite) {
        error = 'Website belum dipilih';
        return;
      }

      const videoData = {
        website_id: $selectedWebsite.id,
        title: form.title.trim(),
        url: form.url.trim(),
        description: form.description.trim() || null,
        video_type: form.video_type,
        is_active: form.is_active
      };

      let result;
      
      if (editingVideo) {
        // Update existing video
        const { data, error: updateError } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingVideo.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = data;
      } else {
        // Create new video
        const { data, error: insertError } = await supabase
          .from('videos')
          .insert(videoData)
          .select()
          .single();

        if (insertError) throw insertError;
        result = data;
      }

      dispatch('saved', result);
    } catch (err) {
      console.error('Error saving video:', err);
      error = 'Gagal menyimpan video: ' + err.message;
    } finally {
      loading = false;
    }
  }

  function handleClose() {
    dispatch('close');
  }

  $: if (form.url) {
    updateVideoPreview();
  }
</script>

<!-- Modal Overlay -->
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
  <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
    <!-- Modal Header -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-900">
        {editingVideo ? 'Edit Video' : 'Tambah Video Baru'}
      </h3>
      <button
        on:click={handleClose}
        class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Error Message -->
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

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Judul Video <span class="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          bind:value={form.title}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan judul video"
          required
        />
      </div>

      <!-- Video Type -->
      <div>
        <label for="video_type" class="block text-sm font-medium text-gray-700 mb-2">
          Platform Video <span class="text-red-500">*</span>
        </label>
        <select
          id="video_type"
          bind:value={form.video_type}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
        </select>
        <p class="mt-1 text-sm text-gray-500">
          Pilih platform video yang sesuai dengan URL
        </p>
      </div>

      <!-- URL -->
      <div>
        <label for="url" class="block text-sm font-medium text-gray-700 mb-2">
          URL Video <span class="text-red-500">*</span>
        </label>
        <input
          id="url"
          type="url"
          bind:value={form.url}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={form.video_type === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://www.tiktok.com/@username/video/...'}
          required
        />
        <p class="mt-1 text-sm text-gray-500">
          {#if form.video_type === 'youtube'}
            Format YouTube: https://www.youtube.com/watch?v=VIDEO_ID atau https://youtu.be/VIDEO_ID
          {:else if form.video_type === 'tiktok'}
            Format TikTok: https://www.tiktok.com/@username/video/VIDEO_ID atau https://vm.tiktok.com/SHORT_ID
          {:else}
            Masukkan URL video yang valid
          {/if}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <textarea
          id="description"
          bind:value={form.description}
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Masukkan deskripsi video (opsional)"
        ></textarea>
      </div>

      <!-- Active Status -->
      <div class="flex items-center">
        <input
          id="is_active"
          type="checkbox"
          bind:checked={form.is_active}
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="is_active" class="ml-2 block text-sm text-gray-700">
          Video aktif (akan ditampilkan di website)
        </label>
      </div>

      <!-- Video Preview -->
      {#if videoPreview}
        <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 class="text-sm font-medium text-gray-700 mb-3">Preview Video</h4>
          
          {#if videoPreview.type === 'youtube'}
            <div class="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={videoPreview.embedUrl}
                title="Video preview"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div class="mt-2 flex items-center text-xs text-gray-500">
              <div class="w-4 h-4 bg-red-600 rounded-sm mr-2 flex items-center justify-center">
                <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              YouTube Video ID: {videoPreview.id}
            </div>
          {:else if videoPreview.type === 'tiktok'}
            <div class="aspect-[9/16] max-h-96 mx-auto bg-black rounded-lg overflow-hidden">
              <iframe
                src={videoPreview.embedUrl}
                title="TikTok video preview"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
            <div class="mt-2 flex items-center text-xs text-gray-500">
              <div class="w-4 h-4 bg-black rounded-sm mr-2 flex items-center justify-center">
                <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.302-2.003-1.302-3.338h-3.517v14.717c0 2.748-2.156 4.99-4.823 4.99a4.831 4.831 0 01-4.823-4.99c0-2.748 2.156-4.99 4.823-4.99.267 0 .53.023.787.067V7.257c-.254-.036-.513-.054-.787-.054C3.651 7.203 0 10.998 0 15.717S3.651 24.23 8.099 24.23s8.099-3.795 8.099-8.513V8.434a9.637 9.637 0 005.123 1.474v-3.517c-.711 0-1.377-.192-1.95-.532-.287-.17-.547-.375-.772-.616-.225-.24-.413-.515-.556-.821z"/>
                </svg>
              </div>
              TikTok Video ID: {videoPreview.id}
            </div>
          {:else}
            <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">Video dari platform lain</p>
                <p class="text-xs text-gray-400 break-all">{videoPreview.url}</p>
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          on:click={handleClose}
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {/if}
          {loading ? 'Menyimpan...' : (editingVideo ? 'Update Video' : 'Simpan Video')}
        </button>
      </div>
    </form>
  </div>
</div>
