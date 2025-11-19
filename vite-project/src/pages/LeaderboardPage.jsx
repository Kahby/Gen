import { useEffect, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import API_BASE_URL from '../config/api';

const CATEGORY_OPTIONS = [
  { value: 'meme', label: 'Meme Generation' },
  { value: 'art', label: 'AI Visual Art' },
  { value: 'storytelling', label: 'AI Digital Storytelling' },
  { value: 'song', label: 'AI Song Factory' },
  { value: 'poetry', label: 'AI-Generated Poetry' }
];

const LeaderboardPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard/${selectedCategory}`);
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to fetch leaderboard');
        }
        const data = await response.json();
        const visible = Boolean(data.isVisible);
        setIsVisible(visible);
        if (visible) {
          setEntries(data.entries || []);
          setLastUpdated(data.updatedAt);
          setInfoMessage('');
        } else {
          setEntries([]);
          setLastUpdated(null);
          setInfoMessage(data.message || 'Leaderboard not yet published for this category.');
        }
      } catch (err) {
        setError(err.message || 'Unable to load leaderboard');
        setEntries([]);
        setLastUpdated(null);
        setIsVisible(false);
        setInfoMessage('');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedCategory]);

  return (
    <PageWrapper>
      <div className="pt-24 pb-12 px-4 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-yellow-400 mb-3">Leaderboard</h1>
            <p className="text-gray-300">
              Select a category to view the uploaded rankings. Leaderboard data is managed by the organizing team.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'text-white border-gray-700 hover:border-yellow-400'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-semibold text-white">
                {CATEGORY_OPTIONS.find((c) => c.value === selectedCategory)?.label}
              </h2>
              {lastUpdated && isVisible && (
                <p className="text-sm text-gray-400">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-400">Loading leaderboard...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">{error}</div>
            ) : !isVisible ? (
              <div className="p-6 text-center text-gray-400">
                {infoMessage || 'This leaderboard is not yet visible. Please check back later.'}
              </div>
            ) : entries.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No leaderboard data uploaded yet for this category.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead className="bg-gray-800 text-sm uppercase text-gray-400">
                    <tr>
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">Team Name</th>
                      <th className="px-6 py-3">Score</th>
                      <th className="px-6 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={`${entry.teamName}-${entry.rank}`} className="border-t border-gray-800">
                        <td className="px-6 py-3">{entry.rank}</td>
                        <td className="px-6 py-3">{entry.teamName}</td>
                        <td className="px-6 py-3">{entry.score}</td>
                        <td className="px-6 py-3 text-gray-300">{entry.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LeaderboardPage;

