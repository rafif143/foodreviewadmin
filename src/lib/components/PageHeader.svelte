<script>
  export let title = "Judul Halaman";
  export let description = "Deskripsi halaman";
  export let icon = "default";
  export let bgColor = "from-red-100 to-orange-100";
  export let iconBgColor = "from-red-600 to-red-700";
  export let titleGradient = "from-gray-800 to-red-600";
  export let lineGradient = "from-red-600 to-orange-500";
  export let compact = false;
</script>

<section class={compact ? "pt-6" : "pt-16"}>
  <div class="container mx-auto px-4">
    <div class={compact ? "text-center mb-6" : "text-center mb-10"}>
      <div class={compact ? `inline-block p-1.5 bg-gradient-to-r ${bgColor} rounded-full mb-4` : `inline-block p-2 bg-gradient-to-r ${bgColor} rounded-full mb-6`}>
        <div class={compact ? `w-12 h-12 bg-gradient-to-br ${iconBgColor} rounded-full flex items-center justify-center mx-auto` : `w-16 h-16 bg-gradient-to-br ${iconBgColor} rounded-full flex items-center justify-center mx-auto`}>
          {#if icon === "book"}
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          {:else if icon === "food"}
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
            </svg>
          {:else if icon === "cafe"}
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
            </svg>
          {:else if icon === "event"}
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          {:else if icon === "location"}
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          {:else if icon === "mail"}
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          {:else}
            <!-- Default icon -->
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          {/if}
        </div>
      </div>
      <h1 class={compact ? `text-3xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent mb-3` : `text-5xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent mb-4`}>
        {title}
      </h1>
      <div class={compact ? `w-20 h-1 bg-gradient-to-r ${lineGradient} mx-auto rounded-full mb-4` : `w-32 h-1 bg-gradient-to-r ${lineGradient} mx-auto rounded-full mb-6`}></div>
      <p class={compact ? "text-gray-600 max-w-3xl mx-auto text-base leading-relaxed" : "text-gray-600 max-w-6xl mx-auto text-lg leading-relaxed"}>
        {description}
      </p>
    </div>
  </div>
</section>
