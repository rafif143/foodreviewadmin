<script>
  import { createEventDispatcher } from 'svelte';
  import TipTapEditor from './TipTapEditor.svelte';
  import ImageUploader from './ImageUploader.svelte';

  export let contentBlocks = [];
  export let onChange = () => {};

  const dispatch = createEventDispatcher();

  // Tipe content block yang tersedia
  const blockTypes = [
    { value: 'rich_text', label: 'Rich Text', icon: '📝' },
    { value: 'image', label: 'Image', icon: '🖼️' }
  ];

  // Tambah block baru
  function addBlock(type, index = null) {
    const newBlock = {
      id: Date.now() + Math.random(),
      type: type,
      content: '',
      order: index !== null ? index : contentBlocks.length,
      config: {}
    };

    // Set default content berdasarkan tipe
    switch (type) {
      case 'rich_text':
        newBlock.content = '<p></p>';
        break;
      case 'image':
        newBlock.content = '';
        newBlock.config = { alt: '', caption: '' };
        break;
    }

    let newBlocks;
    if (index !== null) {
      // Insert di posisi tertentu
      newBlocks = [...contentBlocks];
      newBlocks.splice(index, 0, newBlock);
      // Update order untuk semua block
      newBlocks.forEach((block, idx) => {
        block.order = idx;
      });
    } else {
      // Tambah di akhir
      newBlocks = [...contentBlocks, newBlock];
    }

    contentBlocks = newBlocks;
    onChange(contentBlocks);
  }

  // Hapus block
  function removeBlock(blockId) {
    contentBlocks = contentBlocks.filter(block => block.id !== blockId);
    // Update order
    contentBlocks.forEach((block, idx) => {
      block.order = idx;
    });
    onChange(contentBlocks);
  }

  // Update content block
  function updateBlock(blockId, updates) {
    contentBlocks = contentBlocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    );
    onChange(contentBlocks);
  }

  // Pindahkan block ke atas
  function moveBlockUp(blockId) {
    const currentIndex = contentBlocks.findIndex(block => block.id === blockId);
    if (currentIndex > 0) {
      const newBlocks = [...contentBlocks];
      [newBlocks[currentIndex], newBlocks[currentIndex - 1]] = [newBlocks[currentIndex - 1], newBlocks[currentIndex]];
      // Update order
      newBlocks.forEach((block, idx) => {
        block.order = idx;
      });
      contentBlocks = newBlocks;
      onChange(contentBlocks);
    }
  }

  // Pindahkan block ke bawah
  function moveBlockDown(blockId) {
    const currentIndex = contentBlocks.findIndex(block => block.id === blockId);
    if (currentIndex < contentBlocks.length - 1) {
      const newBlocks = [...contentBlocks];
      [newBlocks[currentIndex], newBlocks[currentIndex + 1]] = [newBlocks[currentIndex + 1], newBlocks[currentIndex]];
      // Update order
      newBlocks.forEach((block, idx) => {
        block.order = idx;
      });
      contentBlocks = newBlocks;
      onChange(contentBlocks);
    }
  }

  // Handle content change dari TipTap editor
  function handleContentChange(blockId, newContent) {
    updateBlock(blockId, { content: newContent });
  }

  // Handle config change
  function handleConfigChange(blockId, configUpdates) {
    const block = contentBlocks.find(b => b.id === blockId);
    if (block) {
      updateBlock(blockId, { 
        config: { ...block.config, ...configUpdates } 
      });
    }
  }

  // Duplicate block
  function duplicateBlock(blockId) {
    const block = contentBlocks.find(b => b.id === blockId);
    if (block) {
      const newBlock = {
        ...block,
        id: Date.now() + Math.random(),
        order: block.order + 1
      };
      
      const newBlocks = [...contentBlocks];
      newBlocks.splice(block.order + 1, 0, newBlock);
      
      // Update order untuk semua block setelah yang di-duplicate
      newBlocks.forEach((b, idx) => {
        b.order = idx;
      });
      
      contentBlocks = newBlocks;
      onChange(contentBlocks);
    }
  }
</script>

