import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

// GET /api/videos/:id - Get a specific video
export async function GET({ params }) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return json({ error: 'Video not found' }, { status: 404 });
      }
      throw error;
    }

    return json({ video: data });
  } catch (error) {
    console.error('Error fetching video:', error);
    return json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

// PUT /api/videos/:id - Update a specific video
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

    if (error) {
      if (error.code === 'PGRST116') {
        return json({ error: 'Video not found' }, { status: 404 });
      }
      throw error;
    }

    return json({ video: data });
  } catch (error) {
    console.error('Error updating video:', error);
    return json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// DELETE /api/videos/:id - Delete a specific video
export async function DELETE({ params }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return json({ error: 'Video not found' }, { status: 404 });
      }
      throw error;
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return json({ error: 'Failed to delete video' }, { status: 500 });
  }
}

// PATCH /api/videos/:id - Toggle video status
export async function PATCH({ params, request }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { is_active } = body;

    if (typeof is_active !== 'boolean') {
      return json({ error: 'is_active must be a boolean' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('videos')
      .update({
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return json({ error: 'Video not found' }, { status: 404 });
      }
      throw error;
    }

    return json({ video: data });
  } catch (error) {
    console.error('Error toggling video status:', error);
    return json({ error: 'Failed to toggle video status' }, { status: 500 });
  }
}
