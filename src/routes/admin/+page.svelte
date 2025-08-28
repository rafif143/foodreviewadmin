<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore.js';
  
  onMount(() => {
    // Check if website is already selected
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        // If no website selected, redirect to website selection
        goto('/admin/select-website');
        return;
      }
    }
    
    // If website is selected, redirect to articles page
    if ($selectedWebsite) {
      goto('/admin/food/articles');
    } else {
      // Check again after a short delay to ensure store is updated
      setTimeout(() => {
        if ($selectedWebsite) {
          goto('/admin/food/articles');
        } else {
          goto('/admin/select-website');
        }
      }, 100);
    }
  });
</script>

<svelte:head>
  <title>Admin Dashboard - Food Blogging Admin</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
  <div class="text-center">
    <div class="animate-spin h-16 w-16 text-orange-500 mx-auto mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <h2 class="text-xl font-semibold text-gray-800 mb-2">Mengalihkan...</h2>
    <p class="text-gray-600">Memuat dashboard admin</p>
  </div>
</div>
