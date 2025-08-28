<script>
  export let labels = [];
  export let maxLabels = 3; // Maksimal jumlah label yang akan ditampilkan
  
  // Filter labels yang akan ditampilkan
  $: displayLabels = labels.slice(0, maxLabels);
  $: hasMoreLabels = labels.length > maxLabels;
  $: remainingCount = labels.length - maxLabels;
  
  // Fungsi untuk mendapatkan warna random berdasarkan nama label
  function getLabelColor(labelName) {
    // Generate hash dari nama label untuk konsistensi warna
    let hash = 0;
    for (let i = 0; i < labelName.length; i++) {
      hash = labelName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Konversi hash ke warna yang menarik
    const hue = Math.abs(hash) % 360;
    const saturation = 75 + (Math.abs(hash) % 20); // 75-95%
    const lightness = 40 + (Math.abs(hash) % 20); // 40-60%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
</script>

{#if labels && Array.isArray(labels) && labels.length > 0}
  <div class="absolute top-4 right-4 flex flex-col gap-1 z-10">
    {#each displayLabels as labelName}
      <span 
        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border border-white/20"
        style="background-color: {getLabelColor(labelName)}; color: white;"
      >
        {labelName}
      </span>
    {/each}
    
    {#if hasMoreLabels}
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-gray-600 text-white shadow-lg border border-white/20">
        +{remainingCount}
      </span>
    {/if}
  </div>
{/if}
