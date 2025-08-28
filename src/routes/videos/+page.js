export async function load({ url }) {
  // Dalam aplikasi nyata, website ID akan diambil dari parameter URL atau context
  const websiteId = url.searchParams.get('website_id') || 1;
  
  return {
    websiteId: parseInt(websiteId)
  };
}
