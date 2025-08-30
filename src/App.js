// App.js
import React, { useState, useEffect } from "react";
import { simpanPeserta, ambilPeserta, updatePeserta, hapusPeserta } from "./db";

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedValue, setSelectedValue] = useState("Keluarga");
  const [point, setPoint] = useState(0);

  const values = ["Keluarga", "Kesehatan", "Uang", "Kebebasan", "Karier", "Petualangan", "Kreativitas"];
  // Ambil data realtime
  useEffect(() => {
    ambilPeserta((list) => setPlayers(list));
  }, []);

  const addPlayer = () => {
    if (!name || !age) return;
     simpanPeserta({ name, coins })
    const newPlayer = {
      id: Date.now(),
      name,
      age,
      coins: 100,
      allocations: values.reduce((acc, v) => ({ ...acc, [v]: 0 }), {}),
    };
    setPlayers([...players, newPlayer]);
    setName("");
    setAge("");
  };

  // Alokasi poin
  const allocatePoints = () => {
    if (!selectedPlayer || point <= 0) return;
    setPlayers(players.map(p => {
      if (p.id === selectedPlayer) {
        if (p.coins >= point) {
          return {
            ...p,
            coins: p.coins - point,
            allocations: {
              ...p.allocations,
              [selectedValue]: p.allocations[selectedValue] + point
            }
          };
        }
      }
      return p;
    }));
    setPoint(0);
  };
  return (
    <div style={{ padding: 20 }}>
      <h1>Realtime Lelang Nilai Hidup</h1>
      <input
        placeholder="Nama Player"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Coins"
        value={coins}
        onChange={(e) => setCoins(Number(e.target.value))}
      />
      <button onClick={addPlayer}>Tambah Player</button>

      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.coins} coins
            <button onClick={() => updateCoins(player.id, player.coins + 10)}>+10</button>
            <button onClick={() => updateCoins(player.id, player.coins - 10)}>-10</button>
            <button onClick={() => deletePlayer(player.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
