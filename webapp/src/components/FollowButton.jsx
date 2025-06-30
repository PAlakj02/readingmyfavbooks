import React, { useState } from "react";

const FollowButton = ({ userId, isFollowingInitial }) => {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);

    try {
      const { token } = await chrome.storage.local.get(["token"]);
      if (!token) {
        alert("Please login to follow users.");
        return;
      }

      const res = await fetch(`http://localhost:3000/api/follow/${userId}`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
      } else {
        alert(data.error || "Could not update follow status.");
      }
    } catch (err) {
      console.error("Follow error:", err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-1 rounded-full text-sm font-medium border ${
        isFollowing
          ? "bg-white text-red-500 border-red-500 hover:bg-red-50"
          : "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
      } transition`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
