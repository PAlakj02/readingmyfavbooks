import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user));

    fetch(`http://localhost:3000/api/users/${id}/items`)
      .then((res) => res.json())
      .then(setItems);
  }, [id]);

  if (!user) {
    return <p className="text-center text-gray-300 mt-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-blue-400 mb-2">{user.name}</h2>
          <p className="text-gray-400">📚 Public Reading/Watch List</p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-400">No items shared yet.</p>
        ) : (
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow hover:shadow-lg transition-all"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-blue-500 underline break-words"
                >
                  {item.title}
                </a>
                <p className="mt-3 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  🧠 {item.summary}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
