<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let redirectTo = '/admin';

  let hasWebsite = false;
  let isLoading = true;

  onMount(() => {
    // Check if website is selected from localStorage
    const storedWebsite = localStorage.getItem('selectedWebsite');
    
    if (storedWebsite) {
      try {
        const website = JSON.parse(storedWebsite);
        hasWebsite = true;
      } catch (e) {
        console.error('Error parsing stored website:', e);
        localStorage.removeItem('selectedWebsite');
        goto(redirectTo);
      }
    } else {
      // No website selected, redirect to main admin page
      goto(redirectTo);
    }
    
    isLoading = false;
  });
</script>

{#if isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Memverifikasi website...</p>
    </div>
  </div>
{:else if hasWebsite}
  <slot />
{:else}
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Website Tidak Ditemukan</h3>
      <p class="text-gray-600 mb-4">Silakan pilih website terlebih dahulu</p>
      <button
        on:click={() => goto(redirectTo)}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Pilih Website
      </button>
    </div>
  </div>
{/if}
