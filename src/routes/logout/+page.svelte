<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { signOut } from '$lib/stores/authStore.js';
  
  onMount(async () => {
    try {
      // Sign out user
      const result = await signOut();
      
      if (result.success) {
        // Redirect to login page
        goto('/login');
      } else {
        // If logout failed, still redirect to login
        console.error('Logout failed:', result.error);
        goto('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, redirect to login
      goto('/login');
    }
  });
</script>

<svelte:head>
  <title>Logout - Food Blogging Admin</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
  <div class="text-center">
    <div class="animate-spin h-16 w-16 text-orange-500 mx-auto mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <h2 class="text-xl font-semibold text-gray-800 mb-2">Logging Out...</h2>
    <p class="text-gray-600">Mengalihkan ke halaman login</p>
  </div>
</div>
