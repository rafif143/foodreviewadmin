<script>
  import { page } from '$app/stores';
  import { DEFAULT_WEBSITE } from '$lib/tenant';
  // ArticleLabels dihapus karena thumbnail terlalu kecil
  
  /** @type {import('./$types').PageData} */
  export let articles = [];
  
  // Menggunakan data dari prop jika tersedia, jika tidak gunakan data dari halaman
  $: latestArticles = articles && articles.length > 0 ? 
    mapArticleData(articles) : 
    ($page.data.latestArticles ? mapArticleData($page.data.latestArticles) : []);
  
  // Fungsi untuk memformat data artikel
  function mapArticleData(articles) {
    if (!articles || articles.length === 0) return [];
    
    return articles.map((article) => {
      return {
        id: article.id,
        title: article.title,
        category: article.category,
        author: article.author || 'Admin',
        date: formatDate(article.published_at),
        excerpt: article.summary,
        image: article.thumbnail_image || 'https://images.unsplash.com/10.6905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center'
      };
    });
  }
  
  // Fungsi untuk memformat tanggal
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }
  
  // Data statis telah dihapus dan diganti dengan data dinamis dari database
</script>

<div class="space-y-4 sm:space-y-6">
  {#each latestArticles as article, index}
    <article class="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 sm:transform sm:hover:scale-105 overflow-hidden group">
      <div class="flex-shrink-0 relative">
        <a href="/{DEFAULT_WEBSITE.slug}/article/{article.id}" class="block">
          <img 
            src={article.image} 
            alt={article.title}
            class="w-full h-40 sm:w-24 sm:h-24 object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none group-hover:scale-105 transition-transform duration-300"
          />
          <!-- Labels dihapus karena thumbnail terlalu kecil -->
        </a>
      </div>
      <div class="flex-1 p-3 sm:p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
            {article.category}
          </span>
          {#if article.date}
            <span class="text-xs text-gray-500">
              {article.date}
            </span>
          {/if}
        </div>
        <h3 class="text-base sm:text-sm font-bold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          <a href="/{DEFAULT_WEBSITE.slug}/article/{article.id}" class="block">
            {article.title}
          </a>
        </h3>
        {#if article.excerpt}
          <p class="text-gray-600 text-sm sm:text-xs mb-2 line-clamp-2">
            {article.excerpt}
          </p>
        {/if}
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 font-medium">
              {article.author}
            </span>
          </div>
          <a 
            href="/{DEFAULT_WEBSITE.slug}/article/{article.id}" 
            class="text-red-600 text-xs font-semibold hover:text-red-700 transition-colors shrink-0"
          >
            Baca Selengkapnya →
          </a>
        </div>
      </div>
    </article>
  {/each}
</div>

<div class="text-center mt-8">
  <a 
    href="/{DEFAULT_WEBSITE.slug}/food" 
    class="inline-block w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 sm:transform hover:scale-105 shadow-lg hover:shadow-xl"
  >
    Lihat Semua Artikel
  </a>
</div>

<style>
  .line-clamp-2 {
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
