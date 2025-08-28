<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import { selectedWebsite, setWebsite } from '$lib/stores/websiteStore.js';
  
  let websites = [];
  let isLoading = true;
  let errorMessage = '';
  
  onMount(async () => {
    await loadWebsites();
  });
  
  async function loadWebsites() {
    try {
      isLoading = true;
      
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      websites = data || [];
      
    } catch (error) {
      errorMessage = 'Gagal memuat daftar website: ' + error.message;
    } finally {
      isLoading = false;
    }
  }
  
  function selectWebsite(website) {
    setWebsite(website);
    // Redirect langsung ke articles page
    goto('/admin/food/articles');
  }
</script>

<svelte:head>
  <title>Pilih Website - Food Blogging Admin</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
  <!-- Header Section -->
  <div class="bg-white shadow-sm border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {#if $selectedWebsite}Ganti Website{:else}Pilih Website{/if}
            </h1>
            <p class="text-sm text-gray-600">
              {#if $selectedWebsite}
                Pilih website lain yang ingin Anda kelola
              {:else}
                Pilih website yang ingin Anda kelola
              {/if}
            </p>
          </div>
        </div>
        
        {#if $selectedWebsite}
          <a
            href="/admin/food/articles"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </a>
        {/if}
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Current Website Info -->
    {#if $selectedWebsite}
      <div class="mb-8 max-w-2xl mx-auto">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-center space-x-3 mb-4">
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-sm font-semibold text-blue-800 uppercase tracking-wide">Website Aktif Saat Ini</span>
          </div>
          <div class="text-center">
            <h3 class="text-xl font-bold text-blue-900 mb-2">{$selectedWebsite.name}</h3>
            {#if $selectedWebsite.description}
              <p class="text-blue-700 text-sm leading-relaxed">{$selectedWebsite.description}</p>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Error Message -->
    {#if errorMessage}
      <div class="mb-8 max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-xl p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800 font-medium">{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Loading State -->
    {#if isLoading}
      <div class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
          <div class="animate-spin h-8 w-8 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Memuat Daftar Website</h3>
        <p class="text-gray-500">Mohon tunggu sebentar...</p>
      </div>
    {:else if websites.length === 0}
      <!-- No Websites -->
      <div class="text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Tidak Ada Website</h3>
        <p class="text-gray-600 max-w-md mx-auto">
          Belum ada website yang tersedia untuk dikelola. Silakan hubungi administrator untuk menambahkan website.
        </p>
      </div>
    {:else}
      <!-- Website Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Website Tersedia</h3>
          <p class="text-sm text-gray-600 mt-1">Klik pada baris website untuk memilih</p>
        </div>
        
        <!-- Table Content -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each websites as website, index}
                <tr 
                  class="group hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
                  on:click={() => selectWebsite(website)}
                >
                  <!-- Website Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                          {website.name}
                        </div>
                        <div class="text-sm text-gray-500">ID: {website.id}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Description -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs">
                      {#if website.description}
                        <p class="line-clamp-2">{website.description}</p>
                      {:else}
                        <span class="text-gray-400 italic">Tidak ada deskripsi</span>
                      {/if}
                    </div>
                  </td>
                  
                  <!-- Slug -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      <code class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                        {website.slug}
                      </code>
                    </div>
                  </td>
                  
                  <!-- Created Date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {#if website.created_at}
                        {new Date(website.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      {:else}
                        <span class="text-gray-400">-</span>
                      {/if}
                    </div>
                  </td>
                  
                  <!-- Action -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 rounded-lg text-sm font-medium group-hover:from-orange-100 group-hover:to-red-100 transition-all duration-200">
                        <span>Pilih</span>
                        <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        
        <!-- Table Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              Total: <span class="font-semibold text-gray-900">{websites.length}</span> website
            </div>
            <div class="text-sm text-gray-500">
              Klik pada baris untuk memilih website
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Footer -->
    <div class="mt-16 text-center">
      <div class="max-w-2xl mx-auto">
        <p class="text-sm text-gray-500 leading-relaxed">
          {#if $selectedWebsite}
            Pilih website lain untuk mengelola konten yang berbeda, atau kembali ke dashboard untuk melanjutkan pekerjaan Anda.
          {:else}
            Pilih website yang ingin Anda kelola untuk mulai membuat dan mengatur konten, artikel, dan pengaturan website.
          {/if}
        </p>
        
        {#if $selectedWebsite}
          <div class="mt-6">
            <div class="inline-flex items-center text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Website aktif: {$selectedWebsite.name}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Smooth transitions */
  .group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
  }
  
  .group:hover .group-hover\:translate-x-1 {
    transform: translateX(0.25rem);
  }
  
  /* Table hover effects */
  .group:hover {
    background-color: rgb(255 247 237); /* orange-50 */
  }
  
  /* Responsive table */
  @media (max-width: 768px) {
    .overflow-x-auto {
      -webkit-overflow-scrolling: touch;
    }
  }
</style>
