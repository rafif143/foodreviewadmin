<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { DEFAULT_WEBSITE, createWebsiteUrl } from '$lib/tenant';

  // Format tanggal
  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  export let website = DEFAULT_WEBSITE;
  export let contactData = null;

  // Icon SVGs for social media platforms
const iconSvgs = {
  facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
  
  x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  
  instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
  
  youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
  
  whatsapp: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>',
  
  pinterest: '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.096 3.163 9.449 7.618 11.244-.105-.949-.199-2.403.042-3.44.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017.001z"/>',
  
  tiktok: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>',
  
  linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  
  globe: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>'
};

  // Helper function to get icon SVG
  function getIconSvg(iconName) {
    return iconSvgs[iconName] || iconSvgs.globe;
  }

  // Helper function to get platform display name
  function getPlatformDisplayName(iconName) {
    const platformNames = {
      'facebook': 'Facebook',
      'x': 'X',
      'instagram': 'Instagram',
      'youtube': 'YouTube',
      'whatsapp': 'WhatsApp',
      'pinterest': 'Pinterest',
      'tiktok': 'TikTok',
      'linkedin': 'LinkedIn',
      'globe': 'Website'
    };
    return platformNames[iconName] || iconName;
  }

  // Helper function to get platform background color
  function getPlatformBgColor(iconName) {
    const bgColors = {
      'facebook': 'bg-blue-600 hover:bg-blue-700',
      'x': 'bg-black hover:bg-gray-800',
      'instagram': 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      'youtube': 'bg-red-600 hover:bg-red-700',
      'whatsapp': 'bg-green-600 hover:bg-green-700',
      'pinterest': 'bg-red-500 hover:bg-red-600',
      'tiktok': 'bg-black hover:bg-gray-800',
      'linkedin': 'bg-blue-700 hover:bg-blue-800',
      'globe': 'bg-gray-600 hover:bg-gray-700'
    };
    return bgColors[iconName] || 'bg-gray-600 hover:bg-gray-700';
  }

  const foodCategories = [
    { name: 'Food', href: '/food', count: '150+', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=128&h=128&fit=crop&crop=center&auto=format&dpr=2&q=80' },
    { name: 'Cafe', href: '/cafe', count: '80+', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=128&h=128&fit=crop&crop=center&auto=format&dpr=2&q=80' },
    { name: 'Things To Do', href: '/things-to-do', count: '45+', image: 'https://images.unsplash.com/photo-1504714146340-959ca07b7bb1?w=128&h=128&fit=crop&crop=center&auto=format&dpr=2&q=80' },
    { name: 'Events', href: '/events', count: '25+', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&h=128&fit=crop&crop=center&auto=format&dpr=2&q=80' },
    { name: 'Recipe', href: '/recipe', count: '120+', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=128&h=128&fit=crop&crop=center&auto=format&dpr=2&q=80' },
  ];
  
  let activeCategory = '/';
  let isMobileSidebarOpen = false;
  let isDesktopSidebarOpen = true;
  let hasLoadedStorage = false;
  let isMobileNavOpen = false;
  
  const setActiveCategory = (href) => {
    activeCategory = href;
  };
  
  // Get current path for initial active state
  $: if ($page.url.pathname) {
    const pathParts = $page.url.pathname.split('/');
    // Remove website slug from path for active state
    activeCategory = '/' + pathParts.slice(2).join('/');
  }

  // Helper untuk membuat URL dengan slug website
  const getWebsiteUrl = (path) => {
    return createWebsiteUrl(website, path);
  };

  // Persist desktop sidebar state across pages
  onMount(() => {
    if (browser) {
      const stored = localStorage.getItem('isDesktopSidebarOpen');
      if (stored !== null) {
        isDesktopSidebarOpen = stored === 'true';
      }
      const storedMobile = localStorage.getItem('isMobileSidebarOpen');
      if (storedMobile !== null) {
        isMobileSidebarOpen = storedMobile === 'true';
      }
      hasLoadedStorage = true;
    }
  });

  $: if (browser && hasLoadedStorage) {
    localStorage.setItem('isDesktopSidebarOpen', String(isDesktopSidebarOpen));
    localStorage.setItem('isMobileSidebarOpen', String(isMobileSidebarOpen));
  }
</script>

<!-- Header -->
<header class="bg-white shadow-sm">
  <!-- Top Header -->
  <div class="bg-gray-50 py-4">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between">
        <!-- Left: Date -->
        <div class="hidden md:block text-sm text-gray-600 font-medium">
          {formattedDate}
        </div>
        
        <!-- Logo -->
        <div class="text-center">
          <h1 class="font-handwriting text-3xl font-bold text-gray-800 hidden md:block">
            {website.name}
          </h1>
        </div>
        
        <!-- Social Media Links moved to right -->
        <div class="hidden md:flex flex-col items-center space-y-2">
          <span class="text-sm text-gray-600 font-medium">
            {#if contactData && contactData.social_media && contactData.social_media.title}
              {contactData.social_media.title}
            {:else}
              Follow me on
            {/if}
          </span>
          <div class="flex space-x-3">
            {#if contactData && contactData.social_media && contactData.social_media.platforms}
              {#each contactData.social_media.platforms as platform}
                {#if platform.is_active}
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Follow us on {getPlatformDisplayName(platform.icon_name)}" 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors {getPlatformBgColor(platform.icon_name)}"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      {@html getIconSvg(platform.icon_name)}
                    </svg>
                  </a>
                {/if}
              {/each}
            {:else}
              <!-- Fallback to default social media links if no contact data -->
              <a href="https://twitter.com/Kelantanfood" aria-label="Follow us on Twitter" class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://instagram.com/Kelantanfood" aria-label="Follow us on Instagram" class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://youtube.com/Kelantanfood" aria-label="Follow us on YouTube" class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://facebook.com/Kelantanfood" aria-label="Follow us on Facebook" class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Navigation Menu -->
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between">
        <!-- Logo and Home -->
        <div class="flex items-center space-x-8">
          <h2 class="font-handwriting text-2xl font-bold text-gray-800 md:hidden">
            {website.name}
          </h2>
          
          <a
            href={getWebsiteUrl('/')}
            class="hidden md:flex items-center space-x-2 py-4 px-2 transition-colors relative {activeCategory === '/' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}"
            on:click={() => setActiveCategory('/')}
          >
            <span class="font-medium">Home</span>
            <div 
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary-500 transition-all duration-300 ease-in-out {activeCategory === '/' ? 'w-full' : 'w-0'}"
            ></div>
          </a>
        </div>
        
        <!-- Top Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <a
            href={getWebsiteUrl('/advertise')}
            class="flex items-center space-x-2 py-4 px-2 transition-colors relative {activeCategory === '/advertise' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}"
            on:click={() => setActiveCategory('/advertise')}
          >
            <span class="font-medium">Advertise</span>
            <div 
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary-500 transition-all duration-300 ease-in-out {activeCategory === '/advertise' ? 'w-full' : 'w-0'}"
            ></div>
          </a>
          <a
            href={getWebsiteUrl('/about')}
            class="flex items-center space-x-2 py-4 px-2 transition-colors relative {activeCategory === '/about' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}"
            on:click={() => setActiveCategory('/about')}
          >
            <span class="font-medium">About Us</span>
            <div 
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary-500 transition-all duration-300 ease-in-out {activeCategory === '/about' ? 'w-full' : 'w-0'}"
            ></div>
          </a>
          
          
          <a
            href={getWebsiteUrl('/contact')}
            class="flex items-center space-x-2 py-4 px-2 transition-colors relative {activeCategory === '/contact' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}"
            on:click={() => setActiveCategory('/contact')}
          >
            <span class="font-medium">Contact Us</span>
            <div 
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primary-500 transition-all duration-300 ease-in-out {activeCategory === '/contact' ? 'w-full' : 'w-0'}"
            ></div>
          </a>
        </div>

        <!-- Mobile Hamburger (kanan) -->
        <div class="md:hidden relative">
          <button
            class="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            aria-label={isMobileNavOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMobileNavOpen}
            on:click={() => (isMobileNavOpen = !isMobileNavOpen)}
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {#if isMobileNavOpen}
            <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <a
                href={getWebsiteUrl('/')}
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                on:click={() => {
                  setActiveCategory('/');
                  isMobileNavOpen = false;
                }}
              >Home</a>
              <a
                href={getWebsiteUrl('/advertise')}
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                on:click={() => {
                  setActiveCategory('/advertise');
                  isMobileNavOpen = false;
                }}
              >Advertise</a>
              <a
                href={getWebsiteUrl('/about')}
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                on:click={() => {
                  setActiveCategory('/about');
                  isMobileNavOpen = false;
                }}
              >About Us</a>
              
              <a
                href={getWebsiteUrl('/contact')}
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                on:click={() => {
                  setActiveCategory('/contact');
                  isMobileNavOpen = false;
                }}
              >Contact Us</a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </nav>
  {#if isMobileNavOpen}
    <div
      class="fixed inset-0 z-40 bg-transparent"
      role="button"
      tabindex="0"
      aria-label="Tutup menu navigasi"
      on:click={() => (isMobileNavOpen = false)}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          isMobileNavOpen = false;
        }
      }}
    ></div>
  {/if}
</header>

<!-- Desktop: Sidebar kategori dengan gambar bulat dan container rounded -->
{#if isDesktopSidebarOpen}
  <aside class="hidden md:flex fixed left-3 top-1/2 -translate-y-1/2 z-50">
    <div class="bg-white/80 backdrop-blur-md text-gray-800 rounded-full border border-gray-200/60 shadow-xl px-3 py-4 flex flex-col items-center gap-2 relative">
      
      <!-- Tombol close di tengah atas container -->
      <button
        class="absolute top-1/2 -translate-y-1/2 -right-2 w-7 h-7 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center text-gray-600 hover:text-gray-800"
        on:click={() => (isDesktopSidebarOpen = false)}
        aria-label="Tutup kategori"
        title="Tutup kategori"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      
      {#each foodCategories as category}
        <a
          href={getWebsiteUrl(category.href)}
          aria-label={category.name}
          class="group flex flex-col items-center"
          on:click={() => setActiveCategory(category.href)}
        >
          <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 transition-all duration-200 {activeCategory === category.href ? 'ring-primary-500 scale-110' : 'ring-transparent group-hover:ring-white/60 group-hover:scale-105'}">
            <img src={category.image} alt={category.name} loading="lazy" decoding="async" width="56" height="56" class="w-full h-full object-cover" />
          </div>
          <span class="mt-1 text-[9px] font-medium text-center w-14 truncate text-gray-700">{category.name}</span>
        </a>
      {/each}
    </div>
  </aside>
{:else}
  <button
    class="hidden md:flex fixed left-2 top-1/2 -translate-y-1/2 z-50 bg-white text-gray-700 w-9 h-9 rounded-full border border-gray-200 shadow-md hover:shadow-lg active:scale-95 items-center justify-center transition-all duration-200"
    on:click={() => (isDesktopSidebarOpen = true)}
    aria-label="Buka kategori"
    title="Buka kategori"
  >
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="5" r="1.5"/>
      <circle cx="12" cy="5" r="1.5"/>
      <circle cx="19" cy="5" r="1.5"/>
      <circle cx="5" cy="12" r="1.5"/>
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="19" cy="12" r="1.5"/>
      <circle cx="5" cy="19" r="1.5"/>
      <circle cx="12" cy="19" r="1.5"/>
      <circle cx="19" cy="19" r="1.5"/>
    </svg>
  </button>
{/if}
<!-- Mobile: tombol kecil untuk membuka sidebar kategori -->
<button
  class="md:hidden fixed left-3 top-1/2 -translate-y-1/2 z-50 bg-white text-gray-700 w-9 h-9 rounded-full border border-gray-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center transition-all duration-200"
  on:click={() => (isMobileSidebarOpen = !isMobileSidebarOpen)}
  aria-label={isMobileSidebarOpen ? 'Tutup kategori' : 'Buka kategori'}
  title={isMobileSidebarOpen ? 'Tutup kategori' : 'Buka kategori'}
>
  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="5" r="1.5"/>
    <circle cx="12" cy="5" r="1.5"/>
    <circle cx="19" cy="5" r="1.5"/>
    <circle cx="5" cy="12" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="19" cy="12" r="1.5"/>
    <circle cx="5" cy="19" r="1.5"/>
    <circle cx="12" cy="19" r="1.5"/>
    <circle cx="19" cy="19" r="1.5"/>
  </svg>
</button>

<!-- Mobile slide-out sidebar dari kiri -->
<div class="md:hidden">
  {#if isMobileSidebarOpen}
    <div
      class="fixed inset-0 bg-transparent z-40"
      role="button"
      tabindex="0"
      aria-label="Tutup panel kategori"
      on:click={() => (isMobileSidebarOpen = false)}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          isMobileSidebarOpen = false;
        }
      }}
    ></div>
  {/if}
  <div
    class="fixed left-3 top-1/2 -translate-y-1/2 z-50 transform transition-all duration-300"
    class:translate-x-0={isMobileSidebarOpen}
    class:-translate-x-6={!isMobileSidebarOpen}
    class:opacity-100={isMobileSidebarOpen}
    class:opacity-0={!isMobileSidebarOpen}
    class:pointer-events-auto={isMobileSidebarOpen}
    class:pointer-events-none={!isMobileSidebarOpen}
  >
    <div class="bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-gray-100 p-2 flex flex-col items-center justify-center gap-2 relative">
      
      <!-- Tombol close di tengah atas container mobile -->
      <button
        class="absolute top-1/2 -translate-y-1/2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center text-gray-600 hover:text-gray-800"
        on:click={() => (isMobileSidebarOpen = false)}
        aria-label="Tutup kategori"
        title="Tutup kategori"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      
      {#each foodCategories as category}
        <a
          href={getWebsiteUrl(category.href)}
          aria-label={category.name}
          class="group flex flex-col items-center"
          on:click={() => {
            setActiveCategory(category.href);
            isMobileSidebarOpen = false;
          }}
        >
          <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 transition-all duration-200 {activeCategory === category.href ? 'ring-primary-500 scale-110' : 'ring-transparent group-hover:ring-gray-300 group-hover:scale-105'}">
            <img src={category.image} alt={category.name} loading="lazy" decoding="async" width="48" height="48" class="w-full h-full object-cover" />
          </div>
          <span class="mt-1 text-[8px] font-medium text-center w-16 truncate text-gray-700">{category.name}</span>
        </a>
      {/each}
    </div>
  </div>
</div>
