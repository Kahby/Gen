import { useEffect, useState } from 'react';
import { Shield, Download, UploadCloud } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import API_BASE_URL from '../config/api';

const CATEGORY_OPTIONS = [
  { value: 'meme', label: 'Meme Generation' },
  { value: 'art', label: 'AI Visual Art' },
  { value: 'storytelling', label: 'AI Digital Storytelling' },
  { value: 'song', label: 'AI Song Factory' },
  { value: 'poetry', label: 'AI-Generated Poetry' }
];

const AdminPanelPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leaderboardCategory, setLeaderboardCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [leaderboardFile, setLeaderboardFile] = useState(null);
  const [isUploadingLeaderboard, setIsUploadingLeaderboard] = useState(false);
  const [categoryVisibility, setCategoryVisibility] = useState({});
  const [categoryHasData, setCategoryHasData] = useState({});
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminAccessToken');
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchVisibilityStatus = async (category) => {
    setVisibilityLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard/${category}`);
      if (response.ok) {
        const data = await response.json();
        setCategoryVisibility((prev) => ({
          ...prev,
          [category]: Boolean(data.isVisible)
        }));
        setCategoryHasData((prev) => ({
          ...prev,
          [category]: Boolean(data.hasEntries)
        }));
      }
    } catch (error) {
      console.error('Error fetching leaderboard visibility:', error);
    } finally {
      setVisibilityLoading(false);
    }
  };

  useEffect(() => {
    fetchVisibilityStatus(leaderboardCategory);
  }, [leaderboardCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus({ type: '', message: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Admin authentication failed');
      }

      const data = await response.json();
      setAdminToken(data.token);
      sessionStorage.setItem('adminAccessToken', data.token);
      setIsAuthenticated(true);
      setStatus({ type: 'success', message: 'Admin access granted.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to authenticate as admin.'
      });
      setAdminToken('');
      sessionStorage.removeItem('adminAccessToken');
      setIsAuthenticated(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!adminToken) {
      setStatus({ type: 'error', message: 'Missing admin session. Please log in again.' });
      return;
    }

    setStatus({ type: '', message: '' });
    try {
      const response = await fetch(`${API_BASE_URL}/api/export-submissions`, {
        method: 'GET',
        headers: { 'x-admin-token': adminToken }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to download Excel file');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'submissions_export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setStatus({ type: 'success', message: 'Excel download started.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to download Excel file.'
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAccessToken');
    setAdminToken('');
    setIsAuthenticated(false);
    setFormData({ email: '', password: '' });
    setStatus({ type: 'success', message: 'Admin session cleared.' });
  };

  const handleLeaderboardUpload = async (e) => {
    e.preventDefault();
    if (!leaderboardFile) {
      setStatus({ type: 'error', message: 'Please select an Excel file before uploading.' });
      return;
    }
    setIsUploadingLeaderboard(true);
    setStatus({ type: '', message: '' });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('category', leaderboardCategory);
      uploadFormData.append('leaderboard', leaderboardFile);

      const response = await fetch(`${API_BASE_URL}/api/admin/leaderboard/upload`, {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
        body: uploadFormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload leaderboard');
      }

      const data = await response.json();
      setStatus({
        type: 'success',
        message: `Leaderboard uploaded for ${
          CATEGORY_OPTIONS.find((c) => c.value === leaderboardCategory)?.label
        } (${data.totalEntries} entries).`
      });
      setLeaderboardFile(null);
      e.target.reset();
      fetchVisibilityStatus(leaderboardCategory);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to upload leaderboard.'
      });
    } finally {
      setIsUploadingLeaderboard(false);
    }
  };

  const handleVisibilityChange = async (visible) => {
    if (!adminToken) {
      setStatus({ type: 'error', message: 'Missing admin session. Please log in again.' });
      return;
    }

    setIsUpdatingVisibility(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/leaderboard/visibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          category: leaderboardCategory,
          visible
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update visibility');
      }

      setCategoryVisibility((prev) => ({
        ...prev,
        [leaderboardCategory]: Boolean(data.isVisible)
      }));

      setStatus({
        type: 'success',
        message: data.message || (visible ? 'Leaderboard is now visible.' : 'Leaderboard hidden.')
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to update leaderboard visibility.'
      });
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleResetLeaderboard = async () => {
    if (!adminToken) {
      setStatus({ type: 'error', message: 'Missing admin session. Please log in again.' });
      return;
    }

    if (!categoryHasData[leaderboardCategory]) {
      setStatus({ type: 'error', message: 'No uploaded leaderboard to reset for this category.' });
      return;
    }

    setIsResetting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/leaderboard/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ category: leaderboardCategory })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset leaderboard');
      }

      setStatus({ type: 'success', message: data.message || 'Leaderboard reset successfully.' });
      fetchVisibilityStatus(leaderboardCategory);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to reset leaderboard.'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-gray-900 border border-yellow-500 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl font-bold text-white text-center">Admin Panel</h1>
            </div>
            <p className="text-gray-400 text-center mb-8 text-sm">
              Restricted area. Only authorized Prompt Masters administrators can continue.
            </p>

            {status.message && (
              <div
                className={`mb-6 rounded-lg p-4 text-sm ${
                  status.type === 'success'
                    ? 'bg-green-900 text-green-200 border border-green-600'
                    : 'bg-red-900 text-red-200 border border-red-600'
                }`}
              >
                {status.message}
              </div>
            )}

            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-white mb-2 text-sm uppercase tracking-wide">Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 text-sm uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Authenticating...' : 'Access Admin Panel'}
                </PrimaryButton>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="text-center text-white">
                  <p className="text-lg font-semibold">Welcome, Admin</p>
                  <p className="text-sm text-gray-400">
                    Manage submissions export and upload leaderboard sheets by category.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center">Download Submissions</h3>
                  <PrimaryButton onClick={handleDownload} className="w-full flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Submissions Excel
                  </PrimaryButton>
                </div>

                <div className="border border-gray-800 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <UploadCloud className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold">Upload Category Leaderboard</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Upload an Excel file (columns: Rank, Team Name, Score, Notes) to refresh the leaderboard for a category.
                  </p>
                  <form className="space-y-4" onSubmit={handleLeaderboardUpload}>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm uppercase tracking-wide">Select Category</label>
                      <select
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                        value={leaderboardCategory}
                        onChange={(e) => setLeaderboardCategory(e.target.value)}
                        required
                      >
                        {CATEGORY_OPTIONS.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm uppercase tracking-wide">Upload Excel</label>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="w-full bg-gray-800 border border-dashed border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                        onChange={(e) => setLeaderboardFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                    <PrimaryButton type="submit" className="w-full" disabled={isUploadingLeaderboard}>
                      {isUploadingLeaderboard ? 'Uploading...' : 'Upload Leaderboard'}
                    </PrimaryButton>
                  </form>
                  <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-white font-semibold">Visibility Controls</p>
                        <p className="text-sm text-gray-400">
                          Status:{' '}
                          <span className={categoryVisibility[leaderboardCategory] ? 'text-green-400' : 'text-red-400'}>
                            {visibilityLoading
                              ? 'Checking...'
                              : categoryVisibility[leaderboardCategory]
                              ? 'Visible to participants'
                              : 'Hidden from participants'}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <PrimaryButton
                          type="button"
                          disabled={isUpdatingVisibility || visibilityLoading || !categoryHasData[leaderboardCategory]}
                          onClick={() => handleVisibilityChange(true)}
                          className="flex items-center justify-center gap-2"
                        >
                          Make Leaderboard Visible
                        </PrimaryButton>
                        <SecondaryButton
                          onClick={() => handleVisibilityChange(false)}
                          className="text-sm px-4 py-2"
                          type="button"
                          disabled={isUpdatingVisibility || visibilityLoading}
                        >
                          Hide
                        </SecondaryButton>
                        <SecondaryButton
                          onClick={handleResetLeaderboard}
                          className="text-sm px-4 py-2 text-red-300 border-red-500 hover:text-white hover:border-red-400"
                          type="button"
                          disabled={isResetting || !categoryHasData[leaderboardCategory]}
                        >
                          {isResetting ? 'Resetting...' : 'Reset Uploaded File'}
                        </SecondaryButton>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Reset removes the uploaded Excel file and clears leaderboard data for this category.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-sm text-gray-400 hover:text-yellow-400 transition-colors underline"
                >
                  Log out of admin panel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminPanelPage;

