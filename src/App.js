import { useEffect, useState } from "react";
import {
  simpanPeserta,
  ambilPeserta,
  updatePeserta,
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
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(initialValues[0]);
  const [points, setPoints] = useState(0);

  // Ambil data realtime dari Firebase
  useEffect(() => {
    ambilPeserta((list) => setPlayers(list));
  }, []);

  // Cari player yang sedang dipilih
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId) || null;

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
      setSelectedPlayerId(newPlayer.id); // langsung pilih dirinya sendiri
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
          [selectedValue]: (selectedPlayer.bids?.[selectedValue] || 0) + points,
        },
      };
      updatePeserta(updated);
      setPoints(0); // reset input
    }
  };

  // Edit/mindahin koin
  const editBid = (value) => {
    if (!selectedPlayer || !selectedPlayer.bids[value]) return;

    const refundedPoints = selectedPlayer.bids[value];
    const updated = {
      ...selectedPlayer,
      coins: selectedPlayer.coins + refundedPoints,
    };
    const newBids = { ...updated.bids };
    delete newBids[value];
    updated.bids = newBids;

    updatePeserta(updated);

    // set ulang input supaya bisa taruh lagi
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
          <h2>
            Pemain: {selectedPlayer.name} ({selectedPlayer.coins} koin tersisa)
          </h2>

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
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
          />
          <button onClick={placeBid}>Taruh Koin</button>

          {/* Daftar taruhannya */}
          <h3>Taruhan Kamu:</h3>
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
            <strong>{p.name}</strong> ({p.age} th) - {p.coins} koin
            <ul>
              {Object.entries(p.bids || {}).map(([val, pts]) => (
                <li key={val}>
                  {val} : {pts} koin
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
