// src/pages/PublicProfile.jsx
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

  return (
    <div className="p-4">
      {user ? (
        <>
          <h2 className="text-xl font-bold">{user.name}'s Profile</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="border rounded p-2">
                <a href={item.url} className="font-medium text-blue-600">{item.title}</a>
                <p>{item.summary}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
