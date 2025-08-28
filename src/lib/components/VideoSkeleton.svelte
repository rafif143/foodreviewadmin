<script>
  export let count = 6;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each Array(count) as _, i}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <!-- Thumbnail Skeleton -->
      <div class="aspect-video bg-gray-200"></div>
      
      <!-- Content Skeleton -->
      <div class="p-4">
        <!-- Title Skeleton -->
        <div class="h-6 bg-gray-200 rounded mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        <!-- Description Skeleton -->
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        <!-- Date Skeleton -->
        <div class="h-3 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    </div>
  {/each}
</div>
