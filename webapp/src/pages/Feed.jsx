import { useEffect, useState } from "react";
import { fetchWithToken } from "../utils/auth";
import { MessageCircle, ExternalLink, Calendar, User, Sparkles, RefreshCw } from "lucide-react";

export default function Feed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = async () => {
    try {
      setError(null);
      const res = await fetchWithToken("/api/feed");
      if (res.success !== false) {
        setItems(res);
      } else {
        setItems([]);
        setError("Failed to load feed");
      }
    } catch (err) {
      setError("Unable to connect to server");
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFeed();
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-800 rounded-lg w-64 mx-auto"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-900/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                  <div className="h-4 bg-slate-700 rounded w-32"></div>
                </div>
                <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Your Feed
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Discover the latest insights and summaries from people you follow
          </p>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 
                     disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 
                     border border-slate-700 hover:border-slate-600"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-slate-300">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/30 rounded-xl">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !items.length && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No posts yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Your feed is empty. Start following users to see their summaries and insights here.
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 
                       hover:to-blue-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              Check Again
            </button>
          </div>
        )}

        {/* Feed Items */}
        {items.length > 0 && (
          <div className="space-y-6">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 
                         hover:border-slate-700/50 transition-all duration-300 hover:transform hover:scale-[1.02]
                         shadow-lg hover:shadow-xl hover:shadow-purple-500/10"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full 
                                flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate">
                      {item.user?.name || 'Anonymous User'}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-100 leading-tight group-hover:text-white 
                               transition-colors duration-200">
                    {item.title}
                  </h2>

                  {/* URL */}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 
                               transition-colors duration-200 break-all group/link"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover/link:transform group-hover/link:scale-110 
                                             transition-transform duration-200" />
                      <span className="underline decoration-blue-400/30 hover:decoration-blue-400/60 transition-colors">
                        {item.url.length > 60 ? `${item.url.substring(0, 60)}...` : item.url}
                      </span>
                    </a>
                  )}

                  {/* Summary */}
                  {item.summary && (
                    <div className="prose prose-slate prose-invert max-w-none">
                      <div className="bg-slate-800/30 rounded-xl p-4 border-l-4 border-purple-500/50">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg 
                                        flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-300 mb-2">AI Summary</h4>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                              {item.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interaction Bar */}
                <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>#{item.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 
                                 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all duration-200
                                 border border-slate-700/50 hover:border-slate-600"
                      >
                        Read Original
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}