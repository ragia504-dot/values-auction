// App.js
import React, { useState, useEffect } from "react";
import { simpanPeserta, ambilPeserta } from "./db";

const daftarNilai = [
  "Kejujuran",
  "Kerja Keras",
  "Kreativitas",
  "Tanggung Jawab",
  "Disiplin",
  "Kerjasama",
  "Empati",
  "Keadilan",
  "Keberanian",
  "Kebijaksanaan",
];

function App() {
  const [peserta, setPeserta] = useState([]);
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [pilihan, setPilihan] = useState({});
  const [totalKoin, setTotalKoin] = useState(100);

  useEffect(() => {
    ambilPeserta((data) => setPeserta(data));
  }, []);

  // Toggle pilih nilai
  const pilihNilai = (nilai) => {
    const sudahDipilih = Object.keys(pilihan);
    if (pilihan[nilai]) {
      // kalau klik lagi → hapus nilai
      const copy = { ...pilihan };
      setTotalKoin(totalKoin + copy[nilai]);
      delete copy[nilai];
      setPilihan(copy);
    } else {
      if (sudahDipilih.length >= 5) {
        alert("Hanya boleh pilih maksimal 5 nilai!");
        return;
      }
      setPilihan({ ...pilihan, [nilai]: 0 });
    }
  };

  // Atur jumlah koin untuk nilai tertentu
  const aturKoin = (nilai, jumlah) => {
    jumlah = parseInt(jumlah) || 0;
    const sisaKoin = 100 - (Object.values(pilihan).reduce((a, b) => a + b, 0) - (pilihan[nilai] || 0));
    if (jumlah > sisaKoin) {
      alert("Koin tidak cukup");
      return;
    }
    setPilihan({ ...pilihan, [nilai]: jumlah });
    setTotalKoin(100 - (Object.values({ ...pilihan, [nilai]: jumlah }).reduce((a, b) => a + b, 0)));
  };

  const tambahPeserta = () => {
    if (!nama || !umur) {
      alert("Isi nama dan umur dulu");
      return;
    }
    if (Object.keys(pilihan).length !== 5) {
      alert("Harus pilih tepat 5 nilai!");
      return;
    }
    if (totalKoin !== 0) {
      alert("Semua 100 koin harus dihabiskan");
      return;
    }

    simpanPeserta({
      nama,
      umur,
      pilihan,
    });

    setNama("");
    setUmur("");
    setPilihan({});
    setTotalKoin(100);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Values Auction</h1>

      {/* Form Tambah Peserta */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold mb-2">Tambah Peserta</h2>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Umur"
          value={umur}
          onChange={(e) => setUmur(e.target.value)}
          className="border p-2 mr-2"
        />

        <div className="grid grid-cols-2 gap-2 mt-4">
          {daftarNilai.map((n) => (
            <div key={n} className="flex items-center">
              <input
                type="checkbox"
                checked={pilihan[n] !== undefined}
                onChange={() => pilihNilai(n)}
                className="mr-2"
              />
              <label className="w-32">{n}</label>
              {pilihan[n] !== undefined && (
                <input
                  type="number"
                  min="0"
                  value={pilihan[n]}
                  onChange={(e) => aturKoin(n, e.target.value)}
                  className="border p-1 w-20"
                />
              )}
            </div>
          ))}
        </div>

        <p className="mt-2">
          Sisa koin: <b>{totalKoin}</b> / 100
        </p>

        <button
          onClick={tambahPeserta}
          className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
        >
          Simpan
        </button>
      </div>

      {/* Daftar Peserta */}
      <h2 className="font-semibold mb-2">Daftar Peserta</h2>
      {peserta.map((p) => (
        <div key={p.id} className="border p-3 mb-2 rounded">
          <p>
            <b>{p.nama}</b> (Umur: {p.umur})
          </p>
          <ul className="ml-4">
            {Object.entries(p.pilihan || {}).map(
              ([nilai, jumlah]) =>
                jumlah > 0 && (
                  <li key={nilai}>
                    {nilai}: {jumlah}
                  </li>
                )
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
