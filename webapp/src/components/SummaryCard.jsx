import React from "react";

const SummaryCard = ({ title, summary, url, createdAt, authorName }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-blue-400 break-words">{title}</h2>
        {createdAt && (
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {authorName && (
        <p className="text-sm text-gray-400 mb-2">
          👤 <span className="font-medium text-white">{authorName}</span>
        </p>
      )}

      <p className="text-sm text-gray-300 whitespace-pre-wrap mb-4 leading-relaxed">
        🧠 {summary.length > 300 ? summary.slice(0, 300) + "..." : summary}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 text-sm underline hover:text-blue-300"
      >
        🔗 View Original Article
      </a>
    </div>
  );
};

export default SummaryCard;
