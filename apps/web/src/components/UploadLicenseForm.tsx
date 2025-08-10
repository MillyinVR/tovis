'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadToPrivateBucket } from '@tovis/util/upload';
import { api } from '~/trpc/react';

const formSchema = z.object({
  stateCode: z.string().min(1, 'State code required'),
  licenseNumber: z.string().min(1, 'License number required'),
  issuedDate: z.string().min(1, 'Issue date required'),
  expiresDate: z.string().min(1, 'Expiry date required'),
  front: z.any(),
  back: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadLicenseForm() {
  const mutation = api.license.create.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(formSchema) });
  const [done, setDone] = useState(false);

  const onSubmit = async (rawData: unknown) => {
    console.log('Form submitted with data:', rawData);
    
    try {
      const data = rawData as FormValues;
      
      // Check if files are present
      console.log('Front file:', data.front);
      console.log('Back file:', data.back);
      
      // Get the actual File objects from the FileList
      const frontFile = data.front?.[0] || data.front;
      const backFile = data.back?.[0] || data.back;
      
      console.log('Processed files:', { frontFile, backFile });
      
      if (!frontFile) {
        alert('Please select a front photo');
        return;
      }
      
      // 1) Upload files via server API
      console.log('Starting file upload via API...');
      
      const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'licenses');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }
        
        const result = await response.json();
        return result.path;
      };
      
      const frontPath = await uploadFile(frontFile);
      const backPath = backFile ? await uploadFile(backFile) : undefined;
      
      console.log('Files uploaded:', { frontPath, backPath });

      // 2) Call tRPC to create license
      console.log('Creating license record...');
      await mutation.mutateAsync({
        stateCode: data.stateCode.toUpperCase(),
        licenseNumber: data.licenseNumber,
        issuedDate: data.issuedDate,
        expiresDate: data.expiresDate,
        frontImagePath: frontPath,
        backImagePath: backPath
      });
      
      console.log('License created successfully!');
      setDone(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error submitting license: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const testClick = () => {
    console.log('Test button clicked!');
    alert('Test button works!');
  };

  if (done) return <p className="text-green-600">License submitted for review!</p>;

  return (
    <div className="space-y-4">
      <button onClick={testClick} style={{background: 'red', color: 'white', padding: '10px'}}>
        TEST BUTTON - Click me first
      </button>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input placeholder="CA" {...register('stateCode')} />
          {errors.stateCode && <span style={{color: 'red'}}>{errors.stateCode.message}</span>}
        </div>

        <div>
          <input placeholder="License #" {...register('licenseNumber')} />
          {errors.licenseNumber && <span style={{color: 'red'}}>{errors.licenseNumber.message}</span>}
        </div>

        <div>
          <label>Issued date</label>
          <input type="date" {...register('issuedDate')} />
          {errors.issuedDate && <span style={{color: 'red'}}>{errors.issuedDate.message}</span>}
        </div>
        
        <div>
          <label>Expires date</label>
          <input type="date" {...register('expiresDate')} />
          {errors.expiresDate && <span style={{color: 'red'}}>{errors.expiresDate.message}</span>}
        </div>

        <div>
          <label>Front photo</label>
          <input type="file" accept="image/*" {...register('front')} />
          {errors.front && <span style={{color: 'red'}}>{errors.front.message}</span>}
        </div>
        
        <div>
          <label>Back photo (optional)</label>
          <input type="file" accept="image/*" {...register('back')} />
          {errors.back && <span style={{color: 'red'}}>{errors.back.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          style={{background: 'blue', color: 'white', padding: '10px', border: 'none'}}
        >
          {isSubmitting ? 'Uploading…' : 'Submit License'}
        </button>
      </form>
    </div>
  );
}
