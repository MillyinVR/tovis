declare module 'react-hook-form';
declare module '@hookform/resolvers/zod';

declare module '@tovis/util/upload' {
  export function uploadToPrivateBucket(file: File, folder?: string): Promise<string>;
}

