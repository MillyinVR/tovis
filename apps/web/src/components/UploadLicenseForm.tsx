'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadToPrivateBucket } from '@tovis/util/upload';
import { api } from '~/trpc/react';

const formSchema = z.object({
  stateCode: z.string().length(2, '2-letter state code'),
  licenseNumber: z.string().min(3),
  issuedDate: z.string(),
  expiresDate: z.string(),
  front: z.instanceof(File),
  back: z.instanceof(File).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadLicenseForm() {
  const { mutateAsync } = api.license.create.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(formSchema) });
  const [done, setDone] = useState(false);

  const onSubmit = async (data: FormValues) => {
    // 1) upload files
    const frontPath = await uploadToPrivateBucket(data.front, 'licenses');
    const backPath = data.back ? await uploadToPrivateBucket(data.back, 'licenses') : undefined;

    // 2) call tRPC
    await mutateAsync({
      stateCode: data.stateCode.toUpperCase(),
      licenseNumber: data.licenseNumber,
      issuedDate: data.issuedDate,
      expiresDate: data.expiresDate,
      frontImagePath: frontPath,
      backImagePath: backPath
    });
    setDone(true);
  };

  if (done) return <p className="text-green-600">License submitted for review!</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input placeholder="CA" {...register('stateCode')} />
      {errors.stateCode && <span>{errors.stateCode.message}</span>}

      <input placeholder="License #"
        {...register('licenseNumber')} />
      {errors.licenseNumber && <span>{errors.licenseNumber.message}</span>}

      <label>Issued date</label>
      <input type="date" {...register('issuedDate')} />
      <label>Expires date</label>
      <input type="date" {...register('expiresDate')} />

      <label>Front photo</label>
      <input type="file" accept="image/*" {...register('front')} />
      <label>Back photo (optional)</label>
      <input type="file" accept="image/*" {...register('back')} />

      <button disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Uploading…' : 'Submit'}
      </button>
    </form>
  );
}
