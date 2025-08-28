<script>
  import { page } from '$app/stores';
  import { DEFAULT_WEBSITE } from '$lib/tenant';
  
  /** @type {import('./$types').PageData} */
  export let articles = [];
  
  // Menggunakan data dari prop jika tersedia, jika tidak gunakan data dari halaman
  $: trendingArticles = articles && articles.length > 0 ? 
    mapArticleData(articles) : 
    ($page.data.trendingArticles ? mapArticleData($page.data.trendingArticles) : []);
  
  // Fungsi untuk memformat data artikel
  function mapArticleData(articles) {
    if (!articles || articles.length === 0) return [];
    
    return articles.map((article) => {
      return {
        id: article.id,
        title: article.title,
        category: article.category,
        image: article.thumbnail_image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop&crop=center',
        visitCount: article.visit_count || 0
      };
    });
  }
  
  // Data statis telah dihapus dan diganti dengan data dinamis dari database
</script>

<div class="space-y-6 sm:space-y-8">
  <!-- About Me -->
  <div class="bg-white sm:bg-gradient-to-br sm:from-white sm:to-orange-50 p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] shadow-none sm:shadow-xl border border-gray-100 sm:border-orange-100">
    <h3 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent mb-4">TENTANG KAMI</h3>
    <div class="mb-4">
      <img 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face" 
        alt="Dean Mel - Food Blogger"
        class="w-full h-64 object-cover rounded-xl shadow-lg"
      />
    </div>
    <div class="text-center mb-4">
      <h4 class="font-bold text-gray-800 text-lg">Dean Mel</h4>
      <p class="text-gray-600 text-sm leading-relaxed">
        Passionate food blogger and culinary enthusiast. Exploring the world one dish at a time.
      </p>
    </div>
    <div class="flex justify-center space-x-3">
      <a href="https://twitter.com/kelantanfoodreview" aria-label="Twitter" class="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      </a>
      <a href="https://pinterest.com/kelantanfoodreview" aria-label="Pinterest" class="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
        </svg>
      </a>
      <a href="https://telegram.me/kelantanfoodreview" aria-label="Telegram" class="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c-.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c-.538-.196 1.006.128.832.941z"/>
        </svg>
      </a>
      <a href="https://instagram.com/kelantanfoodreview" aria-label="Instagram" class="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 shadow-lg">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
    </div>
  </div>
  

  <!-- Trending This Week -->
  <div class="bg-white sm:bg-gradient-to-br sm:from-white sm:to-red-50 p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] shadow-none sm:shadow-xl border border-gray-100 sm:border-red-100">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent">🔥 Trending Pekan Ini</h3>
      <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Berdasarkan kunjungan</span>
    </div>
    <div class="space-y-4">
      {#each trendingArticles.slice(0, 4) as article, index}
        <article class="flex items-start space-x-3 group">
          <div class="flex-shrink-0 relative">
            <a href="/{DEFAULT_WEBSITE.slug}/article/{article.id}" class="block">
              <img 
                src={article.image} 
                alt={article.title}
                class="w-16 h-16 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              {#if index < 3}
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span class="text-xs font-bold text-white">#{index + 1}</span>
                </div>
              {/if}
            </a>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {article.category}
              </span>
              <span class="text-xs text-gray-400">👁️ {article.visitCount}</span>
            </div>
            <h4 class="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
              <a href="/{DEFAULT_WEBSITE.slug}/article/{article.id}" class="block">
                {article.title}
              </a>
            </h4>
          </div>
        </article>
      {/each}
    </div>
    
    {#if trendingArticles.length === 0}
      <div class="text-center py-6">
        <div class="text-gray-400 text-3xl mb-2">📊</div>
        <p class="text-gray-500 text-sm">Belum ada artikel trending</p>
      </div>
    {/if}
  </div>
</div>
