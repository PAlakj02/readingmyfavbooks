import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Calendar, ExternalLink } from "lucide-react";
import FollowButton from "../components/FollowButton";

export default function Feed({ token }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/feed");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Global Feed</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No posts found</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg p-6">
              {/* User info with follow button */}
              <div className="flex justify-between items-start mb-4">
                <Link 
                  to={`/profile/${post.user.id}`} 
                  className="flex items-center space-x-3 hover:opacity-80"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{post.user.name}</p>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
                
                {token && (
                  <FollowButton 
                    userId={post.user.id} 
                    isFollowingInitial={post.user.isFollowing} 
                    token={token}
                  />
                )}
              </div>

              {/* Post content */}
              <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
              <p className="text-gray-300 mb-4">{post.summary}</p>
              
              {post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Original
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}