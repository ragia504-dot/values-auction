// App.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // pastikan ini sudah import Realtime DB
import { ref, set, onValue, update } from "firebase/database";

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [coins, setCoins] = useState(100);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const playersRef = ref(db, "players");

  // Ambil data realtime
  useEffect(() => {
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedPlayers = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPlayers(parsedPlayers);
      } else {
        setPlayers([]);
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  // Tambah player
  const addPlayer = () => {
    if (!name) return;
    const newPlayerRef = ref(db, `players/${Date.now()}`); // id unik
    set(newPlayerRef, { name, coins })
      .then(() => {
        setName("");
        setCoins(100);
      })
      .catch((error) => console.error(error));
  };

  // Update coins player
  const updateCoins = (id, newCoins) => {
    const playerRef = ref(db, `players/${id}`);
    update(playerRef, { coins: newCoins }).catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Realtime Player App</h1>
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
      <button onClick={addPlayer}>Add Player</button>

      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.coins} coins
            <button onClick={() => updateCoins(player.id, player.coins + 10)}>
              +10
            </button>
            <button onClick={() => updateCoins(player.id, player.coins - 10)}>
              -10
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
