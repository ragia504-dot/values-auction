// App.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [coins, setCoins] = useState(100);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [point, setPoint] = useState(0);
  const [selectedValue, setSelectedValue] = useState("value1");

  // 🔹 Tambah pemain baru
  const addPlayer = async () => {
    if (!name) return;
    await addDoc(collection(db, "players"), {
      name,
      coins,
      allocations: { value1: 0, value2: 0, value3: 0 }
    });
    setName("");
  };

  // 🔹 Alokasikan poin
  const allocatePoints = async () => {
    if (!selectedPlayer || point <= 0) return;

    const playerRef = doc(db, "players", selectedPlayer);
    const player = players.find(p => p.id === selectedPlayer);
    if (!player || player.coins < point) return;

    const updatedData = {
      coins: player.coins - point,
      allocations: {
        ...player.allocations,
        [selectedValue]: player.allocations[selectedValue] + point,
      },
    };

    try {
      await updateDoc(playerRef, updatedData);
      setPoint(0);
    } catch (e) {
      console.error("Error updating allocation: ", e);
    }
  };

  // 🔹 Ambil data realtime dari Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "players"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(list);
    });

    return () => unsub(); // cleanup listener pas komponen unmount
  }, []);

  return (
    <div>
      <h1>Values Auction</h1>

      {/* Tambah Player */}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nama player"
      />
      <button onClick={addPlayer}>Tambah Player</button>

      {/* List Player */}
      <h2>Daftar Player</h2>
      <ul>
        {players.map(p => (
          <li key={p.id}>
            {p.name} - Coins: {p.coins}
          </li>
        ))}
      </ul>

      {/* Alokasikan Poin */}
      <h2>Alokasikan Poin</h2>
      <select onChange={e => setSelectedPlayer(e.target.value)}>
        <option value="">Pilih Player</option>
        {players.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select onChange={e => setSelectedValue(e.target.value)}>
        <option value="value1">Value 1</option>
        <option value="value2">Value 2</option>
        <option value="value3">Value 3</option>
      </select>

      <input
        type="number"
        value={point}
        onChange={e => setPoint(Number(e.target.value))}
        placeholder="Jumlah poin"
      />
      <button onClick={allocatePoints}>Alokasikan</button>
    </div>
  );
}

export default App;
