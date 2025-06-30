import React from "react";

const SummaryCard = ({ title, summary, url, createdAt, authorName }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {createdAt && (
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {authorName && (
        <p className="text-sm text-gray-600 mb-1">
          👤 <span className="font-medium">{authorName}</span>
        </p>
      )}

      <p className="text-sm text-gray-800 whitespace-pre-wrap mb-3">
        {summary.length > 300 ? summary.slice(0, 300) + "..." : summary}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm hover:underline"
      >
        🔗 View Original
      </a>
    </div>
  );
};

export default SummaryCard;
