import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  simpanPeserta,
  ambilPeserta,
  updatePeserta,
  hapusPeserta,
} from "./db";

const initialValues = [
  "Keluarga", "Kesehatan", "Uang", "Kebebasan", "Karier",
  "Petualangan", "Pendidikan", "Ketenangan", "Persahabatan", "Kreativitas",
];

export default function ValuesAuctionGame() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedValue, setSelectedValue] = useState(initialValues[0]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    ambilPeserta((list) => setPlayers(list));
  }, []);

  const addPlayer = () => {
    if (!name || !age) return;
    const newPlayer = { name, age, balance: 100, allocations: {} };
    const id = simpanPeserta(newPlayer);
    setCurrentPlayer(id);
    setName(""); setAge("");
  };

  const allocatePoints = () => {
    if (!currentPlayer || points <= 0) return;
    const player = players.find((p) => p.id === currentPlayer);
    if (!player || player.balance < points) return;

    const currentAlloc = player.allocations || {};
    const chosenValues = Object.keys(currentAlloc);
    if (!currentAlloc[selectedValue] && chosenValues.length >= 5) {
      alert("Maksimal hanya boleh memilih 5 value!");
      return;
    }

    const updatedAlloc = { ...currentAlloc, [selectedValue]: points };
    const totalAllocated = Object.values(updatedAlloc).reduce((a, b) => a + b, 0);
    const updated = { ...player, balance: 100 - totalAllocated, allocations: updatedAlloc };

    updatePeserta(currentPlayer, updated);
    setPoints(0); setSelectedValue(initialValues[0]);
  };

  const deletePlayer = (id) => {
    hapusPeserta(id);
    if (id === currentPlayer) setCurrentPlayer(null);
  };

  const sortAllocations = (alloc) =>
    Object.entries(alloc || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-50 p-6">
      <h1 className="text-4xl font-extrabold text-center text-green-700 mb-8 drop-shadow-md">
        Values Auction Game
      </h1>

      {/* Tambah Peserta */}
      {!currentPlayer && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Tambah Peserta</h2>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Nama"
              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Umur"
              className="border p-2 rounded-lg w-24 focus:ring-2 focus:ring-green-400"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <button
              onClick={addPlayer}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg shadow-md font-semibold"
            >
              + Tambah
            </button>
          </div>
          <p className="text-xs text-gray-500">Setiap peserta otomatis mendapat 100 poin.</p>
        </motion.div>
      )}

      {/* Form Alokasi Poin */}
      {currentPlayer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Alokasikan Poin untuk {players.find(p => p.id === currentPlayer)?.name}
          </h2>
          <div className="flex gap-3 items-center">
            <select
              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              {initialValues.map((v) => (<option key={v}>{v}</option>))}
            </select>
            <input
              type="number"
              min="1"
              className="border p-2 rounded-lg w-24 focus:ring-2 focus:ring-blue-400"
              placeholder="Poin"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
            <button
              onClick={allocatePoints}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg shadow-md font-semibold"
            >
              Simpan
            </button>
          </div>
        </motion.div>
      )}

      {/* Preview Peserta */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-green-200 to-blue-200">
            <tr>
              <th className="p-3 text-left text-gray-700 font-semibold">Nama</th>
              <th className="p-3 text-left text-gray-700 font-semibold">Umur</th>
              <th className="p-3 text-left text-gray-700 font-semibold">Sisa Koin</th>
              <th className="p-3 text-left text-gray-700 font-semibold">Pilihan (max 5)</th>
              <th className="p-3 text-center text-gray-700 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {players.map((p) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="border-b"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.age}</td>
                  <td className="p-3">{p.balance}</td>
                  <td className="p-3">
                    {(!p.allocations || Object.keys(p.allocations).length === 0) ? (
                      <span className="text-gray-400 italic">Belum ada</span>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        {sortAllocations(p.allocations).map(([val, pts]) => (
                          <li key={val}>{val} → <b>{pts} poin</b></li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deletePlayer(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                    >
                      Hapus
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
