import { useEffect, useState } from 'react';

export default function Dashboard({ token }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/items', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">📚 Your Summarized Articles</h2>
        {items.length === 0 ? (
          <p className="text-center text-gray-400">You haven’t summarized anything yet.</p>
        ) : (
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-blue-400 font-semibold underline break-words"
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
