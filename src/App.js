import React, { useState, useEffect } from "react";
import { simpanPeserta, ambilPeserta, updatePeserta, hapusPeserta } from "./db";

export default function ValuesAuctionGame() {
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

  // Tambah pemain
  const addPlayer = () => {
    if (!name || !age) return;
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

  // Update coins peserta
  const updateCoins = (id, newCoins) => {
    updatePeserta(id, { coins: newCoins }).catch((err) => console.error(err));
  };

  // Hapus peserta
  const deletePlayer = (id) => {
    hapusPeserta(id).catch((err) => console.error(err));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tambah Peserta */}
      <div className="p-4 rounded-2xl shadow bg-white">
        <h2 className="text-xl font-bold mb-2">Tambah Peserta</h2>
        <input 
          className="border p-2 mr-2 rounded" 
          placeholder="Nama" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <input 
          className="border p-2 mr-2 rounded" 
          placeholder="Umur" 
          value={age} 
          onChange={e => setAge(e.target.value)} 
        />
        <button onClick={addPlayer} className="px-4 py-2 bg-black text-white rounded">+ Tambah</button>
        <p className="text-sm text-gray-500 mt-2">Setiap peserta otomatis mendapatkan 100 poin.</p>
      </div>

      {/* Alokasi Poin */}
      <div className="p-4 rounded-2xl shadow bg-white">
        <h2 className="text-xl font-bold mb-2">Alokasikan Poin</h2>
        <select 
          className="border p-2 rounded mr-2"
          value={selectedPlayer || ""}
          onChange={e => setSelectedPlayer(Number(e.target.value))}
        >
          <option value="">Pilih Peserta</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.name} (Sisa: {p.coins})</option>
          ))}
        </select>

        <select 
          className="border p-2 rounded mr-2"
          value={selectedValue}
          onChange={e => setSelectedValue(e.target.value)}
        >
          {values.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <input 
          type="number" 
          className="border p-2 rounded mr-2 w-24" 
          placeholder="Poin"
          value={point}
          onChange={e => setPoint(Number(e.target.value))}
        />

        <button onClick={allocatePoints} className="px-4 py-2 bg-green-600 text-white rounded">
          Alokasikan
        </button>
      </div>

      {/* Dashboard */}
      <div className="p-4 rounded-2xl shadow bg-white overflow-x-auto">
        <h2 className="text-xl font-bold mb-2">Dashboard Alokasi (Leaderboard)</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nama</th>
              <th className="border p-2">Umur</th>
              <th className="border p-2">Sisa Poin</th>
              {values.map(v => (
                <th key={v} className="border p-2">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.age}</td>
                <td className="border p-2">{p.coins}</td>
                {values.map(v => (
                  <td key={v} className="border p-2">{p.allocations[v]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
