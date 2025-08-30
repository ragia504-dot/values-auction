// src/App.js
import React, { useState } from "react";

function App() {
  const [players, setPlayers] = useState({}); // simpan data pemain
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const addPlayer = () => {
    if (!name || !age) return;

    setPlayers((prev) => ({
      ...prev,
      [name]: {
        age,
        coins: 100,
        values: [],
      },
    }));

    setName("");
    setAge("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎮 Values Auction Game</h1>

      <div>
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
      </div>

      <h2>Daftar Pemain</h2>
      {Object.keys(players || {}).length === 0 && <p>Belum ada pemain.</p>}

      {Object.keys(players || {}).map((playerName) => (
        <div key={playerName} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>
            {playerName} (umur {players[playerName]?.age}) – {players[playerName]?.coins ?? 0} koin
          </h3>
          <p>Barang yang dibeli:</p>
          <ul>
            {(players[playerName]?.values || []).map((value, i) => (
              <li key={i}>{value}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
