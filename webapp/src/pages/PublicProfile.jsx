import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import FollowButton from '../components/FollowButton';
import SummaryCard from '../components/SummaryCard';

export default function PublicProfile({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch profile data
      const [profileRes, itemsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/users/${id}`),
        fetch(`http://localhost:3000/api/users/${id}/items`)
      ]);

      if (!profileRes.ok || !itemsRes.ok) {
        throw new Error('Failed to load profile data');
      }

      const [profileData, itemsData] = await Promise.all([
        profileRes.json(),
        itemsRes.json()
      ]);

      setProfile(profileData.user);
      setItems(itemsData);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Profile</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            {token && (
              <FollowButton 
                userId={profile.id} 
                isFollowingInitial={profile.isFollowing || false}
                token={token}
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
          <p className="text-gray-400 mb-4">Public Reading List</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {items.length} summaries shared
            </span>
            {profile.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Member since {formatDate(profile.created_at)}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No summaries shared yet
            </h3>
            <p className="text-gray-500">
              {profile.name} hasn't shared any summaries yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <SummaryCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                url={item.url}
                createdAt={item.created_at}
                authorName={profile.name}
                tags={item.tags}
                readTime={item.readTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}