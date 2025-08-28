<script>
  import { onDestroy, onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { DEFAULT_WEBSITE } from '$lib/tenant';
  import ArticleLabels from './ArticleLabels.svelte';
  
  /** @type {import('./$types').PageData} */
  export let articles = [];
  
  // Menggunakan data dari prop jika tersedia, jika tidak gunakan data dari halaman
  $: baseArticles = articles && articles.length > 0 ? 
    mapArticleData(articles) : 
    ($page.data.randomArticles ? mapArticleData($page.data.randomArticles) : []);
  
  // Fungsi untuk memformat data artikel
  function mapArticleData(articles) {
    if (!articles || articles.length === 0) return [];
    
    return articles.map((article) => {
      return {
        id: article.id,
        image: article.thumbnail_image || 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
        category: article.category.toUpperCase(),
        title: article.title,
        author: article.author ? `BY ${article.author.toUpperCase()}` : 'BY ADMIN',
        excerpt: article.summary,
        labels: article.labels || []
      };
    });
  }
  
  // Data artikel acak (akan diambil dari sini)
  let randomArticles = [];
  
  // Data statis telah dihapus dan diganti dengan data dinamis dari database
  let scroller;
  let track;
  let groupSize = 0;
  let groupWidth = 0;
  let secondStart = 0;
  let thirdStart = 0;
  let timer;
  let scrollSpeed = 1; // Kecepatan scroll (px per frame)

  function shuffle(array) {
    const cloned = array.slice();
    for (let i = cloned.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
  }

  function startAutoScroll() {
    stopAutoScroll();
    timer = setInterval(() => {
      if (!scroller) return;
      
      // Scroll terus menerus seperti kereta
      scroller.scrollLeft += scrollSpeed;
      
      // Reset scroll position untuk infinite loop
      if (scroller.scrollLeft >= thirdStart) {
        scroller.scrollLeft = secondStart;
      }
    }, 16); // 60fps untuk scroll yang smooth
  }

  function stopAutoScroll() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function next() {
    if (!scroller) return;
    const step = Math.max(240, Math.floor(scroller.clientWidth * 0.6));
    scroller.scrollBy({ left: step, behavior: 'smooth' });
  }

  function prev() {
    if (!scroller) return;
    const step = Math.max(240, Math.floor(scroller.clientWidth * 0.6));
    scroller.scrollBy({ left: -step, behavior: 'smooth' });
  }

  function handleScroll() {
    if (!scroller || groupWidth === 0) return;
    if (scroller.scrollLeft >= thirdStart) {
      scroller.scrollLeft -= groupWidth;
    } else if (scroller.scrollLeft < secondStart - groupWidth + 1) {
      // dukung scroll ke kiri juga agar tetap mulus
      scroller.scrollLeft += groupWidth;
    }
  }

  onMount(async () => {
    const baseList = shuffle(baseArticles);
    groupSize = baseList.length;
    // gandakan untuk membuat track tak berujung (awal, tengah, akhir)
    articles = [...baseList, ...baseList, ...baseList];
    await tick();
    // hitung posisi awal grup tengah dan lebar satu grup
    const firstStart = track?.children?.[0]?.offsetLeft ?? 0;
    secondStart = track?.children?.[groupSize]?.offsetLeft ?? 0;
    thirdStart = track?.children?.[groupSize * 2]?.offsetLeft ?? 0;
    groupWidth = secondStart - firstStart;
    if (Number.isFinite(secondStart)) {
      scroller.scrollLeft = secondStart;
    }
    startAutoScroll();
  });



  onDestroy(() => {
    stopAutoScroll();
  });
</script>

<div class="relative">
  <div class="pointer-events-none absolute -left-6 top-0 h-full w-24 bg-gradient-to-r from-orange-50 to-transparent"></div>
  <div class="pointer-events-none absolute -right-6 top-0 h-full w-24 bg-gradient-to-l from-orange-50 to-transparent"></div>

  <div
    class="overflow-x-hidden"
    bind:this={scroller}
    role="region"
    aria-label="Carousel artikel acak"
    on:scroll={handleScroll}
  >
    <div class="flex gap-6 py-2" bind:this={track}>
      {#each articles as article, i}
        <article class="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div class="relative">
            <img 
              src={article.image} 
              alt={article.title}
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                {article.category}
              </span>
            </div>
            <!-- Labels di thumbnail -->
            <ArticleLabels labels={article.labels || []} />
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {article.title}
            </h3>
            {#if article.excerpt}
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {article.excerpt}
              </p>
            {/if}
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 font-medium">
                  {article.author}
                </span>
              </div>
              <a 
                href="/{DEFAULT_WEBSITE.slug}/article/{article.id}" 
                class="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
              >
                Baca Selengkapnya
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>



  <div class="mt-6 flex items-center justify-center gap-4">
    <button class="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" on:click={prev}>
      ← Sebelumnya
    </button>
    <button class="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" on:click={next}>
      Berikutnya →
    </button>
  </div>
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
