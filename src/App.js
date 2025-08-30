// App.js
import React, { useState, useEffect } from "react";
import { simpanPeserta, ambilPeserta } from "./db";

function App() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [peserta, setPeserta] = useState([]);

  // Ambil data realtime
  useEffect(() => {
    ambilPeserta((list) => {
      setPeserta(list);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama || !email) return alert("Isi semua field!");
    simpanPeserta({ nama, email });
    setNama("");
    setEmail("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Form Pendaftaran Peserta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Daftar</button>
      </form>

      <h3>Daftar Peserta</h3>
      <ul>
        {peserta.map((p) => (
          <li key={p.id}>
            {p.nama} - {p.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