<div class="space-y-4">
  <!-- Add Block Button -->
  <div class="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <span class="text-sm font-medium text-gray-700">Tambah Content Block:</span>
    {#each blockTypes as type}
      <button
        type="button"
        on:click={() => addBlock(type.value)}
        class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
      >
        <span>{type.icon}</span>
        {type.label}
      </button>
    {/each}
  </div>

  <!-- Content Blocks -->
  {#if contentBlocks.length === 0}
    <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div class="text-gray-400 mb-2">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-gray-600 font-medium">Belum ada content block</p>
      <p class="text-sm text-gray-500 mt-1">Klik tombol di atas untuk menambahkan content block pertama</p>
    </div>
  {:else}
    {#each contentBlocks as block, index (block.id)}
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
        <!-- Block Header -->
        <div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <div class="flex items-center gap-3">
            <span class="text-lg">{blockTypes.find(t => t.value === block.type)?.icon}</span>
            <span class="text-sm font-medium text-gray-700">
              {blockTypes.find(t => t.value === block.type)?.label}
            </span>
            <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              #{block.order + 1}
            </span>
          </div>
          
          <div class="flex items-center gap-1">
            <!-- Move Up -->
            <button
              type="button"
              on:click={() => moveBlockUp(block.id)}
              disabled={index === 0}
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Pindah ke atas"
              aria-label="Pindah block ke atas"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <!-- Move Down -->
            <button
              type="button"
              on:click={() => moveBlockDown(block.id)}
              disabled={index === contentBlocks.length - 1}
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              title="Pindah ke bawah"
              aria-label="Pindah block ke bawah"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Duplicate -->
            <button
              type="button"
              on:click={() => duplicateBlock(block.id)}
              class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors duration-200"
              title="Duplikat block"
              aria-label="Duplikat block"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            
            <!-- Remove -->
            <button
              type="button"
              on:click={() => removeBlock(block.id)}
              class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors duration-200"
              title="Hapus block"
              aria-label="Hapus block"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Block Content -->
        <div class="p-4">
          {#if block.type === 'rich_text'}
            <TipTapEditor
              content={block.content}
              placeholder="Mulai menulis..."
              onChange={(content) => handleContentChange(block.id, content)}
            />
          
          {:else if block.type === 'image'}
            <div class="space-y-4">
              <!-- Image Uploader -->
              <div>
                <div class="block text-sm font-medium text-gray-700 mb-3">
                  Gambar <span class="text-red-500">*</span>
                </div>
                <ImageUploader
                  bind:imageUrl={block.content}
                  bucketName="article-images"
                  placeholder="Upload gambar untuk artikel"
                  on:change={(e) => updateBlock(block.id, { content: e.detail.url })}
                />
              </div>
              
              <!-- Image Configuration -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="alt-text-{block.id}" class="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    id="alt-text-{block.id}"
                    type="text"
                    bind:value={block.config.alt}
                    on:input={() => handleConfigChange(block.id, { alt: block.config.alt })}
                    placeholder="Deskripsi gambar untuk accessibility"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p class="mt-1 text-xs text-gray-500">Penting untuk SEO dan accessibility</p>
                </div>
                
                <div>
                  <label for="caption-{block.id}" class="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <input
                    id="caption-{block.id}"
                    type="text"
                    bind:value={block.config.caption}
                    on:input={() => handleConfigChange(block.id, { caption: block.config.caption })}
                    placeholder="Caption gambar (opsional)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p class="mt-1 text-xs text-gray-500">Akan ditampilkan di bawah gambar</p>
                </div>
              </div>
              
              <!-- Image Preview -->
              {#if block.content}
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Preview dalam Artikel</h4>
                  <div class="text-center">
                    <img 
                      src={block.content} 
                      alt={block.config.alt || 'Preview gambar'}
                      class="max-w-full h-auto rounded-lg max-h-64 mx-auto shadow-sm"
                      on:error={(e) => e.target.style.display = 'none'}
                    />
                    {#if block.config.caption}
                      <p class="text-sm text-gray-600 text-center mt-3 italic">{block.config.caption}</p>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          

          {/if}
        </div>
      </div>
    {/each}
  {/if}

  <!-- Quick Add Buttons -->
  {#if contentBlocks.length > 0}
    <div class="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <span class="text-sm text-gray-600">Tambah block di posisi tertentu:</span>
      {#each blockTypes as type}
        <button
          type="button"
          on:click={() => addBlock(type.value, Math.floor(contentBlocks.length / 2))}
          class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
        >
          <span>{type.icon}</span>
          {type.label}
        </button>
      {/each}
    </div>
  {/if}
</div>