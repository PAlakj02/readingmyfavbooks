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

  if (loading) return <p className="text-center text-gray-300 mt-10">Loading feed...</p>;
  if (!items.length) return <p className="text-center text-gray-400 mt-10">No summaries from followed users yet.</p>;

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">📢 Your Personalized Feed</h2>
        <ul className="space-y-6">
          {items.map((item) => (
            <li key={item.id} className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-800">
              <div className="text-sm text-gray-400 mb-2">Shared by: <span className="font-medium text-blue-400">{item.user.name}</span></div>
              <div className="text-xl font-semibold mb-1">📌 {item.title}</div>
              <a
                href={item.url}
                className="text-sm text-blue-500 underline break-words"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 {item.url}
              </a>
              <p className="mt-3 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                🧠 {item.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
