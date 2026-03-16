import React from 'react';

export default function UsersTable({ users }) {
  if (!users.length) {
    return <div className="text-sm text-deep/70">No users found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-beige/60 bg-cream shadow-soft">
      <table className="min-w-full text-sm">
        <thead className="bg-beige/40 text-deep/70">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-beige/40 hover:bg-beige/20">
              <td className="px-4 py-3 font-medium text-deep">{u.name}</td>
              <td className="px-4 py-3 text-deep/80">{u.email}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-beige/40 px-3 py-1 text-xs uppercase tracking-wide text-deep/80">
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3 text-deep/70">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

