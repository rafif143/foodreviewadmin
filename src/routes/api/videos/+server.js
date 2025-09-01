import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

// GET /api/videos - Get all videos for a website
export async function GET({ url }) {
  try {
    const websiteId = url.searchParams.get('website_id');
    
    if (!websiteId) {
      return json({ error: 'website_id parameter is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('website_id', websiteId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return json({ videos: data || [] });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// POST /api/videos - Create a new video
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { website_id, title, url, description, video_type, is_active = true } = body;

    // Validation
    if (!website_id || !title || !url) {
      return json({ error: 'website_id, title, and url are required' }, { status: 400 });
    }

    // Auto-detect video type if not provided
    let finalVideoType = video_type;
    if (!finalVideoType) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        finalVideoType = 'youtube';
      } else if (url.includes('tiktok.com')) {
        finalVideoType = 'tiktok';
      } else {
        finalVideoType = 'youtube'; // default fallback
      }
    }

    // Validate video type
    if (!['youtube', 'tiktok'].includes(finalVideoType)) {
      return json({ error: 'video_type must be either "youtube" or "tiktok"' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('videos')
      .insert({
        website_id,
        title,
        url,
        description,
        video_type: finalVideoType,
        is_active
      })
      .select()
      .single();

    if (error) throw error;

    return json({ video: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return json({ error: 'Failed to create video' }, { status: 500 });
  }
}

// PUT /api/videos/:id - Update a video
export async function PUT({ params, request }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, url, description, video_type, is_active } = body;

    // Validation
    if (!title || !url) {
      return json({ error: 'title and url are required' }, { status: 400 });
    }

    // Auto-detect video type if URL is provided but type is not
    let finalVideoType = video_type;
    if (url && !finalVideoType) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        finalVideoType = 'youtube';
      } else if (url.includes('tiktok.com')) {
        finalVideoType = 'tiktok';
      } else {
        finalVideoType = 'youtube'; // default fallback
      }
    }

    // Validate video type if provided
    if (finalVideoType && !['youtube', 'tiktok'].includes(finalVideoType)) {
      return json({ error: 'video_type must be either "youtube" or "tiktok"' }, { status: 400 });
    }

    const updateData = {
      title,
      url,
      description,
      is_active,
      updated_at: new Date().toISOString()
    };

    // Only update video_type if it's provided
    if (finalVideoType) {
      updateData.video_type = finalVideoType;
    }

    const { data, error } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return json({ video: data });
  } catch (error) {
    console.error('Error updating video:', error);
    return json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE /api/videos/:id - Delete a video
export async function DELETE({ params }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
