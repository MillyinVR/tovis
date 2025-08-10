"use client";

import { api, type RouterOutputs } from '~/trpc/react';

export default function PendingLicenses() {
  const { data, refetch } = api.license.adminListPending.useQuery();
  const approve = api.license.adminUpdateStatus.useMutation({ onSuccess: () => refetch() });

  if (!data) return <p>Loading…</p>;
  return (
    <table>
      <thead><tr><th>Pro</th><th>State</th><th>#</th><th></th></tr></thead>
      <tbody>
        {data.map((l: RouterOutputs['license']['adminListPending'][number]) => (
          <tr key={l.id}>
            <td>{l.professionalId.slice(0, 8)}</td>
            <td>{l.stateCode}</td>
            <td>{l.licenseNumber}</td>
            <td>
              <button onClick={() => approve.mutate({ licenseId: l.id, status: 'approved' })}>
                Approve
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
