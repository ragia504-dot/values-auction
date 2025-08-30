// App.js
import React, { useState, useEffect } from "react";
import { simpanPeserta, ambilPeserta, updatePeserta, hapusPeserta } from "./db";

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [coins, setCoins] = useState(100);

  // Ambil data realtime
  useEffect(() => {
    ambilPeserta((list) => setPlayers(list));
  }, []);

  // Tambah peserta
  const addPlayer = () => {
    if (!name) return;
    simpanPeserta({ name, coins })
      .then(() => {
        setName("");
        setCoins(100);
      })
      .catch((err) => console.error(err));
  };

  // Update coins peserta
  const updateCoins = (id, newCoins) => {
    updatePeserta(id, { coins: newCoins }).catch((err) => console.error(err));
  };

  // Hapus peserta
  const deletePlayer = (id) => {
    hapusPeserta(id).catch((err) => console.error(err));
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
