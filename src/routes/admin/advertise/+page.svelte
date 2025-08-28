<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import AdvertiseForm from '$lib/components/AdvertiseForm.svelte';
  import { supabase } from '$lib/supabase.js';
  import { selectedWebsite } from '$lib/stores/websiteStore.js';

  let advertiseData = null;
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
      const { data, error: fetchError } = await supabase
        .from('advertise')
        .select('*')
        .eq('website_id', websiteId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      if (data) {
        advertiseData = data;
      }

      loading = false;
    } catch (err) {
      console.error('Error loading advertise data:', err);
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
      console.log('Submitting data:', newData);
      console.log('Website ID:', websiteId);

      // Check if record exists first
      const { data: existingData, error: checkError } = await supabase
        .from('advertise')
        .select('id')
        .eq('website_id', websiteId)
        .single();

      console.log('Existing data check:', { existingData, checkError });

      let upsertResult;
      
      if (existingData) {
        // Update existing record
        console.log('Updating existing record with ID:', existingData.id);
        const { data: updateResult, error: updateError } = await supabase
          .from('advertise')
          .update({
            page_title: newData.page_title || '',
            page_description: newData.page_description || '',
            introduction: newData.introduction || {},
            packages: newData.packages || [],
            contact_info: newData.contact_info || {},
            last_updated: newData.last_updated || '',
            updated_at: new Date().toISOString()
          })
          .eq('website_id', websiteId)
          .select();

        console.log('Update result:', { updateResult, updateError });

        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error('Gagal memperbarui data advertise: ' + updateError.message);
        }
        upsertResult = updateResult;
      } else {
        // Create new record
        console.log('Creating new record');
        const { data: insertResult, error: insertError } = await supabase
          .from('advertise')
          .insert({
            website_id: websiteId,
            page_title: newData.page_title || '',
            page_description: newData.page_description || '',
            introduction: newData.introduction || {},
            packages: newData.packages || [],
            contact_info: newData.contact_info || {},
            last_updated: newData.last_updated || ''
          })
          .select();

        console.log('Insert result:', { insertResult, insertError });

        if (insertError) {
          console.error('Insert error:', insertError);
          throw new Error('Gagal membuat data advertise baru: ' + insertError.message);
        }
        upsertResult = insertResult;
      }

      console.log('Final result:', { upsertResult });

      if (!upsertResult || upsertResult.length === 0) {
        // Jika tidak ada data yang dikembalikan, refresh dari database
        console.log('No data returned, refreshing from database...');
        const { data: refreshedData, error: refreshError } = await supabase
          .from('advertise')
          .select('*')
          .eq('website_id', websiteId)
          .single();

        if (refreshError) {
          console.error('Refresh error:', refreshError);
          throw new Error('Gagal menyimpan data advertise: ' + refreshError.message);
        }

        if (refreshedData) {
          advertiseData = refreshedData;
          console.log('Refreshed data from database:', advertiseData);
        } else {
          throw new Error('Gagal menyimpan data advertise: Data tidak ditemukan setelah penyimpanan');
        }
      } else {
        // Update local data dengan data yang dikembalikan
        advertiseData = upsertResult[0];
        console.log('Updated local data:', advertiseData);
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
            Data advertise berhasil diperbarui.
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

  <AdvertiseForm
    {advertiseData}
    {websiteId}
    loading={saving}
    on:submit={handleSubmit}
    on:error={handleError}
  />
{/if}

