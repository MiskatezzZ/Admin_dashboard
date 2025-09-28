"use client";
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useAuthContext } from '../providers/AuthProvider';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthContext();

  const displayName = useMemo(() => user?.displayName || (user?.email ? user.email.split('@')[0] : 'Admin'), [user]);
  const email = user?.email ?? '';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const onUpdatePassword = async () => {
    setStatus('');
    if (!user || !user.email) {
      setStatus('You must be signed in to update password.');
      return;
    }
    if (!currentPassword || !newPassword) {
      setStatus('Enter your current and new password.');
      return;
    }
    if (newPassword.length < 6) {
      setStatus('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus('New password and confirm password do not match.');
      return;
    }
    try {
      setSaving(true);
      // Reauthenticate the user for sensitive operation
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatus('Password updated successfully.');
    } catch (e) {
      console.error('[PROFILE] update password error', e);
      const msg = e?.code === 'auth/wrong-password'
        ? 'Current password is incorrect.'
        : e?.message || 'Failed to update password.';
      setStatus(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">View your account details and update your password.</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input value={displayName} disabled className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input value={email} disabled className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Update Password</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none" placeholder="Current password" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none" placeholder="New password (min 6 chars)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none" placeholder="Confirm new password" />
          </div>
        </div>
        {status && <p className="text-sm text-blue-600">{status}</p>}
        <div className="flex gap-3">
          <button onClick={onUpdatePassword} disabled={saving} className={`rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold ${saving ? 'opacity-70' : ''}`}>
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
