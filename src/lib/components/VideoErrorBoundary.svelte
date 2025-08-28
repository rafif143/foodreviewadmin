<script>
  import { onError } from 'svelte';
  
  let error = null;
  
  onError(({ error: err }) => {
    console.error('Video component error:', err);
    error = err;
  });
</script>

{#if error}
  <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="text-lg font-medium text-red-800 mb-2">Terjadi Kesalahan</h3>
    <p class="text-red-600 mb-4">Maaf, terjadi kesalahan saat memuat video section.</p>
    <button
      on:click={() => window.location.reload()}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Muat Ulang Halaman
    </button>
  </div>
{:else}
  <slot />
{/if}
