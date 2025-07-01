import React, { useState } from "react";
import { Check, Plus, Loader2 } from "lucide-react";

const FollowButton = ({ userId, isFollowingInitial, token, onAuthRequired }) => {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFollowToggle = async () => {
    setLoading(true);
    setError(null);

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
          setError("Please login to follow users");
        }
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3000/api/follow/${userId}`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not update follow status");
      }

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow error:", err);
      setError(err.message || "Network error. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleFollowToggle}
        disabled={loading}
        className={`group relative px-5 py-2 rounded-full font-semibold text-sm
          transition-all duration-200 hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
          disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100
          ${
            isFollowing
              ? `bg-gray-700 text-gray-300 border border-gray-600 
                 hover:bg-red-500/90 hover:text-white hover:border-red-500
                 focus:ring-red-500`
              : `bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-500
                 hover:from-blue-600 hover:to-blue-700 hover:border-blue-600 hover:shadow-md
                 focus:ring-blue-500`
          }`}
        aria-label={isFollowing ? "Unfollow user" : "Follow user"}
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isFollowing ? (
            <>
              <Check className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="group-hover:hidden">Following</span>
              <span className="hidden group-hover:inline">Unfollow</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Follow</span>
            </>
          )}
        </div>
      </button>

      {error && (
        <div className="absolute top-full mt-2 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export const FollowButtonWithUser = ({ user, token, onAuthRequired }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {user.name?.charAt(0).toUpperCase() || 'U'}
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