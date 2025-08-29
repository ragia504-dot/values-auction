// src/App.js
import React, { useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [item, setItem] = useState("");
  const [points, setPoints] = useState(100);

  // Tambah pemain baru
  const addPlayer = () => {
    if (!name || !age) return;
    const newPlayer = {
      id: Date.now(),
      name,
      age,
      points: 100,
      purchases: []
    };
    setPlayers([...players, newPlayer]);
    setName("");
    setAge("");
  };

  // Beli item
  const buyItem = (id) => {
    if (!item) return;

    setPlayers(
      players.map((p) => {
        if (p.id === id) {
          if (p.points >= points) {
            return {
              ...p,
              points: p.points - points,
              purchases: [...p.purchases, { item, cost: points }]
            };
          } else {
            alert("Poin tidak cukup!");
          }
        }
        return p;
      })
    );
    setItem("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🎯 Life & Career Game</h1>

      <h2>Tambah Pemain</h2>
      <input
        type="text"
        placeholder="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Umur"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={addPlayer}>+ Tambah Pemain</button>

      <hr />

      <h2>Daftar Pemain</h2>
      {players.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{p.name} ({p.age} th)</h3>
          <p>Poin: {p.points}</p>

          <input
            type="text"
            placeholder="Beli item..."
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <input
            type="number"
            placeholder="Harga"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
          <button onClick={() => buyItem(p.id)}>Beli</button>

          <ul>
            {p.purchases.map((purchase, i) => (
              <li key={i}>
                {purchase.item} - {purchase.cost} poin
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
