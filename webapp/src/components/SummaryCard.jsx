import React, { useState, useMemo } from "react";
import { Bookmark, Share2, ExternalLink, Clock, Check, User } from "lucide-react";

const SummaryCard = ({ 
  title, 
  summary, 
  url, 
  createdAt, 
  authorName, 
  tags = [], 
  readTime 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Memoize computed values
  const { displaySummary, shouldTruncate } = useMemo(() => {
    const truncateLength = 200;
    const shouldTruncate = summary.length > truncateLength;
    const displaySummary = shouldTruncate && !isExpanded 
      ? `${summary.slice(0, truncateLength)}...` 
      : summary;
      
    return { displaySummary, shouldTruncate };
  }, [summary, isExpanded]);

  // Memoize formatted date
  const formattedDate = useMemo(() => {
    if (!createdAt) return null;
    
    const date = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }, [createdAt]);

  // Memoize domain extraction
  const domain = useMemo(() => {
    if (!url) return 'External Link';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'External Link';
    }
  }, [url]);

  return (
    <article className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30">
      {/* Header with title and metadata */}
      <header className="mb-4">
        <h2 className="text-xl font-bold text-white mb-3">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          {authorName && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-300">{authorName}</span>
            </div>
          )}
          
          {formattedDate && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          )}
          
          {readTime && (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          )}
          
          <div className="ml-auto px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-400 border border-gray-700">
            {domain}
          </div>
        </div>
      </header>

      {/* Summary content */}
      <div className="mb-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mt-1">
            <Bookmark className="w-4 h-4 text-white" />
          </div>
          
          <div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {displaySummary}
            </p>
            
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-md"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Read Original</span>
        </a>
        
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};

// Compact version remains the same
export const CompactSummaryCard = ({ title, summary, url, createdAt, authorName }) => {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
        <Bookmark className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-sm mb-1 truncate">{title}</h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
          {summary.length > 100 ? `${summary.slice(0, 100)}...` : summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {authorName && `${authorName} • `}
            {createdAt && new Date(createdAt).toLocaleDateString()}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs font-medium"
          >
            Read →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;