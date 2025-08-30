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

  // Tambah peserta
  const addPlayer = () => {
    if (!name || !age) return;
    const newPlayer = {
      name,
      age,
      balance: 100,
      allocations: Object.fromEntries(initialValues.map((v) => [v, 0])),
    };
    simpanPeserta(newPlayer);
    setName("");
    setAge("");
  };

  // Alokasikan poin
  const allocatePoints = () => {
    if (!selectedPlayer || points <= 0) return;
    const player = players.find((p) => p.id === selectedPlayer);
    if (!player || player.balance < points) return;

    const updated = {
      ...player,
      balance: player.balance - points,
      allocations: {
        ...player.allocations,
        [selectedValue]: player.allocations[selectedValue] + points,
      },
    };

    updatePeserta(selectedPlayer, updated);
    setPoints(0);
  };

  // Hapus peserta
  const deletePlayer = (id) => {
    hapusPeserta(id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Form Tambah Peserta */}
      <div className="p-4 border rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-2">Tambah Peserta</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="cth: Adit"
            className="border p-2 rounded w-1/3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="cth: 21"
            className="border p-2 rounded w-1/4"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <button
            onClick={addPlayer}
            className="bg-black text-white px-4 rounded"
          >
            + Tambah
          </button>
        </div>
        <p className="text-xs mt-2">
          Setiap peserta otomatis mendapat 100 poin.
        </p>
      </div>

      {/* Form Alokasi Poin */}
      <div className="p-4 border rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-2">Alokasikan Poin</h2>
        <div className="flex gap-2 items-center">
          <select
            className="border p-2 rounded"
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            <option value="">Pilih Peserta</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Sisa: {p.balance})
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {initialValues.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2 rounded w-24"
            placeholder="Poin"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />

          <button
            onClick={allocatePoints}
            className="bg-green-600 text-white px-4 rounded"
          >
            Alokasikan
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-4 border rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-bold mb-2">
          Dashboard Alokasi (Leaderboard)
        </h2>
        <table className="table-auto border-collapse border w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nama</th>
              <th className="border p-2">Umur</th>
              <th className="border p-2">Sisa</th>
              {initialValues.map((v) => (
                <th key={v} className="border p-2">
                  {v}
                </th>
              ))}
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.age}</td>
                <td className="border p-2">{p.balance}</td>
                {initialValues.map((v) => (
                  <td key={v} className="border p-2">
                    {p.allocations?.[v] || 0}
                  </td>
                ))}
                <td className="border p-2 text-center">
                  <button
                    onClick={() => deletePlayer(p.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
