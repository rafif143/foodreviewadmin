<script>
  import { onMount } from 'svelte';
  import { getPopularTags, getPopularLabels } from '$lib/tagsLabels';
  import { DEFAULT_WEBSITE } from '$lib/tenant';
  
  let popularTags = [];
  let popularLabels = [];
  let loading = true;
  
  async function fetchPopularTagsLabels() {
    try {
      loading = true;
      const [tags, labels] = await Promise.all([
        getPopularTags(DEFAULT_WEBSITE.id, 10),
        getPopularLabels(DEFAULT_WEBSITE.id, 10)
      ]);
      
      popularTags = tags;
      popularLabels = labels;
    } catch (error) {
      console.error('Error fetching popular tags and labels:', error);
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    fetchPopularTagsLabels();
  });
</script>

<div class="space-y-6">
  <!-- Popular Tags -->
  <div class="bg-white sm:bg-gradient-to-br sm:from-white sm:to-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] shadow-none sm:shadow-xl border border-gray-100 sm:border-blue-100">
    <h3 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-4">🏷️ Popular Tags</h3>
    
    {#if loading}
      <div class="space-y-2">
        {#each Array(5) as _, i}
          <div class="h-6 bg-gray-200 rounded-full animate-pulse"></div>
        {/each}
      </div>
    {:else if popularTags.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each popularTags as tag}
          <a 
            href="/{DEFAULT_WEBSITE.slug}/tag/{tag.slug}" 
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
            style="background-color: {tag.color}; color: white;"
          >
            {tag.name}
          </a>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500 text-sm">Belum ada tags populer</p>
    {/if}
  </div>
  
  <!-- Popular Labels -->
  <div class="bg-white sm:bg-gradient-to-br sm:from-white sm:to-red-50 p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] shadow-none sm:shadow-xl border border-gray-100 sm:border-red-100">
    <h3 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent mb-4">🏅 Popular Labels</h3>
    
    {#if loading}
      <div class="space-y-2">
        {#each Array(5) as _, i}
          <div class="h-6 bg-gray-200 rounded-full animate-pulse"></div>
        {/each}
      </div>
    {:else if popularLabels.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each popularLabels as label}
          <span 
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow-md"
            style="background-color: {label.color}; color: white;"
          >
            {label.name}
          </span>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500 text-sm">Belum ada labels populer</p>
    {/if}
  </div>
</div>
