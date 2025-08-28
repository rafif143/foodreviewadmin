<script>
  import { createEventDispatcher } from 'svelte';
  import { getDefaultContactData } from '$lib/contact.js';

  export let contactData = null;
  export let loading = false;

  const dispatch = createEventDispatcher();

  // Initialize contactData with default values if not provided
  $: if (!contactData) {
    contactData = getDefaultContactData();
  }

  // Convert gradient objects to indices when data is loaded
  $: if (contactData) {
    // Convert FAQ gradients
    if (contactData.faq && contactData.faq.items) {
      contactData.faq.items.forEach(item => {
        if (item.gradient && typeof item.gradient === 'object') {
          const gradientIndex = availableGradients.findIndex(g => 
            g.from === item.gradient.from && g.to === item.gradient.to
          );
          item.gradient = gradientIndex >= 0 ? gradientIndex : 0;
        }
      });
    }
    
         // Convert social media (no gradient needed)
     if (contactData.social_media && contactData.social_media.platforms) {
       contactData.social_media.platforms.forEach(platform => {
         // Remove gradient property if exists
         if (platform.gradient) {
           delete platform.gradient;
         }
         // Set name based on icon_name for display
         if (platform.icon_name && !platform.name) {
           const iconData = socialMediaIcons.find(icon => icon.value === platform.icon_name);
           platform.name = iconData ? iconData.label.replace(/^[^\s]+ /, '') : platform.icon_name;
         }
         // Ensure is_active is boolean
         if (typeof platform.is_active !== 'boolean') {
           platform.is_active = true;
         }
       });
     }
  }

  // Add new FAQ item
  function addFaqItem() {
    if (!contactData.faq.items) contactData.faq.items = [];
    contactData.faq.items.push({
      question: '',
      answer: '',
      gradient: 0,
      icon_name: availableIcons[4].value
    });
    contactData = { ...contactData };
  }

  // Remove FAQ item
  function removeFaqItem(index) {
    contactData.faq.items.splice(index, 1);
    contactData = { ...contactData };
  }

  // Add new contact info item
  function addContactInfoItem() {
    if (!contactData.contact_info.items) contactData.contact_info.items = [];
    contactData.contact_info.items.push({
      type: '',
      value: [''],
      icon_name: availableIcons[0].value
    });
    contactData = { ...contactData };
  }

  // Remove contact info item
  function removeContactInfoItem(index) {
    contactData.contact_info.items.splice(index, 1);
    contactData = { ...contactData };
  }

     // Add new social media platform
   function addSocialMediaPlatform() {
     if (!contactData.social_media.platforms) contactData.social_media.platforms = [];
     contactData.social_media.platforms.push({
       url: '#',
       icon_name: 'facebook',
       is_active: true
     });
     contactData = { ...contactData };
   }

  // Remove social media platform
  function removeSocialMediaPlatform(index) {
    contactData.social_media.platforms.splice(index, 1);
    contactData = { ...contactData };
  }

  // Add new form subject option
  function addSubjectOption() {
    if (!contactData.form.subject_options) contactData.form.subject_options = [];
    contactData.form.subject_options.push({
      label: 'Opsi Baru',
      value: 'new_option_' + Date.now()
    });
    contactData = { ...contactData };
  }

  // Remove form subject option
  function removeSubjectOption(index) {
    contactData.form.subject_options.splice(index, 1);
    contactData = { ...contactData };
  }

  // Add new value to contact info item
  function addContactInfoValue(itemIndex) {
    contactData.contact_info.items[itemIndex].value.push('');
    contactData = { ...contactData };
  }

  // Remove value from contact info item
  function removeContactInfoValue(itemIndex, valueIndex) {
    contactData.contact_info.items[itemIndex].value.splice(valueIndex, 1);
    contactData = { ...contactData };
  }

  function handleSubmit() {
    // Convert gradient indices to actual gradient objects
    const processedData = JSON.parse(JSON.stringify(contactData));
    
    // Process FAQ gradients
    if (processedData.faq && processedData.faq.items) {
      processedData.faq.items.forEach(item => {
        if (typeof item.gradient === 'number') {
          item.gradient = availableGradients[item.gradient];
        }
      });
    }
    
         // Process social media (no gradient needed)
     if (processedData.social_media && processedData.social_media.platforms) {
       processedData.social_media.platforms.forEach(platform => {
         // Set name based on icon_name for display
         if (platform.icon_name && !platform.name) {
           const iconData = socialMediaIcons.find(icon => icon.value === platform.icon_name);
           platform.name = iconData ? iconData.label.replace(/^[^\s]+ /, '') : platform.icon_name;
         }
         // Ensure is_active is boolean
         if (typeof platform.is_active !== 'boolean') {
           platform.is_active = true;
         }
       });
     }
    
    dispatch('submit', processedData);
  }

  function handleReset() {
    contactData = getDefaultContactData();
    
    // Convert gradient objects to indices for form binding
    if (contactData.faq && contactData.faq.items) {
      contactData.faq.items.forEach(item => {
        if (item.gradient && typeof item.gradient === 'object') {
          const gradientIndex = availableGradients.findIndex(g => 
            g.from === item.gradient.from && g.to === item.gradient.to
          );
          item.gradient = gradientIndex >= 0 ? gradientIndex : 0;
        }
      });
    }
    
    if (contactData.social_media && contactData.social_media.platforms) {
      contactData.social_media.platforms.forEach(platform => {
        // Remove gradient property if exists
        if (platform.gradient) {
          delete platform.gradient;
        }
        // Set name based on icon_name for display
        if (platform.icon_name && !platform.name) {
          const iconData = socialMediaIcons.find(icon => icon.value === platform.icon_name);
          platform.name = iconData ? iconData.label.replace(/^[^\s]+ /, '') : platform.icon_name;
        }
      });
    }
  }

  // Available icons for selection
  const availableIcons = [
    { value: 'location', label: '📍 Location' },
    { value: 'phone', label: '📞 Phone' },
    { value: 'email', label: '📧 Email' },
    { value: 'clock', label: '🕐 Clock' },
    { value: 'question', label: '❓ Question' },
    { value: 'collaboration', label: '🤝 Collaboration' },
    { value: 'info', label: 'ℹ️ Info' },
    { value: 'globe', label: '🌐 Globe' }
  ];

     // Available social media icons
   const socialMediaIcons = [
     { value: 'facebook', label: '📘 Facebook' },
     { value: 'x', label: '𝕏 X (Twitter)' },
     { value: 'instagram', label: '📷 Instagram' },
     { value: 'youtube', label: '📺 YouTube' },
     { value: 'whatsapp', label: '💬 WhatsApp' },
     { value: 'pinterest', label: '📌 Pinterest' },
     { value: 'tiktok', label: '🎵 TikTok' },
     { value: 'linkedin', label: '💼 LinkedIn' },
     { value: 'globe', label: '🌐 Website' }
   ];

  // Available gradients for FAQ
  const availableGradients = [
    { from: 'red-600', to: 'red-700', label: 'Merah' },
    { from: 'orange-600', to: 'red-600', label: 'Oranye-Merah' },
    { from: 'red-600', to: 'orange-600', label: 'Merah-Oranye' },
    { from: 'blue-600', to: 'blue-700', label: 'Biru' },
    { from: 'green-600', to: 'green-700', label: 'Hijau' },
    { from: 'purple-600', to: 'purple-700', label: 'Ungu' }
  ];

   const iconSvgs = {
     location: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
     phone: '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
     email: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
     clock: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
     question: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>',
     collaboration: '<path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-3.7 3.7c-.39.39-1.02.39-1.41 0L6.01 9C5.54 8.37 4.8 8 4 8H1.46c-.8 0-1.54.37-2.01 1L-3 16.5V22h2.5l2.54-7.63A1.5 1.5 0 0 1 5.46 14H7v8h2v-8h1.5l2.54 7.63A1.5 1.5 0 0 0 14.54 22H16v-8h1.5l2.54 7.63A1.5 1.5 0 0 0 21.54 22H24v-8h-4z"/>',
     facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
     x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
     instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
     youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
     whatsapp: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>',
     pinterest: '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-7.83 9.781c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>',
     tiktok: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>'
   };
