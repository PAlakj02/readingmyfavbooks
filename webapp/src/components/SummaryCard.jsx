import React, { useState } from "react";

const SummaryCard = ({ title, summary, url, createdAt, authorName, tags, readTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const shouldTruncate = summary.length > 200;
  const displaySummary = shouldTruncate && !isExpanded 
    ? summary.slice(0, 200) + "..." 
    : summary;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'External Link';
    }
  };

  return (
    <article 
      className="group relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 
                 border border-gray-700/50 rounded-2xl p-6 text-white 
                 shadow-xl hover:shadow-2xl transition-all duration-300 
                 hover:border-blue-500/30 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 
                      rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                         bg-clip-text text-transparent leading-tight mb-2 
                         group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
            {title}
          </h2>
          
          {/* Meta info */}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            {authorName && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full 
                               flex items-center justify-center text-xs font-semibold text-white">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-300">{authorName}</span>
              </div>
            )}
            
            {createdAt && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{formatDate(createdAt)}</span>
              </div>
            )}
            
            {readTime && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readTime} min read</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Source domain badge */}
        <div className="flex-shrink-0 px-3 py-1 bg-gray-800/50 rounded-full text-xs font-medium text-gray-400 border border-gray-700">
          {extractDomain(url)}
        </div>
      </header>

      {/* Summary content */}
      <div className="relative z-10 mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 
                         rounded-lg flex items-center justify-center mt-1">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm0 2a1 1 0 000 2h3a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex-1">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {displaySummary}
            </p>
            
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium 
                          transition-colors duration-200 focus:outline-none focus:underline"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-800/70 text-gray-300 text-xs 
                                       rounded-full border border-gray-600/50 
                                       hover:bg-gray-700/70 transition-colors duration-200">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer actions */}
      <footer className="relative z-10 flex items-center justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex items-center space-x-2 px-4 py-2 
                     bg-gradient-to-r from-blue-500 to-blue-600 
                     hover:from-blue-600 hover:to-blue-700 
                     text-white text-sm font-medium rounded-lg 
                     transition-all duration-200 hover:shadow-lg hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <svg className="w-4 h-4 transition-transform group-hover/link:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Read Original</span>
        </a>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 
                           rounded-lg transition-all duration-200 group/save">
            <svg className="w-5 h-5 transition-transform group-hover/save:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 
                           rounded-lg transition-all duration-200 group/share">
            <svg className="w-5 h-5 transition-transform group-hover/share:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </footer>
    </article>
  );
};

// Compact version for lists
export const CompactSummaryCard = ({ title, summary, url, createdAt, authorName }) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 
                    hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-200">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 
                     rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm0 2a1 1 0 000 2h3a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-sm mb-1 truncate">{title}</h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
          {summary.length > 100 ? summary.slice(0, 100) + "..." : summary}
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