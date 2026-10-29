import React, { useEffect, useState } from 'react';
import { AlertCircle, Search, ShieldCheck, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { adminService, AdminUser } from '../../services/adminService';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date));

export const AdminUsersPage: React.FC = () => {
  const { currentUser } = useApp();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') return;

    let active = true;
    setLoading(true);
    setError('');

    adminService.getUsers(page, search)
      .then((result) => {
        if (!active) return;
        setUsers(result.users);
        setTotal(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : 'Unable to load user accounts.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentUser?.role, page, search]);

  if (currentUser?.role !== 'ADMIN') {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-pink-200 bg-white p-8 text-center shadow-soft">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-chocolate-600" />
          <h1 className="font-serif text-2xl font-bold text-chocolate-950">Administrator access required</h1>
          <p className="mt-2 text-sm text-chocolate-600">Sign in with an account that has the ADMIN role to view user accounts.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-chocolate-800">
            <ShieldCheck className="h-4 w-4" /> Admin
          </div>
          <h1 className="font-serif text-3xl font-bold text-chocolate-950 sm:text-4xl">User accounts</h1>
          <p className="mt-2 text-sm text-chocolate-600">View account details and access roles. Passwords and credentials are never shown.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-pink-200 bg-white px-5 py-3 shadow-sm">
          <Users className="h-5 w-5 text-pink-600" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-chocolate-500">Matching accounts</p>
            <p className="text-xl font-bold text-chocolate-950">{total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex max-w-xl items-center gap-3 rounded-2xl border border-pink-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-pink-300">
        <Search className="h-5 w-5 shrink-0 text-chocolate-400" />
        <input
          aria-label="Search users by name or email"
          className="w-full bg-transparent text-sm text-chocolate-950 outline-none placeholder:text-chocolate-400"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>

      {error && (
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-pink-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-cream-50 text-xs uppercase tracking-wide text-chocolate-600">
              <tr>
                <th scope="col" className="px-5 py-4 font-bold">Name</th>
                <th scope="col" className="px-5 py-4 font-bold">Email</th>
                <th scope="col" className="px-5 py-4 font-bold">Role</th>
                <th scope="col" className="px-5 py-4 font-bold">Joined</th>
                <th scope="col" className="px-5 py-4 font-bold">Last profile update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-chocolate-600">Loading accounts…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-chocolate-600">{error ? 'Accounts could not be loaded.' : 'No accounts found.'}</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-pink-50/40">
                  <td className="px-5 py-4 font-semibold text-chocolate-950">{user.name}</td>
                  <td className="px-5 py-4 text-chocolate-700">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.role === 'ADMIN' ? 'bg-chocolate-900 text-white' : 'bg-pink-100 text-chocolate-800'}`}>
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-chocolate-700">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4 text-chocolate-700">{formatDate(user.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-pink-100 px-5 py-4">
          <p className="text-xs text-chocolate-600">Page {page} of {Math.max(totalPages, 1)}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="rounded-xl border border-pink-200 px-4 py-2 text-xs font-bold text-chocolate-800 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={loading || page >= totalPages}
              className="rounded-xl border border-pink-200 px-4 py-2 text-xs font-bold text-chocolate-800 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
