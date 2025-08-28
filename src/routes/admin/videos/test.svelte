<script>
  import { onMount } from 'svelte';
  import VideoForm from './VideoForm.svelte';
  import VideoSection from '$lib/components/VideoSection.svelte';

  let showForm = false;
  let testVideos = [
    {
      id: 1,
      website_id: 1,
      title: 'Resep Nasi Goreng Spesial',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Cara membuat nasi goreng yang enak dan mudah dibuat di rumah.',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      is_active: true
    },
    {
      id: 2,
      website_id: 1,
      title: 'Makanan Khas Kelantan',
      url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      description: 'Jelajahi kuliner khas Kelantan yang terkenal dengan cita rasa yang unik.',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      is_active: true
    }
  ];

  function handleVideoSaved(event) {
    console.log('Video saved:', event.detail);
    showForm = false;
  }

  function handleClose() {
    showForm = false;
  }
</script>

<svelte:head>
  <title>Video Section Test</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-8">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Video Section Test</h1>

    <!-- Test Buttons -->
    <div class="mb-8 space-x-4">
      <button
        on:click={() => showForm = true}
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Test Video Form
      </button>
    </div>

    <!-- Test Video Section Component -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Video Section Component Test</h2>
      <VideoSection 
        websiteId={1}
        title="Test Video Section"
        description="Ini adalah test untuk komponen video section"
        maxVideos={4}
      />
    </div>

    <!-- Test Video Form Modal -->
    {#if showForm}
      <VideoForm 
        on:close={handleClose}
        on:saved={handleVideoSaved}
      />
    {/if}

    <!-- Test Data Display -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Test Data</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each testVideos as video}
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900">{video.title}</h3>
            <p class="text-sm text-gray-600 mt-1">{video.description}</p>
            <p class="text-xs text-gray-500 mt-2">URL: {video.url}</p>
            <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full {video.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
              {video.is_active ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
