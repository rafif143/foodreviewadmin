<script>
  export let tags = [];
  export let maxTags = 5; // Maksimal jumlah tag yang akan ditampilkan
  
  // Filter tags yang akan ditampilkan
  $: displayTags = tags.slice(0, maxTags);
  $: hasMoreTags = tags.length > maxTags;
  $: remainingCount = tags.length - maxTags;
  
  // Fungsi untuk mendapatkan warna random berdasarkan nama tag
  function getTagColor(tagName) {
    // Generate hash dari nama tag untuk konsistensi warna
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Konversi hash ke warna yang menarik
    const hue = Math.abs(hash) % 360;
    const saturation = 70 + (Math.abs(hash) % 20); // 70-90%
    const lightness = 45 + (Math.abs(hash) % 15); // 45-60%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
</script>

{#if tags && Array.isArray(tags) && tags.length > 0}
  <div class="mb-6">
    <div class="flex flex-wrap gap-2">
      {#each displayTags as tagName}
        <span 
          class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 hover:scale-105 cursor-pointer"
          style="background-color: {getTagColor(tagName)}20; color: {getTagColor(tagName)}; border-color: {getTagColor(tagName)}40;"
        >
          {tagName}
        </span>
      {/each}
      
      {#if hasMoreTags}
        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
          +{remainingCount}
        </span>
      {/if}
    </div>
  </div>
{/if}
