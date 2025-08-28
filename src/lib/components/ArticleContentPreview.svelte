<script>
  import ContentBlockPreview from './ContentBlockPreview.svelte';
  
  export let content = null;
  export let showPreview = false;
  
  // Parse content blocks from JSON string or use as is
  $: contentBlocks = (() => {
    if (!content) return [];
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch {
        return [];
      }
    }
    return Array.isArray(content) ? content : [];
  })();
  
  // Toggle preview
  function togglePreview() {
    showPreview = !showPreview;
  }
</script>

<div class="article-content-preview">
  <!-- Preview Toggle Button -->
  <div class="mb-4">
    <button
      type="button"
      on:click={togglePreview}
      class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
    >
      {#if showPreview}
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Sembunyikan Preview
      {:else}
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Tampilkan Preview
      {/if}
    </button>
  </div>

  <!-- Preview Content -->
  {#if showPreview}
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Preview Konten Artikel</h3>
      
      {#if !content || (Array.isArray(content) && content.length === 0)}
        <div class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Belum ada konten untuk ditampilkan</p>
          <p class="text-sm">Tambahkan konten di editor di atas untuk melihat preview</p>
        </div>
      {:else}
        <ContentBlockPreview 
          contentBlocks={contentBlocks}
          showLabels={false}
        />
        
        <!-- Content Info -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="text-sm font-medium text-blue-800 mb-2">Informasi Konten:</h4>
                     <div class="text-sm text-blue-700 space-y-1">
             <p>Total blok: <span class="font-semibold">{contentBlocks.length}</span></p>
             <p>Rich Text: <span class="font-semibold">{contentBlocks.filter(b => b.type === 'rich_text').length}</span></p>
             <p>Gambar: <span class="font-semibold">{contentBlocks.filter(b => b.type === 'image').length}</span></p>
           </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .article-content-preview {
    /* Custom styles if needed */
  }
  
  /* Prose styles for content preview */
  .prose {
    color: #374151;
    line-height: 1.75;
  }
  
  .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
    color: #111827;
    font-weight: 600;
    line-height: 1.25;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  .prose h2 {
    font-size: 1.5rem;
  }
  
  .prose p {
    margin-bottom: 1.25em;
  }
  
  .prose img {
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin: 1.5em 0;
  }
  
  .prose figure {
    margin: 1.5em 0;
  }
  
  .prose figcaption {
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }
  
  .prose strong {
    font-weight: 600;
    color: #111827;
  }
  
  .prose em {
    font-style: italic;
    color: #374151;
  }
  
  .prose mark {
    background-color: #fef3c7;
    color: #92400e;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }
</style>
