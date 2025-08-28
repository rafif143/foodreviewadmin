<script>
  import { createEventDispatcher } from 'svelte';

  export let advertiseData = null;
  export let loading = false;
  export let websiteId = null;

  const dispatch = createEventDispatcher();

  // Initialize data with default values if not provided
  $: if (!advertiseData) {
    advertiseData = {
      page_title: "Iklan & Promosi",
      page_description: "Promosikan bisnis kuliner Anda dengan jangkauan luas di Kelantan",
      introduction: {
        title: "Mengapa Memilih Kami?",
        content: "Dengan jutaan reach di Facebook dan ratusan ribu followers di Instagram, kami adalah partner terpercaya untuk mempromosikan bisnis kuliner Anda ke audiens yang tepat di Kelantan dan seluruh Malaysia."
      },
      packages: [
        {
          name: "Pakej 1",
          label: null,
          price: "RM90",
          platforms: [
            { name: "TikTok", icon_name: "tiktok" },
            { name: "Facebook", icon_name: "facebook" },
            { name: "Instagram", icon_name: "instagram" }
          ],
          order_index: 1
        },
        {
          name: "Pakej 2",
          label: "POPULAR",
          price: "RM150",
          platforms: [
            { name: "TikTok", icon_name: "tiktok" },
            { name: "Facebook", icon_name: "facebook" },
            { name: "Instagram", icon_name: "instagram" }
          ],
          order_index: 2
        },
        {
          name: "Pakej 3",
          label: "PREMIUM",
          price: "RM200",
          platforms: [
            { name: "TikTok", icon_name: "tiktok" },
            { name: "Facebook", icon_name: "facebook" },
            { name: "Instagram", icon_name: "instagram" },
            { name: "X (Twitter)", icon_name: "twitter" },
            { name: "Threads", icon_name: "threads" }
          ],
          order_index: 3
        }
      ],
      contact_info: {
        title: "Hubungi Kami",
        description: "Siap untuk mempromosikan bisnis kuliner Anda? Hubungi kami sekarang untuk konsultasi gratis dan mulai kampanye promosi Anda!",
        form: {
          title: "Kirim Pesan"
        },
        items: [
          {
            type: "Telepon",
            value: "+60 12-345 6789",
            icon_name: "phone"
          },
          {
            type: "Email",
            value: "advertise@kelantanfoodie.com",
            icon_name: "email"
          },
          {
            type: "Lokasi",
            value: "Kota Bharu, Kelantan, Malaysia",
            icon_name: "location"
          }
        ]
      },
      last_updated: "Terakhir diperbarui: " + new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  }

  // Ensure all required properties exist
  $: if (advertiseData && !advertiseData.introduction) {
    advertiseData.introduction = { title: '', content: '' };
  }
  
  $: if (advertiseData && !advertiseData.packages) {
    advertiseData.packages = [];
  }
  
  $: if (advertiseData && !advertiseData.contact_info) {
    advertiseData.contact_info = {
      title: '',
      description: '',
      form: { title: '' },
      items: []
    };
  }

  // Map icon names to SVG paths
  const iconSvgs = {
    'tiktok': '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>',
    'facebook': '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
    'instagram': '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
    'twitter': '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
    'threads': '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>',
    'phone': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
    'email': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
    'location': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>'
  };

  // Available platforms for packages
  const availablePlatforms = [
    { name: "TikTok", icon_name: "tiktok" },
    { name: "Facebook", icon_name: "facebook" },
    { name: "Instagram", icon_name: "instagram" },
    { name: "X (Twitter)", icon_name: "twitter" },
    { name: "Threads", icon_name: "threads" }
  ];

  // Available contact types
  const contactTypes = [
    { type: "Telepon", icon_name: "phone" },
    { type: "Email", icon_name: "email" },
    { type: "Lokasi", icon_name: "location" }
  ];

  function handleSubmit() {
    // Create a deep copy of the data to ensure reactivity
    const dataToSubmit = JSON.parse(JSON.stringify(advertiseData));
    
    // Update last_updated
    dataToSubmit.last_updated = "Terakhir diperbarui: " + new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Ensure all required fields exist
    dataToSubmit.page_title = dataToSubmit.page_title || '';
    dataToSubmit.page_description = dataToSubmit.page_description || '';
    dataToSubmit.introduction = dataToSubmit.introduction || { title: '', content: '' };
    dataToSubmit.packages = dataToSubmit.packages || [];
    dataToSubmit.contact_info = dataToSubmit.contact_info || { title: '', description: '', form: { title: '' }, items: [] };

    console.log('Form submitting data:', dataToSubmit);
    dispatch('submit', dataToSubmit);
  }

  function handleReset() {
    advertiseData = {
      page_title: "Iklan & Promosi",
      page_description: "Promosikan bisnis kuliner Anda dengan jangkauan luas di Kelantan",
      introduction: {
        title: "Mengapa Memilih Kami?",
        content: "Dengan jutaan reach di Facebook dan ratusan ribu followers di Instagram, kami adalah partner terpercaya untuk mempromosikan bisnis kuliner Anda ke audiens yang tepat di Kelantan dan seluruh Malaysia."
      },
      packages: [
        {
          name: "Pakej 1",
          label: null,
          price: "RM90",
          platforms: [
            { name: "TikTok", icon_name: "tiktok" },
            { name: "Facebook", icon_name: "facebook" },
            { name: "Instagram", icon_name: "instagram" }
          ],
          order_index: 1
        },
        {
          name: "Pakej 2",
          label: "POPULAR",
          price: "RM150",
          platforms: [
            { name: "TikTok", icon_name: "tiktok" },
            { name: "Facebook", icon_name: "facebook" },
            { name: "Instagram", icon_name: "instagram" }
          ],
          order_index: 2
        },
        {
          name: "Pakej 3",
          label: "PREMIUM",
          price: "RM200",
          platforms: [
            { name: "TikTok", icon_name: "tiktok" },
            { name: "Facebook", icon_name: "facebook" },
            { name: "Instagram", icon_name: "instagram" },
            { name: "X (Twitter)", icon_name: "twitter" },
            { name: "Threads", icon_name: "threads" }
          ],
          order_index: 3
        }
      ],
      contact_info: {
        title: "Hubungi Kami",
        description: "Siap untuk mempromosikan bisnis kuliner Anda? Hubungi kami sekarang untuk konsultasi gratis dan mulai kampanye promosi Anda!",
        form: {
          title: "Kirim Pesan"
        },
        items: [
          {
            type: "Telepon",
            value: "+60 12-345 6789",
            icon_name: "phone"
          },
          {
            type: "Email",
            value: "advertise@kelantanfoodie.com",
            icon_name: "email"
          },
          {
            type: "Lokasi",
            value: "Kota Bharu, Kelantan, Malaysia",
            icon_name: "location"
          }
        ]
      },
      last_updated: "Terakhir diperbarui: " + new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  }

  function addPackage() {
    if (!advertiseData.packages) {
      advertiseData.packages = [];
    }
    const newPackage = {
      name: `Pakej ${advertiseData.packages.length + 1}`,
      label: null,
      price: "RM0",
      platforms: [],
      order_index: advertiseData.packages.length + 1
    };
    advertiseData.packages = [...advertiseData.packages, newPackage];
  }

  function removePackage(index) {
    if (!advertiseData.packages) return;
    advertiseData.packages = advertiseData.packages.filter((_, i) => i !== index);
    // Update order_index
    advertiseData.packages = advertiseData.packages.map((pkg, i) => ({
      ...pkg,
      order_index: i + 1
    }));
  }

  function addContactItem() {
    if (!advertiseData.contact_info) {
      advertiseData.contact_info = { items: [] };
    }
    if (!advertiseData.contact_info.items) {
      advertiseData.contact_info.items = [];
    }
    const newItem = {
      type: "Telepon",
      value: "",
      icon_name: "phone"
    };
    advertiseData.contact_info.items = [...advertiseData.contact_info.items, newItem];
  }

  function removeContactItem(index) {
    if (!advertiseData.contact_info?.items) return;
    advertiseData.contact_info.items = advertiseData.contact_info.items.filter((_, i) => i !== index);
  }

  function togglePlatform(pkgIndex, platform) {
    if (!advertiseData.packages?.[pkgIndex]) return;
    const pkg = advertiseData.packages[pkgIndex];
    if (!pkg.platforms) {
      pkg.platforms = [];
    }
    const platformIndex = pkg.platforms.findIndex(p => p.name === platform.name);
    
    if (platformIndex >= 0) {
      pkg.platforms = pkg.platforms.filter((_, i) => i !== platformIndex);
    } else {
      pkg.platforms = [...pkg.platforms, platform];
    }
    
    advertiseData.packages = [...advertiseData.packages];
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
</svelte:head>

<div class="max-w-6xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">Edit Halaman Advertise</h1>
    <p class="mt-2 text-gray-600">Kelola konten halaman advertise dan promosi</p>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-8">
    <!-- Page Info -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Informasi Halaman</h3>
        
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="page_title" class="block text-sm font-medium text-gray-700 mb-2">
              Judul Halaman
            </label>
            <input
              type="text"
              id="page_title"
              bind:value={advertiseData.page_title}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Contoh: Iklan & Promosi"
              required
            />
          </div>

          <div>
            <label for="page_description" class="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Halaman
            </label>
            <input
              type="text"
              id="page_description"
              bind:value={advertiseData.page_description}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Contoh: Promosikan bisnis kuliner Anda dengan jangkauan luas di Kelantan"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Introduction -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Bagian Introduction</h3>
        
        <div class="space-y-6">
          <div>
            <label for="intro_title" class="block text-sm font-medium text-gray-700 mb-2">
              Judul Introduction
            </label>
            <input
              type="text"
              id="intro_title"
              bind:value={advertiseData.introduction.title}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Contoh: Mengapa Memilih Kami?"
              required
            />
          </div>

          <div>
            <label for="intro_content" class="block text-sm font-medium text-gray-700 mb-2">
              Konten Introduction
            </label>
            <textarea
              id="intro_content"
              bind:value={advertiseData.introduction.content}
              rows="4"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Masukkan konten introduction..."
              required
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Packages -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Pakej Promosi</h3>
          <button
            type="button"
            on:click={addPackage}
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Tambah Pakej
          </button>
        </div>
        
        <div class="space-y-8">
          {#each advertiseData.packages || [] as pkg, pkgIndex}
            <div class="border border-gray-200 rounded-lg p-6">
              <div class="flex justify-between items-start mb-4">
                <h4 class="text-lg font-medium text-gray-900">Pakej {pkgIndex + 1}</h4>
                <button
                  type="button"
                  on:click={() => removePackage(pkgIndex)}
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Hapus
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nama Pakej
                  </label>
                  <input
                    type="text"
                    bind:value={pkg.name}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Contoh: Pakej Basic"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Label (Opsional)
                  </label>
                  <input
                    type="text"
                    bind:value={pkg.label}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Contoh: POPULAR"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="text"
                    bind:value={pkg.price}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Contoh: RM90"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Platform yang Dicakup
                </label>
                <div class="flex flex-wrap gap-2">
                  {#each availablePlatforms as platform}
                    <button
                      type="button"
                      on:click={() => togglePlatform(pkgIndex, platform)}
                      class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors {(pkg.platforms || []).find(p => p.name === platform.name) ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}"
                    >
                      <span class="mr-2 w-5 h-5">
                        {#if platform.icon_name === 'threads'}
                          <i class="bi bi-threads text-current"></i>
                        {:else}
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            {@html iconSvgs[platform.icon_name]}
                          </svg>
                        {/if}
                      </span>
                      {platform.name}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Informasi Kontak</h3>
        
        <div class="space-y-6">
          <div>
            <label for="contact_title" class="block text-sm font-medium text-gray-700 mb-2">
              Judul Kontak
            </label>
            <input
              type="text"
              id="contact_title"
              bind:value={advertiseData.contact_info.title}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Contoh: Hubungi Kami"
              required
            />
          </div>

          <div>
            <label for="contact_description" class="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Kontak
            </label>
            <textarea
              id="contact_description"
              bind:value={advertiseData.contact_info.description}
              rows="3"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Masukkan deskripsi kontak..."
              required
            ></textarea>
          </div>

          <div>
            <label for="form_title" class="block text-sm font-medium text-gray-700 mb-2">
              Judul Form
            </label>
            <input
              type="text"
              id="form_title"
              bind:value={advertiseData.contact_info.form.title}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Contoh: Kirim Pesan"
              required
            />
          </div>

          <!-- Contact Items -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <label class="block text-sm font-medium text-gray-700">
                Item Kontak
              </label>
              <button
                type="button"
                on:click={addContactItem}
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                + Tambah Item
              </button>
            </div>

            <div class="space-y-4">
              {#each advertiseData.contact_info?.items || [] as item, itemIndex}
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-4">
                    <h5 class="text-sm font-medium text-gray-900">Item {itemIndex + 1}</h5>
                    <button
                      type="button"
                      on:click={() => removeContactItem(itemIndex)}
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tipe
                      </label>
                      <select
                        bind:value={item.type}
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {#each contactTypes as contactType}
                          <option value={contactType.type}>{contactType.type}</option>
                        {/each}
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nilai
                      </label>
                      <input
                        type="text"
                        bind:value={item.value}
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Contoh: +60 12-345 6789"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <div class="flex items-center space-x-2">
                        <span class="w-6 h-6">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {@html iconSvgs[item.icon_name]}
                          </svg>
                        </span>
                        <span class="text-sm text-gray-500">{item.icon_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4">
      <button
        type="button"
        on:click={handleReset}
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset ke Default
      </button>
      
      <button
        type="submit"
        disabled={loading}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Menyimpan...
        {:else}
          Simpan Perubahan
        {/if}
      </button>
    </div>
  </form>
</div>
