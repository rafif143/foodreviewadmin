<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import AboutUsForm from '$lib/components/AboutUsForm.svelte';
  import { getAboutUsData, updateAboutUsData } from '$lib/aboutUs.js';
  import { selectedWebsite } from '$lib/stores/websiteStore.js';

  let aboutData = null;
  let loading = true;
  let saving = false;
  let error = null;
  let success = false;
  let websiteId = null;

  onMount(async () => {
    // Check if website is selected
    if (!$selectedWebsite) {
      goto('/admin/select-website');
      return;
    }

    try {
      websiteId = $selectedWebsite.id;
      
      // Fetch existing data
      const data = await getAboutUsData(websiteId);
      if (data) {
        aboutData = data;
      }

      loading = false;
    } catch (err) {
      console.error('Error loading about us data:', err);
      error = err.message;
      loading = false;
    }
  });

  async function handleSubmit(event) {
    const newData = event.detail;

    saving = true;
    error = null;
    success = false;

    try {
      console.log('Submitting about us data:', newData);
      console.log('Website ID:', websiteId);

      const result = await updateAboutUsData(websiteId, newData);
      
      if (result) {
        aboutData = result;
        console.log('Updated about us data:', aboutData);
      }

      success = true;
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        success = false;
      }, 3000);
      
    } catch (err) {
      console.error('Submit error:', err);
      error = err.message;
    } finally {
      saving = false;
    }
  }

  function handleError(event) {
    error = event.detail;
  }
</script>

<svelte:head>
  <title>Kelola About Us - Admin Panel</title>
</svelte:head>

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
            Data about us berhasil diperbarui.
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

  <AboutUsForm
    {aboutData}
    {websiteId}
    loading={saving}
    on:submit={handleSubmit}
    on:error={handleError}
  />
{/if}
