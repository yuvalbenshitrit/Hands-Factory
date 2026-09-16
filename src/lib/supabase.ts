import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabase = supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_ANON_KEY'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type GalleryMedia = {
  src: string;
  alt: string;
  type: 'image' | 'video';
  path?: string;
};

export const loadSupabaseGallery = async (useSignedUrls = false): Promise<GalleryMedia[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.storage.from('gallery').list('', {
    limit: 100,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    console.error('Unable to load Supabase gallery:', error.message);
    return [];
  }

  return Promise.all(data
    .filter(file => file.name && !file.name.startsWith('.'))
    .map(async file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const type = ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension) ? 'video' : 'image';
      const { data: publicUrl } = supabase.storage.from('gallery').getPublicUrl(file.name);
      let src = publicUrl.publicUrl;

      if (useSignedUrls) {
        const { data: signedUrl } = await supabase.storage.from('gallery').createSignedUrl(file.name, 3600);
        if (signedUrl?.signedUrl) {
          src = signedUrl.signedUrl;
        }
      }

      return {
        src,
        alt: `תמונה מהמפעל - ${file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}`,
        type,
        path: file.name,
      };
    }));
};
