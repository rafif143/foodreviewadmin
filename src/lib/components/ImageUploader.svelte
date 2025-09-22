<script>
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { addTempImage, removeTempImage, deleteImagesFromStorage } from '$lib/utils/imageCleanup.js';

  const dispatch = createEventDispatcher();

  export let imageUrl = '';
  export let bucketName = 'article-images';
  export let maxSize = 10 * 1024 * 1024; // 10MB dalam bytes
  export let allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  export let placeholder = 'Upload gambar...';

  let uploading = false;
  let dragOver = false;
  let fileInput;
  let errorMessage = '';

  // Format ukuran file untuk display
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validasi file
  function validateFile(file) {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipe file tidak didukung. Gunakan: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`Ukuran file terlalu besar. Maksimal ${formatFileSize(maxSize)}`);
    }

    return true;
  }

  // Upload file ke Supabase Storage
  async function uploadFile(file) {
    try {
      uploading = true;
      errorMessage = '';

      // Validate file
      validateFile(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Delete old image if exists
      if (imageUrl && !imageUrl.includes('unsplash.com') && !imageUrl.includes('example.com')) {
        await deleteOldImage(imageUrl);
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // Update image URL
      imageUrl = publicUrl;

      // Add to temporary tracking
      addTempImage(publicUrl);

      // Dispatch change event
      dispatch('change', {
        url: publicUrl,
        filename: fileName,
        size: file.size,
        type: file.type
      });

      return publicUrl;

    } catch (error) {
      errorMessage = error.message;
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      uploading = false;
    }
  }

  // Delete old image from storage
  async function deleteOldImage(url) {
    try {
      // Remove from temp tracking first
      removeTempImage(url);
      
      // Delete from storage
      await deleteImagesFromStorage([url], bucketName);
    } catch (error) {
      console.warn('Error deleting old image:', error);
    }
  }

  // Handle file input change
  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await uploadFile(file);
    } catch (error) {
      // Error sudah di-handle di uploadFile
    }
  }

  // Handle drag and drop
  function handleDragOver(event) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragOver = false;
  }

  async function handleDrop(event) {
    event.preventDefault();
    dragOver = false;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      try {
        await uploadFile(files[0]);
      } catch (error) {
        // Error sudah di-handle di uploadFile
      }
    }
  }

  // Delete current image
  async function deleteImage() {
    if (!imageUrl) return;

    try {
      uploading = true;
      errorMessage = '';

      // Delete from storage
      await deleteOldImage(imageUrl);

      // Clear image URL
      const oldUrl = imageUrl;
      imageUrl = '';

      // Dispatch change event
      dispatch('change', {
        url: '',
        filename: null,
        size: 0,
        type: null,
        deletedUrl: oldUrl
      });

    } catch (error) {
      errorMessage = 'Gagal menghapus gambar: ' + error.message;
      console.error('Error deleting image:', error);
    } finally {
      uploading = false;
    }
  }

  // Open file picker
  function openFilePicker() {
    fileInput.click();
  }
</script>

<div class="space-y-4">
  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    accept={allowedTypes.join(',')}
    on:change={handleFileChange}
    class="hidden"
  />

  <!-- Upload Area -->
  <div
    class="border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 {dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}"
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="button"
    tabindex="0"
    on:click={openFilePicker}
    on:keydown={(e) => e.key === 'Enter' && openFilePicker()}
  >
    {#if uploading}
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-sm text-gray-600">Mengupload gambar...</p>
      </div>
    {:else if imageUrl}
      <!-- Image Preview -->
      <div class="space-y-4">
        <img 
          src={imageUrl} 
          alt="Preview gambar"
          class="max-w-full h-auto rounded-lg max-h-64 mx-auto shadow-sm"
          on:error={(e) => e.target.style.display = 'none'}
        />
        
        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            on:click|stopPropagation={openFilePicker}
            class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            Ganti Gambar
          </button>
          <button
            type="button"
            on:click|stopPropagation={deleteImage}
            class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            Hapus Gambar
          </button>
        </div>
      </div>
    {:else}
      <!-- Upload Prompt -->
      <div class="flex flex-col items-center">
        <svg class="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-2">{placeholder}</p>
        <p class="text-sm text-gray-500 mb-4">Drag & drop atau klik untuk memilih gambar</p>
        <div class="text-xs text-gray-400">
          <p>Format: {allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}</p>
          <p>Maksimal: {formatFileSize(maxSize)}</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Error Message -->
  {#if errorMessage}
    <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-800">{errorMessage}</p>
      </div>
    </div>
  {/if}

  <!-- Current URL Display (for debugging/manual editing) -->
  {#if imageUrl}
    <div class="space-y-2">
      <label for="image-url-input" class="block text-sm font-medium text-gray-700">URL Gambar</label>
      <input
        id="image-url-input"
        type="url"
        bind:value={imageUrl}
        on:input={() => dispatch('change', { url: imageUrl, filename: null, size: 0, type: null })}
        placeholder="https://example.com/image.jpg"
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
      />
      <p class="text-xs text-gray-500">Anda juga bisa memasukkan URL gambar secara manual</p>
    </div>
  {/if}
</div>
