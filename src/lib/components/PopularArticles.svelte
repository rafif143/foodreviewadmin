<script>
  import { fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { DEFAULT_WEBSITE } from '$lib/tenant';
  import ArticleLabels from './ArticleLabels.svelte';
  
  // State untuk "Read more"
  const articlesPerLoad = 12;
  let visibleCount = articlesPerLoad;
  let isLoadingMore = false;
  let isLoadingLess = false;
  let prevVisibleCount = visibleCount;
  let lastRemovedStartIndex = 0;
  let lastActionWasLess = false;
  
  /** @type {import('./$types').PageData} */
  export let articles = [];
  
  // Menggunakan data dari prop jika tersedia, jika tidak gunakan data dari halaman
  $: featuredArticles = articles && articles.length > 0 ? 
    mapArticleData(articles) : 
    ($page.data.popularArticles ? mapArticleData($page.data.popularArticles) : []);
  
  // Fungsi untuk memformat data artikel
  function mapArticleData(articles) {
    if (!articles || articles.length === 0) return [];
    
    // Mengurutkan artikel berdasarkan visit_count dari yang terbanyak
    const sortedArticles = [...articles].sort((a, b) => (b.visit_count || 0) - (a.visit_count || 0));
    
    return sortedArticles.map((article, index) => {
      // Menentukan height berdasarkan posisi
      const heightOptions = ['tall', 'medium', 'short'];
      const height = heightOptions[index % 3];
      
      return {
        id: article.id,
        image: article.thumbnail_image || 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        category: article.category.toUpperCase(),
        title: article.title,
        author: article.author ? `BY ${article.author.toUpperCase()}` : 'BY ADMIN',
        excerpt: article.summary,
        height: height,
        labels: article.labels || []
      };
    });
  }
  
  // Data statis telah dihapus dan diganti dengan data dinamis dari database

  // Artikel yang terlihat saat ini
  $: visibleArticles = featuredArticles.slice(0, visibleCount);
  $: hasMore = visibleCount < featuredArticles.length;
  $: hasLess = visibleCount > articlesPerLoad;

  function loadMore() {
    lastActionWasLess = false;
    prevVisibleCount = visibleCount;
    isLoadingMore = true;
    visibleCount = Math.min(
      visibleCount + articlesPerLoad,
      featuredArticles.length
    );
    setTimeout(() => {
      isLoadingMore = false;
    }, 450);
  }

  function showLess() {
    lastActionWasLess = true;
    prevVisibleCount = visibleCount;
    isLoadingLess = true;
    const target = Math.max(articlesPerLoad, visibleCount - articlesPerLoad);
    lastRemovedStartIndex = target;
    visibleCount = target;
    setTimeout(() => {
      isLoadingLess = false;
    }, 450);
  }


</script>

<style>
  .staggered-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-rows: 20px;
    grid-gap: 24px;
  }

  .card-short {
    grid-row: span 6;
  }

  .card-medium {
    grid-row: span 7;
  }

  .card-tall {
    grid-row: span 8;
  }

  .card-image-short {
    height: 140px;
  }

  .card-image-medium {
    height: 160px;
  }

  .card-image-tall {
    height: 180px;
  }

  .card-overlay {
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%);
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .card-hover-overlay {
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0.9) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card:hover .card-hover-overlay {
    opacity: 1;
  }

  .card:hover .card-overlay {
    opacity: 0;
  }

  .card-content {
    transform: translateY(0);
    transition: transform 0.3s ease;
  }

  .card:hover .card-content {
    transform: translateY(-5px);
  }

  .card-details {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }

  .card:hover .card-details {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .staggered-grid {
      grid-template-columns: 1fr;
      grid-gap: 16px;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .staggered-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      grid-gap: 20px;
    }
  }

  @media (min-width: 1025px) {
    .staggered-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      grid-gap: 24px;
    }
  }
</style>

<div class="relative">
  
  <div class="staggered-grid">
    {#each visibleArticles as article, index (article.id)}
      <article
        class="card card-{article.height} bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group cursor-pointer"
        in:fly={{
          y: 24,
          opacity: 0,
          duration: 350,
          delay: index >= visibleCount - articlesPerLoad
            ? (index - (visibleCount - articlesPerLoad)) * 30
            : 0
        }}
        out:fly={{
          y: -24,
          opacity: 0,
          duration: 350,
          delay: lastActionWasLess && index >= lastRemovedStartIndex
            ? (prevVisibleCount - 1 - index) * 30
            : 0
        }}
      >
        <div class="relative h-full">
          <img 
            src={article.image} 
            alt={article.title}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <!-- Category Badge -->
          <div class="absolute top-4 left-4 z-20">
            <span class="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full shadow-lg">
              {article.category}
            </span>
          </div>
          
          <!-- Labels di thumbnail -->
          <ArticleLabels labels={article.labels || []} />
          
          <!-- Default Title Overlay (visible when not hovered) -->
          <div class="absolute bottom-0 left-0 right-0 card-overlay">
            <div class="p-4 text-white">
              <h3 class="text-base font-bold line-clamp-1">
                {article.title}
              </h3>
            </div>
          </div>
          
          <!-- Hover Overlay with Full Content -->
          <div class="absolute inset-0 card-hover-overlay">
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div class="card-content">
                <h3 class="text-base font-bold mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <div class="card-details">
                  {#if article.excerpt}
                    <p class="text-gray-200 text-xs mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                  {/if}
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-300 font-medium">
                        {article.author}
                      </span>
                    </div>
                    <a href="/{DEFAULT_WEBSITE.slug}/article/{article.id}" class="text-white text-xs font-semibold hover:text-red-300 transition-colors duration-300 flex items-center gap-1 group/btn">
                      Baca Selengkapnya
                      <svg class="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    {/each}
  </div>
</div>

<div class="flex justify-center items-center mt-12 gap-4">
  {#if hasLess}
  <button
    on:click={showLess}
    class="px-8 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
    disabled={isLoadingLess}
    aria-busy={isLoadingLess}
  >
    {#if isLoadingLess}
      <span class="inline-flex items-center gap-2">
        <span class="w-4 h-4 border-2 border-gray-600/60 border-t-transparent rounded-full animate-spin"></span>
        Mengurangi...
      </span>
    {:else}
      Tampilkan Lebih Sedikit
    {/if}
  </button>
  {/if}
  {#if hasMore}
  <button 
    on:click={loadMore}
    class="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-80 disabled:cursor-not-allowed"
    disabled={isLoadingMore}
    aria-busy={isLoadingMore}
  >
    {#if isLoadingMore}
      <span class="inline-flex items-center gap-2">
        <span class="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></span>
        Memuat...
      </span>
    {:else}
      Muat Lebih Banyak
    {/if}
  </button>
  {/if}
</div>
