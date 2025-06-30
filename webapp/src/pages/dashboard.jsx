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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Summarized Items</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border p-3 rounded">
            <a href={item.url} className="font-bold text-blue-600">{item.title}</a>
            <p>{item.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
