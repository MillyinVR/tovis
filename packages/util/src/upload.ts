import { createServerClient } from '@supabase/ssr';
import { randomUUID } from 'crypto';

export async function uploadToPrivateBucket(file: File, folder = 'licenses') {
  console.log('Upload function called with:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    folder
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlStart: supabaseUrl?.substring(0, 20) + '...',
    actualUrl: supabaseUrl,
    actualKey: supabaseKey?.substring(0, 20) + '...'
  });
  
  console.log('All process.env:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: () => undefined,
      set: () => {},
      remove: () => {}
    }
  });

  const path = `${folder}/${randomUUID()}.${file.type.split('/')[1]}`;
  console.log('Uploading to path:', path);

  const { error, data } = await supabase.storage
    .from('licenses-private')
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type
    });

  console.log('Upload result:', { error, data });

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }
  
  return path; // stored path in bucket
}
