// src/pages/Feed.jsx
import { useEffect, useState } from "react";
import { fetchWithToken } from "../utils/auth";

export default function Feed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithToken("/api/feed")
      .then((res) => {
        if (res.success !== false) setItems(res);
        else setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading feed...</p>;
  if (!items.length) return <p>No summaries from followed users yet.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📢 Feed</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border rounded-xl p-4 bg-white shadow">
            <p className="text-sm text-gray-600 mb-1">Shared by: {item.user.name}</p>
            <p className="font-semibold">📌 {item.title}</p>
            <a
              href={item.url}
              className="text-blue-500 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 {item.url}
            </a>
            <p className="text-sm mt-2 whitespace-pre-wrap">🧠 {item.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
