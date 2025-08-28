<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { user, isAuthenticated, isLoading, initializeAuth, setupAuthListener } from '$lib/stores/authStore.js';
  import { selectedWebsite, loadWebsiteFromStorage } from '$lib/stores/websiteStore.js';
  
  let authListener;
  
  onMount(async () => {
    // Initialize authentication
    await initializeAuth();
    
    // Setup auth listener
    authListener = setupAuthListener();
    
    // Check if user is authenticated
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }
    
    // Load website from storage if not already loaded
    if (!$selectedWebsite) {
      const website = loadWebsiteFromStorage();
      if (!website) {
        // If no website selected, redirect to website selection
        goto('/admin/select-website');
      }
    }
  });
  
  // Watch for auth changes
  $: if (!$isAuthenticated && !$isLoading) {
    goto('/login');
  }
  
  // Cleanup on destroy
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (authListener) {
      authListener.data.subscription.unsubscribe();
    }
  });
</script>

{#if $isLoading}
  <!-- Loading Screen -->
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin h-16 w-16 text-orange-500 mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Memverifikasi Autentikasi</h2>
      <p class="text-gray-600">Mohon tunggu sebentar...</p>
    </div>
  </div>
{:else if $isAuthenticated}
  <!-- Admin Layout -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo & Title -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h1 class="text-xl font-semibold text-gray-900">Food Blogging Admin</h1>
              {#if $selectedWebsite}
                <p class="text-sm text-gray-500">Website: {$selectedWebsite.name}</p>
              {/if}
            </div>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            {#if $user}
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">
                    {$user.email ? $user.email.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div class="hidden md:block">
                  <p class="text-sm font-medium text-gray-900">{$user.email}</p>
                </div>
              </div>
              
              <!-- Logout Button -->
              <button
                on:click={() => goto('/logout')}
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            {/if}
          </div>
        </div>
      </div>
    </header>
    
         <!-- Main Content with Sidebar -->
     <div class="flex">
       <!-- Sidebar -->
       <div class="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
         <nav class="mt-8 px-4">
           <div class="space-y-2">
             <!-- Dashboard -->
             <a
               href="/admin/food/articles"
               class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {$page.url.pathname === '/admin/food/articles' ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}"
             >
               <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
               </svg>
               Dashboard
             </a>

             <!-- Divider -->
             <div class="border-t border-gray-200 my-4"></div>

             <!-- Content Management Section -->
             <div class="mb-4">
               <h3 class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Konten</h3>
               
               <!-- Artikel -->
               <a
                 href="/admin/food/articles"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {$page.url.pathname === '/admin/food/articles' ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
                 Artikel
               </a>

               <!-- Create Article -->
               <a
                 href="/admin/food/create-article"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {$page.url.pathname === '/admin/food/create-article' ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                 </svg>
                 Buat Artikel
               </a>

               <!-- Tags & Labels -->
               <a
                 href="/admin/food/manage-tags-labels"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                 </svg>
                 Tags & Labels
               </a>
             </div>

             <!-- Website Sections -->
             <div class="mb-4">
               <h3 class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bagian Website</h3>
               
               <a
                 href="/admin/food"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
                 </svg>
                 Makanan
               </a>

               <a
                 href="/admin/recipe"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                 </svg>
                 Resep
               </a>

               <a
                 href="/admin/cafe"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 Cafe & Restoran
               </a>

               <a
                 href="/admin/events"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
                 Events
               </a>

               <a
                 href="/admin/things-to-do"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                 </svg>
                 Things to Do
               </a>
             </div>

             <!-- Website Settings Section -->
             <div class="mb-4">
               <h3 class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengaturan</h3>
               
               <a
                 href="/admin/about-us"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 About Us
               </a>

               <a
                 href="/admin/contact-us"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
                 Contact Us
               </a>

               <a
                 href="/admin/advertise"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9 0 0120.488 9z" />
                 </svg>
                 Advertise
               </a>

               <a
                 href="/admin/videos"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
                 Video Section
               </a>
             </div>

             <!-- Divider -->
             <div class="border-t border-gray-200 my-4"></div>

             <!-- Quick Actions -->
             <div class="mb-4">
               <h3 class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi Cepat</h3>
               
               <a
                 href="/admin/food/create-article"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-green-700 hover:bg-green-50 hover:text-green-800"
               >
                 <svg class="w-5 h-5 mr-3 text-green-500 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                 </svg>
                 Buat Artikel Baru
               </a>

               <a
                 href="/admin/food/manage-tags-labels"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
               >
                 <svg class="w-5 h-5 mr-3 text-purple-500 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                 </svg>
                 Kelola Tags & Labels
               </a>
             </div>

             <!-- Website Management -->
             <div class="mb-4">
               <h3 class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</h3>
               
               <a
                 href="/admin/select-website"
                 class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {$page.url.pathname === '/admin/select-website' ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}"
               >
                 <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                 </svg>
                 Ganti Website
               </a>
             </div>

             <!-- Website Selection -->
             <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
               <h4 class="text-sm font-medium text-gray-700 mb-2">Website Aktif</h4>
               {#if $selectedWebsite}
                 <div class="flex items-center space-x-2">
                   <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                   <span class="text-sm text-gray-600">{$selectedWebsite.name}</span>
                 </div>
                 <button
                   on:click={() => goto('/admin/select-website')}
                   class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline hover:no-underline"
                 >
                   Ganti Website
                 </button>
               {:else}
                 <p class="text-xs text-gray-500 mb-2">Tidak ada website yang dipilih</p>
                 <a
                   href="/admin/select-website"
                   class="text-xs text-blue-600 hover:text-blue-800 underline"
                 >
                   Pilih Website
                 </a>
               {/if}
             </div>
           </div>
         </nav>
       </div>

       <!-- Main Content Area -->
       <div class="flex-1">
         <main class="py-6 px-6">
           <slot />
         </main>
       </div>
     </div>
  </div>
{/if}
