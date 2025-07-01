import React, { useState } from "react";

const FollowButton = ({ userId, isFollowingInitial, token, onAuthRequired }) => {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);

    try {
      let authToken = token;

      // If no token and in extension context, check chrome.storage
      if (!authToken && typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get(["token"]);
        authToken = result.token;
      }

      if (!authToken) {
        if (onAuthRequired) {
          onAuthRequired();
        } else {
          alert("Please login to follow users.");
        }
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3000/api/follow/${userId}`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      });

      const data = await res.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
      } else {
        console.error("Follow error:", data.error);
        alert(data.error || "Could not update follow status.");
      }
    } catch (err) {
      console.error("Follow error:", err);
      alert("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`group relative px-6 py-2.5 rounded-full font-semibold text-sm
        transition-all duration-200 transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none
        ${isFollowing
          ? `bg-gray-700 text-gray-300 border border-gray-600 
             hover:bg-red-500 hover:text-white hover:border-red-500
             focus:ring-red-500`
          : `bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-500
             hover:from-blue-600 hover:to-blue-700 hover:border-blue-600 hover:shadow-lg
             focus:ring-blue-500`
        }`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <span className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {isFollowing ? (
          <>
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="group-hover:hidden">Following</span>
            <span className="hidden group-hover:inline">Unfollow</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Follow</span>
          </>
        )}
      </span>
    </button>
  );
};

export const FollowButtonWithUser = ({ user, token, onAuthRequired }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <span className="text-white font-semibold text-sm">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{user.name || 'Unknown User'}</p>
        <p className="text-gray-400 text-sm truncate">@{user.username || 'username'}</p>
      </div>

      <FollowButton
        userId={user.id}
        isFollowingInitial={user.isFollowing || false}
        token={token}
        onAuthRequired={onAuthRequired}
      />
    </div>
  );
};

export default FollowButton;
