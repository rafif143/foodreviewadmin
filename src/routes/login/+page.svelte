<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { signIn, initializeAuth } from '$lib/stores/authStore.js';
  import { loadWebsiteFromStorage } from '$lib/stores/websiteStore.js';
  
  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';
  
  onMount(async () => {
    // Initialize auth and check if user is already logged in
    await initializeAuth();
    
    // Check if user is already logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      goto('/admin');
    }
  });
  
  async function handleLogin() {
    try {
      isLoading = true;
      errorMessage = '';
      
      if (!email.trim() || !password.trim()) {
        throw new Error('Email dan password harus diisi');
      }
      
      const result = await signIn(email.trim(), password);
      
      if (result.success) {
        // Check if website is already selected
        const website = loadWebsiteFromStorage();
        if (website) {
          // If website already selected, go directly to articles
          goto('/admin/food/articles');
        } else {
          // If no website selected, go to website selection
          goto('/admin/select-website');
        }
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      errorMessage = 'Login gagal: ' + error.message;
    } finally {
      isLoading = false;
    }
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<svelte:head>
  <title>Login - Food Blogging Admin</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Logo & Header -->
    <div class="text-center">
      <div class="mx-auto h-20 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6">
        <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        Food Blogging Admin
      </h2>
      <p class="text-gray-600">
        Masuk ke dashboard admin Anda
      </p>
    </div>

    <!-- Login Form -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <form on:submit|preventDefault={handleLogin} class="space-y-6">
        <!-- Error Message -->
        {#if errorMessage}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            on:keypress={handleKeyPress}
            required
            placeholder="admin@example.com"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            on:keypress={handleKeyPress}
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
          />
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          disabled={isLoading}
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          {:else}
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Masuk
          {/if}
        </button>
      </form>

      <!-- Footer Info -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500">
          Hanya untuk administrator yang berwenang
        </p>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="text-center">
      <div class="inline-flex items-center space-x-2 text-sm text-gray-500">
        <div class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <span>Food Blogging Platform</span>
        <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
</style>
