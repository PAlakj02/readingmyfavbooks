import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Search, ArrowRight } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import CompactSummaryCard from '../components/SummaryCard';

export default function Dashboard({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToFeed = () => navigate('/feed');

  const filteredAndSortedItems = items
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const recentItems = items.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                            bg-clip-text text-transparent mb-2">
                Your Dashboard
              </h1>
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Bookmark className="w-5 h-5 text-blue-400" />
                  <span>{items.length} Saved</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>{recentItems.length} Recent</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search your library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Recent Activity Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recently Added
            </h2>
            <button 
              onClick={navigateToFeed}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentItems.map(item => (
                <CompactSummaryCard
                  key={item.id}
                  title={item.title}
                  summary={item.summary}
                  url={item.url}
                  createdAt={item.createdAt}
                  authorName={item.authorName}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
              <p className="text-gray-400 mb-4">No recent activity yet</p>
              <button
                onClick={navigateToFeed}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
              >
                Discover Summaries
              </button>
            </div>
          )}
        </section>

        {/* Full Library Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Your Library</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          {filteredAndSortedItems.length > 0 ? (
            <div className="space-y-6">
              {filteredAndSortedItems.map((item) => (
                <SummaryCard
                  key={item.id}
                  title={item.title}
                  summary={item.summary}
                  url={item.url}
                  createdAt={item.createdAt}
                  authorName={item.authorName}
                  tags={item.tags}
                  readTime={item.readTime}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
              <p className="text-gray-400">
                {searchTerm 
                  ? `No results for "${searchTerm}"`
                  : 'Your library is empty'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}