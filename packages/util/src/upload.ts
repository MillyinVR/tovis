import { createServerClient } from '@supabase/ssr';
import { randomUUID } from 'crypto';

export async function uploadToPrivateBucket(file: File, folder = 'licenses') {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const path = `${folder}/${randomUUID()}.${file.type.split('/')[1]}`;
  const { error } = await supabase.storage
    .from('licenses-private')
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type
    });

  if (error) throw error;
  return path; // stored path in bucket
}
