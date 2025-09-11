<!-- Ads Management Panel - Copy ke Project Admin -->
<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { getAdsConfig, clearAdsCache } from '$lib/ads-config';
  
  let websites = [];
  let selectedWebsite = null;
  let adsConfig = null;
  let adsContent = [];
  let isLoading = true;
  let isSaving = false;
  let saveMessage = '';
  let showAddForm = false;
  
  // Form data untuk ads config
  let configForm = {
    ads_enabled: false,
    google_adsense_client_id: '',
    google_adsense_slot_id: '',
    ad_frequency: 1,
    ad_placements: {
      header: { enabled: false, type: 'banner' },
      sidebar: { enabled: false, type: 'banner' },
      content: { enabled: false, type: 'banner' },
      footer: { enabled: false, type: 'banner' }
    }
  };
  
  // Form data untuk ads content
  let contentForm = {
    ad_type: 'banner',
    position: 'content',
    ad_code: '',
    is_active: true,
    display_conditions: {
      page_types: [],
      categories: []
    }
  };
  
  // Load websites
  onMount(async () => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('id, name, slug')
        .order('name');
      
      if (error) throw error;
      
      websites = data || [];
      if (websites.length > 0) {
        selectedWebsite = websites[0].id;
        await loadAdsData(selectedWebsite);
      }
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      isLoading = false;
    }
  });
  
  // Load ads data untuk website yang dipilih
  async function loadAdsData(websiteId) {
    try {
      // Load ads config
      adsConfig = await getAdsConfig(websiteId);
      configForm = { ...adsConfig };
      
      // Load ads content
      const { data, error } = await supabase
        .from('ads_content')
        .select('*')
        .eq('website_id', websiteId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      adsContent = data || [];
      
    } catch (error) {
      console.error('Error loading ads data:', error);
    }
  }
  
  // Save ads config
  async function saveAdsConfig() {
    if (!selectedWebsite) return;
    
    isSaving = true;
    saveMessage = '';
    
    try {
      const { error } = await supabase
        .from('website_ads_config')
        .upsert({
          website_id: selectedWebsite,
          ...configForm,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Clear cache
      clearAdsCache(selectedWebsite);
      
      saveMessage = 'Ads configuration saved successfully!';
      setTimeout(() => saveMessage = '', 3000);
      
    } catch (error) {
      console.error('Error saving ads config:', error);
      saveMessage = 'Error saving configuration: ' + error.message;
    } finally {
      isSaving = false;
    }
  }
  
  // Add new ads content
  async function addAdsContent() {
    if (!selectedWebsite) return;
    
    try {
      const { data, error } = await supabase
        .from('ads_content')
        .insert([{
          website_id: selectedWebsite,
          ...contentForm
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      adsContent = [data, ...adsContent];
      showAddForm = false;
      
      // Reset form
      contentForm = {
        ad_type: 'banner',
        position: 'content',
        ad_code: '',
        is_active: true,
        display_conditions: {
          page_types: [],
          categories: []
        }
      };
      
    } catch (error) {
      console.error('Error adding ads content:', error);
    }
  }
  
  // Update ads content
  async function updateAdsContent(adId, updates) {
    try {
      const { error } = await supabase
        .from('ads_content')
        .update(updates)
        .eq('id', adId);
      
      if (error) throw error;
      
      // Update local data
      adsContent = adsContent.map(ad => 
        ad.id === adId ? { ...ad, ...updates } : ad
      );
      
    } catch (error) {
      console.error('Error updating ads content:', error);
    }
  }
  
  // Delete ads content
  async function deleteAdsContent(adId) {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    
    try {
      const { error } = await supabase
        .from('ads_content')
        .delete()
        .eq('id', adId);
      
      if (error) throw error;
      
      adsContent = adsContent.filter(ad => ad.id !== adId);
      
    } catch (error) {
      console.error('Error deleting ads content:', error);
    }
  }
  
  // Toggle placement enabled
  function togglePlacement(placement) {
    configForm.ad_placements[placement].enabled = !configForm.ad_placements[placement].enabled;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Kelola Google Ads</h1>
        <p class="text-gray-600">Konfigurasi dan kelola konten iklan Google Ads untuk semua website</p>
      </div>
      <div class="flex space-x-3">
        <a 
          href="/admin/ads-google"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Kembali ke Dashboard
        </a>
      </div>
    </div>
  </div>
    
    {#if isLoading}
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else}
      <!-- Website Selection -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Select Website</h2>
        </div>
        <div class="p-6">
          <select 
            bind:value={selectedWebsite}
            on:change={() => loadAdsData(selectedWebsite)}
            class="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each websites as website}
              <option value={website.id}>{website.name} ({website.slug})</option>
            {/each}
          </select>
        </div>
      </div>
      
      {#if selectedWebsite}
        <!-- Ads Configuration -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Ads Configuration</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Basic Settings -->
              <div class="space-y-4">
                <h3 class="text-md font-medium text-gray-900">Basic Settings</h3>
                
                <div>
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      bind:checked={configForm.ads_enabled}
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    >
                    <span class="ml-2 text-sm text-gray-700">Enable Ads</span>
                  </label>
                </div>
                
                <div>
                  <label for="adsense-client-id" class="block text-sm font-medium text-gray-700 mb-1">Google AdSense Client ID</label>
                  <input 
                    id="adsense-client-id"
                    type="text" 
                    bind:value={configForm.google_adsense_client_id}
                    placeholder="ca-pub-xxxxxxxxxx"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                
                <div>
                  <label for="adsense-slot-id" class="block text-sm font-medium text-gray-700 mb-1">Google AdSense Slot ID</label>
                  <input 
                    id="adsense-slot-id"
                    type="text" 
                    bind:value={configForm.google_adsense_slot_id}
                    placeholder="xxxxxxxxxx"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
                
                <div>
                  <label for="ad-frequency" class="block text-sm font-medium text-gray-700 mb-1">Ad Frequency</label>
                  <input 
                    id="ad-frequency"
                    type="number" 
                    bind:value={configForm.ad_frequency}
                    min="1"
                    max="10"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                  <p class="text-xs text-gray-500 mt-1">How often ads should appear (1 = every time, 2 = every other time, etc.)</p>
                </div>
              </div>
              
              <!-- Ad Placements -->
              <div class="space-y-4">
                <h3 class="text-md font-medium text-gray-900">Ad Placements</h3>
                
                {#each Object.entries(configForm.ad_placements) as [placement, config]}
                  <div class="border border-gray-200 rounded-md p-4">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-medium text-gray-900 capitalize">{placement}</h4>
                      <label class="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={config.enabled}
                          on:change={() => togglePlacement(placement)}
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        >
                        <span class="ml-2 text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>
                    
                    <div>
                      <label for="ad-type-{placement}" class="block text-sm font-medium text-gray-700 mb-1">Ad Type</label>
                      <select 
                        id="ad-type-{placement}"
                        bind:value={config.type}
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="banner">Banner</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="in-article">In-Article</option>
                        <option value="popup">Popup</option>
                      </select>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
            
            <!-- Save Button -->
            <div class="mt-6">
              <button 
                on:click={saveAdsConfig}
                disabled={isSaving}
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
              
              {#if saveMessage}
                <p class="mt-2 text-sm {saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}">
                  {saveMessage}
                </p>
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Ads Content Management -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Ads Content</h2>
              <button 
                on:click={() => showAddForm = !showAddForm}
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              >
                {showAddForm ? 'Cancel' : 'Add New Ad'}
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Add Form -->
            {#if showAddForm}
              <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 class="text-md font-medium text-gray-900 mb-4">Add New Ad Content</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="content-ad-type" class="block text-sm font-medium text-gray-700 mb-1">Ad Type</label>
                    <select 
                      id="content-ad-type"
                      bind:value={contentForm.ad_type}
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="banner">Banner</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="in-article">In-Article</option>
                      <option value="popup">Popup</option>
                    </select>
                  </div>
                  
                  <div>
                    <label for="content-position" class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select 
                      id="content-position"
                      bind:value={contentForm.position}
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="header">Header</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="content">Content</option>
                      <option value="footer">Footer</option>
                    </select>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label for="content-ad-code" class="block text-sm font-medium text-gray-700 mb-1">Ad Code (HTML/JS)</label>
                  <textarea 
                    id="content-ad-code"
                    bind:value={contentForm.ad_code}
                    rows="4"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your ad code here..."
                  ></textarea>
                </div>
                
                <div class="flex items-center mb-4">
                  <input 
                    id="content-is-active"
                    type="checkbox" 
                    bind:checked={contentForm.is_active}
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <label for="content-is-active" class="ml-2 text-sm text-gray-700">Active</label>
                </div>
                
                <div class="flex gap-2">
                  <button 
                    on:click={addAdsContent}
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Add Ad
                  </button>
                  <button 
                    on:click={() => showAddForm = false}
                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            {/if}
            
            <!-- Ads List -->
            <div class="space-y-4">
              {#each adsContent as ad}
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label for="ad-type-{ad.id}" class="block text-sm font-medium text-gray-700 mb-1">Ad Type</label>
                      <select 
                        id="ad-type-{ad.id}"
                        value={ad.ad_type}
                        on:change={(e) => updateAdsContent(ad.id, { ad_type: e.target.value })}
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="banner">Banner</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="in-article">In-Article</option>
                        <option value="popup">Popup</option>
                      </select>
                    </div>
                    
                    <div>
                      <label for="ad-position-{ad.id}" class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <select 
                        id="ad-position-{ad.id}"
                        value={ad.position}
                        on:change={(e) => updateAdsContent(ad.id, { position: e.target.value })}
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="header">Header</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="content">Content</option>
                        <option value="footer">Footer</option>
                      </select>
                    </div>
                    
                    <div>
                      <label for="ad-status-{ad.id}" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <label class="flex items-center">
                        <input 
                          id="ad-status-{ad.id}"
                          type="checkbox" 
                          checked={ad.is_active}
                          on:change={(e) => updateAdsContent(ad.id, { is_active: e.target.checked })}
                          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        >
                        <span class="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-700 mb-1">Created</p>
                      <p class="text-sm text-gray-600">{new Date(ad.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="flex items-end">
                      <button 
                        on:click={() => deleteAdsContent(ad.id)}
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <label for="ad-code-{ad.id}" class="block text-sm font-medium text-gray-700 mb-1">Ad Code (HTML/JS)</label>
                    <textarea 
                      id="ad-code-{ad.id}"
                      value={ad.ad_code}
                      on:change={(e) => updateAdsContent(ad.id, { ad_code: e.target.value })}
                      rows="3"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your ad code here..."
                    ></textarea>
                  </div>
                </div>
              {/each}
              
              {#if adsContent.length === 0}
                <div class="text-center py-8 text-gray-500">
                  <p>No ads content found. Click "Add New Ad" to create one.</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    {/if}
</div>
