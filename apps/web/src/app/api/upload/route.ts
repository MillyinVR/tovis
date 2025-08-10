import { NextRequest, NextResponse } from 'next/server';
import { uploadToPrivateBucket } from '@tovis/util/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'licenses';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Server-side upload for:', file.name);
    const path = await uploadToPrivateBucket(file, folder);
    
    return NextResponse.json({ path });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