</script>

<div class="max-w-6xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center">
      <span class="text-3xl mr-3">📞</span>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Edit Contact Us</h1>
        <p class="mt-2 text-gray-600">Kelola konten halaman Contact Us</p>
      </div>
    </div>
  </div>

  <!-- Form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-8">
    <!-- Page Info -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Informasi Halaman</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Judul Halaman</label>
            <input
              type="text"
              bind:value={contactData.page_title}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Contoh: Hubungi Kami"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi Halaman</label>
            <input
              type="text"
              bind:value={contactData.page_description}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Deskripsi singkat halaman"
              required
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Penerima</label>
          <input
            type="email"
            bind:value={contactData.email}
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="email@example.com"
            required
          />
          <p class="mt-2 text-sm text-gray-500">Email ini akan menerima semua pesan dari form kontak</p>
        </div>
      </div>
    </div>

    <!-- Form Subject Options -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Opsi Subjek Form</h3>
                     <button
             type="button"
             on:click={addSubjectOption}
             class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
           >
             + Tambah Opsi
           </button>
        </div>
        
        <div class="space-y-4">
          {#each contactData.form.subject_options || [] as option, index}
            <div class="flex items-center space-x-4">
              <div class="flex-1 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  bind:value={option.label}
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Label opsi"
                  required
                />
                <input
                  type="text"
                  bind:value={option.value}
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Value opsi"
                  required
                />
              </div>
              {#if index > 0}
                <button
                  type="button"
                  on:click={() => removeSubjectOption(index)}
                  class="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Informasi Kontak</h3>
                     <button
             type="button"
             on:click={addContactInfoItem}
             class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
           >
             + Tambah Item
           </button>
        </div>
        
        <div class="space-y-6">
          {#each contactData.contact_info.items || [] as item, itemIndex}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
                  <input
                    type="text"
                    bind:value={item.type}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Contoh: Alamat, Telepon"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ikon</label>
                  <select
                    bind:value={item.icon_name}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    {#each availableIcons as icon}
                      <option value={icon.value}>{icon.label}</option>
                    {/each}
                  </select>
                </div>
                
                <div class="flex items-end">
                  <button
                    type="button"
                    on:click={() => removeContactInfoItem(itemIndex)}
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Hapus Item
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nilai</label>
                <div class="space-y-2">
                  {#each item.value as value, valueIndex}
                    <div class="flex items-center space-x-2">
                      <input
                        type="text"
                        bind:value={item.value[valueIndex]}
                        class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        placeholder="Masukkan nilai"
                        required
                      />
                      {#if item.value.length > 1}
                        <button
                          type="button"
                          on:click={() => removeContactInfoValue(itemIndex, valueIndex)}
                          class="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      {/if}
                    </div>
                  {/each}
                                     <button
                     type="button"
                     on:click={() => addContactInfoValue(itemIndex)}
                     class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                   >
                     + Tambah Nilai
                   </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

         <!-- Social Media -->
     <div class="bg-white shadow sm:rounded-lg">
       <div class="px-4 py-5 sm:p-6">
         <div class="flex justify-between items-center mb-6">
           <h3 class="text-lg leading-6 font-medium text-gray-900">Media Sosial</h3>
           <button
             type="button"
             on:click={addSocialMediaPlatform}
             class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
           >
             + Tambah Platform
           </button>
         </div>
         
         <div class="mb-6">
           <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
           <input
             type="text"
             bind:value={contactData.social_media.title}
             class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
             placeholder="Contoh: Ikuti Kami"
             required
           />
         </div>
         
         <div class="mb-6">
           <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
           <textarea
             bind:value={contactData.social_media.description}
             rows="3"
             class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
             placeholder="Deskripsi media sosial"
             required
           ></textarea>
         </div>
         
         <div class="space-y-4">
           {#each contactData.social_media.platforms || [] as platform, index}
             <div class="border border-gray-200 rounded-lg p-4">
               <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                   <select
                     bind:value={platform.icon_name}
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                     required
                   >
                     {#each socialMediaIcons as icon}
                       <option value={icon.value}>{icon.label}</option>
                     {/each}
                   </select>
                 </div>
                 
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
                   <input
                     type="url"
                     bind:value={platform.url}
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                     placeholder="https://example.com"
                     required
                   />
                 </div>
                 
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                   <div class="flex items-center">
                     <button
                       type="button"
                       class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 {platform.is_active ? 'bg-red-600' : 'bg-gray-200'}"
                       role="switch"
                       aria-checked={platform.is_active}
                       on:click={() => platform.is_active = !platform.is_active}
                     >
                       <span
                         class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out {platform.is_active ? 'translate-x-5' : 'translate-x-0'}"
                       ></span>
                     </button>
                     <span class="ml-3 text-sm font-medium text-gray-900">
                       {platform.is_active ? 'Aktif' : 'Nonaktif'}
                     </span>
                   </div>
                 </div>
                 
                 <div class="flex items-end">
                   <button
                     type="button"
                     on:click={() => removeSocialMediaPlatform(index)}
                     class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                   >
                     Hapus
                   </button>
                 </div>
               </div>
             </div>
           {/each}
         </div>
       </div>
     </div>

    <!-- FAQ -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">FAQ</h3>
                     <button
             type="button"
             on:click={addFaqItem}
             class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
           >
             + Tambah FAQ
           </button>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
          <input
            type="text"
            bind:value={contactData.faq.title}
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="Contoh: Pertanyaan Umum"
            required
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
          <textarea
            bind:value={contactData.faq.description}
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="Deskripsi FAQ"
            required
          ></textarea>
        </div>
        
        <div class="space-y-4">
          {#each contactData.faq.items || [] as item, index}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pertanyaan</label>
                  <input
                    type="text"
                    bind:value={item.question}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Masukkan pertanyaan"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ikon</label>
                  <select
                    bind:value={item.icon_name}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    required
                  >
                    {#each availableIcons as icon}
                      <option value={icon.value}>{icon.label}</option>
                    {/each}
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Gradient</label>
                  <select
                    bind:value={item.gradient}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    required
                  >
                    {#each availableGradients as gradient, index}
                      <option value={index}>{gradient.label}</option>
                    {/each}
                  </select>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Jawaban</label>
                <textarea
                  bind:value={item.answer}
                  rows="3"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Masukkan jawaban"
                  required
                ></textarea>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="button"
                  on:click={() => removeFaqItem(index)}
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Hapus FAQ
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Map -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">Peta Lokasi</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Judul</label>
            <input
              type="text"
              bind:value={contactData.map.title}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Contoh: Lokasi Kami"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <input
              type="text"
              bind:value={contactData.map.description}
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Deskripsi lokasi"
              required
            />
          </div>
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
          <input
            type="url"
            bind:value={contactData.map.iframe_src}
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            placeholder="https://www.google.com/maps/embed?..."
            required
          />
          <p class="mt-2 text-sm text-gray-500">Paste URL embed dari Google Maps</p>
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
         class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
