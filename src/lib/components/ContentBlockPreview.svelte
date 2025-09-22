<script>
  export let contentBlocks = [];
  export let showLabels = true;

  // Fungsi untuk render HTML content dengan aman
  function renderHTML(html) {
    if (!html) return '';
    return html;
  }


</script>

<div class="content-preview space-y-6">
  {#if contentBlocks.length === 0}
    <div class="text-center py-8 text-gray-500">
      <p>Belum ada content untuk ditampilkan</p>
    </div>
  {:else}
    {#each contentBlocks.sort((a, b) => a.order - b.order) as block, index (block.id)}
      <div class="content-block" data-block-type={block.type} data-block-id={block.id}>
                 {#if showLabels}
           <div class="mb-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block">
             {block.type === 'rich_text' && '📝 Rich Text'}
             {block.type === 'image' && '🖼️ Image'}
           </div>
         {/if}

        {#if block.type === 'rich_text'}
          <div class="prose prose-lg max-w-none">
            {@html renderHTML(block.content)}
          </div>

        {:else if block.type === 'image'}
          {#if block.content}
            <figure class="my-6">
              <img 
                src={block.content} 
                alt={block.config?.alt || 'Gambar artikel'}
                class="max-w-full h-auto rounded-lg shadow-sm"
                loading="lazy"
              />
              {#if block.config?.caption}
                <figcaption class="text-center text-sm text-gray-600 mt-2 italic">
                  {block.config.caption}
                </figcaption>
              {/if}
            </figure>
          {/if}

        
        {/if}
      </div>
    {/each}
  {/if}
</div>

<style>
  .content-preview :global(.prose) {
    color: inherit;
  }
  
  .content-preview :global(.prose h1) {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
    color: #111827;
  }
  
  .content-preview :global(.prose h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.83em 0;
    color: #111827;
  }
  
  .content-preview :global(.prose h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin: 1em 0;
    color: #111827;
  }
  
  .content-preview :global(.prose p) {
    margin: 0.25em 0;
    line-height: 1.4;
  }
  
  .content-preview :global(.prose p:first-child) {
    margin-top: 0;
  }

  .content-preview :global(.prose p:last-child) {
    margin-bottom: 0;
  }
  
  .content-preview :global(.prose ul) {
    list-style-type: disc;
    margin: 1em 0;
    padding-left: 2em;
  }
  
  .content-preview :global(.prose ol) {
    list-style-type: decimal;
    margin: 1em 0;
    padding-left: 2em;
  }
  
  .content-preview :global(.prose blockquote) {
    border-left: 4px solid #e5e7eb;
    margin: 1em 0;
    padding-left: 1em;
    font-style: italic;
  }
  
  .content-preview :global(.prose mark) {
    background-color: #fef3c7;
    color: #92400e;
    padding: 0.1em 0.2em;
    border-radius: 0.2em;
  }
  
  .content-preview :global(.prose a) {
    color: #2563eb;
    text-decoration: underline;
  }
  
  .content-preview :global(.prose a:hover) {
    color: #1d4ed8;
  }
  
  .content-preview :global(.prose img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1em 0;
  }
</style>
