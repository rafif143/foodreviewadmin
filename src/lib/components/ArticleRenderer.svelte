<script>
  import ContentBlockPreview from './ContentBlockPreview.svelte';
  
  export let article = null;
  export let showLabels = false;
  
  // Parse content blocks from JSON string
  $: contentBlocks = (() => {
    if (!article?.content) return [];
    try {
      return JSON.parse(article.content);
    } catch {
      return [];
    }
  })();
</script>

<article class="article-renderer">
  {#if article}
    <!-- Article Header -->
    <header class="article-header mb-8">
      {#if article.thumbnail_image}
        <div class="mb-6">
          <img 
            src={article.thumbnail_image} 
            alt={article.title}
            class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            loading="lazy"
          />
        </div>
      {/if}
      
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {article.title}
      </h1>
      
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        {#if article.author}
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{article.author}</span>
          </div>
        {/if}
        
        {#if article.published_at}
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(article.published_at).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        {/if}
        
        {#if article.minute_read}
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{article.minute_read} menit baca</span>
          </div>
        {/if}
      </div>
      
      {#if article.summary}
        <div class="text-lg text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          {article.summary}
        </div>
      {/if}
    </header>

    <!-- Article Content -->
    <div class="article-content">
      {#if contentBlocks && contentBlocks.length > 0}
        <ContentBlockPreview 
          contentBlocks={contentBlocks}
          showLabels={showLabels}
        />
      {:else}
        <div class="text-center py-12 text-gray-500">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium">Konten artikel tidak tersedia</p>
          <p class="text-sm">Artikel ini belum memiliki konten yang dapat ditampilkan</p>
        </div>
      {/if}
    </div>

    <!-- Article Footer -->
    {#if article.tags && article.tags.length > 0 || article.labels && article.labels.length > 0}
      <footer class="article-footer mt-12 pt-8 border-t border-gray-200">
        {#if article.tags && article.tags.length > 0}
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
            <div class="flex flex-wrap gap-2">
              {#each article.tags as tag}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        {/if}
        
        {#if article.labels && article.labels.length > 0}
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Labels:</h3>
            <div class="flex flex-wrap gap-2">
              {#each article.labels as label}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {label}
                </span>
              {/each}
            </div>
          </div>
        {/if}
      </footer>
    {/if}
  {:else}
    <div class="text-center py-12 text-gray-500">
      <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-lg font-medium">Artikel tidak ditemukan</p>
      <p class="text-sm">Artikel yang Anda cari tidak tersedia atau telah dihapus</p>
    </div>
  {/if}
</article>

<style>
  .article-renderer {
    max-width: 100%;
  }
  
  .article-header h1 {
    line-height: 1.2;
  }
  
  .article-content {
    line-height: 1.8;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .article-header h1 {
      font-size: 2rem;
    }
    
    .article-header .flex {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>
