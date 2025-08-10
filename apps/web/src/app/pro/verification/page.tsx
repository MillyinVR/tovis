import UploadLicenseForm from '@/components/UploadLicenseForm';

export default function VerificationPage() {
  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">License verification</h1>
      <UploadLicenseForm />
    </main>
  );
}
