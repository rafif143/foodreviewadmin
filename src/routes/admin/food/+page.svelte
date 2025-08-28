<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import AboutSectionForm from '$lib/components/AboutSectionForm.svelte';
  import { getAboutSection, updateAboutSection } from '$lib/aboutSections.js';
  import { selectedWebsite } from '$lib/stores/websiteStore.js';

  let content = null;
  let loading = true;
  let saving = false;
  let error = null;
  let success = false;

  onMount(async () => {
    try {
      // Check if website is selected
      const website = $selectedWebsite;
      if (!website) {
        goto('/admin/select-website');
        return;
      }

      const data = await getAboutSection(website.id, 'food', true); // Include inactive
      
      if (data) {
        content = data;
      }
      
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });

  async function handleSubmit(event) {
    const { content: newContent } = event.detail;
    
    saving = true;
    error = null;
    success = false;

    try {
      const website = $selectedWebsite;
      if (!website) {
        throw new Error('Website tidak dipilih');
      }
      
      // Update content
      const updateSuccess = await updateAboutSection(website.id, 'food', newContent);
      
      if (!updateSuccess) {
        throw new Error('Gagal memperbarui konten');
      }

      content = newContent;
      success = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        success = false;
      }, 3000);
      
    } catch (err) {
      error = err.message;
    } finally {
      saving = false;
    }
  }
</script>

{#if loading}
  <div class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
{:else}
  <!-- Success Message -->
  {#if success}
    <div class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800">Berhasil!</h3>
          <div class="mt-2 text-sm text-green-700">
            Konten Food berhasil diperbarui.
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Error Message -->
  {#if error}
    <div class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">{error}</div>
        </div>
      </div>
    </div>
  {/if}

  <AboutSectionForm 
    category="food"
    {content}
    loading={saving}
    on:submit={handleSubmit}
  />
{/if}
