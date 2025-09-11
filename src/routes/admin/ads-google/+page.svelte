<!-- Google Ads Dashboard -->
<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { page } from '$app/stores';
  
  let stats = {
    adsConfigs: 0,
    adsContent: 0,
    activeAds: 0,
    totalRevenue: 0
  };
  
  onMount(async () => {
    try {
      // Get ads configs count
      const { count: adsConfigsCount } = await supabase
        .from('website_ads_config')
        .select('*', { count: 'exact', head: true });
      
      // Get ads content count
      const { count: adsContentCount } = await supabase
        .from('ads_content')
        .select('*', { count: 'exact', head: true });
      
      // Get active ads count
      const { count: activeAdsCount } = await supabase
        .from('ads_content')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      stats = {
        adsConfigs: adsConfigsCount || 0,
        adsContent: adsContentCount || 0,
        activeAds: activeAdsCount || 0,
        totalRevenue: 0 // Placeholder for revenue tracking
      };
      
    } catch (error) {
      console.error('Error loading ads stats:', error);
    }
  });
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Google Ads Management</h1>
        <p class="text-gray-600">Kelola konfigurasi dan konten iklan Google Ads untuk semua website</p>
      </div>
      <div class="flex space-x-3">
        <a 
          href="/admin/ads-google/ads"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Kelola Ads
        </a>
      </div>
    </div>
  </div>
  
  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Konfigurasi Ads</p>
          <p class="text-2xl font-semibold text-gray-900">{stats.adsConfigs}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h10"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Total Konten Ads</p>
          <p class="text-2xl font-semibold text-gray-900">{stats.adsContent}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Ads Aktif</p>
          <p class="text-2xl font-semibold text-gray-900">{stats.activeAds}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Total Revenue</p>
          <p class="text-2xl font-semibold text-gray-900">Rp {stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Quick Actions -->
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <a 
        href="/admin/ads-google/ads" 
        class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">Kelola Ads</h3>
          <p class="text-sm text-gray-500">Konfigurasi dan kelola konten iklan</p>
        </div>
      </a>
      
      <a 
        href="/admin/ads-google/ads" 
        class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">Tambah Ads Baru</h3>
          <p class="text-sm text-gray-500">Buat konten iklan baru</p>
        </div>
      </a>
      
      <a 
        href="/admin/ads-google/ads" 
        class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-gray-900">Analytics Ads</h3>
          <p class="text-sm text-gray-500">Lihat performa iklan</p>
        </div>
      </a>
    </div>
  </div>
  
  <!-- Recent Activity -->
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Aktivitas Terbaru</h2>
    <div class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <p class="mt-2">Belum ada aktivitas terbaru</p>
      <p class="text-sm">Mulai dengan mengkonfigurasi ads untuk website Anda</p>
    </div>
  </div>
</div>
