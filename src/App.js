import { useEffect, useState } from "react";
import {
  simpanPeserta,
  ambilPeserta,
  updatePeserta,
  hapusPeserta,
} from "./db";

const initialValues = [
  "Keluarga",
  "Kesehatan",
  "Uang",
  "Kebebasan",
  "Karier",
  "Petualangan",
  "Pendidikan",
  "Ketenangan",
  "Persahabatan",
  "Kreativitas",
];

export default function ValuesAuctionGame() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedValue, setSelectedValue] = useState(initialValues[0]);
  const [points, setPoints] = useState(0);

  // Ambil data realtime dari Firebase
  useEffect(() => {
    ambilPeserta((list) => setPlayers(list));
  }, []);

  // Tambah peserta baru
  const addPlayer = () => {
    if (name && age) {
      const newPlayer = {
        id: Date.now().toString(),
        name,
        age,
        coins: 100,
        bids: {},
      };
      simpanPeserta(newPlayer);
      setName("");
      setAge("");
      setSelectedPlayer(newPlayer); // 🔥 langsung pilih dirinya sendiri
    }
  };

  // Taruh koin ke nilai
  const placeBid = () => {
    if (!selectedPlayer) return;

    if (points > 0 && points <= selectedPlayer.coins) {
      const updated = {
        ...selectedPlayer,
        coins: selectedPlayer.coins - points,
        bids: {
          ...selectedPlayer.bids,
          [selectedValue]: (selectedPlayer.bids[selectedValue] || 0) + points,
        },
      };
      updatePeserta(updated);
      setSelectedPlayer(updated);
      setPoints(0);
    }
  };

  // Edit/mindahin koin (balikin dulu, baru taruh lagi)
  const editBid = (value) => {
    if (!selectedPlayer || !selectedPlayer.bids[value]) return;

    const refundedPoints = selectedPlayer.bids[value];
    const updated = {
      ...selectedPlayer,
      coins: selectedPlayer.coins + refundedPoints, // balikin koin
    };
    delete updated.bids[value]; // hapus taruhannya

    updatePeserta(updated);
    setSelectedPlayer(updated);

    // otomatis set input form biar bisa pindahin lagi
    setSelectedValue(value);
    setPoints(refundedPoints);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎯 Values Auction Game</h1>

      {/* Tambah pemain */}
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
        <button onClick={addPlayer}>+ Tambah Peserta</button>
      </div>

      {/* Kalau sudah ada peserta terpilih */}
      {selectedPlayer && (
        <div style={{ marginTop: "20px" }}>
          <h2>Pemain: {selectedPlayer.name} ({selectedPlayer.coins} koin tersisa)</h2>

          {/* Taruh koin */}
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {initialValues.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Jumlah koin"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
          />
          <button onClick={placeBid}>Taruh Koin</button>

          {/* Daftar taruhannya */}
          <h3>Taruhan:</h3>
          <ul>
            {Object.entries(selectedPlayer.bids || {}).map(([val, pts]) => (
              <li key={val}>
                {val} : {pts} koin{" "}
                <button onClick={() => editBid(val)}>✏️ Edit</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Daftar semua pemain */}
      <h2>👥 Semua Peserta</h2>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.name} ({p.age} th) - {p.coins} koin
          </li>
        ))}
      </ul>
    </div>
  );
}
