<script>
  import VideoSection from '$lib/components/VideoSection.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  export let data;
  
  $: ({ websiteId } = data);
</script>

<svelte:head>
  <title>Video Section - Food Review</title>
  <meta name="description" content="Tonton video menarik tentang makanan dan kuliner" />
</svelte:head>

<Header />

<main>
  {#if websiteId}
    <VideoSection 
      {websiteId}
      title="Video Kuliner Kami"
      description="Tonton video menarik tentang makanan, resep, dan kuliner dari berbagai tempat"
      maxVideos={9}
    />
  {:else}
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Video Section</h2>
      <p class="text-gray-600">Website ID tidak ditemukan</p>
    </div>
  {/if}
</main>

<Footer />
